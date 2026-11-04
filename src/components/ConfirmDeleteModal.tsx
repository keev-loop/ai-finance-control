import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { FinanceItem } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  item: FinanceItem | null;
  onClose: () => void;
  onConfirm: (item: FinanceItem) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-stone-900">
                Confirmar Exclusão
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Você tem certeza que deseja excluir o registro{' '}
                <strong className="text-stone-800">"{item.titulo}"</strong> no valor de{' '}
                <strong className="text-stone-800 font-mono">
                  {formatCurrency(item.valor)}
                </strong>
                ? Esta ação removerá o item permanentemente do controle financeiro.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm(item);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Sim, Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
