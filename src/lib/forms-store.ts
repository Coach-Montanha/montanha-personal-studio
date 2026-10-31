export type FormCategory = "anamnese" | "parq" | "objetivos" | "feedback" | "geral";

export type FormFieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "select"
  | "radio"
  | "checkbox"
  | "scale"
  | "legal-consent";

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: string[];
  consentStatement?: string;
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
}

export interface StudioFormItem {
  id: string;
  slug: string;
  title: string;
  category: FormCategory;
  description: string;
  googleFormUrl: string;
  badge?: string;
  estimatedMinutes?: number;
  visibleToStudents: boolean;
  isPublicLead: boolean;
  fields?: FormFieldDefinition[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY_PREFIX = "studio:forms_data_v1";
const DELETED_FORMS_KEY = "studio:deleted_forms_v1";

function getDeletedSlugs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DELETED_FORMS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function addDeletedSlug(idOrSlug: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getDeletedSlugs();
    current.add(idOrSlug.toLowerCase().trim());
    localStorage.setItem(DELETED_FORMS_KEY, JSON.stringify(Array.from(current)));
  } catch {}
}

export function formatGoogleFormEmbedUrl(url: string): string {
  if (!url) return "";
  let clean = url.trim();
  
  // Se for Google Forms
  if (clean.includes("docs.google.com/forms")) {
    // Remove query params como usp=sf_link etc
    clean = clean.replace(/\/edit(\?.*)?$/, "/viewform");
    if (!clean.includes("/viewform")) {
      clean = clean.replace(/\/+$/, "") + "/viewform";
    }
    if (!clean.includes("embedded=true")) {
      const sep = clean.includes("?") ? "&" : "?";
      clean = `${clean}${sep}embedded=true`;
    }
  }
  return clean;
}

const TEMPLATES_VERSION_KEY = 'studio:forms_tpl_version';
const CURRENT_TEMPLATES_VERSION = '2026-10-31-v4';

const DEFAULT_TEMPLATES: StudioFormItem[] = [
  {
    id: "pedido-camiseta-studio",
    slug: "camiseta-studio",
    title: "Pedido de Camiseta Oficial do Studio",
    category: "geral",
    description: "Garanta a camiseta oficial do Studio Montanha! Escolha o modelo, tamanho ideal e detalhes do pedido.",
    googleFormUrl: "",
    badge: "Loja & Uniforme",
    estimatedMinutes: 2,
    visibleToStudents: true,
    isPublicLead: true,
    createdAt: "2026-10-30T18:00:00.000Z",
    updatedAt: "2026-10-30T18:00:00.000Z",
  },
  {
    id: "termo-de-autorizacao-de-uso-de-imagem",
    slug: "termo-de-autorizacao-de-uso-de-imagem",
    title: "Termo de Autorização de Uso de Imagem e Voz",
    category: "geral",
    description: "Autorização para gravação e veiculação de fotos, vídeos de evolução e depoimentos nas redes sociais do Studio.",
    googleFormUrl: "",
    badge: "Jurídico & LGPD",
    estimatedMinutes: 2,
    visibleToStudents: true,
    isPublicLead: true,
    createdAt: "2026-10-23T18:00:00.000Z",
    updatedAt: "2026-10-23T18:00:00.000Z",
  },
  {
    id: "form_anamnese_padrao",
    slug: "anamnese",
    title: "Anamnese Geral & Histórico de Saúde",
    category: "anamnese",
    description: "Ficha clínica completa para novos alunos, histórico patológico, cirurgias e restrições articulares.",
    googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-exemplo-anamnese/viewform",
    badge: "Novos Alunos",
    estimatedMinutes: 5,
    visibleToStudents: true,
    isPublicLead: true,
    createdAt: "2026-10-23T18:00:00.000Z",
    updatedAt: "2026-10-23T18:00:00.000Z",
  },
  {
    id: "form_parq_padrao",
    slug: "par-q",
    title: "Questionário de Prontidão Física (PAR-Q)",
    category: "parq",
    description: "Triagem internacional de aptidão cardiovascular e articular para a prática segura de treinos intensos.",
    googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-exemplo-parq/viewform",
    badge: "Segurança Médica",
    estimatedMinutes: 3,
    visibleToStudents: true,
    isPublicLead: true,
    createdAt: "2026-10-23T18:00:00.000Z",
    updatedAt: "2026-10-23T18:00:00.000Z",
  },
  {
    id: "form_metas_padrao",
    slug: "metas",
    title: "Alinhamento de Metas & Objetivos",
    category: "objetivos",
    description: "Mapeamento das prioridades do aluno: hipertrofia, emagrecimento, condicionamento ou alívio de dores.",
    googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-exemplo-metas/viewform",
    badge: "Planejamento",
    estimatedMinutes: 4,
    visibleToStudents: true,
    isPublicLead: true,
    createdAt: "2026-10-23T18:00:00.000Z",
    updatedAt: "2026-10-23T18:00:00.000Z",
  },
  {
    id: "form_feedback_padrao",
    slug: "feedback",
    title: "Pesquisa de Satisfação & Feedback",
    category: "feedback",
    description: "Avaliação da experiência do aluno com o treino, suporte, ambiente do Studio e atendimento do personal.",
    googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-exemplo-feedback/viewform",
    badge: "Melhoria Contínua",
    estimatedMinutes: 2,
    visibleToStudents: true,
    isPublicLead: false,
    createdAt: "2026-10-23T18:00:00.000Z",
    updatedAt: "2026-10-23T18:00:00.000Z",
  },
];

function getStorageKey(tenantId?: string): string {
  return tenantId ? `${STORAGE_KEY_PREFIX}:${tenantId}` : STORAGE_KEY_PREFIX;
}

export function listStudioForms(tenantId?: string): StudioFormItem[] {
  const deleted = getDeletedSlugs();
  const filterDeleted = (items: StudioFormItem[]) =>
    items.filter((item) => !deleted.has(item.id.toLowerCase()) && !deleted.has(item.slug.toLowerCase()));

  if (typeof window === "undefined") return filterDeleted(DEFAULT_TEMPLATES);
  try {
    const storageKey = getStorageKey(tenantId);
    const raw = localStorage.getItem(storageKey);
    const savedVer = localStorage.getItem(TEMPLATES_VERSION_KEY);

    if (!raw || savedVer !== CURRENT_TEMPLATES_VERSION) {
      let merged = [...DEFAULT_TEMPLATES];
      if (raw) {
        try {
          const existing = JSON.parse(raw);
          if (Array.isArray(existing)) {
            for (const item of existing) {
              const defIdx = merged.findIndex((m) => m.id.toLowerCase() === item.id.toLowerCase());
              if (defIdx >= 0) {
                merged[defIdx] = { ...merged[defIdx], ...item };
              } else {
                merged.push(item);
              }
            }
          }
        } catch {}
      }
      localStorage.setItem(storageKey, JSON.stringify(merged));
      localStorage.setItem(TEMPLATES_VERSION_KEY, CURRENT_TEMPLATES_VERSION);
      return filterDeleted(merged);
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? filterDeleted(parsed) : filterDeleted(DEFAULT_TEMPLATES);
  } catch {
    return filterDeleted(DEFAULT_TEMPLATES);
  }
}

export function getStudioFormBySlugOrId(slugOrId: string, tenantId?: string): StudioFormItem | null {
  const forms = listStudioForms(tenantId);
  const normalized = slugOrId.toLowerCase().trim();
  return (
    forms.find((f) => f.slug.toLowerCase() === normalized || f.id.toLowerCase() === normalized) ||
    null
  );
}

export function saveStudioForm(
  data: Omit<StudioFormItem, "id" | "createdAt" | "updatedAt"> & { id?: string },
  tenantId?: string
): StudioFormItem {
  const forms = listStudioForms(tenantId);
  const now = new Date().toISOString();

  let targetSlug = data.slug?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") || "";
  if (!targetSlug) {
    targetSlug = (data.title || "formulario")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (data.id) {
    const index = forms.findIndex((f) => f.id === data.id);
    if (index >= 0) {
      const updated: StudioFormItem = {
        ...forms[index],
        ...data,
        slug: targetSlug,
        updatedAt: now,
      };
      forms[index] = updated;
      localStorage.setItem(getStorageKey(tenantId), JSON.stringify(forms));
      return updated;
    }
  }

  const newId = `form_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const newItem: StudioFormItem = {
    id: newId,
    title: data.title.trim(),
    slug: targetSlug,
    category: data.category || "geral",
    description: data.description?.trim() || "",
    googleFormUrl: (data.googleFormUrl || "").trim(),
    badge: data.badge?.trim() || "Formulário",
    estimatedMinutes: data.estimatedMinutes || 3,
    visibleToStudents: data.visibleToStudents ?? true,
    isPublicLead: data.isPublicLead ?? true,
    fields: (data as any).fields || [],
    createdAt: now,
    updatedAt: now,
  };

  forms.unshift(newItem);
  localStorage.setItem(getStorageKey(tenantId), JSON.stringify(forms));
  return newItem;
}

export function deleteStudioForm(idOrSlug: string, tenantId?: string): boolean {
  const target = idOrSlug.toLowerCase().trim();
  addDeletedSlug(target);
  const forms = listStudioForms(tenantId);
  const filtered = forms.filter((f) => f.id.toLowerCase() !== target && f.slug.toLowerCase() !== target);
  localStorage.setItem(getStorageKey(tenantId), JSON.stringify(filtered));
  return true;
}
