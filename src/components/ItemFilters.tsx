import React from 'react';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, X } from 'lucide-react';
import { FinanceCategory, ItemFilter, ItemStatus, ItemType } from '../types/finance';

interface ItemFiltersProps {
  categories: FinanceCategory[];
  filter: ItemFilter;
  onFilterChange: (updates: Partial<ItemFilter>) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const ItemFilters: React.FC<ItemFiltersProps> = ({
  categories,
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  const hasActiveFilters =
    filter.tipo !== 'todos' ||
    filter.categoriaId !== 'todas' ||
    filter.status !== 'todos' ||
    filter.busca.trim().length > 0;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.busca}
            onChange={(e) => onFilterChange({ busca: e.target.value })}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800 placeholder-stone-400"
          />
          {filter.busca && (
            <button
              onClick={() => onFilterChange({ busca: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tipo */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 hidden sm:inline">Tipo:</span>
            <select
              value={filter.tipo}
              onChange={(e) => onFilterChange({ tipo: e.target.value as 'todos' | ItemType })}
              className="text-xs sm:text-sm bg-stone-50 border border-stone-200 text-stone-700 font-medium rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="ganho">Ganhos</option>
              <option value="gasto">Gastos</option>
              <option value="objetivo">Objetivos</option>
            </select>
          </div>

          {/* Categoria */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 hidden sm:inline">Categoria:</span>
            <select
              value={filter.categoriaId}
              onChange={(e) => onFilterChange({ categoriaId: e.target.value })}
              className="text-xs sm:text-sm bg-stone-50 border border-stone-200 text-stone-700 font-medium rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 max-w-[170px] truncate"
            >
              <option value="todas">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 hidden sm:inline">Status:</span>
            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="text-xs sm:text-sm bg-stone-50 border border-stone-200 text-stone-700 font-medium rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="recebido">Recebido</option>
              <option value="em_andamento">Em andamento</option>
              <option value="atingido">Atingido</option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-1.5">
            <select
              value={filter.ordenacao}
              onChange={(e) => onFilterChange({ ordenacao: e.target.value as ItemFilter['ordenacao'] })}
              className="text-xs sm:text-sm bg-stone-50 border border-stone-200 text-stone-700 font-medium rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="data_desc">Data (Mais recente)</option>
              <option value="data_asc">Data (Mais antiga)</option>
              <option value="valor_desc">Valor (Maior)</option>
              <option value="valor_asc">Valor (Menor)</option>
              <option value="titulo_asc">Título (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={() =>
                onFilterChange({
                  tipo: 'todos',
                  categoriaId: 'todas',
                  status: 'todos',
                  busca: '',
                })
              }
              title="Limpar todos os filtros"
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl ml-auto lg:ml-0">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Visualização em Cartões"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-2xs font-medium'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Visualização em Lista / Tabela"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-2xs font-medium'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
