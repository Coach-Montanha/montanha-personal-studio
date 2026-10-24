import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { listStudioForms, StudioFormItem } from "@/lib/forms-store";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Clock,
  ClipboardList,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { FormEmbedDialog } from "@/components/forms/FormEmbedDialog";

export const Route = createFileRoute("/_authenticated/portal/formularios")({
  component: PortalFormulariosPage,
});

function PortalFormulariosPage() {
  const [forms] = useState<StudioFormItem[]>(() => listStudioForms());
  const [selectedForm, setSelectedForm] = useState<StudioFormItem | null>(null);

  const studentForms = useMemo(() => {
    return forms.filter((f) => f.visibleToStudents);
  }, [forms]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-md">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Meus Formulários & Avaliações
              </h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Oficial
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Mantenha seu histórico e informações atualizadas para prescrições de treino mais precisas e seguras.
            </p>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      {studentForms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-card/40">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold text-foreground">Nenhum questionário pendente</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Seu treinador ainda não publicou novos formulários para o seu perfil.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentForms.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    {item.badge || item.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    ~{item.estimatedMinutes || 3} min
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {item.description || "Questionário de acompanhamento do Studio."}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <Button
                  onClick={() => setSelectedForm(item)}
                  size="sm"
                  className="font-bold text-xs gap-1.5 shadow-sm"
                >
                  Preencher Agora
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  title="Abrir no Google Forms externo"
                >
                  <a href={item.googleFormUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Abrir Externo
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded Dialog */}
      <FormEmbedDialog
        form={selectedForm}
        open={!!selectedForm}
        onOpenChange={(open) => !open && setSelectedForm(null)}
      />
    </div>
  );
}
