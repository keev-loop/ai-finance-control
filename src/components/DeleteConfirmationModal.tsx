import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item?',
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal matching Screen 9 and 11 */}
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-center">
        
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-base font-black text-stone-900 tracking-tight">
          {title}
        </h3>

        <p className="text-xs text-stone-500 mt-2 leading-relaxed px-2">
          {message}
        </p>

        {/* Buttons matching Screen 9 & 11: Cancel & Delete */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};
