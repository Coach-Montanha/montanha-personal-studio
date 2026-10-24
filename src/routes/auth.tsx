import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import {
  Loader2,
  CheckCircle2,
  Lock,
  ShieldCheck,
  KeyRound,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Smartphone,
  Calendar,
  Users,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { autoHealStudentLogin } from "@/lib/student-access.functions";
import { validateEmailMx, checkProjectAccess } from "@/services/ecosystem-auth-service";
import { getSavedAccounts, switchToAccount, removeSavedAccount, saveCurrentAccount, type SavedAccount } from "@/lib/multi-account";

function safeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

function calculateAge(dateStr: string): number {
  if (!dateStr) return 0;
  const [y, m, d] = dateStr.split("-").map(Number);
  const birth = new Date(y, (m || 1) - 1, d || 1);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const mDiff = today.getMonth() - birth.getMonth();
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (
    s: Record<string, unknown>,
  ): {
    next?: string;
    email?: string;
    pass?: string;
    password?: string;
    trial?: string;
    token?: string;
  } => ({
    next: typeof s.next === "string" ? s.next : undefined,
    email: typeof s.email === "string" ? s.email : undefined,
    pass:
      typeof s.pass === "string" ? s.pass : typeof s.password === "string" ? s.password : undefined,
    trial: typeof s.trial === "string" ? s.trial : undefined,
    token: typeof s.token === "string" ? s.token : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      if (search.next) throw redirect({ href: safeNext(search.next) });
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      const roles = (roleData ?? []).map((r) => r.role);
      const isAdmin = roles.includes("admin") || roles.includes("super_admin");
      throw redirect({ href: isAdmin ? "/" : "/portal" });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const autoHealFn = useServerFn(autoHealStudentLogin);
  const searchParams = Route.useSearch();
  const nextPath = safeNext(searchParams.next);

  const [view, setView] = useState<"signin" | "signup">("signin");
  const [authMethod, setAuthMethod] = useState<"pin" | "email">("pin");
  const [showPass, setShowPass] = useState(false);
  const [showSuPass, setShowSuPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [quickLoggingId, setQuickLoggingId] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState(searchParams.email || "");
  const [pin, setPin] = useState(searchParams.pass || searchParams.password || "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Carrega credenciais salvas no dispositivo e tenta preenchimento automático nativo
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      setSavedAccounts(getSavedAccounts());
      const savedEmail = localStorage.getItem("studio:remember_email");
      if (savedEmail && !email) setEmail(savedEmail);

      const savedRemember = localStorage.getItem("studio:remember_me");
      if (savedRemember !== null) setRememberMe(savedRemember === "true");

      // Suporte à API nativa de Gerenciador de Credenciais do Google / Android
      if (navigator.credentials && (window as any).PasswordCredential) {
        navigator.credentials
          .get({ password: true } as any)
          .then((cred: any) => {
            if (cred && cred.id) {
              setEmail(cred.id);
              if (cred.password) {
                setPin(cred.password);
                setPassword(cred.password);
              }
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  // Brand Color: #6958e2 (Midnight Violet)

  
  async function handleQuickLogin(acc: SavedAccount) {
    setQuickLoggingId(acc.id);
    toast.info(`Entrando como ${acc.name || acc.email}...`);
    const success = await switchToAccount(acc.id);
    if (!success) {
      toast.error("Acesso expirado. Por favor, digite suas credenciais para renovar.");
      setSavedAccounts(getSavedAccounts());
      setQuickLoggingId(null);
    }
  }

  function handleRemoveSavedAccount(e: React.MouseEvent, accId: string) {
    e.stopPropagation();
    removeSavedAccount(accId);
    setSavedAccounts(getSavedAccounts());
    toast.success("Conta removida deste aparelho.");
  }

  async function redirectAfterAuth(userId: string) {
    if (searchParams.next) {
      window.location.href = safeNext(searchParams.next);
      return;
    }
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roles = (roleData ?? []).map((r) => r.role);
    const isAdmin = roles.includes("admin") || roles.includes("super_admin");
    window.location.href = isAdmin ? "/" : "/portal";
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCredential = authMethod === "pin" ? pin.trim() : password.trim();

    if (!cleanEmail) {
      setLoading(false);
      return toast.error("Por favor, digite seu e-mail de acesso.");
    }

    if (authMethod === "pin") {
      if (!/^\d{6,}$/.test(cleanCredential)) {
        setLoading(false);
        return toast.error("O PIN de acesso deve conter no mínimo 6 dígitos numéricos.");
      }
    } else {
      if (!cleanCredential || cleanCredential.length < 6) {
        setLoading(false);
        return toast.error("A senha deve conter no mínimo 6 caracteres.");
      }
    }

    const mx = await validateEmailMx(cleanEmail);
    if (!mx.valid) {
      setLoading(false);
      return toast.error(mx.reason || "E-mail inválido.");
    }

    const access = await checkProjectAccess(null, "eduflow-finance", cleanEmail);
    if (!access.hasAccess) {
      setLoading(false);
      return toast.error(access.message);
    }

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanCredential,
    });

    if (error) {
      // Auto-healing for registered students
      try {
        const healResult = await autoHealFn({
          data: { email: cleanEmail, password: cleanCredential },
        });
        if (healResult && healResult.healed) {
          const retryHealed = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanCredential,
          });
          if (!retryHealed.error && retryHealed.data.session) {
            setLoading(false);
            toast.success("Acesso autenticado com sucesso!");
            await redirectAfterAuth(retryHealed.data.session.user.id);
            return;
          }
        }
      } catch (healErr) {
        console.warn("Auto-heal check warning:", healErr);
      }

      // Provision trial or check local access
      const localTrial = localStorage.getItem(`ecosystem_sub_eduflow-finance_${cleanEmail}`);
      if (localTrial) {
        setLoading(false);
        toast.success("Acesso em período de avaliação liberado!");
        window.location.href = nextPath;
        return;
      }

      setLoading(false);
      const userMessage =
        error.message === "Invalid login credentials"
          ? "Credenciais inválidas. Verifique seu e-mail e PIN de 10 dígitos."
          : error.message;
      return toast.error(userMessage);
    }

    setLoading(false);

    // Salva ou remove o e-mail no dispositivo
    try {
      if (rememberMe) {
        localStorage.setItem("studio:remember_email", cleanEmail);
        localStorage.setItem("studio:remember_me", "true");
      } else {
        localStorage.removeItem("studio:remember_email");
        localStorage.setItem("studio:remember_me", "false");
      }

      // Oferece salvar a credencial no Google Password Manager nativo do Android
      if (typeof window !== "undefined" && navigator.credentials && (window as any).PasswordCredential) {
        const cred = new (window as any).PasswordCredential({
          id: cleanEmail,
          password: cleanCredential,
          name: cleanEmail.split("@")[0],
        });
        navigator.credentials.store(cred).catch(() => {});
      }
    } catch {}

    toast.success("Bem-vindo de volta!");
    if (signInData?.session) {
      saveCurrentAccount(signInData.session, {
        name: cleanEmail.split("@")[0],
        role: "Administrador",
      });
    }
    if (signInData?.user) {
      await redirectAfterAuth(signInData.user.id);
    } else {
      window.location.href = nextPath;
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCredential = authMethod === "pin" ? pin.trim() : password.trim();

    if (!name.trim()) {
      setLoading(false);
      return toast.error("Por favor, informe seu nome completo.");
    }

    if (!birthDate) {
      setLoading(false);
      return toast.error("Informe sua data de nascimento para validação de maioridade (ECA/LGPD).");
    }

    const age = calculateAge(birthDate);
    if (age < 18) {
      setLoading(false);
      return toast.error(
        "Conforme o ECA e a LGPD (Art. 14), o cadastro direto é permitido apenas para maiores de 18 anos. Menores devem ser cadastrados pelo Studio com autorização do responsável legal.",
      );
    }

    if (authMethod === "pin" && !/^\d{10}$/.test(cleanCredential)) {
      setLoading(false);
      return toast.error("O PIN de acesso deve conter exatamente 10 dígitos numéricos.");
    }

    if (authMethod === "email" && cleanCredential.length < 6) {
      setLoading(false);
      return toast.error("A senha deve conter no mínimo 6 caracteres.");
    }

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanCredential,
      options: {
        emailRedirectTo: `${window.location.origin}${nextPath}`,
        data: {
          name,
          birth_date: birthDate,
          age_verified: true,
          age_verified_at: new Date().toISOString(),
        },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Verifique seu email para confirmar o acesso.");
    const sess = (await supabase.auth.getSession()).data.session;
    if (sess) await redirectAfterAuth(sess.user.id);
    else setView("signin");
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setResetError(error.message);
        return;
      }
      setResetSent(true);
    } catch (err: any) {
      setResetError(err?.message || "Erro ao solicitar recuperação de senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh w-full bg-slate-950 text-slate-100 flex items-center justify-center p-3 sm:p-4 pt-[calc(0.75rem+var(--safe-area-inset-top,0px))] pb-[calc(1.5rem+var(--safe-area-inset-bottom,0px))] pl-[calc(0.75rem+var(--safe-area-inset-left,0px))] pr-[calc(0.75rem+var(--safe-area-inset-right,0px))] font-sans relative overflow-y-auto">
      {/* Dynamic Background Mesh */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#6958e2]/20 blur-[160px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#8b5cf6]/15 blur-[160px]" />
      </div>

      {/* Floating Hero Stage Card Container */}
      <div className="w-full max-w-[900px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row md:min-h-[560px] my-auto">
        {/* A) NAV RAIL */}
        <nav className="w-full md:w-24 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-3 md:p-4 flex md:flex-col items-center justify-between z-20 flex-shrink-0">
          <div className="flex flex-row md:flex-col items-center gap-2 md:gap-1.5">
            <div className="h-9 w-9 md:h-11 md:w-11 rounded-2xl bg-gradient-to-br from-[#6958e2] to-[#8b5cf6] p-0.5 shadow-md flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-[#6958e2]" />
              </div>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Studio
            </span>
          </div>

          <div className="flex md:flex-col items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setView("signin")}
              aria-label="Entrar na conta"
              className={`min-h-[40px] md:min-h-[44px] min-w-[40px] md:min-w-[44px] px-3 md:px-4 py-2 md:py-2.5 rounded-xl flex flex-row md:flex-col items-center justify-center gap-1.5 md:gap-1 transition-all text-xs font-bold ${
                view === "signin"
                  ? "bg-[#6958e2] text-white shadow-md shadow-[#6958e2]/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <User className="h-4 w-4 md:h-5 md:w-5" />
              <span>Entrar</span>
            </button>

            <button
              type="button"
              onClick={() => setView("signup")}
              aria-label="Criar nova conta"
              className={`min-h-[40px] md:min-h-[44px] min-w-[40px] md:min-w-[44px] px-3 md:px-4 py-2 md:py-2.5 rounded-xl flex flex-row md:flex-col items-center justify-center gap-1.5 md:gap-1 transition-all text-xs font-bold ${
                view === "signup"
                  ? "bg-[#6958e2] text-white shadow-md shadow-[#6958e2]/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
              <span>Cadastrar</span>
            </button>
          </div>

          <div className="hidden md:flex flex-col items-center text-[10px] text-slate-500">
            <ShieldCheck className="h-4 w-4 text-[#6958e2] mb-0.5" />
            <span>SSL 256</span>
          </div>
        </nav>

        {/* B) FLOATING HERO CARD (Desktop only - prevents mobile overflow) */}
        <div className="hidden md:flex w-full md:w-80 relative overflow-hidden bg-slate-950/90 p-6 md:p-8 flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div
            aria-hidden
            className="absolute -top-24 -left-24 w-64 h-64 bg-[#6958e2]/20 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 space-y-4">
            {view === "signin" ? (
              <div className="space-y-3 animate-in fade-in">
                <h2
                  className="text-2xl md:text-3xl font-extrabold !text-white text-white tracking-tight leading-tight"
                  style={{ color: "#ffffff" }}
                >
                  Montanha Personal Studio
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Gestão financeira e inteligência operacional de alta performance para personal
                  trainers e studios.
                </p>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <h2
                  className="text-2xl md:text-3xl font-extrabold !text-white text-white tracking-tight leading-tight"
                  style={{ color: "#ffffff" }}
                >
                  Eleve seu Studio ao Próximo Nível
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Automatize faturamentos, gerencie alunos e simplifique sua rotina operacional com
                  inteligência.
                </p>
              </div>
            )}
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#6958e2] flex-shrink-0" />
              <span>Autenticação rápida e segura por PIN</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#6958e2] flex-shrink-0" />
              <span>Criptografia de ponta a ponta</span>
            </div>
          </div>
        </div>

        {/* C) FORM PANEL */}
        <div className="flex-1 p-6 md:p-10 flex flex-col justify-between bg-slate-900">
          {showReset ? (
            <div className="space-y-6 my-auto">
              <div>
                <h3
                  className="text-2xl font-bold !text-white text-white tracking-tight"
                  style={{ color: "#ffffff" }}
                >
                  Recuperar Senha
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Informe seu e-mail cadastrado para receber o link de redefinição.
                </p>
              </div>

              {resetSent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>E-mail de recuperação enviado!</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Confira sua caixa de entrada e a pasta de spam do e-mail informado.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReset(false);
                      setResetSent(false);
                    }}
                    className="text-xs font-bold text-[#6958e2] hover:underline block pt-2"
                  >
                    ← Voltar para o login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="reset-email-input"
                      className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
                    >
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        id="reset-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        style={{
                          fontSize: "16px",
                          backgroundColor: "#ffffff",
                          color: "#0f172a",
                          colorScheme: "light",
                          WebkitTextFillColor: "#0f172a",
                        }}
                        className="w-full h-11 pl-10 pr-4 !bg-white !text-slate-900 border border-slate-300 rounded-xl font-medium placeholder-slate-400 focus:outline-none focus:border-[#6958e2] focus:ring-2 focus:ring-[#6958e2]/20 text-base md:text-sm"
                      />
                    </div>
                    {resetError && (
                      <p className="text-xs text-red-400 font-semibold">{resetError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-[#6958e2] hover:bg-[#5b4bc4] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>Enviar Link de Recuperação</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReset(false)}
                    className="w-full text-center text-xs text-slate-400 hover:text-white pt-2"
                  >
                    ← Voltar para o login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-6 my-auto">
              <div>
                <h3
                  className="text-2xl font-bold !text-white text-white tracking-tight"
                  style={{ color: "#ffffff" }}
                >
                  {view === "signin" ? "Acessar Plataforma" : "Criar sua Conta"}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {view === "signin"
                    ? "Informe suas credenciais ou PIN para acessar."
                    : "Preencha os dados abaixo para cadastrar seu novo acesso."}
                </p>
              </div>

              
              {view === "signin" && savedAccounts.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#6958e2]" />
                      Contas Salvas neste Celular
                    </span>
                    <span className="text-[10px] text-slate-400">Acesso rápido</span>
                  </div>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-0.5">
                    {savedAccounts.map((acc) => {
                      const isLogging = quickLoggingId === acc.id;
                      return (
                        <div
                          key={acc.id}
                          onClick={() => !isLogging && handleQuickLogin(acc)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 hover:bg-[#6958e2]/20 border border-slate-700 hover:border-[#6958e2]/50 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-7 w-7 rounded-full bg-[#6958e2]/20 text-[#6958e2] font-bold text-xs flex items-center justify-center border border-[#6958e2]/30 shrink-0">
                              {acc.name ? acc.name.slice(0, 2).toUpperCase() : acc.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{acc.name || acc.email}</p>
                              <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={isLogging}
                              className="h-6 text-[10px] px-2.5 rounded-lg font-bold bg-[#6958e2] hover:bg-[#5b4bc4] text-white transition-all"
                            >
                              {isLogging ? "Entrando..." : "Entrar"}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSavedAccount(e, acc.id)}
                              className="h-6 w-6 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all"
                              title="Remover deste aparelho"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form */}
              <form
                method="post"
                autoComplete="on"
                onSubmit={view === "signin" ? handleSignIn : handleSignUp}
                className="space-y-4"
              >
                {view === "signup" && (
                  <>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="su-name-input"
                        className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
                      >
                        Nome Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          id="su-name-input"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Coach Silva"
                          style={{
                            fontSize: "16px",
                            backgroundColor: "#ffffff",
                            color: "#0f172a",
                            colorScheme: "light",
                            WebkitTextFillColor: "#0f172a",
                          }}
                          className="w-full h-11 pl-10 pr-4 !bg-white !text-slate-900 border border-slate-300 rounded-xl font-medium placeholder-slate-400 focus:outline-none focus:border-[#6958e2] focus:ring-2 focus:ring-[#6958e2]/20 text-base md:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="su-birth-input"
                          className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
                        >
                          Data de Nascimento
                        </label>
                        <span className="text-[10px] text-purple-400 font-medium">
                          ECA & LGPD (+18 anos)
                        </span>
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          id="su-birth-input"
                          type="date"
                          required
                          max={new Date().toISOString().split("T")[0]}
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          style={{
                            fontSize: "16px",
                            backgroundColor: "#ffffff",
                            color: "#0f172a",
                            colorScheme: "light",
                            WebkitTextFillColor: "#0f172a",
                          }}
                          className="w-full h-11 pl-10 pr-4 !bg-white !text-slate-900 border border-slate-300 rounded-xl font-medium placeholder-slate-400 focus:outline-none focus:border-[#6958e2] focus:ring-2 focus:ring-[#6958e2]/20 text-base md:text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="si-email-input"
                    className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
                  >
                    E-mail de Acesso
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      id="si-email-input"
                      name="username"
                      autoComplete="username email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      style={{
                        fontSize: "16px",
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                        colorScheme: "light",
                        WebkitTextFillColor: "#0f172a",
                      }}
                      className="w-full h-11 pl-10 pr-4 !bg-white !text-slate-900 border border-slate-300 rounded-xl font-medium placeholder-slate-400 focus:outline-none focus:border-[#6958e2] focus:ring-2 focus:ring-[#6958e2]/20 text-base md:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="pin-input"
                      className="text-xs font-semibold text-slate-300 uppercase tracking-wider"
                    >
                      {view === "signup"
                        ? "PIN ou Senha (no mínimo 6 dígitos)"
                        : "PIN ou Senha de Acesso"}
                    </label>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      id="pin-input"
                      name="password"
                      autoComplete={view === "signup" ? "new-password" : "current-password"}
                      type={showPass ? "text" : "password"}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        fontSize: "16px",
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                        colorScheme: "light",
                        WebkitTextFillColor: "#0f172a",
                      }}
                      className="w-full h-11 pl-10 pr-12 !bg-white !text-slate-900 border border-slate-300 rounded-xl font-medium placeholder-slate-400 focus:outline-none focus:border-[#6958e2] focus:ring-2 focus:ring-[#6958e2]/20 text-base md:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      aria-label="Alternar visibilidade da senha"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {view === "signin" && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-200">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-950 text-[#6958e2] focus:ring-[#6958e2]"
                      />
                      <span>Lembrar neste dispositivo</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowReset(true)}
                      className="text-xs font-bold text-[#6958e2] hover:underline"
                    >
                      Esqueci a senha
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  aria-label={view === "signin" ? "Entrar no Personal Studio" : "Cadastrar conta"}
                  className="w-full h-12 rounded-xl bg-[#6958e2] hover:bg-[#5b4bc4] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>
                    {view === "signin" ? "Entrar no Personal Studio" : "Criar Conta de Acesso"}
                  </span>
                </button>
              </form>

              {/* Footer Switcher */}
              <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                {view === "signin" ? (
                  <span>
                    Ainda não possui uma conta?{" "}
                    <button
                      type="button"
                      onClick={() => setView("signup")}
                      className="font-bold text-[#6958e2] hover:underline ml-1"
                    >
                      Cadastre-se aqui
                    </button>
                  </span>
                ) : (
                  <span>
                    Já é cadastrado?{" "}
                    <button
                      type="button"
                      onClick={() => setView("signin")}
                      className="font-bold text-[#6958e2] hover:underline ml-1"
                    >
                      Fazer login
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
