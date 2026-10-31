import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DEFAULT_STUDIO_FORMS, StudioFormItem, FormFieldDefinition } from "@/lib/forms-definitions";
import { getFormBySlugServerFn, submitFormServerFn } from "@/lib/forms.functions";
import {
  Sparkles,
  CheckCircle2,
  Share2,
  Check,
  ArrowLeft,
  Dumbbell,
  ShieldCheck,
  Send,
  ExternalLink,
  Sun,
  Moon,
  Clock,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/f/$slug")({
  component: PublicFormViewPage,
});

function PublicFormViewPage() {
  const { slug } = Route.useParams();
  const [form, setForm] = useState<StudioFormItem | null>(() => {
    const found = DEFAULT_STUDIO_FORMS.find(
      (f) => f.slug.toLowerCase() === slug.toLowerCase() || f.id.toLowerCase() === slug.toLowerCase()
    );
    return found || null;
  });

  const [loadingForm, setLoadingForm] = useState(!form);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState("");
  const [copied, setCopied] = useState(false);
  const [studentInfo, setStudentInfo] = useState<{ id: string; name: string; email?: string; phone?: string } | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Carrega aluno autenticado se houver sessao ativa
  useEffect(() => {
    async function checkStudentSession() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const uId = sessionData?.session?.user?.id;
        if (uId) {
          const { data: st } = await supabase.from('students').select('id, name, phone, email').eq('account_user_id', uId).maybeSingle();
          if (st) {
            setStudentInfo({ id: st.id, name: st.name, email: st.email || sessionData.session.user.email, phone: st.phone || '' });
          } else {
            const { data: ptSt } = await supabase.from('pt_students').select('id, name, phone, email').eq('account_user_id', uId).maybeSingle();
            if (ptSt) {
              setStudentInfo({ id: ptSt.id, name: ptSt.name, email: ptSt.email || sessionData.session.user.email, phone: ptSt.phone || '' });
            }
          }
        }
      } catch {}
    }
    checkStudentSession();
  }, []);

  // Busca definição atualizada no backend se não estiver nos defaults
  useEffect(() => {
    async function fetchForm() {
      try {
        const data = await getFormBySlugServerFn({ data: slug });
        if (data && data.slug) {
          setForm(data);
        }
      } catch (err) {
        console.warn("Erro ao buscar formulário:", err);
      } finally {
        setLoadingForm(false);
      }
    }
    fetchForm();
  }, [slug]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleShare = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${form?.title || "Formulário"} — Montanha Personal Studio`,
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        toast.success("Link copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Valida campos obrigatórios
    for (const field of form.fields) {
      if (field.required) {
        const val = answers[field.id];
        const isEmptyArray = Array.isArray(val) && val.length === 0;
        if (
          val === undefined ||
          val === null ||
          (typeof val === "string" && !val.trim()) ||
          val === false ||
          isEmptyArray
        ) {
          toast.error(`Por favor, preencha o campo obrigatório: ${field.label}`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const respondentName =
        answers.nome_completo || answers.nome || answers.name || "Respondente Anônimo";
      const respondentContact =
        answers.telefone_whatsapp || answers.whatsapp || answers.telefone || answers.email || "";

      const proto =
        "REC-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 6).toUpperCase();

      await submitFormServerFn({
        data: {
          formSlug: form.slug,
          formTitle: form.title,
          respondentName,
          respondentContact,
          studentId: studentInfo?.id || null,
          answers: { ...answers, _protocol: proto },
        },
      });

      setProtocol(proto);
      setSubmitted(true);
      if (studentInfo) { try { const u = new URL(window.location.href); u.searchParams.set('saved', '1'); window.history.replaceState({}, '', u.toString()); } catch {} }
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Formulário enviado com sucesso!");
    } catch (err: any) {
      toast.error(`Erro ao enviar: ${err?.message || "Tente novamente"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingForm) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <span
          aria-hidden
          className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin mb-3"
        />
        <p className="text-sm text-muted-foreground font-medium">Carregando formulário oficial...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4 text-muted-foreground shadow-xs">
          <Dumbbell className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Formulário não encontrado</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          O link que você tentou acessar não está disponível ou foi desativado pelo Studio.
        </p>
        <Button asChild variant="outline" className="mt-6 gap-2">
          <Link to="/auth">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground font-sans">
      {/* Header Fixo e Seguro */}
      <header className="sticky top-0 z-30 w-full border-b border-border bg-card/85 backdrop-blur-md px-4 py-3 pt-[calc(0.75rem+var(--safe-area-inset-top,0px))] shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-foreground truncate">
                Montanha Personal Studio
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                <Sparkles className="h-2.5 w-2.5" />
                {form.badge || "Oficial"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{form.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 px-2.5 text-xs font-medium gap-1.5"
            title="Compartilhar ou copiar link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copiado!" : "Compartilhar"}</span>
          </Button>

          <button
            onClick={toggleTheme}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Alternar tema claro/escuro"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-state-pending" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 pb-[calc(2.5rem+var(--safe-area-inset-bottom,0px))]">
        {submitted ? (
          /* Success Screen */
          <div className="rounded-3xl border border-emerald-500/20 bg-card p-6 sm:p-10 shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
              <FileCheck className="h-3.5 w-3.5" />
              Preenchimento Concluído
            </span>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-3">
              Recebemos suas respostas com sucesso!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
              Obrigado por preencher o <strong className="text-foreground">{form.title}</strong>. As informações foram salvas diretamente na base de dados do Montanha Personal Studio.
            </p>

            {/* Protocol Card */}
            <div className="mt-6 rounded-2xl border border-border/80 bg-muted/40 p-4 max-w-sm mx-auto text-left space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Comprovante de Registro
              </div>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-primary">
                <span>Protocolo:</span>
                <span>{protocol}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Data & Hora:</span>
                <span>{new Date().toLocaleString("pt-BR")}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Enviar Nova Resposta
              </Button>
              <Button asChild size="sm" className="w-full sm:w-auto font-bold gap-2">
                <a
                  href="https://api.whatsapp.com/send?phone=5583999259385&text=Ol%C3%A1!%20Acabei%20de%20preencher%20o%20formul%C3%A1rio."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        ) : (
          /* Native Form Screen */
          <div className="space-y-6">
            {/* Form Title Banner */}
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-primary uppercase tracking-wider text-[10px] bg-primary/10 px-2 py-0.5 rounded-md">
                  {form.badge || "Formulário Oficial"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Tempo estimado: {form.estimatedMinutes || 3} min
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {form.title}
              </h1>

              {form.description && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {form.description}
                </p>
              )}
            </div>

            {/* Custom Interactive Fields */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {form.fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-2.5 transition-all focus-within:border-primary/50"
                >
                  <div className="space-y-1">
                    <Label
                      htmlFor={field.id}
                      className="text-xs sm:text-sm font-semibold text-foreground flex items-center justify-between"
                    >
                      <span>
                        <span className="text-muted-foreground mr-1.5 font-mono text-[11px]">
                          {idx + 1}.
                        </span>
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </span>
                    </Label>
                    {field.helperText && (
                      <p className="text-[11px] text-muted-foreground leading-normal">
                        {field.helperText}
                      </p>
                    )}
                  </div>

                  {/* Field Input Variants */}
                  {field.type === "text" && (
                    <Input
                      id={field.id}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="h-10 text-xs sm:text-sm"
                    />
                  )}

                  {field.type === "email" && (
                    <Input
                      id={field.id}
                      type="email"
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || "seuemail@exemplo.com"}
                      required={field.required}
                      className="h-10 text-xs sm:text-sm"
                    />
                  )}

                  {field.type === "tel" && (
                    <Input
                      id={field.id}
                      type="tel"
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || "(83) 99999-9999"}
                      required={field.required}
                      className="h-10 text-xs sm:text-sm"
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      id={field.id}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={3}
                      className="text-xs sm:text-sm resize-none"
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      id={field.id}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                    >
                      <option value="">Selecione uma opção...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === "radio" && (
                    <div className="grid gap-2 pt-1">
                      {field.options?.map((opt) => {
                        const isSelected = answers[field.id] === opt;
                        return (
                          <label
                            key={opt}
                            onClick={() => handleFieldChange(field.id, opt)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                              isSelected
                                ? "border-primary bg-primary/10 text-foreground font-semibold shadow-xs"
                                : "border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                              }`}
                            >
                              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <div className="grid gap-2 pt-1">
                      {field.options?.map((opt) => {
                        const currentList: string[] = Array.isArray(answers[field.id])
                          ? answers[field.id]
                          : [];
                        const isChecked = currentList.includes(opt);

                        const toggleOption = () => {
                          const updated = isChecked
                            ? currentList.filter((item) => item !== opt)
                            : [...currentList, opt];
                          handleFieldChange(field.id, updated);
                        };

                        return (
                          <label
                            key={opt}
                            onClick={toggleOption}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all select-none ${
                              isChecked
                                ? "border-primary bg-primary/10 text-foreground font-semibold shadow-xs"
                                : "border-border/70 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                          >
                            <span
                              className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                                isChecked
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground/60 bg-background"
                              }`}
                            >
                              {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {field.type === "scale" && (
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                        {Array.from({ length: (field.scaleMax || 10) - (field.scaleMin || 1) + 1 }).map((_, i) => {
                          const val = (field.scaleMin || 1) + i;
                          const isSelected = answers[field.id] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleFieldChange(field.id, val)}
                              className={`h-10 rounded-lg text-xs font-bold transition-all ${
                                isSelected
                                  ? "bg-primary text-primary-foreground shadow-sm scale-105"
                                  : "border border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                        <span>{field.scaleMinLabel || "1"}</span>
                        <span>{field.scaleMaxLabel || "10"}</span>
                      </div>
                    </div>
                  )}

                  {field.type === "legal-consent" && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <ShieldCheck className="h-4 w-4" />
                        Consentimento Formal & LGPD
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic bg-card/60 p-3 rounded-lg border border-border/60">
                        "{field.consentStatement}"
                      </p>
                      <label className="flex items-center gap-2.5 text-xs font-semibold text-foreground cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={!!answers[field.id]}
                          onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                          required={field.required}
                          className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
                        />
                        <span>Li e concordo expressamente com este termo.</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 text-sm sm:text-base font-bold gap-2 shadow-md"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Enviando respostas...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Formulário
                    </>
                  )}
                </Button>
              </div>

              {/* Alternative Google Forms link if configured */}
              {form.googleFormUrl && form.googleFormUrl.includes("docs.google.com") && (
                <div className="text-center pt-2">
                  <a
                    href={form.googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground underline decoration-dotted"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Prefere responder diretamente no Google Formulários? Clique aqui
                  </a>
                </div>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
