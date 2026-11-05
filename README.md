# FinanceControl 🏡💰
> Controle financeiro pessoal e familiar simples, acolhedor e organizado para o lar.

---

## 📌 1. Visão Geral da Aplicação

O **FinanceControl** é uma aplicação web desenvolvida para ajudar famílias e pessoas que dividem a mesma moradia a organizarem suas finanças de forma colaborativa, clara e sem atritos.

Muitas ferramentas financeiras tradicionais são excessivamente complexas ou focadas apenas em orçamentos individuais corporativos. O FinanceControl foi projetado com um visual acolhedor, linguagem em português do Brasil e foco na rotina da casa: divisão de contas, controle de ganhos, despesas mensais e metas para o futuro da família (reserva de emergência, reformas, férias e educação).

### Principais Benefícios:
- **Autenticação com Google & Email:** Tela de login elegante com botão oficial "Continue with Google" e fallback por email/senha.
- **Identidade e Perfil Conectado:** Identificação visual do usuário no topo (Avatar, Nome "Lucas S." e selo oficial do Google).
- **Tela de Conta do Usuário:** Gestão completa do perfil, moradia ("Família Silva"), membros cadastrados, papel no lar e backups.
- **Menu Lateral e Navegação Responsiva:** Sidebar completa no desktop (Início, Ganhos, Gastos, Objetivos, Categorias, Relatórios, Conta, Sair) e navegação mobile com botão flutuante "+".
- **Visual Fiel ao Design (Família Finanças):** Grade de categorias com cartões em tons pastéis e ícones temáticos (Food, Housing, Travel, Leisure, Education, etc.).
- **100% Client-Side:** Persistência no `localStorage` do navegador com privacidade total e sem necessidade de backend inicial.

---

## 🚀 2. Funcionalidades Principais

### 🔹 Gestão de Registros Financeiros (Itens)
- **Tipos Suportados:**
  - **Ganho:** Salários, trabalhos extras, benefícios, pensões ou rendimentos.
  - **Gasto:** Contas de consumo, compras de mercado, combustível, farmácia, etc.
  - **Objetivo:** Metas da casa, como reserva financeira, viagem de férias ou reforma.
- **Atributos de Cada Item:**
  - Título do registro (obrigatório)
  - Descrição detalhada / anotações (opcional)
  - Categoria vinculada com código de cor
  - Valor em Reais (`R$`) com suporte a casas decimais
  - Data do evento ou vencimento
  - Status inteligente (`pendente`, `pago`, `recebido`, `em_andamento`, `atingido`)
  - Responsável / Membro da família associado (opcional)
- **Ações:**
  - Cadastro com validação de campos obrigatórios
  - Edição completa com pré-carregamento dos valores existentes
  - Exclusão protegida por modal de confirmação com resumo do item
  - Alternância rápida de status em 1 clique (ex: de *Pendente* para *Pago* ou *Recebido*)

### 🔹 Painel de Resumo & Balanço Financeiro (Cartões)
- **Cartão de Ganhos:** Exibe a soma total de receitas, quanto já foi recebido e quanto ainda está pendente de recebimento, com contador de itens.
- **Cartão de Gastos:** Exibe o total de despesas, quanto já foi pago e quanto vence em breve, com contador de itens.
- **Cartão de Saldo Líquido:** Diferença matemática imediata (`Ganhos - Gastos`) com indicação visual de saúde financeira (positivo ou deficitário).
- **Cartão de Objetivos:** Valor total planejado para metas da casa, quantidade de metas concluídas/atingidas e metas em andamento.

### 🔹 Alertas e Mensagens de Apoio
- **Alerta de Déficit:** Quando os gastos superam os ganhos, surge um banner claro informando a diferença exata e sugerindo rever despesas não essenciais.
- **Aviso de Falta de Objetivos:** Se a família ainda não tiver cadastrado nenhuma meta, o sistema apresenta um lembrete motivador com botão direto para cadastrar o primeiro objetivo.

### 🔹 Contadores e Filtros Dinâmicos
- **Contagem por Tipo:** Total de ganhos, gastos e objetivos com botão interativo para filtrar.
- **Contagem por Status:** Total de pendentes, pagos, recebidos, em andamento e atingidos.
- **Contagem por Categoria:** Itens associados a cada categoria existente.
- **Filtros Combinados:** Busca textual por termo (título, descrição ou responsável), filtro por tipo, categoria e status, e múltiplos modos de ordenação (por data, por valor ou alfabética).
- **Modos de Exibição:** Alternância entre visualização em **Grade de Cartões** ou **Tabela Detalhada**.

