import React from 'react';
import { FinanceCategory, FinanceItem, ItemFilter, ItemStatus, ItemType } from '../types/finance';
import { getStatusLabel, getTypeLabel } from '../utils/formatters';

interface ItemCountersProps {
  allItems: FinanceItem[];
  filteredItems: FinanceItem[];
  categories: FinanceCategory[];
  filter: ItemFilter;
  onFilterChange: (updates: Partial<ItemFilter>) => void;
}

export const ItemCounters: React.FC<ItemCountersProps> = ({
  allItems,
  filteredItems,
  categories,
  filter,
  onFilterChange,
}) => {
  // Count by Type
  const countByType: Record<ItemType, number> = {
    ganho: allItems.filter((i) => i.tipo === 'ganho').length,
    gasto: allItems.filter((i) => i.tipo === 'gasto').length,
    objetivo: allItems.filter((i) => i.tipo === 'objetivo').length,
  };

  // Count by Status
  const statuses: ItemStatus[] = ['pendente', 'pago', 'recebido', 'em_andamento', 'atingido'];
  const countByStatus: Record<string, number> = {};
  statuses.forEach((st) => {
    countByStatus[st] = allItems.filter((i) => i.status === st).length;
  });

  // Count by Category
  const countByCategory: Record<string, number> = {};
  categories.forEach((cat) => {
    countByCategory[cat.id] = allItems.filter((i) => i.categoriaId === cat.id).length;
  });

  const isFiltered =
    filter.tipo !== 'todos' ||
    filter.categoriaId !== 'todas' ||
    filter.status !== 'todos' ||
    Boolean(filter.busca);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xs space-y-4">
      {/* Top summary row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <h3 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Contagem e Distribuição de Itens</span>
            <span className="text-xs font-normal text-stone-500">
              (Total no sistema: {allItems.length})
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isFiltered ? (
              <span>
                Exibindo <strong className="text-stone-900 font-semibold">{filteredItems.length}</strong> de{' '}
                {allItems.length} itens correspondentes aos filtros aplicados
              </span>
            ) : (
              <span>Todos os {allItems.length} itens do controle familiar</span>
            )}
          </p>
        </div>

        {isFiltered && (
          <button
            onClick={() =>
              onFilterChange({
                tipo: 'todos',
                categoriaId: 'todas',
                status: 'todos',
                busca: '',
              })
            }
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer"
          >
            Remover todos os filtros
          </button>
        )}
      </div>

      {/* Interactive Quick Filter Counters */}
      <div className="space-y-3">
        {/* Row 1: Tipo */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
          <span className="font-semibold text-stone-600 sm:w-28 shrink-0">
            Filtrar por Tipo:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onFilterChange({ tipo: 'todos' })}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter.tipo === 'todos'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Todos ({allItems.length})
            </button>
            <button
              onClick={() => onFilterChange({ tipo: 'ganho' })}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter.tipo === 'ganho'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Ganhos ({countByType.ganho})
            </button>
            <button
              onClick={() => onFilterChange({ tipo: 'gasto' })}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter.tipo === 'gasto'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Gastos ({countByType.gasto})
            </button>
            <button
              onClick={() => onFilterChange({ tipo: 'objetivo' })}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter.tipo === 'objetivo'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Objetivos ({countByType.objetivo})
            </button>
          </div>
        </div>

        {/* Row 2: Status */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
          <span className="font-semibold text-stone-600 sm:w-28 shrink-0">
            Filtrar por Status:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onFilterChange({ status: 'todos' })}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter.status === 'todos'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Todos ({allItems.length})
            </button>
            {statuses.map((st) => {
              const count = countByStatus[st] || 0;
              const isActive = filter.status === st;
              return (
                <button
                  key={st}
                  onClick={() => onFilterChange({ status: st })}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {getStatusLabel(st)} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Categorias Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-2 text-xs pt-1">
          <span className="font-semibold text-stone-600 sm:w-28 shrink-0 pt-1">
            Por Categoria:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onFilterChange({ categoriaId: 'todas' })}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                filter.categoriaId === 'todas'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Todas ({allItems.length})
            </button>
            {categories.map((cat) => {
              const count = countByCategory[cat.id] || 0;
              const isActive = filter.categoriaId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ categoriaId: cat.id })}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-stone-800 text-white shadow-2xs'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.cor }}
                  />
                  <span>{cat.nome}</span>
                  <span className={`text-[10px] ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
