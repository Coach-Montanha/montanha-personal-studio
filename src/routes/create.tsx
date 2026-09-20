import React, { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  Sparkles,
  Users,
  FileCheck,
  CreditCard,
  Plus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Calendar,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const Route = createFileRoute('/create')({
  component: CreateStudioPage,
});

function CreateStudioPage() {
  const navigate = useNavigate();

  // Estado para criação rápida de aluno
  const [alunoNome, setAlunoNome] = useState('');
  const [alunoEmail, setAlunoEmail] = useState('');
  const [alunoTelefone, setAlunoTelefone] = useState('');

  // Estado para criação rápida de plano
  const [planoNome, setPlanoNome] = useState('Plano VIP Mensal');
  const [planoValor, setPlanoValor] = useState('350');
  const [planoCiclo, setPlanoCiclo] = useState('mensal');

  // Estado para contrato
  const [contratoTipo, setContratoTipo] = useState('personal');

  const handleSalvarAlunoRapido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoNome || !alunoEmail) {
      toast.error('Informe ao menos nome e e-mail do aluno.');
      return;
    }
    toast.success(`Aluno ${alunoNome} pré-cadastrado com sucesso!`);
    setAlunoNome('');
    setAlunoEmail('');
    setAlunoTelefone('');
  };

  const handleSalvarPlanoRapido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planoNome || !planoValor) {
      toast.error('Informe nome e valor do plano.');
      return;
    }
    toast.success(`Plano "${planoNome}" (R$ ${planoValor}/${planoCiclo}) criado!`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Estúdio de Criação Rápida
            </Badge>
            <Badge variant="outline" className="border-cyan-500/50 bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-wider px-3 py-1">
              <DollarSign className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Planos, Contratos &amp; Alunos
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Criação Rápida <span className="text-emerald-400">Studio &amp; Finanças</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mt-1">
                Cadastre novos alunos, crie planos de assinatura recorrente e gere minutas de contratos digitais em instantes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-xs font-bold">
                <Link to="/eco">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Hub Ecossistema
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-300 text-xs font-bold">
                <Link to="/boost">Aceleração VIP</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
                <Link to="/students">
                  Ver Todos os Alunos <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Creation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Cadastro Rápido de Aluno */}
        <Card className="p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">1. Novo Aluno</h3>
                <p className="text-xs text-muted-foreground">Adicione um novo cliente à sua carteira do studio</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-300">
              Rápido
            </Badge>
          </div>

          <form onSubmit={handleSalvarAlunoRapido} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="alunoNome" className="text-xs font-bold">Nome Completo</Label>
              <Input
                id="alunoNome"
                placeholder="Ex: Carlos Eduardo Silveira"
                value={alunoNome}
                onChange={(e) => setAlunoNome(e.target.value)}
                className="bg-slate-900 border-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="alunoEmail" className="text-xs font-bold">E-mail</Label>
                <Input
                  id="alunoEmail"
                  type="email"
                  placeholder="aluno@email.com"
                  value={alunoEmail}
                  onChange={(e) => setAlunoEmail(e.target.value)}
                  className="bg-slate-900 border-slate-800"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="alunoTelefone" className="text-xs font-bold">WhatsApp / Telefone</Label>
                <Input
                  id="alunoTelefone"
                  placeholder="(11) 99999-9999"
                  value={alunoTelefone}
                  onChange={(e) => setAlunoTelefone(e.target.value)}
                  className="bg-slate-900 border-slate-800 font-mono"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
              <Plus className="w-4 h-4 mr-1.5" /> Cadastrar Aluno
            </Button>
          </form>
        </Card>

        {/* Card 2: Criação de Novo Plano */}
        <Card className="p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">2. Novo Plano &amp; Assinatura</h3>
                <p className="text-xs text-muted-foreground">Defina valores, recorrência e modalidade de treino</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-cyan-500/40 text-cyan-300">
              Financeiro
            </Badge>
          </div>

          <form onSubmit={handleSalvarPlanoRapido} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="planoNome" className="text-xs font-bold">Nome do Plano</Label>
              <Input
                id="planoNome"
                placeholder="Ex: Consultoria Híbrida VIP"
                value={planoNome}
                onChange={(e) => setPlanoNome(e.target.value)}
                className="bg-slate-900 border-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="planoValor" className="text-xs font-bold">Valor (R$)</Label>
                <Input
                  id="planoValor"
                  type="number"
                  placeholder="350"
                  value={planoValor}
                  onChange={(e) => setPlanoValor(e.target.value)}
                  className="bg-slate-900 border-slate-800 font-mono font-bold"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="planoCiclo" className="text-xs font-bold">Periodicidade</Label>
                <select
                  id="planoCiclo"
                  value={planoCiclo}
                  onChange={(e) => setPlanoCiclo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="mensal">Mensal (Recorrente)</option>
                  <option value="trimestral">Trimestral (3 Meses)</option>
                  <option value="semestral">Semestral (6 Meses)</option>
                  <option value="anual">Anual (12 Meses)</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
              <Plus className="w-4 h-4 mr-1.5" /> Criar Plano
            </Button>
          </form>
        </Card>

        {/* Card 3: Gerador de Contrato Digital */}
        <Card className="p-6 border-slate-800 bg-card/70 backdrop-blur-md space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">3. Contrato Digital de Prestação de Serviços com IA</h3>
                <p className="text-xs text-muted-foreground">Gere termos de compromisso com assinatura digital válida</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-purple-500/40 text-purple-300">
              Jurídico &amp; Proteção
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div
              onClick={() => setContratoTipo('personal')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                contratoTipo === 'personal'
                  ? 'bg-purple-600/15 border-purple-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-bold block text-sm mb-1">🏋️ Personal Trainer Presencial</span>
              <p className="text-[11px] text-muted-foreground">Cláusulas de cancelamento com 24h de antecedência e reposição de aulas.</p>
            </div>

            <div
              onClick={() => setContratoTipo('online')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                contratoTipo === 'online'
                  ? 'bg-purple-600/15 border-purple-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-bold block text-sm mb-1">💻 Consultoria Online / Híbrida</span>
              <p className="text-[11px] text-muted-foreground">Acesso ao aplicativo Montanha, atualizações de planilhas e suporte WhatsApp.</p>
            </div>

            <div
              onClick={() => setContratoTipo('studio')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                contratoTipo === 'studio'
                  ? 'bg-purple-600/15 border-purple-500 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-bold block text-sm mb-1">🏢 Matrícula Studio &amp; Turmas</span>
              <p className="text-[11px] text-muted-foreground">Contrato de adesão com recorrência automática no cartão e termos de saúde PAR-Q.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
            <span className="text-xs text-slate-400">
              Termos alinhados com o Código de Defesa do Consumidor e CREF/CONFEF.
            </span>
            <Button
              onClick={() => toast.success('Minuta de contrato gerada! Você pode compartilhá-la pelo WhatsApp.')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold"
            >
              <Sparkles className="w-4 h-4 mr-1.5" /> Gerar Minuta de Contrato
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CreateStudioPage;
