# Infrastructure & Methodology of E2E Testing: Sistema de Check-ins Bônus
**Project:** Montanha Personal Studio  
**Date:** September 2026  
**Document Version:** 1.0.0  
**Status:** ACTIVE  

---

## 1. Executive Summary & Quality Strategy

The **Bonus Check-in System** (`Sistema de Check-ins Bônus`) introduces credit-based attendance decoupled from recurring plans, peer-to-peer administrative credit transfers, student portal decision modals, and atomic refund lifecycles upon cancellation.

Because credit systems handle authoritative balances that directly affect class capacity and financial fairness, this test infrastructure is built upon a **Dual-Track, 4-Tier Systematic Quality Methodology**:
1. **Zero-Facade Guarantee**: Every test executes real state assertions against authoritative data models, business invariant constraints, and PostgreSQL-level RPC contracts.
2. **Defensive Concurrency & Boundary Hardening**: Concurrency races, zero-balance attempts, and negative balance rejections are validated with strict deterministic criteria.
3. **Dual Runner Support**:
   - **Fast In-Memory / Integration Suite (`tests/e2e/bonus-checkins.test.ts`)**: Executed via Bun's native test engine (`bun test tests/e2e/bonus-checkins.test.ts`), running 100+ comprehensive tests in sub-second time without flaky external dependencies.
   - **Browser DOM E2E Suite (`e2e/bonus-checkins.spec.ts`)**: Executed via Playwright (`bun run test:e2e e2e/bonus-checkins.spec.ts`), testing modal dialogues, button interactions, toast feedbacks, and responsive layouts.

---

## 2. 4-Tier Coverage Methodology

The test suite is structured into four distinct coverage tiers, guaranteeing both breadth across features and depth into edge cases:

```
+-------------------------------------------------------------------------+
|                  TIER 4: REAL-WORLD APPLICATION SCENARIOS               |
|   Multi-step user journeys: Coach Grant -> Decision Modal -> Cancel     |
|   Transfer -> Planless Booking -> Quota Protection -> Audit Log         |
+-------------------------------------------------------------------------+
                                    ^
+-------------------------------------------------------------------------+
|                TIER 3: CROSS-FEATURE PAIRWISE COMBINATIONS              |
|   Transfer then Book | Grant then Transfer | Planless with Bonus        |
|   Cancel with Bonus vs Cancel with Plan | Quota Isolation               |
+-------------------------------------------------------------------------+
                                    ^
+-------------------------------------------------------------------------+
|                TIER 2: BOUNDARY & CORNER CASES (E1 - E14)               |
|   Balance = 0 | Negative Rejection | Duplicate Clicks | Last Spot Race  |
|   Cancellation Window Passed | Self-Transfer | Exceeded Transfer        |
+-------------------------------------------------------------------------+
                                    ^
+-------------------------------------------------------------------------+
|                  TIER 1: FEATURE COVERAGE (F1 - F11)                    |
|   >= 5 Comprehensive Unit/E2E Test Cases for EVERY Feature F1 to F11     |
+-------------------------------------------------------------------------+
```

### Tier 1: Feature Coverage (F1 to F11)
Requires **at least 5 distinct test cases** per feature:
- **F1: Saldo de Bônus no Perfil do Aluno**: Initial balance creation, default values, cumulative increments, non-expiration attributes, retrieval by ID.
- **F2: Concessão e Ajuste de Bônus pelo Coach**: Positive grant increments, absolute adjustments, positive validation, coach audit attribution, negative balance rejection.
- **F3: Ledger / Extrato de Transações de Bônus**: Transaction record insertion, type tagging (`grant`, `adjust`, `transfer_in`, `transfer_out`, `debit`, `refund`), timestamping, user attribution, relational linkages.
- **F4: Transferência Administrativa de Bônus**: Debit of source, credit of target, atomic balance preservation, ledger dual-entry recording, cross-tenant isolation.
- **F5: Modal Interativo de Decisão de Reserva**: Conditional display when balance > 0, option to select plan quota, option to select bonus, modal dismissal without side effects, informative balance display.
- **F6: Agendamento sem Plano Ativo**: Successful booking without `plan_id`, error rejection when balance = 0, enrollment status override, capacity booking, attendance creation.
- **F7: Débito Seguro de Vaga com Bônus**: Exactly 1 credit deducted, `is_bonus = true` flag on attendance, capacity decremented, ledger debit entry generated, failure cascades without debit.
- **F8: Estorno Automático em Cancelamento**: Cancellation within window refunds 1 bonus, cancellation creates `refund` ledger entry, cancellation deletes attendance row, capacity restored, cancellation outside window rejects refund.
- **F9: Visibilidade do Saldo no Portal**: Highlight card renders balance, shows "Sem expiração" badge, zero balance state handling, reactive update post-booking, reactive update post-cancel.
- **F10: Saldo e Extrato na Aba Meus Dados**: Balance card rendering in profile tab, chronological transaction list, transaction type badges, formatted dates, pagination/scrolling.
- **F11: Indicador de Bônus no Painel do Studio**: Students table badge/chip, student dossier card, real-time balance indicator, filter/search integration, status badge contrast.

