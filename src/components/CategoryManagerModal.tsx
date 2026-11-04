import React, { useState } from 'react';
import { X, Tag, Plus, Pencil, Trash2, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { FinanceCategory, FinanceItem } from '../types/finance';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FinanceCategory[];
  items: FinanceItem[];
  onAddCategory: (category: Omit<FinanceCategory, 'id' | 'criadaEm'>) => void;
  onUpdateCategory: (id: string, updates: Partial<FinanceCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

const PRESET_COLORS = [
  { name: 'Esmeralda', hex: '#10b981' },
  { name: 'Âmbar', hex: '#f59e0b' },
  { name: 'Céu', hex: '#0ea5e9' },
  { name: 'Rosa', hex: '#f43f5e' },
  { name: 'Violeta', hex: '#8b5cf6' },
  { name: 'Índigo', hex: '#6366f1' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Laranja', hex: '#f97316' },
  { name: 'Ardósia', hex: '#64748b' },
  { name: 'Coral', hex: '#fb7185' },
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  items,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState(PRESET_COLORS[0].hex);
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const countItemsByCategory = (catId: string): number => {
    return items.filter((i) => i.categoriaId === catId).length;
  };

  const handleStartEdit = (cat: FinanceCategory) => {
    setEditingId(cat.id);
    setNome(cat.nome);
    setCor(cat.cor);
    setDescricao(cat.descricao || '');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNome('');
    setCor(PRESET_COLORS[0].hex);
    setDescricao('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('Por favor, informe o nome da categoria.');
      return;
    }

    if (editingId) {
      onUpdateCategory(editingId, {
        nome: nome.trim(),
        cor,
        descricao: descricao.trim() || undefined,
      });
      handleCancelEdit();
    } else {
      onAddCategory({
        nome: nome.trim(),
        cor,
        descricao: descricao.trim() || undefined,
      });
      setNome('');
      setDescricao('');
      setCor(PRESET_COLORS[(categories.length + 1) % PRESET_COLORS.length].hex);
      setError('');
    }
  };

  const handleDelete = (cat: FinanceCategory) => {
    const count = countItemsByCategory(cat.id);
    const confirmMsg =
      count > 0
        ? `A categoria "${cat.nome}" possui ${count} item(ns) associado(s). Tem certeza que deseja excluí-la? Os itens serão reclassificados.`
        : `Deseja realmente excluir a categoria "${cat.nome}"?`;

    if (window.confirm(confirmMsg)) {
      onDeleteCategory(cat.id);
      if (editingId === cat.id) {
        handleCancelEdit();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Gerenciar Categorias
              </h3>
              <p className="text-xs text-stone-500">
                Cadastre, edite ou exclua as categorias do orçamento da casa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Form to Add or Edit */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4.5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                {editingId ? (
                  <>
                    <Pencil className="w-3.5 h-3.5 text-stone-500" />
                    <span>Editando Categoria</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nova Categoria</span>
                  </>
                )}
              </h4>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Cancelar Edição</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nome da Categoria <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Pets, Farmácia, Jardinagem"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cor de Destaque
                  </label>
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setCor(c.hex)}
                          title={c.name}
                          className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative ${
                            cor === c.hex
                              ? 'ring-2 ring-stone-900 ring-offset-1 scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {cor === c.hex && (
                            <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição (opcional)
                </label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Ração, vacinas e cuidados com o cachorro"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Descartar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingId ? 'Salvar Categoria' : 'Adicionar Categoria'}
                </button>
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Categorias Cadastradas ({categories.length})
              </h4>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const itemCount = countItemsByCategory(cat.id);
                const isCurrentEdit = editingId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrentEdit
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: cat.cor }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-stone-900 truncate">
                            {cat.nome}
                          </span>
                          <span className="text-[11px] font-medium text-stone-400 shrink-0">
                            ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
                          </span>
                        </div>
                        {cat.descricao && (
                          <p className="text-xs text-stone-500 truncate mt-0.5">
                            {cat.descricao}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        title="Editar categoria"
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        title="Excluir categoria"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
