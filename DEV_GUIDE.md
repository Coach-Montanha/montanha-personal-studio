# MANUAL TÉCNICO DO DESENVOLVEDOR — MONTANHA PERSONAL STUDIO
> **Classificação:** Documento Interno e Confidencial de Engenharia de Software  
> **Localização:** Raiz do repositório (`/DEV_GUIDE.md`). **NUNCA** mova este arquivo para a pasta `public/` ou `dist/` para evitar exposição pública via HTTP.  
> **Data de Atualização:** 20/10/2026  
> **Versão do Documento:** 2.0.0 (Capacitor Android, IA Prescrição Multi-Engine, Heatmap Muscular, Diagnóstico Financeiro & Busca Universal)

---

## 1. Visão Geral & Escopo do Projeto

### 1.1. O que é o Montanha Personal Studio?
O **Montanha Personal Studio** é a plataforma central de gestão técnica, periodização de treinos com Inteligência Artificial, controle financeiro, inteligência operacional e CRM para estúdios de treinamento personalizado e personal trainers autônomos dentro do **Ecossistema Montanha**.

O sistema opera de forma híbrida:
1. **Web / PWA:** Aplicação com Server-Side Rendering (SSR) via TanStack Start e Nitro, hospedada na infraestrutura serverless da Vercel.
2. **Android Nativo:** Invólucro nativo ultra-leve via Capacitor 8.5.2, encapsulando a aplicação web em WebView de alta performance com suporte completo a safe-areas, notch e alvos de toque coarse-pointer.

