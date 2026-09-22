# MANUAL TÉCNICO DO DESENVOLVEDOR — MONTANHA PERSONAL STUDIO
> **Classificação:** Documento Interno e Confidencial de Engenharia de Software  
> **Localização:** Raiz do repositório (`/DEV_GUIDE.md`). **NUNCA** mova este arquivo para a pasta `public/` ou `dist/` para evitar exposição pública via HTTP.  
> **Data de Atualização:** 22/09/2026  
> **Versão do Documento:** 1.0.0

---

## 1. Visão Geral & Escopo do Projeto

### 1.1. O que é o Montanha Personal Studio?
O **Montanha Personal Studio** é a plataforma central de gestão financeira, inteligência operacional, CRM e gestão de alunos para estúdios de treinamento personalizado e personal trainers autônomos dentro do **Ecossistema Montanha**.

### 1.2. Links e Referências de Produção
- **URL Canônica em Produção:** `https://montanha-personal-studio.vercel.app`
- **Repositório GitHub:** `https://github.com/Coach-Montanha/montanha-personal-studio`
- **Time Vercel:** `Ecossistema Montanha` (Plano Hobby)
- **Tecnologia Base:** TanStack Start (SSR via Nitro / Vercel Serverless Function) + React 19 + Tailwind CSS v4 + Supabase

### 1.3. Personas & Perfis de Acesso
1. **Administrador / Proprietário do Studio:** Acesso total à gestão financeira (faturamento, DRE, conciliação, despesas), gestão de planos, agenda de aulas e CRM de leads.
2. **Personal Trainer / Colaborador:** Gestão de seus alunos, visualização de agenda de sessões e avaliações físicas.
3. **Aluno:** Visualização de treinos, check-in em aulas e histórico de pagamentos via Portal do Aluno (`/portal`).
4. **Suporte Técnico / SuperAdmin (Modo Impersonação):** Permite que desenvolvedores ou suporte operem a interface como se fossem um usuário ou tenant específico sem precisar saber a senha dele.

---

## 2. Arquitetura do Sistema & Stack Tecnológica

### 2.1. Frontend & SSR (TanStack Start)
- **Framework:** `@tanstack/react-start` (v1.168.26) com roteamento via `@tanstack/react-router` (v1.170.16).
- **Compilador/Bundler:** Vite 8 com `@tailwindcss/vite` (Tailwind CSS v4).
- **Mecanismo SSR / Serverless:** O Nitro gera a saída serverless no padrão Vercel (`.vercel/output/functions/__server.func`).
- **Gerenciamento de Estado Server & Cache:** `@tanstack/react-query` (v5.101.4) com persistência offline através de `@tanstack/query-sync-storage-persister`.
- **Componentes Visuais:** Baseados no Radix UI (`@radix-ui/react-*`), Lucide Icons (`lucide-react`) e `class-variance-authority` (CVA).
- **Exportação & Relatórios:** `jspdf`, `jspdf-autotable`, `xlsx`, `html2canvas`.

### 2.2. Backend & Persistência (Supabase)
- **Client Supabase:** `@supabase/supabase-js` (v2.108.2) localizado em `src/integrations/supabase/client.ts`.
- **Autenticação:** Supabase Auth (JWT com refresh tokens persistidos em cookies/localStorage).
- **Banco de Dados:** PostgreSQL com Row Level Security (RLS) habilitado.

---

## 3. Estrutura de Pastas e Arquivos Críticos

