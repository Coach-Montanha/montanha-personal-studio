import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BalanceItem {
  id: string;
  label: string;
  category: 'receita' | 'despesa' | 'reserva';
  amount: number;
  percent: number;
}

interface InteractiveBalanceGridProps {
  receitasTotal?: number;
  despesasTotal?: number;
  reservaTotal?: number;
  className?: string;
}

export const InteractiveBalanceGrid: React.FC<InteractiveBalanceGridProps> = ({
  receitasTotal = 15480,
  despesasTotal = 8920,
  reservaTotal = 6560,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'receita' | 'despesa' | 'reserva'>('todos');

  const totalGeral = receitasTotal + despesasTotal + reservaTotal;

  const items: BalanceItem[] = [
    { id: '1', label: 'Mensalidades Alunos', category: 'receita', amount: receitasTotal * 0.75, percent: 55 },
    { id: '2', label: 'Matrículas & Taxas', category: 'receita', amount: receitasTotal * 0.25, percent: 18 },
    { id: '3', label: 'Folha & Equipe', category: 'despesa', amount: despesasTotal * 0.6, percent: 26 },
    { id: '4', label: 'Infraestrutura & T.I.', category: 'despesa', amount: despesasTotal * 0.4, percent: 17 },
    { id: '5', label: 'Fundo Reserva / Caixa', category: 'reserva', amount: reservaTotal, percent: 32 },
  ];

  const filteredItems = activeCategory === 'todos' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 ${className}`}>
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Grid de Balanço Interativo &bull; Bencho UI</span>
          </h4>
          <p className="text-[11px] text-slate-400">Distribuição financeira e fluxo de caixa em tempo real</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          {(['todos', 'receita', 'despesa', 'reserva'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-3 gap-2.5 my-3.5">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 uppercase">
            <span>Receitas</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-black text-white mt-1">R$ {receitasTotal.toLocaleString('pt-BR')}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <div className="flex items-center justify-between text-[10px] font-bold text-rose-400 uppercase">
            <span>Despesas</span>
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-black text-white mt-1">R$ {despesasTotal.toLocaleString('pt-BR')}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30">
          <div className="flex items-center justify-between text-[10px] font-bold text-teal-400 uppercase">
            <span>Saldo Líquido</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-black text-white mt-1">R$ {reservaTotal.toLocaleString('pt-BR')}</div>
        </div>
      </div>

      {/* Interactive Distribution Items */}
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5">
                {item.category === 'receita' ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                ) : item.category === 'despesa' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                )}
                {item.label}
              </span>
              <span className="font-mono font-black text-white">
                R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-800/60 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.category === 'receita'
                    ? 'bg-emerald-400'
                    : item.category === 'despesa'
                    ? 'bg-rose-400'
                    : 'bg-teal-400'
                }`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
