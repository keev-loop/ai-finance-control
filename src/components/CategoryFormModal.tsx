import React, { useState, useEffect } from 'react';
import { X, Tag, AlertCircle } from 'lucide-react';
import { FinanceCategory } from '../types/finance';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (catData: Omit<FinanceCategory, 'id' | 'criadaEm'>, idToEdit?: string) => void;
  categoryToEdit?: FinanceCategory | null;
}

const PASTEL_THEMES = [
  { name: 'Alimentação / Rosa', cor: '#e11d48', bg: '#ffe4e6', icone: 'utensils' },
  { name: 'Moradia / Pêssego', cor: '#ea580c', bg: '#ffedd5', icone: 'home' },
  { name: 'Viagem / Azul Céu', cor: '#0284c7', bg: '#e0f2fe', icone: 'plane' },
  { name: 'Lazer / Verde Menta', cor: '#16a34a', bg: '#dcfce7', icone: 'gamepad-2' },
  { name: 'Educação / Lavanda', cor: '#7c3aed', bg: '#f3e8ff', icone: 'graduation-cap' },
  { name: 'Saúde / Vermelho Suave', cor: '#dc2626', bg: '#fee2e2', icone: 'heart-pulse' },
  { name: 'Relax / Lilás', cor: '#9333ea', bg: '#fae8ff', icone: 'sparkles' },
  { name: 'Outros / Salmão', cor: '#be123c', bg: '#ffe4e6', icone: 'briefcase' },
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categoryToEdit,
}) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        setNome(categoryToEdit.nome);
        setDescricao(categoryToEdit.descricao || '');
        const idx = PASTEL_THEMES.findIndex((t) => t.cor === categoryToEdit.cor);
        setSelectedThemeIndex(idx !== -1 ? idx : 0);
      } else {
        setNome('');
        setDescricao('');
        setSelectedThemeIndex(0);
      }
      setError('');
    }
  }, [isOpen, categoryToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('Informe o nome da categoria.');
      return;
    }

    const theme = PASTEL_THEMES[selectedThemeIndex];
    onSave(
      {
        nome: nome.trim(),
        cor: theme.cor,
        corFundo: theme.bg,
        icone: theme.icone,
        descricao: descricao.trim() || undefined,
      },
      categoryToEdit ? categoryToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-base font-black text-stone-900 tracking-tight">
            {categoryToEdit ? 'Editar Categoria' : 'Nova Categoria'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nome da Categoria
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Pets, Mercado, Combustível"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Tema e Cor Pastel do Cartão
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PASTEL_THEMES.map((theme, idx) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => setSelectedThemeIndex(idx)}
                  className={`h-11 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                    selectedThemeIndex === idx
                      ? 'border-stone-900 scale-105 shadow-xs'
                      : 'border-transparent hover:scale-102'
                  }`}
                  style={{ backgroundColor: theme.bg }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: theme.cor }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Descrição (opcional)
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Ração, remédios e banho do pet"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-stone-800"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}

          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1b5e3a] hover:bg-[#154a2e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Salvar Categoria
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
