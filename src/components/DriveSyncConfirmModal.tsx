import React from 'react';
import { CloudUpload, AlertTriangle, X, Check, FileSpreadsheet } from 'lucide-react';

interface DriveSyncConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemsCount: number;
  categoriesCount: number;
  isSaving: boolean;
}

export const DriveSyncConfirmModal: React.FC<DriveSyncConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemsCount,
  categoriesCount,
  isSaving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
            <CloudUpload className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              Gravar alterações no Google Drive?
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Esta ação irá sobrescrever e atualizar os arquivos CSV da sua conta no Google Drive com os dados atuais da aplicação.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details of affected files */}
        <div className="p-6 space-y-3 bg-stone-50/75">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Arquivos afetados no Google Drive:
          </span>

          <div className="space-y-2">
            <div className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-stone-800 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>items.csv</span>
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {itemsCount} lançamentos
              </span>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-stone-800 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                <span>categories.csv</span>
              </span>
              <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                {categoriesCount} categorias
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-amber-800 text-[11px] leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Os arquivos antigos no seu Google Drive serão substituídos por esta nova versão sincronizada.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-stone-100 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#1b5e3a] hover:bg-[#154a2e] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gravando no Google Drive...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirmar e Gravar no Drive</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
