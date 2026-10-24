import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createInfinitePayLink } from "@/lib/infinitepay.server";

export interface PlanItem {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  sessions_count?: number | null;
  description?: string | null;
  type: "studio" | "pt";
}

export interface StudentPlansResponse {
  mode: "studio" | "pt" | "both";
  studentId: string | null;
  ptStudentId: string | null;
  currentPlan: {
    id: string;
    name: string;
    price: number;
    billing_cycle: string;
    type: "studio" | "pt";
  } | null;
  studioPlans: PlanItem[];
  ptPlans: PlanItem[];
}

/**
 * Busca de forma segura no servidor os planos disponíveis para o aluno logado,
 * respeitando se ele é aluno de Studio, Personal Trainer ou Híbrido.
 */
export const getMyAvailablePlans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StudentPlansResponse> => {
    const { userId } = context;

    // 1. Identificar se é aluno Studio e/ou PT
    const [studioRes, ptRes] = await Promise.all([
      supabaseAdmin
        .from("students")
        .select("id, user_id, name, email, phone")
        .eq("account_user_id", userId)
        .is("deleted_at", null)
        .maybeSingle(),
      supabaseAdmin
        .from("pt_students")
        .select("id, user_id, name, email, phone, training_plan")
        .eq("account_user_id", userId)
        .is("deleted_at", null)
        .maybeSingle(),
    ]);

    const studioStudent = studioRes.data;
    const ptStudent = ptRes.data;

    let mode: "studio" | "pt" | "both" = "studio";
    if (studioStudent && ptStudent) {
      mode = "both";
    } else if (ptStudent) {
      mode = "pt";
    }

    const educatorUserId = studioStudent?.user_id || ptStudent?.user_id;

    // 2. Buscar planos do Studio (se aplicável)
    let studioPlans: PlanItem[] = [];
    let currentPlan: StudentPlansResponse["currentPlan"] = null;

    if (studioStudent) {
      let q = supabaseAdmin
        .from("plans")
        .select("id, name, price, billing_cycle, checkin_quota_amount, description, is_active")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (studioStudent.user_id) {
        q = q.eq("user_id", studioStudent.user_id);
      }

      const { data: plansData } = await q;
      studioPlans = (plansData || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        billing_cycle: p.billing_cycle || "monthly",
        sessions_count: p.checkin_quota_amount,
        description: p.description,
        type: "studio",
      }));

      // Buscar plano atual do Studio
      const { data: history } = await supabaseAdmin
        .from("student_plan_history")
        .select("plan_id, plans(id, name, price, billing_cycle)")
        .eq("student_id", studioStudent.id)
        .eq("is_current", true)
        .maybeSingle();

      if (history?.plans) {
        const p = history.plans as any;
        currentPlan = {
          id: p.id,
          name: p.name,
          price: Number(p.price),
          billing_cycle: p.billing_cycle || "monthly",
          type: "studio",
        };
      }
    }

    // 3. Buscar planos de Personal Trainer (se aplicável)
    let ptPlans: PlanItem[] = [];
    if (ptStudent) {
      let qPt = supabaseAdmin
        .from("pt_plans")
        .select("id, name, price_per_month, package_price, billing_type, sessions_per_month, package_sessions, description, is_active")
        .eq("is_active", true)
        .order("price_per_month", { ascending: true });

      if (ptStudent.user_id) {
        qPt = qPt.eq("user_id", ptStudent.user_id);
      }

      const { data: ptPlansData } = await qPt;
      ptPlans = (ptPlansData || []).map((p) => {
        const price = Number(p.billing_type === "package" ? p.package_price : p.price_per_month || p.package_price || 0);
        const cycle = p.billing_type === "package" ? "pacote" : "monthly";
        const sessions = p.sessions_per_month || p.package_sessions || null;
        return {
          id: p.id,
          name: p.name,
          price,
          billing_cycle: cycle,
          sessions_count: sessions,
          description: p.description,
          type: "pt" as const,
        };
      });

      // Se não tinha plano do studio, verificar se tem plano de PT ativo
      if (!currentPlan && ptStudent.training_plan) {
        const matchingPlan = ptPlans.find((p) => p.name.toLowerCase() === ptStudent.training_plan?.toLowerCase());
        if (matchingPlan) {
          currentPlan = {
            id: matchingPlan.id,
            name: matchingPlan.name,
            price: matchingPlan.price,
            billing_cycle: matchingPlan.billing_cycle,
            type: "pt",
          };
        }
      }
    }

    return {
      mode,
      studentId: studioStudent?.id ?? null,
      ptStudentId: ptStudent?.id ?? null,
      currentPlan,
      studioPlans,
      ptPlans,
    };
  });

