import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createInfinitePayLink } from "@/lib/infinitepay.server";

export const createPlanCheckoutOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      studentId: z.string().uuid(),
      planId: z.string().uuid(),
    })
  )
  .handler(async ({ data }) => {
    // 1. Obter dados do plano e do aluno
    const { data: plan, error: planErr } = await supabaseAdmin
      .from("plans")
      .select("id, name, price, billing_cycle, user_id")
      .eq("id", data.planId)
      .single();

    if (planErr || !plan) {
      throw new Error("Plano não encontrado.");
    }

    const { data: student, error: studentErr } = await supabaseAdmin
      .from("students")
      .select("id, name, email, phone")
      .eq("id", data.studentId)
      .single();

    if (studentErr || !student) {
      throw new Error("Aluno não encontrado.");
    }

    // 2. Gerar NSU único para rastreamento
    const orderNsu = `MPS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const amountInCents = Math.round(Number(plan.price) * 100);

    // 3. Criar link na InfinitePay
    let checkoutUrl = "";
    try {
      const infinitePayRes = await createInfinitePayLink({
        orderNsu,
        amountInCents,
        planName: plan.name,
        customerName: student.name,
        customerEmail: student.email || undefined,
        customerPhone: student.phone || undefined,
      });
      checkoutUrl = infinitePayRes.url;
    } catch (err: any) {
      console.error("[InfinitePay Checkout] Erro ao gerar link:", err);
      // Fallback: se a API Key ainda não estiver configurada no .env, registra o pedido
      checkoutUrl = "";
    }

    // 4. Salvar pedido na tabela payment_orders
    const { error: insErr } = await supabaseAdmin.from("payment_orders").insert({
      order_nsu: orderNsu,
      user_id: plan.user_id,
      student_id: data.studentId,
      plan_id: data.planId,
      amount: plan.price,
      payment_method: "infinitepay",
      status: "pending",
      checkout_url: checkoutUrl || null,
      metadata: {
        plan_name: plan.name,
        billing_cycle: plan.billing_cycle,
        student_name: student.name,
      },
    });

    if (insErr) {
      console.error("[InfinitePay Checkout] Erro ao gravar order:", insErr);
      throw new Error("Não foi possível salvar o pedido de pagamento.");
    }

    return {
      orderNsu,
      checkoutUrl,
      amount: plan.price,
      planName: plan.name,
    };
  });

export const registerDirectCashPayment = createServerFn({ method: "POST" })
  .validator(
    z.object({
      studentId: z.string().uuid(),
      planId: z.string().uuid(),
      amount: z.number().positive(),
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
    });

    if (error) {
      throw new Error(`Erro ao registrar pagamento em dinheiro: ${error.message}`);
    }

    return res;
  });
