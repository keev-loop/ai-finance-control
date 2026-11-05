import { FinanceCategory, FinanceItem, UserProfile } from '../types/finance';
import {
  csvToCategories,
  csvToItems,
  categoriesToCSV,
  itemsToCSV,
} from '../utils/csvParser';

const STORAGE_KEYS = {
  CATEGORIES_CSV: 'financecontrol_categories_csv_v3',
  ITEMS_CSV: 'financecontrol_items_csv_v3',
  INITIALIZED: 'financecontrol_csv_initialized_v3',
  USER_PROFILE: 'financecontrol_user_profile_v3',
  AUTH_LOGGED_IN: 'financecontrol_auth_logged_in_v3',
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr-lucas-silva',
  nome: 'Lucas Silva',
  email: 'nkvspl@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  provider: 'google',
  nomeFamilia: 'Família Silva',
  papel: 'Administrador do Lar',
  conectadoDesde: '07/07/2023',
  moradores: ['Lucas Silva', 'Mariana Silva', 'Enzo Silva'],
};

export const DEFAULT_CATEGORIES: FinanceCategory[] = [
  {
    id: 'cat-food',
    nome: 'Food / Alimentação',
    cor: '#e11d48',
    corFundo: '#ffe4e6',
    icone: 'utensils',
    descricao: 'Compras de supermercado, feira, refeições e padaria',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-housing',
    nome: 'Housing / Moradia',
    cor: '#ea580c',
    corFundo: '#ffedd5',
    icone: 'home',
    descricao: 'Aluguel, condomínio, luz, água, gás e internet',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-travel',
    nome: 'Travel / Viagens',
    cor: '#0284c7',
    corFundo: '#e0f2fe',
    icone: 'plane',
    descricao: 'Passagens, hospedagem e passeios de férias da família',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-leisure',
    nome: 'Leisure / Lazer',
    cor: '#16a34a',
    corFundo: '#dcfce7',
    icone: 'gamepad-2',
    descricao: 'Cinemas, jogos, streaming e diversão familiar',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-education',
    nome: 'Education / Educação',
    cor: '#7c3aed',
    corFundo: '#f3e8ff',
    icone: 'graduation-cap',
    descricao: 'Mensalidades escolares, cursos, faculdade e livros',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-health',
    nome: 'Health / Saúde',
    cor: '#dc2626',
    corFundo: '#fee2e2',
    icone: 'heart-pulse',
    descricao: 'Farmácia, consultas médicas e plano de saúde',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-relax',
    nome: 'Relax / Bem-Estar',
    cor: '#9333ea',
    corFundo: '#fae8ff',
    icone: 'sparkles',
    descricao: 'Autocuidado, academia e descanso',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-others',
    nome: 'Others / Outros',
    cor: '#be123c',
    corFundo: '#ffe4e6',
    icone: 'briefcase',
    descricao: 'Despesas diversas e imprevistos cotidianos',
    criadaEm: new Date().toISOString(),
  },
];

