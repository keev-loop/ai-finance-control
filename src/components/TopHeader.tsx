import React from 'react';
import { UserProfile, ActiveView } from '../types/finance';
import { Menu, ChevronDown, PlusCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TopHeaderProps {
  user: UserProfile;
  activeView: ActiveView;
  onOpenMobileMenu: () => void;
  onNavigateToAccount: () => void;
  onOpenNewItem: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  activeView,
  onOpenMobileMenu,
  onNavigateToAccount,
  onOpenNewItem,
}) => {
  const getViewTitle = () => {
    switch (activeView) {
      case 'inicio':
        return 'Visão Geral da Família';
      case 'ganhos':
        return 'Ganhos e Receitas';
      case 'gastos':
        return 'Gastos e Despesas';
      case 'objetivos':
        return 'Objetivos e Metas';
      case 'categorias':
        return 'Categorias da Família';
      case 'relatorios':
        return 'Relatórios Financeiros';
      case 'conta':
        return 'Conta do Usuário';
      default:
        return 'Família Finanças';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-xs border-b border-stone-200 sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      
      {/* Left side: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="md:hidden">
          <BrandLogo size="sm" />
        </div>

        <div className="hidden md:block">
          <h2 className="text-base font-bold text-stone-800 tracking-tight">
            {getViewTitle()}
          </h2>
          <p className="text-xs text-stone-400">
            {user.nomeFamilia} · Organização compartilhada
          </p>
        </div>
      </div>

      {/* Right side: Quick Add button + User profile badge matching Screen 1 */}
      <div className="flex items-center gap-3">
        
        {/* Quick Add button */}
        <button
          onClick={onOpenNewItem}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1b5e3a] hover:bg-[#154a2e] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Novo Item</span>
        </button>

        {/* User Profile Pill matching Screen 1: Avatar + "Lucas S." + Google G badge */}
        <button
          onClick={onNavigateToAccount}
          className="flex items-center gap-2.5 p-1 pl-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-2xl transition-all cursor-pointer group"
          title="Ver Conta do Usuário"
        >
          <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900 truncate max-w-[100px] sm:max-w-none">
            {user.nome.split(' ')[0]} {user.nome.split(' ')[1]?.[0] || 'S'}.
          </span>

          {/* Avatar with Google Badge */}
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.nome}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            />
            {/* Google Icon Badge in corner */}
            {user.provider === 'google' && (
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs border border-stone-200">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </span>
            )}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 hidden sm:block mr-1" />
        </button>

      </div>
    </header>
  );
};