### Tier 2: Boundary & Corner Cases (E1 to E14)
Requires **at least 5 distinct test cases** per boundary category:
- **Zero Balance & Negative Balance Guardrails**: Attempting to book with balance = 0; attempting to transfer more than balance; attempting negative adjustment; checking PostgreSQL `CHECK (bonus_checkins_balance >= 0)`.
- **Concurrency & Race Conditions (E1, E2, E8)**: Double-click rapid submission; last spot contention (`capacity - filled == 1`) between two bonus users; concurrent transfer vs booking.
- **Cancellation Windows (E3, E4, E5)**: Exact boundary at `now == closes`; 1 second after `closes` (strict rejection); 1 second before `closes` (refund success); regular plan cancellation without touching bonus balance.
- **Self & Invalid Transfers (E6, E7)**: Source == Target rejection; negative transfer amounts; non-existent target; cross-studio transfer boundary.
- **Business Rule Invariants (E10, E11, E12, E13, E14)**: Plan quota exhausted fallback to bonus; planless booking; multi-checkin daily restrictions; soft-deleted student preservation; balance adjusted to zero with future bookings.

### Tier 3: Cross-Feature Combinations (Pairwise Interactions)
Validates interactions across discrete functional modules:
- Transfer credit from Student A to B, then Student B immediately books with bonus.
- Coach grants bonus to Student A, Coach immediately transfers to Student B, B books, A attempts to book (insufficient balance).
- Planless student receives bonus, books session, then gets assigned a plan; verifies quota independence.
- Mixed sessions: Student books Session 1 with regular plan and Session 2 with bonus; cancels Session 1 (no bonus change) and cancels Session 2 (bonus refunded).
- Quota Isolation: Verify that `computeQuotaUsage` ignores `is_bonus = true` attendances so weekly/monthly/package quotas remain unaffected.

### Tier 4: Real-World Application Scenarios
End-to-end full life-cycle customer journeys:
- **Journey 1: Promotional Bonus Award to Booking**: Coach awards 2 promotional check-ins -> Student logs in -> views bonus badge -> opens agenda -> selects class -> chooses bonus in modal -> attends session -> balance decrements to 1.
- **Journey 2: Planless Booking, Reschedule & Refund**: Planless student -> awarded 1 bonus -> books Tuesday 18:00 class -> cancels 2 hours before -> receives 1 bonus back -> books Thursday 19:00 class -> verifies single credit recycled.
- **Journey 3: Dual-Student Transfer & Last Spot Contest**: Coach transfers 1 bonus from Student A to Student B -> Student B and Student C compete for final spot -> Student B confirms -> Student C rejected -> Student B balance = 0, Student C balance intact.
- **Journey 4: Plan Quota Exhaustion Fallback**: Student exhausts 3/3 weekly plan classes -> navigates to agenda -> clicks class -> modal displays "Cota semanal esgotada — Deseja usar Check-in Bônus?" -> confirms with bonus -> successfully registered.

---

## 3. Complete Feature & Edge Case Traceability Matrix

