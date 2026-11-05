import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  csvToCategories,
  csvToItems,
  categoriesToCSV,
  itemsToCSV,
} from './src/utils/csvParser.ts';
import { FinanceCategory, FinanceItem } from './src/types/finance.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: ['text/csv', 'text/plain'] }));

const DATA_DIR = path.resolve(__dirname, 'data');
const ITEMS_CSV_PATH = path.join(DATA_DIR, 'items.csv');
const CATEGORIES_CSV_PATH = path.join(DATA_DIR, 'categories.csv');

// Default CSV content if files don't exist yet
const INITIAL_CATEGORIES_CSV = `id,nome,cor,corFundo,icone,descricao,criadaEm
cat-food,"Food / Alimentação",#e11d48,#ffe4e6,utensils,"Compras de supermercado, feira, refeições e padaria",2023-07-07T12:00:00.000Z
cat-housing,"Housing / Moradia",#ea580c,#ffedd5,home,"Aluguel, condomínio, luz, água, gás e internet",2023-07-07T12:00:00.000Z
cat-travel,"Travel / Viagens",#0284c7,#e0f2fe,plane,"Passagens, hospedagem e passeios de férias da família",2023-07-07T12:00:00.000Z
cat-leisure,"Leisure / Lazer",#16a34a,#dcfce7,gamepad-2,"Cinemas, jogos, streaming e diversão familiar",2023-07-07T12:00:00.000Z
cat-education,"Education / Educação",#7c3aed,#f3e8ff,graduation-cap,"Mensalidades escolares, cursos, faculdade e livros",2023-07-07T12:00:00.000Z
cat-health,"Health / Saúde",#dc2626,#fee2e2,heart-pulse,"Farmácia, consultas médicas e plano de saúde",2023-07-07T12:00:00.000Z
cat-relax,"Relax / Bem-Estar",#9333ea,#fae8ff,sparkles,"Autocuidado, academia e descanso",2023-07-07T12:00:00.000Z
cat-others,"Others / Outros",#be123c,#ffe4e6,briefcase,"Despesas diversas e imprevistos cotidianos",2023-07-07T12:00:00.000Z`;

const INITIAL_ITEMS_CSV = `id,titulo,descricao,categoriaId,valor,data,tipo,status,responsavel,criadoEm,atualizadoEm
item-1,"Salário Mensal","Recebimento do salário principal da casa",cat-housing,12500,2023-07-07,ganho,recebido,"Lucas Silva",2023-07-07T12:00:00.000Z,2023-07-07T12:00:00.000Z
item-2,"Mercado do Mês","Compras de supermercado e despensa familiar",cat-food,8950,2023-07-07,gasto,pago,"Família",2023-07-07T12:00:00.000Z,2023-07-07T12:00:00.000Z
item-3,"Depósito p/ Viagem","Meta de economia para férias de fim de ano da família",cat-travel,11500,2023-02-17,objetivo,em_andamento,"Família Silva",2023-02-17T12:00:00.000Z,2023-02-17T12:00:00.000Z
item-4,"Freelance Design","Consultoria e projeto extra de design de interfaces",cat-others,1500,2023-07-10,ganho,recebido,"Lucas Silva",2023-07-10T12:00:00.000Z,2023-07-10T12:00:00.000Z
item-5,"Almoço Sábado","Almoço com a família fora de casa",cat-food,122,2023-07-15,gasto,pago,"Lucas & Mariana",2023-07-15T12:00:00.000Z,2023-07-15T12:00:00.000Z
item-6,"Reserva de Emergência 6 Meses","Fundo garantidor familiar aplicado com liquidez diária",cat-housing,10000,2023-12-31,objetivo,em_andamento,"Todos da casa",2023-12-31T12:00:00.000Z,2023-12-31T12:00:00.000Z`;

// Ensure data directory and default CSV files exist
const initCSVDatabase = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CATEGORIES_CSV_PATH)) {
    fs.writeFileSync(CATEGORIES_CSV_PATH, INITIAL_CATEGORIES_CSV, 'utf-8');
  }
  if (!fs.existsSync(ITEMS_CSV_PATH)) {
    fs.writeFileSync(ITEMS_CSV_PATH, INITIAL_ITEMS_CSV, 'utf-8');
  }
};

initCSVDatabase();

// File reading & writing helpers
const readItemsCSV = (): FinanceItem[] => {
  try {
    initCSVDatabase();
    const content = fs.readFileSync(ITEMS_CSV_PATH, 'utf-8');
    return csvToItems(content);
  } catch (err) {
    console.error('Erro ao ler items.csv:', err);
    return [];
  }
};

const writeItemsCSV = (items: FinanceItem[]): void => {
  try {
    initCSVDatabase();
    const csvContent = itemsToCSV(items);
    fs.writeFileSync(ITEMS_CSV_PATH, csvContent, 'utf-8');
  } catch (err) {
    console.error('Erro ao gravar items.csv:', err);
  }
};

const readCategoriesCSV = (): FinanceCategory[] => {
  try {
    initCSVDatabase();
    const content = fs.readFileSync(CATEGORIES_CSV_PATH, 'utf-8');
    return csvToCategories(content);
  } catch (err) {
    console.error('Erro ao ler categories.csv:', err);
    return [];
  }
};

