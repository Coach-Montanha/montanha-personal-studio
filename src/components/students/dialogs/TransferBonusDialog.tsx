import { useEffect, useState } from "react";
import { ArrowRightLeft, Loader2, Search } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { transferStudentBonus } from "@/lib/bonus.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sourceStudentId: string;
  sourceStudentName: string;
  currentBalance: number;
  onSuccess?: () => void;
}

interface StudentOption {
  id: string;
  name: string;
}

export function TransferBonusDialog({
  open,
  onOpenChange,
  sourceStudentId,
  sourceStudentName,
  currentBalance,
  onSuccess,
}: Props) {
  const { user } = useAuth();
  const transfer = useServerFn(transferStudentBonus);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<StudentOption | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelected(null);
      setAmount("");
      setReason("");
    }
  }, [open]);

  const { data: students = [] } = useQuery<StudentOption[]>({
    queryKey: ["students-list-for-transfer", user?.id, search],
    enabled: open && !!user?.id && search.length >= 2,
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("id, name")
        .eq("user_id", user!.id)
        .neq("id", sourceStudentId)
        .is("deleted_at", null)
        .ilike("name", `%${search}%`)
        .order("name")
        .limit(10);
      return (data ?? []) as StudentOption[];
    },
    staleTime: 10_000,
  });

  const parsed = parseInt(amount, 10);
  const isValid =
    !!selected && !isNaN(parsed) && parsed > 0 && parsed <= currentBalance;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || !selected) return;
    setLoading(true);
    try {
      await transfer({
        data: {
          sourceStudentId,
          targetStudentId: selected.id,
          amount: parsed,
          reason: reason || undefined,
        },
      });
      toast.success(
        `${parsed} check-in(s) bônus transferido(s) para ${selected.name}`,
      );
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-500 ring-1 ring-inset ring-blue-500/20">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center">Transferir Bônus</DialogTitle>
          <DialogDescription className="text-center">
            De <strong>{sourceStudentName}</strong> · Saldo disponível:{" "}
            <strong>{currentBalance}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target student search */}
          <div className="space-y-1.5">
            <Label>Aluno destinatário</Label>
            {selected ? (
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <span className="flex-1 font-medium">{selected.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    setSelected(null);
                    setSearch("");
                  }}
                >
                  Trocar
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar aluno por nome…"
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {students.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-md">
                    {students.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                        onClick={() => {
                          setSelected(s);
                          setSearch("");
                        }}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-amount">Quantidade</Label>
            <Input
              id="tx-amount"
              type="number"
              min={1}
              max={currentBalance}
              placeholder={`1 – ${currentBalance}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {parsed > currentBalance && (
              <p className="text-xs text-destructive">Quantidade excede o saldo disponível</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-reason">Motivo (opcional)</Label>
            <Textarea
              id="tx-reason"
              placeholder="Ex: Repasse de crédito do sorteio…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || loading} className="gap-1.5">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRightLeft className="h-4 w-4" />
              )}
              Transferir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
