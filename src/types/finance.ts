export type ItemType = 'ganho' | 'gasto' | 'objetivo';

export type ItemStatus = 
  | 'pendente'
  | 'pago'
  | 'recebido'
  | 'em_andamento'
  | 'atingido';

export interface FinanceCategory {
  id: string;
  nome: string;
  cor: string;
  descricao?: string;
  criadaEm: string;
}

export interface FinanceItem {
  id: string;
  titulo: string;
  descricao: string;
  categoriaId: string;
  valor: number;
  data: string; // YYYY-MM-DD
  tipo: ItemType;
  status: ItemStatus;
  responsavel?: string; // Membro da família / morador
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemFilter {
  tipo: 'todos' | ItemType;
  categoriaId: string; // 'todas' or category ID
  status: string; // 'todos' or ItemStatus
  busca: string;
  ordenacao: 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc' | 'titulo_asc';
}

export interface FinanceSummary {
  totalGanhos: number;
  totalGastos: number;
  totalObjetivos: number;
  saldo: number;
  ganhosRecebidos: number;
  ganhosPendentes: number;
  gastosPagos: number;
  gastosPendentes: number;
  objetivosAtingidos: number;
  objetivosEmAndamento: number;
  totalItens: number;
  qtdGanhos: number;
  qtdGastos: number;
  qtdObjetivos: number;
}
