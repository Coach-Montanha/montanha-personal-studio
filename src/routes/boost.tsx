import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  TrendingUp,
  Zap,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Users,
  Award,
  Sparkles,
  BarChart3,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/boost')({
  component: BoostPage,
});

function BoostPage() {
  const [ticketMedio, setTicketMedio] = useState<number>(350);
  const [qtdAlunos, setQtdAlunos] = useState<number>(25);

  const mrrAtual = ticketMedio * qtdAlunos;
  const mrrComUpsell15 = Math.round(mrrAtual * 1.15);
  const mrrAnualizado = mrrAtual * 12;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1">
              <Zap className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Aceleração Financeira &amp; VIP
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-wider px-3 py-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
              Diagnóstico de Receita &amp; Retenção
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Módulos VIP &amp; <span className="text-emerald-400">Aceleração</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mt-1">
                Escale o faturamento do seu studio com simulação de MRR, estratégias anti-inadimplência
                e retenção preditiva de alunos.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-xs font-bold">
                <Link to="/eco">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Hub Ecossistema
                </Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
                <Link to="/create">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Criar Novo Plano VIP
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Column */}
        <Card className="p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">Simulador de MRR &amp; Escala</h3>
              <p className="text-xs text-muted-foreground">Projete sua receita mensal recorrente</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="ticket" className="text-xs font-bold">Ticket Médio por Aluno (R$)</Label>
              <Input
                id="ticket"
                type="number"
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="bg-slate-900 border-slate-800 font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alunos" className="text-xs font-bold">Quantidade de Alunos Ativos</Label>
              <Input
                id="alunos"
                type="number"
                value={qtdAlunos}
                onChange={(e) => setQtdAlunos(Number(e.target.value))}
                className="bg-slate-900 border-slate-800 font-mono font-bold"
              />
            </div>

            <div className="pt-2 space-y-3">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">MRR Atual</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  R$ {mrrAtual.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Faturamento mensal bruto</span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-purple-500/30">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">Com Upsell VIP (+15%)</span>
                <span className="text-2xl font-black text-purple-400 font-mono">
                  R$ {mrrComUpsell15.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">+R$ {(mrrComUpsell15 - mrrAtual).toLocaleString('pt-BR')} a mais por mês</span>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/30">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-bold">Projeção Anual (ARR)</span>
                <span className="text-xl font-black text-cyan-400 font-mono">
                  R$ {mrrAnualizado.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Churn & Anti-Inadimplência */}
        <Card className="p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">Trava Anti-Inadimplência</h3>
              <p className="text-xs text-muted-foreground">Régua de cobrança automática via WhatsApp</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">1. Aviso Preventivo (D-3)</span>
                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-300">Ativo</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Lembrete cordial com link Pix 3 dias antes da fatura vencer.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">2. Notificação no Vencimento (D-0)</span>
                <Badge variant="outline" className="text-[10px] border-cyan-500/40 text-cyan-300">Ativo</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Mensagem matinal confirmando o vencimento do plano.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">3. Trava de Acesso ao App (D+3)</span>
                <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-300">Automático</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Suspensão suave das planilhas de treino até regularização.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button asChild variant="outline" className="w-full text-xs font-bold border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/10">
              <Link to="/diagnostics">
                Ver Diagnósticos Completos <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </Card>

        {/* VIP Modules & Upselling */}
        <Card className="p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">Módulos VIP de Alta Margem</h3>
              <p className="text-xs text-muted-foreground">Novos serviços para adicionar à sua carteira</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-1">
              <span className="font-bold text-purple-200 block">💎 Consultoria Híbrida Premium</span>
              <p className="text-[11px] text-slate-300">
                1 aula presencial semanal + planilhas diárias no app Montanha Hybrid + suporte via WhatsApp.
              </p>
              <span className="text-[10px] font-bold text-purple-300 block pt-1 font-mono">Sugestão: R$ 600 - R$ 900/mês</span>
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
              <span className="font-bold text-cyan-200 block">⚡ Avaliação Física &amp; Bioimpedância</span>
              <p className="text-[11px] text-slate-300">
                Relatório impresso em PDF gerado pelo Montanha PDF Studio a cada 60 dias.
              </p>
              <span className="text-[10px] font-bold text-cyan-300 block pt-1 font-mono">Sugestão: R$ 150 avulso</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <span className="font-bold text-emerald-200 block">🚀 Desafio 30 Dias para Grupos</span>
              <p className="text-[11px] text-slate-300">
                Turma fechada de 10 a 20 alunos com ranking semanal de assiduidade e premiação.
              </p>
              <span className="text-[10px] font-bold text-emerald-300 block pt-1 font-mono">Sugestão: R$ 197 por participante</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default BoostPage;
