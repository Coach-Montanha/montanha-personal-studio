import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff, CheckCircle2, Lock, AlertTriangle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { syncStudentPassword } from "@/lib/student-access.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const syncStudentPasswordFn = useServerFn(syncStudentPassword);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function handleAuthRecovery() {
      if (typeof window === "undefined") return;

      const rawHash = window.location.hash.replace(/^#/, "");
      const hashParams = new URLSearchParams(rawHash);
      const searchParams = new URLSearchParams(window.location.search);

      const errCode = hashParams.get("error_code") || searchParams.get("error_code");
      const errDesc = hashParams.get("error_description") || searchParams.get("error_description");

      if (errCode || errDesc) {
        if (!mounted) return;
        const msg = errDesc ? decodeURIComponent(errDesc.replace(/\+/g, " ")) : "Token inválido";
        if (msg.toLowerCase().includes("expired") || errCode === "otp_expired") {
          setError("O link de recuperação expirou ou já foi utilizado. Solicite um novo link na tela de login.");
        } else {
          setError(msg);
        }
        setChecking(false);
        return;
      }

      // 1. PKCE flow (?code=...)
      const code = searchParams.get("code");
      if (code) {
        try {
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
          if (!exErr) {
            if (mounted) {
              setReady(true);
              setChecking(false);
            }
            return;
          }
        } catch {
          // ignore
        }
      }

      // 2. Token hash OTP (?token_hash=...&type=recovery)
      const tokenHash = searchParams.get("token_hash") || hashParams.get("token_hash");
      if (tokenHash) {
        try {
          const { error: vErr } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });
          if (!vErr) {
            if (mounted) {
              setReady(true);
              setChecking(false);
            }
            return;
          }
        } catch {
          // ignore
        }
      }

      // 3. Access token direto no hash (#access_token=...&refresh_token=...)
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        try {
          const { error: sErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!sErr) {
            if (mounted) {
              setReady(true);
              setChecking(false);
            }
            return;
          }
        } catch {
          // ignore
        }
      }

      // 4. Sessão ativa atual
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        if (mounted) {
          setReady(true);
          setChecking(false);
        }
        return;
      }

      if (mounted) {
        setTimeout(() => {
          if (mounted && !ready) {
            setChecking(false);
          }
        }, 1500);
      }
    }

    handleAuthRecovery();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        if (mounted) {
          setReady(true);
          setChecking(false);
          setError(null);
        }
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve conter no mínimo 8 dígitos.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas digitadas não coincidem.");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setLoading(false);
      if (err.message.includes("different from the old")) {
        setError("A nova senha deve ser diferente da senha anterior.");
      } else if (err.message.toLowerCase().includes("session") || err.message.toLowerCase().includes("token")) {
        setError("Sessão ou token expirado. Por favor, solicite um novo link de recuperação.");
      } else {
        setError(err.message);
      }
      return;
    }

    // Registra a nova senha no cadastro do aluno para visibilidade do studio
    try {
      await syncStudentPasswordFn({ data: { password } });
    } catch {
      // Ignora erro se usuário não for aluno vinculado
    }

    setLoading(false);
    setSuccess(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setTimeout(() => navigate({ to: "/auth" }), 2500);
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
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block">Montanha Personal Studio</span>
              <span className="text-[10px] text-slate-400">Redefinição de Senha de Acesso</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <Card className="w-full max-w-sm border border-emerald-500/30 bg-slate-950/90 p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-2xl sm:max-w-md sm:p-8 rounded-2xl">
          {success ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold text-white">Senha alterada com sucesso!</h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sua nova senha de 8 dígitos já está ativa e registrada no sistema. Redirecionando para o login…
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <h1 className="text-lg font-bold text-white">Criar nova senha</h1>
                <p className="text-xs text-slate-400">Defina sua nova senha de 8 dígitos para acessar o sistema.</p>
              </div>

              {checking && !ready && !error && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  <span>Validando link de recuperação…</span>
                </div>
              )}

              {!checking && !ready && !error && (
                <div className="mt-4 space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span>Link não validado</span>
                  </div>
                  <p className="leading-relaxed">
                    Não encontramos uma sessão de recuperação ativa. Se o link expirou ou foi aberto em outro navegador, solicite um novo link ou contate seu coach para gerar seu acesso.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold text-slate-200 border-slate-700 hover:bg-slate-800"
                    onClick={() => navigate({ to: "/auth" })}
                  >
                    Voltar para o login
                  </Button>
                </div>
              )}

              {error && (
                <div className="mt-4 space-y-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-red-300">
                  <p className="font-semibold text-red-400">{error}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px] text-slate-300 hover:text-white"
                    onClick={() => navigate({ to: "/auth" })}
                  >
                    ← Voltar ao login e solicitar novo link
                  </Button>
                </div>
              )}

              <form onSubmit={submit} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pwd" className="text-xs font-bold uppercase tracking-wider text-slate-300">Nova senha</Label>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">8 dígitos</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="pwd"
                      type={showPwd ? "text" : "password"}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      minLength={8}
                      maxLength={10}
                      value={password}
                      onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="•••••••• (8 dígitos)"
                      className="h-10 pr-11 font-mono tracking-widest bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-slate-200"
                      aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">Mínimo 8 dígitos numéricos.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-xs font-bold uppercase tracking-wider text-slate-300">Confirmar nova senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      minLength={8}
                      maxLength={10}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="•••••••• (8 dígitos)"
                      className="h-10 pr-11 font-mono tracking-widest bg-slate-900/90 border-slate-800 text-white rounded-xl focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:text-slate-200"
                      aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-10 w-full font-black text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 rounded-xl shadow-lg transition-all"
                  disabled={loading || (!ready && !checking)}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar nova senha
                </Button>

                <Link
                  to="/auth"
                  className="block rounded-md py-1 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ← Voltar para o login
                </Link>
              </form>
            </>
          )}
        </Card>
      </main>

      <footer className="relative z-10 w-full border-t border-slate-800/60 bg-slate-950/50 backdrop-blur-sm py-4">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs font-medium text-slate-400 sm:px-6">
          © {new Date().getFullYear()} Montanha Personal Studio
        </div>
      </footer>
    </div>
  );
}