### 1.2. Links e Referências de Produção
- **URL Canônica em Produção:** [https://montanha-personal-studio.vercel.app](https://montanha-personal-studio.vercel.app)
- **Repositório GitHub:** `https://github.com/Coach-Montanha/montanha-personal-studio`
- **Time Vercel:** `Ecossistema Montanha` (Plano Hobby)
- **AppId Android:** `com.ecossistemamontanha.personalstudio`
- **Tecnologia Base:** TanStack Start (SSR via Nitro / Vercel Serverless Function) + React 19 + Tailwind CSS v4 + Supabase + Capacitor 8.5.2

### 1.3. Personas & Perfis de Acesso
1. **Administrador / Proprietário do Studio:** Acesso total à gestão financeira (faturamento, DRE, conciliação, despesas segregadas por card: Gerais, Studio e PT), gestão de planos, agenda de aulas e CRM de leads.
2. **Personal Trainer / Colaborador:** Gestão de seus alunos, visualização e prescrição de rotinas (Musculação, Corrida, Funcional, Híbrido, KB Sport), prescrição assistida por IA, mapa térmico muscular interativo, calculadora de anilhas e cronômetro de sessão persistente.
3. **Aluno:** Visualização de treinos por dia interativo, histórico de cargas, check-in em aulas e histórico de pagamentos via Portal do Aluno (`/portal` e `/portal/pt`).
4. **Suporte Técnico / SuperAdmin (Modo Impersonação):** Permite que desenvolvedores ou suporte operem a interface como se fossem um usuário ou tenant específico sem precisar saber a senha dele via flag `edufinance.impersonate`.

---

## 2. Arquitetura do Sistema & Stack Tecnológica

### 2.1. Frontend & SSR (TanStack Start)
- **Framework SSR:** `@tanstack/react-start` (v1.168.26) com roteamento via `@tanstack/react-router` (v1.170.16).
- **Compilador/Bundler:** Vite 8 com `@tailwindcss/vite` (Tailwind CSS v4).
- **Mecanismo SSR / Serverless:** O Nitro gera a saída serverless no padrão Vercel (`.vercel/output/functions/__server.func`).
- **Gerenciamento de Estado Server & Cache:** `@tanstack/react-query` (v5.101.4) com persistência offline através de `@tanstack/query-sync-storage-persister`.
- **Componentes Visuais:** Baseados em Radix UI (`@radix-ui/react-*`), Lucide Icons (`lucide-react`) e `class-variance-authority` (CVA).
- **Exportação & Relatórios:** `jspdf`, `jspdf-autotable`, `xlsx`, `html2canvas`.

### 2.2. Backend & Persistência (Supabase)
- **Client Supabase:** `@supabase/supabase-js` (v2.108.2) localizado em `src/integrations/supabase/client.ts`.
- **Autenticação:** Supabase Auth (JWT com refresh tokens persistidos em cookies/localStorage).
- **Banco de Dados:** PostgreSQL com Row Level Security (RLS) habilitado e isolamento estrito por `tenant_id` ou `user_id`.

### 2.3. Invólucro Nativo Mobile (Capacitor Android)
- **Engine:** `@capacitor/core` e `@capacitor/android` v8.5.2.
- **Estratégia WebView:** Carrega a URL de produção com esquema `https://`.
- **Resiliência Offline:** Fallback estático em `public/index.html` servido na pasta `.output/public`.
- **Pipeline de Ícones:** Script de zero dependências npm (`scripts/sync-android-assets.ps1`) que gera todas as densidades mipmap (`mdpi` a `xxxhdpi`) usando `.NET System.Drawing`.

---

## 3. Ciclo de Vida da Aplicação e Runtime Execution (Passo a Passo)

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Boot do Host (Nitro Serverless na Vercel ou Capacitor Android)      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. SSR: Injeção de Head, Metadados SEO, JSON-LD e ThemeScript          │
│    (src/routes/__root.tsx - previne flash de tema escuro/claro FOUC)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. Viewport Móvel & Insets Safe Area (Notch, Relógio e Botoes de Ação) │
│    (env(safe-area-inset-top), env(safe-area-inset-bottom), touch >=44px│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. Hidratação React 19 + TanStack Router (src/router.tsx)              │
│    Inicialização do QueryClient com SyncStoragePersister offline       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. Inicialização do Supabase Client (src/integrations/supabase/client) │
│    Restauração de JWT do localStorage/cookies & onAuthStateChange      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 6. Guardião de Rotas Autenticadas (src/routes/_authenticated/route.tsx)│
│    Sem sessão? Redireciona para /auth                                  │
│    Com sessão? Carrega tenant_id e verifica modo Impersonação          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 7. Montagem do AppShell / PortalShell e Injeção dos Submódulos         │
│    Dashboard, Personal Trainer, Financeiro, Treinos e Portal do Aluno  │
└────────────────────────────────────────────────────────────────────────┘
```

### Passo 1: Boot do Host
- Na web, a requisição HTTP bate na Vercel Serverless Function gerada pelo Nitro.
- No Android, o Capacitor abre o `MainActivity.java` carregando a WebView em tela cheia com aceleração de hardware e orientação bloqueada em `portrait`.

### Passo 2: Injeção de Head e ThemeScript Anti-FOUC
- Definido em `src/routes/__root.tsx`.
- Antes de qualquer renderização do React, um script inline síncrono lê o `localStorage.getItem("montanha_theme")` e define a classe no `document.documentElement`, eliminando o clarão de tema (*Flash of Unstyled Content*).

### Passo 3: Viewport Móvel & Safe Areas
- O arquivo `src/styles.css` injeta `--sat: env(safe-area-inset-top)` e `--sab: env(safe-area-inset-bottom)`.
- Componentes chave como `AppShell.tsx` e `PortalShell.tsx` usam `pt-safe` e `pb-safe`, impedindo que o notch do celular ou os botões de navegação do sistema sobreponham cabeçalhos ou barras de ação.
- Alvos de toque em telas sensíveis ao toque (`@media (pointer: coarse)`) são expandidos automaticamente para no mínimo 44x44px.

### Passo 4: Hidratação e Cache Offline
- O React 19 é hidratado pelo TanStack Start.
- O `@tanstack/react-query` utiliza persistência local para manter dados de alunos, biblioteca e treinos cacheados no dispositivo, acelerando reaberturas.

### Passo 5: Inicialização do Supabase & Sessão
- `src/integrations/supabase/client.ts` instancia o cliente singleton com `autoRefreshToken: true` e `persistSession: true`.
- Escuta mudanças de estado de autenticação para renovar tokens e propagar eventos.

### Passo 6: Guardião de Rotas Autenticadas
- O arquivo `src/routes/_authenticated/route.tsx` atua como middleware de roteamento.
- Se o usuário não possuir token válido, ocorre redirecionamento imediato para `/auth`.
- Se autenticado, consulta a permissão do usuário e injeta as credenciais do estúdio.

### Passo 7: Modo Impersonação (Suporte Técnico)
- Controlado por `src/hooks/use-impersonate.ts`.
- Lê a chave `edufinance.impersonate`. Se ativa, injeta o tenant/usuário alvo nas consultas e renderiza o `ImpersonationBanner.tsx` no topo da tela com alerta âmbar/roxo.

---

## 4. Módulos Centrais e Fluxos de Programação Detalhados

### 4.1. Módulo Personal Trainer & Execução de Treino

#### A. Foco Diário Interativo (`FocusedDayView.tsx` & `TrainingDayDetail.tsx`)
- Renderiza a ficha de treino agrupada por dias da semana (Dia A, Dia B, etc.) ou semanas de periodização.
- Permite marcação de séries concluídas em tempo real, ajustes de repetições/cargas executadas e abertura de detalhes técnicos do exercício.

#### B. Mapa Térmico Muscular SVG (`MuscleHeatmap.tsx` & `bodyPathsData.ts`)
- Componente de renderização vetorial SVG interativo do corpo humano (visão anterior e posterior).
- Mapeia automaticamente os grupos musculares estimulados pelos exercícios do dia ou do bloco de treino (ex: peitorais, dorsais, quadríceps, isquiotibiais, deltóides).
- Correlaciona as cores de calor com a biblioteca de exercícios para fornecer feedback visual imediato sobre a distribuição de volume.

#### C. Calculadora Visual de Anilhas (`PlateCalculatorDialog.tsx`)
- Inspirada na ergonomia do openGym.
- Permite selecionar a barra utilizada:
  - Barra Olímpica Masculina (20 kg)
  - Barra Olímpica Feminina (15 kg)
  - Barra Reta Studio (12 kg)
  - Barra W / Curta (10 kg)
  - Barra Guiada / Smith (15 kg / 10 kg)
  - Livre / Sem Barra (0 kg)
- Calcula instantaneamente as anilhas necessárias por lado com gráficos coloridos padronizados (25kg vermelho, 20kg azul, 15kg amarelo, 10kg verde, 5kg branco, etc.).

#### D. Cronômetros de Sessão e Intervalo (`SessionTimer.tsx`, `IntervalTimer.tsx`, `RestCountdownTimer.tsx`)
- Cronômetro de treino com persistência em background e alerta sonoro/áudio.
- **Proteção de 3h Auto-Stop:** Desliga automaticamente após 3 horas ininterruptas para evitar drenagem desnecessária de bateria no celular do treinador ou do aluno.

#### E. Rampa de Aquecimento e Alerta de Platô
- `WorkoutProgressionDialog.tsx` calcula automaticamente a rampa de aquecimento progressiva (ex: 50% da carga para 10 reps, 70% para 5 reps, 90% para 2 reps antes da série de trabalho).
- Detecta estagnação de cargas entre microciclos consecutivos e emite alertas sugerindo reprogramação ou deload.

#### F. Modo Rápido de 30 Minutos (`Quick 30m Mode`)
- Adapta treinos volumosos para sessões compactas de alta densidade quando o aluno relata restrição de tempo, priorizando bi-sets e compostos multiarticulares.

---

### 4.2. Módulo de Prescrição com IA & Motores Especializados

A esteira de IA é construída com isolamento rígido de prompts para evitar alucinações e misturas inadequadas de modalidades.

#### A. Gateway e Roteador (`src/lib/ai-gateway.server.ts` & `ecosystem-llm-router.ts`)
- Centraliza as chamadas de LLM para provedores externos com fallback resiliente e controle de cotas.

#### B. Motores Esportivos Especializados
1. **Musculação (`weightlifting-ia.server.ts`, `prescricao-ia.server.ts`):**
   - Foco estrito em treinamento resistido clássico (barras, halteres, polias, máquinas).
   - Bloqueio explícito de movimentos de CrossFit, LPO e kettlebell.
   - Aplica periodização ondulatória em blocos (semana de adaptação, carga, choque e deload).
   - Suporte a bi-sets, tri-sets e super-sets com agrupamentos rotulados (`A1`, `A2`).
2. **Corrida (`corrida-ia.server.ts`):** Prescrição baseada em zonas cardíacas (Z1 a Z5), treinos contínuos, intervalados e rodagens.
3. **Funcional (`funcional-ia.server.ts`):** Foco em padrões fundamentais de movimento humano (empurrar, puxar, agachar, dobrar quadril, transportar e estabilidade de core).
4. **Híbrido (`hibrido-ia.server.ts`):** Conciliação de ganho de força com capacidade cardiorrespiratória.
5. **Kettlebell Sport (`kb-sport-ia.server.ts`):** Periodização de ciclos técnicos de Snatch, Jerk e Long Cycle com cadência minuto a minuto.

#### C. Mecanismo de Continuação (`continuation.server.ts`)
- Lida com respostas longas de IA quando a geração de blocos de 4 a 8 semanas ultrapassa a janela de saída da API, permitindo recomposição sem perda de dados.

#### D. Memória do Treinador e Atleta (`coach-memory.ts`, `athlete-memory.ts`)
- Armazena preferências metodológicas do treinador e histórico clínico/restrições de lesão do aluno, alimentando contextualmente os prompts de prescrição.

---

### 4.3. Motor de Busca Universal Tokenizado (`src/lib/search-utils.ts`)

Para garantir velocidade e facilidade de busca no dia a dia da academia:
1. **Normalização Determinística (`normalizeSearchText`):**
   - Converte strings via `.normalize("NFD").replace(/[\u0300-\u036f]/g, "")` e `toLowerCase()`.
   - Remove todos os acentos e caracteres diacríticos (ex: "João" vira "joao", "Série" vira "serie", "Braço" vira "braco").
2. **Busca Multi-Termo Tokenizada (`matchesSearchTerms`):**
   - Divide a query em palavras independentes (`normQuery.split(/\s+/)`).
   - Garante que a busca encontre o aluno "Carlos Eduardo da Silva" mesmo que o personal digite apenas "silva carlos" ou "carlos silva".
3. **Escopo de Aplicação Unificada:**
   - Utilizado em Alunos (`students.index.tsx`, `PTStudentDialog.tsx`), Biblioteca de Exercícios (`search-exercises.ts`), Treinos e Histórico de Pagamentos/Despesas.

---

### 4.4. Módulo Financeiro & Diagnóstico Inteligente

#### A. Divisão em 3 Cartões Especializados de Despesas (`ExpenseDialog.tsx`)
As despesas são categorizadas e filtradas em segmentos claros:
1. **Despesas Gerais:** Custos operacionais do negócio (contabilidade, softwares, internet, seguros).
2. **Despesas do Studio:** Custos diretos do espaço físico (aluguel, condomínio, manutenção de equipamentos, materiais de limpeza).
3. **Despesas de Personal Trainer (PT):** Custos do atendimento individualizado (cursos, deslocamento, equipamentos portáteis, uniformes).

#### B. Diagnóstico de Gargalos Financeiros (`StudioAnalyticsPanel.tsx`, `PtAnalyticsPanel.tsx`)
- Cálculo automático de ponto de equilíbrio (Break-even).
- Relação percentual entre Despesas Fixas e Variáveis.
- Margem de contribuição por plano de aluno ativo.

#### C. Recorrência Inteligente de Despesas
- Na edição e criação de despesas (`39eac4a`, `9de750a`), o sistema detecta automaticamente a quantidade de parcelas informada no título ou descrição (ex: "Equipamento 3/10") e projeta os lançamentos futuros mantendo a coerência contábil.

#### D. Sistema de Exportação Multi-Segmento e Multi-Formato (`src/lib/expense-export.ts`)
- Permite exportação seletiva por período, status e segmento (Geral, Studio, PT ou Todos).
- Formatos suportados:
  - **Excel (`.xlsx`):** Tabela estruturada com totais e cabeçalhos formatados.
  - **PDF Institucional (`.pdf`):** Relatório diagramado via `jspdf` e `jspdf-autotable`.
  - **CSV (`.csv`):** Formato padrão para importação em outros sistemas ou planilhas.
  - **TXT & Markdown (`.txt`, `.md`):** Relatórios em texto simples para auditoria rápida.
  - **JSON (`.json`):** Backup bruto dos dados para desenvolvedores.

---

### 4.5. Camada Mobile Nativa (Capacitor Android)

#### A. Estrutura e Configuração (`capacitor.config.ts`)
```ts
const config: CapacitorConfig = {
  appId: 'com.ecossistemamontanha.personalstudio',
  appName: 'Montanha Personal Studio',
  webDir: '.output/public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://montanha-personal-studio.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
};
```

#### B. Guardião de Service Worker no Nativo (`src/routes/__root.tsx`)
- O Service Worker PWA (`/sw.js`) só é registrado quando o app está rodando em navegadores convencionais. No ambiente nativo do Capacitor, o registro é bypassado para não interferir na camada de WebView.

#### C. Pipeline de Compilação do APK
- **Local:** `powershell scripts/build-apk.ps1 -BuildType Debug`
  - Realiza pre-flight checks de disco (alerta se houver menos de 10 GB livres).
  - Executa `./gradlew assembleDebug --no-daemon` e limpa caches temporários.
- **Nuvem (CI/CD GitHub Actions):** `.github/workflows/build-apk.yml`
  - Constrói o APK em runners Ubuntu com JDK 17 e Node 20 sem gastar espaço do disco local do desenvolvedor.

---

### 4.6. Servidor MCP Integrado (`src/routes/[.mcp]/`)

O Personal Studio implementa um servidor do Model Context Protocol (MCP) embutido no TanStack Start:
- `src/routes/[.mcp]/list-tools.ts`: Expõe o catálogo de ferramentas disponíveis para agentes externos de IA.
- `src/routes/[.mcp]/invoke-tool/$tool.ts`: Executa ferramentas sob demanda com autenticação OAuth protegida via `src/routes/[.well-known]/oauth-protected-resource.ts`.

---

## 5. Regras Críticas de Build, Deploy & Governança

### ⚠️ REGRA 1: Bloqueio de Autor Git na Vercel (Cadeado 🔒 / Deploy Blocked)
- **O Problema:** A conta Vercel do projeto pertence à equipe `Ecossistema Montanha` no **plano Hobby**. No plano Hobby, a Vercel **bloqueia sumariamente** qualquer deploy cujo autor do commit Git não seja o dono verificado do repositório no GitHub. Se alguém commitar com e-mail corporativo aleatório (ex: `dev@empresa.com`), a Vercel exibe o erro:
  > *"The deployment was blocked because Vercel couldn't find a Git account for the commit author. Hobby teams do not support collaboration."*
- **A Configuração Obrigatória:** O Git local DEVE estar configurado com:
  ```bash
  git config --global user.name "Coach-Montanha"
  git config --global user.email "Coach-Montanha@users.noreply.github.com"
  ```
  Ao commitar manualmente por linha de comando:
  ```bash
  git commit --author="Coach-Montanha <Coach-Montanha@users.noreply.github.com>" -m "feat/fix: descricao"
  ```

### ⚠️ REGRA 2: Erro 500 no SSR da Vercel (`Cannot find package 'tslib'`)
- **O Problema:** Os pacotes do Radix UI exigem auxiliares TypeScript do pacote `tslib`. No ambiente serverless da Vercel, se o `tslib` não for embutido (*inlined*), a execução na AWS Lambda falha com `HTTP 500: Cannot find package 'tslib'`.
- **A Salvaguarda:**
  1. No `package.json`, garanta `"tslib": "^2.8.1"` em `"dependencies"`.
  2. No `vite.config.ts`, mantenha a regra de inline do Nitro:
     ```ts
     nitro: {
       preset: "vercel",
       externals: {
         inline: ["tslib"],
       },
     },
     ```

### ⚠️ REGRA 3: Manutenção de SEO & Google Indexing
- O arquivo `public/robots.txt` e `public/sitemap.xml` estão ativos.
- Ao criar novas rotas públicas (ex: landing pages ou páginas de consentimento), registre a rota em `public/sitemap.xml`.
- Metadados canônicos e OpenGraph residem na propriedade `head` de `src/routes/__root.tsx`.

---

## 6. Comandos de Operação Diária & Testes

```bash
# 1. Instalação de dependências
bun install

# 2. Servidor de desenvolvimento
bun run dev

# 3. Teste de compilação de produção (build estático + SSR Nitro)
bun run build

# 4. Executar testes E2E com Playwright
bun run test:e2e

# 5. Executar suite de testes mobile
npx playwright test tests/e2e-mobile/

# 6. Sincronizar projeto Android após alterações web
npx cap sync android

# 7. Compilar APK localmente com salvaguarda de disco
powershell -ExecutionPolicy Bypass -File scripts/build-apk.ps1 -BuildType Debug

# 8. Lint e formatação
bun run lint
bun run format
```

---

## 7. Troubleshooting e Resolução Rápida de Falhas

| Sintoma | Causa Mais Provável | Como Resolver |
| :--- | :--- | :--- |
| **Deploy na Vercel com cadeado 🔒 ("Blocked")** | Commit feito com autor não reconhecido no GitHub. | Rode `git commit --amend --author="Coach-Montanha <Coach-Montanha@users.noreply.github.com>"` e faça `git push --force`. |
| **Tela "This page didn't load" (Erro 500)** | Falta de pacote no bundle serverless do Nitro (ex: `tslib`). | Rode `npx vercel logs montanha-personal-studio.vercel.app` para ver o stack trace. Adicione o pacote em `dependencies` e faça inline no `vite.config.ts`. |
| **Dados de alunos não carregam no Dashboard** | Falha de RLS no Supabase ou chave anônima expirada. | Verifique o arquivo `.env` ou `src/integrations/supabase/client.ts` e cheque as políticas de RLS da tabela `students` no painel Supabase. |
| **PWA não atualiza alterações recentes** | Cache antigo retido pelo Service Worker (`sw.js`). | Force um unregister do service worker no DevTools > Application > Service Workers > "Unregister", ou incremente a versão do cache em `sw.js`. |
| **Elementos cortados no topo ou rodapé no Android** | Safe-area inset não aplicado no componente. | Adicione as classes utilitárias `pt-safe` / `pb-safe` ou use `calc(env(safe-area-inset-top) + ...)`. |
| **Busca de aluno não retorna nome sem acento** | Consulta ignorou o utilitário universal. | Use `matchesSearchTerms(aluno.nome, termoDeBusca)` de `src/lib/search-utils.ts`. |
| **Cronômetro parando em segundo plano no celular** | WebView colocando a thread JS em suspensão profunda. | O `SessionTimer.tsx` grava timestamps absolutos de início/pausa no storage, recalculando o delta real ao retomar a visibilidade do app. |
