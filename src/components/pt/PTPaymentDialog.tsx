import { Receipt, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DialogHeadline } from "@/components/ui-kit/DialogHeadline";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { currentMonthKey, paymentMethodLabel } from "@/lib/format";
import { format } from "date-fns";

type PTPayment = {
  id?: string;
  pt_student_id?: string;
  pt_plan_id?: string | null;
  amount?: number;
  payment_date?: string;
  due_date?: string | null;
  reference_month?: string | null;
  payment_method?: string;
  status?: string;
  sessions_paid?: number | null;
  notes?: string | null;
};

export function PTPaymentDialog({
  open, onOpenChange, payment, defaultStudentId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  payment?: PTPayment | null;
  defaultStudentId?: string;
}) {
  const qc = useQueryClient();
  const { data: students = [] } = useQuery({
    queryKey: ["pt-students-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("pt_students")
        .select("id,name,notes")
        .is("deleted_at", null)
        .neq("id", "00000000-0000-0000-0000-000000000001")
        .order("name");
      return (data ?? []).filter((s: any) =>
        s.id !== "00000000-0000-0000-0000-000000000001" &&
        (!s.notes || (!s.notes.includes("[Studio]") && !s.notes.includes("[Aluno Studio]")))
      );
    },
  });
  const { data: plans = [] } = useQuery({
    queryKey: ["pt-plans-all"],
    queryFn: async () =>
      (await supabase.from("pt_plans").select("id,name,price_per_month,price_per_session,package_price,package_sessions,sessions_per_month,billing_type").order("name")).data ?? [],
  });

  const [form, setForm] = useState<PTPayment>({});
  const [saving, setSaving] = useState(false);
  const [historicalSessions, setHistoricalSessions] = useState<number | "">("");
  const [compensateDeficit, setCompensateDeficit] = useState(true);

  // Consulta aulas realizadas em débito (excedentes do pacote anterior ou sem pagamento)
  const { data: pendingSessions = [] } = useQuery({
    queryKey: ["pt-student-pending-deficit", form.pt_student_id],
    enabled: open && !form.id && !!form.pt_student_id,
    queryFn: async () => {
      if (!form.pt_student_id) return [];
      const studentId = form.pt_student_id;

      const { data: sessions } = await supabase
        .from("pt_sessions")
        .select("id, session_date, session_time, pt_payment_id, created_at")
        .eq("pt_student_id", studentId)
        .eq("status", "completed")
        .order("session_date", { ascending: true })
        .order("session_time", { ascending: true });

      const { data: pays } = await supabase
        .from("pt_payments")
        .select("id, payment_date, sessions_paid, pt_plans(billing_type, package_sessions, sessions_per_month)")
        .eq("pt_student_id", studentId)
        .eq("status", "paid")
        .order("payment_date", { ascending: true });

      const paymentContracted = new Map<string, number>();
      for (const p of pays ?? []) {
        const contracted = Number(p.sessions_paid ?? p.pt_plans?.package_sessions ?? p.pt_plans?.sessions_per_month ?? 0) || 0;
        paymentContracted.set(p.id, contracted);
      }

      const sessionsByPayment = new Map<string, any[]>();
      const unlinked: any[] = [];
      for (const s of sessions ?? []) {
        if (!s.pt_payment_id) {
          unlinked.push(s);
        } else {
          const arr = sessionsByPayment.get(s.pt_payment_id) || [];
          arr.push(s);
          sessionsByPayment.set(s.pt_payment_id, arr);
        }
      }

      const deficitSessions: any[] = [];
      for (const [pid, pSessions] of sessionsByPayment.entries()) {
        const contracted = paymentContracted.get(pid) || 0;
        if (pSessions.length > contracted) {
          deficitSessions.push(...pSessions.slice(contracted));
        }
      }

      return [...deficitSessions, ...unlinked].sort((a, b) =>
        a.session_date < b.session_date ? -1 : a.session_date > b.session_date ? 1 : 0
      );
    },
  });
  useEffect(() => {
    if (open) {
      setForm(payment ?? {
        pt_student_id: defaultStudentId,
        payment_date: format(new Date(), "yyyy-MM-dd"),
        reference_month: currentMonthKey(),
        payment_method: "pix",
        status: "paid",
      });
      setHistoricalSessions("");
    }
  }, [open, payment, defaultStudentId]);

  const planMap = useMemo(() => Object.fromEntries(plans.map((p) => [p.id, p])), [plans]);

  const activePlan = form.pt_plan_id ? planMap[form.pt_plan_id] : null;
  const billingType: string | null = activePlan?.billing_type ?? null;
  const isMonthly = billingType === "monthly";
  const isBySession = billingType === "per_session" || billingType === "package";

  function addDaysISO(iso: string, days: number) {
    const d = new Date(`${iso}T12:00:00`);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function applyPlan(planId: string | null) {
    if (!planId) return setForm((f) => ({ ...f, pt_plan_id: null }));
    const p = planMap[planId];
    if (!p) return;
    const amount =
      p.billing_type === "monthly" ? Number(p.price_per_month ?? 0)
      : p.billing_type === "package" ? Number(p.package_price ?? 0)
      : Number(p.price_per_session ?? 0);
    const sessions =
      p.billing_type === "monthly" ? p.sessions_per_month
      : p.billing_type === "package" ? p.package_sessions
      : 1;
    setForm((f) => {
      const nextDue =
        p.billing_type === "monthly" && f.payment_date
          ? addDaysISO(f.payment_date, 30)
          : null;
      return {
        ...f,
        pt_plan_id: planId,
        amount: f.amount || amount,
        sessions_paid: f.sessions_paid ?? sessions,
        due_date: nextDue ?? f.due_date ?? null,
      };
    });
  }

  // Se muda a data de pagamento e o plano é mensal, recalcula o vencimento (30 dias após).
  useEffect(() => {
    if (!isMonthly || !form.payment_date) return;
    setForm((f) => ({ ...f, due_date: addDaysISO(f.payment_date!, 30) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.payment_date, isMonthly]);

  async function save() {
    if (!form.pt_student_id || !form.amount || !form.payment_date) {
      return toast.error("Preencha aluno, valor e data");
    }
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    setSaving(true);
    try {
      const payload = {
        user_id: userId,
        pt_student_id: form.pt_student_id,
        pt_plan_id: form.pt_plan_id || null,
        amount: Number(form.amount),
        payment_date: form.payment_date,
        // Planos por aula/pacote não têm data fixa — vencem ao esgotar as aulas.
        due_date: isBySession ? null : (form.due_date || null),
        reference_month: form.reference_month || null,
        payment_method: form.payment_method ?? "pix",
        status: form.status ?? "paid",
        sessions_paid: form.sessions_paid ?? null,
        notes: form.notes ?? null,
      };
      const op = form.id
        ? supabase.from("pt_payments").update(payload).eq("id", form.id)
        : supabase.from("pt_payments").insert(payload).select("id").single();
      const { data: opData, error } = await op;
      if (error) throw error;

      // Ao criar um pagamento novo, compensa automaticamente as aulas em débito
      const newPaymentId = !form.id ? (opData as any)?.id : null;
      if (newPaymentId && compensateDeficit && pendingSessions.length > 0 && form.pt_student_id) {
        const quota = Number(form.sessions_paid || activePlan?.package_sessions || activePlan?.sessions_per_month || 0) || 999;
        const toCompensate = pendingSessions.slice(0, quota);
        if (toCompensate.length > 0) {
          const ids = toCompensate.map((s) => s.id);
          const { error: compErr } = await supabase
            .from("pt_sessions")
            .update({ pt_payment_id: newPaymentId })
            .in("id", ids);
          if (compErr) {
            toast.error(`Falha ao compensar aulas: ${compErr.message}`);
          } else {
            toast.success(`✅ ${toCompensate.length} aula(s) em débito compensada(s) automaticamente!`);
          }
        }
      }
      const count = typeof historicalSessions === "number" ? historicalSessions : 0;
      if (newPaymentId && count > 0 && form.pt_student_id) {
        const baseDate = new Date(`${form.payment_date}T12:00:00`);
        const sessionRows = Array.from({ length: count }).map((_, i) => {
          const d = new Date(baseDate);
          d.setDate(d.getDate() - i);
          return {
            user_id: userId,
            pt_student_id: form.pt_student_id!,
            pt_payment_id: newPaymentId,
            session_date: d.toISOString().slice(0, 10),
            duration_minutes: 60,
            status: "completed",
            performance_notes: "Registro histórico (importado com o pagamento)",
          };
        });
        const { error: sErr } = await supabase.from("pt_sessions").insert(sessionRows);
        if (sErr) toast.error(`Pagamento salvo, mas falhou ao registrar aulas: ${sErr.message}`);
      }

      toast.success(form.id ? "Pagamento atualizado" : "Pagamento registrado");
      qc.invalidateQueries();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar pagamento");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeadline icon={Receipt} title={<>{form.id ? "Editar pagamento PT" : "Registrar pagamento PT"}</>} description="Lançamento financeiro vinculado ao plano do aluno PT." />
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label>Aluno *</Label>
            <Select value={form.pt_student_id} onValueChange={(v) => setForm((f) => ({ ...f, pt_student_id: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Plano</Label>
            <Select value={form.pt_plan_id ?? "none"} onValueChange={(v) => applyPlan(v === "none" ? null : v)}>
              <SelectTrigger><SelectValue placeholder="Sem plano" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem plano (avulso)</SelectItem>
                {plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {!form.pt_plan_id && (
              <p className="text-xs text-muted-foreground">
                💡 Pagamento avulso — não vinculado a nenhum plano. Use para registros históricos ou aulas pontuais.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Valor (R$) *</Label>
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="0,00"
              value={form.amount ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Aulas cobertas</Label>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              value={form.sessions_paid ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, sessions_paid: e.target.value ? Number(e.target.value) : null }))}
            />
          </div>
          {!form.id && (
            <div className="col-span-2 space-y-1.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
              <Label className="text-xs">Aulas já realizadas (histórico)</Label>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Ex.: 8"
                value={historicalSessions}
                onChange={(e) => setHistoricalSessions(e.target.value ? Number(e.target.value) : "")}
              />
              <p className="text-[11px] text-muted-foreground">
                Ao salvar, serão criadas automaticamente N aulas com status <strong>Realizada</strong> vinculadas a este pagamento
                (datadas retroativamente a partir da data do pagamento). Use para migrar alunos antigos sem precisar registrar aula por aula.
              </p>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Mês de referência</Label>
            <Input type="month" value={form.reference_month ?? ""} onChange={(e) => setForm((f) => ({ ...f, reference_month: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Data do pagamento *</Label>
            <Input type="date" value={form.payment_date ?? ""} onChange={(e) => {
              const newDate = e.target.value;
              setForm((f) => ({ ...f, payment_date: newDate, reference_month: newDate ? newDate.substring(0, 7) : f.reference_month }))
            }} />
          </div>
          <div className="space-y-1.5">
            <Label>Forma de pagamento</Label>
            <Select value={form.payment_method ?? "pix"} onValueChange={(v) => setForm((f) => ({ ...f, payment_method: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["pix","credit_card","debit_card","bank_slip","cash","transfer"].map((m) => (
                  <SelectItem key={m} value={m}>{paymentMethodLabel(m)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status ?? "paid"} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Vencimento</Label>
            {isBySession ? (
              <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 p-2 text-xs text-muted-foreground">
                📦 Plano por aula/pacote — vence automaticamente quando as aulas contratadas se esgotarem.
              </div>
            ) : (
              <>
                <Input
                  type="date"
                  value={form.due_date ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value || null }))}
                />
                {isMonthly && (
                  <p className="text-[11px] text-muted-foreground">
                    Plano mensal — vencimento calculado como 30 dias após a data do pagamento.
                  </p>
                )}
              </>
            )}
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Observações</Label>
            <Textarea rows={2} value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          {!form.id && pendingSessions.length > 0 && (
            <div className="col-span-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <AlertCircle className="h-4 w-4" />
                <span>Aulas em Débito Detectadas</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                Este aluno possui <strong>{pendingSessions.length} aula(s)</strong> já realizada(s) em débito (treinou sem pacote ativo ou além do saldo).
              </p>
              <label className="flex items-center gap-2 pt-1 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-amber-500 text-amber-600 focus:ring-amber-500"
                  checked={compensateDeficit}
                  onChange={(e) => setCompensateDeficit(e.target.checked)}
                />
                <span>Compensar automaticamente até {form.sessions_paid || activePlan?.package_sessions || 0} aula(s) neste pagamento</span>
              </label>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button onClick={save} disabled={saving} className="transition-all active:scale-[0.98]">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
