# Project: Montanha Personal Studio — Sistema de Check-ins Bônus

## Architecture
- **Framework & SSR:** TanStack Start (v1.168.26), Vite 8, Nitro (Vercel Serverless preset), React 19.
- **Routing & State:** TanStack Router (`src/routes/`), TanStack Query, `createServerFn` RPCs in `src/lib/*.functions.ts`.
- **UI & Design:** Tailwind CSS v4, Radix UI primitives (`@radix-ui/react-*`), Lucide Icons, Sonner toasts.
- **Persistence & Concurrency:** Supabase PostgreSQL client (`@supabase/supabase-js`), migration SQL in `supabase/migrations/`, Row Level Security (RLS), and atomic PostgreSQL RPC functions with `FOR UPDATE` row locks to guarantee zero race conditions and prevent negative balances.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Saldo de Bônus no Perfil do Aluno | Armazenamento de saldo cumulativo e não expirável (`bonus_checkins_balance >= 0`) desvinculado de planos | M1 | ORIGINAL_REQUEST R1 |
| F2 | Concessão e Ajuste de Bônus pelo Coach | Ação administrativa no perfil do aluno para creditar (+X) ou ajustar saldo de bônus | M2, M3 | ORIGINAL_REQUEST R1 |
| F3 | Ledger / Extrato de Transações de Bônus | Tabela imutável `student_bonus_transactions` para auditoria de concessão, transferência, débito e estorno | M1, M2 | ORIGINAL_REQUEST R1, R2 |
| F4 | Transferência Administrativa de Bônus | Operação atômica para repassar X bônus de aluno A para aluno B com bloqueio de linha | M1, M2, M3 | ORIGINAL_REQUEST R2 |
| F5 | Modal Interativo de Decisão de Reserva | Diálogo no portal do aluno no clique de check-in para decidir entre cota de plano ou crédito bônus | M4 | ORIGINAL_REQUEST R3 |
| F6 | Agendamento sem Plano Ativo | Permissão para aluno sem plano ativo reservar aula se possuir bônus disponível | M2, M4 | ORIGINAL_REQUEST R3 |
| F7 | Débito Seguro de Vaga com Bônus | Débito atômico de 1 crédito e reserva de vaga respeitando capacidade e concorrência | M1, M2, M4 | ORIGINAL_REQUEST R4 |
| F8 | Estorno Automático em Cancelamento | Restituição automática de 1 bônus ao aluno no cancelamento tempestivo (`now <= closes`) | M1, M2, M4 | ORIGINAL_REQUEST R4 |
| F9 | Visibilidade do Saldo no Portal | Card/chip de destaque no topo do portal do aluno com saldo e badge "Sem expiração" | M4 | ORIGINAL_REQUEST R5 |
| F10 | Saldo e Extrato na Aba Meus Dados | Visualização detalhada de bônus e histórico no perfil do aluno no portal | M4 | ORIGINAL_REQUEST R5 |
| F11 | Indicador de Bônus no Painel do Studio | Indicadores de bônus na listagem geral de alunos e no prontuário do aluno | M3 | ORIGINAL_REQUEST R1 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Database Schema, Ledger & Atomic RPCs | Migração SQL com `bonus_checkins_balance`, `is_bonus`, tabela de ledger `student_bonus_transactions`, e RPCs atômicas com `FOR UPDATE` | none | IN_PROGRESS |
| M2 | Backend Server Functions & Quota Isolation | Server functions (`classes.functions.ts`, `bonus.functions.ts`), isolamento de cota em `computeQuotaUsage`, suporte a aluno sem plano | M1 | PLANNED |
| M3 | Admin Studio Management & Transfer UI | Componentes `BonusBalancePanel`, `GrantBonusDialog`, `TransferBonusDialog`, chips e KPIs no painel do coach | M2 | PLANNED |
| M4 | Student Portal Booking Flow & Decision Modal | Componentes `BonusDecisionModal`, `BonusBalanceCard`, fluxo de reserva com bônus e estorno no cancelamento | M2 | PLANNED |
| M5 | E2E Testing, Quality & Adversarial Hardening | Execução e validação 100% dos testes E2E (Tiers 1-4), testes adversariais (Tier 5), `bun run build` exit code 0 | M3, M4 | PLANNED |

