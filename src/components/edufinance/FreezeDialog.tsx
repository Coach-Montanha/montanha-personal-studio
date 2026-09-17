import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addDays, format } from "date-fns";

type Freeze = {
  id?: string;
  student_id?: string;
  payment_id?: string | null;
  freeze_days?: number;
  start_date?: string;
  end_date?: string;
  notes?: string | null;
};

export function FreezeDialog({
  open,
  onOpenChange,
  studentId,
  paymentId,
  maxDays,
  planName,
  freeze,
  onUnfreeze,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  studentId: string;
  paymentId?: string | null;
  maxDays?: number | null;
  planName?: string | null;
  freeze?: Freeze | null;
  onUnfreeze?: () => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Freeze>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      freeze ?? {
        start_date: format(new Date(), "yyyy-MM-dd"),
        freeze_days: 7,
        notes: "",
      },
    );
  }, [open, freeze]);

  const days = Number(form.freeze_days ?? 0);
  const computedEnd =
    form.start_date && days > 0
      ? format(addDays(new Date(form.start_date + "T00:00"), days), "yyyy-MM-dd")
      : "";

  async function save() {
    if (!form.start_date) return toast.error("Informe a data de início do trancamento");
    if (!days || days <= 0) return toast.error("Informe a quantidade de dias");
    if (maxDays && days > maxDays) {
      return toast.error(`Este plano permite no máximo ${maxDays} dias de trancamento.`);
    }

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;

      // Se estiver congelando um aluno PT ou Studio, atualizamos o status dele também
      const { data: isPt } = await supabase.from("pt_students").select("id").eq("id", studentId).maybeSingle();
      if (isPt) {
        await supabase.from("pt_students").update({ status: "paused" }).eq("id", studentId);
      } else {
        await supabase.from("students").update({ status: "paused" }).eq("id", studentId);
      }

      const payload = {
        user_id: userId,
        student_id: studentId,
        payment_id: paymentId ?? null,
        freeze_days: days,
        start_date: form.start_date,
        end_date: computedEnd,
        notes: form.notes ?? null,
      };

      if (form.id) {
        const { error } = await supabase.from("payment_freezes").update(payload).eq("id", form.id);
        if (error) return toast.error(error.message);
      } else {
        const { error } = await supabase.from("payment_freezes").insert(payload);
        if (error) return toast.error(error.message);
      }

      toast.success(form.id ? "Trancamento atualizado com sucesso!" : "Trancamento registrado com sucesso!");
      qc.invalidateQueries();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUnfreezeClick() {
    setSaving(true);
    try {
      const { data: isPt } = await supabase.from("pt_students").select("id").eq("id", studentId).maybeSingle();
      if (isPt) {
        await supabase.from("pt_students").update({ status: "active" }).eq("id", studentId);
      } else {
        await supabase.from("students").update({ status: "active" }).eq("id", studentId);
      }
      toast.success("Plano destrancado e aluno reativado!");
      if (onUnfreeze) onUnfreeze();
      qc.invalidateQueries();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(`Erro ao destrancar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{form.id ? "Editar trancamento ativo" : "Trancar plano"}</DialogTitle>
          <DialogDescription>
            {planName ? <>Plano: <strong>{planName}</strong>. </> : null}
            {maxDays
              ? `Limite deste plano: ${maxDays} dias.`
              : "Ajuste o período do trancamento. O vencimento do plano será estendido proporcionalmente aos dias congelados."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Início do trancamento</Label>
              <Input
                type="date"
                value={form.start_date ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Dias de trancamento</Label>
              <Input
                type="number"
                min={1}
                max={maxDays ?? undefined}
                value={form.freeze_days ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, freeze_days: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="rounded-md border bg-muted/40 p-3 text-xs">
            Prazo final do trancamento:{" "}
            <strong>{computedEnd ? new Date(computedEnd + "T00:00").toLocaleDateString("pt-BR") : "—"}</strong>
          </div>
          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea
              rows={2}
              value={form.notes ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Motivo do trancamento (opcional)"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
          {form.id && (
            <Button
              type="button"
              variant="outline"
              className="border-emerald-500/40 text-emerald-600 hover:bg-emerald-500/10 mr-auto"
              onClick={handleUnfreezeClick}
              disabled={saving}
            >
              Destrancar Plano
            </Button>
          )}
          <div className="flex gap-2 justify-end ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Salvando..." : form.id ? "Salvar Alterações" : "Trancar Plano"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
