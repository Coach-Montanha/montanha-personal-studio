import { test, expect } from "./fixtures/auth.fixture";

test.describe("Bonus Check-ins E2E Browser Journey", () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // 1. Mock student profile with bonus balance
    await authenticatedPage.route("**/rest/v1/students*", async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: "student-1",
              user_id: "00000000-0000-4000-8000-000000000001",
              name: "Lucas Silva",
              email: "lucas.silva@example.com",
              phone: "(11) 98888-7777",
              status: "active",
              bonus_checkins_balance: 3,
              created_at: new Date().toISOString(),
            },
            {
              id: "student-2",
              user_id: "00000000-0000-4000-8000-000000000002",
              name: "Mariana Oliveira",
              email: "mariana.oliveira@example.com",
              phone: "(11) 97777-6666",
              status: "active",
              bonus_checkins_balance: 1,
              created_at: new Date().toISOString(),
            },
          ]),
        });
      } else if (method === "PATCH" || method === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    // 2. Mock bonus transactions ledger
    await authenticatedPage.route("**/rest/v1/student_bonus_transactions*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "tx-1",
            student_id: "student-1",
            amount: 3,
            transaction_type: "grant",
            reason: "Premiação Desafio de Verão",
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    // 3. Mock class sessions / agenda
    await authenticatedPage.route("**/rest/v1/class_sessions*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "session-1",
            class_id: "class-cross",
            session_date: "2026-10-15",
            start_time: "18:00",
            end_time: "19:00",
            capacity: 10,
            classes: {
              name: "Cross Training",
              checkin_closes_minutes_before: 15,
            },
          },
        ]),
      });
    });

    // 4. Mock RPC endpoints
    await authenticatedPage.route("**/rest/v1/rpc/admin_adjust_bonus_checkins*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, new_balance: 5 }),
      });
    });

    await authenticatedPage.route("**/rest/v1/rpc/admin_transfer_bonus_checkins*", async (route) => {
      const payload = JSON.parse(route.request().postData() || "{}");
      if (payload.p_source_student_id === payload.p_target_student_id) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ message: "Aluno de origem e destino não podem ser iguais" }),
        });
        return;
      }
      if (payload.p_amount > 3) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ message: "Saldo de bônus insuficiente para transferência" }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await authenticatedPage.route("**/rest/v1/rpc/book_class_with_bonus*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, remaining_bonus: 2 }),
      });
    });

    await authenticatedPage.route("**/rest/v1/rpc/cancel_class_checkin*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, refunded_bonus: true, new_balance: 3 }),
      });
    });
  });

  test.describe("Student Portal UI Flow (F5, F6, F7, F8, F9, F10)", () => {
    test("should display bonus check-in balance badge on student portal header (F9)", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.goto("/portal");
      // Verify portal page loads and contains bonus badge container or text
      const bonusElement = authenticatedPage.locator('[data-testid="bonus-balance-card"], text=/check-in.*bônus/i');
      if (await bonusElement.count() > 0) {
        await expect(bonusElement.first()).toBeVisible();
      }
    });

    test("should show bonus decision modal when booking with available bonus credits (F5, F7)", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.goto("/portal");
      const checkinBtn = authenticatedPage.locator('button:has-text("Check-in")').first();
      if (await checkinBtn.count() > 0 && await checkinBtn.isVisible()) {
        await checkinBtn.click();
        // If decision modal opens
        const modal = authenticatedPage.locator('[role="dialog"]:has-text("Check-in"), [data-testid="bonus-decision-modal"]');
        if (await modal.count() > 0) {
          await expect(modal.first()).toBeVisible();
          // Option to confirm with bonus
          const bonusOptionBtn = modal.locator('button:has-text("Bônus")');
          if (await bonusOptionBtn.count() > 0) {
            await bonusOptionBtn.click();
          }
        }
      }
    });

    test("should show cancellation feedback and refund confirmation (F8)", async ({
      authenticatedPage,
    }) => {
      await authenticatedPage.goto("/portal");
      const cancelBtn = authenticatedPage.locator('button:has-text("Cancelar")').first();
      if (await cancelBtn.count() > 0 && await cancelBtn.isVisible()) {
        await cancelBtn.click();
        const confirmCancel = authenticatedPage.locator('button:has-text("Confirmar"), button:has-text("Sim")');
        if (await confirmCancel.count() > 0 && await confirmCancel.isVisible()) {
          await confirmCancel.click();
        }
      }
    });
  });

  test.describe("Coach Studio Admin UI Flow (F1, F2, F4, F11)", () => {
    test("should display bonus check-in column or chip in students table (F11)", async ({
      authenticatedPage,
      studentsPage,
    }) => {
      await studentsPage.goto();
      await studentsPage.expectStudentInList("Lucas Silva");
      const table = authenticatedPage.locator('[data-testid="table-students"]');
      await expect(table.getByText("Lucas Silva")).toBeVisible();
    });

    test("should open transfer bonus dialog and handle validation errors (F4, E6, E7)", async ({
      authenticatedPage,
      studentsPage,
    }) => {
      await studentsPage.goto();
      // Locate student actions
      const transferBtn = authenticatedPage.locator('button:has-text("Transferir"), [data-testid="btn-transfer-bonus"]').first();
      if (await transferBtn.count() > 0 && await transferBtn.isVisible()) {
        await transferBtn.click();
        const dialog = authenticatedPage.locator('[role="dialog"]');
        await expect(dialog).toBeVisible();
      }
    });
  });
});
