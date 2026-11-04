import { ItemStatus, ItemType } from '../types/finance';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};

export const getTypeLabel = (tipo: ItemType): string => {
  switch (tipo) {
    case 'ganho':
      return 'Ganho';
    case 'gasto':
      return 'Gasto';
    case 'objetivo':
      return 'Objetivo';
    default:
      return tipo;
  }
};

export const getStatusLabel = (status: ItemStatus, tipo?: ItemType): string => {
  switch (status) {
    case 'pendente':
      if (tipo === 'ganho') return 'A receber';
      if (tipo === 'gasto') return 'A pagar';
      if (tipo === 'objetivo') return 'Não iniciado';
      return 'Pendente';
    case 'pago':
      return 'Pago';
    case 'recebido':
      return 'Recebido';
    case 'em_andamento':
      return 'Em andamento';
    case 'atingido':
      return 'Atingido';
    default:
      return status;
  }
};

export const getStatusColorClasses = (status: ItemStatus): { text: string; bg: string; border: string } => {
  switch (status) {
    case 'pago':
    case 'recebido':
    case 'atingido':
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
      };
    case 'em_andamento':
      return {
        text: 'text-sky-700',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
      };
    case 'pendente':
    default:
      return {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
  }
};

export const getTypeColorClasses = (tipo: ItemType): { text: string; bg: string; border: string } => {
  switch (tipo) {
    case 'ganho':
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50/70',
        border: 'border-emerald-200',
      };
    case 'gasto':
      return {
        text: 'text-rose-700',
        bg: 'bg-rose-50/70',
        border: 'border-rose-200',
      };
    case 'objetivo':
      return {
        text: 'text-indigo-700',
        bg: 'bg-indigo-50/70',
        border: 'border-indigo-200',
      };
  }
};