## Interface Contracts

### 1. Database & RPCs (`supabase/migrations/`)
- `students.bonus_checkins_balance`: `integer NOT NULL DEFAULT 0 CHECK (bonus_checkins_balance >= 0)`
- `class_attendance.is_bonus`: `boolean NOT NULL DEFAULT false`
- `student_bonus_transactions`: `(id uuid, user_id uuid, student_id uuid, amount integer, transaction_type text, related_student_id uuid, session_id uuid, attendance_id uuid, reason text, created_by uuid, created_at timestamptz)`
- `public.admin_adjust_bonus_checkins(p_student_id uuid, p_amount integer, p_reason text)`
- `public.admin_transfer_bonus_checkins(p_source_student_id uuid, p_target_student_id uuid, p_amount integer, p_reason text)`
- `public.book_class_with_bonus(p_session_id uuid)`
- `public.cancel_class_checkin(p_session_id uuid)`

### 2. Backend Server Functions (`src/lib/bonus.functions.ts` & `src/lib/classes.functions.ts`)
- `studentCheckIn({ data: { sessionId: string; useBonus?: boolean } })`: Retorna confirmação de agendamento.
- `studentCancelCheckIn({ data: { sessionId: string } })`: Retorna confirmação de cancelamento e se houve estorno de bônus.
- `getMyBonusBalance()`: Retorna `{ balance: number; transactions: BonusTransaction[] }`.
- `adjustStudentBonus({ data: { studentId: string; amount: number; reason?: string } })`: Ajusta saldo via RPC.
- `transferStudentBonus({ data: { sourceStudentId: string; targetStudentId: string; amount: number; reason?: string } })`: Executa transferência atômica.

### 3. UI Components
- `<BonusDecisionModal open={boolean} onClose={fn} onConfirmPlan={fn} onConfirmBonus={fn} session={ClassSession} bonusBalance={number} quotaRemaining={number} hasActivePlan={boolean} />`
- `<BonusBalanceCard balance={number} variant="portal" | "profile" />`
- `<BonusBalancePanel studentId={string} balance={number} studioId={string} />`
- `<GrantBonusDialog open={boolean} onClose={fn} student={Student} onSuccess={fn} />`
- `<TransferBonusDialog open={boolean} onClose={fn} sourceStudent={Student} onSuccess={fn} />`

## Code Layout
- `supabase/migrations/20260924000000_student_bonus_checkins.sql` — Schema extensions & atomic RPCs
- `src/integrations/supabase/types.ts` — Type definitions for bonus tables and RPCs
- `src/lib/bonus.functions.ts` — Admin bonus operations (grant, transfer, list transactions)
- `src/lib/classes.functions.ts` — Updated check-in and cancellation logic with bonus support
- `src/lib/classes.helpers.ts` — Quota calculation excluding bonus check-ins
- `src/components/portal/BonusDecisionModal.tsx` — Modal for student booking decision
- `src/components/portal/BonusBalanceCard.tsx` — Balance display for student portal
- `src/components/students/tabs/BonusBalancePanel.tsx` — Coach management card for bonus balance & audit log
- `src/components/students/dialogs/GrantBonusDialog.tsx` — Modal for granting/adjusting bonus
- `src/components/students/dialogs/TransferBonusDialog.tsx` — Modal for transferring bonus between students
- `src/routes/_authenticated/portal/index.tsx` — Portal agenda & booking flow integration
- `src/routes/_authenticated/portal/perfil.tsx` — Portal profile bonus balance view
- `src/routes/_authenticated/students.$id.tsx` & tabs — Student profile integration
- `tests/e2e/bonus-checkins.spec.ts` — E2E test suite covering all tiers