```
Montanha Personal Studio/
├── .vercel/                 # Saída gerada pela compilação para Vercel
├── public/                  # Arquivos estáticos servidos diretamente via HTTP
│   ├── icons/               # Ícones PWA
│   ├── manifest.webmanifest # Manifesto PWA
│   ├── sw.js                # Service Worker para suporte offline e cache
│   ├── robots.txt           # Rastreamento de SEO com link para sitemap.xml
│   └── sitemap.xml          # Mapa de rotas públicas para o Googlebot
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── pwa/             # Banner de instalação do PWA
│   │   ├── ui/              # Componentes primitivos (Button, Dialog, Sonner, etc.)
│   │   ├── ImpersonationBanner.tsx  # Banner de suporte técnico/impersonação
│   │   └── ...              # Modais de alunos, treinos, finanças e pagamentos
│   ├── hooks/               # Custom hooks da aplicação
│   │   ├── use-font-size.ts # Controle dinâmico de tipografia
│   │   ├── use-theme.ts     # Gerenciamento de temas (midnight, padrao, pulse)
│   │   └── use-impersonate.ts # Lógica de chaveamento do modo suporte técnico
│   ├── integrations/
│   │   └── supabase/        # Inicialização do client Supabase e tipos do banco
│   ├── lib/                 # Utilitários gerais (confirmações, validações, formatação)
│   ├── routes/              # Árvore de rotas do TanStack Router
│   │   ├── __root.tsx       # Rota raiz (Head, Metadados SEO, JSON-LD, ThemeScript)
│   │   ├── auth.tsx         # Tela de Login / Primeiro Acesso
│   │   ├── reset-password.tsx # Recuperação e redefinição de senha
│   │   ├── boost.tsx        # Módulo Booster do ecossistema
│   │   ├── create.tsx       # Módulo Creator com IA
│   │   ├── eco.tsx          # Central do Ecossistema Montanha
│   │   ├── master-admin.tsx # Redirecionamento para o Portal Master Admin
│   │   └── _authenticated/  # Rotas protegidas (exigem sessão ativa)
│   │       ├── route.tsx    # Layout e guardião de autenticação
│   │       ├── index.tsx    # Dashboard principal (KPIs, Faturamento, Alertas)
│   │       ├── financeiro.tsx # Gestão de caixa, DRE e lançamentos
│   │       ├── students.index.tsx # Lista de alunos matriculados
│   │       ├── students.$id.tsx   # Prontuário e ficha detalhada do aluno
│   │       ├── agenda.tsx   # Grade de horários e agendamento de aulas
│   │       ├── crm.tsx      # Funil de vendas, leads e conversão
│   │       ├── payments.tsx # Controle de mensalidades e cobranças
│   │       ├── plans.tsx    # Gestão de planos e pacotes de aulas
│   │       └── settings.tsx # Configurações da conta e personalização
│   ├── app.config.ts        # Configuração do TanStack Start / Nitro
│   ├── router.tsx           # Criação da instância do TanStack Router
│   └── styles.css           # Estilos globais Tailwind CSS
├── DEV_GUIDE.md             # ESTE MANUAL TÉCNICO INTERNO
├── package.json             # Dependências e scripts de execução
├── tsconfig.json            # Configuração TypeScript
└── vite.config.ts           # Configuração do bundler Vite e plugins
```

---

## 4. Regras Críticas de Build e Deploy (Evitando Falhas Conhecidas)

### ⚠️ REGRA 1: Bloqueio de Autor Git na Vercel (Cadeado 🔒 / Deploy Blocked)
- **O Problema:** A conta Vercel do projeto pertence à equipe `Ecossistema Montanha` no **plano Hobby**. No plano Hobby, a Vercel **bloqueia sumariamente** qualquer deploy cujo autor do commit Git não seja o dono verificado do repositório no GitHub. Se alguém commitar com e-mail corporativo aleatório (ex: `dev@empresa.com`), a Vercel exibe o erro:
  > *"The deployment was blocked because Vercel couldn't find a Git account for the commit author. Hobby teams do not support collaboration."*
- **A Solução Obrigatória:** Antes de qualquer commit, verifique se a configuração do Git está com o e-mail oficial do GitHub:
  ```bash
  git config --global user.name "Coach-Montanha"
  git config --global user.email "Coach-Montanha@users.noreply.github.com"
  ```
  Ao fazer commits manuais por linha de comando:
  ```bash
  git commit --author="Coach-Montanha <Coach-Montanha@users.noreply.github.com>" -m "feat/fix: descricao"
  ```

### ⚠️ REGRA 2: Erro 500 no SSR da Vercel (`Cannot find package 'tslib'`)
- **O Problema:** Os pacotes do Radix UI exigem auxiliares TypeScript do pacote `tslib`. No ambiente serverless da Vercel, se o `tslib` não estiver explícito no `package.json` ou não for embutido (*inlined*), a execução na AWS Lambda falha com `HTTP 500: Cannot find package 'tslib'`.
- **A Salvaguarda:**
  1. No `package.json`, garanta que `"tslib": "^2.8.1"` está listado em `"dependencies"`.
  2. No `vite.config.ts`, garanta a configuração de inline do Nitro:
     ```ts
     nitro: {
       preset: "vercel",
       externals: {
         inline: ["tslib"],
       },
     },
     ```

