import { useState } from "react";
import { Download, Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, Layers, Database } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentMethodLabel, billingCycleLabel } from "@/lib/format";
import { PerStudentExport } from "@/components/edufinance/PerStudentExport";

// Map a raw header string to a canonical field.
const headerMap: Record<string, string> = {
  // students (Studio)
  nome: "name", name: "name",
  email: "email",
  telefone: "phone", phone: "phone",
  status: "status",
  notas: "notes", notes: "notes",
  plano: "plan_name", plan: "plan_name", plan_name: "plan_name",
  inicio: "start_date", start_date: "start_date",
  cpf: "cpf", rg: "rg",
  nascimento: "birth_date", data_nascimento: "birth_date", birth_date: "birth_date",
  endereco: "address", address: "address",
  bairro: "neighborhood", neighborhood: "neighborhood",
  cidade: "city", city: "city",
  estado: "state", uf: "state", state: "state",
  cep: "postal_code", codigo_postal: "postal_code", postal_code: "postal_code",
  pais: "country", country: "country",

  // pt_students (Personal Trainer)
  objetivo: "goal", goal: "goal",
  saude: "health_notes", notas_saude: "health_notes", health_notes: "health_notes",
  plano_treino: "training_plan", training_plan: "training_plan",

  // payments & pt_payments
  aluno: "student_name", student_name: "student_name",
  valor: "amount", amount: "amount",
  data: "payment_date", data_pagamento: "payment_date", payment_date: "payment_date",
  vencimento: "due_date", due_date: "due_date",
  mes_ref: "reference_month", mes_referencia: "reference_month", reference_month: "reference_month",
  metodo: "payment_method", forma_pagamento: "payment_method", payment_method: "payment_method",
  sessoes_pagas: "sessions_paid", sessions_paid: "sessions_paid",

  // plans & pt_plans
  nome_plano: "name", plan_price: "price", preco: "price", price: "price",
  ciclo: "billing_cycle", billing_cycle: "billing_cycle", ciclo_cobranca: "billing_cycle",
  descricao: "description", description: "description",
  ativo: "is_active", is_active: "is_active",
  tipo_cobranca: "billing_type", billing_type: "billing_type",
  preco_mensal: "price_per_month", price_per_month: "price_per_month",
  preco_sessao: "price_per_session", price_per_session: "price_per_session",
  preco_pacote: "package_price", package_price: "package_price",
  sessoes_pacote: "package_sessions", package_sessions: "package_sessions",
  sessoes_mes: "sessions_per_month", sessions_per_month: "sessions_per_month",
};

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, "_");

function parseDate(v: unknown): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v).trim();
  // DD/MM/YYYY
  const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (br) {
    let y = Number(br[3]);
    if (y < 100) y += 2000;
    return `${y}-${br[2].padStart(2, "0")}-${br[1].padStart(2, "0")}`;
  }
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  // Excel serial
  if (/^\d+(\.\d+)?$/.test(s)) {
    const num = Number(s);
    if (num > 0) {
      const date = new Date(Math.round((num - 25569) * 86400 * 1000));
      if (!isNaN(date.getTime())) {
        return date.toISOString().slice(0, 10);
      }
    }
  }
  return null;
}