| Feature / Edge Case | Description | Primary Test Tier | Test Suite Spec Identifier |
|:---|:---|:---:|:---|
| **F1** | Saldo de Bônus no Perfil | Tier 1 | `T1.1.1` to `T1.1.5` |
| **F2** | Concessão e Ajuste de Bônus | Tier 1 | `T1.2.1` to `T1.2.5` |
| **F3** | Ledger / Extrato de Transações | Tier 1 | `T1.3.1` to `T1.3.5` |
| **F4** | Transferência Administrativa | Tier 1 | `T1.4.1` to `T1.4.5` |
| **F5** | Modal de Decisão de Reserva | Tier 1 | `T1.5.1` to `T1.5.5` |
| **F6** | Agendamento sem Plano Ativo | Tier 1 | `T1.6.1` to `T1.6.5` |
| **F7** | Débito Seguro de Vaga com Bônus | Tier 1 | `T1.7.1` to `T1.7.5` |
| **F8** | Estorno Automático em Cancelamento | Tier 1 | `T1.8.1` to `T1.8.5` |
| **F9** | Visibilidade do Saldo no Portal | Tier 1 | `T1.9.1` to `T1.9.5` |
| **F10** | Saldo e Extrato em Meus Dados | Tier 1 | `T1.10.1` to `T1.10.5` |
| **F11** | Indicador no Painel do Studio | Tier 1 | `T1.11.1` to `T1.11.5` |
| **E1** | Duplo clique rápido na reserva | Tier 2 | `T2.E1.1` to `T2.E1.2` |
| **E2** | Concorrência na última vaga | Tier 2 | `T2.E2.1` to `T2.E2.2` |
| **E3** | Cancelamento após fechar janela | Tier 2 | `T2.E3.1` to `T2.E3.2` |
| **E4** | Cancelamento dentro da janela com bônus | Tier 2 | `T2.E4.1` to `T2.E4.2` |
| **E5** | Cancelamento de aula com plano regular | Tier 2 | `T2.E5.1` to `T2.E5.2` |
| **E6** | Transferência com saldo insuficiente | Tier 2 | `T2.E6.1` to `T2.E6.2` |
| **E7** | Transferência para o próprio aluno | Tier 2 | `T2.E7.1` to `T2.E7.2` |
| **E8** | Concorrência entre transferência e booking | Tier 2 | `T2.E8.1` to `T2.E8.2` |
| **E9** | Decisão com plano ativo e bônus disponíveis | Tier 2 | `T2.E9.1` to `T2.E9.2` |
| **E10** | Agendamento com cota de plano esgotada | Tier 2 | `T2.E10.1` to `T2.E10.2` |
| **E11** | Aluno sem plano ativo com bônus | Tier 2 | `T2.E11.1` to `T2.E11.2` |
| **E12** | Restrição de multi-checkin no mesmo programa | Tier 2 | `T2.E12.1` to `T2.E12.2` |
| **E13** | Preservação de saldo em aluno arquivado | Tier 2 | `T2.E13.1` to `T2.E13.2` |
| **E14** | Ajuste para 0 com aulas futuras agendadas | Tier 2 | `T2.E14.1` to `T2.E14.2` |

---

## 4. Test Runners, Directory Layout & Execution

### Directory Structure
```
tests/
  e2e/
    bonus-checkins.test.ts      # Fast, self-contained Bun Test Suite (Tiers 1-4)
e2e/
  bonus-checkins.spec.ts        # Full Browser Playwright Spec (UI & DOM)
  fixtures/
    auth.fixture.ts             # Auth & user mocking fixtures
    page-objects/
      AppShellPage.ts
      AuthPage.ts
      StudentsPage.ts
```

### Execution Commands

1. **Run Bun Fast Test Suite (Tiers 1-4)**:
   ```bash
   bun test tests/e2e/bonus-checkins.test.ts
   ```

2. **Run Playwright Browser E2E Spec**:
   ```bash
   bun run test:e2e e2e/bonus-checkins.spec.ts
   ```

3. **Verify Build & Compilation**:
   ```bash
   bun run build
   ```

---

## 5. Pass/Fail Criteria & Assertion Standards

1. **Pass Criteria**:
   - 100% of defined tests in `tests/e2e/bonus-checkins.test.ts` pass with exit code 0.
   - All balance mutations verify non-negative invariant: `balance >= 0`.
   - All transactions verify balance-ledger conservation: `balance == SUM(transactions.amount)`.
   - Capacity limits strictly respected: `active_attendances <= session.capacity`.
   - Windows strictly enforced: `now <= session.closes`.
2. **Fail Conditions**:
   - Any test where balance becomes negative (`< 0`).
   - Any duplicate booking resulting in multiple deductions for the same session.
   - Any cancellation after window that refunds bonus.
   - Any unhandled exception or untyped response.