export const DEFAULT_ITEMS: FinanceItem[] = [
  {
    id: 'item-1',
    titulo: 'Salário Mensal',
    descricao: 'Recebimento do salário principal da casa',
    categoriaId: 'cat-housing',
    valor: 12500,
    data: '2023-07-07',
    tipo: 'ganho',
    status: 'recebido',
    responsavel: 'Lucas Silva',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-2',
    titulo: 'Mercado do Mês',
    descricao: 'Compras de supermercado e despensa familiar',
    categoriaId: 'cat-food',
    valor: 8950,
    data: '2023-07-07',
    tipo: 'gasto',
    status: 'pago',
    responsavel: 'Família',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-3',
    titulo: 'Depósito p/ Viagem',
    descricao: 'Meta de economia para férias de fim de ano da família',
    categoriaId: 'cat-travel',
    valor: 11500,
    data: '2023-02-17',
    tipo: 'objetivo',
    status: 'em_andamento',
    responsavel: 'Família Silva',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-4',
    titulo: 'Freelance Design',
    descricao: 'Consultoria e projeto extra de design de interfaces',
    categoriaId: 'cat-others',
    valor: 1500,
    data: '2023-07-10',
    tipo: 'ganho',
    status: 'recebido',
    responsavel: 'Lucas Silva',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-5',
    titulo: 'Almoço Sábado',
    descricao: 'Almoço com a família fora de casa',
    categoriaId: 'cat-food',
    valor: 122,
    data: '2023-07-15',
    tipo: 'gasto',
    status: 'pago',
    responsavel: 'Lucas & Mariana',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-6',
    titulo: 'Reserva de Emergência 6 Meses',
    descricao: 'Fundo garantidor familiar aplicado com liquidez diária',
    categoriaId: 'cat-housing',
    valor: 10000,
    data: '2023-12-31',
    tipo: 'objetivo',
    status: 'em_andamento',
    responsavel: 'Todos da casa',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
];

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  // Initialize CSV storage
  public initialize(): void {
    if (!this.isBrowser()) return;

    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      // Save initial CSV strings
      this.saveCategoriesCSV(categoriesToCSV(DEFAULT_CATEGORIES));
      this.saveItemsCSV(itemsToCSV(DEFAULT_ITEMS));
      this.saveUserProfile(DEFAULT_USER);
      this.setLoggedIn(true);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }

    // Try background sync with backend /api/items and /api/categories if available
    this.syncWithBackend();
  }

  // Try to sync with server CSV database
  public async syncWithBackend(): Promise<void> {
    if (!this.isBrowser()) return;
    try {
      const res = await fetch('/api/items');
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items) && items.length > 0) {
          this.saveItemsCSV(itemsToCSV(items));
        }
      }
      const catRes = await fetch('/api/categories');
      if (catRes.ok) {
        const cats = await catRes.json();
        if (Array.isArray(cats) && cats.length > 0) {
          this.saveCategoriesCSV(categoriesToCSV(cats));
        }
      }
    } catch {
      // Offline or client-only mode, uses local CSV storage
    }
  }

  // --- RAW CSV ACCESS ---
  public getRawItemsCSV(): string {
    if (!this.isBrowser()) return itemsToCSV(DEFAULT_ITEMS);
    const data = localStorage.getItem(STORAGE_KEYS.ITEMS_CSV);
    if (!data) {
      const initial = itemsToCSV(DEFAULT_ITEMS);
      this.saveItemsCSV(initial);
      return initial;
    }
    return data;
  }

  public saveItemsCSV(csvText: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ITEMS_CSV, csvText);

    // Sync to backend CSV file if server is running
    fetch('/api/csv/raw/items', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: csvText,
    }).catch(() => {});
  }

  public getRawCategoriesCSV(): string {
    if (!this.isBrowser()) return categoriesToCSV(DEFAULT_CATEGORIES);
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES_CSV);
    if (!data) {
      const initial = categoriesToCSV(DEFAULT_CATEGORIES);
      this.saveCategoriesCSV(initial);
      return initial;
    }
    return data;
  }

  public saveCategoriesCSV(csvText: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES_CSV, csvText);

    // Sync to backend CSV file if server is running
    fetch('/api/csv/raw/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: csvText,
    }).catch(() => {});
  }

  // --- CATEGORIES (Parsed from CSV) ---
  public getCategories(): FinanceCategory[] {
    const csv = this.getRawCategoriesCSV();
    const parsed = csvToCategories(csv);
    return parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  }

  public saveCategories(categories: FinanceCategory[]): void {
    const csv = categoriesToCSV(categories);
    this.saveCategoriesCSV(csv);
  }

  public addCategory(cat: Omit<FinanceCategory, 'id' | 'criadaEm'>): FinanceCategory {
    const categories = this.getCategories();
    const newCategory: FinanceCategory = {
      ...cat,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      criadaEm: new Date().toISOString(),
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<Omit<FinanceCategory, 'id' | 'criadaEm'>>): FinanceCategory | null {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    categories[index] = {
      ...categories[index],
      ...updates,
    };
    this.saveCategories(categories);
    return categories[index];
  }

  public deleteCategory(id: string): { success: boolean; countReassigned: number } {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length) {
      return { success: false, countReassigned: 0 };
    }

    this.saveCategories(filtered);

    const items = this.getItems();
    const fallbackCategory = filtered[0]?.id || 'cat-others';
    let countReassigned = 0;

    const updatedItems = items.map((item) => {
      if (item.categoriaId === id) {
        countReassigned++;
        return { ...item, categoriaId: fallbackCategory };
      }
      return item;
    });

    if (countReassigned > 0) {
      this.saveItems(updatedItems);
    }

    return { success: true, countReassigned };
  }

  // --- ITEMS (Parsed from CSV) ---
  public getItems(): FinanceItem[] {
    const csv = this.getRawItemsCSV();
    const parsed = csvToItems(csv);
    return parsed.length > 0 ? parsed : DEFAULT_ITEMS;
  }

  public saveItems(items: FinanceItem[]): void {
    const csv = itemsToCSV(items);
    this.saveItemsCSV(csv);
  }

  public addItem(item: Omit<FinanceItem, 'id' | 'criadoEm' | 'atualizadoEm'>): FinanceItem {
    const items = this.getItems();
    const newItem: FinanceItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    items.unshift(newItem);
    this.saveItems(items);
    return newItem;
  }

  public updateItem(id: string, updates: Partial<Omit<FinanceItem, 'id' | 'criadoEm'>>): FinanceItem | null {
    const items = this.getItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      atualizadoEm: new Date().toISOString(),
    };
    this.saveItems(items);
    return items[index];
  }

  public deleteItem(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;
    this.saveItems(filtered);
    return true;
  }

  // --- AUTH & USER PROFILE ---
  public isLoggedIn(): boolean {
    if (!this.isBrowser()) return true;
    const val = localStorage.getItem(STORAGE_KEYS.AUTH_LOGGED_IN);
    return val !== null ? val === 'true' : true;
  }

  public setLoggedIn(loggedIn: boolean): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.AUTH_LOGGED_IN, String(loggedIn));
  }

  public getUserProfile(): UserProfile {
    if (!this.isBrowser()) return DEFAULT_USER;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  }

  public saveUserProfile(profile: UserProfile): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Erro ao salvar perfil do usuário:', e);
    }
  }

  // --- CSV DOWNLOAD HELPERS ---
  public downloadCSVFile(type: 'items' | 'categories'): void {
    const csvContent = type === 'items' ? this.getRawItemsCSV() : this.getRawCategoriesCSV();
    const filename = type === 'items' ? 'items.csv' : 'categories.csv';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export complete JSON backup
  public exportData(): string {
    const payload = {
      version: 3,
      storageEngine: 'CSV_DATABASE',
      appName: 'Família Finanças',
      exportedAt: new Date().toISOString(),
      user: this.getUserProfile(),
      categoriesCSV: this.getRawCategoriesCSV(),
      itemsCSV: this.getRawItemsCSV(),
      categories: this.getCategories(),
      items: this.getItems(),
    };
    return JSON.stringify(payload, null, 2);
  }

  // Import complete JSON backup
  public importData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.itemsCSV) {
        this.saveItemsCSV(parsed.itemsCSV);
      } else if (Array.isArray(parsed.items)) {
        this.saveItems(parsed.items);
      }

      if (parsed.categoriesCSV) {
        this.saveCategoriesCSV(parsed.categoriesCSV);
      } else if (Array.isArray(parsed.categories)) {
        this.saveCategories(parsed.categories);
      }

      if (parsed.user) {
        this.saveUserProfile(parsed.user);
      }
      return true;
    } catch {
      return false;
    }
  }

  // Reset to default CSV tables
  public resetToDefaults(): void {
    if (!this.isBrowser()) return;
    this.saveCategoriesCSV(categoriesToCSV(DEFAULT_CATEGORIES));
    this.saveItemsCSV(itemsToCSV(DEFAULT_ITEMS));
    this.saveUserProfile(DEFAULT_USER);
    this.setLoggedIn(true);

    fetch('/api/reset', { method: 'POST' }).catch(() => {});
  }
}

export const storageService = new StorageService();
