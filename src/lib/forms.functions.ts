import { createServerFn } from "@tanstack/react-start";
import { DEFAULT_STUDIO_FORMS, StudioFormItem } from "@/lib/forms-definitions";

export const getFormBySlugServerFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Checa nos defaults primeiro
    const normalized = (slug || "").toLowerCase().trim();
    const defaultMatch = DEFAULT_STUDIO_FORMS.find(
      (f) => f.slug.toLowerCase() === normalized || f.id.toLowerCase() === normalized
    );

    // 2. Busca customizações no Supabase
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalized);
      
      let query = supabaseAdmin
        .from("pt_notifications")
        .select("id, user_id, title, metadata, created_at")
        .eq("type", "custom_form_definition");

      if (isUuid) {
        query = query.or(`id.eq.${normalized},metadata->>slug.eq.${normalized}`);
      } else {
        query = query.filter("metadata->>slug", "eq", normalized);
      }

      const { data: dbForm } = await query.maybeSingle();

      if (dbForm) {
        const meta = dbForm.metadata as any;
        return {
          id: dbForm.id,
          slug: meta.slug || normalized,
          title: meta.title || dbForm.title,
          category: meta.category || defaultMatch?.category || "geral",
          description: meta.description || defaultMatch?.description || "",
          badge: meta.badge || defaultMatch?.badge || "Oficial",
          estimatedMinutes: meta.estimatedMinutes || defaultMatch?.estimatedMinutes || 3,
          visibleToStudents: meta.visibleToStudents ?? true,
          isPublicLead: meta.isPublicLead ?? true,
          fields: meta.fields && meta.fields.length > 0 ? meta.fields : defaultMatch?.fields || [],
          googleFormUrl: meta.googleFormUrl || defaultMatch?.googleFormUrl || "",
          userId: dbForm.user_id,
        } as StudioFormItem;
      }
    } catch (err: any) {
      console.warn("[getFormBySlugServerFn] Aviso ao buscar no banco:", err?.message);
    }

    return defaultMatch || null;
  });

export const listFormsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const formsMap = new Map<string, StudioFormItem>();
  for (const def of DEFAULT_STUDIO_FORMS) {
    formsMap.set(def.slug.toLowerCase(), def);
  }

  try {
    const { data: dbForms } = await supabaseAdmin
      .from("pt_notifications")
      .select("id, user_id, title, metadata, created_at")
      .eq("type", "custom_form_definition");

    for (const row of dbForms || []) {
      const meta = (row.metadata as any) || {};
      const slug = (meta.slug || row.id).toLowerCase();
      formsMap.set(slug, {
        id: row.id,
        slug,
        title: meta.title || row.title,
        category: meta.category || "geral",
        description: meta.description || "",
        badge: meta.badge || "Oficial",
        estimatedMinutes: meta.estimatedMinutes || 3,
        visibleToStudents: meta.visibleToStudents ?? true,
        isPublicLead: meta.isPublicLead ?? true,
        fields: meta.fields || [],
        googleFormUrl: meta.googleFormUrl || "",
        userId: row.user_id,
      });
    }
  } catch (err: any) {
    console.warn("[listFormsServerFn] Erro ao listar do banco:", err?.message);
  }

  return Array.from(formsMap.values());
});

export const submitFormServerFn = createServerFn({ method: "POST" })
  .validator(
    (input: {
      formSlug: string;
      formTitle: string;
      respondentName: string;
      respondentContact: string;
      answers: Record<string, any>;
    }) => input
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Resolve o treinador/gestor dono do formulário
    let targetUserId: string | null = null;
    try {
      const normalized = (data.formSlug || "").toLowerCase().trim();
      const { data: formDef } = await supabaseAdmin
        .from("pt_notifications")
        .select("user_id")
        .eq("type", "custom_form_definition")
        .filter("metadata->>slug", "eq", normalized)
        .maybeSingle();

      if (formDef?.user_id) {
        targetUserId = formDef.user_id;
      }
    } catch {}

    // Fallback: se formulário default ou anônimo, associa ao treinador administrador principal
    if (!targetUserId) {
      try {
        const { data: adminUser } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        targetUserId = adminUser?.id || "b75fc258-7809-4861-b52f-55877117cc92";
      } catch {
        targetUserId = "b75fc258-7809-4861-b52f-55877117cc92";
      }
    }

    const { error } = await supabaseAdmin.from("pt_notifications" as any).insert({
      user_id: targetUserId,
      title: `📋 Novo Envio: ${data.formTitle} (${data.respondentName})`,
      message: `${data.respondentName} (${data.respondentContact || "Sem contato"}) preencheu o formulário "${data.formTitle}".`,
      type: "form_submission",
      metadata: {
        form_slug: data.formSlug,
        form_title: data.formTitle,
        respondent_name: data.respondentName,
        respondent_contact: data.respondentContact,
        answers: data.answers,
        submitted_at: new Date().toISOString(),
      },
    });

    if (error) {
      throw new Error(`Erro ao registrar resposta: ${error.message}`);
    }

    return { ok: true, message: "Resposta gravada com sucesso!" };
  });

