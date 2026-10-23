import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, Check, Trash2, ArrowRightLeft, Sparkles } from "lucide-react";
import {
  getSavedAccounts,
  switchToAccount,
  removeSavedAccount,
  prepareAddNewAccount,
  type SavedAccount,
} from "@/lib/multi-account";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface AccountSwitcherDialogProps {
  trigger?: React.ReactNode;
}

export function AccountSwitcherDialog({ trigger }: AccountSwitcherDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAccounts(getSavedAccounts());
    }
  }, [open]);

  async function handleSwitch(acc: SavedAccount) {
    if (acc.id === user?.id) {
      setOpen(false);
      return;
    }
    setSwitchingId(acc.id);
    toast.info(`Alternando para ${acc.name || acc.email}...`);
    const success = await switchToAccount(acc.id);
    if (!success) {
      toast.error("Sessão da conta expirou. Faça login novamente.");
      setAccounts(getSavedAccounts());
      setSwitchingId(null);
    }
  }

  function handleRemove(e: React.MouseEvent, accId: string) {
    e.stopPropagation();
    removeSavedAccount(accId);
    setAccounts(getSavedAccounts());
    toast.success("Conta removida deste dispositivo.");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
            <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
            <span>Alternar Conta</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm sm:max-w-md p-6">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Alternar Conta (Dual Account)</DialogTitle>
              <p className="text-xs text-muted-foreground">
                Acesse múltiplos perfis salvos neste celular com 1 toque
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
          {accounts.map((acc) => {
            const isCurrent = acc.id === user?.id;
            const isSwitching = switchingId === acc.id;

            return (
              <div
                key={acc.id}
                onClick={() => !isCurrent && !isSwitching && handleSwitch(acc)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                    : "hover:bg-muted/50 cursor-pointer border-border/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={acc.avatarUrl} />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {acc.name ? acc.name.slice(0, 2).toUpperCase() : acc.email.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-foreground truncate">{acc.name || acc.email}</p>
                      {isCurrent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white shrink-0">
                          Atual
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{acc.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {isCurrent ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isSwitching}
                        className="h-7 text-xs px-2 font-semibold text-primary hover:text-primary hover:bg-primary/10"
                      >
                        {isSwitching ? "Entrando..." : "Entrar"}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => handleRemove(e, acc.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        title="Remover deste celular"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t mt-3 flex flex-col gap-2">
          <Button
            onClick={() => {
              setOpen(false);
              prepareAddNewAccount();
            }}
            variant="default"
            className="w-full gap-2 text-xs font-bold"
          >
            <UserPlus className="h-4 w-4" />
            Conectar Outra Conta a Este Aparelho
          </Button>

          <p className="text-[10px] text-center text-muted-foreground">
            Suporte nativo a múltiplos logins. Nenhuma dependência das funções do sistema operacional.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
