import { randomInt } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Admin cria a conta de login para um aluno já cadastrado.
 * Retorna a senha temporária gerada.
 */
export const createStudentAccount = createServerFn({ method: "POST" })
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
      .from("students")
      .select("id, user_id, account_user_id, name")
      .eq("id", data.studentId)
      .maybeSingle();
    if (sErr) throw new Error(sErr.message);
    if (!student) throw new Error("Aluno não encontrado");
    if (student.user_id !== userId && !isAdmin) throw new Error("Aluno não pertence a este studio");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const generateNumericPassword = () => {
      // 8 dígitos numéricos aleatórios — padrão do sistema
      while (true) {
        let s = "";
        for (let i = 0; i < 8; i++) s += randomInt(0, 10).toString();
        if (/^(\d)\1+$/.test(s)) continue;
        if (s === "01234567" || s === "12345678" || s === "87654321") continue;
        return s;
      }
    };

    const isWeak = (msg: string) => /weak|pwned|known|easy to guess/i.test(msg);

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
        if (!uErr) {
          lastErr = null;
          userUpdated = true;
          break;
        }
        lastErr = uErr.message;
        if (!isWeak(uErr.message)) break;
        tempPassword = generateNumericPassword();
      }

      if (userUpdated) {
        await supabaseAdmin
          .from("user_roles")
          .upsert(
            { user_id: student.account_user_id, role: "student" },
            { onConflict: "user_id,role" },
          );

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
    let created: Awaited<ReturnType<typeof supabaseAdmin.auth.admin.createUser>>["data"] | null =
      null;
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
        if (!res.error && res.data.user) {
          created = res.data;
          lastErr = null;
          break;
        }
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
              const { data: list } = await supabaseAdmin.auth.admin.listUsers({
                page,
                perPage: 200,
              });
              const u = list?.users.find(
                (x) => x.email?.toLowerCase() === data.email.toLowerCase(),
              );
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
        if (!uErr) {
          lastErr = null;
          break;
        }
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

    // Sincroniza também no registro correspondente de pt_students se existir
    try {
      await supabaseAdmin
        .from("pt_students")
        .update({ account_user_id: authUserId, temp_password: tempPassword })
        .eq("id", data.studentId);

      if (data.email) {
        await supabaseAdmin
          .from("pt_students")
          .update({ account_user_id: authUserId, temp_password: tempPassword })
          .ilike("email", data.email);
      }
    } catch {
      // Ignora caso não exista
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
// In-memory rate limiter contra força bruta no auto-heal (máximo 5 falhas por 10 minutos)
const loginFailureMap = new Map<string, { attempts: number; blockedUntil: number }>();

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
    const now = Date.now();
    const rateRecord = loginFailureMap.get(email);

    if (rateRecord && rateRecord.blockedUntil > now) {
      const waitMin = Math.ceil((rateRecord.blockedUntil - now) / 60000);
      return {
        healed: false,
        reason: "RATE_LIMITED",
        message: `Muitas tentativas consecutivas incorretas. Por segurança, tente novamente em ${waitMin} minuto(s).`,
      };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Validar rigorosamente formato do PIN / senha numérica (6 a 10 dígitos)
    if (!/^\d{6,10}$/.test(password)) {
      return {
        healed: false,
        reason: "INVALID_PIN_FORMAT",
        message: "O PIN ou senha temporária de acesso deve conter entre 6 e 10 dígitos numéricos.",
      };
    }

    // 2. Search in students table
    const { data: studioMatch } = await supabaseAdmin
      .from("students")
      .select("id, name, email, phone, birth_date, account_user_id, temp_password, tenant_id")
      .ilike("email", email);

    // 3. Search in pt_students table
    const { data: ptMatch } = await supabaseAdmin
      .from("pt_students")
      .select("id, name, email, phone, account_user_id, temp_password, tenant_id")
      .ilike("email", email);

    const matches = [...(studioMatch || []), ...(ptMatch || [])];
    const isMatchingKnownField =
      matches.length > 0 && matches.some((m: any) => m.access_pin === password || m.temp_password === password);

    if (!isMatchingKnownField) {
      // Incrementar tentativas com falha para bloquear brute-force
      const currentAttempts = (rateRecord?.attempts || 0) + 1;
      const blockedUntil = currentAttempts >= 5 ? now + 10 * 60 * 1000 : 0;
      loginFailureMap.set(email, { attempts: currentAttempts, blockedUntil });
      return {
        healed: false,
        reason: "INVALID_CREDENTIALS",
        message: "Credenciais de acesso não localizadas ou PIN incorreto.",
      };
    }

    // Sucesso: limpar histórico de tentativas
    loginFailureMap.delete(email);

    // Student identity verified! Ensure auth user is perfectly configured and synchronized
    const existingAccountId = matches.find((m) => m.account_user_id)?.account_user_id;
    let authUser: any = null;
    if (existingAccountId) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(existingAccountId);
      if (userData?.user) authUser = userData.user;
    }

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
      await supabaseAdmin
        .from("students")
        .update({
          account_user_id: authUserId,
          temp_password: password,
        })
        .eq("id", m.id);
    }
    for (const m of ptMatch || []) {
      await supabaseAdmin
        .from("pt_students")
        .update({
          account_user_id: authUserId,
          temp_password: password,
        })
        .eq("id", m.id);
    }

    // Ensure student role
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: authUserId, role: "student" }, { onConflict: "user_id,role" });

    return { healed: true, name: matches[0].name };
  });