### 🔹 Gestão de Categorias Personalizadas
- Cadastro de novas categorias com nome, descrição e paleta de cores para rápida identificação visual.
- Edição do nome, cor e descrição de categorias existentes.
- Exclusão segura: ao excluir uma categoria, os itens vinculados são automaticamente realocados para uma categoria segura, evitando perda de integridade.
- Categorias residenciais já pré-configuradas no primeiro acesso:
  - *Moradia & Contas* (Água, luz, aluguel, condomínio, internet)
  - *Alimentação & Supermercado* (Compras do mês, feira, padaria)
  - *Transporte & Veículo* (Combustível, manutenção, passagens)
  - *Saúde & Farmácia* (Medicamentos, consultas, convênios)
  - *Lazer & Família* (Passeios, restaurantes, streaming)
  - *Educação & Cursos* (Escola, livros, materiais)
  - *Salário & Rendas* (Rendimentos da casa)
  - *Reserva & Investimentos* (Poupança e emergências)

### 🔹 Backup, Restauração e Demonstração
- **Exportar Backup:** Gera um arquivo JSON contendo todas as categorias e itens cadastrados.
- **Importar Backup:** Lê um arquivo JSON e restaura com validação de formato.
- **Restaurar Exemplos:** Recarrega os registros de demonstração da casa para testes.

---

## 💻 3. Tecnologias e Bibliotecas Utilizadas

| Tecnologia / Biblioteca | Versão | Finalidade no Projeto |
| :--- | :--- | :--- |
| **React** | `^19.0.1` | Biblioteca base para construção da interface declarativa em componentes. |
| **TypeScript** | `^7.0.2` | Tipagem estática rigorosa para garantir segurança nos dados, contratos e prevenção de bugs. |
| **Vite** | `^8.3.0` | Ferramenta de build e servidor de desenvolvimento ultrarrápido com hot reload otimizado. |
| **Tailwind CSS** | `^4.3.3` | Framework CSS utilitário para design acolhedor, responsivo e sem excesso de código customizado. |
| **Lucide React** | `^0.546.0` | Conjunto consistente e moderno de ícones de interface semânticos e leves. |
| **Web Storage API (localStorage)** | Nativo | Persistência local no cliente, garantindo privacidade e disponibilidade offline. |
| **Intl API (pt-BR)** | Nativo | Formatação nativa de moeda brasileira (`R$`) e datas sem dependências externas pesadas. |

---

## 🏗️ 4. Estrutura do Projeto

O código-fonte segue uma arquitetura modular baseada em separação clara de responsabilidades:

```text
/
├── index.html                   # Ponto de entrada HTML com fontes Google e metadados pt-BR
├── metadata.json                # Identificação e capacidades da aplicação
├── package.json                 # Dependências e scripts do ecossistema Node/Vite
├── tsconfig.json                # Configurações do compilador TypeScript
├── vite.config.ts               # Configuração do Vite e plugins do React e Tailwind
├── README.md                    # Documentação técnica e funcional (este arquivo)
├── read.me                      # Espelho da documentação conforme solicitado
└── src/
    ├── main.tsx                 # Inicialização do React DOM e injeção do App
    ├── App.tsx                  # Componente raiz, orquestração de estados, filtros e modais
    ├── index.css                # Estilos globais e importação do Tailwind CSS v4
    │
    ├── types/                   # Contratos de tipos TypeScript
    │   └── finance.ts           # Interfaces de Item, Categoria, Filtros e Resumos
    │
    ├── services/                # Camada de lógica e persistência
    │   └── storageService.ts    # Serviço de manipulação do localStorage e dados iniciais
    │
    ├── utils/                   # Funções utilitárias puras
    │   └── formatters.ts        # Formatador de moeda BRL, datas pt-BR e classes de cores
    │
    └── components/              # Componentes de interface desacoplados
        ├── Header.tsx           # Barra de navegação, ações rápidas e backup
        ├── FinancialSummary.tsx # Cartões com totais de Ganhos, Gastos, Saldo e Metas
        ├── AlertBanner.tsx      # Avisos de orçamento deficitário ou falta de metas
        ├── ItemCounters.tsx     # Contadores interativos por tipo, status e categoria
        ├── ItemFilters.tsx      # Barra de pesquisa, seletores de filtro e modo de visão
        ├── ItemList.tsx         # Renderizador dos itens (modos Grade e Tabela)
        ├── ItemCard.tsx         # Cartão individual com metadados e ações
        ├── ItemFormModal.tsx    # Formulário modal para criação e edição de registros
        ├── CategoryManagerModal.tsx # Gerenciador de categorias (CRUD completo)
        └── ConfirmDeleteModal.tsx   # Diálogo acessível de confirmação de exclusão
```

---

## 🔄 5. Fluxo de Processamento das Informações

O ciclo de dados da aplicação funciona de forma reativa e puramente client-side:

