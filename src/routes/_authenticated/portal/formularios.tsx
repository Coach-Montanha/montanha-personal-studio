import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { listStudioForms, StudioFormItem } from "@/lib/forms-store";
import { listFormsServerFn, listSubmissionsServerFn } from "@/lib/forms.functions";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Clock,
  ClipboardList,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { downloadFormSubmissionPdf } from "@/lib/form-submission-pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/formularios")({
  head: () => ({ meta: [{ title: "Meus Formulários e Anamnese — Portal do Aluno" }] }),
  component: PortalFormulariosPage,
});

function PortalFormulariosPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"disponiveis" | "respondidos">("disponiveis");
  const [forms, setForms] = useState<StudioFormItem[]>(() => listStudioForms());
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [studentInfo, setStudentInfo] = useState<{ id: string; name: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [expandedSubIds, setExpandedSubIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Busca dados do aluno autenticado
        if (user?.id) {
          const { data: st } = await supabase
            .from("students")
            .select("id, name")
            .eq("account_user_id", user.id)
            .maybeSingle();

          if (st) {
            setStudentInfo(st);
          } else {
            // Tenta pt_students
            const { data: ptSt } = await supabase
              .from("pt_students")
              .select("id, name")
              .eq("account_user_id", user.id)
              .maybeSingle();
            if (ptSt) setStudentInfo(ptSt);
          }
        }

        // 2. Busca formulários disponíveis e submissões
        const [formsData, subsData] = await Promise.all([
          listFormsServerFn(),
          listSubmissionsServerFn(),
        ]);

        if (Array.isArray(formsData) && formsData.length > 0) {
          setForms(formsData);
        }
        if (Array.isArray(subsData)) {
          setMySubmissions(subsData);
        }
      } catch (err) {
        console.warn("Erro ao carregar dados do portal de formulários:", err);
      }
    }
    loadData();
  }, [user?.id]);

  // Formulários que o aluno pode responder
  const studentForms = useMemo(() => {
    return forms.filter((f) => f.visibleToStudents);
  }, [forms]);

  // Submissões pertencentes a este aluno (por studentId ou nome)
  const studentAnswers = useMemo(() => {
    if (!studentInfo) return [];
    return mySubmissions.filter(
      (sub) =>
        sub.studentId === studentInfo.id ||
        (sub.respondentName &&
          studentInfo.name &&
          sub.respondentName.trim().toLowerCase() === studentInfo.name.trim().toLowerCase())
    );
  }, [mySubmissions, studentInfo]);

  const toggleExpand = (id: string) => {
    setExpandedSubIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadPdf = async (sub: any) => {
    setDownloadingId(sub.id);
    try {
      await downloadFormSubmissionPdf({
        submissionId: sub.id,
        formTitle: sub.formTitle,
        respondentName: sub.respondentName,
        respondentContact: sub.respondentContact,
        createdAt: sub.createdAt,
        answers: sub.answers,
        fieldLabels: forms.flatMap((f: any) => f.fields || []).reduce((acc: any, cur: any) => {
          acc[cur.id] = cur.label;
          acc[cur.id.replace(/^f_/, "")] = cur.label;
          return acc;
        }, {} as Record<string, string>),
      });
      toast.success("PDF do prontuário gerado!");
    } catch (err: any) {
      toast.error(`Erro ao gerar PDF: ${err?.message || "tente novamente"}`);
    } finally {
      setDownloadingId(null);
    }
  };

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
                Meus Formulários & Anamnese
              </h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Oficial
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Preencha suas fichas e consulte a qualquer momento a via arquivada dos seus formulários com validade jurídica.
            </p>
          </div>
        </div>
      </div>

      {/* Abas: Formulários para Preencher | Minhas Fichas Respondidas */}
      <div className="flex items-center border-b border-border gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("disponiveis")}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "disponiveis"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Para Preencher ({studentForms.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("respondidos")}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "respondidos"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Minhas Respostas Arquivadas ({studentAnswers.length})
        </button>
      </div>

      {/* ABA 1: DISPONÍVEIS */}
      {activeTab === "disponiveis" && (
        <>
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
                      asChild
                      size="sm"
                      className="font-bold text-xs gap-1.5 shadow-sm"
                    >
                      <Link to="/f/$slug" params={{ slug: item.slug || item.id }}>
                        Preencher Agora
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>

                    {item.googleFormUrl && item.googleFormUrl.includes("docs.google.com") && (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                        title="Abrir no Google Forms externo"
                      >
                        <a href={item.googleFormUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Google Forms
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ABA 2: MINHAS RESPOSTAS ARQUIVADAS */}
      {activeTab === "respondidos" && (
        <div className="space-y-4">
          {studentAnswers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-card/40">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/60 mb-2" />
              <h3 className="text-sm font-semibold text-foreground">Nenhuma ficha respondida</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Assim que você preencher um formulário, a sua via oficial arquivada aparecerá aqui com cópia para download.
              </p>
            </div>
          ) : (
            studentAnswers.map((sub) => {
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
                  className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden"
                >
                  <div className="p-4 sm:p-5 bg-muted/20 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Ficha Respondida
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {date}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground">{sub.formTitle}</h3>
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
                        {downloadingId === sub.id ? "Gerando..." : "Baixar Cópia em PDF"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleExpand(sub.id)}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-4 bg-card divide-y divide-border/40">
                      {answersEntries.map(([key, val], idx) => {
                        let formattedVal = "";
                        if (typeof val === "boolean") {
                          formattedVal = val ? "Sim / Aceito" : "Não";
                        } else if (Array.isArray(val)) {
                          formattedVal = val.join(", ");
                        } else {
                          formattedVal = String(val || "—");
                        }

                        return (
                          <div key={key} className={idx > 0 ? "pt-3.5" : ""}>
                            <h4 className="text-xs font-bold text-muted-foreground">
                              {key.replace(/^f_/, "").replace(/_/g, " ")}
                            </h4>
                            <p className="text-foreground text-sm font-medium mt-1 bg-muted/20 p-2.5 rounded-lg border border-border/40">
                              {formattedVal}
                            </p>
                          </div>
                        );
                      })}

                      <div className="pt-3 text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        Via do aluno autenticada no sistema do Montanha Personal Studio.
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
