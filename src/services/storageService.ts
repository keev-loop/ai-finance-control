import { FinanceCategory, FinanceItem, UserProfile } from '../types/finance';

const STORAGE_KEYS = {
  CATEGORIES: 'financecontrol_categories_v2',
  ITEMS: 'financecontrol_items_v2',
  INITIALIZED: 'financecontrol_initialized_v2',
  USER_PROFILE: 'financecontrol_user_profile_v2',
  AUTH_LOGGED_IN: 'financecontrol_auth_logged_in_v2',
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
    corFundo: '#ffe4e6', // pastel pink
    icone: 'utensils',
    descricao: 'Compras de supermercado, feira, refeições e padaria',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-housing',
    nome: 'Housing / Moradia',
    cor: '#ea580c',
    corFundo: '#ffedd5', // pastel peach
    icone: 'home',
    descricao: 'Aluguel, condomínio, luz, água, gás e internet',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-travel',
    nome: 'Travel / Viagens',
    cor: '#0284c7',
    corFundo: '#e0f2fe', // pastel sky blue
    icone: 'plane',
    descricao: 'Passagens, hospedagem e passeios de férias da família',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-leisure',
    nome: 'Leisure / Lazer',
    cor: '#16a34a',
    corFundo: '#dcfce7', // pastel mint green
    icone: 'gamepad-2',
    descricao: 'Cinemas, jogos, streaming e diversão familiar',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-education',
    nome: 'Education / Educação',
    cor: '#7c3aed',
    corFundo: '#f3e8ff', // pastel lavender
    icone: 'graduation-cap',
    descricao: 'Mensalidades escolares, cursos, faculdade e livros',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-health',
    nome: 'Health / Saúde',
    cor: '#dc2626',
    corFundo: '#fee2e2', // pastel soft red
    icone: 'heart-pulse',
    descricao: 'Farmácia, consultas médicas e plano de saúde',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-relax',
    nome: 'Relax / Bem-Estar',
    cor: '#9333ea',
    corFundo: '#fae8ff', // pastel lilac
    icone: 'sparkles',
    descricao: 'Autocuidado, academia e descanso',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-others',
    nome: 'Others / Outros',
    cor: '#be123c',
    corFundo: '#ffe4e6', // pastel salmon
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

  public initialize(): void {
    if (!this.isBrowser()) return;

    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      this.saveCategories(DEFAULT_CATEGORIES);
      this.saveItems(DEFAULT_ITEMS);
      this.saveUserProfile(DEFAULT_USER);
      this.setLoggedIn(true);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // --- AUTH & USER PROFILE ---
  public isLoggedIn(): boolean {
    if (!this.isBrowser()) return true;
    const val = localStorage.getItem(STORAGE_KEYS.AUTH_LOGGED_IN);
    return val !== null ? val === 'true' : true; // Default logged in for smooth immediate preview
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

  // --- CATEGORIES ---
  public getCategories(): FinanceCategory[] {
    if (!this.isBrowser()) return DEFAULT_CATEGORIES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        this.saveCategories(DEFAULT_CATEGORIES);
        return DEFAULT_CATEGORIES;
      }
      return JSON.parse(data) as FinanceCategory[];
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  public saveCategories(categories: FinanceCategory[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Erro ao salvar categorias no localStorage:', e);
    }
  }

  public addCategory(cat: Omit<FinanceCategory, 'id' | 'criadaEm'>): FinanceCategory {
    const categories = this.getCategories();
    const newCategory: FinanceCategory = {
      ...cat,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
    const fallbackCategory = filtered[0]?.id || 'cat-food';
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

  // --- ITEMS ---
  public getItems(): FinanceItem[] {
    if (!this.isBrowser()) return DEFAULT_ITEMS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (!data) {
        this.saveItems(DEFAULT_ITEMS);
        return DEFAULT_ITEMS;
      }
      return JSON.parse(data) as FinanceItem[];
    } catch {
      return DEFAULT_ITEMS;
    }
  }

  public saveItems(items: FinanceItem[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Erro ao salvar itens no localStorage:', e);
    }
  }

  public addItem(item: Omit<FinanceItem, 'id' | 'criadoEm' | 'atualizadoEm'>): FinanceItem {
    const items = this.getItems();
    const newItem: FinanceItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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

  public resetToDefaults(): void {
    if (!this.isBrowser()) return;
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveItems(DEFAULT_ITEMS);
    this.saveUserProfile(DEFAULT_USER);
    this.setLoggedIn(true);
  }

  public exportData(): string {
    const payload = {
      version: 2,
      appName: 'Família Finanças (FinanceControl)',
      exportedAt: new Date().toISOString(),
      user: this.getUserProfile(),
      categories: this.getCategories(),
      items: this.getItems(),
    };
    return JSON.stringify(payload, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.categories) && Array.isArray(parsed.items)) {
        this.saveCategories(parsed.categories);
        this.saveItems(parsed.items);
        if (parsed.user) {
          this.saveUserProfile(parsed.user);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