### ⚠️ REGRA 3: Manutenção do SEO & Google Indexing
- O arquivo `public/robots.txt` e `public/sitemap.xml` estão ativos e referenciados.
- Ao criar novas rotas públicas (ex: páginas de captura ou vitrines), **lembre-se de adicionar a URL correspondente em `public/sitemap.xml`**.
- As tags canônicas e metadados OpenGraph/Schema.org residem na propriedade `head` de `src/routes/__root.tsx`.

---

## 5. Fluxos de Negócio & Lógica Interna

### 5.1. Fluxo de Autenticação e Rotas Protegidas
1. O usuário acessa `/`. Se não houver token ativo no Supabase, a rota `_authenticated/route.tsx` intercepta a requisição e redireciona para `/auth`.
2. Após o login bem-sucedido via `supabase.auth.signInWithPassword`, a sessão é gravada e o usuário é direcionado para a tela principal (`/_authenticated/`).
3. Logout é gerenciado limpando a sessão do Supabase e as chaves de impersonação no `localStorage`.

### 5.2. Sistema de Impersonação / Suporte Técnico
- O arquivo `src/hooks/use-impersonate.ts` armazena no `localStorage` a chave `edufinance.impersonate`.
- Quando preenchida com o ID ou e-mail de um usuário alvo, o banner `ImpersonationBanner.tsx` é exibido no topo da tela com alerta âmbar/roxo.
- As consultas no Supabase utilizam esse identificador para filtrar dados do tenant selecionado, permitindo que a equipe de suporte analise problemas reais relatados pelo cliente.
- Ao clicar em **"Sair do modo suporte"**, o `localStorage.removeItem("edufinance.impersonate")` é chamado e a página é recarregada.

### 5.3. Temas e Tipografia Adaptativa
- Os temas suportados são `padrao`, `pulse` e `midnight` (padrão escuro).
- O script injetado no cabeçalho em `src/routes/__root.tsx` lê o tema antes do React hidratar, evitando efeito de *flash* de tema claro/escuro (*FOUC*).

---

## 6. Guia Passo a Passo de Execução Local e Testes

### 6.1. Pré-requisitos
- [Bun](https://bun.sh/) (recomendado) ou Node.js 20+.
- Git configurado com o usuário `Coach-Montanha`.

### 6.2. Comandos de Operação Diária
```bash
# 1. Instalação de dependências
bun install

# 2. Rodar o servidor de desenvolvimento
bun run dev

# 3. Testar a compilação de produção (build estático + SSR Nitro)
bun run build

# 4. Executar testes E2E com Playwright
bun run test:e2e

# 5. Executar lint e formatação
bun run lint
bun run format
```

---

## 7. Troubleshooting e Resolução Rápida de Falhas

| Sintoma | Causa Mais Provável | Como Resolver |
| :--- | :--- | :--- |
| **Deploy na Vercel com cadeado 🔒 ("Blocked")** | Commit feito com autor não reconhecido no GitHub. | Rode `git commit --amend --author="Coach-Montanha <Coach-Montanha@users.noreply.github.com>"` e faça `git push --force`. |
| **Tela "This page didn't load" (Erro 500)** | Falta de pacote no bundle serverless do Nitro (ex: `tslib`). | Rode `npx vercel logs montanha-personal-studio.vercel.app` para ver o stack trace. Adicione o pacote faltante em `dependencies` e faça inline no `vite.config.ts`. |
| **Dados de alunos não carregam no Dashboard** | Falha de RLS no Supabase ou chave anônima expirada. | Verifique o arquivo `.env` ou `src/integrations/supabase/client.ts` e cheque as políticas de RLS da tabela `students` no painel Supabase. |
| **PWA não atualiza alterações recentes** | Cache antigo retido pelo Service Worker (`sw.js`). | Force um unregister do service worker no DevTools > Application > Service Workers > "Unregister", ou incremente a versão do cache em `sw.js`. |
