import React from 'react';
import { FinanceCategory, FinanceItem } from '../types/finance';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Search, Plus, Pencil, Trash2, Filter } from 'lucide-react';

interface MovementsTableProps {
  title?: string;
  items: FinanceItem[];
  categories: FinanceCategory[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onOpenNewItem: () => void;
  onEditItem: (item: FinanceItem) => void;
  onDeleteItem: (item: FinanceItem) => void;
}

export const MovementsTable: React.FC<MovementsTableProps> = ({
  title = 'Últimas Movimentações',
  items,
  categories,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenNewItem,
  onEditItem,
  onDeleteItem,
}) => {
  const categoryMap = new Map<string, FinanceCategory>();
  categories.forEach((c) => categoryMap.set(c.id, c));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-2xs">
      
      {/* Header bar with Search, Category filters, and + Add Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        
        {/* Title */}
        <h3 className="text-lg font-black text-stone-900 tracking-tight shrink-0">
          {title}
        </h3>

        {/* Filter controls matching Screen 1 & 5 */}
        <div className="flex flex-wrap items-center gap-3 flex-1 lg:justify-end">
          
          {/* Search Box */}
          <div className="relative min-w-[180px] sm:w-60">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
            />
          </div>

          {/* Category Dropdown Filter matching Screen 1 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-500 font-semibold hidden sm:inline">
              Categoria:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
            >
              <option value="todas">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Green CTA Button: "+ Adicionar Novo Item" matching Screen 1 */}
          <button
            onClick={onOpenNewItem}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b5e3a] hover:bg-[#154a2e] active:bg-[#0f3621] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Adicionar Novo Item</span>
          </button>

        </div>

      </div>

      {/* Table matching Screen 1 & 5 */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-stone-600 font-bold text-xs">
              <th className="py-3 px-3 font-bold">Data</th>
              <th className="py-3 px-4 font-bold">Descrição</th>
              <th className="py-3 px-3 font-bold">Categoria</th>
              <th className="py-3 px-4 text-right font-bold">Valor</th>
              <th className="py-3 px-3 text-center font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-stone-400 text-xs">
                  Nenhuma movimentação encontrada para os filtros selecionados.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const cat = categoryMap.get(item.categoriaId);
                const isGanho = item.tipo === 'ganho';
                const isGasto = item.tipo === 'gasto';

                const valorClass = isGanho
                  ? 'text-[#16a34a]'
                  : isGasto
                  ? 'text-[#dc2626]'
                  : 'text-[#0284c7]';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/80 transition-colors group"
                  >
                    {/* Data (e.g. 07/07/2023) */}
                    <td className="py-3.5 px-3 text-stone-700 font-medium whitespace-nowrap">
                      {formatDate(item.data)}
                    </td>

                    {/* Descrição */}
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      <span>{item.titulo}</span>
                      {item.responsavel && (
                        <span className="block text-[10px] text-stone-400 font-normal">
                          Por: {item.responsavel}
                        </span>
                      )}
                    </td>

                    {/* Categoria */}
                    <td className="py-3.5 px-3 text-stone-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat?.cor || '#64748b' }}
                        />
                        <span>{cat?.nome.split('/')[0].trim() || 'Geral'}</span>
                      </div>
                    </td>

                    {/* Valor (R$ 12.500,00) */}
                    <td
                      className={`py-3.5 px-4 text-right font-mono font-bold text-sm tabular-nums whitespace-nowrap ${valorClass}`}
                    >
                      {formatCurrency(item.valor)}
                    </td>

                    {/* Ações (Pencil & Trash matching Screen 1) */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEditItem(item)}
                          title="Editar lançamento"
                          className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item)}
                          title="Excluir lançamento"
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
