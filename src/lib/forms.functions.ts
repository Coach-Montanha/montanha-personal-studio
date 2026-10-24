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
      const { data: dbForm } = await supabaseAdmin
        .from("pt_notifications")
        .select("id, user_id, title, metadata, created_at")
        .eq("type", "custom_form_definition")
        .or(`metadata->>slug.eq.${normalized},id.eq.${normalized}`)
        .maybeSingle();

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

    const { error } = await supabaseAdmin.from("pt_notifications" as any).insert({
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

    const formPayload = {
      slug,
      title: form.title,
      category: form.category || "geral",
      description: form.description || "",
      badge: form.badge || "Oficial",
      estimatedMinutes: Number(form.estimatedMinutes) || 3,
      visibleToStudents: form.visibleToStudents ?? true,
      isPublicLead: form.isPublicLead ?? true,
      fields: form.fields || [],
      googleFormUrl: form.googleFormUrl || "",
    };

    // Busca por id direto ou pelo slug gravado
    let existingQuery = supabaseAdmin
      .from("pt_notifications")
      .select("id")
      .eq("type", "custom_form_definition");

    if (form.id) {
      existingQuery = existingQuery.eq("id", form.id);
    } else {
      existingQuery = existingQuery.filter("metadata->>slug", "eq", slug);
    }

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("pt_notifications")
        .update({
          title: form.title,
          metadata: formPayload,
        })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin.from("pt_notifications" as any).insert({
        user_id: form.userId || null,
        title: form.title,
        message: form.description || "Definição de formulário customizado",
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

