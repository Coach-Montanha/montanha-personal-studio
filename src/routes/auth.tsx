import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, CheckCircle2, Lock, Sparkles, Zap, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

function safeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

const ECOSYSTEM_APPS = [
  {
    id: "personal",
    name: "Montanha Personal Studio",
    tag: "Finanças & Operação",
    slogan: "Gestão Financeira & Inteligência para Studios",
    accent: "#10b981",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    isCurrent: true,
  },
  {
    id: "pdf",
    name: "Montanha PDF Studio",
    tag: "Diagramação & IA",
    slogan: "Diagramação Editorial & Publicações com IA",
    accent: "#f59e0b",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    isCurrent: false,
  },
  {
    id: "hybrid",
    name: "Montanha Hybrid Training",
    tag: "Performance & Treino",
    slogan: "Alta Performance & Periodização de Treino",
    accent: "#06b6d4",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    isCurrent: false,
  },
  {
    id: "language",
    name: "Montanha Language AI",
    tag: "Idiomas & IA",
    slogan: "Tutor de Idiomas com IA & Treinos Diários",
    accent: "#6366f1",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    isCurrent: false,
  },
  {
    id: "whatsapp",
    name: "Montanha WhatsApp Automation",
    tag: "SaaS & CRM",
    slogan: "Automação Multi-Tenant & Disparos WhatsApp",
    accent: "#a855f7",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    isCurrent: false,
  },
];

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { next?: string } => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ href: safeNext(search.next) });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const nextPath = safeNext(next);
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showReset, setShowReset] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo de volta!");
    window.location.href = nextPath;
  }

  async function handleQuickDemo() {
    setEmail("demo@eduflow.app");
    setPassword("123456");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: "demo@eduflow.app",
      password: "123456",
    });
    setLoading(false);
    if (error) {
      toast.info("Modo demonstração ativado.");
      window.location.href = nextPath;
    } else {
      toast.success("Bem-vindo ao modo Demo Instantânea!");
      window.location.href = nextPath;
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${nextPath}`,
        data: { name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Verifique seu email se necessário.");
    if ((await supabase.auth.getSession()).data.session) window.location.href = nextPath;
    else navigate({ to: "/auth" });
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setResetError(error.message);
      return;
    }
    setResetSent(true);
  }

  function openReset() {
    setResetSent(false);
    setResetError(null);
    setShowReset(true);
  }

  function backToSignIn() {
    setResetSent(false);
    setResetError(null);
    setShowReset(false);
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Aurora Mesh Dark Glass background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[130px]" />
        <div className="absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full bg-emerald-600/15 blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[160px]" />
      </div>

      <header className="relative z-10 w-full border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block">Montanha Personal Studio</span>
              <span className="text-[10px] text-slate-400">Gestão Financeira &amp; Inteligência Operacional</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEcosystem(!showEcosystem)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ecossistema (5 Apps)</span>
            {showEcosystem ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </header>

      {/* Ecosystem Apps Dropdown Bar */}
      {showEcosystem && (
        <div className="relative z-20 mx-auto w-full max-w-md px-4 pt-4 animate-in fade-in">
          <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl space-y-2">
            <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plataformas do Ecossistema Montanha</span>
            </div>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {ECOSYSTEM_APPS.map((app) => (
                <div
                  key={app.id}
                  className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    app.isCurrent
                      ? "bg-emerald-500/10 border-emerald-500/50 text-white"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: app.accent }} />
                      {app.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{app.slogan}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${app.badgeBg}`}>
                    {app.isCurrent ? "ATUAL" : app.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <Card
          className="w-full max-w-sm border border-emerald-500/30 bg-slate-950/90 p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-2xl sm:max-w-md sm:p-8 rounded-2xl"
        >
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <TabsTrigger value="signin" data-testid="tab-signin" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-bold transition-all text-xs py-2 rounded-lg">Entrar</TabsTrigger>
              <TabsTrigger value="signup" data-testid="tab-signup" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-slate-950 font-bold transition-all text-xs py-2 rounded-lg">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              {showReset ? (
                resetSent ? (
                  <div className="space-y-5 text-center" data-testid="reset-success-container">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                      <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold leading-tight tracking-tight text-white">Link enviado!</h3>
                      <p className="text-sm leading-relaxed text-slate-400">
                        Verifique sua caixa de entrada e a pasta de spam.
                      </p>
                    </div>
                    <button
                      type="button"
                      data-testid="button-back-to-signin"
                      className="block w-full text-center text-sm text-emerald-400 hover:underline focus-ring rounded-md font-medium"
                      onClick={backToSignIn}
                    >
                      ← Voltar para o login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReset} className="space-y-5" data-testid="form-reset-password">
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-semibold leading-tight tracking-tight text-white">Recuperar senha</h3>
                      <p className="text-sm leading-relaxed text-slate-400">
                        Digite seu e-mail cadastrado e enviaremos um link para criar uma nova senha.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-r" className="text-slate-300">E-mail</Label>
                      <Input
                        id="email-r"
                        data-testid="input-reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
                      />
                      {resetError && (
                        <p data-testid="reset-error-message" className="text-sm text-red-400 font-semibold">{resetError}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      data-testid="button-reset-submit"
                      className="h-10 w-full font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl transition-all"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enviar link de recuperação
                    </Button>
                    <button
                      type="button"
                      data-testid="button-back-to-signin"
                      className="block w-full text-center text-sm text-slate-400 hover:text-white transition-ui focus-ring rounded-md"
                      onClick={backToSignIn}
                    >
                      ← Voltar para o login
                    </button>
                  </form>
                )
              ) : (
                <form onSubmit={handleSignIn} className="space-y-4" data-testid="form-signin">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-300">Email</Label>
                    <Input
                      id="email"
                      data-testid="input-signin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-300">Senha</Label>
                    <Input
                      id="password"
                      data-testid="input-signin-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
                      <Checkbox defaultChecked data-testid="checkbox-remember-me" /> Lembrar de mim
                    </label>
                    <button
                      type="button"
                      data-testid="button-forgot-password"
                      className="text-sm text-emerald-400 hover:underline rounded-md font-medium"
                      onClick={openReset}
                    >
                      Esqueci a senha
                    </button>
                  </div>
                  <Button
                    type="submit"
                    data-testid="button-signin-submit"
                    className="h-10 w-full font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 rounded-xl shadow-lg transition-all"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar no Personal Studio
                  </Button>

                  <div className="pt-2 border-t border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={handleQuickDemo}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>⚡ Demo Instantânea / Acesso Rápido</span>
                    </button>
                  </div>
                </form>
              )}
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4" data-testid="form-signup">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-300">Nome</Label>
                  <Input
                    id="name"
                    data-testid="input-signup-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Coach Silva"
                    className="h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-s" className="text-xs font-bold uppercase tracking-wider text-slate-300">Email</Label>
                  <Input
                    id="email-s"
                    data-testid="input-signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pwd-s" className="text-xs font-bold uppercase tracking-wider text-slate-300">Senha</Label>
                  <Input
                    id="pwd-s"
                    data-testid="input-signup-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
                  />
                  <p className="text-xs leading-relaxed text-slate-400">Mínimo 6 caracteres.</p>
                </div>
                <Button
                  type="submit"
                  data-testid="button-signup-submit"
                  className="h-10 w-full font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 rounded-xl shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      <footer className="relative z-10 w-full border-t border-slate-800/60 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs font-medium text-slate-400 sm:px-6">
          © {new Date().getFullYear()} Montanha Personal Studio — Ecossistema Montanha
        </div>
      </footer>
    </div>
  );
}
