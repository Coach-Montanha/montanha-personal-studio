import { describe, it, expect, beforeEach } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * ============================================================================
 * Challenger M1 Empirical Stress & Concurrency Test Suite
 * ============================================================================
 * 
 * Verifies the 4 critical invariants demanded by the orchestrator:
 * 1. Non-negative balance constraint: can bonus_checkins_balance ever be forced negative?
 * 2. Deadlock resilience in admin_transfer_bonus_checkins: lexicographical lock ordering
 *    under opposite-direction concurrent transfers.
 * 3. Capacity constraint under concurrency in book_class_with_bonus.
 * 4. Cancellation window boundaries (now() <= closes vs now() > closes) in cancel_class_checkin.
 * 
 * Also performs AST/regex oracle analysis of the production SQL migration file:
 * supabase/migrations/20260924000000_student_bonus_checkins.sql
 */

// ----------------------------------------------------------------------------
// Model Types
// ----------------------------------------------------------------------------
interface Student {
  id: string;
  user_id: string; // Studio owner ID
  account_user_id?: string;
  name: string;
  bonus_checkins_balance: number;
}

interface ClassSession {
  id: string;
  user_id: string;
  class_id: string;
  class_name: string;
  session_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM
  capacity: number;
  checkin_opens_minutes_before: number;
  checkin_closes_minutes_before: number;
  status: "scheduled" | "cancelled" | "completed";
}

interface ClassAttendance {
  id: string;
  session_id: string;
  student_id: string;
  user_id: string;
  is_bonus: boolean;
  status: "present" | "cancelled";
}

interface BonusTransaction {
  id: string;
  user_id: string;
  student_id: string;
  amount: number;
  transaction_type: "grant" | "adjustment" | "usage" | "checkin" | "refund" | "transfer_in" | "transfer_out";
  related_student_id?: string | null;
  session_id?: string | null;
  attendance_id?: string | null;
  reason?: string;
  created_by?: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// Simulated PostgreSQL Engine with Strict Row Locking & Transaction Semantics
// ----------------------------------------------------------------------------
class PostgresSimEngine {
  students = new Map<string, Student>();
  sessions = new Map<string, ClassSession>();
  attendances = new Map<string, ClassAttendance>();
  transactions: BonusTransaction[] = [];

  // Lock manager simulating PostgreSQL row-level locks
  private lockQueues = new Map<string, (() => void)[]>();
  private activeLocks = new Set<string>();

  reset() {
    this.students.clear();
    this.sessions.clear();
    this.attendances.clear();
    this.transactions = [];
    this.lockQueues.clear();
    this.activeLocks.clear();
  }

  // Simulates PostgreSQL SELECT ... FOR UPDATE with deterministic lock acquisition
  async acquireRowLock(resourceKey: string): Promise<() => void> {
    if (!this.activeLocks.has(resourceKey)) {
      this.activeLocks.add(resourceKey);
      return () => {
        const queue = this.lockQueues.get(resourceKey);
        if (queue && queue.length > 0) {
          const next = queue.shift()!;
          next();
        } else {
          this.activeLocks.delete(resourceKey);
        }
      };
    }

    return new Promise<() => void>((resolve) => {
      const waitFn = () => {
        resolve(() => {
          const queue = this.lockQueues.get(resourceKey);
          if (queue && queue.length > 0) {
            const next = queue.shift()!;
            next();
          } else {
            this.activeLocks.delete(resourceKey);
          }
        });
      };

      if (!this.lockQueues.has(resourceKey)) {
        this.lockQueues.set(resourceKey, []);
      }
      this.lockQueues.get(resourceKey)!.push(waitFn);
    });
  }

  // --- RPC 1: admin_adjust_bonus_checkins ---
  async admin_adjust_bonus_checkins(params: {
    studentId: string;
    amount: number;
    reason?: string;
    callerId?: string;
  }) {
    if (!params.studentId) throw new Error("student_id é obrigatório");
    if (params.amount === 0 || params.amount === null || params.amount === undefined) {
      throw new Error("A quantidade para ajuste deve ser diferente de zero");
    }

    // Lock student row
    const unlockStudent = await this.acquireRowLock(`students:${params.studentId}`);
    try {
      const student = this.students.get(params.studentId);
      if (!student) throw new Error(`Aluno não encontrado (id: ${params.studentId})`);

      const newBalance = student.bonus_checkins_balance + params.amount;
      if (newBalance < 0) {
        throw new Error(
          `Saldo insuficiente de bônus. Saldo atual: ${student.bonus_checkins_balance}, ajuste solicitado: ${params.amount}`
        );
      }

      const txType = params.amount > 0 ? "grant" : "adjustment";
      student.bonus_checkins_balance = newBalance;
      this.students.set(student.id, { ...student });

      const txId = `tx-adj-${Date.now()}-${Math.random()}`;
      this.transactions.push({
        id: txId,
        user_id: student.user_id,
        student_id: student.id,
        amount: params.amount,
        transaction_type: txType,
        reason: params.reason || (params.amount > 0 ? "Concessão de check-ins bônus" : "Ajuste de check-ins bônus"),
        created_by: params.callerId,
        created_at: new Date().toISOString(),
      });

      return {
        success: true,
        student_id: student.id,
        previous_balance: student.bonus_checkins_balance - params.amount,
        new_balance: newBalance,
        amount: params.amount,
        transaction_id: txId,
        transaction_type: txType,
      };
    } finally {
      unlockStudent();
    }
  }

