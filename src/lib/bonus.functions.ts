import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type {
  StudentBonusTransaction,
  AdminAdjustBonusResult,
  AdminTransferBonusResult,
} from "@/integrations/supabase/types";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type StudentBonusBalance = {
  balance: number;
  transactions: StudentBonusTransaction[];
};

export type AdjustStudentBonusInput = {
  studentId: string;
  amount: number;
  reason?: string;
};

export type TransferStudentBonusInput = {
  sourceStudentId: string;
  targetStudentId: string;
  amount: number;
  reason?: string;
};

export type GetStudentBonusTransactionsInput = {
  studentId: string;
  limit?: number;
};

// ------------------------------------------------------------------
// 1. getMyBonusBalance (Student Portal)
// ------------------------------------------------------------------

/**
 * Returns current bonus balance and transaction history for the authenticated student.
 * Identifies the student record linked via account_user_id = auth.uid().
 */
export const getMyBonusBalance = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StudentBonusBalance> => {
    const { supabase, userId } = context;

    const { data: stu, error: stuErr } = await supabase
      .from("students")
      .select("id, bonus_checkins_balance")
      .eq("account_user_id", userId)
      .maybeSingle();

    if (stuErr) throw new Error(stuErr.message);

    if (!stu) {
      return {
        balance: 0,
        transactions: [],
      };
    }

    const { data: transactions, error: txErr } = await supabase
      .from("student_bonus_transactions")
      .select("*")
      .eq("student_id", stu.id)
      .order("created_at", { ascending: false });

    if (txErr) throw new Error(txErr.message);

    return {
      balance: stu.bonus_checkins_balance ?? 0,
      transactions: transactions ?? [],
    };
  });

// ------------------------------------------------------------------
// 2. adjustStudentBonus (Studio Coach / Admin)
// ------------------------------------------------------------------

/**
 * Adjusts a student's bonus check-in balance (grant or debit).
 * Calls the atomic PostgreSQL stored procedure `admin_adjust_bonus_checkins`.
 */
export const adjustStudentBonus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: AdjustStudentBonusInput) => {
    if (!input?.studentId) throw new Error("studentId requerido");
    if (
      typeof input.amount !== "number" ||
      isNaN(input.amount) ||
      input.amount === 0 ||
      !Number.isInteger(input.amount)
    ) {
      throw new Error("A quantidade para ajuste deve ser um número inteiro diferente de zero");
    }
    return {
      studentId: input.studentId,
      amount: input.amount,
      reason: input.reason?.trim() || undefined,
    };
  })
  .handler(async ({ data, context }): Promise<AdminAdjustBonusResult> => {
    const { supabase } = context;

    const { data: result, error } = await supabase.rpc("admin_adjust_bonus_checkins", {
      p_student_id: data.studentId,
      p_amount: data.amount,
      p_reason: data.reason ?? null,
    });

    if (error) throw new Error(error.message);
    if (!result) throw new Error("Falha ao ajustar bônus: retorno vazio do banco de dados");

    return result as AdminAdjustBonusResult;
  });

// ------------------------------------------------------------------
// 3. transferStudentBonus (Studio Coach / Admin)
// ------------------------------------------------------------------

/**
 * Transfers bonus check-ins from a source student to a target student.
 * Calls the atomic PostgreSQL stored procedure `admin_transfer_bonus_checkins`
 * which uses deterministic lexicographical row locking to prevent deadlocks.
 */
export const transferStudentBonus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: TransferStudentBonusInput) => {
    if (!input?.sourceStudentId) throw new Error("sourceStudentId requerido");
    if (!input?.targetStudentId) throw new Error("targetStudentId requerido");
    if (input.sourceStudentId === input.targetStudentId) {
      throw new Error("O aluno de origem e destino não podem ser o mesmo");
    }
    if (
      typeof input.amount !== "number" ||
      isNaN(input.amount) ||
      input.amount <= 0 ||
      !Number.isInteger(input.amount)
    ) {
      throw new Error("A quantidade para transferência deve ser um número inteiro positivo maior que zero");
    }
    return {
      sourceStudentId: input.sourceStudentId,
      targetStudentId: input.targetStudentId,
      amount: input.amount,
      reason: input.reason?.trim() || undefined,
    };
  })
  .handler(async ({ data, context }): Promise<AdminTransferBonusResult> => {
    const { supabase } = context;

    const { data: result, error } = await supabase.rpc("admin_transfer_bonus_checkins", {
      p_source_student_id: data.sourceStudentId,
      p_target_student_id: data.targetStudentId,
      p_amount: data.amount,
      p_reason: data.reason ?? null,
    });

    if (error) throw new Error(error.message);
    if (!result) throw new Error("Falha ao transferir bônus: retorno vazio do banco de dados");

    return result as AdminTransferBonusResult;
  });

// ------------------------------------------------------------------
// 4. getStudentBonusTransactions (Studio Coach / Admin Audit View)
// ------------------------------------------------------------------

/**
 * Fetches transaction audit history for a specific student for coach/admin view.
 * Validates that the requester owns the student's studio or is the student themself.
 */
export const getStudentBonusTransactions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: GetStudentBonusTransactionsInput) => {
    if (!input?.studentId) throw new Error("studentId requerido");
    return {
      studentId: input.studentId,
      limit: input.limit && input.limit > 0 ? input.limit : 50,
    };
  })
  .handler(async ({ data, context }): Promise<StudentBonusTransaction[]> => {
    const { supabase, userId } = context;

    // Verify student exists and requester is authorized
    const { data: stu, error: stuErr } = await supabase
      .from("students")
      .select("id, user_id, account_user_id, name")
      .eq("id", data.studentId)
      .maybeSingle();

    if (stuErr) throw new Error(stuErr.message);
    if (!stu) throw new Error("Aluno não encontrado");

    // Requester must be the studio owner or the student themself
    if (stu.user_id !== userId && stu.account_user_id !== userId) {
      throw new Error("Sem permissão para visualizar o extrato deste aluno");
    }

    let query = supabase
      .from("student_bonus_transactions")
      .select("*")
      .eq("student_id", data.studentId)
      .order("created_at", { ascending: false });

    if (data.limit) {
      query = query.limit(data.limit);
    }

    const { data: txs, error: txErr } = await query;
    if (txErr) throw new Error(txErr.message);

    return txs ?? [];
  });
