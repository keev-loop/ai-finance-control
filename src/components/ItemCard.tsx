import React from 'react';
import { Pencil, Trash2, Calendar, User, Check, Clock } from 'lucide-react';
import { FinanceCategory, FinanceItem, ItemStatus } from '../types/finance';
import { formatCurrency, formatDate, getStatusLabel, getTypeLabel } from '../utils/formatters';

interface ItemCardProps {
  item: FinanceItem;
  category?: FinanceCategory;
  onEdit: (item: FinanceItem) => void;
  onDelete: (item: FinanceItem) => void;
  onToggleStatus: (item: FinanceItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  category,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  // Color configuration by type
  const isGanho = item.tipo === 'ganho';
  const isGasto = item.tipo === 'gasto';
  const isObjetivo = item.tipo === 'objetivo';

  const typeBorder = isGanho
    ? 'border-emerald-200 hover:border-emerald-300'
    : isGasto
    ? 'border-rose-200 hover:border-rose-300'
    : 'border-indigo-200 hover:border-indigo-300';

  const typeBadgeStyle = isGanho
    ? 'text-emerald-700 bg-emerald-50'
    : isGasto
    ? 'text-rose-700 bg-rose-50'
    : 'text-indigo-700 bg-indigo-50';

  const isCompleted =
    item.status === 'pago' || item.status === 'recebido' || item.status === 'atingido';

  return (
    <div
      className={`bg-white rounded-2xl p-5 border ${typeBorder} shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group relative`}
    >
      <div>
        {/* Top line: Type and Category unboxed or gentle badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-semibold px-2 py-0.5 rounded-md ${typeBadgeStyle}`}>
              {getTypeLabel(item.tipo)}
            </span>
            <span className="text-stone-300">·</span>
            <div className="flex items-center gap-1.5 text-stone-600 font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: category?.cor || '#a8a29e' }}
              />
              <span className="truncate max-w-[140px]">
                {category?.nome || 'Geral'}
              </span>
            </div>
          </div>

          {/* Quick status button */}
          <button
            onClick={() => onToggleStatus(item)}
            title="Clique para alternar status rápido"
            className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            {isCompleted ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Clock className="w-3 h-3 text-amber-600" />
            )}
            <span>{getStatusLabel(item.status, item.tipo)}</span>
          </button>
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-stone-900 group-hover:text-stone-950 transition-colors leading-snug">
          {item.titulo}
        </h4>

        {/* Description */}
        {item.descricao && (
          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed">
            {item.descricao}
          </p>
        )}
      </div>

      {/* Bottom Section: Value and Metadata */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-end justify-between gap-3">
        <div>
          <div className="text-xs text-stone-400 font-medium">Valor</div>
          <div
            className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${
              isGanho ? 'text-emerald-700' : isGasto ? 'text-rose-700' : 'text-indigo-700'
            }`}
          >
            {isGanho ? '+ ' : isGasto ? '- ' : ''}
            {formatCurrency(item.valor)}
          </div>
        </div>

        {/* Actions & date */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(item.data)}</span>
            </span>
            {item.responsavel && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-stone-500">
                  <User className="w-3 h-3" />
                  <span className="max-w-[80px] truncate">{item.responsavel}</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
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
        </div>
      </div>
    </div>
  );
};
