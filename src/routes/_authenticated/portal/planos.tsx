import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useServerFn } from "@tanstack/react-start";
import { getMyAvailablePlans } from "@/lib/payments.functions";
import { Clock, MessageCircle, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/portal/planos")({
  head: () => ({ meta: [{ title: "Planos e Matrícula — Portal do Aluno" }] }),
  component: PortalPlanosPage,
});

function PortalPlanosPage() {
  const fetchPlans = useServerFn(getMyAvailablePlans);

  const { data: plansData, isLoading } = useQuery({
    queryKey: ["portal-my-available-plans"],
    queryFn: () => fetchPlans(),
    staleTime: 60_000,
  });

  const currentPlan = plansData?.currentPlan;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Meu Plano & Assinatura
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe seu status atual e informações de matrícula no Montanha Personal Studio.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Carregando dados da assinatura...</p>
        </div>
      ) : (
        <>
          {/* Plano Atual Vigente */}
          {currentPlan ? (
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
              <CardContent className="pt-0 text-xs text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Sua matrícula e acesso aos treinos estão ativos normalmente.</span>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Status da Matrícula</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Você ainda não possui um plano registrado ou sua matrícula está em processo de ativação.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Aviso: Migração Online em Breve */}
          <Card className="border-border bg-card/60 backdrop-blur-sm p-6 text-center space-y-4 shadow-sm">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="h-6 w-6" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                Em Breve: Migração & Renovação Online
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Novidades na contratação de planos
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A possibilidade de migração, troca de planos e renovação online estará disponível em breve diretamente por este painel.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No momento, para contratar, renovar ou alterar seu plano, fale diretamente com nossa recepção ou com o Coach Montanha.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
                asChild
              >
                <a
                  href="https://wa.me/5561999999999?text=Olá!%20Gostaria%20de%20informações%20sobre%20planos%20e%20renovação."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-500" />
                  Falar no WhatsApp do Studio
                </a>
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
