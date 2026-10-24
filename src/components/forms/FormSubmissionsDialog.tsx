import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Link as LinkIcon,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Clock,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { downloadFormSubmissionPdf } from "@/lib/form-submission-pdf";
import { linkSubmissionToStudentServerFn, importGoogleFormSubmissionsServerFn } from "@/lib/forms.functions";

export interface FormSubmissionItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  formSlug: string;
  formTitle: string;
  respondentName: string;
  respondentContact: string;
  studentId: string | null;
  answers: Record<string, any>;
}

interface FormSubmissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissions: FormSubmissionItem[];
  forms?: Array<{ id: string; slug: string; title: string; fields?: Array<{ id: string; label: string }> }>;
  students: Array<{ id: string; name: string }>;
  onRefresh: () => void;
}

export function FormSubmissionsDialog({
  open,
  onOpenChange,
  submissions,
  forms = [],
  students,
  onRefresh,
}: FormSubmissionsDialogProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionItem | null>(null);
  const [linkTargetStudentId, setLinkTargetStudentId] = useState<string>("");
  const [linking, setLinking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [importing, setImporting] = useState(false);

  const activeSubmission = selectedSubmission || submissions[0] || null;

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        toast.error("O arquivo CSV precisa conter ao menos uma linha de cabeçalho e uma de dados.");
        return;
      }

      // Função simples e robusta para parsear CSV com aspas
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' || char === "'") {
            inQuotes = !inQuotes;
          } else if ((char === "," || char === ";") && !inQuotes) {
            result.push(cur.trim().replace(/^["']|["']$/g, ""));
            cur = "";
          } else {
            cur += char;
          }
        }
        result.push(cur.trim().replace(/^["']|["']$/g, ""));
        return result;
      };

      const headers = parseCSVLine(lines[0]);
      const items = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length === 0 || cols.every((c) => !c)) continue;

        let respondentName = "";
        let respondentContact = "";
        let submittedAt = "";
        const answers: Record<string, any> = {};

        cols.forEach((colVal, idx) => {
          const header = (headers[idx] || `Pergunta ${idx + 1}`).trim();
          const cleanHeader = header.toLowerCase();

          if (/nome|aluno|respondente/i.test(cleanHeader) && !respondentName) {
            respondentName = colVal;
          } else if (/email|e-mail|whatsapp|telefone|contato|celular/i.test(cleanHeader) && !respondentContact) {
            respondentContact = colVal;
          } else if (/carimbo|data|timestamp|hora/i.test(cleanHeader) && !submittedAt) {
            submittedAt = colVal;
          } else {
            answers[header] = colVal;
          }
        });

        items.push({
          respondentName: respondentName || `Respondente ${i}`,
          respondentContact,
          submittedAt,
          answers,
        });
      }

      if (items.length === 0) {
        toast.error("Nenhuma resposta válida identificada no CSV.");
        return;
      }

      const res = await importGoogleFormSubmissionsServerFn({
        data: {
          formSlug: activeSubmission?.formSlug || "historico-google-forms",
          formTitle: activeSubmission?.formTitle || file.name.replace(/\.[^/.]+$/, ""),
          items,
        },
      });

      toast.success(`${res.insertedCount} respostas do Google Forms importadas com sucesso!`);
      onRefresh();
    } catch (err: any) {
      toast.error(`Falha ao importar CSV: ${err?.message || "verifique o formato"}`);
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleDownloadPdf = async (sub: FormSubmissionItem) => {
    setDownloading(true);
    try {
      await downloadFormSubmissionPdf({
        formTitle: sub.formTitle,
        formSlug: sub.formSlug,
        respondentName: sub.respondentName,
        respondentContact: sub.respondentContact,
        submittedAt: sub.createdAt,
        protocol: `SUB-${sub.id.slice(0, 8).toUpperCase()}`,
        answers: sub.answers,
        businessName: "MONTANHA PERSONAL STUDIO",
      });
      toast.success("PDF gerado e baixado com sucesso!");
    } catch (err: any) {
      toast.error(`Erro ao gerar PDF: ${err?.message || "falha inesperada"}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleLinkStudent = async (submissionId: string) => {
    if (!linkTargetStudentId) {
      toast.error("Selecione um aluno para vincular.");
      return;
    }
    setLinking(true);
    try {
      await linkSubmissionToStudentServerFn({
        data: {
          submissionId,
          studentId: linkTargetStudentId,
        },
      });
      toast.success("Resposta vinculada com sucesso ao perfil do aluno!");
      onRefresh();
    } catch (err: any) {
      toast.error(`Erro ao vincular: ${err?.message || "tente novamente"}`);
    } finally {
      setLinking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[96vw] h-[88dvh] max-h-[850px] flex flex-col p-0 overflow-hidden bg-background border-border shadow-2xl">
        <DialogHeader className="px-5 py-4 border-b border-border bg-card/60 backdrop-blur flex-shrink-0 flex flex-row items-center justify-between text-left">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                <FileText className="h-3.5 w-3.5" />
                Respostas & Protocolos
              </span>
              <span className="text-xs text-muted-foreground">
                ({submissions.length} {submissions.length === 1 ? "envio" : "envios"})
              </span>
            </div>
            <DialogTitle className="text-lg font-bold text-foreground mt-1">
              Submissões dos Formulários Oficiais
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Acesse respostas enviadas por alunos e novos leads, exporte termos em PDF e vincule aos perfis.
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                disabled={importing}
                onChange={handleImportCsv}
              />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-muted/60 text-foreground transition-all shadow-xs cursor-pointer">
                <Upload className="h-3.5 w-3.5 text-primary" />
                {importing ? "Importando CSV..." : "Importar CSV do Google"}
              </span>
            </label>
          </div>
        </DialogHeader>

        {submissions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 stroke-[1.2] text-muted-foreground/40 mb-3" />
            <p className="font-semibold text-foreground text-sm">Nenhuma resposta registrada ainda</p>
            <p className="text-xs max-w-sm mt-1">
              Assim que um aluno ou lead preencher qualquer formulário pelo link público, o registro aparecerá aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Lista Lateral de Envios */}
            <div className="w-full md:w-80 flex-shrink-0 overflow-y-auto divide-y divide-border bg-muted/20">
              {submissions.map((sub) => {
                const isSelected = activeSubmission?.id === sub.id;
                const date = new Date(sub.createdAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-primary/10 border-l-4 border-l-primary"
                        : "hover:bg-muted/40 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold text-sm truncate ${isSelected ? "text-primary dark:text-white" : "text-foreground"}`}>
                        {sub.respondentName}
                      </span>
                      <span className={`text-[10px] flex items-center gap-1 flex-shrink-0 ${isSelected ? "text-primary/80 dark:text-slate-300" : "text-muted-foreground"}`}>
                        <Clock className="h-3 w-3" />
                        {date}
                      </span>
                    </div>

                    <p className={`text-xs font-semibold truncate ${isSelected ? "text-primary dark:text-white" : "text-primary"}`}>
                      {sub.formTitle}
                    </p>

                    <div className={`flex items-center justify-between text-[11px] mt-0.5 ${isSelected ? "text-foreground/90 dark:text-slate-200" : "text-muted-foreground"}`}>
                      <span className="truncate max-w-[130px] font-medium">
                        {sub.respondentContact || "Sem telefone"}
                      </span>
                      {sub.studentId ? (
                        <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> Vinculado
                        </span>
                      ) : (
                        <span className={`text-[10px] font-medium ${isSelected ? "text-amber-700 dark:text-amber-300 font-bold" : "text-amber-600 dark:text-amber-400"}`}>
                          Pendente
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detalhes da Submissão Selecionada */}
            {activeSubmission && (
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Topo do Registro */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-primary">
                        {activeSubmission.formTitle}
                      </span>
                      <h3 className="text-base font-bold text-foreground">
                        {activeSubmission.respondentName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 gap-1.5 text-xs font-semibold"
                        onClick={() => handleDownloadPdf(activeSubmission)}
                        disabled={downloading}
                      >
                        <Download className="h-3.5 w-3.5" />
                        {downloading ? "Gerando..." : "Baixar PDF Oficial"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{activeSubmission.respondentContact || "Não informado"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{new Date(activeSubmission.createdAt).toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span className="font-mono font-medium">
                        SUB-{activeSubmission.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vínculo com Aluno */}
                <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    Vínculo com Perfil do Aluno
                  </h4>
                  {activeSubmission.studentId ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Esta submissão está vinculada a um aluno do seu Studio.
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                      <select
                        aria-label="Vincular ao aluno"
                        className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={linkTargetStudentId}
                        onChange={(e) => setLinkTargetStudentId(e.target.value)}
                      >
                        <option value="">Selecione um aluno cadastrado...</option>
                        {students.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-9 text-xs gap-1.5 whitespace-nowrap"
                        disabled={linking || !linkTargetStudentId}
                        onClick={() => handleLinkStudent(activeSubmission.id)}
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        {linking ? "Vinculando..." : "Vincular a este Aluno"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Respostas Detalhadas */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Perguntas & Respostas
                  </h4>

                  <div className="space-y-2">
                    {Object.entries(activeSubmission.answers || {}).length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">
                        Nenhum campo adicional preenchido.
                      </p>
                    ) : (
                      Object.entries(activeSubmission.answers).map(([key, val]) => {
                        // Resolução de rótulo amigável caso seja ID numérico (ex: f_110748093)
                        let displayLabel = key.replace(/^f_/, "");
                        const matchedForm = forms.find(
                          (f) =>
                            f.slug.toLowerCase() === activeSubmission.formSlug?.toLowerCase() ||
                            f.id === activeSubmission.formSlug
                        );
                        if (matchedForm && matchedForm.fields) {
                          const matchedField = matchedForm.fields.find(
                            (fld) =>
                              fld.id === key ||
                              fld.id === "f_" + key ||
                              fld.id.replace(/^f_/, "") === key.replace(/^f_/, "")
                          );
                          if (matchedField?.label) {
                            displayLabel = matchedField.label;
                          }
                        }

                        // Se ainda for numérico puro, limpa o prefixo
                        if (/^\d+$/.test(displayLabel)) {
                          displayLabel = `Pergunta ${displayLabel}`;
                        } else {
                          displayLabel = displayLabel.replace(/_/g, " ");
                        }

                        return (
                          <div
                            key={key}
                            className="bg-card border border-border rounded-lg p-3 text-xs space-y-1"
                          >
                            <span className="font-semibold text-muted-foreground">
                              {displayLabel}:
                            </span>
                            <div className="text-foreground font-medium whitespace-pre-wrap pl-1">
                              {typeof val === "boolean"
                                ? val
                                  ? "Sim / Aceito"
                                  : "Não"
                                : Array.isArray(val)
                                ? val.join(", ")
                                : String(val || "—")}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
