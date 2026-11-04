import React from 'react';
import { PlusCircle, Tag, Home, RotateCcw, Download, Upload } from 'lucide-react';

interface HeaderProps {
  onOpenNewItem: () => void;
  onOpenCategories: () => void;
  onResetDefaults: () => void;
  onExport: () => void;
  onImportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewItem,
  onOpenCategories,
  onResetDefaults,
  onExport,
  onImportClick,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  FinanceControl
                </span>
                <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                  Controle do Lar
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden md:block">
                Planejamento financeiro simples e acolhedor para a família
              </p>
            </div>
          </div>

          {/* Quick utility actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backup / Restore dropdown or buttons */}
            <div className="hidden lg:flex items-center gap-1 border-r border-stone-200 pr-3 mr-1">
              <button
                onClick={onExport}
                title="Exportar dados (backup JSON)"
                className="px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup</span>
              </button>
              <button
                onClick={onImportClick}
                title="Restaurar dados de arquivo JSON"
                className="px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
              <button
                onClick={onResetDefaults}
                title="Restaurar exemplos iniciais da casa"
                className="px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Exemplos</span>
              </button>
            </div>

            {/* Categorias */}
            <button
              onClick={onOpenCategories}
              className="px-3 sm:px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-stone-500" />
              <span>Categorias</span>
            </button>

            {/* Novo Item CTA */}
            <button
              onClick={onOpenNewItem}
              className="px-3.5 sm:px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Novo Registro</span>
              <span className="xs:hidden">Novo</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
