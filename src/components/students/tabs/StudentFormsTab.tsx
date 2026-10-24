import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  ShieldCheck,
  FileCheck2,
  Printer,
  Sparkles,
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
      toast.success("PDF oficial gerado com sucesso!");
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-primary" />
            Prontuário & Fichas de {studentName}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Documento com histórico de declarações de saúde, anamnese e consentimentos para acompanhamento seguro.
          </p>
        </div>
        {onRefresh && (
          <Button size="sm" variant="outline" onClick={onRefresh} className="text-xs h-8 self-start sm:self-auto">
            Atualizar
          </Button>
        )}
      </div>

      <div className="space-y-6">
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
            <div
              key={sub.id}
              className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden transition-all duration-200"
            >
              {/* Cabeçalho do Prontuário */}
              <div className="p-4 sm:p-6 bg-muted/20 border-b border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" /> Ficha Validada no Sistema
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {date}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                    {sub.formTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-primary" />
                      Respondente: <strong className="text-foreground ml-0.5">{sub.respondentName}</strong>
                    </span>
                    {sub.respondentContact && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        Contato: <strong className="text-foreground ml-0.5">{sub.respondentContact}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="h-9 px-3.5 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                    disabled={downloadingId === sub.id}
                    onClick={() => handleDownloadPdf(sub)}
                  >
                    <Download className="h-4 w-4" />
                    {downloadingId === sub.id ? "Gerando..." : "Baixar PDF Oficial"}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => toggleExpand(sub.id)}
                    title={isExpanded ? "Recolher prontuário" : "Expandir prontuário"}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Corpo em Texto Organizado e Contínuo (Formato Ficha Médica / Prontuário) */}
              {isExpanded && (
                <div className="p-5 sm:p-7 space-y-6 bg-card text-foreground">
                  {answersEntries.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      Nenhuma resposta registrada para esta ficha.
                    </p>
                  ) : (
                    <div className="space-y-5 divide-y divide-border/40">
                      {answersEntries.map(([key, val], idx) => {
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
                            className={`space-y-1.5 ${idx > 0 ? "pt-4" : ""}`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground shrink-0 mt-0.5">
                                {idx + 1}.
                              </span>
                              <div className="space-y-1 flex-1">
                                <h4 className="text-xs sm:text-sm font-bold text-muted-foreground leading-snug">
                                  {displayLabel}
                                </h4>
                                <div className="text-foreground text-sm sm:text-base font-medium leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/50">
                                  {formattedVal}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Rodapé Jurídico de Autenticidade */}
                  <div className="mt-8 pt-4 border-t border-dashed border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-muted-foreground bg-muted/10 p-4 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>
                        Registro arquivado com autenticidade eletrônica no banco de dados do Studio.
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ID: {sub.id.slice(0, 18)}...
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
