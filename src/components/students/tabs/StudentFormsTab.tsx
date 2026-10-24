import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { downloadFormSubmissionPdf } from "@/lib/form-submission-pdf";
import { type FormSubmissionItem } from "@/components/forms/FormSubmissionsDialog";
import { DEFAULT_STUDIO_FORMS } from "@/lib/forms-definitions";

interface StudentFormsTabProps {
  studentId: string;
  studentName: string;
  submissions: FormSubmissionItem[];
  forms?: Array<{ id: string; slug: string; title: string; fields?: Array<{ id: string; label: string }> }>;
  onRefresh?: () => void;
}

export function StudentFormsTab({
  studentId,
  studentName,
  submissions,
  forms = [],
  onRefresh,
}: StudentFormsTabProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [expandedSubIds, setExpandedSubIds] = useState<Record<string, boolean>>({});

  // Filtra as submissões vinculadas a este aluno
  const studentSubmissions = useMemo(() => {
    return submissions.filter(
      (s) =>
        s.studentId === studentId ||
        (s.respondentName &&
          studentName &&
          s.respondentName.trim().toLowerCase() === studentName.trim().toLowerCase())
    );
  }, [submissions, studentId, studentName]);

  const toggleExpand = (id: string) => {
    setExpandedSubIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getFieldLabel = (key: string, formSlug?: string) => {
    let clean = key.replace(/^f_/, "");

    // 1. Procura na lista de formulários carregados
    const allForms = [...forms, ...DEFAULT_STUDIO_FORMS];
    const matchedForm = allForms.find(
      (f) =>
        f.slug.toLowerCase() === formSlug?.toLowerCase() ||
        f.id.toLowerCase() === formSlug?.toLowerCase()
    );

    if (matchedForm && matchedForm.fields) {
      const matchedField = matchedForm.fields.find(
        (fld) =>
          fld.id === key ||
          fld.id === "f_" + key ||
          fld.id.replace(/^f_/, "") === key.replace(/^f_/, "")
      );
      if (matchedField?.label) {
        return matchedField.label;
      }
    }

    if (/^\d+$/.test(clean)) {
      return `Pergunta ${clean}`;
    }
    return clean.replace(/_/g, " ");
  };

  const handleDownloadPdf = async (sub: FormSubmissionItem) => {
    setDownloadingId(sub.id);
    try {
      await downloadFormSubmissionPdf({
        submissionId: sub.id,
        formTitle: sub.formTitle,
        respondentName: sub.respondentName,
        respondentContact: sub.respondentContact,
        createdAt: sub.createdAt,
        answers: sub.answers,
        fieldLabels: forms.flatMap((f) => f.fields || []).reduce((acc, cur) => {
          acc[cur.id] = cur.label;
          acc[cur.id.replace(/^f_/, "")] = cur.label;
          return acc;
        }, {} as Record<string, string>),
      });
      toast.success("PDF da ficha gerado com sucesso!");
    } catch (err: any) {
      toast.error(`Erro ao gerar PDF: ${err?.message || "tente novamente"}`);
    } finally {
      setDownloadingId(null);
    }
  };

  if (studentSubmissions.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 grid place-items-center text-primary mb-3">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          Nenhum formulário ou anamnese vinculado
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
          Quando o aluno preencher um formulário pelo link público do Studio ou no Google Forms,
          a resposta poderá ser vinculada aqui automaticamente ou pela <strong>Central de Formulários</strong>.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
            <a href="/formularios">
              <ExternalLink className="h-3.5 w-3.5" />
              Ir para Central de Formulários
            </a>
          </Button>
          {onRefresh && (
            <Button size="sm" variant="ghost" onClick={onRefresh} className="text-xs">
              Atualizar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Formulários & Anamneses de {studentName}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {studentSubmissions.length}{" "}
            {studentSubmissions.length === 1 ? "ficha respondida" : "fichas respondidas"} registradas.
          </p>
        </div>
        {onRefresh && (
          <Button size="sm" variant="outline" onClick={onRefresh} className="text-xs h-8">
            Atualizar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {studentSubmissions.map((sub) => {
          const isExpanded = expandedSubIds[sub.id] ?? true;
          const date = new Date(sub.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          const answersEntries = Object.entries(sub.answers || {}).filter(
            ([k]) => !k.startsWith("_")
          );

          return (
            <Card key={sub.id} className="overflow-hidden border border-border shadow-xs">
              {/* Header da Ficha */}
              <div className="p-4 sm:p-5 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Ficha Concluída
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {date}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{sub.formTitle}</h3>
                  <p className="text-xs text-muted-foreground">
                    Respondido por <strong>{sub.respondentName}</strong>
                    {sub.respondentContact ? ` • ${sub.respondentContact}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5"
                    disabled={downloadingId === sub.id}
                    onClick={() => handleDownloadPdf(sub)}
                  >
                    <Download className="h-3.5 w-3.5 text-primary" />
                    {downloadingId === sub.id ? "Gerando PDF..." : "Baixar PDF"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleExpand(sub.id)}
                    title={isExpanded ? "Recolher perguntas" : "Expandir perguntas"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Corpo de Perguntas e Respostas */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-muted/10 space-y-3">
                  {answersEntries.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      Nenhum campo adicional registrado nesta submissão.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {answersEntries.map(([key, val]) => {
                        const displayLabel = getFieldLabel(key, sub.formSlug);
                        let formattedVal = "";

                        if (typeof val === "boolean") {
                          formattedVal = val ? "Sim / Aceito" : "Não";
                        } else if (Array.isArray(val)) {
                          formattedVal = val.join(", ");
                        } else {
                          formattedVal = String(val || "—");
                        }

                        return (
                          <div
                            key={key}
                            className="bg-card border border-border/80 rounded-xl p-3.5 text-xs space-y-1.5 shadow-xs"
                          >
                            <span className="font-semibold text-muted-foreground text-[11px] block leading-tight">
                              {displayLabel}
                            </span>
                            <p className="text-foreground font-semibold text-sm whitespace-pre-wrap leading-snug">
                              {formattedVal}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
