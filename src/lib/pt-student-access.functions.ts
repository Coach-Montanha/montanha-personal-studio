import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin cria (ou redefine) a conta de login para um aluno de Personal Trainer.
 * Retorna a senha temporária gerada.
 */
export const createPTStudentAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { studentId: string; email: string }) => {
    if (!input.studentId) throw new Error("studentId requerido");
    if (!input.email || !input.email.includes("@")) throw new Error("email inválido");
    return { ...input, email: input.email.trim().toLowerCase() };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Somente administradores");

    const { data: student, error: sErr } = await supabase
      .from("pt_students")
      .select("id, user_id, account_user_id, name")
      .eq("id", data.studentId)
      .maybeSingle();
    if (sErr) throw new Error(sErr.message);
    if (!student) throw new Error("Aluno não encontrado");
    if (student.user_id !== userId && !isAdmin) throw new Error("Aluno não pertence a este trainer");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const generateNumericPassword = () => {
      const { randomInt } = require("crypto") as typeof import("crypto");
      // 8 dígitos numéricos aleatórios — padrão do sistema
      while (true) {
        let s = "";
        for (let i = 0; i < 8; i++) s += randomInt(0, 10).toString();
        if (/^(\d)\1+$/.test(s)) continue; // todos iguais
        if (s === "01234567" || s === "12345678" || s === "87654321") continue;
        return s;
      }
    };

    const isWeak = (msg: string) =>
      /weak|pwned|known|easy to guess/i.test(msg);

    let tempPassword = generateNumericPassword();

    // Redefinição: aluno já tem conta — tenta atualizar a senha
    if (student.account_user_id) {
      let lastErr: string | null = null;
      let userUpdated = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        const { error: uErr } = await supabaseAdmin.auth.admin.updateUserById(
          student.account_user_id,
          { password: tempPassword, email: data.email, email_confirm: true },
        );
        if (!uErr) { lastErr = null; userUpdated = true; break; }
        lastErr = uErr.message;
        if (!isWeak(uErr.message)) break;
        tempPassword = generateNumericPassword();
      }

      if (userUpdated) {
        await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: student.account_user_id, role: "student" }, { onConflict: "user_id,role" });

        const { error: sUpdErr } = await supabaseAdmin
          .from("pt_students")
          .update({ temp_password: tempPassword, email: data.email })
          .eq("id", data.studentId);
        if (sUpdErr) throw new Error(sUpdErr.message);

        return { email: data.email, tempPassword, reset: true };
      }
    }

    let created: Awaited<ReturnType<typeof supabaseAdmin.auth.admin.createUser>>["data"] | null = null;
    let existingAuthUserId: string | null = null;
    {
      let lastErr: string | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const res = await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { student_name: student.name, kind: "pt" },
        });
        if (!res.error && res.data.user) { created = res.data; lastErr = null; break; }
        lastErr = res.error?.message || "Falha ao criar usuário";

        if (res.error && /already|registered|exists|duplicate/i.test(res.error.message)) {
          // @ts-expect-error getUserByEmail exists on admin API
          const byEmail = await supabaseAdmin.auth.admin.getUserByEmail?.(data.email);
          let foundId: string | null = byEmail?.data?.user?.id ?? null;
          if (!foundId) {
            for (let page = 1; page <= 20 && !foundId; page++) {
              const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
              const u = list?.users.find((x) => x.email?.toLowerCase() === data.email.toLowerCase());
              if (u) foundId = u.id;
              if (!list || list.users.length < 200) break;
            }
          }
          if (!foundId) throw new Error(lastErr);
          existingAuthUserId = foundId;
          lastErr = null;
          break;
        }

        if (!res.error || !isWeak(res.error.message)) throw new Error(lastErr);
        tempPassword = generateNumericPassword();
      }
      if (!created && !existingAuthUserId) throw new Error(lastErr || "Falha ao criar usuário");
    }

    const authUserId = existingAuthUserId ?? created!.user!.id;

    if (existingAuthUserId) {
      let lastErr: string | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const { error: uErr } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
          password: tempPassword,
          email: data.email,
          email_confirm: true,
        });
        if (!uErr) { lastErr = null; break; }
        lastErr = uErr.message;
        if (!isWeak(uErr.message)) throw new Error(uErr.message);
        tempPassword = generateNumericPassword();
      }
      if (lastErr) throw new Error(lastErr);
    }

    const { error: rErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: authUserId, role: "student" }, { onConflict: "user_id,role" });
    if (rErr) {
      if (!existingAuthUserId) await supabaseAdmin.auth.admin.deleteUser(authUserId);
      throw new Error(rErr.message);
    }

    const { error: linkErr } = await supabaseAdmin
      .from("pt_students")
      .update({ account_user_id: authUserId, temp_password: tempPassword, email: data.email })
      .eq("id", data.studentId);
    if (linkErr) {
      if (!existingAuthUserId) await supabaseAdmin.auth.admin.deleteUser(authUserId);
      throw new Error(linkErr.message);
    }

    return { email: data.email, tempPassword, reset: false };
  });
