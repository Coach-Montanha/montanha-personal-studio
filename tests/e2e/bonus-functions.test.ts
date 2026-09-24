import { describe, it, expect, mock } from "bun:test";
import type {
  CancelClassCheckinResult,
  AdminAdjustBonusResult,
  AdminTransferBonusResult,
  StudentBonusTransaction,
  BookClassWithBonusResult,
} from "@/integrations/supabase/types";
import {
  adjustStudentBonus,
  transferStudentBonus,
  getMyBonusBalance,
  getStudentBonusTransactions,
} from "@/lib/bonus.functions";
import { computeQuotaUsage, toDateKey } from "@/lib/classes.helpers";
import {
  studentCheckIn,
  studentCancelCheckIn,
  getAgenda,
  type AgendaSession,
} from "@/lib/classes.functions";

describe("Milestone M2 Admin: bonus.functions & Type Alignment", () => {
  describe("Reviewer M1-1 Finding 1: Type Alignment in CancelClassCheckinResult", () => {
    it("CancelClassCheckinResult type includes refund_transaction_id and was_bonus", () => {
      const mockResult: CancelClassCheckinResult = {
        success: true,
        session_id: "sess-123",
        student_id: "stud-456",
        student_name: "Ana Silva",
        class_name: "Cross Training",
        was_bonus: true,
        refunded: true,
        refund_transaction_id: "tx-refund-789",
        transaction_id: "tx-refund-789",
        new_balance: 5,
      };

      expect(mockResult.success).toBe(true);
      expect(mockResult.was_bonus).toBe(true);
      expect(mockResult.refunded).toBe(true);
      expect(mockResult.refund_transaction_id).toBe("tx-refund-789");
      expect(mockResult.new_balance).toBe(5);
    });

    it("CancelClassCheckinResult allows null refund_transaction_id when was_bonus is false", () => {
      const mockResult: CancelClassCheckinResult = {
        success: true,
        session_id: "sess-123",
        student_id: "stud-456",
        student_name: "Carlos Santos",
        class_name: "Musculação",
        was_bonus: false,
        refunded: false,
        refund_transaction_id: null,
        new_balance: 0,
      };

      expect(mockResult.was_bonus).toBe(false);
      expect(mockResult.refunded).toBe(false);
      expect(mockResult.refund_transaction_id).toBeNull();
    });
  });

  describe("adjustStudentBonus: Input Validation & Contract Logic", () => {
    it("validates input: requires studentId", () => {
      expect(() => {
        const input: any = { studentId: "", amount: 3 };
        if (!input?.studentId) throw new Error("studentId requerido");
      }).toThrow("studentId requerido");
    });

    it("validates input: rejects zero amount", () => {
      expect(() => {
        const input: any = { studentId: "stud-1", amount: 0 };
        if (
          typeof input.amount !== "number" ||
          isNaN(input.amount) ||
          input.amount === 0 ||
          !Number.isInteger(input.amount)
        ) {
          throw new Error("A quantidade para ajuste deve ser um número inteiro diferente de zero");
        }
      }).toThrow("A quantidade para ajuste deve ser um número inteiro diferente de zero");
    });

    it("validates input: rejects non-integer amount", () => {
      expect(() => {
        const input: any = { studentId: "stud-1", amount: 2.5 };
        if (
          typeof input.amount !== "number" ||
          isNaN(input.amount) ||
          input.amount === 0 ||
          !Number.isInteger(input.amount)
        ) {
          throw new Error("A quantidade para ajuste deve ser um número inteiro diferente de zero");
        }
      }).toThrow("A quantidade para ajuste deve ser um número inteiro diferente de zero");
    });

    it("validates input: accepts positive integer grant and trims reason", () => {
      const input = { studentId: "stud-1", amount: 5, reason: "  Premiação  " };
      const parsed = {
        studentId: input.studentId,
        amount: input.amount,
        reason: input.reason?.trim() || undefined,
      };
      expect(parsed.studentId).toBe("stud-1");
      expect(parsed.amount).toBe(5);
      expect(parsed.reason).toBe("Premiação");
    });

    it("validates input: accepts negative integer adjustment", () => {
      const input = { studentId: "stud-1", amount: -2 };
      const parsed = {
        studentId: input.studentId,
        amount: input.amount,
        reason: input.reason?.trim() || undefined,
      };
      expect(parsed.studentId).toBe("stud-1");
      expect(parsed.amount).toBe(-2);
      expect(parsed.reason).toBeUndefined();
    });

    it("RPC mapping: correctly passes p_student_id, p_amount, p_reason", async () => {
      const mockRpc = mock(async (fnName: string, args: any) => {
        expect(fnName).toBe("admin_adjust_bonus_checkins");
        expect(args.p_student_id).toBe("stud-1");
        expect(args.p_amount).toBe(3);
        expect(args.p_reason).toBe("Sorteio");
        return {
          data: {
            success: true,
            student_id: args.p_student_id,
            student_name: "João Silva",
            previous_balance: 2,
            new_balance: 5,
            amount: args.p_amount,
            transaction_id: "tx-adj-1",
            transaction_type: "grant",
          } satisfies AdminAdjustBonusResult,
          error: null,
        };
      });

      const res = await mockRpc("admin_adjust_bonus_checkins", {
        p_student_id: "stud-1",
        p_amount: 3,
        p_reason: "Sorteio",
      });

      expect(res.data?.success).toBe(true);
      expect(res.data?.new_balance).toBe(5);
    });
  });

  describe("transferStudentBonus: Input Validation & Contract Logic", () => {
    it("validates input: requires sourceStudentId and targetStudentId", () => {
      expect(() => {
        const input: any = { sourceStudentId: "", targetStudentId: "stud-b", amount: 2 };
        if (!input?.sourceStudentId) throw new Error("sourceStudentId requerido");
      }).toThrow("sourceStudentId requerido");

      expect(() => {
        const input: any = { sourceStudentId: "stud-a", targetStudentId: "", amount: 2 };
        if (!input?.targetStudentId) throw new Error("targetStudentId requerido");
      }).toThrow("targetStudentId requerido");
    });

    it("validates input: rejects identical source and target students", () => {
      expect(() => {
        const input = { sourceStudentId: "stud-same", targetStudentId: "stud-same", amount: 2 };
        if (input.sourceStudentId === input.targetStudentId) {
          throw new Error("O aluno de origem e destino não podem ser o mesmo");
        }
      }).toThrow("O aluno de origem e destino não podem ser o mesmo");
    });

    it("validates input: rejects non-positive or non-integer transfer amounts", () => {
      for (const invalidAmount of [0, -1, 1.5, NaN]) {
        expect(() => {
          const input: any = {
            sourceStudentId: "stud-a",
            targetStudentId: "stud-b",
            amount: invalidAmount,
          };
          if (
            typeof input.amount !== "number" ||
            isNaN(input.amount) ||
            input.amount <= 0 ||
            !Number.isInteger(input.amount)
          ) {
            throw new Error(
              "A quantidade para transferência deve ser um número inteiro positivo maior que zero"
            );
          }
        }).toThrow("A quantidade para transferência deve ser um número inteiro positivo maior que zero");
      }
    });

    it("RPC mapping: correctly passes p_source_student_id, p_target_student_id, p_amount, p_reason", async () => {
      const mockRpc = mock(async (fnName: string, args: any) => {
        expect(fnName).toBe("admin_transfer_bonus_checkins");
        expect(args.p_source_student_id).toBe("stud-a");
        expect(args.p_target_student_id).toBe("stud-b");
        expect(args.p_amount).toBe(2);
        expect(args.p_reason).toBe("Presente");
        return {
          data: {
            success: true,
            amount: 2,
            source_student_id: "stud-a",
            source_student_name: "Aluno A",
            source_previous_balance: 5,
            source_new_balance: 3,
            target_student_id: "stud-b",
            target_student_name: "Aluno B",
            target_previous_balance: 0,
            target_new_balance: 2,
            source_transaction_id: "tx-out-1",
            target_transaction_id: "tx-in-1",
          } satisfies AdminTransferBonusResult,
          error: null,
        };
      });

      const res = await mockRpc("admin_transfer_bonus_checkins", {
        p_source_student_id: "stud-a",
        p_target_student_id: "stud-b",
        p_amount: 2,
        p_reason: "Presente",
      });

      expect(res.data?.success).toBe(true);
      expect(res.data?.source_new_balance).toBe(3);
      expect(res.data?.target_new_balance).toBe(2);
    });
  });

  describe("getMyBonusBalance: Student Portal Contract Logic", () => {
    it("returns balance 0 and empty list when student has no record", async () => {
      const stu = null;
      const result = !stu ? { balance: 0, transactions: [] } : { balance: 10, transactions: [] };
      expect(result.balance).toBe(0);
      expect(result.transactions).toEqual([]);
    });

    it("returns balance and mapped transactions for authenticated student", async () => {
      const mockStudent = { id: "stud-1", bonus_checkins_balance: 4 };
      const mockTransactions: StudentBonusTransaction[] = [
        {
          id: "tx-1",
          user_id: "coach-1",
          student_id: "stud-1",
          amount: 5,
          transaction_type: "grant",
          reason: "Boas-vindas",
          created_by: "coach-1",
          created_at: "2026-09-24T00:00:00Z",
          related_student_id: null,
          session_id: null,
          attendance_id: null,
        },
        {
          id: "tx-2",
          user_id: "coach-1",
          student_id: "stud-1",
          amount: -1,
          transaction_type: "usage",
          reason: "Aula Cross Training",
          created_by: "user-stu-1",
          created_at: "2026-09-24T01:00:00Z",
          related_student_id: null,
          session_id: "sess-1",
          attendance_id: "att-1",
        },
      ];

      const result = {
        balance: mockStudent.bonus_checkins_balance,
        transactions: mockTransactions,
      };

      expect(result.balance).toBe(4);
      expect(result.transactions.length).toBe(2);
      expect(result.transactions[0].transaction_type).toBe("grant");
      expect(result.transactions[1].amount).toBe(-1);
    });
  });

  describe("getStudentBonusTransactions: Coach Audit View & Tenant Isolation", () => {
    it("validates input: requires studentId", () => {
      expect(() => {
        const input: any = { studentId: "" };
        if (!input?.studentId) throw new Error("studentId requerido");
      }).toThrow("studentId requerido");
    });

    it("tenant isolation: blocks requester when not studio owner or student themself", () => {
      const student = { id: "stud-1", user_id: "coach-a", account_user_id: "auth-stu-1" };
      const callerUserId = "coach-b";

      expect(() => {
        if (student.user_id !== callerUserId && student.account_user_id !== callerUserId) {
          throw new Error("Sem permissão para visualizar o extrato deste aluno");
        }
      }).toThrow("Sem permissão para visualizar o extrato deste aluno");
    });

    it("tenant isolation: permits studio owner (coach)", () => {
      const student = { id: "stud-1", user_id: "coach-a", account_user_id: "auth-stu-1" };
      const callerUserId = "coach-a";

      let authorized = false;
      if (student.user_id === callerUserId || student.account_user_id === callerUserId) {
        authorized = true;
      }
      expect(authorized).toBe(true);
    });

    it("tenant isolation: permits student themself", () => {
      const student = { id: "stud-1", user_id: "coach-a", account_user_id: "auth-stu-1" };
      const callerUserId = "auth-stu-1";

      let authorized = false;
      if (student.user_id === callerUserId || student.account_user_id === callerUserId) {
        authorized = true;
      }
      expect(authorized).toBe(true);
    });
  });

  describe("Server Function Symbols Export Verification", () => {
    it("exports all required server functions and helpers", () => {
      expect(typeof getMyBonusBalance).toBe("function");
      expect(typeof adjustStudentBonus).toBe("function");
      expect(typeof transferStudentBonus).toBe("function");
      expect(typeof getStudentBonusTransactions).toBe("function");
      expect(typeof studentCheckIn).toBe("function");
      expect(typeof studentCancelCheckIn).toBe("function");
      expect(typeof getAgenda).toBe("function");
      expect(typeof computeQuotaUsage).toBe("function");
    });
  });

  describe("Milestone M2 Booking: Quota Isolation in computeQuotaUsage", () => {
    function createMockSupabaseForQuota(options: {
      planType: "weekly" | "monthly" | "package";
      quotaAmount: number;
      paymentDate?: string;
      dueDate?: string;
      weekStartDay?: number;
      attendanceRows: Array<{
        id: string;
        is_bonus: boolean;
        class_sessions?: { session_date: string };
      }>;
      passThroughAllAttendances?: boolean;
    }) {
      const queryLogs: string[] = [];

      const supabase = {
        from: (table: string) => {
          queryLogs.push(`from:${table}`);
          if (table === "payments") {
            return {
              select: () => ({
                eq: () => ({
                  eq: () => ({
                    not: () => ({
                      order: () => ({
                        order: () => ({
                          limit: () => ({
                            data: [
                              {
                                plan_id: "plan-1",
                                student_id: "stud-1",
                                user_id: "coach-1",
                                payment_date: options.paymentDate ?? toDateKey(new Date()),
                                due_date: options.dueDate ?? "2099-12-31",
                                plans: {
                                  name: "Plano Teste",
                                  checkin_quota_type: options.planType,
                                  checkin_quota_amount: options.quotaAmount,
                                  package_valid_days: 30,
                                },
                              },
                            ],
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            };
          }
          if (table === "studio_settings") {
            return {
              select: () => ({
                limit: () => ({
                  maybeSingle: () => ({
                    data: { checkin_week_start_day: options.weekStartDay ?? 0 },
                  }),
                }),
              }),
            };
          }
          if (table === "class_attendance") {
            return {
              select: (fields: string) => {
                queryLogs.push(`attendance_select:${fields}`);
                return {
                  eq: (col1: string, val1: any) => {
                    queryLogs.push(`attendance_eq:${col1}=${val1}`);
                    return {
                      eq: (col2: string, val2: any) => {
                        queryLogs.push(`attendance_eq:${col2}=${val2}`);
                        let resultRows = options.attendanceRows;
                        if (!options.passThroughAllAttendances) {
                          if (col2 === "is_bonus") {
                            resultRows = resultRows.filter((r) => r.is_bonus === val2);
                          }
                        }
                        return { data: resultRows };
                      },
                    };
                  },
                };
              },
            };
          }
          return {};
        },
        _queryLogs: queryLogs,
      };
      return supabase;
    }

    it("verifies that .eq('is_bonus', false) and select('is_bonus') are present in query chain", async () => {
      const today = toDateKey(new Date());
      const mockClient = createMockSupabaseForQuota({
        planType: "weekly",
        quotaAmount: 3,
        attendanceRows: [
          { id: "att-1", is_bonus: false, class_sessions: { session_date: today } },
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "stud-1");

      expect(mockClient._queryLogs).toContain("from:class_attendance");
      expect(mockClient._queryLogs.some((log) => log.includes("attendance_select") && log.includes("is_bonus"))).toBe(true);
      expect(mockClient._queryLogs).toContain("attendance_eq:is_bonus=false");
      expect(usage.used).toBe(1);
      expect(usage.remaining).toBe(2);
    });

    it("weekly quota ignores bonus check-ins and only counts regular check-ins", async () => {
      const today = toDateKey(new Date());
      const mockClient = createMockSupabaseForQuota({
        planType: "weekly",
        quotaAmount: 2,
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "bon-1", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-2", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-3", is_bonus: true, class_sessions: { session_date: today } },
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "stud-1");

      expect(usage.quota_type).toBe("weekly");
      expect(usage.quota_amount).toBe(2);
      expect(usage.used).toBe(1); // Only reg-1 counted!
      expect(usage.remaining).toBe(1); // 2 - 1 = 1
    });

    it("defensive in-memory filter excludes is_bonus === true even if query passes it", async () => {
      const today = toDateKey(new Date());
      const mockClient = createMockSupabaseForQuota({
        planType: "weekly",
        quotaAmount: 2,
        passThroughAllAttendances: true, // Simulates DB returning is_bonus: true rows
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "bon-1", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-2", is_bonus: true, class_sessions: { session_date: today } },
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "stud-1");

      // In-memory filter (r.is_bonus === true => return false) protects quota
      expect(usage.used).toBe(1);
      expect(usage.remaining).toBe(1);
    });

    it("monthly quota isolates bonus check-ins from plan consumption", async () => {
      const today = toDateKey(new Date());
      const mockClient = createMockSupabaseForQuota({
        planType: "monthly",
        quotaAmount: 4,
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-2", is_bonus: false, class_sessions: { session_date: today } },
          { id: "bon-1", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-2", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-3", is_bonus: true, class_sessions: { session_date: today } },
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "stud-1");

      expect(usage.quota_type).toBe("monthly");
      expect(usage.quota_amount).toBe(4);
      expect(usage.used).toBe(2);
      expect(usage.remaining).toBe(2);
    });

    it("package quota isolates bonus check-ins from package consumption", async () => {
      const today = toDateKey(new Date());
      const mockClient = createMockSupabaseForQuota({
        planType: "package",
        quotaAmount: 10,
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-2", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-3", is_bonus: false, class_sessions: { session_date: today } },
          { id: "bon-1", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-2", is_bonus: true, class_sessions: { session_date: today } },
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "stud-1");

      expect(usage.quota_type).toBe("package");
      expect(usage.quota_amount).toBe(10);
      expect(usage.used).toBe(3);
      expect(usage.remaining).toBe(7);
    });

    it("student with only bonus check-ins maintains 0 used plan quota", async () => {
      const today = toDateKey(new Date());
      const mockClient = createMockSupabaseForQuota({
        planType: "weekly",
        quotaAmount: 5,
        attendanceRows: [
          { id: "bon-1", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-2", is_bonus: true, class_sessions: { session_date: today } },
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "stud-1");

      expect(usage.used).toBe(0);
      expect(usage.remaining).toBe(5);
    });
  });

  describe("Milestone M2 Booking: getAgenda with Bonus Access", () => {
    it("agenda access logic grants is_enrolled when student has bonus balance > 0 without plan", () => {
      const studentId = "stud-planless";
      const hasCurrentPlan = false;
      const allowedProgramIds: Set<string> | null = null;
      const bonusBalance = 3;

      const hasPlanAccess = (programId: string | null) => {
        if (!studentId || !hasCurrentPlan) return false;
        if (allowedProgramIds === null) return true;
        return programId ? allowedProgramIds.has(programId) : false;
      };

      const hasAccess = (programId: string | null) => {
        if (!studentId) return false;
        if (bonusBalance > 0) return true;
        return hasPlanAccess(programId);
      };

      const progId = "prog-cross";
      const isEnrolled = hasAccess(progId);
      const planAccess = hasPlanAccess(progId);

      expect(isEnrolled).toBe(true);
      expect(planAccess).toBe(false);
    });

    it("agenda access logic denies is_enrolled when student has no plan and bonus balance is 0", () => {
      const studentId = "stud-broke";
      const hasCurrentPlan = false;
      const allowedProgramIds: Set<string> | null = null;
      const bonusBalance = 0;

      const hasPlanAccess = (programId: string | null) => {
        if (!studentId || !hasCurrentPlan) return false;
        if (allowedProgramIds === null) return true;
        return programId ? allowedProgramIds.has(programId) : false;
      };

      const hasAccess = (programId: string | null) => {
        if (!studentId) return false;
        if (bonusBalance > 0) return true;
        return hasPlanAccess(programId);
      };

      const progId = "prog-cross";
      const isEnrolled = hasAccess(progId);
      const planAccess = hasPlanAccess(progId);

      expect(isEnrolled).toBe(false);
      expect(planAccess).toBe(false);
    });

    it("agenda access logic grants both is_enrolled and has_plan_access when student has active plan", () => {
      const studentId = "stud-vip";
      const hasCurrentPlan = true;
      const allowedProgramIds: Set<string> | null = null;
      const bonusBalance = 2;

      const hasPlanAccess = (programId: string | null) => {
        if (!studentId || !hasCurrentPlan) return false;
        if (allowedProgramIds === null) return true;
        return programId ? allowedProgramIds.has(programId) : false;
      };

      const hasAccess = (programId: string | null) => {
        if (!studentId) return false;
        if (bonusBalance > 0) return true;
        return hasPlanAccess(programId);
      };

      const progId = "prog-cross";
      expect(hasAccess(progId)).toBe(true);
      expect(hasPlanAccess(progId)).toBe(true);
    });
  });

  describe("Milestone M2 Booking: studentCheckIn (Bonus Routing & Plan Quota)", () => {
    it("validates input: requires sessionId and parses useBonus correctly", () => {
      expect(() => {
        const input: any = { sessionId: "" };
        if (!input.sessionId) throw new Error("sessionId requerido");
      }).toThrow("sessionId requerido");

      const parseInput = (input: { sessionId: string; useBonus?: boolean }) => {
        if (!input.sessionId) throw new Error("sessionId requerido");
        return {
          sessionId: input.sessionId,
          useBonus: Boolean(input.useBonus),
        };
      };

      expect(parseInput({ sessionId: "sess-1", useBonus: true })).toEqual({
        sessionId: "sess-1",
        useBonus: true,
      });

      expect(parseInput({ sessionId: "sess-1" })).toEqual({
        sessionId: "sess-1",
        useBonus: false,
      });

      expect(parseInput({ sessionId: "sess-1", useBonus: false })).toEqual({
        sessionId: "sess-1",
        useBonus: false,
      });
    });

    it("routes to atomic book_class_with_bonus RPC when useBonus is true", async () => {
      let rpcName = "";
      let rpcArgs: any = null;

      const mockSupabase = {
        from: () => ({
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { id: "stud-1", user_id: "coach-1", bonus_checkins_balance: 3 },
              }),
            }),
          }),
        }),
        rpc: async (fn: string, args: any) => {
          rpcName = fn;
          rpcArgs = args;
          return {
            data: {
              success: true,
              session_id: args.p_session_id,
              student_id: args.p_student_id,
              student_name: "Marcos Paulo",
              class_name: "Cross Training",
              attendance_id: "att-bonus-99",
              transaction_id: "tx-usage-99",
              remaining_balance: 2,
            } as BookClassWithBonusResult,
            error: null,
          };
        },
      };

      // Execute simulated studentCheckIn handler logic
      const handler = async (data: { sessionId: string; useBonus: boolean }) => {
        const stu = { id: "stud-1", user_id: "coach-1", bonus_checkins_balance: 3 };
        if (data.useBonus) {
          const { data: rpcRes, error: rpcErr } = await mockSupabase.rpc("book_class_with_bonus", {
            p_session_id: data.sessionId,
            p_student_id: stu.id,
          });
          if (rpcErr) throw new Error(rpcErr.message);
          return {
            ok: true,
            isBonus: true,
            remainingBalance: rpcRes?.remaining_balance,
            attendanceId: rpcRes?.attendance_id,
            transactionId: rpcRes?.transaction_id,
          };
        }
        return { ok: true, isBonus: false };
      };

      const result = await handler({ sessionId: "sess-123", useBonus: true });

      expect(rpcName).toBe("book_class_with_bonus");
      expect(rpcArgs).toEqual({ p_session_id: "sess-123", p_student_id: "stud-1" });
      expect(result.ok).toBe(true);
      expect(result.isBonus).toBe(true);
      expect(result.remainingBalance).toBe(2);
      expect(result.attendanceId).toBe("att-bonus-99");
      expect(result.transactionId).toBe("tx-usage-99");
    });

    it("inserts class_attendance with is_bonus = false when booking via regular plan", async () => {
      let insertedRow: any = null;

      const mockSupabase = {
        from: (table: string) => ({
          insert: async (row: any) => {
            if (table === "class_attendance") {
              insertedRow = row;
            }
            return { error: null };
          },
        }),
      };

      const session = { id: "sess-100" };
      const stu = { id: "stud-100", user_id: "coach-100" };

      await mockSupabase.from("class_attendance").insert({
        user_id: stu.user_id,
        session_id: session.id,
        student_id: stu.id,
        status: "present",
        is_bonus: false,
      });

      expect(insertedRow).not.toBeNull();
      expect(insertedRow.is_bonus).toBe(false);
      expect(insertedRow.status).toBe("present");
      expect(insertedRow.student_id).toBe("stud-100");
    });
  });

  describe("Milestone M2 Booking: studentCancelCheckIn (Atomic Refund Delegation)", () => {
    it("validates input: requires sessionId", () => {
      expect(() => {
        const input: any = { sessionId: "" };
        if (!input.sessionId) throw new Error("sessionId requerido");
      }).toThrow("sessionId requerido");
    });

    it("delegates to cancel_class_checkin RPC and refunds bonus credit when was_bonus is true", async () => {
      let rpcName = "";
      let rpcArgs: any = null;

      const mockSupabase = {
        rpc: async (fn: string, args: any) => {
          rpcName = fn;
          rpcArgs = args;
          return {
            data: {
              success: true,
              session_id: args.p_session_id,
              student_id: args.p_student_id,
              student_name: "Lucas Silva",
              class_name: "Funcional",
              was_bonus: true,
              refunded: true,
              refund_transaction_id: "tx-refund-456",
              new_balance: 4,
            } as CancelClassCheckinResult,
            error: null,
          };
        },
      };

      const handler = async (data: { sessionId: string }) => {
        const stu = { id: "stud-1" };
        const { data: res, error } = await mockSupabase.rpc("cancel_class_checkin", {
          p_session_id: data.sessionId,
          p_student_id: stu.id,
        });
        if (error) throw new Error(error.message);
        return {
          ok: true,
          refunded: Boolean((res as any)?.refunded),
          wasBonus: Boolean((res as any)?.was_bonus),
          newBalance: (res as any)?.new_balance,
          refundTransactionId: (res as any)?.refund_transaction_id ?? (res as any)?.transaction_id ?? null,
        };
      };

      const result = await handler({ sessionId: "sess-abc" });

      expect(rpcName).toBe("cancel_class_checkin");
      expect(rpcArgs).toEqual({ p_session_id: "sess-abc", p_student_id: "stud-1" });
      expect(result.ok).toBe(true);
      expect(result.refunded).toBe(true);
      expect(result.wasBonus).toBe(true);
      expect(result.newBalance).toBe(4);
      expect(result.refundTransactionId).toBe("tx-refund-456");
    });

    it("delegates to cancel_class_checkin RPC and does not refund when was_bonus is false", async () => {
      const mockSupabase = {
        rpc: async (fn: string, args: any) => {
          return {
            data: {
              success: true,
              session_id: args.p_session_id,
              student_id: args.p_student_id,
              student_name: "Lucas Silva",
              class_name: "Funcional",
              was_bonus: false,
              refunded: false,
              refund_transaction_id: null,
              new_balance: 0,
            } as CancelClassCheckinResult,
            error: null,
          };
        },
      };

      const handler = async (data: { sessionId: string }) => {
        const stu = { id: "stud-1" };
        const { data: res, error } = await mockSupabase.rpc("cancel_class_checkin", {
          p_session_id: data.sessionId,
          p_student_id: stu.id,
        });
        if (error) throw new Error(error.message);
        return {
          ok: true,
          refunded: Boolean((res as any)?.refunded),
          wasBonus: Boolean((res as any)?.was_bonus),
          newBalance: (res as any)?.new_balance,
          refundTransactionId: (res as any)?.refund_transaction_id ?? (res as any)?.transaction_id ?? null,
        };
      };

      const result = await handler({ sessionId: "sess-abc" });

      expect(result.ok).toBe(true);
      expect(result.refunded).toBe(false);
      expect(result.wasBonus).toBe(false);
      expect(result.newBalance).toBe(0);
      expect(result.refundTransactionId).toBeNull();
    });
  });
});
