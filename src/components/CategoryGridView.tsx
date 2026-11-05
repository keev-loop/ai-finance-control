import React from 'react';
import { FinanceCategory, FinanceItem } from '../types/finance';
import {
  Utensils,
  Home,
  Plane,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Tag,
} from 'lucide-react';

interface CategoryGridViewProps {
  categories: FinanceCategory[];
  items: FinanceItem[];
  onOpenNewCategory: () => void;
  onEditCategory: (category: FinanceCategory) => void;
  onDeleteCategory: (category: FinanceCategory) => void;
  onSelectCategoryFilter?: (categoryId: string) => void;
}

export const CategoryGridView: React.FC<CategoryGridViewProps> = ({
  categories,
  items,
  onOpenNewCategory,
  onEditCategory,
  onDeleteCategory,
  onSelectCategoryFilter,
}) => {
  // Helper to render icon by name
  const renderCategoryIcon = (iconName?: string) => {
    const iconClass = "w-5 h-5";
    switch (iconName) {
      case 'utensils':
        return <Utensils className={iconClass} />;
      case 'home':
        return <Home className={iconClass} />;
      case 'plane':
        return <Plane className={iconClass} />;
      case 'gamepad-2':
        return <Gamepad2 className={iconClass} />;
      case 'graduation-cap':
        return <GraduationCap className={iconClass} />;
      case 'heart-pulse':
        return <HeartPulse className={iconClass} />;
      case 'sparkles':
        return <Sparkles className={iconClass} />;
      case 'briefcase':
        return <Briefcase className={iconClass} />;
      default:
        return <Tag className={iconClass} />;
    }
  };

  const countItems = (catId: string) => {
    return items.filter((i) => i.categoriaId === catId).length;
  };

  const getSumItems = (catId: string) => {
    return items
      .filter((i) => i.categoriaId === catId)
      .reduce((acc, curr) => acc + (curr.valor || 0), 0);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
      
      {/* Header matching Screen 3: Family Expenses / Categorias da Família */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Family Expenses & Categorias
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organização visual dos centros de custo e metas do lar
          </p>
        </div>

        <button
          onClick={onOpenNewCategory}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1b5e3a] hover:bg-[#154a2e] active:bg-[#0f3621] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Adicionar Categoria</span>
        </button>
      </div>

      {/* Grid of Pastel Cards matching Screen 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const itemCount = countItems(cat.id);
          const totalVal = getSumItems(cat.id);

          return (
            <div
              key={cat.id}
              className="rounded-3xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[160px] group relative"
              style={{ backgroundColor: cat.corFundo || '#f5f5f4' }}
            >
              {/* Top: Icon + Name */}
              <div>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 shadow-2xs"
                  style={{ backgroundColor: '#ffffff', color: cat.cor }}
                >
                  {renderCategoryIcon(cat.icone)}
                </div>

                <h3
                  onClick={() => onSelectCategoryFilter && onSelectCategoryFilter(cat.id)}
                  className="font-black text-base text-stone-900 hover:text-stone-950 transition-colors cursor-pointer truncate"
                  title="Clique para filtrar itens desta categoria"
                >
                  {cat.nome}
                </h3>

                <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                  {cat.descricao || `${itemCount} registros cadastrados`}
                </p>
              </div>

              {/* Bottom: Item Count & Action Buttons (Pencil + Trash) */}
              <div className="mt-4 pt-3 border-t border-stone-900/5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-600">
                  {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCategory(cat)}
                    title="Editar categoria"
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white/70 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat)}
                    title="Excluir categoria"
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-white/70 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
