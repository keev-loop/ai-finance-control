import { FinanceCategory, FinanceItem } from '../types/finance';

const STORAGE_KEYS = {
  CATEGORIES: 'financecontrol_categories_v1',
  ITEMS: 'financecontrol_items_v1',
  INITIALIZED: 'financecontrol_initialized_v1',
};

export const DEFAULT_CATEGORIES: FinanceCategory[] = [
  {
    id: 'cat-moradia',
    nome: 'Moradia & Contas',
    cor: '#0ea5e9', // sky
    descricao: 'Aluguel, condomínio, luz, água, internet e gás',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-alimentacao',
    nome: 'Alimentação & Supermercado',
    cor: '#f59e0b', // amber
    descricao: 'Compras de supermercado, feira, padaria e açougue',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-transporte',
    nome: 'Transporte & Veículo',
    cor: '#64748b', // slate
    descricao: 'Combustível, manutenção do carro, transporte público e aplicativos',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-saude',
    nome: 'Saúde & Farmácia',
    cor: '#ef4444', // red
    descricao: 'Consultas médicas, convênio, remédios e exames',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-lazer',
    nome: 'Lazer & Família',
    cor: '#8b5cf6', // violet
    descricao: 'Passeios familiares, cinema, restaurantes e streaming',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-educacao',
    nome: 'Educação & Cursos',
    cor: '#06b6d4', // cyan
    descricao: 'Escola das crianças, livros, faculdade e cursos',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-renda',
    nome: 'Salário & Rendas',
    cor: '#10b981', // emerald
    descricao: 'Salários dos moradores, adiantamentos e rendas extras',
    criadaEm: new Date().toISOString(),
  },
  {
    id: 'cat-reserva',
    nome: 'Reserva & Investimentos',
    cor: '#14b8a6', // teal
    descricao: 'Poupança familiar, reserva de emergência e metas de longo prazo',
    criadaEm: new Date().toISOString(),
  },
];

// Data helper to generate dynamic recent dates
const getRecentDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_ITEMS: FinanceItem[] = [
  {
    id: 'item-1',
    titulo: 'Salário Familiar Mensal',
    descricao: 'Renda principal dos moradores da casa para o mês corrente',
    categoriaId: 'cat-renda',
    valor: 7500,
    data: getRecentDate(-10),
    tipo: 'ganho',
    status: 'recebido',
    responsavel: 'Todos da casa',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-2',
    titulo: 'Trabalho Freelance Extra',
    descricao: 'Projeto de consultoria pontual realizado no fim de semana',
    categoriaId: 'cat-renda',
    valor: 1200,
    data: getRecentDate(-4),
    tipo: 'ganho',
    status: 'recebido',
    responsavel: 'Lucas',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-3',
    titulo: 'Aluguel e Condomínio',
    descricao: 'Pagamento fixo da habitação da família',
    categoriaId: 'cat-moradia',
    valor: 2400,
    data: getRecentDate(-5),
    tipo: 'gasto',
    status: 'pago',
    responsavel: 'Mãe & Pai',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-4',
    titulo: 'Supermercado Mensal da Casa',
    descricao: 'Compra do mês com itens de despensa, limpeza e hortifrúti',
    categoriaId: 'cat-alimentacao',
    valor: 1850,
    data: getRecentDate(-3),
    tipo: 'gasto',
    status: 'pago',
    responsavel: 'Família',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-5',
    titulo: 'Conta de Energia Elétrica e Água',
    descricao: 'Faturas de consumo de luz e saneamento com vencimento próximo',
    categoriaId: 'cat-moradia',
    valor: 430,
    data: getRecentDate(3),
    tipo: 'gasto',
    status: 'pendente',
    responsavel: 'Casa',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-6',
    titulo: 'Combustível do Carro Familiar',
    descricao: 'Abastecimento para ida ao trabalho e rotina da semana',
    categoriaId: 'cat-transporte',
    valor: 320,
    data: getRecentDate(-1),
    tipo: 'gasto',
    status: 'pago',
    responsavel: 'Pai',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-7',
    titulo: 'Reserva de Emergência Familiar',
    descricao: 'Meta de acumular 6 meses de custos fixos essenciais em segurança',
    categoriaId: 'cat-reserva',
    valor: 15000,
    data: getRecentDate(90),
    tipo: 'objetivo',
    status: 'em_andamento',
    responsavel: 'Família Toda',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'item-8',
    titulo: 'Viagem de Férias da Casa',
    descricao: 'Planejamento financeiro para descanso e passeio no final de ano',
    categoriaId: 'cat-lazer',
    valor: 4500,
    data: getRecentDate(180),
    tipo: 'objetivo',
    status: 'em_andamento',
    responsavel: 'Família Toda',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
];

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  // Initialize defaults if first time
  public initialize(): void {
    if (!this.isBrowser()) return;

    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      this.saveCategories(DEFAULT_CATEGORIES);
      this.saveItems(DEFAULT_ITEMS);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
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

    // If there are items with this category, keep them safe by setting to first available or leaving fallback
    const items = this.getItems();
    const fallbackCategory = filtered[0]?.id || 'cat-outros';
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
    items.unshift(newItem); // most recent at front
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

  // Restore initial realistic demo data
  public resetToDefaults(): void {
    if (!this.isBrowser()) return;
    this.saveCategories(DEFAULT_CATEGORIES);
    this.saveItems(DEFAULT_ITEMS);
  }

  // Export JSON backup for household
  public exportData(): string {
    const payload = {
      version: 1,
      appName: 'FinanceControl',
      exportedAt: new Date().toISOString(),
      categories: this.getCategories(),
      items: this.getItems(),
    };
    return JSON.stringify(payload, null, 2);
  }

  // Import JSON backup
  public importData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.categories) && Array.isArray(parsed.items)) {
        this.saveCategories(parsed.categories);
        this.saveItems(parsed.items);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
