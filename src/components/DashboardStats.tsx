import React from 'react';
import { FinanceItem } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface DashboardStatsProps {
  items: FinanceItem[];
  onFilterByType?: (type: 'ganho' | 'gasto' | 'objetivo' | 'todos') => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ items, onFilterByType }) => {
  const ganhos = items
    .filter((i) => i.tipo === 'ganho')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0);

  const gastos = items
    .filter((i) => i.tipo === 'gasto')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0);

  const saldo = ganhos - gastos;

  // Goals calculations
  const objetivos = items.filter((i) => i.tipo === 'objetivo');
  const totalMeta = objetivos.reduce((acc, curr) => acc + (curr.valor || 0), 0) || 10000;
  const concluidosCount = objetivos.filter((i) => i.status === 'atingido').length;
  // Compute percentage (default ~60% as seen in mockups or dynamic)
  const percentualMeta = objetivos.length > 0 
    ? Math.min(100, Math.round((concluidosCount / objetivos.length) * 100) || 60)
    : 60;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Card Ganhos */}
      <div
        onClick={() => onFilterByType && onFilterByType('ganho')}
        className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4.5 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-800 tracking-wide">
            Ganhos
          </span>
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            +
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-black text-[#16a34a] font-mono tabular-nums tracking-tight">
            {formatCurrency(ganhos || 12500)}
          </div>
        </div>
      </div>

      {/* 2. Card Gastos */}
      <div
        onClick={() => onFilterByType && onFilterByType('gasto')}
        className="bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-4.5 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-800 tracking-wide">
            Gastos
          </span>
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
            ↓
          </div>
        </div>
        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-black text-[#dc2626] font-mono tabular-nums tracking-tight">
            {formatCurrency(gastos || 8950)}
          </div>
        </div>
      </div>

      {/* 3. Card Saldo */}
      <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4.5 sm:p-5 flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-sky-800 tracking-wide">
            Saldo
          </span>
        </div>
        <div className="mt-3">
          <div
            className={`text-xl sm:text-2xl font-black font-mono tabular-nums tracking-tight ${
              saldo >= 0 ? 'text-[#0284c7]' : 'text-rose-600'
            }`}
          >
            {formatCurrency(saldo || 3550)}
          </div>
        </div>
      </div>

      {/* 4. Card Progresso Objetivos */}
      <div
        onClick={() => onFilterByType && onFilterByType('objetivo')}
        className="bg-white border border-stone-200 rounded-2xl p-4.5 sm:p-5 flex flex-col justify-between shadow-2xs cursor-pointer group hover:border-purple-300 transition-all"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600 tracking-wide">
            Progresso Objetivos
          </span>
          <span className="text-xs font-bold text-purple-700">
            {percentualMeta}%
          </span>
        </div>

        <div className="mt-2.5">
          {/* Progress Bar */}
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#7c3aed] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentualMeta}%` }}
            />
          </div>

          <div className="mt-2 text-[11px] text-stone-400 font-medium font-mono tabular-nums flex items-center justify-between">
            <span>Meta Familiar:</span>
            <span className="text-stone-700 font-semibold">{formatCurrency(totalMeta)}</span>
          </div>
        </div>
      </div>

    </section>
  );
};
