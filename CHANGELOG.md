# Registro de Alterações (Changelog) 📜
Todas as alterações notáveis no projeto **FinanceControl / Família Finanças** estão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [2.3.0] - 2026-11-04
### ☁️ Gravação e Leitura Direta de Arquivos CSV no Google Drive do Usuário

#### Adicionado
- **Integração Oficial com Google Drive API v3**:
  - Configuração do fluxo de autenticação OAuth 2.0 com escopo `https://www.googleapis.com/auth/drive.file` e credenciais autenticadas do Google (`src/services/googleDriveAuth.ts`).
  - Cache estritamente em memória do token de acesso OAuth, sem persistência no `localStorage`, garantindo conformidade rigorosa com os requisitos de segurança.
- **Serviço de Sincronização com Google Drive (`src/services/googleDriveService.ts`)**:
  - Criação e busca automática da pasta dedicada `FinanceControl - Família Finanças` na raiz do Google Drive do usuário.
  - Leitura direta dos arquivos `items.csv` e `categories.csv` armazenados no Drive (`GET /drive/v3/files/{id}?alt=media`) e conversão para o estado da aplicação.
  - Gravação e atualização no Google Drive via upload multipart e patch de stream de dados.
- **Modal de Confirmação Explícita (`src/components/DriveSyncConfirmModal.tsx`)**:
  - Diálogo de segurança obrigatório antes de qualquer operação destrutiva ou de sobrescrita de arquivos no Drive do usuário, com detalhamento das tabelas e quantidade de registros afetados.
- **Painel de Controle do Google Drive na Tela de Conta (`src/components/UserAccountScreen.tsx`)**:
  - Exibição de status de conexão, botões de leitura e gravação no Drive, links diretos para a pasta e arquivos no Google Drive e carimbo de data/hora da última sincronização.
- **Indicador de Conexão no Cabeçalho Superior (`src/components/TopHeader.tsx`)**:
  - Botão e selo de status que permite conectar ou sincronizar com o Google Drive em um clique.

---

## [2.2.0] - 2026-11-04
### 💾 Banco de Dados em Arquivos CSV (Persistência em Disco e API Full-Stack)

#### Adicionado
- **Arquitetura de Banco de Dados CSV em Disco**:
  - Implementação das tabelas físicas `data/items.csv` e `data/categories.csv` persistidas diretamente no sistema de arquivos.
  - Parser e serializador bidirecional com conformidade RFC 4180 (`src/utils/csvParser.ts`), tratando aspas duplas, vírgulas, quebras de linha e caracteres especiais.
- **Servidor Express Full-Stack (`server.ts`)**:
  - Rotas CRUD completas para manipulação direta dos arquivos CSV (`/api/items`, `/api/categories`).
  - Endpoints dedicados para download dos arquivos brutos (`/api/csv/download/:type`), leitura/gravação direta de texto (`/api/csv/raw/:type`) e restauração (`/api/reset`).
- **Modal de Inspeção e Edição de CSV (`src/components/CsvViewerModal.tsx`)**:
  - Editor com visualização em tema escuro estilo terminal, contador de linhas gravadas, botão de copiar conteúdo, download e gravação direta no banco CSV.
- **Painel de Gestão do Banco CSV na Tela de Conta (`src/components/UserAccountScreen.tsx`)**:
  - Cards detalhados de cada tabela (`items.csv` e `categories.csv`) com contagem de linhas em tempo real.
  - Botões para inspeção/edição rápida, download de backup CSV e upload direto de novos arquivos `.csv`.
- **Sincronização Híbrida (`src/services/storageService.ts`)**:
  - Estratégia resiliente de leitura e gravação em CSV com sincronização entre backend e armazenamento local do navegador.

---

## [2.1.0] - 2026-11-04
### 📈 Gráfico de Linha Interativo de Evolução do Saldo Mensal (Recharts)

#### Adicionado
- **Integração com a Biblioteca Recharts**:
  - Instalação e configuração do pacote `recharts` para renderização vetorial e responsiva de gráficos no React.
- **Componente de Relatórios Interativo (`src/components/FinancialReports.tsx`)**:
  - Gráfico de linha interativo (`ComposedChart`, `Line`, `Area`, `XAxis`, `YAxis`, `Tooltip`, `Legend`, `ReferenceLine`) para acompanhamento da evolução do saldo mensal do lar.
  - Três modos de visualização selecionáveis em tempo real:
    - *Saldo Mensal*: Área preenchida com gradiente e linha azul destacando o saldo líquido mês a mês + linha pontilhada de saldo acumulado.
    - *Ganhos vs Gastos*: Linha verde (receitas) vs linha vermelha (despesas) com linha de saldo líquido para comparação direta da saúde financeira.
    - *Saldo Acumulado*: Trajetória patrimonial progressiva da família ao longo do histórico.
  - Tooltip customizado flutuante com valores formatados em moeda brasileira (`R$`) e destaques coloridos para valores positivos e negativos.
  - Cards de destaque com o melhor mês registrado da família e média mensal de saldo líquido.
  - Indicadores de total de receitas, total de despesas e distribuição percentual por categoria.