const writeCategoriesCSV = (cats: FinanceCategory[]): void => {
  try {
    initCSVDatabase();
    const csvContent = categoriesToCSV(cats);
    fs.writeFileSync(CATEGORIES_CSV_PATH, csvContent, 'utf-8');
  } catch (err) {
    console.error('Erro ao gravar categories.csv:', err);
  }
};

// ==========================================
// CSV DATABASE API ENDPOINTS
// ==========================================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: 'CSV',
    itemsFile: ITEMS_CSV_PATH,
    categoriesFile: CATEGORIES_CSV_PATH,
  });
});

// Download raw CSV files directly
app.get('/api/csv/download/:type', (req, res) => {
  const { type } = req.params;
  const filePath = type === 'categories' ? CATEGORIES_CSV_PATH : ITEMS_CSV_PATH;
  const filename = type === 'categories' ? 'categories.csv' : 'items.csv';

  if (!fs.existsSync(filePath)) {
    initCSVDatabase();
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.sendFile(filePath);
});

// Get raw CSV text
app.get('/api/csv/raw/:type', (req, res) => {
  const { type } = req.params;
  const filePath = type === 'categories' ? CATEGORIES_CSV_PATH : ITEMS_CSV_PATH;
  try {
    initCSVDatabase();
    const content = fs.readFileSync(filePath, 'utf-8');
    res.type('text/plain').send(content);
  } catch (e) {
    res.status(500).send('Erro ao ler CSV');
  }
});

// Save raw CSV text
app.post('/api/csv/raw/:type', (req, res) => {
  const { type } = req.params;
  const filePath = type === 'categories' ? CATEGORIES_CSV_PATH : ITEMS_CSV_PATH;
  const content = typeof req.body === 'string' ? req.body : req.body.csv;

  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'Conteúdo CSV inválido' });
  }

  try {
    initCSVDatabase();
    fs.writeFileSync(filePath, content, 'utf-8');
    res.json({ success: true, message: `Arquivo ${type}.csv atualizado com sucesso` });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao gravar CSV' });
  }
});

// --- ITEMS CRUD ON CSV ---
app.get('/api/items', (_req, res) => {
  const items = readItemsCSV();
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const items = readItemsCSV();
  const newItem: FinanceItem = {
    ...req.body,
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeItemsCSV(items);
  res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const items = readItemsCSV();
  const idx = items.findIndex((i) => i.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Item não encontrado no banco CSV' });
  }

  items[idx] = {
    ...items[idx],
    ...req.body,
    atualizadoEm: new Date().toISOString(),
  };

  writeItemsCSV(items);
  res.json(items[idx]);
});

app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const items = readItemsCSV();
  const filtered = items.filter((i) => i.id !== id);

  if (filtered.length === items.length) {
    return res.status(404).json({ error: 'Item não encontrado no banco CSV' });
  }

  writeItemsCSV(filtered);
  res.json({ success: true, id });
});

// --- CATEGORIES CRUD ON CSV ---
app.get('/api/categories', (_req, res) => {
  const cats = readCategoriesCSV();
  res.json(cats);
});

app.post('/api/categories', (req, res) => {
  const cats = readCategoriesCSV();
  const newCat: FinanceCategory = {
    ...req.body,
    id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    criadaEm: new Date().toISOString(),
  };
  cats.push(newCat);
  writeCategoriesCSV(cats);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const cats = readCategoriesCSV();
  const idx = cats.findIndex((c) => c.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Categoria não encontrada no banco CSV' });
  }

  cats[idx] = {
    ...cats[idx],
    ...req.body,
  };

  writeCategoriesCSV(cats);
  res.json(cats[idx]);
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const cats = readCategoriesCSV();
  const filteredCats = cats.filter((c) => c.id !== id);

  if (filteredCats.length === cats.length) {
    return res.status(404).json({ error: 'Categoria não encontrada no banco CSV' });
  }

  writeCategoriesCSV(filteredCats);

  // Reclassify items that belonged to this category
  const items = readItemsCSV();
  const fallbackCat = filteredCats[0]?.id || 'cat-others';
  let reassignedCount = 0;

  const updatedItems = items.map((i) => {
    if (i.categoriaId === id) {
      reassignedCount++;
      return { ...i, categoriaId: fallbackCat };
    }
    return i;
  });

  if (reassignedCount > 0) {
    writeItemsCSV(updatedItems);
  }

  res.json({ success: true, countReassigned: reassignedCount });
});

// Reset database to default CSVs
app.post('/api/reset', (_req, res) => {
  fs.writeFileSync(CATEGORIES_CSV_PATH, INITIAL_CATEGORIES_CSV, 'utf-8');
  fs.writeFileSync(ITEMS_CSV_PATH, INITIAL_ITEMS_CSV, 'utf-8');
  res.json({
    success: true,
    message: 'Banco de dados CSV restaurado para os dados originais da família',
  });
});

// ==========================================
// VITE DEV SERVER / STATIC PRODUCTION
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[CSV Database & Server] Servidor executando em http://localhost:${PORT}`);
    console.log(`[CSV Database] Itens: ${ITEMS_CSV_PATH}`);
    console.log(`[CSV Database] Categorias: ${CATEGORIES_CSV_PATH}`);
  });
}

startServer();
