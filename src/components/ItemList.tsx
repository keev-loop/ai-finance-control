import React from 'react';
import { PlusCircle, SearchX, Pencil, Trash2, Calendar, User, Check, Clock } from 'lucide-react';
import { FinanceCategory, FinanceItem } from '../types/finance';
import { ItemCard } from './ItemCard';
import { formatCurrency, formatDate, getStatusLabel, getTypeLabel } from '../utils/formatters';

interface ItemListProps {
  items: FinanceItem[];
  categories: FinanceCategory[];
  viewMode: 'grid' | 'table';
  onEdit: (item: FinanceItem) => void;
  onDelete: (item: FinanceItem) => void;
  onToggleStatus: (item: FinanceItem) => void;
  onAddNew: () => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  categories,
  viewMode,
  onEdit,
  onDelete,
  onToggleStatus,
  onAddNew,
}) => {
  const categoryMap = new Map<string, FinanceCategory>();
  categories.forEach((cat) => categoryMap.set(cat.id, cat));

  if (items.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center shadow-2xs">
        <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-stone-800">
          Nenhum item financeiro encontrado
        </h4>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-5">
          Não há registros correspondentes aos filtros selecionados ou ainda não foram cadastrados itens nesta categoria.
        </p>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Primeiro Item</span>
        </button>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            category={categoryMap.get(item.categoriaId)}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>
    );
  }

  // Table view
  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Item & Descrição</th>
              <th className="py-3.5 px-3">Tipo</th>
              <th className="py-3.5 px-3">Categoria</th>
              <th className="py-3.5 px-3">Data</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-4 text-right">Valor</th>
              <th className="py-3.5 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((item) => {
              const cat = categoryMap.get(item.categoriaId);
              const isGanho = item.tipo === 'ganho';
              const isGasto = item.tipo === 'gasto';
              const isCompleted =
                item.status === 'pago' || item.status === 'recebido' || item.status === 'atingido';

              return (
                <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                  {/* Title & Desc */}
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="font-semibold text-stone-900 text-sm">
                      {item.titulo}
                    </div>
                    {item.descricao && (
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        {item.descricao}
                      </div>
                    )}
                    {item.responsavel && (
                      <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <User className="w-2.5 h-2.5" />
                        <span>{item.responsavel}</span>
                      </div>
                    )}
                  </td>

                  {/* Tipo */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`font-medium px-2 py-0.5 rounded-md text-[11px] ${
                        isGanho
                          ? 'text-emerald-700 bg-emerald-50'
                          : isGasto
                          ? 'text-rose-700 bg-rose-50'
                          : 'text-indigo-700 bg-indigo-50'
                      }`}
                    >
                      {getTypeLabel(item.tipo)}
                    </span>
                  </td>

                  {/* Categoria */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-medium text-stone-700">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat?.cor || '#a8a29e' }}
                      />
                      <span>{cat?.nome || 'Geral'}</span>
                    </div>
                  </td>

                  {/* Data */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-stone-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{formatDate(item.data)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus(item)}
                      title="Clique para alternar status"
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      ) : (
                        <Clock className="w-2.5 h-2.5 text-amber-600" />
                      )}
                      <span>{getStatusLabel(item.status, item.tipo)}</span>
                    </button>
                  </td>

                  {/* Valor */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono font-bold text-sm tabular-nums">
                    <span
                      className={
                        isGanho
                          ? 'text-emerald-700'
                          : isGasto
                          ? 'text-rose-700'
                          : 'text-indigo-700'
                      }
                    >
                      {isGanho ? '+ ' : isGasto ? '- ' : ''}
                      {formatCurrency(item.valor)}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        title="Editar registro"
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        title="Excluir registro"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
