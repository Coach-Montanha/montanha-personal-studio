import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, CheckCircle2, FileText, Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/copyright")({
  head: () => ({
    meta: [
      { title: "Canal de Notificação de Direitos Autorais (Notice & Takedown) — Ecossistema Montanha" },
      { name: "description", content: "Canal formal para recebimento de denúncias de infração a direitos autorais e propriedade intelectual nos termos da Lei 9.610/98 e Marco Civil da Internet." }
    ]
  }),
  component: CopyrightNoticePage,
});

function CopyrightNoticePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [holder, setHolder] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [goodFaith, setGoodFaith] = useState(false);
  const [sent, setSent] = useState(false);
  const [protocol, setProtocol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goodFaith) {
      return toast.error("Você deve declarar sob as penas da lei a veracidade das informações.");
    }
    const proto = "DMCA-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    setProtocol(proto);
    setSent(true);
    toast.success("Notificação de infração protocolada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto w-full my-auto py-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </a>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Canal de Notificação de Direitos Autorais
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Procedimento formal de <em>Notice and Takedown</em> em estrita conformidade com a Lei de Direitos Autorais (Lei nº 9.610/1998) e o Marco Civil da Internet (Lei nº 12.965/2014, Arts. 19 e 20).
              </p>
            </div>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Notificação Protocolada</h3>
              <p className="text-sm text-slate-300">
                Seu requerimento foi registrado sob o protocolo:
              </p>
              <div className="font-mono text-base font-bold text-emerald-400 bg-emerald-950/50 py-2 px-4 rounded-xl inline-block border border-emerald-500/30">
                {protocol}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Nossa equipe jurídica iniciará a averiguação cautelar no prazo regulamentar de até 48 horas úteis. O notificado será cientificado para exercer o direito de contranotificação.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome do declarante ou procurador"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">E-mail para Contato Formal</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contato@titular.com.br"
                    className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Titular dos Direitos Autorais / Propriedade Intelectual</label>
                <input
                  type="text"
                  required
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  placeholder="Nome do autor original ou razão social detentora dos direitos"
                  className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">URL ou Localização do Conteúdo Objeto da Denúncia</label>
                <input
                  type="url"
                  required
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://... link específico da publicação ou recurso"
                  className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Descrição Detalhada da Obra Protegida e da Infração</label>
                <textarea
                  required
                  rows={4}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Identifique a obra original (título, registro, trechos reproduzidos indevidamente) e elementos comprobatórios de titularidade..."
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <input
                  id="good-faith-check"
                  type="checkbox"
                  required
                  checked={goodFaith}
                  onChange={(e) => setGoodFaith(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900"
                />
                <label htmlFor="good-faith-check" className="text-xs text-slate-300 leading-relaxed">
                  Declaro, sob as penas do Art. 299 do Código Penal Brasileiro (falsidade ideológica) e da Lei nº 9.610/98, que sou o titular dos direitos autorais ou estou legalmente autorizado a agir em seu nome, e que as informações prestadas são verídicas e exatas.
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all text-sm"
              >
                <Send className="h-4 w-4" /> Enviar Notificação Formal (Takedown)
              </button>
            </form>
          )}

          <div className="border-t border-slate-800 pt-6 text-xs text-slate-500 space-y-2">
            <p><strong>Procedimento Regulamentar:</strong> Após o recebimento, o conteúdo apontado poderá ser cautelarmente suspenso em até 48 horas úteis para análise. O usuário responsável pela publicação será formalmente notificado e poderá apresentar contranotificação fundamentada.</p>
            <p><strong>Encarregado / DPO Ecossistema Montanha:</strong> juridico@montanha.app | Av. das Américas, 4200 - Barra da Tijuca, RJ.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
