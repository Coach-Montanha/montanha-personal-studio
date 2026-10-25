import { useState, useMemo } from "react";
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
  BarChart3,
  HelpCircle,
  Users2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";
import { downloadFormSubmissionPdf } from "@/lib/form-submission-pdf";
import { linkSubmissionToStudentServerFn, importGoogleFormSubmissionsServerFn, deleteSubmissionServerFn } from "@/lib/forms.functions";

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
  const [activeTab, setActiveTab] = useState<"resumo" | "pergunta" | "individual">("resumo");
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionItem | null>(null);
  const [linkTargetStudentId, setLinkTargetStudentId] = useState<string>("");
  const [linking, setLinking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [individualIdx, setIndividualIdx] = useState<number>(0);

  const activeSubmission = selectedSubmission || submissions[individualIdx] || submissions[0] || null;

  // Resolve rótulo amigável para qualquer chave
  const getFieldLabel = (key: string, formSlug?: string) => {
    let clean = key.replace(/^f_/, "");
    const matchedForm = forms.find(
      (f) =>
        f.slug.toLowerCase() === formSlug?.toLowerCase() ||
        f.id === formSlug
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

  // Coleta todas as perguntas definidas no formulário e cruza com as submissões
  const questionSummaries = useMemo(() => {
    const map = new Map<string, { label: string; responses: Array<{ respondent: string; answer: any; contact?: string; date: string }> }>();

    // 1. Inicializa com todos os campos oficiais de cada formulário
    for (const f of forms) {
      if (Array.isArray(f.fields)) {
        for (const fld of f.fields) {
          if (fld.label && !map.has(fld.label)) {
            map.set(fld.label, { label: fld.label, responses: [] });
          }
        }
      }
    }

    // 2. Preenche as respostas registradas
    for (const sub of submissions) {
      const date = new Date(sub.createdAt).toLocaleDateString("pt-BR");
      for (const [key, val] of Object.entries(sub.answers || {})) {
        if (key.startsWith("_")) continue;
        const label = getFieldLabel(key, sub.formSlug);
        if (!map.has(label)) {
          map.set(label, { label, responses: [] });
        }
        map.get(label)!.responses.push({
          respondent: sub.respondentName,
          contact: sub.respondentContact,
          answer: val,
          date,
        });
      }
    }

    return Array.from(map.values());
  }, [submissions, forms]);

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

  const handleUnlinkStudent = async (submissionId: string) => {
    setLinking(true);
    try {
      await linkSubmissionToStudentServerFn({
        data: {
          submissionId,
          studentId: null,
        },
      });
      toast.success("Vínculo desfeito com sucesso! A resposta agora está livre.");
      onRefresh();
    } catch (err: any) {
      toast.error(`Erro ao desvincular: ${err?.message || "tente novamente"}`);
    } finally {
      setLinking(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm("Tem certeza que deseja apagar permanentemente esta resposta do formulário?")) {
      return;
    }
    setLinking(true);
    try {
      await deleteSubmissionServerFn({
        data: { submissionId },
      });
      toast.success("Resposta do formulário apagada permanentemente!");
      setSelectedSubmission(null);
      setIndividualIdx(0);
      onRefresh();
    } catch (err: any) {
      toast.error(`Erro ao apagar resposta: ${err?.message || "tente novamente"}`);
    } finally {
      setLinking(false);
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
      <DialogContent className="max-w-5xl w-[96vw] h-[90dvh] max-h-[880px] flex flex-col p-0 overflow-hidden bg-background border-border shadow-2xl">
        <DialogHeader className="px-5 py-3.5 border-b border-border bg-card/70 backdrop-blur flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                <FileText className="h-3.5 w-3.5" />
                Google Forms Hub
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                {submissions.length} {submissions.length === 1 ? "resposta" : "respostas"}
              </span>
            </div>
            <DialogTitle className="text-lg font-bold text-foreground mt-1">
              Análise de Respostas dos Formulários
            </DialogTitle>
          </div>

          {/* Abas idênticas ao Google Forms: Resumo | Pergunta | Individual */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-muted p-1 border border-border/60">
              <button
                type="button"
                onClick={() => setActiveTab("resumo")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "resumo"
                    ? "bg-background text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Resumo
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pergunta")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "pergunta"
                    ? "bg-background text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Pergunta
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("individual")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "individual"
                    ? "bg-background text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users2 className="h-3.5 w-3.5" />
                Individual
              </button>
            </div>

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
                {importing ? "Importando..." : "Importar CSV"}
              </span>
            </label>
          </div>
        </DialogHeader>

        {submissions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 stroke-[1.2] text-muted-foreground/40 mb-3" />
            <p className="font-semibold text-foreground text-sm">Nenhuma resposta registrada ainda</p>
            <p className="text-xs max-w-sm mt-1">
              Assim que um aluno ou lead preencher qualquer formulário pelo link público ou importar do Google Forms, as análises completas aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* ABA 1: RESUMO (Cards por pergunta com estatísticas e barras de distribuição) */}
            {activeTab === "resumo" && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-muted/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-card border border-border rounded-xl p-4 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Total de Respostas
                    </span>
                    <p className="text-2xl font-extrabold text-foreground mt-1">{submissions.length}</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Perguntas Mapeadas
                    </span>
                    <p className="text-2xl font-extrabold text-primary mt-1">{questionSummaries.length}</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Alunos Vinculados
                    </span>
                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                      {submissions.filter((s) => s.studentId).length}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {questionSummaries.map((q, idx) => {
                    // Contagem de valores para gerar barras de frequência
                    const valueCounts: Record<string, number> = {};
                    let totalCounted = 0;

                    for (const r of q.responses) {
                      const valStr = Array.isArray(r.answer)
                        ? r.answer.join(", ")
                        : typeof r.answer === "boolean"
                        ? r.answer
                          ? "Sim"
                          : "Não"
                        : String(r.answer || "").trim();

                      if (!valStr) continue;
                      valueCounts[valStr] = (valueCounts[valStr] || 0) + 1;
                      totalCounted++;
                    }

                    const sortedCounts = Object.entries(valueCounts).sort((a, b) => b[1] - a[1]);
                    const isChoiceQuestion = sortedCounts.length > 0 && sortedCounts.length <= 10;

                    return (
                      <div
                        key={idx}
                        className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3.5"
                      >
                        <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                          <h3 className="font-bold text-sm text-foreground leading-snug">
                            {q.label}
                          </h3>
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {q.responses.length} {q.responses.length === 1 ? "resposta" : "respostas"}
                          </span>
                        </div>

                        {isChoiceQuestion ? (
                          /* Visualização em Barras estilo Google Forms */
                          <div className="space-y-2.5 pt-1">
                            {sortedCounts.map(([val, count]) => {
                              const pct = Math.round((count / (totalCounted || 1)) * 100);
                              return (
                                <div key={val} className="space-y-1">
                                  <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-foreground max-w-[80%] truncate">{val}</span>
                                    <span className="text-muted-foreground font-mono">
                                      {count} ({pct}%)
                                    </span>
                                  </div>
                                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-primary/80 transition-all duration-500"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Visualização de Lista de Respostas Textuais */
                          <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-border/40">
                            {q.responses.map((r, rIdx) => (
                              <div key={rIdx} className="pt-2 pb-1 text-xs flex flex-col gap-0.5">
                                <span className="font-medium text-foreground">
                                  {Array.isArray(r.answer)
                                    ? r.answer.join(", ")
                                    : String(r.answer || "—")}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {r.respondent} • {r.date}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ABA 2: PERGUNTA (Navegue pergunta por pergunta estilo Google Forms) */}
            {activeTab === "pergunta" && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-muted/10">
                {questionSummaries.length > 0 && (
                  <>
                    {/* Seletor de Pergunta */}
                    <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        disabled={selectedQuestionIdx <= 0}
                        onClick={() => setSelectedQuestionIdx((p) => Math.max(0, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex-1 text-center min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Pergunta {selectedQuestionIdx + 1} de {questionSummaries.length}
                        </span>
                        <h3 className="font-extrabold text-sm sm:text-base text-foreground truncate mt-0.5">
                          {questionSummaries[selectedQuestionIdx]?.label}
                        </h3>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        disabled={selectedQuestionIdx >= questionSummaries.length - 1}
                        onClick={() =>
                          setSelectedQuestionIdx((p) => Math.min(questionSummaries.length - 1, p + 1))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Respostas da Pergunta Selecionada */}
                    <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {questionSummaries[selectedQuestionIdx]?.responses.length} Respostas Registradas
                      </h4>

                      <div className="divide-y divide-border/50">
                        {questionSummaries[selectedQuestionIdx]?.responses.map((r, idx) => (
                          <div key={idx} className="py-3 flex items-start justify-between gap-3 text-xs">
                            <div className="space-y-1 min-w-0 flex-1">
                              <p className="font-semibold text-foreground text-sm">
                                {Array.isArray(r.answer)
                                  ? r.answer.join(", ")
                                  : typeof r.answer === "boolean"
                                  ? r.answer
                                    ? "Sim"
                                    : "Não"
                                  : String(r.answer || "—")}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Respondido por: <strong className="text-foreground">{r.respondent}</strong> ({r.contact || "Sem contato"})
                              </p>
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{r.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ABA 3: INDIVIDUAL (Visualização completa por ficha/respondente) */}
            {activeTab === "individual" && (
              <div className="flex-1 min-h-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Lista Lateral de Envios */}
                <div className="w-full md:w-80 flex-shrink-0 overflow-y-auto divide-y divide-border bg-muted/20">
                  {submissions.map((sub, sIdx) => {
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
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setIndividualIdx(sIdx);
                        }}
                        className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1.5 ${
                          isSelected
                            ? "bg-primary/10 border-l-4 border-l-primary"
                            : "hover:bg-muted/40 border-l-4 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-semibold text-sm truncate ${
                              isSelected ? "text-primary dark:text-white" : "text-foreground"
                            }`}
                          >
                            {sub.respondentName}
                          </span>
                          <span
                            className={`text-[10px] flex items-center gap-1 flex-shrink-0 ${
                              isSelected ? "text-primary/80 dark:text-slate-300" : "text-muted-foreground"
                            }`}
                          >
                            <Clock className="h-3 w-3" />
                            {date}
                          </span>
                        </div>

                        <p
                          className={`text-xs font-semibold truncate ${
                            isSelected ? "text-primary dark:text-white" : "text-primary"
                          }`}
                        >
                          {sub.formTitle}
                        </p>

                        <div
                          className={`flex items-center justify-between text-[11px] mt-0.5 ${
                            isSelected ? "text-foreground/90 dark:text-slate-200" : "text-muted-foreground"
                          }`}
                        >
                          <span className="truncate max-w-[130px] font-medium">
                            {sub.respondentContact || "Sem telefone"}
                          </span>
                          {sub.studentId ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                              <CheckCircle2 className="h-3 w-3" /> Vinculado
                            </span>
                          ) : (
                            <span
                              className={`text-[10px] font-medium ${
                                isSelected
                                  ? "text-amber-700 dark:text-amber-300 font-bold"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            >
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
                    {/* Header com Navegador de Fichas estilo Google Forms */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border rounded-xl p-4 shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Resposta {individualIdx + 1} de {submissions.length}
                        </span>
                        <h3 className="text-base font-extrabold text-foreground mt-0.5">
                          {activeSubmission.respondentName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {activeSubmission.formTitle} • {new Date(activeSubmission.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          disabled={individualIdx <= 0}
                          onClick={() => {
                            const newIdx = Math.max(0, individualIdx - 1);
                            setIndividualIdx(newIdx);
                            setSelectedSubmission(submissions[newIdx]);
                          }}
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs"
                          disabled={individualIdx >= submissions.length - 1}
                          onClick={() => {
                            const newIdx = Math.min(submissions.length - 1, individualIdx + 1);
                            setIndividualIdx(newIdx);
                            setSelectedSubmission(submissions[newIdx]);
                          }}
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1.5 font-bold"
                          disabled={downloading}
                          onClick={() => handleDownloadPdf(activeSubmission)}
                        >
                          <Download className="h-3.5 w-3.5 text-primary" />
                          {downloading ? "Exportando..." : "Baixar PDF"}
                        </Button>
                      </div>
                    </div>

                    {/* Vínculo de Aluno */}
                    <div className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Vínculo com Aluno Cadastrado
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive gap-1"
                          onClick={() => handleDeleteSubmission(activeSubmission.id)}
                          disabled={linking}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Apagar Resposta
                        </Button>
                      </div>
                      {activeSubmission.studentId ? (
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-xs">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>Vinculada ao aluno cadastrado no sistema.</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 gap-1"
                            onClick={() => handleUnlinkStudent(activeSubmission.id)}
                            disabled={linking}
                          >
                            <Unlink className="h-3 w-3" />
                            Desvincular
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
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

                    {/* Respostas Detalhadas com labels legíveis */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Respostas da Ficha
                      </h4>

                      <div className="space-y-2">
                        {Object.entries(activeSubmission.answers || {}).length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">
                            Nenhum campo adicional preenchido.
                          </p>
                        ) : (
                          Object.entries(activeSubmission.answers).map(([key, val]) => {
                            const displayLabel = getFieldLabel(key, activeSubmission.formSlug);

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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
