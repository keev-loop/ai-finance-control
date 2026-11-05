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
import { FinancialReports } from './components/FinancialReports';
import { CsvViewerModal } from './components/CsvViewerModal';
import { DriveSyncConfirmModal } from './components/DriveSyncConfirmModal';
import { AlertBanner } from './components/AlertBanner';
import { MobileNav } from './components/MobileNav';
import { storageService } from './services/storageService';
import {
  initDriveAuth,
  googleSignInWithDrive,
  getDriveAccessToken,
  isDriveAuthenticated,
  driveSignOut,
} from './services/googleDriveAuth';
import {
  loadDatabaseFromDrive,
  saveDatabaseToDrive,
} from './services/googleDriveService';
import {
  ActiveView,
  FinanceCategory,
  FinanceItem,
  ItemType,
  UserProfile,
} from './types/finance';
import { CheckCircle2 } from 'lucide-react';
import { itemsToCSV, categoriesToCSV } from './utils/csvParser';

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

  // CSV Database Viewer Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvModalType, setCsvModalType] = useState<'items' | 'categories'>('items');
  const [rawCsvText, setRawCsvText] = useState('');

  // Google Drive State
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(false);
  const [isDriveSyncing, setIsDriveSyncing] = useState<boolean>(false);
  const [isDriveSaving, setIsDriveSaving] = useState<boolean>(false);
  const [isDriveConfirmModalOpen, setIsDriveConfirmModalOpen] = useState<boolean>(false);
  const [driveFolderUrl, setDriveFolderUrl] = useState<string | undefined>();
  const [driveItemsFileId, setDriveItemsFileId] = useState<string | undefined>();
  const [driveCategoriesFileId, setDriveCategoriesFileId] = useState<string | undefined>();
  const [lastDriveSync, setLastDriveSync] = useState<string | undefined>();

  // Hidden File input for backup
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialization
  useEffect(() => {
    storageService.initialize();
    setCategories(storageService.getCategories());
    setItems(storageService.getItems());
    setUser(storageService.getUserProfile());
    setIsLoggedIn(storageService.isLoggedIn());

    // Initialize Firebase Drive Auth state listener
    const unsubscribe = initDriveAuth(
      (driveUser, token) => {
        setIsDriveConnected(true);
        if (driveUser.email && !user.email) {
          const updated: UserProfile = {
            ...user,
            email: driveUser.email,
            nome: driveUser.displayName || user.nome,
            avatarUrl: driveUser.photoURL || user.avatarUrl,
            provider: 'google',
          };
          setUser(updated);
          storageService.saveUserProfile(updated);
        }
        // Auto-sync from drive on start if token is ready
        autoSyncFromDrive(token);
      },
      () => {
        setIsDriveConnected(isDriveAuthenticated());
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Auth Handlers
  const handleLoginSuccess = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    storageService.saveUserProfile(loggedInUser);
    storageService.setLoggedIn(true);

    const token = getDriveAccessToken();
    if (token) {
      setIsDriveConnected(true);
      await autoSyncFromDrive(token);
    }
    showToast(`Bem-vindo, ${loggedInUser.nome}!`);
  };

  const handleLogout = async () => {
    await driveSignOut();
    setIsDriveConnected(false);
    setIsLoggedIn(false);
    storageService.setLoggedIn(false);
    showToast('Você saiu da sua conta.');
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    storageService.saveUserProfile(updated);
    showToast('Perfil do usuário atualizado com sucesso.');
  };

  // ==========================================
  // GOOGLE DRIVE SYNC WORKFLOW
  // ==========================================

  const autoSyncFromDrive = async (token: string) => {
    try {
      setIsDriveSyncing(true);
      const driveData = await loadDatabaseFromDrive(token);
      if (driveData && (driveData.items.length > 0 || driveData.categories.length > 0)) {
        if (driveData.items.length > 0) {
          storageService.saveItemsCSV(driveData.itemsCSV);
          setItems(driveData.items);
        }
        if (driveData.categories.length > 0) {
          storageService.saveCategoriesCSV(driveData.categoriesCSV);
          setCategories(driveData.categories);
        }
        setDriveFolderUrl(driveData.folderWebViewLink);
        setDriveItemsFileId(driveData.itemsFileId);
        setDriveCategoriesFileId(driveData.categoriesFileId);
        setLastDriveSync(driveData.syncTimestamp);
      }
    } catch (e) {
      console.warn('Sincronização inicial do Google Drive em segundo plano:', e);
    } finally {
      setIsDriveSyncing(false);
    }
  };

  const handleConnectDrive = async () => {
    try {
      setIsDriveSyncing(true);
      const result = await googleSignInWithDrive();
      if (result) {
        setIsDriveConnected(true);
        const updatedUser: UserProfile = {
          ...user,
          email: result.user.email || user.email,
          nome: result.user.displayName || user.nome,
          avatarUrl: result.user.photoURL || user.avatarUrl,
          provider: 'google',
        };
        setUser(updatedUser);
        storageService.saveUserProfile(updatedUser);

        showToast('Google Drive conectado! Carregando arquivos CSV...');
        await handleLoadFromDrive();
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast('Não foi possível conectar ao Google Drive.');
      }
    } finally {
      setIsDriveSyncing(false);
    }
  };

  const handleLoadFromDrive = async () => {
    const token = getDriveAccessToken();
    if (!token) {
      await handleConnectDrive();
      return;
    }

    try {
      setIsDriveSyncing(true);
      const driveData = await loadDatabaseFromDrive(token);

      if (!driveData || (!driveData.itemsCSV && !driveData.categoriesCSV)) {
        showToast('Pasta do FinanceControl criada no seu Drive! Nenhum dado anterior encontrado.');
        setIsDriveConfirmModalOpen(true); // Prompt to save current data to drive
        return;
      }

      if (driveData.items.length > 0) {
        storageService.saveItemsCSV(driveData.itemsCSV);
        setItems(driveData.items);
      }

      if (driveData.categories.length > 0) {
        storageService.saveCategoriesCSV(driveData.categoriesCSV);
        setCategories(driveData.categories);
      }

      setDriveFolderUrl(driveData.folderWebViewLink);
      setDriveItemsFileId(driveData.itemsFileId);
      setDriveCategoriesFileId(driveData.categoriesFileId);
      setLastDriveSync(driveData.syncTimestamp);

      showToast('Dados lidos com sucesso do seu Google Drive!');
    } catch (err: any) {
      console.error('Erro ao ler do Google Drive:', err);
      showToast('Erro ao ler arquivos do Google Drive.');
    } finally {
      setIsDriveSyncing(false);
    }
  };

  const handleTriggerDriveSave = () => {
    const token = getDriveAccessToken();
    if (!token) {
      handleConnectDrive();
      return;
    }
    // Open mandatory user confirmation modal before overwriting/updating Drive files
    setIsDriveConfirmModalOpen(true);
  };

  const handleConfirmDriveSave = async () => {
    const token = getDriveAccessToken();
    if (!token) {
      setIsDriveConfirmModalOpen(false);
      await handleConnectDrive();
      return;
    }

    try {
      setIsDriveSaving(true);
      const itemsCSV = itemsToCSV(items);
      const categoriesCSV = categoriesToCSV(categories);

      const result = await saveDatabaseToDrive(
        itemsCSV,
        categoriesCSV,
        token,
        driveItemsFileId,
        driveCategoriesFileId
      );

      setDriveFolderUrl(result.folderWebViewLink);
      setDriveItemsFileId(result.itemsFileId);
      setDriveCategoriesFileId(result.categoriesFileId);
      setLastDriveSync(new Date().toISOString());

      setIsDriveConfirmModalOpen(false);
      showToast('Arquivos items.csv e categories.csv gravados com sucesso no seu Google Drive!');
    } catch (err: any) {
      console.error('Erro ao gravar no Google Drive:', err);
      showToast('Erro ao gravar arquivos no Google Drive.');
    } finally {
      setIsDriveSaving(false);
    }
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

  // CSV Database Handlers
  const handleViewCSV = (type: 'items' | 'categories') => {
    setCsvModalType(type);
    const text =
      type === 'items'
        ? storageService.getRawItemsCSV()
        : storageService.getRawCategoriesCSV();
    setRawCsvText(text);
    setIsCsvModalOpen(true);
  };

  const handleSaveCSV = (type: 'items' | 'categories', content: string) => {
    if (type === 'items') {
      storageService.saveItemsCSV(content);
      setItems(storageService.getItems());
    } else {
      storageService.saveCategoriesCSV(content);
      setCategories(storageService.getCategories());
    }
    setRawCsvText(content);
    showToast(`Banco de dados ${type}.csv atualizado!`);
  };

  const handleDownloadCSV = (type: 'items' | 'categories') => {
    storageService.downloadCSVFile(type);
    showToast(`Download de ${type}.csv iniciado!`);
  };

  const handleImportCSVFile = (type: 'items' | 'categories', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        handleSaveCSV(type, text);
      }
    };
    reader.readAsText(file);
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
        
        {/* Top Header with User Google Badge & Google Drive Status */}
        <TopHeader
          user={user}
          activeView={activeView}
          isDriveConnected={isDriveConnected}
          isDriveSyncing={isDriveSyncing}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateToAccount={() => setActiveView('conta')}
          onOpenNewItem={() => handleOpenNewItem('gasto')}
          onSyncDrive={isDriveConnected ? handleLoadFromDrive : handleConnectDrive}
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

          {/* VIEW: RELATÓRIOS (Interactive Recharts Reports) */}
          {activeView === 'relatorios' && (
            <FinancialReports items={items} categories={categories} />
          )}

          {/* VIEW: CONTA DO USUÁRIO (Requested User Account Screen & Drive Cloud DB) */}
          {activeView === 'conta' && (
            <UserAccountScreen
              user={user}
              items={items}
              categoriesCount={categories.length}
              isDriveConnected={isDriveConnected}
              isDriveSyncing={isDriveSyncing}
              driveFolderUrl={driveFolderUrl}
              driveItemsFileId={driveItemsFileId}
              driveCategoriesFileId={driveCategoriesFileId}
              lastDriveSync={lastDriveSync}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              onExportBackup={handleExportBackup}
              onViewCSV={handleViewCSV}
              onDownloadCSV={handleDownloadCSV}
              onImportCSVFile={handleImportCSVFile}
              onConnectDrive={handleConnectDrive}
              onLoadFromDrive={handleLoadFromDrive}
              onTriggerDriveSave={handleTriggerDriveSave}
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

      {/* MODAL 4: CSV Database Inspector and Editor */}
      <CsvViewerModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        type={csvModalType}
        rawCSV={rawCsvText}
        onSaveCSV={handleSaveCSV}
        onDownloadCSV={handleDownloadCSV}
      />

      {/* MODAL 5: Google Drive Overwrite / Sync Confirmation Dialog (Mandatory) */}
      <DriveSyncConfirmModal
        isOpen={isDriveConfirmModalOpen}
        onClose={() => setIsDriveConfirmModalOpen(false)}
        onConfirm={handleConfirmDriveSave}
        itemsCount={items.length}
        categoriesCount={categories.length}
        isSaving={isDriveSaving}
      />

    </div>
  );
}
