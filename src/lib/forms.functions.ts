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

      // Se foi marcado como deletado
      if (meta.deleted) {
        formsMap.delete(slug);
        formsMap.delete(row.id.toLowerCase());
        continue;
      }

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
        isArchived: meta.isArchived === true,
        fields: meta.fields || [],
        googleFormUrl: meta.googleFormUrl || "",
        userId: row.user_id,
      } as any);
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
      studentId?: string | null;
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

    const submittedAt = new Date().toISOString();
    const initialMeta = {
      form_slug: data.formSlug,
      form_title: data.formTitle,
      respondent_name: data.respondentName,
      respondent_contact: data.respondentContact,
      student_id: data.studentId || null,
      answers: data.answers,
      submitted_at: submittedAt,
    };

    const { data: insertedRow, error } = await supabaseAdmin
      .from("pt_notifications" as any)
      .insert({
        user_id: targetUserId,
        title: `📋 Novo Envio: ${data.formTitle} (${data.respondentName})`,
        message: `${data.respondentName} (${data.respondentContact || "Sem contato"}) preencheu o formulário "${data.formTitle}".`,
        type: "form_submission",
        metadata: initialMeta,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Erro ao registrar resposta: ${error.message}`);
    }

    // Camadas de Segurança e Backup Automático (PDF + Supabase Storage + Google Drive)
    try {
      const { generateSubmissionPdfBuffer, uploadToSecureStorage, saveToGoogleDriveFolder } = await import("./form-submission-backup");
      const pdfRes = generateSubmissionPdfBuffer({
        submissionId: insertedRow.id,
        formSlug: data.formSlug,
        formTitle: data.formTitle,
        respondentName: data.respondentName,
        respondentContact: data.respondentContact,
        submittedAt,
        answers: data.answers,
        businessName: "MONTANHA PERSONAL STUDIO",
      });

      const secureUpload = await uploadToSecureStorage(supabaseAdmin, pdfRes.filename, pdfRes.buffer);
      const driveUpload = saveToGoogleDriveFolder(pdfRes.filename, pdfRes.buffer);

      await supabaseAdmin
        .from("pt_notifications")
        .update({
          metadata: {
            ...initialMeta,
            pdf_filename: pdfRes.filename,
            secure_storage_path: secureUpload?.path || null,
            secure_storage_url: secureUpload?.publicUrl || null,
            gdrive_synced: driveUpload.synced,
            gdrive_path: driveUpload.filePath || null,
            backed_up_at: new Date().toISOString(),
          },
        })
        .eq("id", insertedRow.id);
    } catch (backupErr: any) {
      console.warn("[submitFormServerFn] Backup secundário:", backupErr?.message);
    }

    return { ok: true, message: "Resposta gravada e cópias de segurança geradas com sucesso!" };
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
      isArchived: form.isArchived === true,
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
      const { error: updateErr } = await supabaseAdmin
        .from("pt_notifications")
        .update({
          title: resolvedTitle,
          metadata: formPayload,
        })
        .eq("id", existing.id);
      if (updateErr) {
        console.error("[saveFormServerFn] Erro ao atualizar no banco:", updateErr.message);
        throw new Error(`Erro ao atualizar no banco: ${updateErr.message}`);
      }
    } else {
      // Fallback para admin caso form.userId não seja fornecido (ex: formulários padrão)
      const targetUserId =
        form.userId || "b75fc258-7809-4861-b52f-55877117cc92";

      const { error: insertErr } = await supabaseAdmin.from("pt_notifications" as any).insert({
        user_id: targetUserId,
        title: resolvedTitle,
        message: resolvedDesc || "Definição de formulário customizado",
        type: "custom_form_definition",
        metadata: formPayload,
      });
      if (insertErr) {
        console.error("[saveFormServerFn] Erro ao inserir no banco:", insertErr.message);
        throw new Error(`Erro ao inserir no banco: ${insertErr.message}`);
      }
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
        pdfFilename: meta.pdf_filename || null,
        secureStorageUrl: meta.secure_storage_url || null,
        secureStoragePath: meta.secure_storage_path || null,
        gdriveSynced: meta.gdrive_synced === true,
        gdrivePath: meta.gdrive_path || null,
        backedUpAt: meta.backed_up_at || null,
      };
    });
  } catch (err: any) {
    console.warn("[listSubmissionsServerFn] Exceção:", err?.message);
    return [];
  }
});

export const linkSubmissionToStudentServerFn = createServerFn({ method: "POST" })
  .validator((input: { submissionId: string; studentId: string | null }) => input)
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
      linked_at: data.studentId ? new Date().toISOString() : null,
    };

    const { error: updateErr } = await supabaseAdmin
      .from("pt_notifications")
      .update({ metadata: updatedMeta })
      .eq("id", data.submissionId);

    if (updateErr) {
      throw new Error(`Erro ao atualizar vínculo: ${updateErr.message}`);
    }

    return { ok: true };
  });

export const deleteSubmissionServerFn = createServerFn({ method: "POST" })
  .validator((input: { submissionId: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("pt_notifications")
      .delete()
      .eq("id", data.submissionId)
      .eq("type", "form_submission");

    if (error) {
      throw new Error(`Erro ao excluir resposta: ${error.message}`);
    }

    return { ok: true };
  });

/**
 * Exclui de forma granular uma camada específica da submissão:
 * - 'db': apenas o registro do banco de dados (preserva PDF no Storage e no Google Drive)
 * - 'secure_storage': apenas o PDF da pasta segura no Supabase Storage
 * - 'gdrive': apenas o arquivo da pasta 'H:\Meu Drive\Formulários do Studio'
 * - 'all': remove de todas as camadas simultaneamente
 */
export const deleteSubmissionLayerServerFn = createServerFn({ method: "POST" })
  .validator(
    (input: {
      submissionId: string;
      layer: "db" | "secure_storage" | "gdrive" | "all";
    }) => input
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { deleteFromSecureStorage, deleteFromGoogleDriveFolder } = await import("./form-submission-backup");

    const { data: row } = await supabaseAdmin
      .from("pt_notifications")
      .select("id, metadata")
      .eq("id", data.submissionId)
      .maybeSingle();

    const meta = (row?.metadata as any) || {};
    const filename = meta.pdf_filename;

    if (data.layer === "secure_storage" || data.layer === "all") {
      if (filename) {
        await deleteFromSecureStorage(supabaseAdmin, filename);
      }
      if (data.layer === "secure_storage" && row) {
        await supabaseAdmin
          .from("pt_notifications")
          .update({
            metadata: {
              ...meta,
              secure_storage_path: null,
              secure_storage_url: null,
            },
          })
          .eq("id", row.id);
      }
    }

    if (data.layer === "gdrive" || data.layer === "all") {
      if (filename) {
        deleteFromGoogleDriveFolder(filename);
      }
      if (data.layer === "gdrive" && row) {
        await supabaseAdmin
          .from("pt_notifications")
          .update({
            metadata: {
              ...meta,
              gdrive_synced: false,
              gdrive_path: null,
            },
          })
          .eq("id", row.id);
      }
    }

    if (data.layer === "db" || data.layer === "all") {
      await supabaseAdmin
        .from("pt_notifications")
        .delete()
        .eq("id", data.submissionId)
        .eq("type", "form_submission");
    }

    return { ok: true, layer: data.layer };
  });

/**
 * Força a geração ou atualização de backup de uma submissão
 */
export const backupSingleSubmissionServerFn = createServerFn({ method: "POST" })
  .validator((input: { submissionId: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { generateSubmissionPdfBuffer, uploadToSecureStorage, saveToGoogleDriveFolder } = await import("./form-submission-backup");

    const { data: row, error: fetchErr } = await supabaseAdmin
      .from("pt_notifications")
      .select("id, title, message, created_at, metadata")
      .eq("id", data.submissionId)
      .single();

    if (fetchErr || !row) {
      throw new Error("Submissão não encontrada.");
    }

    const meta = (row.metadata as any) || {};
    const pdfRes = generateSubmissionPdfBuffer({
      submissionId: row.id,
      formSlug: meta.form_slug || "",
      formTitle: meta.form_title || row.title || "Formulário",
      respondentName: meta.respondent_name || "Respondente",
      respondentContact: meta.respondent_contact || "",
      submittedAt: meta.submitted_at || row.created_at,
      answers: meta.answers || {},
      businessName: "MONTANHA PERSONAL STUDIO",
    });

    const secureUpload = await uploadToSecureStorage(supabaseAdmin, pdfRes.filename, pdfRes.buffer);
    const driveUpload = saveToGoogleDriveFolder(pdfRes.filename, pdfRes.buffer);

    const updatedMeta = {
      ...meta,
      pdf_filename: pdfRes.filename,
      secure_storage_path: secureUpload?.path || meta.secure_storage_path || null,
      secure_storage_url: secureUpload?.publicUrl || meta.secure_storage_url || null,
      gdrive_synced: driveUpload.synced,
      gdrive_path: driveUpload.filePath || meta.gdrive_path || null,
      backed_up_at: new Date().toISOString(),
    };

    await supabaseAdmin
      .from("pt_notifications")
      .update({ metadata: updatedMeta })
      .eq("id", row.id);

    return {
      ok: true,
      filename: pdfRes.filename,
      secureUrl: secureUpload?.publicUrl,
      gdriveSynced: driveUpload.synced,
    };
  });

/**
 * Varre todas as submissões registradas e garante cópia em PDF em ambas as camadas de backup
 */
export const syncAllSubmissionsBackupsServerFn = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { generateSubmissionPdfBuffer, uploadToSecureStorage, saveToGoogleDriveFolder } = await import("./form-submission-backup");

  const { data: rows, error } = await supabaseAdmin
    .from("pt_notifications")
    .select("id, title, message, created_at, metadata")
    .eq("type", "form_submission")
    .order("created_at", { ascending: false });

  if (error || !rows) {
    return { ok: false, error: error?.message || "Nenhuma submissão encontrada" };
  }

  let backedUp = 0;
  for (const row of rows) {
    const meta = (row.metadata as any) || {};
    try {
      const pdfRes = generateSubmissionPdfBuffer({
        submissionId: row.id,
        formSlug: meta.form_slug || "",
        formTitle: meta.form_title || row.title || "Formulário",
        respondentName: meta.respondent_name || "Respondente",
        respondentContact: meta.respondent_contact || "",
        submittedAt: meta.submitted_at || row.created_at,
        answers: meta.answers || {},
        businessName: "MONTANHA PERSONAL STUDIO",
      });

      const secureUpload = await uploadToSecureStorage(supabaseAdmin, pdfRes.filename, pdfRes.buffer);
      const driveUpload = saveToGoogleDriveFolder(pdfRes.filename, pdfRes.buffer);

      await supabaseAdmin
        .from("pt_notifications")
        .update({
          metadata: {
            ...meta,
            pdf_filename: pdfRes.filename,
            secure_storage_path: secureUpload?.path || meta.secure_storage_path || null,
            secure_storage_url: secureUpload?.publicUrl || meta.secure_storage_url || null,
            gdrive_synced: driveUpload.synced,
            gdrive_path: driveUpload.filePath || meta.gdrive_path || null,
            backed_up_at: new Date().toISOString(),
          },
        })
        .eq("id", row.id);

      backedUp++;
    } catch (err: any) {
      console.warn(`[syncAllSubmissionsBackupsServerFn] Falha na submissão ${row.id}:`, err?.message);
    }
  }

  return { ok: true, total: rows.length, backedUp };
});

export const importGoogleFormSubmissionsServerFn = createServerFn({ method: "POST" })
  .validator(
    (input: {
      formSlug: string;
      formTitle: string;
      items: Array<{
        respondentName: string;
        respondentContact?: string;
        submittedAt?: string;
        answers: Record<string, any>;
      }>;
    }) => input
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Encontra o treinador responsável
    let targetUserId = null;
    try {
      const normalized = (data.formSlug || "").toLowerCase().trim();
      const { data: formDef } = await supabaseAdmin
        .from("pt_notifications")
        .select("user_id")
        .eq("type", "custom_form_definition")
        .filter("metadata->>slug", "eq", normalized)
        .maybeSingle();

      if (formDef?.user_id) targetUserId = formDef.user_id;
    } catch {}

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

    let inserted = 0;
    for (const item of data.items) {
      const respName = item.respondentName || "Respondente Google Forms";
      const respContact = item.respondentContact || "";
      const submittedAt = item.submittedAt || new Date().toISOString();

      const { error } = await supabaseAdmin.from("pt_notifications" as any).insert({
        user_id: targetUserId,
        title: `📋 Importado (Google Forms): ${data.formTitle} (${respName})`,
        message: `${respName} (${respContact || "Sem contato"}) - histórico importado da planilha Google Forms.`,
        type: "form_submission",
        metadata: {
          form_slug: data.formSlug,
          form_title: data.formTitle,
          respondent_name: respName,
          respondent_contact: respContact,
          answers: item.answers,
          origin: "google_forms_csv_import",
          submitted_at: submittedAt,
        },
      });

      if (!error) inserted++;
    }

    return { ok: true, insertedCount: inserted };
  });

export const deleteCustomFormServerFn = createServerFn({ method: "POST" })
  .validator((input: { idOrSlug: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const target = data.idOrSlug.trim().toLowerCase();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target);

    // 1. Deleta do banco se existir linha
    try {
      let query = supabaseAdmin
        .from("pt_notifications")
        .delete()
        .eq("type", "custom_form_definition");

      if (isUuid) {
        query = query.or(`id.eq.${target},metadata->>slug.eq.${target}`);
      } else {
        query = query.filter("metadata->>slug", "eq", target);
      }
      await query;
    } catch {}

    // 2. Se for um formulário default do sistema (ex: par-q, alinhamento-de-metas, avaliacao-de-satisfacao),
    // grava uma tombstone com user_id válido para que ele não ressurja na listagem
    try {
      const { data: adminUser } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      const tombstoneUserId = adminUser?.id || "3f954063-c246-4989-8f48-dc84a12f5be3";

      await supabaseAdmin.from("pt_notifications" as any).insert({
        user_id: tombstoneUserId,
        title: `Tombstone ${target}`,
        message: "Formulário excluído pelo usuário",
        type: "custom_form_definition",
        metadata: {
          slug: target,
          deleted: true,
          deleted_at: new Date().toISOString(),
        },
      });
    } catch {}

    return { ok: true };
  });



