import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { FinanceCategory, FinanceItem, ItemStatus, ItemType } from '../types/finance';

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<FinanceItem, 'id' | 'criadoEm' | 'atualizadoEm'>, idToEdit?: string) => void;
  categories: FinanceCategory[];
  itemToEdit?: FinanceItem | null;
  initialType?: ItemType;
  moradores?: string[];
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  itemToEdit,
  initialType = 'gasto',
  moradores = ['Lucas Silva', 'Mariana Silva'],
}) => {
  const [tipo, setTipo] = useState<ItemType>(initialType);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<string>('');
  const [categoriaId, setCategoriaId] = useState('');
  const [data, setData] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [status, setStatus] = useState<ItemStatus>('pago');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setTipo(itemToEdit.tipo);
        setDescricao(itemToEdit.titulo);
        setValor(itemToEdit.valor.toString());
        setCategoriaId(itemToEdit.categoriaId);
        setData(itemToEdit.data);
        setResponsavel(itemToEdit.responsavel || moradores[0] || 'Família');
        setStatus(itemToEdit.status);
      } else {
        setTipo(initialType);
        setDescricao('');
        setValor('');
        setCategoriaId(categories[0]?.id || '');
        setData(new Date().toISOString().split('T')[0]);
        setResponsavel(moradores[0] || 'Família');
        setStatus(initialType === 'ganho' ? 'recebido' : initialType === 'gasto' ? 'pago' : 'em_andamento');
      }
      setError('');
    }
  }, [isOpen, itemToEdit, initialType, categories, moradores]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      setError('Por favor, informe a descrição do item.');
      return;
    }

    const numVal = parseFloat(valor.replace(',', '.'));
    if (isNaN(numVal) || numVal <= 0) {
      setError('Por favor, informe um valor válido maior que zero.');
      return;
    }

    if (!categoriaId) {
      setError('Selecione uma categoria.');
      return;
    }

    if (!data) {
      setError('Informe a data.');
      return;
    }

    onSave(
      {
        tipo,
        titulo: descricao.trim(),
        descricao: descricao.trim(),
        categoriaId,
        valor: numVal,
        data,
        status,
        responsavel: responsavel.trim() || undefined,
      },
      itemToEdit ? itemToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Dialog matching Screen 4 ("New Item Modal") */}
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header matching Screen 4 */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-base font-black text-stone-900 tracking-tight">
            {itemToEdit ? 'Edit Item' : 'New Item Modal'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body matching Screen 4 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* 1. Type with Radio Buttons (Income, Expense, Goal) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Type
            </label>
            <div className="flex items-center gap-5 text-xs font-semibold text-stone-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="itemType"
                  value="ganho"
                  checked={tipo === 'ganho'}
                  onChange={() => {
                    setTipo('ganho');
                    setStatus('recebido');
                  }}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-[#1b5e3a]"
                />
                <span>Income</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="itemType"
                  value="gasto"
                  checked={tipo === 'gasto'}
                  onChange={() => {
                    setTipo('gasto');
                    setStatus('pago');
                  }}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 accent-[#1b5e3a]"
                />
                <span>Expense</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="itemType"
                  value="objetivo"
                  checked={tipo === 'objetivo'}
                  onChange={() => {
                    setTipo('objetivo');
                    setStatus('em_andamento');
                  }}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 accent-[#1b5e3a]"
                />
                <span>Goal</span>
              </label>
            </div>
          </div>

          {/* 2. Description Input */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Salário, Mercado, Depósito p/ Viagem"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
            />
          </div>

          {/* 3. Value Input (R$) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Value
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="3.550,00"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm font-mono font-bold bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
              />
            </div>
          </div>

          {/* 4. Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Category
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Date Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
              />
            </div>
          </div>

          {/* 6. Responsável / Morador */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Morador / Responsável
            </label>
            <select
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
            >
              <option value="Família">Família Toda</option>
              {moradores.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {/* Buttons: Cancel & Save matching Screen 4 */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1b5e3a] hover:bg-[#154a2e] active:bg-[#0f3621] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
