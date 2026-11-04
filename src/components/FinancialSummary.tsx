import React from 'react';
import { TrendingUp, TrendingDown, Target, Wallet, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { FinanceItem } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface FinancialSummaryProps {
  items: FinanceItem[];
  onSelectTypeFilter?: (type: 'todos' | 'ganho' | 'gasto' | 'objetivo') => void;
  activeTypeFilter?: string;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  items,
  onSelectTypeFilter,
  activeTypeFilter = 'todos',
}) => {
  // Separate by type
  const ganhos = items.filter((i) => i.tipo === 'ganho');
  const gastos = items.filter((i) => i.tipo === 'gasto');
  const objetivos = items.filter((i) => i.tipo === 'objetivo');

  // Sums
  const totalGanhos = ganhos.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const totalGastos = gastos.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const totalObjetivos = objetivos.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const saldo = totalGanhos - totalGastos;

  // Sub-breakdowns
  const ganhosRecebidos = ganhos
    .filter((i) => i.status === 'recebido')
    .reduce((acc, curr) => acc + curr.valor, 0);
  const ganhosPendentes = totalGanhos - ganhosRecebidos;

  const gastosPagos = gastos
    .filter((i) => i.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);
  const gastosPendentes = totalGastos - gastosPagos;

  const objetivosAtingidos = objetivos.filter((i) => i.status === 'atingido').length;
  const objetivosEmAndamento = objetivos.filter((i) => i.status === 'em_andamento').length;

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card Ganhos */}
        <div
          onClick={() => onSelectTypeFilter && onSelectTypeFilter(activeTypeFilter === 'ganho' ? 'todos' : 'ganho')}
          className={`cursor-pointer transition-all duration-200 bg-white rounded-2xl p-5 border ${
            activeTypeFilter === 'ganho'
              ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-sm'
              : 'border-stone-200 hover:border-emerald-300 hover:shadow-xs'
          }`}
          role="button"
          tabIndex={0}
          title="Clique para filtrar apenas Ganhos"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Ganhos & Rendas
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
            {formatCurrency(totalGanhos)}
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              <span>Recebido: {formatCurrency(ganhosRecebidos)}</span>
            </span>
            <span className="text-stone-400">
              {ganhos.length} {ganhos.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          {ganhosPendentes > 0 && (
            <p className="text-[11px] text-amber-600 mt-1">
              A receber: {formatCurrency(ganhosPendentes)}
            </p>
          )}
        </div>

        {/* Card Gastos */}
        <div
          onClick={() => onSelectTypeFilter && onSelectTypeFilter(activeTypeFilter === 'gasto' ? 'todos' : 'gasto')}
          className={`cursor-pointer transition-all duration-200 bg-white rounded-2xl p-5 border ${
            activeTypeFilter === 'gasto'
              ? 'border-rose-500 ring-2 ring-rose-100 shadow-sm'
              : 'border-stone-200 hover:border-rose-300 hover:shadow-xs'
          }`}
          role="button"
          tabIndex={0}
          title="Clique para filtrar apenas Gastos"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Gastos & Despesas
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-700 font-mono tabular-nums">
            {formatCurrency(totalGastos)}
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
              <span>Pago: {formatCurrency(gastosPagos)}</span>
            </span>
            <span className="text-stone-400">
              {gastos.length} {gastos.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          {gastosPendentes > 0 && (
            <p className="text-[11px] text-amber-600 mt-1">
              A vencer/pagar: {formatCurrency(gastosPendentes)}
            </p>
          )}
        </div>

        {/* Card Saldo da Casa */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Saldo Líquido
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                saldo >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono tabular-nums ${
              saldo >= 0 ? 'text-stone-900' : 'text-rose-600'
            }`}
          >
            {formatCurrency(saldo)}
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className={saldo >= 0 ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}>
              {saldo >= 0 ? 'Orçamento equilibrado' : 'Gastos excederam ganhos'}
            </span>
            <span className="text-stone-400">Ganhos - Gastos</span>
          </div>
        </div>

        {/* Card Objetivos */}
        <div
          onClick={() => onSelectTypeFilter && onSelectTypeFilter(activeTypeFilter === 'objetivo' ? 'todos' : 'objetivo')}
          className={`cursor-pointer transition-all duration-200 bg-white rounded-2xl p-5 border ${
            activeTypeFilter === 'objetivo'
              ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-sm'
              : 'border-stone-200 hover:border-indigo-300 hover:shadow-xs'
          }`}
          role="button"
          tabIndex={0}
          title="Clique para filtrar apenas Objetivos"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Objetivos & Metas
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-700 font-mono tabular-nums">
            {formatCurrency(totalObjetivos)}
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{objetivosAtingidos} atingido{objetivosAtingidos === 1 ? '' : 's'}</span>
            </span>
            <span className="text-stone-500">
              {objetivosEmAndamento} em andamento
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
