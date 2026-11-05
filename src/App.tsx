import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { AuthScreen } from './components/AuthScreen';
import { DashboardStats } from './components/DashboardStats';
import { MovementsTable } from './components/MovementsTable';
import { CategoryGridView } from './components/CategoryGridView';
import { UserAccountScreen } from './components/UserAccountScreen';
import { NewItemModal } from './components/NewItemModal';
import { CategoryFormModal } from './components/CategoryFormModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { AlertBanner } from './components/AlertBanner';
import { MobileNav } from './components/MobileNav';
import { storageService } from './services/storageService';
import {
  ActiveView,
  FinanceCategory,
  FinanceItem,
  ItemType,
  UserProfile,
} from './types/finance';
import { CheckCircle2, TrendingUp, TrendingDown, Target, Wallet } from 'lucide-react';
import { formatCurrency } from './utils/formatters';

export default function App() {
  // Authentication & Profile State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(storageService.getUserProfile());

  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Data State
  const [items, setItems] = useState<FinanceItem[]>([]);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);

  // Modals & Forms
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<FinanceItem | null>(null);
  const [initialItemType, setInitialItemType] = useState<ItemType>('gasto');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<FinanceCategory | null>(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'item' | 'category';
    item?: FinanceItem;
    category?: FinanceCategory;
  } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden File input for backup
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialization
  useEffect(() => {
    storageService.initialize();
    setCategories(storageService.getCategories());
    setItems(storageService.getItems());
    setUser(storageService.getUserProfile());
    setIsLoggedIn(storageService.isLoggedIn());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    storageService.saveUserProfile(loggedInUser);
    storageService.setLoggedIn(true);
    showToast(`Bem-vindo, ${loggedInUser.nome}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    storageService.setLoggedIn(false);
    showToast('Você saiu da sua conta.');
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    storageService.saveUserProfile(updated);
    showToast('Perfil do usuário atualizado com sucesso.');
  };

  // Item Handlers
  const handleOpenNewItem = (type: ItemType = 'gasto') => {
    setItemToEdit(null);
    setInitialItemType(type);
    setIsNewItemModalOpen(true);
  };

  const handleEditItem = (item: FinanceItem) => {
    setItemToEdit(item);
    setIsNewItemModalOpen(true);
  };

  const handleSaveItem = (
    itemData: Omit<FinanceItem, 'id' | 'criadoEm' | 'atualizadoEm'>,
    idToEdit?: string
  ) => {
    if (idToEdit) {
      storageService.updateItem(idToEdit, itemData);
      showToast('Lançamento atualizado com sucesso!');
    } else {
      storageService.addItem(itemData);
      showToast('Novo lançamento salvo com sucesso!');
    }
    setItems(storageService.getItems());
  };

  const handleDeleteItemPrompt = (item: FinanceItem) => {
    setDeleteTarget({ type: 'item', item });
  };

  // Category Handlers
  const handleOpenNewCategory = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: FinanceCategory) => {
    setCategoryToEdit(cat);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (
    catData: Omit<FinanceCategory, 'id' | 'criadaEm'>,
    idToEdit?: string
  ) => {
    if (idToEdit) {
      storageService.updateCategory(idToEdit, catData);
      showToast('Categoria atualizada com sucesso!');
    } else {
      storageService.addCategory(catData);
      showToast('Nova categoria criada com sucesso!');
    }
    setCategories(storageService.getCategories());
  };

  const handleDeleteCategoryPrompt = (cat: FinanceCategory) => {
    setDeleteTarget({ type: 'category', category: cat });
  };

  // Confirm Delete Action
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'item' && deleteTarget.item) {
      storageService.deleteItem(deleteTarget.item.id);
      setItems(storageService.getItems());
      showToast('Lançamento excluído.');
    } else if (deleteTarget.type === 'category' && deleteTarget.category) {
      const res = storageService.deleteCategory(deleteTarget.category.id);
      setCategories(storageService.getCategories());
      setItems(storageService.getItems());
      showToast(
        res.countReassigned > 0
          ? `Categoria excluída. ${res.countReassigned} item(ns) foram reclassificados.`
          : 'Categoria excluída com sucesso.'
      );
    }
    setDeleteTarget(null);
  };

  // Backup & Reset Handlers
  const handleExportBackup = () => {
    const jsonStr = storageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familia_financas_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar os exemplos e categorias originais da família?')) {
      storageService.resetToDefaults();
      setCategories(storageService.getCategories());
      setItems(storageService.getItems());
      setUser(storageService.getUserProfile());
      showToast('Dados de exemplo da família restaurados!');
    }
  };

  // Filtered Items for Tables
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // View specific filter
      if (activeView === 'ganhos' && item.tipo !== 'ganho') return false;
      if (activeView === 'gastos' && item.tipo !== 'gasto') return false;
      if (activeView === 'objetivos' && item.tipo !== 'objetivo') return false;

      // Category filter
      if (selectedCategory !== 'todas' && item.categoriaId !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.titulo.toLowerCase().includes(q);
        const matchDesc = item.descricao?.toLowerCase().includes(q) ?? false;
        const matchResp = item.responsavel?.toLowerCase().includes(q) ?? false;
        if (!matchTitle && !matchDesc && !matchResp) return false;
      }

      return true;
    });
  }, [items, activeView, selectedCategory, searchQuery]);

  // If Not Logged In, Render Google & Email Authentication Screen (Screen 2 & 7)
  if (!isLoggedIn) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex text-stone-800 antialiased font-sans">
      
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} className="hidden" />

      {/* Persistent Sidebar on Desktop & Drawer on Mobile */}
      <Sidebar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          setSelectedCategory('todas');
        }}
        onLogout={handleLogout}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        
        {/* Top Header with User Google Badge (Screen 1, 3, 5) */}
        <TopHeader
          user={user}
          activeView={activeView}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateToAccount={() => setActiveView('conta')}
          onOpenNewItem={() => handleOpenNewItem('gasto')}
        />

        {/* Dynamic Viewport Container */}
        <main className="p-4 sm:p-7 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastMessage}</span>
              </div>
            </div>
          )}

          {/* VIEW: INÍCIO (Desktop Dashboard matching Screen 1) */}
          {activeView === 'inicio' && (
            <>
              {/* Top 4 KPI Cards (Ganhos, Gastos, Saldo, Progresso) */}
              <DashboardStats
                items={items}
                onFilterByType={(type) => {
                  if (type === 'ganho') setActiveView('ganhos');
                  else if (type === 'gasto') setActiveView('gastos');
                  else if (type === 'objetivo') setActiveView('objetivos');
                }}
              />

              {/* Budget alerts */}
              <AlertBanner
                items={items}
                onAddObjective={() => handleOpenNewItem('objetivo')}
              />

              {/* Últimas Movimentações Table matching Screen 1 */}
              <MovementsTable
                title="Últimas Movimentações"
                items={filteredItems}
                categories={categories}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onOpenNewItem={() => handleOpenNewItem('gasto')}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItemPrompt}
              />
            </>
          )}

          {/* VIEW: GANHOS */}
          {activeView === 'ganhos' && (
            <>
              <DashboardStats items={items} />
              <MovementsTable
                title="Lista de Ganhos e Receitas"
                items={filteredItems}
                categories={categories}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onOpenNewItem={() => handleOpenNewItem('ganho')}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItemPrompt}
              />
            </>
          )}

          {/* VIEW: GASTOS */}
          {activeView === 'gastos' && (
            <>
              <DashboardStats items={items} />
              <MovementsTable
                title="Lista de Gastos e Despesas"
                items={filteredItems}
                categories={categories}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onOpenNewItem={() => handleOpenNewItem('gasto')}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItemPrompt}
              />
            </>
          )}

          {/* VIEW: OBJETIVOS */}
          {activeView === 'objetivos' && (
            <>
              <DashboardStats items={items} />
              <MovementsTable
                title="Lista de Metas e Objetivos"
                items={filteredItems}
                categories={categories}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onOpenNewItem={() => handleOpenNewItem('objetivo')}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItemPrompt}
              />
            </>
          )}

          {/* VIEW: CATEGORIAS (Category Management Grid matching Screen 3) */}
          {activeView === 'categorias' && (
            <CategoryGridView
              categories={categories}
              items={items}
              onOpenNewCategory={handleOpenNewCategory}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategoryPrompt}
              onSelectCategoryFilter={(catId) => {
                setSelectedCategory(catId);
                setActiveView('inicio');
              }}
            />
          )}

          {/* VIEW: RELATÓRIOS */}
          {activeView === 'relatorios' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  Relatório Financeiro da Família
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Demonstrativo consolidado dos ganhos, gastos e metas do lar
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Total de Receitas</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-700">
                    {formatCurrency(
                      items.filter((i) => i.tipo === 'ganho').reduce((acc, c) => acc + c.valor, 0)
                    )}
                  </div>
                </div>

                <div className="p-4.5 bg-rose-50/70 border border-rose-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span>Total de Despesas</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-rose-700">
                    {formatCurrency(
                      items.filter((i) => i.tipo === 'gasto').reduce((acc, c) => acc + c.valor, 0)
                    )}
                  </div>
                </div>

                <div className="p-4.5 bg-sky-50/70 border border-sky-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-800 mb-1">
                    <Wallet className="w-4 h-4" />
                    <span>Saldo Disponível</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-sky-700">
                    {formatCurrency(
                      items.filter((i) => i.tipo === 'ganho').reduce((acc, c) => acc + c.valor, 0) -
                        items.filter((i) => i.tipo === 'gasto').reduce((acc, c) => acc + c.valor, 0)
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-800 mb-3">
                  Distribuição de Gastos por Categoria
                </h3>
                <div className="space-y-2.5">
                  {categories.map((cat) => {
                    const catTotal = items
                      .filter((i) => i.categoriaId === cat.id && i.tipo === 'gasto')
                      .reduce((acc, c) => acc + c.valor, 0);
                    const totalGastos = items
                      .filter((i) => i.tipo === 'gasto')
                      .reduce((acc, c) => acc + c.valor, 0) || 1;
                    const pct = Math.round((catTotal / totalGastos) * 100);

                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                          <span className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: cat.cor }}
                            />
                            <span>{cat.nome}</span>
                          </span>
                          <span className="font-mono text-stone-900">
                            {formatCurrency(catTotal)} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: cat.cor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CONTA DO USUÁRIO (Requested User Account Screen) */}
          {activeView === 'conta' && (
            <UserAccountScreen
              user={user}
              items={items}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              onExportBackup={handleExportBackup}
              onResetDefaults={handleResetDefaults}
            />
          )}

        </main>
      </div>

      {/* Mobile Sticky Navigation with Floating Action Button (Screen 6, 8, 9) */}
      <MobileNav
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenNewItem={() => handleOpenNewItem('gasto')}
        onOpenNewCategory={handleOpenNewCategory}
      />

      {/* MODAL 1: New / Edit Item Modal (Screen 4 & 10) */}
      <NewItemModal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        onSave={handleSaveItem}
        categories={categories}
        itemToEdit={itemToEdit}
        initialType={initialItemType}
        moradores={user.moradores}
      />

      {/* MODAL 2: New / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
      />

      {/* MODAL 3: Delete Confirmation Modal (Screen 9 & 11) */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title={
          deleteTarget?.type === 'category'
            ? 'Delete Category?'
            : 'Delete Confirmation'
        }
        message={
          deleteTarget?.type === 'category'
            ? `Are you sure you want to delete category "${deleteTarget.category?.nome}"? Associated items will be safely preserved.`
            : `Are you sure you want to delete "${deleteTarget?.item?.titulo}"?`
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}
