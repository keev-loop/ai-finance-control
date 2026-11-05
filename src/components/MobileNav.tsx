import React, { useState } from 'react';
import { ActiveView } from '../types/finance';
import { Home, TrendingDown, Plus, LayoutGrid, User, X, Tag } from 'lucide-react';

interface MobileNavProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenNewItem: () => void;
  onOpenNewCategory: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeView,
  onNavigate,
  onOpenNewItem,
  onOpenNewCategory,
}) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const handleAction = (action: 'item' | 'category') => {
    setIsActionMenuOpen(false);
    if (action === 'item') onOpenNewItem();
    else onOpenNewCategory();
  };

  return (
    <>
      {/* Mobile Action Menu Bottom Sheet (matching Screen 8 & 9) */}
      {isActionMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-stone-900/40 backdrop-blur-xs flex items-end justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 border border-stone-200 shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Ações Rápidas
              </span>
              <button
                onClick={() => setIsActionMenuOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleAction('item')}
                className="w-full flex items-center gap-3 p-3.5 bg-stone-50 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 rounded-2xl font-bold text-sm transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span>+ Add Item (Novo Lançamento)</span>
              </button>

              <button
                onClick={() => handleAction('category')}
                className="w-full flex items-center gap-3 p-3.5 bg-stone-50 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 rounded-2xl font-bold text-sm transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <span>+ Add Category (Nova Categoria)</span>
              </button>
            </div>
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setIsActionMenuOpen(false)} />
        </div>
      )}

      {/* Bottom Sticky Navigation Bar matching Screen 6 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2 flex items-center justify-around shadow-lg">
        
        {/* Início */}
        <button
          onClick={() => onNavigate('inicio')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeView === 'inicio' ? 'text-[#1b5e3a]' : 'text-stone-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Início</span>
        </button>

        {/* Gastos */}
        <button
          onClick={() => onNavigate('gastos')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeView === 'gastos' ? 'text-[#1b5e3a]' : 'text-stone-400'
          }`}
        >
          <TrendingDown className="w-5 h-5" />
          <span>Gastos</span>
        </button>

        {/* Floating Center Action Button "+" matching Screen 6 */}
        <div className="-mt-6">
          <button
            onClick={() => setIsActionMenuOpen(true)}
            className="w-12 h-12 rounded-full bg-[#1b5e3a] hover:bg-[#154a2e] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
            title="Abrir menu de ações"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Categorias */}
        <button
          onClick={() => onNavigate('categorias')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeView === 'categorias' ? 'text-[#1b5e3a]' : 'text-stone-400'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Contas</span>
        </button>

        {/* Minha Conta / Mais */}
        <button
          onClick={() => onNavigate('conta')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
            activeView === 'conta' ? 'text-[#1b5e3a]' : 'text-stone-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </button>

      </div>
    </>
  );
};
