import { FinanceCategory, FinanceItem, ItemStatus, ItemType } from '../types/finance';

/**
 * Escapes a cell value for standard RFC 4180 CSV format
 */
export const escapeCSVCell = (val: unknown): string => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  // If string contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Parses a single CSV line into an array of string tokens, respecting quotes
 */
export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

/**
 * Splits raw CSV text into logical rows, handling newlines inside quotes
 */
export const splitCSVRows = (csvText: string): string[] => {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentLine += '""';
        i++;
      } else {
        inQuotes = !inQuotes;
        currentLine += char;
      }
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in CRLF
      }
      if (currentLine.trim().length > 0) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim().length > 0) {
    lines.push(currentLine);
  }

  return lines;
};

// ==========================================
// ITEMS CSV CONVERSION
// ==========================================

export const ITEMS_CSV_HEADER = [
  'id',
  'titulo',
  'descricao',
  'categoriaId',
  'valor',
  'data',
  'tipo',
  'status',
  'responsavel',
  'criadoEm',
  'atualizadoEm',
];

export const itemsToCSV = (items: FinanceItem[]): string => {
  const headerLine = ITEMS_CSV_HEADER.join(',');
  const rowLines = items.map((item) => {
    return [
      escapeCSVCell(item.id),
      escapeCSVCell(item.titulo),
      escapeCSVCell(item.descricao || ''),
      escapeCSVCell(item.categoriaId),
      escapeCSVCell(item.valor || 0),
      escapeCSVCell(item.data || ''),
      escapeCSVCell(item.tipo || 'gasto'),
      escapeCSVCell(item.status || 'pago'),
      escapeCSVCell(item.responsavel || ''),
      escapeCSVCell(item.criadoEm || new Date().toISOString()),
      escapeCSVCell(item.atualizadoEm || new Date().toISOString()),
    ].join(',');
  });

  return [headerLine, ...rowLines].join('\n');
};

export const csvToItems = (csvText: string): FinanceItem[] => {
  const rows = splitCSVRows(csvText);
  if (rows.length < 2) return [];

  // Parse header
  const header = parseCSVLine(rows[0]).map((h) => h.trim());
  const idIdx = header.indexOf('id');
  const titIdx = header.indexOf('titulo');
  const descIdx = header.indexOf('descricao');
  const catIdx = header.indexOf('categoriaId');
  const valIdx = header.indexOf('valor');
  const datIdx = header.indexOf('data');
  const tipIdx = header.indexOf('tipo');
  const statIdx = header.indexOf('status');
  const respIdx = header.indexOf('responsavel');
  const criIdx = header.indexOf('criadoEm');
  const atuIdx = header.indexOf('atualizadoEm');

  const items: FinanceItem[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = parseCSVLine(rows[i]);
    if (cols.length === 0 || !cols[titIdx]?.trim()) continue;

    const valNum = parseFloat(cols[valIdx]?.replace(',', '.') || '0');

    items.push({
      id: cols[idIdx] || `item-${Date.now()}-${i}`,
      titulo: cols[titIdx] || 'Sem título',
      descricao: cols[descIdx] || '',
      categoriaId: cols[catIdx] || 'cat-others',
      valor: isNaN(valNum) ? 0 : valNum,
      data: cols[datIdx] || new Date().toISOString().split('T')[0],
      tipo: (cols[tipIdx] as ItemType) || 'gasto',
      status: (cols[statIdx] as ItemStatus) || 'pago',
      responsavel: cols[respIdx] || undefined,
      criadoEm: cols[criIdx] || new Date().toISOString(),
      atualizadoEm: cols[atuIdx] || new Date().toISOString(),
    });
  }

  return items;
};

// ==========================================
// CATEGORIES CSV CONVERSION
// ==========================================

export const CATEGORIES_CSV_HEADER = [
  'id',
  'nome',
  'cor',
  'corFundo',
  'icone',
  'descricao',
  'criadaEm',
];

export const categoriesToCSV = (categories: FinanceCategory[]): string => {
  const headerLine = CATEGORIES_CSV_HEADER.join(',');
  const rowLines = categories.map((cat) => {
    return [
      escapeCSVCell(cat.id),
      escapeCSVCell(cat.nome),
      escapeCSVCell(cat.cor),
      escapeCSVCell(cat.corFundo || ''),
      escapeCSVCell(cat.icone || 'tag'),
      escapeCSVCell(cat.descricao || ''),
      escapeCSVCell(cat.criadaEm || new Date().toISOString()),
    ].join(',');
  });

  return [headerLine, ...rowLines].join('\n');
};

export const csvToCategories = (csvText: string): FinanceCategory[] => {
  const rows = splitCSVRows(csvText);
  if (rows.length < 2) return [];

  const header = parseCSVLine(rows[0]).map((h) => h.trim());
  const idIdx = header.indexOf('id');
  const nomIdx = header.indexOf('nome');
  const corIdx = header.indexOf('cor');
  const bgIdx = header.indexOf('corFundo');
  const icoIdx = header.indexOf('icone');
  const descIdx = header.indexOf('descricao');
  const criIdx = header.indexOf('criadaEm');

  const categories: FinanceCategory[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = parseCSVLine(rows[i]);
    if (cols.length === 0 || !cols[nomIdx]?.trim()) continue;

    categories.push({
      id: cols[idIdx] || `cat-${Date.now()}-${i}`,
      nome: cols[nomIdx] || 'Geral',
      cor: cols[corIdx] || '#64748b',
      corFundo: cols[bgIdx] || '#f5f5f4',
      icone: cols[icoIdx] || 'tag',
      descricao: cols[descIdx] || '',
      criadaEm: cols[criIdx] || new Date().toISOString(),
    });
  }

  return categories;
};