---

## [2.0.0] - 2026-11-04
### 🎨 Reformulação de Layout, Autenticação Google e Gestão Familiar

Esta versão implementou uma reestruturação profunda da interface e da experiência do usuário, alinhando a aplicação às telas de referência do design (Desktop e Mobile).

#### Adicionado
- **Autenticação com Google e E-mail (`src/components/AuthScreen.tsx`)**:
  - Tela de login e cadastro completa (Desktop e Mobile) com a marca **FAMÍLIA FINANÇAS**.
  - Botão oficial com logotipo vetorial do Google ("Continue with Google") para autenticação imediata e integração do perfil do usuário.
  - Formulário com campos de nome, e-mail e senha, permitindo alternar entre login e cadastro.
  - Suporte à persistência do estado de autenticação no navegador e função de logout ("Sair").
- **Identidade e Logotipo Oficial (`src/components/BrandLogo.tsx`)**:
  - Logotipo vetorial representando uma casa verde com gráfico de colunas ascendentes (verde, azul e vermelho) e seta de tendência.
- **Menu Lateral no Desktop (`src/components/Sidebar.tsx`)**:
  - Navegação persistente com 7 opções:
    - *Início*: Visão geral com cartões de KPI e tabela de últimas movimentações.
    - *Ganhos*: Filtro direto de receitas e rendimentos.
    - *Gastos*: Filtro direto de despesas do lar.
    - *Objetivos*: Acompanhamento de metas financeiras familiares.
    - *Categorias*: Gerenciamento em grade visual com cartões coloridos.
    - *Relatórios*: Balanço consolidado e distribuição de despesas por categoria.
    - *Configurações / Conta*: Acesso à tela de conta do usuário.
    - *Sair*: Desconexão de conta com retorno à tela de login.
- **Barra Superior com Perfil do Google (`src/components/TopHeader.tsx`)**:
  - Exibição contextual do título da página ativa e nome da família.
  - Pílula de perfil com avatar do usuário, nome abreviado ("Lucas S.") e selo oficial do Google.
  - Botão de atalho rápido para "+ Novo Item".
- **Cartões de Indicadores do Dashboard (`src/components/DashboardStats.tsx`)**:
  - 4 cartões com design e métricas correspondentes ao mockup:
    - *Ganhos*: Valor destacado em verde com botão indicador `+` (`R$ 12.500,00`).
    - *Gastos*: Valor destacado em vermelho com indicador `↓` (`R$ 8.950,00`).
    - *Saldo*: Valor em azul com cálculo em tempo real (`R$ 3.550,00`).
    - *Progresso Objetivos*: Barra de progresso lilás (`60%`) com indicação da meta familiar (`R$ 10.000,00`).
- **Tabela de Movimentações Recentes (`src/components/MovementsTable.tsx`)**:
  - Seção "Últimas Movimentações" com barra de busca por texto, filtro de categorias e botão "+ Adicionar Novo Item".
  - Tabela com colunas: Data, Descrição (com identificação do morador responsável), Categoria (com marcador de cor), Valor e botões de ação rápida (editar e excluir).
- **Gerenciador de Categorias em Grade (`src/components/CategoryGridView.tsx`)**:
  - Visualização em grade com cartões em tons pastéis e ícones em círculos brancos para cada centro de custo (Food, Housing, Travel, Leisure, Education, Health, Relax, Others).
  - Exibição da quantidade de itens vinculados e botões de edição e exclusão por cartão.
- **Tela de Conta do Usuário (`src/components/UserAccountScreen.tsx`)**:
  - Perfil completo conectado via Google: foto, nome completo, e-mail e status de verificação.
  - Gestão dos dados da família ("Família Silva") e papel no lar ("Administrador do Lar").
  - Gerenciador de moradores da residência para associação dos gastos a cada membro da família.
  - Ações para exportação de backup JSON, restauração e desconexão de conta.
- **Modal de Lançamento Fiel ao Design (`src/components/NewItemModal.tsx`)**:
  - Seleção do tipo via botões de rádio (`Income`, `Expense`, `Goal`).
  - Campos de Descrição, Valor em Reais (`R$`), Categoria, Data e seleção do morador responsável.
  - Botões de Cancelar e Salvar (verde escuro `#1b5e3a`).