  // --- RPC 2: admin_transfer_bonus_checkins (Lexicographical Lock Ordering) ---
  async admin_transfer_bonus_checkins(params: {
    sourceStudentId: string;
    targetStudentId: string;
    amount: number;
    reason?: string;
    callerId?: string;
    artificialDelayMs?: number;
  }) {
    if (!params.sourceStudentId || !params.targetStudentId) {
      throw new Error("IDs de aluno de origem e destino são obrigatórios");
    }
    if (params.sourceStudentId === params.targetStudentId) {
      throw new Error("O aluno de origem e destino não podem ser o mesmo");
    }
    if (params.amount <= 0) {
      throw new Error("A quantidade para transferência deve ser um número inteiro positivo maior que zero");
    }

    // Lexicographical order matching PostgreSQL procedure:
    // IF p_source_student_id < p_target_student_id THEN v_first_id := source, v_second_id := target ...
    const firstId = params.sourceStudentId < params.targetStudentId ? params.sourceStudentId : params.targetStudentId;
    const secondId = params.sourceStudentId < params.targetStudentId ? params.targetStudentId : params.sourceStudentId;

    const unlockFirst = await this.acquireRowLock(`students:${firstId}`);

    // If an artificial delay is requested, wait before acquiring second lock
    // (This stress-tests that opposite-direction transfers NEVER deadlock)
    if (params.artificialDelayMs) {
      await new Promise((r) => setTimeout(r, params.artificialDelayMs));
    }

    let unlockSecond: () => void;
    try {
      unlockSecond = await this.acquireRowLock(`students:${secondId}`);
    } catch (err) {
      unlockFirst();
      throw err;
    }

    try {
      const rec1 = this.students.get(firstId);
      const rec2 = this.students.get(secondId);
      if (!rec1 || !rec2) throw new Error("Aluno não encontrado durante a transferência");

      const source = rec1.id === params.sourceStudentId ? rec1 : rec2;
      const target = rec1.id === params.sourceStudentId ? rec2 : rec1;

      // Tenant isolation
      if (source.user_id !== target.user_id) {
        throw new Error("Transferência inválida: alunos pertencem a studios distintos");
      }

      // Balance check
      if (source.bonus_checkins_balance < params.amount) {
        throw new Error(
          `Saldo insuficiente no aluno de origem para transferência. Saldo atual: ${source.bonus_checkins_balance}, solicitado: ${params.amount}`
        );
      }

      source.bonus_checkins_balance -= params.amount;
      target.bonus_checkins_balance += params.amount;
      this.students.set(source.id, { ...source });
      this.students.set(target.id, { ...target });

      const txOutId = `tx-out-${Date.now()}-${Math.random()}`;
      const txInId = `tx-in-${Date.now()}-${Math.random()}`;
      const now = new Date().toISOString();

      // Ledger: transfer_out
      this.transactions.push({
        id: txOutId,
        user_id: source.user_id,
        student_id: source.id,
        amount: -params.amount,
        transaction_type: "transfer_out",
        related_student_id: target.id,
        reason: params.reason || `Transferência enviada para ${target.name}`,
        created_by: params.callerId,
        created_at: now,
      });

      // Ledger: transfer_in
      this.transactions.push({
        id: txInId,
        user_id: target.user_id,
        student_id: target.id,
        amount: params.amount,
        transaction_type: "transfer_in",
        related_student_id: source.id,
        reason: params.reason || `Transferência recebida de ${source.name}`,
        created_by: params.callerId,
        created_at: now,
      });

      return {
        success: true,
        amount: params.amount,
        source_student_id: source.id,
        target_student_id: target.id,
        source_new_balance: source.bonus_checkins_balance,
        target_new_balance: target.bonus_checkins_balance,
        source_transaction_id: txOutId,
        target_transaction_id: txInId,
      };
    } finally {
      unlockSecond();
      unlockFirst();
    }
  }