async function parseGoogleFormQuestions(url: string) {
  try {
    if (!url || !url.includes("docs.google.com/forms")) return null;
    const https = await import("https");

    const fetchHtml = (target: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        https.get(target, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return resolve(fetchHtml(res.headers.location));
          }
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(data));
        }).on("error", reject);
      });
    };

    const html = await fetchHtml(url);
    const match = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(\[[\s\S]*?\]);<\/script>/);
    if (!match) return null;

    const raw = JSON.parse(match[1]);
    const title = raw[1]?.[8] || raw[8] || "";
    const description = raw[1]?.[0] || "";
    const questionsRaw = raw[1]?.[1] || [];

    const fields = [];
    for (const q of questionsRaw) {
      const id = q[0];
      const qTitle = q[1];
      const qDesc = q[2];
      const typeCode = q[3];
      const sub = q[4]?.[0] || [];
      const rawChoices = sub[1];
      const required = sub[2] === 1;

      let type: any = "text";
      let options = undefined;

      if (typeCode === 0) {
        if (/email|e-mail/i.test(qTitle)) type = "email";
        else if (/telefone|whatsapp|celular/i.test(qTitle)) type = "tel";
        else type = "text";
      } else if (typeCode === 1) {
        type = "textarea";
      } else if (typeCode === 2) {
        type = "radio";
        if (Array.isArray(rawChoices)) {
          options = rawChoices.map((c: any) => c[0]).filter(Boolean);
        }
      } else if (typeCode === 4) {
        type = "checkbox";
        if (Array.isArray(rawChoices)) {
          options = rawChoices.map((c: any) => c[0]).filter(Boolean);
        }
      } else if (typeCode === 5) {
        type = "scale";
      } else if (typeCode === 9) {
        type = "text";
      }

      fields.push({
        id: "f_" + id,
        label: qTitle,
        type,
        required: !!required,
        placeholder: qDesc || "",
        options: options && options.length > 0 ? options : undefined,
      });
    }

    return { title, description, fields };
  } catch (err: any) {
    console.warn("[parseGoogleFormQuestions] Falha ao extrair perguntas:", err?.message);
    return null;
  }
}

export const saveFormServerFn = createServerFn({ method: "POST" })
  .validator((input: any) => input)
  .handler(async ({ data: form }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const slug = (form.slug || form.title || "formulario")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/^-+|-+$/g, "");

    let resolvedFields = form.fields || [];
    let resolvedTitle = form.title;
    let resolvedDesc = form.description || "";

    // Se o usuário forneceu uma URL do Google Forms e não há campos ou a URL foi alterada
    if (form.googleFormUrl && (!resolvedFields.length || form.googleFormUrl.includes("docs.google.com/forms"))) {
      const parsed = await parseGoogleFormQuestions(form.googleFormUrl);
      if (parsed && parsed.fields.length > 0) {
        resolvedFields = parsed.fields;
        if (!resolvedDesc && parsed.description) resolvedDesc = parsed.description;
        if (!resolvedTitle && parsed.title) resolvedTitle = parsed.title;
      }
    }

    const formPayload = {
      slug,
      title: resolvedTitle,
      category: form.category || "geral",
      description: resolvedDesc,
      badge: form.badge || "Oficial",
      estimatedMinutes: Number(form.estimatedMinutes) || 3,
      visibleToStudents: form.visibleToStudents ?? true,
      isPublicLead: form.isPublicLead ?? true,
      fields: resolvedFields,
      googleFormUrl: form.googleFormUrl || "",
    };

    // Busca por id direto se for UUID válido ou pelo slug gravado
    let existingQuery = supabaseAdmin
      .from("pt_notifications")
      .select("id")
      .eq("type", "custom_form_definition");

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(form.id || "");
    if (isUuid) {
      existingQuery = existingQuery.eq("id", form.id);
    } else {
      existingQuery = existingQuery.filter("metadata->>slug", "eq", slug);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("pt_notifications")
        .update({
          title: resolvedTitle,
          metadata: formPayload,
        })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin.from("pt_notifications" as any).insert({
        user_id: form.userId || null,
        title: resolvedTitle,
        message: resolvedDesc || "Definição de formulário customizado",
        type: "custom_form_definition",
        metadata: formPayload,
      });
    }

    return { ok: true, slug };
  });

export const listSubmissionsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  try {
    const { data, error } = await supabaseAdmin
      .from("pt_notifications")
      .select("id, title, message, created_at, metadata")
      .eq("type", "form_submission")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[listSubmissionsServerFn] Erro ao buscar submissões:", error.message);
      return [];
    }

    return (data || []).map((row) => {
      const meta = (row.metadata as any) || {};
      return {
        id: row.id,
        title: row.title,
        message: row.message,
        createdAt: row.created_at,
        formSlug: meta.form_slug || "",
        formTitle: meta.form_title || row.title || "Formulário",
        respondentName: meta.respondent_name || "Respondente",
        respondentContact: meta.respondent_contact || "",
        studentId: meta.student_id || null,
        answers: meta.answers || {},
      };
    });
  } catch (err: any) {
    console.warn("[listSubmissionsServerFn] Exceção:", err?.message);
    return [];
  }
});

export const linkSubmissionToStudentServerFn = createServerFn({ method: "POST" })
  .validator((input: { submissionId: string; studentId: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Busca a submissão atual
    const { data: row, error: fetchErr } = await supabaseAdmin
      .from("pt_notifications")
      .select("metadata")
      .eq("id", data.submissionId)
      .single();

    if (fetchErr || !row) {
      throw new Error("Submissão não encontrada.");
    }

    const currentMeta = (row.metadata as any) || {};
    const updatedMeta = {
      ...currentMeta,
      student_id: data.studentId,
      linked_at: new Date().toISOString(),
    };

    const { error: updateErr } = await supabaseAdmin
      .from("pt_notifications")
      .update({ metadata: updatedMeta })
      .eq("id", data.submissionId);

    if (updateErr) {
      throw new Error(`Erro ao vincular resposta: ${updateErr.message}`);
    }

    return { ok: true };
  });

