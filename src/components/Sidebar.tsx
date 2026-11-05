import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ActiveView } from '../types/finance';
import {
  Home,
  TrendingUp,
  TrendingDown,
  Target,
  LayoutGrid,
  BarChart3,
  UserCheck,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'inicio', label: 'Início', icon: <Home className="w-4 h-4" /> },
    { id: 'ganhos', label: 'Ganhos', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'gastos', label: 'Gastos', icon: <TrendingDown className="w-4 h-4" /> },
    { id: 'objetivos', label: 'Objetivos', icon: <Target className="w-4 h-4" /> },
    { id: 'categorias', label: 'Categorias', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'relatorios', label: 'Relatórios', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'conta', label: 'Configurações / Conta', icon: <UserCheck className="w-4 h-4" /> },
  ];

  const handleItemClick = (id: ActiveView) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-stone-100 flex items-center justify-between">
        <BrandLogo
          size="md"
          onClick={() => handleItemClick('inicio')}
          className="cursor-pointer"
        />
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-[#e8f5e9] text-[#1b5e3a] font-bold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <span className={isActive ? 'text-[#1b5e3a]' : 'text-stone-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sair (Logout) at bottom */}
      <div className="p-4 border-t border-stone-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-rose-700 hover:bg-rose-50 transition-all text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-stone-400" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-stone-200 shrink-0 min-h-screen sticky top-0 h-screen">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden bg-stone-900/40 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