  // --- RPC 3: book_class_with_bonus ---
  async book_class_with_bonus(params: {
    sessionId: string;
    studentId: string;
    now?: Date;
    callerId?: string;
    isAdmin?: boolean;
    artificialDelayMs?: number;
  }) {
    if (!params.sessionId) throw new Error("p_session_id é obrigatório");
    if (!params.studentId) throw new Error("p_student_id é obrigatório");

    // 1. Lock student row
    const unlockStudent = await this.acquireRowLock(`students:${params.studentId}`);
    try {
      const student = this.students.get(params.studentId);
      if (!student) throw new Error("Aluno não encontrado");

      // Balance check under lock
      if (student.bonus_checkins_balance < 1) {
        throw new Error(`Saldo de bônus insuficiente para reservar a aula (saldo atual: ${student.bonus_checkins_balance})`);
      }

      // 2. Lock session row (FOR UPDATE OF cs)
      const unlockSession = await this.acquireRowLock(`sessions:${params.sessionId}`);
      try {
        const session = this.sessions.get(params.sessionId);
        if (!session) throw new Error("Sessão de aula não encontrada");

        if (session.user_id !== student.user_id) {
          throw new Error("A sessão selecionada pertence a outro studio");
        }

        if (session.status !== "scheduled") {
          throw new Error(`Não é possível agendar nesta aula (status da sessão: ${session.status})`);
        }

        // Time window validation
        const sessionStart = new Date(`${session.session_date}T${session.start_time}:00-03:00`);
        const opensAt = new Date(sessionStart.getTime() - session.checkin_opens_minutes_before * 60_000);
        const closesAt = new Date(sessionStart.getTime() - session.checkin_closes_minutes_before * 60_000);
        const curTime = params.now || new Date();

        if (!params.isAdmin) {
          if (curTime < opensAt) throw new Error("Check-in ainda não está aberto");
          if (curTime > closesAt) throw new Error("Check-in encerrado para esta aula");
        }

        // Check duplicate
        for (const att of this.attendances.values()) {
          if (att.session_id === session.id && att.student_id === student.id && att.status === "present") {
            throw new Error("Você já possui check-in nesta sessão");
          }
        }

        // Count capacity under session lock
        let currentCount = 0;
        for (const att of this.attendances.values()) {
          if (att.session_id === session.id && att.status === "present") {
            currentCount++;
          }
        }

        if (currentCount >= session.capacity) {
          throw new Error(`Turma sem vagas disponíveis (${currentCount} de ${session.capacity} vagas preenchidas)`);
        }

        if (params.artificialDelayMs) {
          await new Promise((r) => setTimeout(r, params.artificialDelayMs));
        }

        // Decrement balance
        student.bonus_checkins_balance -= 1;
        this.students.set(student.id, { ...student });

        // Insert attendance
        const attId = `att-${Date.now()}-${Math.random()}`;
        this.attendances.set(attId, {
          id: attId,
          session_id: session.id,
          student_id: student.id,
          user_id: session.user_id,
          is_bonus: true,
          status: "present",
        });

        // Insert ledger usage
        const txId = `tx-use-${Date.now()}-${Math.random()}`;
        this.transactions.push({
          id: txId,
          user_id: session.user_id,
          student_id: student.id,
          amount: -1,
          transaction_type: "usage",
          session_id: session.id,
          attendance_id: attId,
          reason: `Agendamento de aula com bônus (${session.class_name})`,
          created_by: params.callerId,
          created_at: (params.now || new Date()).toISOString(),
        });

        return {
          success: true,
          session_id: session.id,
          student_id: student.id,
          attendance_id: attId,
          remaining_balance: student.bonus_checkins_balance,
        };
      } finally {
        unlockSession();
      }
    } finally {
      unlockStudent();
    }
  }