function parseMonth(v: unknown): string | null {
  if (!v) return null;
  const s = String(v).trim();
  // MM/YYYY
  const m = s.match(/^(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[2]}-${m[1].padStart(2, "0")}`;
  // YYYY-MM
  if (/^\d{4}-\d{2}$/.test(s)) return s;
  // YYYY-MM-DD -> YYYY-MM
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 7);
  return null;
}

const methodMap: Record<string, string> = {
  pix: "pix", "cartao_de_credito": "credit_card", "credito": "credit_card",
  "cartao_de_debito": "debit_card", "debito": "debit_card",
  boleto: "bank_slip", dinheiro: "cash", transferencia: "transfer",
};
const statusMap: Record<string, string> = {
  pago: "paid", pendente: "pending", atrasado: "overdue", cancelado: "cancelled",
  ativo: "active", congelado: "paused", trancado: "paused", inativo: "inactive",
};
const billingCycleMap: Record<string, string> = {
  mensal: "monthly", monthly: "monthly",
  trimestral: "quarterly", quarterly: "quarterly",
  semestral: "semiannual", semiannual: "semiannual",
  anual: "annual", annual: "annual",
};

export type ImportCategory =
  | "payments"
  | "students"
  | "plans"
  | "pt_students"
  | "pt_payments"
  | "pt_plans"
  | "full_report";

interface FullReportData {
  payments?: Record<string, unknown>[];
  students?: Record<string, unknown>[];
  plans?: Record<string, unknown>[];
  pt_students?: Record<string, unknown>[];
  pt_payments?: Record<string, unknown>[];
  pt_plans?: Record<string, unknown>[];
}

export function DataTransferPanel() {
  const qc = useQueryClient();
  const [importType, setImportType] = useState<ImportCategory>("payments");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [fullReportData, setFullReportData] = useState<FullReportData | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [imported, setImported] = useState<number | null>(null);

  // Queries para exportação / autocriação de vínculos
  const { data: students = [] } = useQuery({
    queryKey: ["students-all"],
    queryFn: async () => {
      let all: any[] = [];
      let from = 0;
      let pages = 0;
      while (pages < 20) {
        pages++;
        const { data, error } = await supabase
          .from("students")
          .select("id,name,email,phone,status,notes,cpf,rg,birth_date,address,neighborhood,city,state,postal_code,country,start_date,created_at")
          .is("deleted_at", null)
          .order("name")
          .range(from, from + 999);
        if (error) break;
        all = all.concat(data ?? []);
        if (!data || data.length < 1000) break;
        from += 1000;
      }
      return all;
    },
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["plans-all"],
    queryFn: async () => {
      const { data } = await supabase.from("plans").select("id,name,price,billing_cycle,description,is_active");
      return data ?? [];
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["payments-export"],
    queryFn: async () => {
      let all: any[] = [];
      let from = 0;
      let pages = 0;
      while (pages < 20) {
        pages++;
        const { data, error } = await supabase
          .from("payments")
          .select("amount,payment_date,due_date,reference_month,payment_method,status,notes,students!payments_student_id_fkey(name),plans(name)")
          .is("deleted_at", null)
          .order("payment_date", { ascending: false })
          .range(from, from + 999);
        if (error) break;
        all = all.concat(data ?? []);
        if (!data || data.length < 1000) break;
        from += 1000;
      }
      return all;
    },
  });

  const { data: ptStudents = [] } = useQuery({
    queryKey: ["pt-students-all"],
    queryFn: async () => {
      let all: any[] = [];
      let from = 0;
      let pages = 0;
      while (pages < 20) {
        pages++;
        const { data, error } = await supabase
          .from("pt_students")
          .select("id,name,email,phone,status,notes,goal,health_notes,training_plan,birth_date,start_date,created_at")
          .is("deleted_at", null)
          .order("name")
          .range(from, from + 999);
        if (error) break;
        all = all.concat(data ?? []);
        if (!data || data.length < 1000) break;
        from += 1000;
      }
      return all;
    },
  });

  const { data: ptPlans = [] } = useQuery({
    queryKey: ["pt-plans-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_plans")
        .select("id,name,description,billing_type,price_per_month,price_per_session,package_price,package_sessions,sessions_per_month,is_active");
      return data ?? [];
    },
  });

  const { data: ptPayments = [] } = useQuery({
    queryKey: ["pt-payments-export"],
    queryFn: async () => {
      let all: any[] = [];
      let from = 0;
      let pages = 0;
      while (pages < 20) {
        pages++;
        const { data, error } = await supabase
          .from("pt_payments")
          .select("amount,payment_date,due_date,reference_month,payment_method,status,sessions_paid,notes,pt_students!pt_payments_pt_student_id_fkey(name),pt_plans(name)")
          .is("deleted_at", null)
          .order("payment_date", { ascending: false })
          .range(from, from + 999);
        if (error) break;
        all = all.concat(data ?? []);
        if (!data || data.length < 1000) break;
        from += 1000;
      }
      return all;
    },
  });

  const mapRawRows = (rawRows: Record<string, unknown>[]) => {
    return rawRows.map((row) => {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row)) {
        const key = headerMap[norm(k)] ?? norm(k);
        out[key] = v;
      }
      return out;
    });
  };

  async function handleFile(file: File) {
    const XLSX = await import("xlsx");
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });

      if (importType === "full_report") {
        // Multi-sheet import (Backup Completo)
        const parsedReport: FullReportData = {};
        for (const sheetName of wb.SheetNames) {
          const normName = norm(sheetName);
          const ws = wb.Sheets[sheetName];
          const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: null });
          const mapped = mapRawRows(raw);

          if (normName.includes("pagamento") && normName.includes("pt")) {
            parsedReport.pt_payments = mapped;
          } else if (normName.includes("plano") && normName.includes("pt")) {
            parsedReport.pt_plans = mapped;
          } else if (normName.includes("aluno") && normName.includes("pt")) {
            parsedReport.pt_students = mapped;
          } else if (normName.includes("pagamento")) {
            parsedReport.payments = mapped;
          } else if (normName.includes("plano")) {
            parsedReport.plans = mapped;
          } else if (normName.includes("aluno")) {
            parsedReport.students = mapped;
          }
        }

        const matchedSheets = Object.keys(parsedReport);
        if (matchedSheets.length === 0) {
          setErrors([
            `Nenhuma aba reconhecida para o Backup Completo. Abas encontradas: ${wb.SheetNames.join(
              ", "
            )}. Utilize abas com termos como: 'Alunos', 'Pagamentos', 'Planos'.`,
          ]);
          setFullReportData(null);
          setRows([]);
          return;
        }

        setFullReportData(parsedReport);
        setRows([]);
      } else {
        // Single category import - always respect the chosen importType even if workbook has multiple sheets
        let targetSheetName = wb.SheetNames[0];
        const categorySheetMatch = wb.SheetNames.find((sName) => {
          const n = norm(sName);
          if (importType === "pt_payments") return n.includes("pagamento") && n.includes("pt");
          if (importType === "pt_plans") return n.includes("plano") && n.includes("pt");
          if (importType === "pt_students") return n.includes("aluno") && n.includes("pt");
          if (importType === "payments") return n.includes("pagamento") && !n.includes("pt");
          if (importType === "plans") return n.includes("plano") && !n.includes("pt");
          if (importType === "students") return n.includes("aluno") && !n.includes("pt");
          return false;
        });
        if (categorySheetMatch) {
          targetSheetName = categorySheetMatch;
        }

        const ws = wb.Sheets[targetSheetName];
        const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: null });
        setRows(mapRawRows(raw));
        setFullReportData(null);
      }
      setErrors([]);
      setImported(null);
    };
    reader.readAsArrayBuffer(file);
  }

  // Import block helpers
  async function importPlansRows(userId: string, targetRows: Record<string, unknown>[], errs: string[]) {
    let ok = 0;
    const { data: existingPlans } = await supabase
      .from("plans")
      .select("id, name")
      .eq("user_id", userId)
      .is("deleted_at", null);

    const planMap = new Map<string, string>();
    for (const p of existingPlans ?? []) {
      if (p.name) planMap.set(norm(p.name), p.id);
    }

    for (let i = 0; i < targetRows.length; i++) {
      const r = targetRows[i];
      if (!r.name) { errs.push(`Planos [Linha ${i + 2}]: nome do plano ausente`); continue; }
      const price = Number(r.price);
      if (isNaN(price)) { errs.push(`Planos [Linha ${i + 2}]: preço inválido`); continue; }
      const cycleRaw = r.billing_cycle ? norm(String(r.billing_cycle)) : "monthly";
      const billing_cycle = billingCycleMap[cycleRaw] ?? "monthly";
      const isActiveRaw = r.is_active;
      const is_active = isActiveRaw === undefined || isActiveRaw === null
        ? true
        : ["true", "1", "sim", "ativo", true, 1].includes(
            typeof isActiveRaw === "string" ? isActiveRaw.toLowerCase() : isActiveRaw as never
          );

      const rawName = String(r.name).trim();
      const planPayload = {
        name: rawName,
        price,
        billing_cycle,
        description: r.description ? String(r.description) : null,
        is_active,
      };

      const existingId = planMap.get(norm(rawName));
      if (existingId) {
        const { error } = await supabase.from("plans").update(planPayload).eq("id", existingId);
        if (error) errs.push(`Planos [Linha ${i + 2}]: ${error.message}`); else ok++;
      } else {
        const { data: newPlan, error } = await supabase.from("plans").insert({
          user_id: userId,
          ...planPayload,
        }).select("id").single();
        if (error) {
          errs.push(`Planos [Linha ${i + 2}]: ${error.message}`);
        } else if (newPlan) {
          planMap.set(norm(rawName), newPlan.id);
          ok++;
        }
      }
    }
    return ok;
  }

  async function importStudentsRows(userId: string, targetRows: Record<string, unknown>[], errs: string[]) {
    let ok = 0;
    const { data: existingStudents } = await supabase
      .from("students")
      .select("id, name, email, cpf")
      .eq("user_id", userId)
      .is("deleted_at", null);

    const studentMap = new Map<string, string>(); // norm(name) -> id
    const emailMap = new Map<string, string>();   // norm(email) -> id
    const cpfMap = new Map<string, string>();     // digits-only cpf -> id

    for (const s of existingStudents ?? []) {
      if (s.name) studentMap.set(norm(s.name), s.id);
      if (s.email) emailMap.set(norm(s.email), s.id);
      if (s.cpf) {
        const cleanCpf = String(s.cpf).replace(/\D/g, "");
        if (cleanCpf) cpfMap.set(cleanCpf, s.id);
      }
    }

    for (let i = 0; i < targetRows.length; i++) {
      const r = targetRows[i];
      if (!r.name) { errs.push(`Alunos [Linha ${i + 2}]: nome ausente`); continue; }

      const rawName = String(r.name).trim();
      const normName = norm(rawName);
      const rawEmail = r.email ? String(r.email).trim() : null;
      const normEmail = rawEmail ? norm(rawEmail) : null;
      const rawCpf = r.cpf ? String(r.cpf).replace(/\D/g, "") : null;

      const existingId = (rawCpf && cpfMap.get(rawCpf))
        || (normEmail && emailMap.get(normEmail))
        || studentMap.get(normName);

      const payload = {
        name: rawName,
        email: rawEmail,
        phone: r.phone ? String(r.phone).trim() : null,
        status: r.status ? (statusMap[norm(String(r.status))] ?? String(r.status)) : "active",
        notes: r.notes ? String(r.notes) : null,
        cpf: r.cpf ? String(r.cpf).trim() : null,
        rg: r.rg ? String(r.rg) : null,
        birth_date: parseDate(r.birth_date),
        address: r.address ? String(r.address) : null,
        neighborhood: r.neighborhood ? String(r.neighborhood) : null,
        city: r.city ? String(r.city) : null,
        state: r.state ? String(r.state) : null,
        postal_code: r.postal_code ? String(r.postal_code) : null,
        country: r.country ? String(r.country) : null,
        start_date: parseDate(r.start_date),
      };

      if (existingId) {
        const { error } = await supabase
          .from("students")
          .update(payload)
          .eq("id", existingId);
        if (error) {
          errs.push(`Alunos [Linha ${i + 2}]: ${error.message}`);
        } else {
          ok++;
        }
      } else {
        const { data: newStudent, error } = await supabase
          .from("students")
          .insert({ user_id: userId, ...payload })
          .select("id")
          .single();
        if (error) {
          errs.push(`Alunos [Linha ${i + 2}]: ${error.message}`);
        } else if (newStudent) {
          studentMap.set(normName, newStudent.id);
          if (normEmail) emailMap.set(normEmail, newStudent.id);
          if (rawCpf) cpfMap.set(rawCpf, newStudent.id);
          ok++;
        }
      }
    }
    return ok;
  }

  async function importPaymentsRows(userId: string, targetRows: Record<string, unknown>[], errs: string[]) {
    let ok = 0;
    // Always fetch fresh students and plans from Supabase to prevent duplicate creation and match restored records
    const [{ data: freshStudents }, { data: freshPlans }] = await Promise.all([
      supabase.from("students").select("id, name").eq("user_id", userId).is("deleted_at", null),
      supabase.from("plans").select("id, name").eq("user_id", userId).is("deleted_at", null),
    ]);

    const studentByName = new Map<string, string>();
    for (const s of freshStudents ?? []) {
      if (s.name) studentByName.set(norm(s.name), s.id);
    }
    const planByName = new Map<string, string>();
    for (const p of freshPlans ?? []) {
      if (p.name) planByName.set(norm(p.name), p.id);
    }

    for (let i = 0; i < targetRows.length; i++) {
      const r = targetRows[i];
      const name = r.student_name ?? r.name;
      if (!name) { errs.push(`Pagamentos [Linha ${i + 2}]: aluno ausente`); continue; }
      const amount = Number(r.amount);
      if (isNaN(amount)) { errs.push(`Pagamentos [Linha ${i + 2}]: valor inválido`); continue; }
      
      const pd = parseDate(r.payment_date);
      if (!pd) {
        errs.push(`Pagamentos [Linha ${i + 2}]: data de pagamento inválida ou ausente ('${r.payment_date ?? ""}')`);
        continue;
      }
      const rm = parseMonth(r.reference_month) ?? pd.slice(0, 7);

      const rawName = String(name).trim();
      const key = norm(rawName);
      let studentId = studentByName.get(key);
      if (!studentId) {
        const { data, error } = await supabase
          .from("students").insert({ user_id: userId, name: rawName, status: "active" })
          .select("id").single();
        if (error) { errs.push(`Pagamentos [Linha ${i + 2}]: ${error.message}`); continue; }
        studentId = data.id;
        studentByName.set(key, studentId);
      }
      const planKey = r.plan_name ? norm(String(r.plan_name).trim()) : null;
      const planId = planKey ? planByName.get(planKey) ?? null : null;
      const methodRaw = r.payment_method ? norm(String(r.payment_method)) : "pix";
      const method = methodMap[methodRaw] ?? methodRaw;
      const statusRaw = r.status ? norm(String(r.status)) : "paid";
      const status = statusMap[statusRaw] ?? statusRaw;

      const { error } = await supabase.from("payments").insert({
        user_id: userId, student_id: studentId, plan_id: planId,
        amount, payment_date: pd, reference_month: rm,
        due_date: parseDate(r.due_date),
        payment_method: method, status,
        notes: r.notes ? String(r.notes) : null,
      });
      if (error) errs.push(`Pagamentos [Linha ${i + 2}]: ${error.message}`); else ok++;
    }
    return ok;
  }

  async function importPTPlansRows(userId: string, targetRows: Record<string, unknown>[], errs: string[]) {
    let ok = 0;
    const { data: existingPlans } = await supabase
      .from("pt_plans")
      .select("id, name")
      .eq("user_id", userId)
      .is("deleted_at", null);

    const planMap = new Map<string, string>();
    for (const p of existingPlans ?? []) {
      if (p.name) planMap.set(norm(p.name), p.id);
    }

    for (let i = 0; i < targetRows.length; i++) {
      const r = targetRows[i];
      if (!r.name) { errs.push(`Planos PT [Linha ${i + 2}]: nome ausente`); continue; }
      const isActiveRaw = r.is_active;
      const is_active = isActiveRaw === undefined || isActiveRaw === null
        ? true
        : ["true", "1", "sim", "ativo", true, 1].includes(
            typeof isActiveRaw === "string" ? isActiveRaw.toLowerCase() : isActiveRaw as never
          );
      const rawName = String(r.name).trim();
      const ptPlanPayload = {
        name: rawName,
        description: r.description ? String(r.description) : null,
        billing_type: r.billing_type ? String(r.billing_type) : "monthly",
        price_per_month: r.price_per_month ? Number(r.price_per_month) : null,
        price_per_session: r.price_per_session ? Number(r.price_per_session) : null,
        package_price: r.package_price ? Number(r.package_price) : null,
        package_sessions: r.package_sessions ? Number(r.package_sessions) : null,
        sessions_per_month: r.sessions_per_month ? Number(r.sessions_per_month) : null,
        is_active,
      };

      const existingId = planMap.get(norm(rawName));
      if (existingId) {
        const { error } = await supabase.from("pt_plans").update(ptPlanPayload).eq("id", existingId);
        if (error) errs.push(`Planos PT [Linha ${i + 2}]: ${error.message}`); else ok++;
      } else {
        const { data: newPlan, error } = await supabase.from("pt_plans").insert({
          user_id: userId,
          ...ptPlanPayload,
        }).select("id").single();
        if (error) {
          errs.push(`Planos PT [Linha ${i + 2}]: ${error.message}`);
        } else if (newPlan) {
          planMap.set(norm(rawName), newPlan.id);
          ok++;
        }
      }
    }
    return ok;
  }

  async function importPTStudentsRows(userId: string, targetRows: Record<string, unknown>[], errs: string[]) {
    let ok = 0;
    const { data: existingPTStudents } = await supabase
      .from("pt_students")
      .select("id, name, email")
      .eq("user_id", userId)
      .is("deleted_at", null);

    const studentMap = new Map<string, string>(); // norm(name) -> id
    const emailMap = new Map<string, string>();   // norm(email) -> id

    for (const s of existingPTStudents ?? []) {
      if (s.name) studentMap.set(norm(s.name), s.id);
      if (s.email) emailMap.set(norm(s.email), s.id);
    }

    for (let i = 0; i < targetRows.length; i++) {
      const r = targetRows[i];
      if (!r.name) { errs.push(`Alunos PT [Linha ${i + 2}]: nome ausente`); continue; }

      const rawName = String(r.name).trim();
      const normName = norm(rawName);
      const rawEmail = r.email ? String(r.email).trim() : null;
      const normEmail = rawEmail ? norm(rawEmail) : null;

      const existingId = (normEmail && emailMap.get(normEmail)) || studentMap.get(normName);

      const payload = {
        name: rawName,
        email: rawEmail,
        phone: r.phone ? String(r.phone).trim() : null,
        status: r.status ? (statusMap[norm(String(r.status))] ?? String(r.status)) : "active",
        goal: r.goal ? String(r.goal) : null,
        health_notes: r.health_notes ? String(r.health_notes) : null,
        training_plan: r.training_plan ? String(r.training_plan) : null,
        birth_date: parseDate(r.birth_date),
        start_date: parseDate(r.start_date),
        notes: r.notes ? String(r.notes) : null,
      };

      if (existingId) {
        const { error } = await supabase
          .from("pt_students")
          .update(payload)
          .eq("id", existingId);
        if (error) {
          errs.push(`Alunos PT [Linha ${i + 2}]: ${error.message}`);
        } else {
          ok++;
        }
      } else {
        const { data: newStudent, error } = await supabase
          .from("pt_students")
          .insert({ user_id: userId, ...payload })
          .select("id")
          .single();
        if (error) {
          errs.push(`Alunos PT [Linha ${i + 2}]: ${error.message}`);
        } else if (newStudent) {
          studentMap.set(normName, newStudent.id);
          if (normEmail) emailMap.set(normEmail, newStudent.id);
          ok++;
        }
      }
    }
    return ok;
  }

  async function importPTPaymentsRows(userId: string, targetRows: Record<string, unknown>[], errs: string[]) {
    let ok = 0;
    // Always fetch fresh PT students and plans from Supabase to prevent duplicate creation
    const [{ data: freshPTStudents }, { data: freshPTPlans }] = await Promise.all([
      supabase.from("pt_students").select("id, name").eq("user_id", userId).is("deleted_at", null),
      supabase.from("pt_plans").select("id, name").eq("user_id", userId).is("deleted_at", null),
    ]);

    const ptStudentByName = new Map<string, string>();
    for (const s of freshPTStudents ?? []) {
      if (s.name) ptStudentByName.set(norm(s.name), s.id);
    }
    const ptPlanByName = new Map<string, string>();
    for (const p of freshPTPlans ?? []) {
      if (p.name) ptPlanByName.set(norm(p.name), p.id);
    }

    for (let i = 0; i < targetRows.length; i++) {
      const r = targetRows[i];
      const name = r.student_name ?? r.name;
      if (!name) { errs.push(`Pagamentos PT [Linha ${i + 2}]: aluno ausente`); continue; }
      const amount = Number(r.amount);
      if (isNaN(amount)) { errs.push(`Pagamentos PT [Linha ${i + 2}]: valor inválido`); continue; }
      
      const pd = parseDate(r.payment_date);
      if (!pd) {
        errs.push(`Pagamentos PT [Linha ${i + 2}]: data de pagamento inválida ou ausente ('${r.payment_date ?? ""}')`);
        continue;
      }
      const rm = parseMonth(r.reference_month) ?? pd.slice(0, 7);

      const rawName = String(name).trim();
      const key = norm(rawName);
      let ptStudentId = ptStudentByName.get(key);
      if (!ptStudentId) {
        const { data, error } = await supabase
          .from("pt_students").insert({ user_id: userId, name: rawName, status: "active" })
          .select("id").single();
        if (error) { errs.push(`Pagamentos PT [Linha ${i + 2}]: ${error.message}`); continue; }
        ptStudentId = data.id;
        ptStudentByName.set(key, ptStudentId);
      }
      const ptPlanKey = r.plan_name ? norm(String(r.plan_name).trim()) : null;
      const ptPlanId = ptPlanKey ? ptPlanByName.get(ptPlanKey) ?? null : null;
      const methodRaw = r.payment_method ? norm(String(r.payment_method)) : "pix";
      const method = methodMap[methodRaw] ?? methodRaw;
      const statusRaw = r.status ? norm(String(r.status)) : "paid";
      const status = statusMap[statusRaw] ?? statusRaw;

      const { error } = await supabase.from("pt_payments").insert({
        user_id: userId,
        pt_student_id: ptStudentId,
        pt_plan_id: ptPlanId,
        amount,
        payment_date: pd,
        due_date: parseDate(r.due_date),
        reference_month: rm,
        sessions_paid: r.sessions_paid ? Number(r.sessions_paid) : null,
        payment_method: method,
        status,
        notes: r.notes ? String(r.notes) : null,
      });
      if (error) errs.push(`Pagamentos PT [Linha ${i + 2}]: ${error.message}`); else ok++;
    }
    return ok;
  }

  async function confirmImport() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;
    const errs: string[] = [];
    let okCount = 0;

    if (importType === "full_report" && fullReportData) {
      // Process full report backup sequentially (Plans -> Students -> Payments)
      if (fullReportData.plans?.length) {
        okCount += await importPlansRows(userId, fullReportData.plans, errs);
      }
      if (fullReportData.students?.length) {
        okCount += await importStudentsRows(userId, fullReportData.students, errs);
      }
      if (fullReportData.payments?.length) {
        okCount += await importPaymentsRows(userId, fullReportData.payments, errs);
      }
      if (fullReportData.pt_plans?.length) {
        okCount += await importPTPlansRows(userId, fullReportData.pt_plans, errs);
      }
      if (fullReportData.pt_students?.length) {
        okCount += await importPTStudentsRows(userId, fullReportData.pt_students, errs);
      }
      if (fullReportData.pt_payments?.length) {
        okCount += await importPTPaymentsRows(userId, fullReportData.pt_payments, errs);
      }
    } else if (importType === "plans") {
      okCount = await importPlansRows(userId, rows, errs);
    } else if (importType === "students") {
      okCount = await importStudentsRows(userId, rows, errs);
    } else if (importType === "payments") {
      okCount = await importPaymentsRows(userId, rows, errs);
    } else if (importType === "pt_plans") {
      okCount = await importPTPlansRows(userId, rows, errs);
    } else if (importType === "pt_students") {
      okCount = await importPTStudentsRows(userId, rows, errs);
    } else if (importType === "pt_payments") {
      okCount = await importPTPaymentsRows(userId, rows, errs);
    }

    setErrors(errs);
    setImported(okCount);
    qc.invalidateQueries();
    if (okCount) toast.success(`${okCount} registro(s) importado(s) com sucesso! 🎉`);
    if (errs.length) toast.error(`${errs.length} erro(s) durante a importação.`);
  }

  async function downloadTemplate(kind: ImportCategory) {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();

    if (kind === "full_report") {
      // Full Backup Template (Multi-Sheet)
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
        { student_name: "João Silva", plan_name: "Mensal Basic", amount: 99.9, payment_date: "01/03/2026", reference_month: "03/2026", payment_method: "pix", status: "pago", notes: "" }
      ]), "Pagamentos");

      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
        { name: "João Silva", email: "joao@example.com", phone: "11999990000", cpf: "000.000.000-00", rg: "", birth_date: "15/05/1990", address: "Rua A, 123", neighborhood: "Centro", city: "São Paulo", state: "SP", postal_code: "01000-000", country: "Brasil", start_date: "01/03/2026", status: "active", notes: "" }
      ]), "Alunos");

      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
        { name: "Mensal Basic", price: 99.9, billing_cycle: "mensal", description: "Plano mensal padrão", is_active: true }
      ]), "Planos");

      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
        { name: "Maria Santos", email: "maria@example.com", phone: "11988887777", goal: "Hipertrofia", health_notes: "Nenhuma", training_plan: "Treino A/B", birth_date: "20/10/1995", start_date: "01/03/2026", status: "active", notes: "" }
      ]), "Alunos PT");

      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
        { student_name: "Maria Santos", plan_name: "Personal 12 Sessoes", amount: 450.0, payment_date: "01/03/2026", due_date: "01/04/2026", reference_month: "03/2026", sessions_paid: 12, payment_method: "pix", status: "pago", notes: "" }
      ]), "Pagamentos PT");

      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([
        { name: "Personal 12 Sessoes", description: "Pacote 12 Aulas", billing_type: "package", price_per_month: "", price_per_session: 37.5, package_price: 450.0, package_sessions: 12, sessions_per_month: "", is_active: true }
      ]), "Planos PT");

      XLSX.writeFile(wb, `edufinance_template_backup_completo.xlsx`);
      return;
    }

    const data =
      kind === "payments"
        ? [{ student_name: "João Silva", plan_name: "Mensal Basic", amount: 99.9, payment_date: "01/03/2026", reference_month: "03/2026", payment_method: "pix", status: "pago", notes: "" }]
        : kind === "students"
        ? [{ name: "João Silva", email: "joao@example.com", phone: "11999990000", cpf: "000.000.000-00", rg: "", birth_date: "15/05/1990", address: "Rua A, 123", neighborhood: "Centro", city: "São Paulo", state: "SP", postal_code: "01000-000", country: "Brasil", start_date: "01/03/2026", status: "active", notes: "" }]
        : kind === "plans"
        ? [{ name: "Mensal Pro", price: 250, billing_cycle: "mensal", description: "Plano mensal completo", is_active: true }]
        : kind === "pt_students"
        ? [{ name: "Maria Santos", email: "maria@example.com", phone: "11988887777", goal: "Hipertrofia", health_notes: "Sem restrições", training_plan: "ABC", birth_date: "20/10/1995", start_date: "01/03/2026", status: "active", notes: "" }]
        : kind === "pt_payments"
        ? [{ student_name: "Maria Santos", plan_name: "Personal 12 Sessoes", amount: 450.0, payment_date: "01/03/2026", due_date: "01/04/2026", reference_month: "03/2026", sessions_paid: 12, payment_method: "pix", status: "pago", notes: "" }]
        : [{ name: "Personal 12 Sessoes", description: "Pacote 12 Aulas", billing_type: "package", price_per_month: "", price_per_session: 37.5, package_price: 450.0, package_sessions: 12, sessions_per_month: "", is_active: true }];

    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, kind);
    XLSX.writeFile(wb, `edufinance_template_${kind}.xlsx`);
  }

  async function exportPlans() {
    const XLSX = await import("xlsx");
    const data = plans.map((p) => ({
      Nome: p.name, Preco: Number(p.price), Ciclo: billingCycleLabel(p.billing_cycle),
      Descricao: p.description ?? "", Ativo: p.is_active ? "Sim" : "Não",
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Planos");
    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `edufinance_planos_${today}.xlsx`);
  }

  async function exportPayments() {
    const XLSX = await import("xlsx");
    const data = payments.map((p) => ({
      Aluno: p.students?.name ?? "",
      Plano: p.plans?.name ?? "",
      Valor: Number(p.amount),
      Data_Pagamento: p.payment_date,
      Vencimento: p.due_date ?? "",
      Mes_Referencia: p.reference_month,
      Metodo: paymentMethodLabel(p.payment_method),
      Status: p.status,
      Notas: p.notes ?? "",
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Pagamentos");
    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `edufinance_pagamentos_${today}.xlsx`);
  }

  async function exportStudents() {
    const XLSX = await import("xlsx");
    const data = students.map((s: any) => ({
      Nome: s.name, Email: s.email ?? "", Telefone: s.phone ?? "",
      CPF: s.cpf ?? "", RG: s.rg ?? "", Nascimento: s.birth_date ?? "",
      Endereco: s.address ?? "", Bairro: s.neighborhood ?? "",
      Cidade: s.city ?? "", Estado: s.state ?? "", CEP: s.postal_code ?? "",
      Pais: s.country ?? "", Inicio: s.start_date ?? "",
      Status: s.status, Notas: s.notes ?? "", Criado_em: s.created_at,
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Alunos");
    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `edufinance_alunos_${today}.xlsx`);
  }

  async function exportPTStudents() {
    const XLSX = await import("xlsx");
    const data = ptStudents.map((s) => ({
      Nome: s.name, Email: s.email ?? "", Telefone: s.phone ?? "",
      Status: s.status, Objetivo: s.goal ?? "", Saude: s.health_notes ?? "",
      Plano_Treino: s.training_plan ?? "", Nascimento: s.birth_date ?? "",
      Inicio: s.start_date ?? "", Notas: s.notes ?? "", Criado_em: s.created_at,
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Alunos PT");
    XLSX.writeFile(wb, `edufinance_alunos_pt_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  async function exportPTPayments() {
    const XLSX = await import("xlsx");
    const data = ptPayments.map((p: any) => ({
      Aluno: p.pt_students?.name ?? "",
      Plano: p.pt_plans?.name ?? "",
      Valor: Number(p.amount),
      Data_Pagamento: p.payment_date,
      Vencimento: p.due_date ?? "",
      Mes_Referencia: p.reference_month ?? "",
      Sessoes_Pagas: p.sessions_paid ?? "",
      Metodo: paymentMethodLabel(p.payment_method),
      Status: p.status,
      Notas: p.notes ?? "",
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Pagamentos PT");
    XLSX.writeFile(wb, `edufinance_pagamentos_pt_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  async function exportPTPlans() {
    const XLSX = await import("xlsx");
    const data = ptPlans.map((p: any) => ({
      Nome: p.name, Descricao: p.description ?? "", Tipo_Cobranca: p.billing_type,
      Preco_Mensal: p.price_per_month ?? "", Preco_Sessao: p.price_per_session ?? "",
      Preco_Pacote: p.package_price ?? "", Sessoes_Pacote: p.package_sessions ?? "",
      Sessoes_Mes: p.sessions_per_month ?? "", Ativo: p.is_active ? "Sim" : "Não",
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Planos PT");
    XLSX.writeFile(wb, `edufinance_planos_pt_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  async function exportReport() {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(payments.map((p) => ({
      Aluno: p.students?.name, Plano: p.plans?.name, Valor: Number(p.amount),
      Data: p.payment_date, Mes_Ref: p.reference_month, Status: p.status,
    }))), "Pagamentos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(students.map((s: any) => ({
      Nome: s.name, Email: s.email ?? "", Telefone: s.phone ?? "", Status: s.status,
      CPF: s.cpf ?? "", RG: s.rg ?? "", Nascimento: s.birth_date ?? "",
      Endereco: s.address ?? "", Bairro: s.neighborhood ?? "", Cidade: s.city ?? "",
      Estado: s.state ?? "", CEP: s.postal_code ?? "", Pais: s.country ?? "",
      Inicio: s.start_date ?? "", Notas: s.notes ?? "",
    }))), "Alunos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(plans.map((p) => ({
      Nome: p.name, Preco: Number(p.price), Ciclo: billingCycleLabel(p.billing_cycle), Ativo: p.is_active,
    }))), "Planos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ptStudents.map((s: any) => ({
      Nome: s.name, Email: s.email ?? "", Telefone: s.phone ?? "", Status: s.status,
      Nascimento: s.birth_date ?? "", Objetivo: s.goal ?? "", Saude: s.health_notes ?? "",
      Plano_Treino: s.training_plan ?? "", Inicio: s.start_date ?? "", Notas: s.notes ?? "",
    }))), "Alunos PT");

    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ptPayments.map((p: any) => ({
      Aluno: p.pt_students?.name ?? "", Plano: p.pt_plans?.name ?? "", Valor: Number(p.amount),
      Data: p.payment_date, Vencimento: p.due_date ?? "", Mes_Ref: p.reference_month ?? "",
      Sessoes_Pagas: p.sessions_paid ?? "", Metodo: paymentMethodLabel(p.payment_method), Status: p.status,
    }))), "Pagamentos PT");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ptPlans.map((p: any) => ({
      Nome: p.name, Descricao: p.description ?? "", Tipo_Cobranca: p.billing_type,
      Preco_Mensal: p.price_per_month ?? "", Preco_Sessao: p.price_per_session ?? "",
      Preco_Pacote: p.package_price ?? "", Sessoes_Pacote: p.package_sessions ?? "",
      Sessoes_Mes: p.sessions_per_month ?? "", Ativo: p.is_active,
    }))), "Planos PT");
    XLSX.writeFile(wb, `edufinance_relatorio_completo_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  const importCategories: { id: ImportCategory; label: string }[] = [
    { id: "payments", label: "Pagamentos" },
    { id: "students", label: "Alunos" },
    { id: "plans", label: "Planos" },
    { id: "pt_students", label: "Alunos PT" },
    { id: "pt_payments", label: "Pagamentos PT" },
    { id: "pt_plans", label: "Planos PT" },
    { id: "full_report", label: "Relatório Completo (Backup)" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Importar Dados</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Selecione o tipo de dado ou importe um relatório completo (backup multi-abas .xlsx).
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {importCategories.map((cat) => {
                const isActive = importType === cat.id;
                const isFull = cat.id === "full_report";
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setImportType(cat.id);
                      setRows([]);
                      setFullReportData(null);
                      setErrors([]);
                      setImported(null);
                    }}
                    className={`text-xs ${isFull && !isActive ? "border-primary/40 text-primary bg-primary/5 hover:bg-primary/10" : ""}`}
                  >
                    {isFull && <Database className="mr-1 h-3.5 w-3.5" />}
                    {cat.label}
                  </Button>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg border-2 border-dashed p-6 text-center bg-card/40">
              <FileSpreadsheet className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium">
                {importType === "full_report"
                  ? "Arraste o arquivo do Relatório Completo (.xlsx com abas)"
                  : "Arraste um arquivo .xlsx ou .csv"}
              </p>
              <label className="mt-2 inline-block cursor-pointer text-sm font-semibold text-primary hover:underline">
                selecione um arquivo do computador
                <input
                  type="file"
                  accept=".xlsx,.csv,.xls"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </label>
              <div className="mt-3">
                <Button variant="ghost" size="sm" onClick={() => downloadTemplate(importType)} className="text-xs gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  {importType === "full_report" ? "Baixar template do Backup Completo (.xlsx)" : "Baixar template"}
                </Button>
              </div>
            </div>

            {/* Single-sheet Preview */}
            {rows.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{rows.length}</span> linhas detectadas para a categoria <span className="uppercase text-primary font-bold">{importType}</span>
                </p>
                <div className="max-h-40 overflow-auto rounded-lg border bg-muted/40 p-2.5 text-[11px]">
                  <pre className="font-mono leading-relaxed">{JSON.stringify(rows.slice(0, 3), null, 2)}</pre>
                </div>
                <Button className="mt-2 w-full font-bold" onClick={confirmImport}>
                  Confirmar Importação de {rows.length} Registros
                </Button>
              </div>
            )}

            {/* Multi-sheet Backup Preview */}
            {fullReportData && (
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs space-y-2">
                  <p className="font-bold text-primary flex items-center gap-1.5">
                    <Database className="h-4 w-4" /> Relatório Completo Detectado (Backup Multi-Abas):
                  </p>
                  <ul className="grid grid-cols-2 gap-1.5 pl-2 font-medium">
                    {fullReportData.students && <li>• Alunos: <b>{fullReportData.students.length}</b></li>}
                    {fullReportData.payments && <li>• Pagamentos: <b>{fullReportData.payments.length}</b></li>}
                    {fullReportData.plans && <li>• Planos: <b>{fullReportData.plans.length}</b></li>}
                    {fullReportData.pt_students && <li>• Alunos PT: <b>{fullReportData.pt_students.length}</b></li>}
                    {fullReportData.pt_payments && <li>• Pagamentos PT: <b>{fullReportData.pt_payments.length}</b></li>}
                    {fullReportData.pt_plans && <li>• Planos PT: <b>{fullReportData.pt_plans.length}</b></li>}
                  </ul>
                </div>
                <Button className="w-full font-bold bg-primary hover:bg-primary/90" onClick={confirmImport}>
                  Restaurar Backup Completo (Importar Todas as Abas)
                </Button>
              </div>
            )}

            {imported !== null && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> {imported} registro(s) importado(s) com sucesso no seu banco!
              </div>
            )}

            {errors.length > 0 && (
              <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> {errors.length} erro(s) durante o processamento:
                </div>
                <ul className="mt-2 max-h-32 list-disc overflow-auto pl-5 font-mono text-[11px] text-destructive space-y-0.5">
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Exportar Dados</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Baixe seus dados cadastrais e financeiros como planilhas Excel organizadas.
            </p>

            <div className="mt-4 grid gap-2">
              <Button variant="outline" className="justify-start text-xs font-semibold gap-2" onClick={exportPayments}>
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Exportar pagamentos (Studio)
              </Button>
              <Button variant="outline" className="justify-start text-xs font-semibold gap-2" onClick={exportStudents}>
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Exportar alunos (Studio)
              </Button>
              <Button variant="outline" className="justify-start text-xs font-semibold gap-2" onClick={exportPlans}>
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Exportar planos (Studio)
              </Button>
              <Button variant="outline" className="justify-start text-xs font-semibold gap-2" onClick={exportPTStudents}>
                <FileSpreadsheet className="h-4 w-4 text-indigo-600" /> Exportar alunos PT (Personal)
              </Button>
              <Button variant="outline" className="justify-start text-xs font-semibold gap-2" onClick={exportPTPayments}>
                <FileSpreadsheet className="h-4 w-4 text-indigo-600" /> Exportar pagamentos PT (Personal)
              </Button>
              <Button variant="outline" className="justify-start text-xs font-semibold gap-2" onClick={exportPTPlans}>
                <FileSpreadsheet className="h-4 w-4 text-indigo-600" /> Exportar planos PT (Personal)
              </Button>
              <Button variant="default" className="justify-start text-xs font-bold gap-2 bg-primary hover:bg-primary/90 mt-1 shadow-md shadow-primary/20" onClick={exportReport}>
                <FileSpreadsheet className="h-4 w-4 text-primary-foreground" /> Relatório completo (todas as abas)
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <PerStudentExport />
    </div>
  );
}