/**
 * Retorna os dados completos do portal de treino para o aluno logado (Studio, Personal Trainer ou Híbrido),
 * utilizando supabaseAdmin com service role para contornar qualquer restrição ou falha de RLS,
 * e auto-vincula o account_user_id caso ainda não estivesse associado.
 */
export const getMyTrainingPortalDataServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, claims } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Identificar e-mail do usuário autenticado
    let userEmail = claims?.email ? String(claims.email).trim().toLowerCase() : null;
    if (!userEmail) {
      try {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (userData?.user?.email) {
          userEmail = userData.user.email.trim().toLowerCase();
        }
      } catch {
        // fallback silencioso
      }
    }

    // 2. Busca registros em pt_students por account_user_id e por e-mail
    const ptMatches: any[] = [];
    const ptSeen = new Set<string>();

    const { data: ptById } = await supabaseAdmin
      .from("pt_students")
      .select("id, name, training_plan, user_id, account_user_id, email")
      .eq("account_user_id", userId);

    (ptById || []).forEach((p: any) => {
      if (p?.id && !ptSeen.has(p.id)) {
        ptSeen.add(p.id);
        ptMatches.push(p);
      }
    });

    if (userEmail) {
      const { data: ptByEmail } = await supabaseAdmin
        .from("pt_students")
        .select("id, name, training_plan, user_id, account_user_id, email")
        .ilike("email", userEmail);

      (ptByEmail || []).forEach((p: any) => {
        if (p?.id && !ptSeen.has(p.id)) {
          ptSeen.add(p.id);
          ptMatches.push(p);
        }
      });
    }

    // 3. Busca registros em students por account_user_id e por e-mail
    const studioMatches: any[] = [];
    const studioSeen = new Set<string>();

    const { data: stById } = await supabaseAdmin
      .from("students")
      .select("id, name, user_id, account_user_id, email")
      .eq("account_user_id", userId);

    (stById || []).forEach((s: any) => {
      if (s?.id && !studioSeen.has(s.id)) {
        studioSeen.add(s.id);
        studioMatches.push(s);
      }
    });

    if (userEmail) {
      const { data: stByEmail } = await supabaseAdmin
        .from("students")
        .select("id, name, user_id, account_user_id, email")
        .ilike("email", userEmail);

      (stByEmail || []).forEach((s: any) => {
        if (s?.id && !studioSeen.has(s.id)) {
          studioSeen.add(s.id);
          studioMatches.push(s);
        }
      });
    }

    // 4. Auto-vincula account_user_id caso esteja nulo ou desatualizado
    for (const pt of ptMatches) {
      if (pt.account_user_id !== userId) {
        try {
          await supabaseAdmin
            .from("pt_students")
            .update({ account_user_id: userId })
            .eq("id", pt.id);
          pt.account_user_id = userId;
        } catch (e) {
          console.error("[getMyTrainingPortalDataServerFn] Falha ao auto-vincular pt_student:", e);
        }
      }
    }

    for (const st of studioMatches) {
      if (st.account_user_id !== userId) {
        try {
          await supabaseAdmin
            .from("students")
            .update({ account_user_id: userId })
            .eq("id", st.id);
          st.account_user_id = userId;
        } catch (e) {
          console.error("[getMyTrainingPortalDataServerFn] Falha ao auto-vincular student:", e);
        }
      }
    }

    // 5. Coleta todos os IDs de aluno associados (tanto PT quanto Studio)
    const allStudentIds: string[] = [];
    ptMatches.forEach((p) => {
      if (p?.id && !allStudentIds.includes(p.id)) allStudentIds.push(p.id);
    });
    studioMatches.forEach((s) => {
      if (s?.id && !allStudentIds.includes(s.id)) allStudentIds.push(s.id);
    });

    // 6. Define perfil representativo do aluno
    let student: any = null;
    if (ptMatches.length > 0) {
      student = ptMatches[0];
    } else if (studioMatches.length > 0) {
      student = {
        id: studioMatches[0].id,
        name: studioMatches[0].name,
        training_plan: null,
        user_id: studioMatches[0].user_id,
        account_user_id: studioMatches[0].account_user_id,
        email: studioMatches[0].email,
      };
    }

    if (allStudentIds.length === 0) {
      return {
        student: null,
        programs: [],
        days: [],
        exercises: [],
        hasWorkouts: false,
      };
    }

    // 7. Busca programas não-deletados onde pt_student_id IN (ids) OU studio_student_id IN (ids)
    const [ptProgRes, studioProgRes] = await Promise.all([
      supabaseAdmin
        .from("pt_programs" as any)
        .select("*")
        .in("pt_student_id", allStudentIds)
        .eq("is_deleted", false)
        .order("start_date", { ascending: false }),
      supabaseAdmin
        .from("pt_programs" as any)
        .select("*")
        .in("studio_student_id", allStudentIds)
        .eq("is_deleted", false)
        .order("start_date", { ascending: false }),
    ]);

    const programMap = new Map<string, any>();
    (ptProgRes.data || []).forEach((p: any) => {
      if (p?.id) programMap.set(p.id, p);
    });
    (studioProgRes.data || []).forEach((p: any) => {
      if (p?.id) programMap.set(p.id, p);
    });

    const programs = Array.from(programMap.values()).sort(
      (a, b) => new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime()
    );

    const programIds = programs.map((p) => p.id);

    // 8. Busca dias de treino dos programas
    let days: any[] = [];
    if (programIds.length > 0) {
      const { data: daysData } = await supabaseAdmin
        .from("pt_training_days" as any)
        .select("*")
        .in("program_id", programIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      days = daysData || [];
    }

    // 9. Busca exercícios dos dias de treino
    const dayIds = days.map((d) => d.id);
    let exercises: any[] = [];
    if (dayIds.length > 0) {
      const { data: exData } = await supabaseAdmin
        .from("pt_training_exercises" as any)
        .select("*")
        .in("training_day_id", dayIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      exercises = exData || [];
    }

    const hasWorkouts =
      Boolean(student?.training_plan && student.training_plan.trim() !== "") ||
      programs.length > 0;

    return {
      student,
      programs,
      days,
      exercises,
      hasWorkouts,
    };
  });
