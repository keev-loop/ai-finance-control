import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';
import { FinanceCategory, FinanceItem, ItemStatus, ItemType } from '../types/finance';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<FinanceItem, 'id' | 'criadoEm' | 'atualizadoEm'>, idToEdit?: string) => void;
  categories: FinanceCategory[];
  itemToEdit?: FinanceItem | null;
  initialType?: ItemType;
  onOpenCategories?: () => void;
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  itemToEdit,
  initialType = 'gasto',
  onOpenCategories,
}) => {
  const [tipo, setTipo] = useState<ItemType>(initialType);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [valor, setValor] = useState<string>('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState<ItemStatus>('pendente');
  const [responsavel, setResponsavel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setTipo(itemToEdit.tipo);
        setTitulo(itemToEdit.titulo);
        setDescricao(itemToEdit.descricao || '');
        setCategoriaId(itemToEdit.categoriaId);
        setValor(itemToEdit.valor.toString());
        setData(itemToEdit.data);
        setStatus(itemToEdit.status);
        setResponsavel(itemToEdit.responsavel || '');
      } else {
        setTipo(initialType);
        setTitulo('');
        setDescricao('');
        setCategoriaId(categories[0]?.id || '');
        setValor('');
        setData(new Date().toISOString().split('T')[0]);
        // Default sensible status by type
        if (initialType === 'ganho') setStatus('recebido');
        else if (initialType === 'gasto') setStatus('pago');
        else setStatus('em_andamento');
        setResponsavel('');
      }
      setErrors({});
    }
  }, [isOpen, itemToEdit, initialType, categories]);

  // Adjust default status when type changes (only in create mode)
  const handleTypeChange = (newType: ItemType) => {
    setTipo(newType);
    if (!itemToEdit) {
      if (newType === 'ganho') setStatus('recebido');
      else if (newType === 'gasto') setStatus('pago');
      else setStatus('em_andamento');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!titulo.trim()) {
      newErrors.titulo = 'Informe o título do item';
    }

    const numValor = parseFloat(valor.replace(',', '.'));
    if (isNaN(numValor) || numValor <= 0) {
      newErrors.valor = 'Informe um valor válido maior que zero';
    }

    if (!categoriaId) {
      newErrors.categoriaId = 'Selecione uma categoria';
    }

    if (!data) {
      newErrors.data = 'Informe a data';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        tipo,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoriaId,
        valor: numValor,
        data,
        status,
        responsavel: responsavel.trim() || undefined,
      },
      itemToEdit ? itemToEdit.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              {itemToEdit ? 'Editar Registro' : 'Novo Registro Financeiro'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {itemToEdit
                ? 'Atualize os dados do registro familiar'
                : 'Cadastre um ganho, gasto ou objetivo para o controle da casa'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Tipo Selector: Segmented Control */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Tipo do Registro
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => handleTypeChange('ganho')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'ganho'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Ganho</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('gasto')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'gasto'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <span>Gasto</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('objetivo')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'objetivo'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Objetivo</span>
              </button>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Título <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={
                tipo === 'ganho'
                  ? 'Ex: Salário, Venda de item, Bônus'
                  : tipo === 'gasto'
                  ? 'Ex: Supermercado do mês, Conta de luz, Combustível'
                  : 'Ex: Reserva de emergência, Viagem de férias'
              }
              className={`w-full px-3.5 py-2.5 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                errors.titulo ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
              }`}
            />
            {errors.titulo && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Grid: Valor & Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Valor */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Valor (R$) <span className="text-rose-500">*</span>
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
                  placeholder="0,00"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-sm font-mono font-bold bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                    errors.valor ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                  }`}
                />
              </div>
              {errors.valor && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.valor}
                </p>
              )}
            </div>

            {/* Data */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Data <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                  errors.data ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                }`}
              />
              {errors.data && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.data}
                </p>
              )}
            </div>
          </div>

          {/* Grid: Categoria & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Categoria */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Categoria <span className="text-rose-500">*</span>
                </label>
                {onOpenCategories && (
                  <button
                    type="button"
                    onClick={onOpenCategories}
                    className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                  >
                    + Gerenciar
                  </button>
                )}
              </div>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className={`w-full px-3 py-2.5 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                  errors.categoriaId ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
                }`}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className="w-full px-3 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                {tipo === 'ganho' && (
                  <>
                    <option value="recebido">Recebido (Já caiu na conta)</option>
                    <option value="pendente">Pendente (A receber)</option>
                  </>
                )}
                {tipo === 'gasto' && (
                  <>
                    <option value="pago">Pago (Liquidado)</option>
                    <option value="pendente">Pendente (A pagar / Vencer)</option>
                  </>
                )}
                {tipo === 'objetivo' && (
                  <>
                    <option value="em_andamento">Em andamento (Juntando)</option>
                    <option value="atingido">Atingido (Concluído! 🎉)</option>
                    <option value="pendente">Planejado (Não iniciado)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes adicionais, anotações ou observações para os moradores..."
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          {/* Responsável / Morador */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Responsável / Morador (opcional)
            </label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Ex: Família, Lucas, Maria, Todos"
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {itemToEdit ? 'Salvar Alterações' : 'Cadastrar Item'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
