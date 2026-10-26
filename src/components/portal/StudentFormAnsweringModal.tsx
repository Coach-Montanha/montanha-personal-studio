import React, { useState, useEffect } from "react";
import { StudioFormItem, FormFieldDefinition } from "@/lib/forms-definitions";
import { submitFormServerFn } from "@/lib/forms.functions";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  ExternalLink,
  Check,
  FileCheck,
  X,
  ArrowLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface StudentFormAnsweringModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: StudioFormItem | null;
  studentInfo: { id: string; name: string; email?: string; phone?: string } | null;
  onSubmitted?: () => void;
}

export function StudentFormAnsweringModal({
  open,
  onOpenChange,
  form,
  studentInfo,
  onSubmitted,
}: StudentFormAnsweringModalProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState("");

  // Pré-preenche dados do aluno caso o formulário solicite nome, whatsapp, email
  useEffect(() => {
    if (!form || !open) return;

    setAnswers((prev) => {
      const next = { ...prev };
      for (const field of form.fields) {
        const idLower = field.id.toLowerCase();
        const labelLower = field.label.toLowerCase();

        // Nome
        if (
          (idLower.includes("nome") || labelLower.includes("nome")) &&
          studentInfo?.name &&
          !next[field.id]
        ) {
          next[field.id] = studentInfo.name;
        }

        // Email
        if (
          (field.type === "email" || idLower.includes("email") || labelLower.includes("email")) &&
          studentInfo?.email &&
          !next[field.id]
        ) {
          next[field.id] = studentInfo.email;
        }

        // Telefone / WhatsApp
        if (
          (field.type === "tel" ||
            idLower.includes("whatsapp") ||
            idLower.includes("telefone") ||
            labelLower.includes("telefone") ||
            labelLower.includes("whatsapp")) &&
          studentInfo?.phone &&
          !next[field.id]
        ) {
          next[field.id] = studentInfo.phone;
        }

        // Data de assinatura padrão para hoje
        if (
          (idLower.includes("data_assinatura") || labelLower.includes("data da assinatura")) &&
          !next[field.id]
        ) {
          const today = new Date().toLocaleDateString("pt-BR");
          next[field.id] = today;
        }
      }
      return next;
    });
    setSubmitted(false);
  }, [form, open, studentInfo]);

  if (!form) return null;

  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validação de campos obrigatórios
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
        answers.nome_completo ||
        answers.nome ||
        answers.name ||
        answers.f_207731889 ||
        studentInfo?.name ||
        "Aluno";

      const respondentContact =
        answers.telefone_whatsapp ||
        answers.whatsapp ||
        answers.telefone ||
        answers.email ||
        answers.f_967057097 ||
        answers.f_1934346390 ||
        studentInfo?.phone ||
        studentInfo?.email ||
        "";

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
      toast.success("Formulário gravado com sucesso no seu prontuário!");
      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err: any) {
      toast.error(`Erro ao enviar: ${err?.message || "Tente novamente"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] sm:max-h-[85vh] p-0 overflow-hidden flex flex-col gap-0 border-border bg-card">
        {/* Header fixo da modal */}
        <div className="p-4 sm:p-5 border-b border-border bg-card/95 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-xs shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground truncate">{form.title}</span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase shrink-0">
                  {form.badge || "Oficial"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" />
                Tempo estimado: ~{form.estimatedMinutes || 3} min
              </p>
            </div>
          </div>
        </div>

        {/* Corpo rolável */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {submitted ? (
            /* Tela de Confirmação e Protocolo */
            <div className="rounded-2xl border border-emerald-500/20 bg-card p-5 sm:p-8 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <FileCheck className="h-3.5 w-3.5" />
                Preenchimento Concluído
              </span>

              <h3 className="text-lg font-bold text-foreground">
                Suas respostas foram arquivadas com sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                As informações foram gravadas no sistema do Studio e já estão disponíveis na sua aba{" "}
                <strong className="text-foreground">Minhas Respostas Arquivadas</strong>.
              </p>

              {/* Card do Protocolo */}
              <div className="rounded-xl border border-border bg-muted/40 p-4 max-w-sm mx-auto text-left space-y-1.5 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Comprovante de Registro
                </div>
                <div className="flex items-center justify-between font-mono font-bold text-primary">
                  <span>Protocolo:</span>
                  <span>{protocol}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Data & Hora:</span>
                  <span>{new Date().toLocaleString("pt-BR")}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto font-bold"
                  size="sm"
                >
                  Concluir e Voltar
                </Button>
              </div>
            </div>
          ) : (
            /* Formulário Interativo */
            <form onSubmit={handleSubmit} className="space-y-4">
              {form.description && (
                <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {form.description}
                </div>
              )}

              {form.fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-border bg-card p-4 space-y-2.5 transition-all focus-within:border-primary/50"
                >
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={`field_${field.id}`}
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

                  {/* 1. Texto Simples */}
                  {field.type === "text" && (
                    <Input
                      id={`field_${field.id}`}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || "Digite sua resposta..."}
                      required={field.required}
                      className="h-10 text-xs sm:text-sm"
                    />
                  )}

                  {/* 2. Email */}
                  {field.type === "email" && (
                    <Input
                      id={`field_${field.id}`}
                      type="email"
                      inputMode="email"
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || "seuemail@exemplo.com"}
                      required={field.required}
                      className="h-10 text-xs sm:text-sm"
                    />
                  )}

                  {/* 3. Telefone / WhatsApp */}
                  {field.type === "tel" && (
                    <Input
                      id={`field_${field.id}`}
                      type="tel"
                      inputMode="tel"
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || "(83) 99999-9999"}
                      required={field.required}
                      className="h-10 text-xs sm:text-sm"
                    />
                  )}

                  {/* 4. Textarea */}
                  {field.type === "textarea" && (
                    <Textarea
                      id={`field_${field.id}`}
                      value={answers[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || "Descreva detalhadamente..."}
                      required={field.required}
                      rows={3}
                      className="text-xs sm:text-sm resize-none"
                    />
                  )}

                  {/* 5. Radio (Escolha Única) */}
                  {field.type === "radio" && (
                    <div className="grid gap-2 pt-0.5">
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
                                isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground"
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

                  {/* 6. Checkbox (Múltipla Escolha) */}
                  {field.type === "checkbox" && (
                    <div className="grid gap-2 pt-0.5">
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

                  {/* 7. Escala Numérica / Marks (Ex: 1 a 10) */}
                  {field.type === "scale" && (
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
                        {Array.from({ length: (field.scaleMax || 10) - (field.scaleMin || 1) + 1 }).map(
                          (_, i) => {
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
                          }
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                        <span>{field.scaleMinLabel || "1"}</span>
                        <span>{field.scaleMaxLabel || "10"}</span>
                      </div>
                    </div>
                  )}

                  {/* 8. Termo de Consentimento Legal / LGPD */}
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

              {/* Botão de Envio */}
              <div className="pt-2 sticky bottom-0 bg-card py-2 border-t border-border mt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 text-xs sm:text-sm font-bold gap-2 shadow-md"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Gravando respostas...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Concluir e Salvar no Meu Perfil
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