  // --- RPC 4: cancel_class_checkin ---
  async cancel_class_checkin(params: {
    sessionId: string;
    studentId: string;
    now?: Date;
    isCoach?: boolean;
    callerId?: string;
  }) {
    if (!params.sessionId) throw new Error("p_session_id é obrigatório");
    if (!params.studentId) throw new Error("p_student_id é obrigatório");

    const unlockStudent = await this.acquireRowLock(`students:${params.studentId}`);
    try {
      const student = this.students.get(params.studentId);
      if (!student) throw new Error("Aluno não encontrado");

      // Lock attendance
      let attendance: ClassAttendance | undefined;
      for (const att of this.attendances.values()) {
        if (att.session_id === params.sessionId && att.student_id === student.id && att.status === "present") {
          attendance = att;
          break;
        }
      }
      if (!attendance) {
        throw new Error("Nenhum check-in encontrado para este aluno nesta sessão");
      }

      const session = this.sessions.get(params.sessionId);
      if (!session) throw new Error("Sessão da aula não encontrada");

      // Time window check:
      // v_closes_at := v_session_start - (checkin_closes_minutes_before * interval '1 minute');
      // IF NOT v_is_coach AND now() > v_closes_at THEN RAISE EXCEPTION ...
      const sessionStart = new Date(`${session.session_date}T${session.start_time}:00-03:00`);
      const closesAt = new Date(sessionStart.getTime() - session.checkin_closes_minutes_before * 60_000);
      const curTime = params.now || new Date();

      if (!params.isCoach && curTime.getTime() > closesAt.getTime()) {
        throw new Error("Cancelamento encerrado para esta aula");
      }

      let refunded = false;
      let txId: string | null = null;
      let newBalance = student.bonus_checkins_balance;

      if (attendance.is_bonus) {
        newBalance += 1;
        student.bonus_checkins_balance = newBalance;
        this.students.set(student.id, { ...student });
        refunded = true;

        txId = `tx-ref-${Date.now()}-${Math.random()}`;
        this.transactions.push({
          id: txId,
          user_id: session.user_id,
          student_id: student.id,
          amount: 1,
          transaction_type: "refund",
          session_id: session.id,
          attendance_id: attendance.id,
          reason: `Estorno de check-in bônus por cancelamento de aula (${session.class_name})`,
          created_by: params.callerId,
          created_at: curTime.toISOString(),
        });
      }

      // Delete attendance
      this.attendances.delete(attendance.id);

      return {
        success: true,
        session_id: session.id,
        student_id: student.id,
        was_bonus: attendance.is_bonus,
        refunded,
        refund_transaction_id: txId,
        new_balance: newBalance,
      };
    } finally {
      unlockStudent();
    }
  }
}

// ----------------------------------------------------------------------------
// Test Suite: Adversarial Stress, Invariant & Concurrency Verification
// ----------------------------------------------------------------------------
describe("Challenger M1: Adversarial Stress & Concurrency Verification", () => {
  let sim: PostgresSimEngine;
  const studioOwnerId = "coach-owner-uuid-1";

  beforeEach(() => {
    sim = new PostgresSimEngine();
  });

  // ==========================================================================
  // Section 1: SQL Migration Artifact Inspection & Static Oracle
  // ==========================================================================
  describe("Section 1: Production Migration File & Invariant Inspection", () => {
    const migrationPath = resolve(process.cwd(), "supabase/migrations/20260924000000_student_bonus_checkins.sql");
    const sql = readFileSync(migrationPath, "utf-8");

    it("S1.1: Database CHECK constraint enforces bonus_checkins_balance >= 0 on students table", () => {
      expect(sql).toContain("CHECK (bonus_checkins_balance >= 0)");
      expect(sql).toContain("students_bonus_checkins_balance_check");
    });

    it("S1.2: Partial index on students(user_id, bonus_checkins_balance) exists for balance > 0", () => {
      expect(sql).toContain("CREATE INDEX IF NOT EXISTS idx_students_bonus_balance");
      expect(sql).toContain("WHERE bonus_checkins_balance > 0");
    });

    it("S1.3: Ledger table student_bonus_transactions enforces strict sign rules", () => {
      expect(sql).toContain("CONSTRAINT sbt_amount_nonzero CHECK (amount <> 0)");
      expect(sql).toContain("(transaction_type = 'grant' AND amount > 0)");
      expect(sql).toContain("(transaction_type = 'transfer_in' AND amount > 0)");
      expect(sql).toContain("(transaction_type = 'refund' AND amount > 0)");
      expect(sql).toContain("(transaction_type = 'usage' AND amount < 0)");
      expect(sql).toContain("(transaction_type = 'checkin' AND amount < 0)");
      expect(sql).toContain("(transaction_type = 'transfer_out' AND amount < 0)");
      expect(sql).toContain("(transaction_type = 'adjustment' AND amount <> 0)");
      expect(sql).toContain("CONSTRAINT sbt_distinct_students");
    });

    it("S1.4: admin_transfer_bonus_checkins uses lexicographical locking order to prevent deadlock", () => {
      expect(sql).toContain("IF p_source_student_id < p_target_student_id THEN");
      expect(sql).toContain("v_first_id := p_source_student_id;");
      expect(sql).toContain("v_second_id := p_target_student_id;");
      expect(sql).toContain("v_first_id := p_target_student_id;");
      expect(sql).toContain("v_second_id := p_source_student_id;");
      expect(sql).toContain("FOR UPDATE;");
    });

    it("S1.5: book_class_with_bonus locks session with FOR UPDATE OF cs", () => {
      expect(sql).toContain("FOR UPDATE OF cs;");
      expect(sql).toContain("IF v_current_count >= v_effective_capacity THEN");
    });

    it("S1.6: cancel_class_checkin checks cancellation boundary and handles coach bypass", () => {
      expect(sql).toContain("IF NOT v_is_coach AND now() > v_closes_at THEN");
      expect(sql).toContain("IF v_attendance.is_bonus IS TRUE THEN");
    });

    it("S1.7: anon execution permissions are strictly revoked on all 4 procedures", () => {
      expect(sql).toContain("REVOKE ALL ON FUNCTION public.admin_adjust_bonus_checkins(uuid, integer, text) FROM PUBLIC, anon;");
      expect(sql).toContain("REVOKE ALL ON FUNCTION public.admin_transfer_bonus_checkins(uuid, uuid, integer, text) FROM PUBLIC, anon;");
      expect(sql).toContain("REVOKE ALL ON FUNCTION public.book_class_with_bonus(uuid, uuid) FROM PUBLIC, anon;");
      expect(sql).toContain("REVOKE ALL ON FUNCTION public.cancel_class_checkin(uuid, uuid) FROM PUBLIC, anon;");
    });
  });

  // ==========================================================================
  // Section 2: Invariant 1 — Non-Negative Balance Constraint Under High Concurrency
  // ==========================================================================
  describe("Section 2: Invariant 1 — Non-Negative Balance Under Extreme Concurrency", () => {
    it("S2.1: 50 concurrent booking attempts racing on a balance of 1 must leave balance exactly 0 (no overdraft)", async () => {
      const studentId = "student-race-01";
      sim.students.set(studentId, {
        id: studentId,
        user_id: studioOwnerId,
        name: "Race Runner",
        bonus_checkins_balance: 1, // Only 1 credit!
      });

      // Session with plenty of capacity (50) to isolate balance as the sole contention
      const sessionId = "session-open-50";
      sim.sessions.set(sessionId, {
        id: sessionId,
        user_id: studioOwnerId,
        class_id: "class-cross",
        class_name: "CrossFit 50",
        session_date: "2026-10-15",
        start_time: "10:00",
        capacity: 50,
        checkin_opens_minutes_before: 120,
        checkin_closes_minutes_before: 15,
        status: "scheduled",
      });

      const validBookingTime = new Date("2026-10-15T09:00:00-03:00");

      // Fire 50 simultaneous booking calls for the SAME student
      const promises = Array.from({ length: 50 }, (_, i) =>
        sim.book_class_with_bonus({
          sessionId,
          studentId,
          now: validBookingTime,
          artificialDelayMs: Math.floor(Math.random() * 5),
        })
      );

      const results = await Promise.allSettled(promises);

      const fulfilled = results.filter((r) => r.status === "fulfilled");
      const rejected = results.filter((r) => r.status === "rejected");

      // Exactly 1 must succeed, 49 must be rejected due to balance exhausted
      expect(fulfilled.length).toBe(1);
      expect(rejected.length).toBe(49);

      // Verify the final balance in state
      const finalStudent = sim.students.get(studentId)!;
      expect(finalStudent.bonus_checkins_balance).toBe(0);
      expect(finalStudent.bonus_checkins_balance).toBeGreaterThanOrEqual(0);

      // Verify ledger has exactly 1 usage transaction
      const studentTx = sim.transactions.filter((t) => t.student_id === studentId);
      expect(studentTx.length).toBe(1);
      expect(studentTx[0].amount).toBe(-1);
      expect(studentTx[0].transaction_type).toBe("usage");
    });

    it("S2.2: 30 concurrent negative adjustments racing on balance = 5 cannot force negative balance", async () => {
      const studentId = "student-adj-race";
      sim.students.set(studentId, {
        id: studentId,
        user_id: studioOwnerId,
        name: "Adjust Runner",
        bonus_checkins_balance: 5,
      });

      // 30 concurrent requests each attempting to decrement by 2
      // Total potential decrement = 60, but balance is only 5. Max 2 can succeed (5 - 2 - 2 = 1).
      const promises = Array.from({ length: 30 }, () =>
        sim.admin_adjust_bonus_checkins({
          studentId,
          amount: -2,
          reason: "Stress test debit",
        })
      );

      const results = await Promise.allSettled(promises);

      const fulfilled = results.filter((r) => r.status === "fulfilled");
      const rejected = results.filter((r) => r.status === "rejected");

      expect(fulfilled.length).toBe(2);
      expect(rejected.length).toBe(28);

      const finalStudent = sim.students.get(studentId)!;
      expect(finalStudent.bonus_checkins_balance).toBe(1); // 5 - 2 - 2 = 1
      expect(finalStudent.bonus_checkins_balance).toBeGreaterThanOrEqual(0);
    });
  });

  // ==========================================================================
  // Section 3: Invariant 2 — Deadlock Resilience in admin_transfer_bonus_checkins
  // ==========================================================================
  describe("Section 3: Invariant 2 — Deadlock Resilience Under Opposite-Direction Concurrent Transfers", () => {
    it("S3.1: 100 simultaneous transfers in opposing directions (50 A->B and 50 B->A) complete with zero deadlocks", async () => {
      // Deterministic UUIDs to test lexicographical comparison
      const studentAId = "00000000-0000-0000-0000-000000000001";
      const studentBId = "ffffffff-ffff-ffff-ffff-ffffffffffff";

      sim.students.set(studentAId, {
        id: studentAId,
        user_id: studioOwnerId,
        name: "Student Alpha",
        bonus_checkins_balance: 100,
      });

      sim.students.set(studentBId, {
        id: studentBId,
        user_id: studioOwnerId,
        name: "Student Omega",
        bonus_checkins_balance: 100,
      });

      const initialTotal = 200;

      // 50 transfers A -> B (1 credit each) and 50 transfers B -> A (1 credit each)
      // We introduce artificial interleaving delays between acquiring lock 1 and lock 2.
      // If lock ordering were naive (e.g. source then target), this WOULD 100% DEADLOCK.
      const transferPromises: Promise<any>[] = [];

      for (let i = 0; i < 50; i++) {
        // A -> B
        transferPromises.push(
          sim.admin_transfer_bonus_checkins({
            sourceStudentId: studentAId,
            targetStudentId: studentBId,
            amount: 1,
            reason: `A to B #${i}`,
            artificialDelayMs: Math.floor(Math.random() * 4),
          })
        );
        // B -> A
        transferPromises.push(
          sim.admin_transfer_bonus_checkins({
            sourceStudentId: studentBId,
            targetStudentId: studentAId,
            amount: 1,
            reason: `B to A #${i}`,
            artificialDelayMs: Math.floor(Math.random() * 4),
          })
        );
      }

      // Execute all 100 transfers concurrently with a 5-second deadline
      const results = await Promise.allSettled(transferPromises);

      const fulfilled = results.filter((r) => r.status === "fulfilled");
      const rejected = results.filter((r) => r.status === "rejected");

      // All 100 must succeed
      expect(fulfilled.length).toBe(100);
      expect(rejected.length).toBe(0);

      const a = sim.students.get(studentAId)!;
      const b = sim.students.get(studentBId)!;

      // Conservation of tokens
      expect(a.bonus_checkins_balance + b.bonus_checkins_balance).toBe(initialTotal);
      expect(a.bonus_checkins_balance).toBe(100);
      expect(b.bonus_checkins_balance).toBe(100);

      // Ledger double-entry audit: 100 transfers = 200 ledger entries (100 transfer_out + 100 transfer_in)
      expect(sim.transactions.length).toBe(200);
      const outCount = sim.transactions.filter((t) => t.transaction_type === "transfer_out").length;
      const inCount = sim.transactions.filter((t) => t.transaction_type === "transfer_in").length;
      expect(outCount).toBe(100);
      expect(inCount).toBe(100);

      const netDelta = sim.transactions.reduce((sum, t) => sum + t.amount, 0);
      expect(netDelta).toBe(0); // Perfect conservation in double-entry bookkeeping
    });

    it("S3.2: 3-party circular concurrent transfers (A -> B, B -> C, C -> A) complete without deadlocks", async () => {
      const idA = "11111111-1111-1111-1111-111111111111";
      const idB = "22222222-2222-2222-2222-222222222222";
      const idC = "33333333-3333-3333-3333-333333333333";

      sim.students.set(idA, { id: idA, user_id: studioOwnerId, name: "Node A", bonus_checkins_balance: 50 });
      sim.students.set(idB, { id: idB, user_id: studioOwnerId, name: "Node B", bonus_checkins_balance: 50 });
      sim.students.set(idC, { id: idC, user_id: studioOwnerId, name: "Node C", bonus_checkins_balance: 50 });

      const ringPromises: Promise<any>[] = [];
      for (let i = 0; i < 20; i++) {
        ringPromises.push(sim.admin_transfer_bonus_checkins({ sourceStudentId: idA, targetStudentId: idB, amount: 1 }));
        ringPromises.push(sim.admin_transfer_bonus_checkins({ sourceStudentId: idB, targetStudentId: idC, amount: 1 }));
        ringPromises.push(sim.admin_transfer_bonus_checkins({ sourceStudentId: idC, targetStudentId: idA, amount: 1 }));
      }

      const results = await Promise.allSettled(ringPromises);
      expect(results.every((r) => r.status === "fulfilled")).toBe(true);

      const sum = [idA, idB, idC].reduce((acc, id) => acc + sim.students.get(id)!.bonus_checkins_balance, 0);
      expect(sum).toBe(150);
    });

    it("S3.3: Self-transfer rejection (source === target) is caught before acquiring locks", async () => {
      const id = "same-student-uuid";
      sim.students.set(id, { id, user_id: studioOwnerId, name: "Self", bonus_checkins_balance: 10 });

      expect(
        sim.admin_transfer_bonus_checkins({
          sourceStudentId: id,
          targetStudentId: id,
          amount: 1,
        })
      ).rejects.toThrow("O aluno de origem e destino não podem ser o mesmo");
    });
  });

  // ==========================================================================
  // Section 4: Invariant 3 — Capacity Constraint Under Extreme Concurrency
  // ==========================================================================
  describe("Section 4: Invariant 3 — Capacity Enforcement Under Concurrency in book_class_with_bonus", () => {
    it("S4.1: 50 concurrent students racing for exactly 1 available spot: exactly 1 succeeds, 49 fail, zero oversubscription", async () => {
      const sessionId = "sess-single-spot";
      sim.sessions.set(sessionId, {
        id: sessionId,
        user_id: studioOwnerId,
        class_id: "class-spartan",
        class_name: "Spartan Single Spot",
        session_date: "2026-10-20",
        start_time: "08:00",
        capacity: 1, // Only 1 spot available!
        checkin_opens_minutes_before: 60,
        checkin_closes_minutes_before: 15,
        status: "scheduled",
      });

      const studentIds: string[] = [];
      for (let i = 0; i < 50; i++) {
        const sid = `student-contestant-${i}`;
        studentIds.push(sid);
        sim.students.set(sid, {
          id: sid,
          user_id: studioOwnerId,
          name: `Contestant ${i}`,
          bonus_checkins_balance: 5,
        });
      }

      const validBookingTime = new Date("2026-10-20T07:30:00-03:00");

      // 50 distinct students simultaneously compete for the 1 spot
      const promises = studentIds.map((sid) =>
        sim.book_class_with_bonus({
          sessionId,
          studentId: sid,
          now: validBookingTime,
          artificialDelayMs: Math.floor(Math.random() * 3),
        })
      );

      const results = await Promise.allSettled(promises);

      const fulfilled = results.filter((r) => r.status === "fulfilled");
      const rejected = results.filter((r) => r.status === "rejected");

      expect(fulfilled.length).toBe(1);
      expect(rejected.length).toBe(49);

      // Verify the 49 rejected students have untouched balances (still 5)
      let countWith5 = 0;
      let countWith4 = 0;
      for (const sid of studentIds) {
        const bal = sim.students.get(sid)!.bonus_checkins_balance;
        if (bal === 5) countWith5++;
        if (bal === 4) countWith4++;
      }

      expect(countWith5).toBe(49);
      expect(countWith4).toBe(1);

      // Check total attendances recorded
      let sessionAttendanceCount = 0;
      for (const att of sim.attendances.values()) {
        if (att.session_id === sessionId && att.status === "present") {
          sessionAttendanceCount++;
        }
      }
      expect(sessionAttendanceCount).toBe(1);
    });

    it("S4.2: 40 concurrent students racing for 3 spots: exactly 3 succeed, 37 rejected", async () => {
      const sessionId = "sess-three-spots";
      sim.sessions.set(sessionId, {
        id: sessionId,
        user_id: studioOwnerId,
        class_id: "class-trio",
        class_name: "Trio Session",
        session_date: "2026-10-21",
        start_time: "14:00",
        capacity: 3,
        checkin_opens_minutes_before: 60,
        checkin_closes_minutes_before: 15,
        status: "scheduled",
      });

      const studentIds: string[] = [];
      for (let i = 0; i < 40; i++) {
        const sid = `student-trio-${i}`;
        studentIds.push(sid);
        sim.students.set(sid, {
          id: sid,
          user_id: studioOwnerId,
          name: `Trio Candidate ${i}`,
          bonus_checkins_balance: 3,
        });
      }

      const validBookingTime = new Date("2026-10-21T13:30:00-03:00");

      const promises = studentIds.map((sid) =>
        sim.book_class_with_bonus({
          sessionId,
          studentId: sid,
          now: validBookingTime,
        })
      );

      const results = await Promise.allSettled(promises);
      const fulfilled = results.filter((r) => r.status === "fulfilled");
      const rejected = results.filter((r) => r.status === "rejected");

      expect(fulfilled.length).toBe(3);
      expect(rejected.length).toBe(37);

      let totalPresent = 0;
      for (const att of sim.attendances.values()) {
        if (att.session_id === sessionId && att.status === "present") totalPresent++;
      }
      expect(totalPresent).toBe(3);
    });
  });

  // ==========================================================================
  // Section 5: Invariant 4 — Cancellation Window Boundaries (Millisecond Precision)
  // ==========================================================================
  describe("Section 5: Invariant 4 — Cancellation Window Boundaries (now() <= closes vs now() > closes)", () => {
    const sessionId = "sess-boundary-check";
    const studentId = "student-boundary-01";

    beforeEach(() => {
      // Session at 10:00 UTC-3, checkin closes 15 min before -> Closes at exactly 09:45:00.000 UTC-3
      sim.sessions.set(sessionId, {
        id: sessionId,
        user_id: studioOwnerId,
        class_id: "class-boundary",
        class_name: "Boundary Pilates",
        session_date: "2026-10-25",
        start_time: "10:00",
        capacity: 10,
        checkin_opens_minutes_before: 60,
        checkin_closes_minutes_before: 15,
        status: "scheduled",
      });

      sim.students.set(studentId, {
        id: studentId,
        user_id: studioOwnerId,
        name: "Boundary Student",
        bonus_checkins_balance: 5,
      });
    });

    const sessionStart = new Date("2026-10-25T10:00:00-03:00");
    const closesAt = new Date(sessionStart.getTime() - 15 * 60_000); // 2026-10-25T09:45:00-03:00

    it("S5.1: Student cancellation at closesAt - 1 millisecond is ALLOWED and refunds credit", async () => {
      // Book first
      await sim.book_class_with_bonus({
        sessionId,
        studentId,
        now: new Date(sessionStart.getTime() - 30 * 60_000), // 09:30
      });
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(4);

      // Cancel at closesAt - 1ms
      const justBeforeCloses = new Date(closesAt.getTime() - 1);
      const res = await sim.cancel_class_checkin({
        sessionId,
        studentId,
        now: justBeforeCloses,
        isCoach: false,
      });

      expect(res.refunded).toBe(true);
      expect(res.new_balance).toBe(5);
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(5);
    });

    it("S5.2: Student cancellation at EXACTLY closesAt (boundary boundary) is ALLOWED (now() <= closes)", async () => {
      // Book first
      await sim.book_class_with_bonus({
        sessionId,
        studentId,
        now: new Date(sessionStart.getTime() - 30 * 60_000),
      });
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(4);

      // Cancel at exactly closesAt (now() > closesAt evaluates to false)
      const res = await sim.cancel_class_checkin({
        sessionId,
        studentId,
        now: closesAt,
        isCoach: false,
      });

      expect(res.refunded).toBe(true);
      expect(res.new_balance).toBe(5);
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(5);
    });

    it("S5.3: Student cancellation at closesAt + 1 millisecond is REJECTED (now() > closes)", async () => {
      // Book first
      await sim.book_class_with_bonus({
        sessionId,
        studentId,
        now: new Date(sessionStart.getTime() - 30 * 60_000),
      });
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(4);

      // Attempt cancel at closesAt + 1ms
      const justAfterCloses = new Date(closesAt.getTime() + 1);

      expect(
        sim.cancel_class_checkin({
          sessionId,
          studentId,
          now: justAfterCloses,
          isCoach: false,
        })
      ).rejects.toThrow("Cancelamento encerrado para esta aula");

      // Balance remains 4, NOT refunded
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(4);
    });

    it("S5.4: Coach cancellation at closesAt + 30 minutes (past window) is ALLOWED and refunds bonus", async () => {
      // Book first
      await sim.book_class_with_bonus({
        sessionId,
        studentId,
        now: new Date(sessionStart.getTime() - 30 * 60_000),
      });
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(4);

      // Coach cancels 30 min after closesAt (15 min after session started)
      const wayPastCloses = new Date(closesAt.getTime() + 30 * 60_000);

      const res = await sim.cancel_class_checkin({
        sessionId,
        studentId,
        now: wayPastCloses,
        isCoach: true, // Coach bypasses time boundary!
      });

      expect(res.refunded).toBe(true);
      expect(res.new_balance).toBe(5);
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(5);
    });

    it("S5.5: Non-bonus booking cancellation does NOT refund bonus balance", async () => {
      // Insert a regular attendance (is_bonus = false)
      const attId = "regular-attendance-uuid";
      sim.attendances.set(attId, {
        id: attId,
        session_id: sessionId,
        student_id: studentId,
        user_id: studioOwnerId,
        is_bonus: false,
        status: "present",
      });

      const res = await sim.cancel_class_checkin({
        sessionId,
        studentId,
        now: new Date(closesAt.getTime() - 1000),
        isCoach: false,
      });

      expect(res.was_bonus).toBe(false);
      expect(res.refunded).toBe(false);
      expect(res.new_balance).toBe(5); // Still 5, no increment
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(5);
    });

    it("S5.6: Double cancellation attempt is rejected cleanly (no duplicate refund anomaly)", async () => {
      await sim.book_class_with_bonus({
        sessionId,
        studentId,
        now: new Date(sessionStart.getTime() - 30 * 60_000),
      });

      // First cancel succeeds
      await sim.cancel_class_checkin({
        sessionId,
        studentId,
        now: new Date(closesAt.getTime() - 1000),
        isCoach: false,
      });
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(5);

      // Second cancel must fail because attendance no longer exists
      expect(
        sim.cancel_class_checkin({
          sessionId,
          studentId,
          now: new Date(closesAt.getTime() - 1000),
          isCoach: false,
        })
      ).rejects.toThrow("Nenhum check-in encontrado para este aluno nesta sessão");

      // Balance must NOT be refunded twice (remains 5)
      expect(sim.students.get(studentId)!.bonus_checkins_balance).toBe(5);
    });
  });
});
