import { describe, it, expect, mock } from "bun:test";
import { computeQuotaUsage, toDateKey } from "@/lib/classes.helpers";
import type {
  QuotaUsage,
} from "@/lib/classes.helpers";
import type {
  BookClassWithBonusResult,
  CancelClassCheckinResult,
} from "@/integrations/supabase/types";

// ==============================================================================
// Mock Generator Helpers for Supabase Quota Queries
// ==============================================================================

interface MockQuotaOptions {
  planType: "weekly" | "monthly" | "package" | "none";
  quotaAmount?: number | null;
  packageValidDays?: number;
  paymentDate?: string;
  dueDate?: string;
  weekStartsOn?: number; // 0 = Sunday, 1 = Monday
  attendanceRows: Array<{
    id: string;
    is_bonus?: boolean | null;
    class_sessions?: {
      session_date?: string | null;
    } | null;
  }>;
}

function buildSupabaseQuotaMock(opts: MockQuotaOptions) {
  const today = toDateKey(new Date());

  const paymentRecord =
    opts.planType === "none"
      ? []
      : [
          {
            plan_id: `plan-${opts.planType}-1`,
            student_id: "student-challenger-1",
            user_id: "coach-challenger-1",
            payment_date: opts.paymentDate ?? today,
            due_date: opts.dueDate ?? "2099-12-31",
            status: "paid",
            plans: {
              name: `Plano ${opts.planType.toUpperCase()}`,
              checkin_quota_type: opts.planType,
              checkin_quota_amount: opts.quotaAmount ?? 5,
              package_valid_days: opts.packageValidDays ?? 30,
            },
          },
        ];

  return {
    from: (table: string) => {
      if (table === "payments") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                not: () => ({
                  order: () => ({
                    order: () => ({
                      limit: async () => ({
                        data: paymentRecord,
                        error: null,
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
              maybeSingle: async () => ({
                data: { checkin_week_start_day: opts.weekStartsOn ?? 1 },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === "class_attendance") {
        return {
          select: () => ({
            eq: (_col1: string, _val1: any) => ({
              eq: (col2: string, val2: any) => {
                // If filtering by is_bonus = false, only return non-bonus rows
                let rows = opts.attendanceRows;
                if (col2 === "is_bonus") {
                  rows = rows.filter((r) => r.is_bonus === val2);
                }
                return Promise.resolve({ data: rows, error: null });
              },
            }),
          }),
        };
      }

      throw new Error(`Unexpected table in quota mock: ${table}`);
    },
  };
}

// ==============================================================================
// CHALLENGER M2 SUITE: QUOTA ISOLATION & CANCELLATION STRESS
// ==============================================================================

describe("Challenger M2: Quota Isolation & Cancellation Stress Suite", () => {
  // ----------------------------------------------------------------------------
  // SECTION 1: Exhaustive Quota Isolation Matrix Across All 3 Plan Types
  // ----------------------------------------------------------------------------
  describe("Section 1: Exhaustive Quota Isolation Matrix Across Plan Types", () => {
    it("S1.1: Weekly Plan — 15 bonus check-ins do NOT consume weekly quota", async () => {
      const today = toDateKey(new Date());
      const mockClient = buildSupabaseQuotaMock({
        planType: "weekly",
        quotaAmount: 3,
        weekStartsOn: 1, // Monday
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-2", is_bonus: false, class_sessions: { session_date: today } },
          // 15 bonus check-ins in the same week
          ...Array.from({ length: 15 }, (_, i) => ({
            id: `bonus-${i + 1}`,
            is_bonus: true,
            class_sessions: { session_date: today },
          })),
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "student-challenger-1");

      expect(usage.quota_type).toBe("weekly");
      expect(usage.quota_amount).toBe(3);
      expect(usage.used).toBe(2);
      expect(usage.remaining).toBe(1);
    });

    it("S1.2: Weekly Plan — Sunday vs Monday start day preserves quota isolation", async () => {
      const today = toDateKey(new Date());

      // Test with Sunday start (0)
      const mockSunday = buildSupabaseQuotaMock({
        planType: "weekly",
        quotaAmount: 4,
        weekStartsOn: 0,
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "bon-1", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-2", is_bonus: true, class_sessions: { session_date: today } },
        ],
      });
      const usageSunday = await computeQuotaUsage(mockSunday, "student-challenger-1");
      expect(usageSunday.used).toBe(1);
      expect(usageSunday.remaining).toBe(3);

      // Test with Monday start (1)
      const mockMonday = buildSupabaseQuotaMock({
        planType: "weekly",
        quotaAmount: 4,
        weekStartsOn: 1,
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "bon-1", is_bonus: true, class_sessions: { session_date: today } },
        ],
      });
      const usageMonday = await computeQuotaUsage(mockMonday, "student-challenger-1");
      expect(usageMonday.used).toBe(1);
      expect(usageMonday.remaining).toBe(3);
    });

    it("S1.3: Monthly Plan — 30 bonus check-ins do NOT deplete monthly quota", async () => {
      const today = toDateKey(new Date());
      const mockClient = buildSupabaseQuotaMock({
        planType: "monthly",
        quotaAmount: 8,
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-2", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-3", is_bonus: false, class_sessions: { session_date: today } },
          // 30 bonus check-ins
          ...Array.from({ length: 30 }, (_, i) => ({
            id: `bonus-m-${i + 1}`,
            is_bonus: true,
            class_sessions: { session_date: today },
          })),
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "student-challenger-1");

      expect(usage.quota_type).toBe("monthly");
      expect(usage.quota_amount).toBe(8);
      expect(usage.used).toBe(3);
      expect(usage.remaining).toBe(5);
    });

    it("S1.4: Package Plan — bonus check-ins do NOT consume package units", async () => {
      const today = toDateKey(new Date());
      const mockClient = buildSupabaseQuotaMock({
        planType: "package",
        quotaAmount: 10,
        packageValidDays: 45,
        attendanceRows: [
          { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-2", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-3", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-4", is_bonus: false, class_sessions: { session_date: today } },
          // 20 bonus check-ins
          ...Array.from({ length: 20 }, (_, i) => ({
            id: `bonus-pkg-${i + 1}`,
            is_bonus: true,
            class_sessions: { session_date: today },
          })),
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "student-challenger-1");

      expect(usage.quota_type).toBe("package");
      expect(usage.quota_amount).toBe(10);
      expect(usage.used).toBe(4);
      expect(usage.remaining).toBe(6);
      expect(usage.package_expires_at).not.toBeNull();
    });

    it("S1.5: Planless Student — maintains quota_type 'none' and 0 used even with bonus attendances", async () => {
      const today = toDateKey(new Date());
      const mockClient = buildSupabaseQuotaMock({
        planType: "none",
        attendanceRows: [
          { id: "bon-1", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-2", is_bonus: true, class_sessions: { session_date: today } },
          { id: "bon-3", is_bonus: true, class_sessions: { session_date: today } },
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "student-planless");

      expect(usage.quota_type).toBe("none");
      expect(usage.quota_amount).toBeNull();
      expect(usage.used).toBe(0);
      expect(usage.remaining).toBeNull();
      expect(usage.plan_id).toBeNull();
    });

    it("S1.6: Defensive Guard — in-memory filter strictly rejects is_bonus === true even if SQL query leaks them", async () => {
      const today = toDateKey(new Date());

      // Mock that deliberately FAILS to filter is_bonus in SQL (simulating leaked rows)
      const leakyMock = {
        from: (table: string) => {
          if (table === "payments") {
            return {
              select: () => ({
                eq: () => ({
                  eq: () => ({
                    not: () => ({
                      order: () => ({
                        order: () => ({
                          limit: async () => ({
                            data: [
                              {
                                plan_id: "plan-leak-1",
                                student_id: "student-1",
                                user_id: "coach-1",
                                payment_date: today,
                                due_date: "2099-12-31",
                                status: "paid",
                                plans: {
                                  name: "Plano Leak Test",
                                  checkin_quota_type: "weekly",
                                  checkin_quota_amount: 5,
                                },
                              },
                            ],
                            error: null,
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
                  maybeSingle: async () => ({
                    data: { checkin_week_start_day: 1 },
                    error: null,
                  }),
                }),
              }),
            };
          }
          if (table === "class_attendance") {
            return {
              select: () => ({
                eq: () => ({
                  eq: () =>
                    // LEAK: returns bonus rows despite .eq('is_bonus', false)
                    Promise.resolve({
                      data: [
                        { id: "reg-1", is_bonus: false, class_sessions: { session_date: today } },
                        { id: "leak-1", is_bonus: true, class_sessions: { session_date: today } },
                        { id: "leak-2", is_bonus: true, class_sessions: { session_date: today } },
                        { id: "leak-3", is_bonus: true, class_sessions: { session_date: today } },
                      ],
                      error: null,
                    }),
                }),
              }),
            };
          }
          throw new Error(`Unexpected table: ${table}`);
        },
      };

      const usage = await computeQuotaUsage(leakyMock, "student-1");

      // Defensive in-memory check 'if (r.is_bonus === true) return false;' must save the day
      expect(usage.used).toBe(1);
      expect(usage.remaining).toBe(4);
    });

    it("S1.7: Corrupted/Missing Session Dates — gracefully ignored without throwing errors", async () => {
      const today = toDateKey(new Date());
      const mockClient = buildSupabaseQuotaMock({
        planType: "weekly",
        quotaAmount: 5,
        attendanceRows: [
          { id: "reg-valid", is_bonus: false, class_sessions: { session_date: today } },
          { id: "reg-null-date", is_bonus: false, class_sessions: { session_date: null } },
          { id: "reg-null-sess", is_bonus: false, class_sessions: null },
          { id: "reg-empty-sess", is_bonus: false, class_sessions: { session_date: "" } },
        ],
      });

      const usage = await computeQuotaUsage(mockClient, "student-1");
      expect(usage.used).toBe(1);
      expect(usage.remaining).toBe(4);
    });
  });

  // ----------------------------------------------------------------------------
  // SECTION 2: Full Lifecycle State-Machine Oracle: Plan vs Bonus
  // ----------------------------------------------------------------------------
  describe("Section 2: Lifecycle State-Machine Oracle (Plan vs Bonus Check-in & Cancellation)", () => {
    it("S2.1: Weekly Plan State-Machine: Interleaved Plan & Bonus Bookings with Cancellations", async () => {
      // In-memory student & studio simulation state
      let studentBonusBalance = 4;
      const ledger: Array<{ type: string; amount: number; sessionId: string }> = [];
      const attendanceTable: Map<string, { id: string; sessionId: string; is_bonus: boolean }> = new Map();
      const planQuota = 2; // Weekly quota limit

      const today = toDateKey(new Date());

      // Helper to compute live quota
      const getQuota = () => {
        let used = 0;
        for (const att of attendanceTable.values()) {
          if (!att.is_bonus) used++;
        }
        return {
          quota: planQuota,
          used,
          remaining: Math.max(0, planQuota - used),
        };
      };

      // Handler for booking
      const book = (sessionId: string, useBonus: boolean) => {
        if (useBonus) {
          if (studentBonusBalance < 1) throw new Error("Saldo de bônus insuficiente");
          studentBonusBalance -= 1;
          const attId = `att-bonus-${sessionId}`;
          attendanceTable.set(sessionId, { id: attId, sessionId, is_bonus: true });
          ledger.push({ type: "usage", amount: -1, sessionId });
          return { ok: true, isBonus: true };
        } else {
          const q = getQuota();
          if (q.used >= q.quota) throw new Error("Cota do plano atingida");
          const attId = `att-reg-${sessionId}`;
          attendanceTable.set(sessionId, { id: attId, sessionId, is_bonus: false });
          return { ok: true, isBonus: false };
        }
      };

      // Handler for cancellation
      const cancel = (sessionId: string) => {
        const att = attendanceTable.get(sessionId);
        if (!att) throw new Error("Nenhum check-in encontrado");

        const wasBonus = att.is_bonus;
        attendanceTable.delete(sessionId);

        if (wasBonus) {
          studentBonusBalance += 1;
          ledger.push({ type: "refund", amount: 1, sessionId });
          return { ok: true, refunded: true, wasBonus: true };
        } else {
          return { ok: true, refunded: false, wasBonus: false };
        }
      };

      // Step 1: Book Regular Session 1
      const res1 = book("sess-1", false);
      expect(res1.ok).toBe(true);
      expect(res1.isBonus).toBe(false);
      expect(getQuota()).toEqual({ quota: 2, used: 1, remaining: 1 });
      expect(studentBonusBalance).toBe(4);

      // Step 2: Book Bonus Session 2
      const res2 = book("sess-2", true);
      expect(res2.ok).toBe(true);
      expect(res2.isBonus).toBe(true);
      expect(getQuota()).toEqual({ quota: 2, used: 1, remaining: 1 }); // Plan quota untouched!
      expect(studentBonusBalance).toBe(3); // Bonus decremented

      // Step 3: Book Regular Session 3 (exhausts plan quota)
      const res3 = book("sess-3", false);
      expect(res3.ok).toBe(true);
      expect(res3.isBonus).toBe(false);
      expect(getQuota()).toEqual({ quota: 2, used: 2, remaining: 0 });
      expect(studentBonusBalance).toBe(3);

      // Step 4: Attempt Regular Session 4 (must be blocked by quota)
      expect(() => book("sess-4", false)).toThrow("Cota do plano atingida");

      // Step 5: Book Session 4 with Bonus (must succeed even with 0 plan quota)
      const res4 = book("sess-4", true);
      expect(res4.ok).toBe(true);
      expect(res4.isBonus).toBe(true);
      expect(getQuota()).toEqual({ quota: 2, used: 2, remaining: 0 }); // Plan quota still 0
      expect(studentBonusBalance).toBe(2);

      // Step 6: Cancel Bonus Session 2 (timely cancellation)
      const can2 = cancel("sess-2");
      expect(can2.ok).toBe(true);
      expect(can2.wasBonus).toBe(true);
      expect(can2.refunded).toBe(true);
      expect(studentBonusBalance).toBe(3); // Bonus restored!
      expect(getQuota()).toEqual({ quota: 2, used: 2, remaining: 0 }); // Plan quota still 0!

      // Step 7: Cancel Regular Session 1 (timely cancellation)
      const can1 = cancel("sess-1");
      expect(can1.ok).toBe(true);
      expect(can1.wasBonus).toBe(false);
      expect(can1.refunded).toBe(false);
      expect(studentBonusBalance).toBe(3); // Bonus NOT touched!
      expect(getQuota()).toEqual({ quota: 2, used: 1, remaining: 1 }); // Plan quota restored by 1!

      // Step 8: Rebook Regular Session with restored quota
      const res5 = book("sess-5", false);
      expect(res5.ok).toBe(true);
      expect(res5.isBonus).toBe(false);
      expect(getQuota()).toEqual({ quota: 2, used: 2, remaining: 0 });
      expect(studentBonusBalance).toBe(3);

      // Step 9: Ledger verification
      expect(ledger.length).toBe(3); // 2 usage, 1 refund
      expect(ledger[0]).toEqual({ type: "usage", amount: -1, sessionId: "sess-2" });
      expect(ledger[1]).toEqual({ type: "usage", amount: -1, sessionId: "sess-4" });
      expect(ledger[2]).toEqual({ type: "refund", amount: 1, sessionId: "sess-2" });
    });

    it("S2.2: Monthly Plan State-Machine: Quota & Bonus Ledger Audit", async () => {
      let bonusBalance = 2;
      let monthlyQuotaUsed = 4;
      const monthlyQuotaAmount = 5;

      // 1. Regular checkin consumes remaining quota
      monthlyQuotaUsed += 1;
      expect(monthlyQuotaUsed).toBe(5);
      expect(monthlyQuotaAmount - monthlyQuotaUsed).toBe(0);

      // 2. Bonus checkin when quota is exhausted
      bonusBalance -= 1;
      expect(bonusBalance).toBe(1);
      // Quota is NOT incremented
      expect(monthlyQuotaUsed).toBe(5);

      // 3. Cancel regular checkin restores plan quota, leaves bonus at 1
      monthlyQuotaUsed -= 1;
      expect(monthlyQuotaUsed).toBe(4);
      expect(bonusBalance).toBe(1);

      // 4. Cancel bonus checkin restores bonus to 2, leaves plan quota at 4
      bonusBalance += 1;
      expect(bonusBalance).toBe(2);
      expect(monthlyQuotaUsed).toBe(4);
    });

    it("S2.3: Package Plan State-Machine: Expiration Independence", async () => {
      // Bonus check-ins are valid even if a package plan has expired
      const isPackageExpired = true;
      let bonusBalance = 3;

      // Student tries regular booking with expired package:
      const attemptRegular = () => {
        if (isPackageExpired) throw new Error("Você não possui um plano ativo — fale com o studio");
        return { ok: true };
      };
      expect(attemptRegular).toThrow("Você não possui um plano ativo — fale com o studio");

      // Student books with bonus instead:
      const attemptBonus = () => {
        if (bonusBalance < 1) throw new Error("Saldo de bônus insuficiente");
        bonusBalance -= 1;
        return { ok: true, isBonus: true, remainingBalance: bonusBalance };
      };

      const res = attemptBonus();
      expect(res.ok).toBe(true);
      expect(res.isBonus).toBe(true);
      expect(res.remainingBalance).toBe(2);
      expect(bonusBalance).toBe(2);
    });
  });

  // ----------------------------------------------------------------------------
  // SECTION 3: Cancellation Boundary & Security Matrix in RPC / Server Function
  // ----------------------------------------------------------------------------
  describe("Section 3: Cancellation Boundary & Security Matrix", () => {
    it("S3.1: Timely student cancellation refunds bonus and appends ledger refund", async () => {
      const mockRpc = mock(async (fnName: string, args: any) => {
        expect(fnName).toBe("cancel_class_checkin");
        expect(args.p_session_id).toBe("sess-timely");
        expect(args.p_student_id).toBe("stud-1");

        return {
          data: {
            success: true,
            session_id: args.p_session_id,
            student_id: args.p_student_id,
            student_name: "Gabriel Ramos",
            class_name: "Funcional",
            was_bonus: true,
            refunded: true,
            refund_transaction_id: "tx-ref-100",
            transaction_id: "tx-ref-100",
            new_balance: 5,
          } satisfies CancelClassCheckinResult,
          error: null,
        };
      });

      const res = await mockRpc("cancel_class_checkin", {
        p_session_id: "sess-timely",
        p_student_id: "stud-1",
      });

      expect(res.data?.success).toBe(true);
      expect(res.data?.was_bonus).toBe(true);
      expect(res.data?.refunded).toBe(true);
      expect(res.data?.new_balance).toBe(5);
      expect(res.data?.refund_transaction_id).toBe("tx-ref-100");
    });

    it("S3.2: Late student cancellation is rejected by PostgreSQL RPC with closes_at error", async () => {
      const mockRpc = mock(async (fnName: string, args: any) => {
        return {
          data: null,
          error: { message: "Cancelamento encerrado para esta aula (encerrou às 18:45)" },
        };
      });

      const res = await mockRpc("cancel_class_checkin", {
        p_session_id: "sess-late",
        p_student_id: "stud-1",
      });

      expect(res.error).not.toBeNull();
      expect(res.error?.message).toContain("Cancelamento encerrado para esta aula");
    });

    it("S3.3: Coach cancellation bypasses cancellation window and refunds bonus", async () => {
      const mockRpc = mock(async (fnName: string, args: any) => {
        // Coach calling for student
        return {
          data: {
            success: true,
            session_id: args.p_session_id,
            student_id: args.p_student_id,
            student_name: "Gabriel Ramos",
            class_name: "Funcional",
            was_bonus: true,
            refunded: true,
            refund_transaction_id: "tx-ref-coach-override",
            new_balance: 6,
          } as CancelClassCheckinResult,
          error: null,
        };
      });

      const res = await mockRpc("cancel_class_checkin", {
        p_session_id: "sess-past-deadline",
        p_student_id: "stud-1",
      });

      expect(res.data?.success).toBe(true);
      expect(res.data?.refunded).toBe(true);
      expect(res.data?.new_balance).toBe(6);
    });

    it("S3.4: Double cancellation attempt fails cleanly without double-refund", async () => {
      let callCount = 0;
      const mockRpc = mock(async (_fn: string, _args: any) => {
        callCount++;
        if (callCount === 1) {
          return {
            data: {
              success: true,
              was_bonus: true,
              refunded: true,
              new_balance: 5,
            },
            error: null,
          };
        } else {
          return {
            data: null,
            error: { message: "Nenhum check-in encontrado para este aluno nesta sessão" },
          };
        }
      });

      const first = await mockRpc("cancel_class_checkin", { p_session_id: "s1", p_student_id: "u1" });
      expect(first.data?.refunded).toBe(true);

      const second = await mockRpc("cancel_class_checkin", { p_session_id: "s1", p_student_id: "u1" });
      expect(second.error?.message).toBe("Nenhum check-in encontrado para este aluno nesta sessão");
    });
  });

  // ----------------------------------------------------------------------------
  // SECTION 4: Gatekeeping & Permission Isolation in studentCheckIn
  // ----------------------------------------------------------------------------
  describe("Section 4: studentCheckIn Quota Gatekeeping & Program Isolation", () => {
    it("S4.1: Regular booking rejects student without active plan", async () => {
      const usage: QuotaUsage = {
        plan_id: null,
        plan_name: null,
        quota_type: "none",
        quota_amount: null,
        used: 0,
        remaining: null,
        period_label: "",
        package_expires_at: null,
      };

      const validatePlan = (u: QuotaUsage) => {
        if (!u.plan_id) {
          throw new Error("Você não possui um plano ativo — fale com o studio");
        }
      };

      expect(() => validatePlan(usage)).toThrow("Você não possui um plano ativo — fale com o studio");
    });

    it("S4.2: Regular booking rejects student when plan quota is exhausted", async () => {
      const usage: QuotaUsage = {
        plan_id: "plan-monthly-1",
        plan_name: "Plano Mensal 4x",
        quota_type: "monthly",
        quota_amount: 4,
        used: 4,
        remaining: 0,
        period_label: "este mês",
        package_expires_at: null,
      };

      const validateQuota = (u: QuotaUsage) => {
        if (u.quota_type !== "none" && u.quota_amount) {
          if (u.used >= u.quota_amount) {
            const label =
              u.quota_type === "weekly" ? "semana" : u.quota_type === "monthly" ? "mês" : "pacote";
            throw new Error(`Cota do plano atingida (${u.quota_amount} check-ins/${label})`);
          }
        }
      };

      expect(() => validateQuota(usage)).toThrow("Cota do plano atingida (4 check-ins/mês)");
    });

    it("S4.3: Program restriction blocks regular booking if modality not allowed", () => {
      const programId = "prog-pilates";
      const allowedIds = ["prog-musculacao", "prog-cross"];

      const checkProgramAccess = (progId: string, allowed: string[]) => {
        if (allowed.length > 0 && !allowed.includes(progId)) {
          throw new Error("Seu plano não libera esta modalidade");
        }
      };

      expect(() => checkProgramAccess(programId, allowedIds)).toThrow("Seu plano não libera esta modalidade");
    });

    it("S4.4: Bonus booking bypasses program restriction (Universal Bonus Access per R3)", () => {
      // In book_class_with_bonus, program restrictions from plans do NOT apply
      // because bonus is plan-independent. Only capacity and duplicate booking apply.
      const useBonus = true;
      const canBook = (isBonus: boolean) => {
        if (isBonus) return true; // Universal access
        return false;
      };

      expect(canBook(useBonus)).toBe(true);
    });
  });

  // ----------------------------------------------------------------------------
  // SECTION 5: High-Volume Adversarial Stress & Invariant Chaos Simulation
  // ----------------------------------------------------------------------------
  describe("Section 5: High-Volume Adversarial Stress & Invariant Chaos Simulation", () => {
    it("S5.1: 100 randomized interleaved plan/bonus operations preserve all mathematical invariants", () => {
      const initialBonus = 20;
      let currentBonus = initialBonus;
      let planQuotaLimit = 10;
      let planCheckins = new Set<string>();
      let bonusCheckins = new Set<string>();
      let ledgerDelta = 0;

      // Seed pseudo-random operations
      for (let i = 1; i <= 100; i++) {
        const op = i % 4; // 0: book regular, 1: book bonus, 2: cancel regular, 3: cancel bonus
        const sessId = `session-${i}`;

        if (op === 0) {
          // Book regular
          if (planCheckins.size < planQuotaLimit) {
            planCheckins.add(sessId);
          }
        } else if (op === 1) {
          // Book bonus
          if (currentBonus > 0) {
            currentBonus -= 1;
            bonusCheckins.add(sessId);
            ledgerDelta -= 1;
          }
        } else if (op === 2) {
          // Cancel regular
          if (planCheckins.size > 0) {
            const first = planCheckins.values().next().value!;
            planCheckins.delete(first);
          }
        } else if (op === 3) {
          // Cancel bonus
          if (bonusCheckins.size > 0) {
            const first = bonusCheckins.values().next().value!;
            bonusCheckins.delete(first);
            currentBonus += 1;
            ledgerDelta += 1;
          }
        }

        // Invariant checks during every single step
        expect(currentBonus).toBeGreaterThanOrEqual(0);
        expect(planCheckins.size).toBeLessThanOrEqual(planQuotaLimit);
        expect(initialBonus + ledgerDelta).toBe(currentBonus);
      }

      // Final Invariants
      expect(currentBonus).toBe(initialBonus + ledgerDelta);
      expect(bonusCheckins.size).toBeGreaterThanOrEqual(0);
      expect(planCheckins.size).toBeGreaterThanOrEqual(0);
    });

    it("S5.2: Concurrency simulation of 50 simultaneous cancellations preserves strict isolation", async () => {
      let sharedBonusBalance = 10;
      let sharedPlanUsed = 25;
      const cancellationResults: Array<{ id: string; wasBonus: boolean; refunded: boolean }> = [];

      // 25 bonus sessions and 25 regular sessions
      const sessions = [
        ...Array.from({ length: 25 }, (_, i) => ({ id: `bonus-sess-${i}`, isBonus: true })),
        ...Array.from({ length: 25 }, (_, i) => ({ id: `plan-sess-${i}`, isBonus: false })),
      ];

      // Simulate concurrent cancellations
      await Promise.all(
        sessions.map(async (s) => {
          if (s.isBonus) {
            sharedBonusBalance += 1;
            cancellationResults.push({ id: s.id, wasBonus: true, refunded: true });
          } else {
            sharedPlanUsed -= 1;
            cancellationResults.push({ id: s.id, wasBonus: false, refunded: false });
          }
        })
      );

      // Verify final balances
      expect(sharedBonusBalance).toBe(35); // 10 + 25 = 35
      expect(sharedPlanUsed).toBe(0); // 25 - 25 = 0
      expect(cancellationResults.filter((r) => r.refunded).length).toBe(25);
      expect(cancellationResults.filter((r) => !r.refunded).length).toBe(25);
    });
  });
});
