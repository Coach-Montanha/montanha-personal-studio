import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { getMyAvailablePlans, createPlanCheckoutOrder, type PlanItem } from "@/lib/payments.functions";
import { Check, CreditCard, QrCode, Banknote, Sparkles, Loader2, ArrowRight, UserCheck } from "lucide-react";
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
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [activeTab, setActiveTab] = useState<"studio" | "pt">("studio");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPlans = useServerFn(getMyAvailablePlans);
  const createCheckout = useServerFn(createPlanCheckoutOrder);

  const { data: plansData, isLoading, refetch } = useQuery({
    queryKey: ["portal-my-available-plans"],
    queryFn: () => fetchPlans(),
    staleTime: 60_000,
  });

  // Define tab inicial conforme o modo do aluno
  const mode = plansData?.mode ?? "studio";
  const currentTab = mode === "pt" ? "pt" : mode === "studio" ? "studio" : activeTab;

  const currentPlan = plansData?.currentPlan;
  const plansToShow = currentTab === "pt" ? (plansData?.ptPlans ?? []) : (plansData?.studioPlans ?? []);

  const handleStartMigration = async (plan: PlanItem) => {
    const studentId = plan.type === "pt" ? plansData?.ptStudentId : plansData?.studentId;

    if (!studentId) {
      toast.error("Cadastro do aluno não identificado.");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await createCheckout({
        data: {
          studentId,
          planId: plan.id,
          planType: plan.type,
        },
      });

      if (res.checkoutUrl) {
        toast.success("Redirecionando para o Checkout InfinitePay...");
        window.location.href = res.checkoutUrl;
      } else {
        toast.info("Pedido registrado! Complete no balcão ou com a InfinitePay.");
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
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Planos & Migração de Assinatura
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Altere ou renove o seu plano no Montanha Personal Studio. Pagamento instantâneo via Pix ou Cartão.
        </p>
      </div>

      {/* Tabs para alunos híbridos */}
      {mode === "both" && (
        <div className="flex border-b border-border gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("studio")}
            className={`pb-2 px-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "studio"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Aulas Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pt")}
            className={`pb-2 px-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "pt"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Personal Trainer
          </button>
        </div>
      )}

      {/* Plano Atual Vigente */}
      {currentPlan && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-primary text-primary">
                Seu Plano Vigente
              </Badge>
              <span className="text-xs text-muted-foreground uppercase font-medium">
                {currentPlan.type === "pt" ? "Personal Trainer" : "Studio"}
              </span>
            </div>
            <CardTitle className="text-lg text-foreground mt-1">
              {currentPlan.name}
            </CardTitle>
            <CardDescription className="text-foreground font-semibold text-base">
              {formatBRL(currentPlan.price)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / {currentPlan.billing_cycle === "monthly" ? "mês" : currentPlan.billing_cycle}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Catálogo de Planos */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Carregando planos disponíveis...</p>
        </div>
      ) : plansToShow.length === 0 ? (
        <div className="py-12 text-center rounded-xl border border-dashed border-border p-6 bg-card">
          <UserCheck className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-foreground">Nenhum plano disponível no momento</p>
          <p className="text-xs text-muted-foreground mt-1">
            Entre em contato com o Studio para ativar a sua assinatura.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plansToShow.map((plan) => {
            const isCurrent = currentPlan?.id === plan.id;
            return (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between transition-all duration-200 border ${
                  isCurrent ? "border-primary shadow-sm bg-card" : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-foreground text-base">{plan.name}</CardTitle>
                    {isCurrent && (
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20 text-[10px]">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">
                    {formatBRL(plan.price)}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}
                      / {plan.billing_cycle === "monthly" ? "mês" : plan.billing_cycle}
                    </span>
                  </div>
                  {plan.sessions_count != null && plan.sessions_count > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {plan.type === "pt"
                        ? `${plan.sessions_count} sessões de Personal`
                        : `Até ${plan.sessions_count} aulas / semana`}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-2 text-xs text-foreground/80">
                  {plan.description ? (
                    <p className="text-muted-foreground leading-relaxed">{plan.description}</p>
                  ) : (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Acesso completo ao agendamento de treinos</span>
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
      )}

      {/* Modal de Confirmação & Seleção de Método */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Confirmar Migração de Plano
            </DialogTitle>
            <DialogDescription className="text-xs">
              Você está contratando o plano{" "}
              <strong className="text-foreground">{selectedPlan?.name}</strong> no valor de{" "}
              <strong className="text-emerald-500 font-bold">{formatBRL(selectedPlan?.price || 0)}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <QrCode className="h-4 w-4 text-emerald-500" />
                <CreditCard className="h-4 w-4 text-primary" />
                <span>Pix ou Cartão de Crédito (InfinitePay)</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Você será redirecionado para a tela segura da InfinitePay. Assim que o pagamento for aprovado, seu novo plano é liberado na hora.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card space-y-1.5">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Banknote className="h-4 w-4 text-amber-500" />
                <span>Pagar em Dinheiro</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
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
              onClick={() => selectedPlan && handleStartMigration(selectedPlan)}
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
