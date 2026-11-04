import React from 'react';
import { AlertTriangle, Compass, Plus, ArrowRight } from 'lucide-react';
import { FinanceItem } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface AlertBannerProps {
  items: FinanceItem[];
  onAddObjective: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ items, onAddObjective }) => {
  const totalGanhos = items
    .filter((i) => i.tipo === 'ganho')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const totalGastos = items
    .filter((i) => i.tipo === 'gasto')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const objetivosCount = items.filter((i) => i.tipo === 'objetivo').length;

  const gastosMaiorQueGanhos = totalGastos > totalGanhos && totalGanhos > 0;
  const semObjetivos = objetivosCount === 0;

  if (!gastosMaiorQueGanhos && !semObjetivos) {
    return null;
  }

  const deficit = totalGastos - totalGanhos;

  return (
    <div className="space-y-3 mb-6">
      {/* Alerta de Gastos maiores que Ganhos */}
      {gastosMaiorQueGanhos && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-rose-950 text-base">
                Atenção ao orçamento familiar: Os gastos superaram os ganhos!
              </h4>
              <p className="text-sm text-rose-800 mt-1 leading-relaxed">
                As despesas somam <strong className="font-mono">{formatCurrency(totalGastos)}</strong> enquanto as receitas somam <strong className="font-mono">{formatCurrency(totalGanhos)}</strong> (diferença negativa de <strong className="font-mono">{formatCurrency(deficit)}</strong>).
                Vale a pena reunir os moradores da casa para rever gastos não essenciais e reequilibrar as contas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta/Mensagem quando não há objetivos cadastrados */}
      {semObjetivos && (
        <div className="bg-amber-50/80 border border-amber-200 text-amber-950 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-950 text-base">
                Nenhum objetivo cadastrado para o lar ainda
              </h4>
              <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                Ter metas conjuntas — como montar uma reserva de emergência, reformar a casa ou planejar as férias da família — mantém todos motivados e focados.
              </p>
            </div>
          </div>
          <button
            onClick={onAddObjective}
            className="shrink-0 px-4 py-2 text-sm font-semibold text-amber-900 bg-amber-200/90 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Objetivo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
