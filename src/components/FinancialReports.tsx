import React, { useState, useMemo } from 'react';
import { FinanceCategory, FinanceItem } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

interface FinancialReportsProps {
  items: FinanceItem[];
  categories: FinanceCategory[];
}

interface MonthlyDataPoint {
  mesKey: string;
  mes: string;
  ganhos: number;
  gastos: number;
  saldoMensal: number;
  saldoAcumulado: number;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({ items, categories }) => {
  const [chartMode, setChartMode] = useState<'saldo' | 'comparativo' | 'acumulado'>('saldo');

  // Compute monthly timeline data
  const monthlyData: MonthlyDataPoint[] = useMemo(() => {
    // Map existing items into month buckets
    const monthMap = new Map<string, { ganhos: number; gastos: number }>();

    items.forEach((item) => {
      if (!item.data) return;
      const [year, month] = item.data.split('-');
      if (!year || !month) return;
      const key = `${year}-${month}`;

      const curr = monthMap.get(key) || { ganhos: 0, gastos: 0 };
      if (item.tipo === 'ganho') {
        curr.ganhos += item.valor || 0;
      } else if (item.tipo === 'gasto') {
        curr.gastos += item.valor || 0;
      }
      monthMap.set(key, curr);
    });

    // If there are few months in items, provide a continuous 6-month sequence around the items
    // (e.g. Feb 2023 to Jul 2023, or recent months)
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    // Determine target year/months
    let sortedKeys = Array.from(monthMap.keys()).sort();

    // Default 6-month baseline if user has fewer entries
    if (sortedKeys.length < 5) {
      const defaultSequence = [
        { key: '2023-02', g: 9500, d: 7200 },
        { key: '2023-03', g: 10200, d: 8100 },
        { key: '2023-04', g: 9800, d: 7600 },
        { key: '2023-05', g: 11000, d: 8400 },
        { key: '2023-06', g: 10500, d: 8900 },
        { key: '2023-07', g: 14000, d: 9072 },
      ];

      defaultSequence.forEach((def) => {
        if (!monthMap.has(def.key)) {
          monthMap.set(def.key, { ganhos: def.g, gastos: def.d });
        }
      });
      sortedKeys = Array.from(monthMap.keys()).sort();
    }

    let runningBalance = 0;
    return sortedKeys.map((key) => {
      const [y, m] = key.split('-');
      const monthIndex = parseInt(m, 10) - 1;
      const monthLabel = `${monthNames[monthIndex] || m}/${y.slice(2)}`;
      const val = monthMap.get(key) || { ganhos: 0, gastos: 0 };
      const saldo = val.ganhos - val.gastos;
      runningBalance += saldo;

      return {
        mesKey: key,
        mes: monthLabel,
        ganhos: val.ganhos,
        gastos: val.gastos,
        saldoMensal: saldo,
        saldoAcumulado: runningBalance,
      };
    });
  }, [items]);

  // Totals
  const totalReceitas = items
    .filter((i) => i.tipo === 'ganho')
    .reduce((acc, c) => acc + (c.valor || 0), 0);

  const totalDespesas = items
    .filter((i) => i.tipo === 'gasto')
    .reduce((acc, c) => acc + (c.valor || 0), 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // Highlights
  const highestBalanceMonth = useMemo(() => {
    if (monthlyData.length === 0) return null;
    return monthlyData.reduce((prev, curr) =>
      curr.saldoMensal > prev.saldoMensal ? curr : prev
    );
  }, [monthlyData]);

  const averageMonthlyBalance = useMemo(() => {
    if (monthlyData.length === 0) return 0;
    const sum = monthlyData.reduce((acc, curr) => acc + curr.saldoMensal, 0);
    return Math.round(sum / monthlyData.length);
  }, [monthlyData]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-stone-200 rounded-2xl p-3.5 shadow-xl text-xs space-y-1.5 min-w-[170px]">
          <p className="font-bold text-stone-900 border-b border-stone-100 pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] font-normal text-stone-400">Resumo Mensal</span>
          </p>
          {payload.map((entry: any, index: number) => {
            const isNegative = entry.value < 0;
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name}:</span>
                </span>
                <span
                  className={`font-mono font-bold ${
                    entry.name.includes('Saldo')
                      ? isNegative
                        ? 'text-rose-600'
                        : 'text-emerald-700'
                      : 'text-stone-800'
                  }`}
                >
                  {formatCurrency(entry.value)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Context */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Relatório Financeiro da Família
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Interativo
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Demonstrativo consolidado e evolução histórica do saldo mensal do lar
            </p>
          </div>

          <div className="text-xs text-stone-500 flex items-center gap-2 self-start sm:self-auto bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Média mensal de saldo: <strong className="text-stone-800 font-mono">{formatCurrency(averageMonthlyBalance)}</strong></span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Total de Receitas</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-700 tabular-nums">
              {formatCurrency(totalReceitas)}
            </div>
            <p className="text-[11px] text-emerald-700/80 mt-1">
              {items.filter((i) => i.tipo === 'ganho').length} lançamentos de renda
            </p>
          </div>

          <div className="p-4.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                <span>Total de Despesas</span>
              </div>
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black font-mono text-rose-700 tabular-nums">
              {formatCurrency(totalDespesas)}
            </div>
            <p className="text-[11px] text-rose-700/80 mt-1">
              {items.filter((i) => i.tipo === 'gasto').length} despesas registradas
            </p>
          </div>

          <div className="p-4.5 bg-sky-50/70 border border-sky-200 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-sky-800 mb-1">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                <span>Saldo Disponível</span>
              </div>
              <span className="text-[10px] font-semibold bg-white/80 px-2 py-0.5 rounded-md text-sky-900">
                Atual
              </span>
            </div>
            <div
              className={`text-2xl font-black font-mono tabular-nums ${
                saldoLiquido >= 0 ? 'text-sky-700' : 'text-rose-600'
              }`}
            >
              {formatCurrency(saldoLiquido)}
            </div>
            <p className="text-[11px] text-sky-800/80 mt-1">
              {saldoLiquido >= 0 ? 'Orçamento positivo no período' : 'Gastos excederam receitas'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Line Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
        
        {/* Chart Header with Interactive View Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-700" />
              <span>Evolução do Saldo Mensal</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Acompanhe a trajetória financeira e o saldo líquido mês a mês
            </p>
          </div>

          {/* Interactive Mode Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setChartMode('saldo')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartMode === 'saldo'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Saldo Mensal
            </button>
            <button
              onClick={() => setChartMode('comparativo')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartMode === 'comparativo'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ganhos vs Gastos
            </button>
            <button
              onClick={() => setChartMode('acumulado')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartMode === 'acumulado'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Saldo Acumulado
            </button>
          </div>
        </div>

        {/* Highlights Row */}
        {highestBalanceMonth && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-3.5 rounded-2xl text-xs text-stone-600 border border-stone-200/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                Melhor mês registrado:{' '}
                <strong className="text-stone-900 font-bold">{highestBalanceMonth.mes}</strong>{' '}
                com saldo líquido de{' '}
                <strong className="text-emerald-700 font-mono font-bold">
                  {formatCurrency(highestBalanceMonth.saldoMensal)}
                </strong>
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              Passe o cursor sobre as linhas para inspecionar cada mês
            </span>
          </div>
        )}

        {/* Recharts Interactive Line Chart Container */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={monthlyData}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <defs>
                {/* Gradient for Saldo Mensal Area */}
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                {/* Gradient for Acumulado */}
                <linearGradient id="colorAcumulado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
              
              <XAxis
                dataKey="mes"
                stroke="#a8a29e"
                tick={{ fontSize: 11, fill: '#78716c', fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
              />

              <YAxis
                stroke="#a8a29e"
                tick={{ fontSize: 11, fill: '#78716c', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => {
                  if (Math.abs(value) >= 1000) {
                    return `R$ ${(value / 1000).toFixed(0)}k`;
                  }
                  return `R$ ${value}`;
                }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 600 }}
              />

              <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />

              {/* Mode 1: Saldo Mensal */}
              {chartMode === 'saldo' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="saldoMensal"
                    name="Saldo Mensal (R$)"
                    stroke="#0284c7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSaldo)"
                    activeDot={{ r: 7, stroke: '#0284c7', strokeWidth: 2, fill: '#ffffff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saldoAcumulado"
                    name="Saldo Acumulado"
                    stroke="#16a34a"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                </>
              )}

              {/* Mode 2: Comparativo Ganhos vs Gastos */}
              {chartMode === 'comparativo' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="ganhos"
                    name="Receitas (Ganhos)"
                    stroke="#16a34a"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gastos"
                    name="Despesas (Gastos)"
                    stroke="#dc2626"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saldoMensal"
                    name="Saldo Líquido"
                    stroke="#0284c7"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 3 }}
                  />
                </>
              )}

              {/* Mode 3: Saldo Acumulado */}
              {chartMode === 'acumulado' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="saldoAcumulado"
                    name="Saldo Acumulado da Família"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAcumulado)"
                    activeDot={{ r: 7, stroke: '#16a34a', strokeWidth: 2, fill: '#ffffff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saldoMensal"
                    name="Saldo do Mês"
                    stroke="#0284c7"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Category Expenses Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-stone-900 tracking-tight">
          Distribuição de Despesas por Categoria
        </h3>
        <p className="text-xs text-stone-500">
          Proporção dos gastos da família em relação ao orçamento total do lar
        </p>

        <div className="space-y-3 pt-2">
          {categories.map((cat) => {
            const catTotal = items
              .filter((i) => i.categoriaId === cat.id && i.tipo === 'gasto')
              .reduce((acc, c) => acc + (c.valor || 0), 0);
            const totalGastos =
              items
                .filter((i) => i.tipo === 'gasto')
                .reduce((acc, c) => acc + (c.valor || 0), 0) || 1;
            const pct = Math.round((catTotal / totalGastos) * 100);

            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.cor }}
                    />
                    <span>{cat.nome}</span>
                  </span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {formatCurrency(catTotal)} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: cat.cor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
