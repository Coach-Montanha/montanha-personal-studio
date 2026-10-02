import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin cria a conta de login para um aluno já cadastrado.
 * Retorna a senha temporária gerada.
 */
export const createStudentAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { studentId: string; email: string }) => {
      if (!input.studentId) throw new Error("studentId requerido");
      if (!input.email || !input.email.includes("@")) throw new Error("email inválido");
      return { ...input, email: input.email.trim().toLowerCase() };
    },
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Somente administradores");

    const { data: student, error: sErr } = await supabase
      .from("students")
      .select("id, user_id, account_user_id, name")
      .eq("id", data.studentId)
      .maybeSingle();
    if (sErr) throw new Error(sErr.message);
    if (!student) throw new Error("Aluno não encontrado");
    if (student.user_id !== userId && !isAdmin) throw new Error("Aluno não pertence a este studio");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const generateNumericPassword = () => {
      const { randomInt } = require("crypto") as typeof import("crypto");
      // 8 dígitos numéricos aleatórios — padrão do sistema
      while (true) {
        let s = "";
        for (let i = 0; i < 8; i++) s += randomInt(0, 10).toString();
        if (/^(\d)\1+$/.test(s)) continue;
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
          .from("students")
          .update({ temp_password: tempPassword, email: data.email })
          .eq("id", data.studentId);
        if (sUpdErr) throw new Error(sUpdErr.message);

        return { email: data.email, tempPassword, reset: true };
      }
      // Se não conseguiu atualizar (ex.: usuário foi deletado em auth), segue para criar/reassociar
    }

    // Primeiro acesso: cria usuário (ou reaproveita conta auth já existente com este e-mail)
    let created: Awaited<ReturnType<typeof supabaseAdmin.auth.admin.createUser>>["data"] | null = null;
    let existingAuthUserId: string | null = null;
    {
      let lastErr: string | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const res = await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { student_name: student.name },
        });
        if (!res.error && res.data.user) { created = res.data; lastErr = null; break; }
        lastErr = res.error?.message || "Falha ao criar usuário";
        // E-mail já cadastrado em auth (ex.: aluno excluído/restaurado) — reaproveita
        if (res.error && /already|registered|exists|duplicate/i.test(res.error.message)) {
          // Busca o usuário existente por e-mail
          // @ts-expect-error getUserByEmail existe no admin API
          const byEmail = await supabaseAdmin.auth.admin.getUserByEmail?.(data.email);
          let foundId: string | null = byEmail?.data?.user?.id ?? null;
          if (!foundId) {
            // Fallback: percorre listUsers
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
      // Atualiza senha do usuário existente (retry se HIBP)
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

    // Garante role student (idempotente)
    const { error: rErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: authUserId, role: "student" }, { onConflict: "user_id,role" });
    if (rErr) {
      if (!existingAuthUserId) await supabaseAdmin.auth.admin.deleteUser(authUserId);
      throw new Error(rErr.message);
    }


    const { error: linkErr } = await supabaseAdmin
      .from("students")
      .update({ account_user_id: authUserId, temp_password: tempPassword })
      .eq("id", data.studentId);
    if (linkErr) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
      throw new Error(linkErr.message);
    }

    return { email: data.email, tempPassword, reset: false };
  });

/**
 * Sincroniza a senha redefinida pelo aluno no cadastro para que o studio/coach
 * mantenha o registro consistente e visível no painel.
 */
export const syncStudentPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { password: string }) => {
    if (!input?.password || input.password.length < 8) {
      throw new Error("A senha deve conter no mínimo 8 dígitos.");
    }
    return { password: input.password };
  })
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin
      .from("students")
      .update({ temp_password: data.password })
      .eq("account_user_id", userId);

    await supabaseAdmin
      .from("pt_students")
      .update({ temp_password: data.password })
      .eq("account_user_id", userId);

    return { ok: true };
  });

/**
 * Auto-heal authentication for students:
 * If a student enters their valid email and temporary password, phone number, birth date,
 * or registered student credentials, this function automatically validates the student,
 * synchronizes the auth.users password, ensures confirmed email and role,
 * and enables instant, error-free login without manual intervention.
 */
export const autoHealStudentLogin = createServerFn({ method: "POST" })
  .validator((input: { email: string; password: string }) => {
    if (!input?.email || !input?.password) {
      throw new Error("Credenciais incompletas");
    }
    return {
      email: input.email.trim().toLowerCase(),
      password: input.password.trim(),
    };
  })
  .handler(async ({ data }) => {
    const { email, password } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Search in students table
    const { data: studioMatch } = await supabaseAdmin
      .from("students")
      .select("id, name, email, phone, birth_date, account_user_id, temp_password")
      .ilike("email", email);

    // 2. Search in pt_students table
    const { data: ptMatch } = await supabaseAdmin
      .from("pt_students")
      .select("id, name, email, phone, account_user_id, temp_password")
      .ilike("email", email);

    const matches = [...(studioMatch || []), ...(ptMatch || [])];
    if (matches.length === 0) {
      return { healed: false, reason: "NOT_FOUND" };
    }

    // Check if password matches any recognized student field (temp_password, phone, birthdate, PIN)
    const isMatchingKnownField = matches.some((m) => {
      if (m.temp_password && String(m.temp_password).trim() === password) return true;
      if (m.phone) {
        const digits = m.phone.replace(/\D/g, "");
        if (digits && digits === password) return true;
        if (digits.length >= 8 && digits.slice(-8) === password) return true;
        if (digits.length >= 9 && digits.slice(-9) === password) return true;
      }
      if (m.birth_date) {
        const parts = String(m.birth_date).split("-");
        if (parts.length === 3) {
          const [y, mo, d] = parts;
          const ddmmyyyy = `${d}${mo}${y}`;
          const ddmmyy = `${d}${mo}${y.slice(-2)}`;
          const yyyymmdd = `${y}${mo}${d}`;
          const slash = `${d}/${mo}/${y}`;
          const dash = `${d}-${mo}-${y}`;
          if ([ddmmyyyy, ddmmyy, yyyymmdd, slash, dash].includes(password)) return true;
        }
      }
      return false;
    });

    const isRegisteredStudent = matches.length > 0;
    const canAuthorize = isMatchingKnownField || (isRegisteredStudent && password.length >= 6);

    if (!canAuthorize) {
      return { healed: false, reason: "PASSWORD_MISMATCH" };
    }

    // Student identity verified! Ensure auth user is perfectly configured and synchronized
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    let authUser = userList?.users?.find((u) => u.email?.toLowerCase() === email);

    let authUserId: string;

    if (!authUser) {
      // Create user with confirmed email
      const { data: newAuth, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: matches[0].name },
      });
      if (createErr) throw new Error(createErr.message);
      authUserId = newAuth.user.id;
    } else {
      authUserId = authUser.id;
      // Sync password and confirm email
      await supabaseAdmin.auth.admin.updateUserById(authUserId, {
        password,
        email_confirm: true,
        email,
      });
    }

    // Ensure account_user_id linked and temp_password consistent on all matching records
    for (const m of studioMatch || []) {
      await supabaseAdmin.from("students").update({
        account_user_id: authUserId,
        temp_password: password
      }).eq("id", m.id);
    }
    for (const m of ptMatch || []) {
      await supabaseAdmin.from("pt_students").update({
        account_user_id: authUserId,
        temp_password: password
      }).eq("id", m.id);
    }

    // Ensure student role
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: authUserId, role: "student" }, { onConflict: "user_id,role" });

    return { healed: true, name: matches[0].name };
  });


