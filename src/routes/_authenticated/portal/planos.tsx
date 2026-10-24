import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { createPlanCheckoutOrder } from "@/lib/payments.functions";
import { Check, CreditCard, QrCode, Banknote, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { formatBRL } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/portal/planos")({
  head: () => ({ meta: [{ title: "Planos e Matrícula — Portal do Aluno" }] }),
  component: PortalPlanosPage,
});

function PortalPlanosPage() {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const createCheckout = useServerFn(createPlanCheckoutOrder);

  // Buscar dados do aluno logado
  const { data: student } = useQuery({
    queryKey: ["portal-my-student-profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase
        .from("students")
        .select("id, name, email, phone")
        .eq("account_user_id", u.user.id)
        .maybeSingle();
      return data;
    },
  });

  // Buscar plano atual ativo do aluno
  const { data: currentPlanInfo } = useQuery({
    queryKey: ["portal-my-current-plan", student?.id],
    enabled: !!student?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("student_plan_history")
        .select("id, plan_id, start_date, plans(id, name, price, billing_cycle, sessions_per_week)")
        .eq("student_id", student!.id)
        .eq("is_current", true)
        .maybeSingle();
      return data;
    },
  });

  // Buscar catálogo de planos disponíveis
  const { data: availablePlans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ["portal-available-plans"],
    queryFn: async () => {
      const { data } = await supabase
        .from("plans")
        .select("id, name, price, billing_cycle, sessions_per_week, description")
        .order("price", { ascending: true });
      return data ?? [];
    },
  });

  const handleStartMigration = async (plan: any) => {
    if (!student?.id) {
      toast.error("Identificação do aluno não encontrada.");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await createCheckout({
        data: {
          studentId: student.id,
          planId: plan.id,
        },
      });

      if (res.checkoutUrl) {
        toast.success("Redirecionando para o Checkout InfinitePay...");
        window.location.href = res.checkoutUrl;
      } else {
        toast.info("Pedido registrado! Complete com a chave InfinitePay ou no balcão.");
        setSelectedPlan(null);
      }
    } catch (err: any) {
      toast.error(err?.message || "Não foi possível gerar a cobrança.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-400" />
          Planos & Migração de Assinatura
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Altere ou renove o seu plano no Montanha Personal Studio. Pagamento instantâneo via Pix ou Cartão.
        </p>
      </div>

      {/* Plano Atual */}
      {currentPlanInfo?.plans && (
        <Card className="bg-zinc-900/80 border-amber-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-amber-400 border-amber-400/40">
                Seu Plano Vigente
              </Badge>
              <span className="text-xs text-zinc-400">Ativo</span>
            </div>
            <CardTitle className="text-lg text-white mt-1">
              {(currentPlanInfo.plans as any).name}
            </CardTitle>
            <CardDescription className="text-zinc-300 font-semibold text-base">
              {formatBRL((currentPlanInfo.plans as any).price)}
              <span className="text-xs font-normal text-zinc-400">
                {" "}
                / {(currentPlanInfo.plans as any).billing_cycle === "monthly" ? "mês" : (currentPlanInfo.plans as any).billing_cycle}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Catálogo de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loadingPlans && (
          <div className="col-span-3 py-12 flex justify-center text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Carregando opções de planos...
          </div>
        )}

        {availablePlans.map((plan: any) => {
          const isCurrent = currentPlanInfo?.plan_id === plan.id;
          return (
            <Card
              key={plan.id}
              className={`bg-zinc-950/60 border ${
                isCurrent ? "border-amber-500/50" : "border-zinc-800 hover:border-zinc-700"
              } flex flex-col justify-between`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-base">{plan.name}</CardTitle>
                  {isCurrent && (
                    <Badge className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/20 text-[10px]">
                      Atual
                    </Badge>
                  )}
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {formatBRL(plan.price)}
                  <span className="text-xs font-normal text-zinc-400">
                    {" "}
                    / {plan.billing_cycle === "monthly" ? "mês" : plan.billing_cycle}
                  </span>
                </div>
                {plan.sessions_per_week && (
                  <p className="text-xs text-zinc-400 mt-1">
                    Até {plan.sessions_per_week} sessões / semana
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-2 text-xs text-zinc-300">
                {plan.description ? (
                  <p className="text-zinc-400 leading-relaxed">{plan.description}</p>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Acesso completo aos horários agendados</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  className="w-full text-xs font-medium"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || isProcessing}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {isCurrent ? (
                    "Plano Atual"
                  ) : (
                    <>
                      Migrar para este plano <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Modal de Confirmação & Seleção de Método */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Confirmar Migração de Plano
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Você está migrando para o plano{" "}
              <strong className="text-white">{selectedPlan?.name}</strong> no valor de{" "}
              <strong className="text-emerald-400">{formatBRL(selectedPlan?.price || 0)}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs text-zinc-300">
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-medium">
                <QrCode className="h-4 w-4 text-emerald-400" />
                <CreditCard className="h-4 w-4 text-blue-400" />
                <span>Pix ou Cartão de Crédito (InfinitePay)</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Você será redirecionado para a plataforma segura da InfinitePay. Assim que o pagamento for aprovado, seu novo plano é ativado automaticamente.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-300 font-medium">
                <Banknote className="h-4 w-4 text-amber-400" />
                <span>Pagar em Dinheiro</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Prefere pagar em dinheiro? Realize o pagamento presencialmente na recepção com o Coach para liberação imediata.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              disabled={isProcessing}
              onClick={() => setSelectedPlan(null)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={isProcessing}
              onClick={() => handleStartMigration(selectedPlan)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Gerando link...
                </>
              ) : (
                "Pagar com InfinitePay"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