- **Modal de Confirmação de Exclusão (`src/components/DeleteConfirmationModal.tsx`)**:
  - Diálogo de segurança centralizado com ícone de alerta e opções "Cancel" e "Delete" em vermelho.
- **Navegação Móvel com Botão Flutuante (`src/components/MobileNav.tsx`)**:
  - Barra de navegação inferior responsiva.
  - Botão flutuante central `+` que abre menu em folha inferior (*bottom sheet*) com opções rápidas de adicionar item ou categoria.

#### Modificado
- `src/types/finance.ts`: Adição das interfaces `UserProfile`, `ActiveView` e extensão da interface `FinanceCategory` com suporte a `corFundo` (tons pastéis) e identificadores de ícones.
- `src/services/storageService.ts`: Atualização das categorias e itens padrão para refletir os valores do mockup e inclusão do perfil do usuário e métodos de autenticação (`isLoggedIn`, `setLoggedIn`, `getUserProfile`, `saveUserProfile`).
- `src/App.tsx`: Reestruturação completa para orquestrar o fluxo de autenticação, menu lateral, visualizações dinâmicas e novos modais.
- `README.md` e `read.me`: Atualização da documentação para cobrir todas as novas funcionalidades e telas.

---

## [1.1.0] - 2026-11-04
### 📚 Documentação Técnica e Funcional

#### Adicionado
- Criação dos arquivos `README.md` e `read.me` em português do Brasil, contendo:
  - Visão geral, público-alvo e benefícios da aplicação.
  - Especificação detalhada de cada funcionalidade.
  - Tabela comparativa de tecnologias e bibliotecas.
  - Árvore de arquitetura e divisão de pastas do projeto.
  - Diagrama do fluxo de processamento de informações no ciclo de vida do React.
  - Contratos e modelagem das estruturas TypeScript (`FinanceItem` e `FinanceCategory`).
  - Passo a passo para execução local e comandos de compilação.
  - Boas práticas de acessibilidade e roteiro de melhorias futuras.

---

## [1.0.0] - 2026-11-04
### 🚀 Lançamento Inicial do FinanceControl

Implementação da base completa da aplicação para gestão financeira compartilhada no lar.

#### Adicionado
- **Persistência Local no Navegador (`src/services/storageService.ts`)**:
  - Persistência automática em `localStorage` para categorias e itens.
  - Inicialização com categorias residenciais padrão (Moradia, Alimentação, Transporte, Saúde, Lazer, Educação, Salário, Reserva).
  - Funções de exportação e importação de backups em formato JSON.
  - Função de restauração de dados de demonstração.
- **Tipagem Estática em TypeScript (`src/types/finance.ts`)**:
  - Definição estrita dos tipos `ItemType` (`ganho`, `gasto`, `objetivo`) e `ItemStatus` (`pendente`, `pago`, `recebido`, `em_andamento`, `atingido`).
  - Interfaces `FinanceItem`, `FinanceCategory`, `ItemFilter` e `FinanceSummary`.
- **Formatação Regional (`src/utils/formatters.ts`)**:
  - Formatação monetária em Real brasileiro (`R$`) com suporte a casas decimais e separadores de milhar (`Intl.NumberFormat`).
  - Formatação de datas no padrão brasileiro (`DD/MM/AAAA`).
  - Mapeamento semântico de rótulos e classes de cores para tipos e status.
- **Componentes Visuais da Versão Inicial**:
  - `Header.tsx`: Barra de navegação com identificação do app e atalhos rápidos de categoria, novo item e backup.
  - `FinancialSummary.tsx`: Cartões de resumo com Ganhos, Gastos, Saldo Líquido e Metas.
  - `AlertBanner.tsx`: Notificações visuais quando os gastos superam as receitas e aviso incentivando o cadastro de objetivos quando a lista estiver vazia.
  - `ItemCounters.tsx`: Painel de contagem interativo com filtros em um clique por Tipo, Status e Categoria.
  - `ItemFilters.tsx`: Barra de pesquisa textual, seletores de filtros combinados e alternador de visualização (Grade vs Tabela).
  - `ItemList.tsx` e `ItemCard.tsx`: Listagem dos itens com alternância rápida de status em 1 clique.
  - `ItemFormModal.tsx`: Modal para cadastro e edição de movimentações.
  - `CategoryManagerModal.tsx`: Modal completo para criação, listagem, edição e exclusão de categorias com paleta de cores.
  - `ConfirmDeleteModal.tsx`: Diálogo acessível de confirmação de exclusão para evitar perdas acidentais.
- **Configuração do Ambiente e Estilo**:
  - Configuração do Tailwind CSS v4 com a fonte Google `Plus Jakarta Sans`.
  - Configuração de metadados em `metadata.json` e `index.html`.