/**
 * Criação da intenção de pagamento / Checkout InfinitePay para Studio ou Personal
 */
export const createPlanCheckoutOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      studentId: z.string().uuid(),
      planId: z.string().uuid(),
      planType: z.enum(["studio", "pt"]).default("studio"),
    })
  )
  .handler(async ({ data }) => {
    let planPrice = 0;
    let planName = "";
    let billingCycle = "monthly";
    let userId = "";
    let studentName = "";
    let studentEmail = "";
    let studentPhone = "";

    if (data.planType === "pt") {
      // 1. Obter plano e aluno de Personal
      const { data: plan, error: planErr } = await supabaseAdmin
        .from("pt_plans")
        .select("id, name, price, billing_cycle, user_id")
        .eq("id", data.planId)
        .single();

      if (planErr || !plan) throw new Error("Plano de Personal não encontrado.");

      const { data: student, error: studentErr } = await supabaseAdmin
        .from("pt_students")
        .select("id, name, email, phone")
        .eq("id", data.studentId)
        .single();

      if (studentErr || !student) throw new Error("Aluno de Personal não encontrado.");

      planPrice = Number(plan.price);
      planName = plan.name;
      billingCycle = plan.billing_cycle;
      userId = plan.user_id;
      studentName = student.name;
      studentEmail = student.email || "";
      studentPhone = student.phone || "";
    } else {
      // 1. Obter plano e aluno de Studio
      const { data: plan, error: planErr } = await supabaseAdmin
        .from("plans")
        .select("id, name, price, billing_cycle, user_id")
        .eq("id", data.planId)
        .single();

      if (planErr || !plan) throw new Error("Plano de Studio não encontrado.");

      const { data: student, error: studentErr } = await supabaseAdmin
        .from("students")
        .select("id, name, email, phone")
        .eq("id", data.studentId)
        .single();

      if (studentErr || !student) throw new Error("Aluno de Studio não encontrado.");

      planPrice = Number(plan.price);
      planName = plan.name;
      billingCycle = plan.billing_cycle;
      userId = plan.user_id;
      studentName = student.name;
      studentEmail = student.email || "";
      studentPhone = student.phone || "";
    }

    const orderNsu = `MPS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const amountInCents = Math.round(planPrice * 100);

    // 2. Criar link na InfinitePay
    let checkoutUrl = "";
    try {
      const infinitePayRes = await createInfinitePayLink({
        orderNsu,
        amountInCents,
        planName,
        customerName: studentName,
        customerEmail: studentEmail || undefined,
        customerPhone: studentPhone || undefined,
      });
      checkoutUrl = infinitePayRes.url;
    } catch (err: any) {
      console.error("[InfinitePay Checkout] Erro ao gerar link:", err);
      checkoutUrl = "";
    }

    // 3. Salvar pedido na tabela payment_orders
    const insertPayload: any = {
      order_nsu: orderNsu,
      user_id: userId,
      plan_type: data.planType,
      amount: planPrice,
      payment_method: "infinitepay",
      status: "pending",
      checkout_url: checkoutUrl || null,
      metadata: {
        plan_name: planName,
        billing_cycle: billingCycle,
        student_name: studentName,
      },
    };

    if (data.planType === "pt") {
      insertPayload.pt_student_id = data.studentId;
      insertPayload.pt_plan_id = data.planId;
    } else {
      insertPayload.student_id = data.studentId;
      insertPayload.plan_id = data.planId;
    }

    const { error: insErr } = await supabaseAdmin.from("payment_orders").insert(insertPayload);
    if (insErr) {
      console.error("[InfinitePay Checkout] Erro ao gravar order:", insErr);
      throw new Error("Não foi possível salvar o pedido de pagamento.");
    }

    return {
      orderNsu,
      checkoutUrl,
      amount: planPrice,
      planName,
    };
  });

export const registerDirectCashPayment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      studentId: z.string().uuid(),
      planId: z.string().uuid(),
      amount: z.number().positive(),
      planType: z.enum(["studio", "pt"]).default("studio"),
      notes: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { data: res, error } = await supabaseAdmin.rpc("apply_plan_migration_and_payment", {
      p_student_id: data.studentId,
      p_plan_id: data.planId,
      p_amount: data.amount,
      p_payment_method: "cash",
      p_order_nsu: null,
      p_plan_type: data.planType,
    });

    if (error) {
      throw new Error(`Erro ao registrar pagamento em dinheiro: ${error.message}`);
    }

    return res;
  });
