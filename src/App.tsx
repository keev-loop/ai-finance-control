import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { FinancialSummary } from './components/FinancialSummary';
import { AlertBanner } from './components/AlertBanner';
import { ItemCounters } from './components/ItemCounters';
import { ItemFilters } from './components/ItemFilters';
import { ItemList } from './components/ItemList';
import { ItemFormModal } from './components/ItemFormModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { storageService } from './services/storageService';
import { FinanceCategory, FinanceItem, ItemFilter, ItemType } from './types/finance';
import { Heart, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  // State
  const [items, setItems] = useState<FinanceItem[]>([]);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<FinanceItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FinanceItem | null>(null);
  const [initialFormType, setInitialFormType] = useState<ItemType>('gasto');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden file input ref for backup JSON import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter state
  const [filter, setFilter] = useState<ItemFilter>({
    tipo: 'todos',
    categoriaId: 'todas',
    status: 'todos',
    busca: '',
    ordenacao: 'data_desc',
  });

  // Load data from localStorage on mount
  useEffect(() => {
    storageService.initialize();
    setCategories(storageService.getCategories());
    setItems(storageService.getItems());
  }, []);

  // Toast auto-dismiss helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Tipo
        if (filter.tipo !== 'todos' && item.tipo !== filter.tipo) {
          return false;
        }
        // Categoria
        if (filter.categoriaId !== 'todas' && item.categoriaId !== filter.categoriaId) {
          return false;
        }
        // Status
        if (filter.status !== 'todos' && item.status !== filter.status) {
          return false;
        }
        // Busca
        if (filter.busca.trim()) {
          const query = filter.busca.toLowerCase();
          const matchTitle = item.titulo.toLowerCase().includes(query);
          const matchDesc = item.descricao?.toLowerCase().includes(query) ?? false;
          const matchResp = item.responsavel?.toLowerCase().includes(query) ?? false;
          if (!matchTitle && !matchDesc && !matchResp) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        switch (filter.ordenacao) {
          case 'data_desc':
            return new Date(b.data).getTime() - new Date(a.data).getTime();
          case 'data_asc':
            return new Date(a.data).getTime() - new Date(b.data).getTime();
          case 'valor_desc':
            return b.valor - a.valor;
          case 'valor_asc':
            return a.valor - b.valor;
          case 'titulo_asc':
            return a.titulo.localeCompare(b.titulo);
          default:
            return 0;
        }
      });
  }, [items, filter]);

  // Handlers for Items
  const handleOpenNewItem = (type: ItemType = 'gasto') => {
    setItemToEdit(null);
    setInitialFormType(type);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: FinanceItem) => {
    setItemToEdit(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (
    itemData: Omit<FinanceItem, 'id' | 'criadoEm' | 'atualizadoEm'>,
    idToEdit?: string
  ) => {
    if (idToEdit) {
      storageService.updateItem(idToEdit, itemData);
      showToast('Registro financeiro atualizado com sucesso!');
    } else {
      storageService.addItem(itemData);
      showToast('Novo registro cadastrado com sucesso!');
    }
    setItems(storageService.getItems());
  };

  const handleDeleteItem = (item: FinanceItem) => {
    setItemToDelete(item);
  };

  const handleConfirmDeleteItem = (item: FinanceItem) => {
    storageService.deleteItem(item.id);
    setItems(storageService.getItems());
    showToast('Registro excluído com sucesso.');
  };

  const handleToggleStatus = (item: FinanceItem) => {
    let nextStatus = item.status;
    if (item.tipo === 'gasto') {
      nextStatus = item.status === 'pago' ? 'pendente' : 'pago';
    } else if (item.tipo === 'ganho') {
      nextStatus = item.status === 'recebido' ? 'pendente' : 'recebido';
    } else if (item.tipo === 'objetivo') {
      if (item.status === 'atingido') nextStatus = 'em_andamento';
      else if (item.status === 'em_andamento') nextStatus = 'atingido';
      else nextStatus = 'em_andamento';
    }

    storageService.updateItem(item.id, { status: nextStatus });
    setItems(storageService.getItems());
    showToast(`Status atualizado para "${nextStatus}".`);
  };

  // Handlers for Categories
  const handleAddCategory = (categoryData: Omit<FinanceCategory, 'id' | 'criadaEm'>) => {
    storageService.addCategory(categoryData);
    setCategories(storageService.getCategories());
    showToast('Nova categoria cadastrada com sucesso!');
  };

  const handleUpdateCategory = (id: string, updates: Partial<FinanceCategory>) => {
    storageService.updateCategory(id, updates);
    setCategories(storageService.getCategories());
    showToast('Categoria atualizada com sucesso!');
  };

  const handleDeleteCategory = (id: string) => {
    const result = storageService.deleteCategory(id);
    if (result.success) {
      setCategories(storageService.getCategories());
      setItems(storageService.getItems());
      showToast(
        result.countReassigned > 0
          ? `Categoria excluída. ${result.countReassigned} item(ns) foram reclassificados.`
          : 'Categoria excluída com sucesso.'
      );
    }
  };

  // Reset to initial family defaults
  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Deseja restaurar os exemplos iniciais da casa? Seus registros atuais serão substituídos pelo modelo de exemplo.'
      )
    ) {
      storageService.resetToDefaults();
      setCategories(storageService.getCategories());
      setItems(storageService.getItems());
      setFilter({
        tipo: 'todos',
        categoriaId: 'todas',
        status: 'todos',
        busca: '',
        ordenacao: 'data_desc',
      });
      showToast('Dados de exemplo restaurados com sucesso!');
    }
  };

  // Export JSON backup
  const handleExport = () => {
    const jsonStr = storageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financecontrol_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado com sucesso em arquivo JSON!');
  };

  // Import JSON backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importData(content);
      if (success) {
        setCategories(storageService.getCategories());
        setItems(storageService.getItems());
        showToast('Backup importado com sucesso!');
      } else {
        alert('Formato de arquivo inválido. Certifique-se de usar um arquivo JSON exportado pelo FinanceControl.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-800">
      
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* Global Header */}
      <Header
        onOpenNewItem={() => handleOpenNewItem('gasto')}
        onOpenCategories={() => setIsCategoryModalOpen(true)}
        onResetDefaults={handleResetDefaults}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current?.click()}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Toast feedback pill */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Financial Summary Cards (Ganhos, Gastos, Saldo, Objetivos) */}
        <FinancialSummary
          items={items}
          onSelectTypeFilter={(tipo) => setFilter((prev) => ({ ...prev, tipo }))}
          activeTypeFilter={filter.tipo}
        />

        {/* Alert Banners (Gastos maiores que ganhos ou Falta de objetivos) */}
        <AlertBanner
          items={items}
          onAddObjective={() => handleOpenNewItem('objetivo')}
        />

        {/* Item Counters and Distribution (exibir a quantidade de itens, filtrar por categoria, tipo, status) */}
        <ItemCounters
          allItems={items}
          filteredItems={filteredItems}
          categories={categories}
          filter={filter}
          onFilterChange={(updates) => setFilter((prev) => ({ ...prev, ...updates }))}
        />

        {/* Filter Toolbar (Search, Dropdown filters, Sorting, View mode) */}
        <ItemFilters
          categories={categories}
          filter={filter}
          onFilterChange={(updates) => setFilter((prev) => ({ ...prev, ...updates }))}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Item List / Cards */}
        <ItemList
          items={filteredItems}
          categories={categories}
          viewMode={viewMode}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onToggleStatus={handleToggleStatus}
          onAddNew={() => handleOpenNewItem('gasto')}
        />

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">FinanceControl</span>
            <span>·</span>
            <span>Organização financeira acolhedora para famílias e moradores</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dados salvos localmente no seu navegador</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span>Feito com</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>para o lar</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        categories={categories}
        itemToEdit={itemToEdit}
        initialType={initialFormType}
        onOpenCategories={() => setIsCategoryModalOpen(true)}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        items={items}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(itemToDelete)}
        item={itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDeleteItem}
      />

    </div>
  );
}