```text
       ┌─────────────────────────────────────────────────────────┐
       │             1. Inicialização do Navegador               │
       │     (Verifica chaves no localStorage via storageService)│
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │   Existem dados gravados?                               │
       │   - SIM: Carrega categorias e itens do usuário.         │
       │   - NÃO: Popula com dados iniciais de demonstração.     │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             2. Estado do React (App.tsx)                │
       │   - items: FinanceItem[]                                │
       │   - categories: FinanceCategory[]                       │
       │   - filter: ItemFilter                                  │
       └────────────────────────────┬────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │  useMemo(filteredItems)│      │ Totais e Balanço       │
       │  Aplica filtros de     │      │ Calcula:               │
       │  categoria, tipo,      │      │ - Total de Ganhos      │
       │  status, busca textual │      │ - Total de Gastos      │
       │  e ordenação.          │      │ - Saldo Líquido        │
       └────────────┬───────────┘      │ - Total de Objetivos   │
                    │                  └────────────┬───────────┘
                    └───────────────┬───────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             3. Renderização da Interface                │
       │  - FinancialSummary: cartões com números tabulares      │
       │  - AlertBanner: se Gastos > Ganhos ou sem metas         │
       │  - ItemCounters: contagens clicáveis em tempo real      │
       │  - ItemList: cards ou tabela com dados sincronizados    │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             4. Interação do Usuário                     │
       │  - Adicionar / Editar / Excluir Item                    │
       │  - Alternar Status (Pendente <-> Concluído)             │
       │  - Adicionar / Editar / Excluir Categoria               │
       │  - Exportar ou Importar Backup JSON                     │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             5. Persistência Imediata                    │
       │  - Operação executada no storageService                 │
       │  - Atualização do localStorage                          │
       │  - Atualização do estado React com re-renderização suave│
       │  - Notificação flutuante de sucesso (Toast)             │
       └─────────────────────────────────────────────────────────┘
```

---

## 📋 6. Modelagem dos Dados (TypeScript)

As principais estruturas que garantem a integridade dos dados no sistema são:

### `FinanceItem`
```typescript
export type ItemType = 'ganho' | 'gasto' | 'objetivo';

export type ItemStatus = 
  | 'pendente'
  | 'pago'
  | 'recebido'
  | 'em_andamento'
  | 'atingido';

export interface FinanceItem {
  id: string;              // Identificador único (item-timestamp-random)
  titulo: string;          // Nome ou descrição curta do item
  descricao: string;       // Detalhes complementares
  categoriaId: string;     // ID da categoria relacionada
  valor: number;           // Valor monetário positivo
  data: string;            // Data formato ISO 'YYYY-MM-DD'
  tipo: ItemType;          // 'ganho' | 'gasto' | 'objetivo'
  status: ItemStatus;      // Estado de conclusão do registro
  responsavel?: string;    // Morador ou responsável familiar
  criadoEm: string;        // Timestamp ISO
  atualizadoEm: string;    // Timestamp ISO
}
```

### `FinanceCategory`
```typescript
export interface FinanceCategory {
  id: string;              // Identificador único (cat-timestamp-random)
  nome: string;            // Nome exibido na interface
  cor: string;             // Código hexadecimal para cor de destaque
  descricao?: string;      // Descrição do tipo de gasto da categoria
  criadaEm: string;        // Timestamp ISO
}
```

---

## 🛠️ 7. Como Executar o Projeto Localmente

### Pré-requisitos:
- **Node.js** versão 18 ou superior instalada.
- Gerenciador de pacotes `npm` ou `bun`.

### Passos:
1. Clone ou baixe o repositório no seu computador:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd financecontrol
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no seu navegador através do endereço:
   ```text
   http://localhost:3000
   ```

5. Para gerar o pacote de produção otimizado:
   ```bash
   npm run build
   ```

---

## 🛡️ 8. Boas Práticas e Critérios de Acessibilidade Adotados

- **Semântica HTML e Cores Inclusivas:** Estados de status não dependem apenas da cor; utilizam textos explicativos explícitos e ícones correspondentes.
- **Tipografia e Números Tabulares:** Uso de `font-mono tabular-nums` para exibição de valores em reais, garantindo alinhamento vertical perfeito de centavos e números.
- **Design Não Intrusivo:** Modais com foco intuitivo, botão de fechamento acessível e tecla `Escape`/fundo clicável para descarte.
- **Proteção Contra Erros Humanos:** Mensagens de confirmação antes de excluir qualquer registro ou restaurar exemplos, impedindo perdas acidentais por membros da família.

---

## 🔮 9. Possíveis Evoluções Futuras

Para versões posteriores, a arquitetura modular já está preparada para receber:
1. **Sincronização em Nuvem / Multi-usuário:** Integração com Firebase Firestore ou Supabase para compartilhamento simultâneo entre dispositivos de diferentes moradores.
2. **Gráficos Comparativos Mensais:** Gráficos de barras e rosca para visualizar a evolução dos gastos por categoria mês a mês.
3. **Anexos de Comprovantes:** Armazenamento de fotos de notas fiscais ou boletos pagos.
4. **Exportação em Planilha:** Geração de relatórios em formato CSV e Excel (`.xlsx`).

---

*FinanceControl — Cuidando das finanças da sua casa com simplicidade, carinho e organização.*
