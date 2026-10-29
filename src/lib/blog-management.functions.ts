import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ARTICLES_DIR = "c:\\Users\\Administrator\\Documents\\Projetos\\Obsidian-Cofre-Montanha\\01-Blog-e-Ebooks\\Artigos";

export interface ArticleBlock {
  id: string;
  type: "heading" | "paragraph" | "blockquote" | "callout" | "list" | "divider" | "image" | "popular_posts" | "whatsapp_feedback";
  content?: string;
  level?: number;
  items?: string[];
  src?: string;
  alt?: string;
  title?: string;
}

export interface ArticleDetail {
  slug: string;
  full_title: string;
  clean_title: string;
  category: string;
  theme: string;
  date_full: string;
  read_time: number;
  excerpt: string;
  blocks: ArticleBlock[];
  raw_markdown: string;
  file_name: string;
}

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "-");
}

function cleanTitle(raw: string): string {
  return raw.replace(/^(ARTIGO\s+\d+\s*[-–—]\s*|\d{3}_ARTIGO_\d+_[-–—]\s*)/i, "").trim();
}

function markdownToBlocks(md: string): ArticleBlock[] {
  let body = md;
  if (md.startsWith("---")) {
    const parts = md.split("---");
    if (parts.length >= 3) {
      body = parts.slice(2).join("---").trim();
    }
  }

  const lines = body.split("\n");
  const blocks: ArticleBlock[] = [];
  let currentPara: string[] = [];
  let currentList: string[] = [];

  const flushPara = () => {
    if (currentPara.length > 0) {
      blocks.push({
        id: "b_" + Math.random().toString(36).substring(2, 9),
        type: "paragraph",
        content: currentPara.join("\n").trim(),
      });
      currentPara = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({
        id: "b_" + Math.random().toString(36).substring(2, 9),
        type: "list",
        items: [...currentList],
      });
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushPara();
      flushList();
      continue;
    }

    if (trimmed.startsWith("#")) {
      flushPara();
      flushList();
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({
          id: "b_" + Math.random().toString(36).substring(2, 9),
          type: "heading",
          level: match[1].length,
          content: match[2],
        });
        continue;
      }
    }

    if (trimmed.startsWith(">")) {
      flushPara();
      flushList();
      blocks.push({
        id: "b_" + Math.random().toString(36).substring(2, 9),
        type: "blockquote",
        content: trimmed.replace(/^>\s*/, ""),
      });
      continue;
    }

    if (trimmed === "---" || trimmed === "***") {
      flushPara();
      flushList();
      blocks.push({
        id: "b_" + Math.random().toString(36).substring(2, 9),
        type: "divider",
      });
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushPara();
      currentList.push(trimmed.substring(2));
      continue;
    }

    currentPara.push(line);
  }

  flushPara();
  flushList();
  return blocks;
}

function blocksToMarkdown(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "heading") return `${"#".repeat(b.level || 2)} ${b.content || ""}\n`;
      if (b.type === "paragraph") return `${b.content || ""}\n`;
      if (b.type === "blockquote") return `> ${b.content || ""}\n`;
      if (b.type === "divider") return `---\n`;
      if (b.type === "list") return (b.items || []).map((it) => `- ${it}`).join("\n") + "\n";
      if (b.type === "image") return `![${b.alt || ""}](${b.src || ""})\n`;
      if (b.type === "callout") return `> [!NOTE] ${b.title || "Destaque"}\n> ${b.content || ""}\n`;
      return `${b.content || ""}\n`;
    })
    .join("\n");
}

export const getBlogCatalogFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const catalogPath = path.resolve(process.cwd(), "public/materiais/data/catalog.json");

    let catalog: any = null;
    if (fs.existsSync(catalogPath)) {
      catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
    }

    const pages = [
      { id: "p1", title: "Início (Feed Principal)", url: "/materiais", type: "Home", status: "Publicado" },
      { id: "p2", title: "Meus Artigos", url: "/materiais#artigosSection", type: "Catálogo", status: "Publicado" },
      { id: "p3", title: "Livros & E-books", url: "/materiais#ebooksSection", type: "Biblioteca", status: "Publicado" },
      { id: "p4", title: "Cursos Online", url: "/materiais#cursosSection", type: "Educação", status: "Publicado" },
      { id: "p5", title: "Links Amazon (24 Livros)", url: "/materiais#amazonSection", type: "Afiliados", status: "Publicado" },
      { id: "p6", title: "Search (Busca Instantânea)", url: "/materiais", type: "Pesquisa", status: "Publicado" },
      { id: "p7", title: "Missão Coach Montanha", url: "https://coachmontanha1.systeme.io/missao", type: "Institucional", status: "Legado" },
      { id: "p8", title: "Lista de Presentes", url: "https://coachmontanha1.systeme.io/lista-de-presente", type: "Apoio", status: "Legado" },
      { id: "p9", title: "Contato WhatsApp", url: "https://wa.me/5511999999999", type: "Contato", status: "Ativo" },
    ];

    const categories = [
      { id: "c1", name: "Fitness", slug: "fitness", total_posts: 137, status: "Ativo" },
      { id: "c2", name: "Desenvolvimento Pessoal", slug: "desenvolvimento-pessoal", total_posts: 33, status: "Ativo" },
      { id: "c3", name: "Treinamento Híbrido", slug: "treinamento-hibrido", total_posts: 12, status: "Sub-Tema" },
      { id: "c4", name: "Corrida & Endurance", slug: "corrida-endurance", total_posts: 18, status: "Sub-Tema" },
      { id: "c5", name: "Mobilidade Articular", slug: "mobilidade-articular", total_posts: 15, status: "Sub-Tema" },
      { id: "c6", name: "Nutrição & Jejum", slug: "nutricao-jejum", total_posts: 22, status: "Sub-Tema" },
    ];

    return {
      success: true,
      total_articles: catalog?.total_articles || 182,
      articles: catalog?.articles || [],
      ebooks: catalog?.ebooks || [],
      courses: catalog?.courses || [],
      amazon_books: catalog?.amazon_books || [],
      pages,
      categories,
    };
  } catch (err: any) {
    return { success: false, error: err.message, articles: [], pages: [], categories: [] };
  }
});

export const getArticleDetailFn = createServerFn({ method: "POST" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");

      if (!fs.existsSync(ARTICLES_DIR)) {
        throw new Error("Diretório de artigos do Obsidian não encontrado: " + ARTICLES_DIR);
      }

      const files = fs.readdirSync(ARTICLES_DIR);
      let matchedFile: string | null = null;
      let matchedContent = "";

      for (const f of files) {
        if (!f.endsWith(".md")) continue;
        const cleanName = cleanTitle(f.replace(/\.md$/, ""));
        if (slugify(cleanName) === slug || slugify(f.replace(/\.md$/, "")) === slug) {
          matchedFile = f;
          matchedContent = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8");
          break;
        }
      }

      if (!matchedFile) {
        for (const f of files) {
          if (!f.endsWith(".md")) continue;
          const content = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8");
          const m = content.match(/title:\s*["']?([^"'\n]+)["']?/i);
          if (m && slugify(cleanTitle(m[1])) === slug) {
            matchedFile = f;
            matchedContent = content;
            break;
          }
        }
      }

      if (!matchedFile) {
        throw new Error(`Artigo com slug '${slug}' não encontrado.`);
      }

      let meta: any = {};
      let body = matchedContent;
      if (matchedContent.startsWith("---")) {
        const parts = matchedContent.split("---");
        if (parts.length >= 3) {
          const lines = parts[1].split("\n");
          for (const l of lines) {
            if (l.includes(":")) {
              const [k, ...v] = l.split(":");
              meta[k.trim()] = v.join(":").trim().replace(/^["']|["']$/g, "");
            }
          }
          body = parts.slice(2).join("---").trim();
        }
      }

      const fullTitle = meta.title || matchedFile.replace(/\.md$/, "");
      const cleanT = cleanTitle(fullTitle);
      const blocks = markdownToBlocks(body);

      const detail: ArticleDetail = {
        slug,
        full_title: fullTitle,
        clean_title: cleanT,
        category: meta.category || "Fitness",
        theme: meta.theme || "Treinamento Híbrido",
        date_full: meta.date || "domingo, 28 de dezembro de 2025",
        read_time: parseInt(meta.read_time || "3"),
        excerpt: meta.excerpt || body.slice(0, 160).replace(/[#*`_]/g, ""),
        blocks,
        raw_markdown: body,
        file_name: matchedFile,
      };

      return { success: true, article: detail };
    } catch (err: any) {
      return { success: false, error: err.message, article: null };
    }
  });

const SAVE_ARTICLE_SCHEMA = z.object({
  slug: z.string(),
  file_name: z.string(),
  full_title: z.string(),
  clean_title: z.string(),
  category: z.string(),
  theme: z.string(),
  date_full: z.string(),
  excerpt: z.string(),
  blocks: z.array(z.any()),
  rebuild: z.boolean().optional(),
});

export const saveArticleDetailFn = createServerFn({ method: "POST" })
  .validator((raw: any) => SAVE_ARTICLE_SCHEMA.parse(raw))
  .handler(async ({ data }) => {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const { exec } = await import("node:child_process");
      const scriptsDir = path.resolve(process.cwd(), "scripts");

      const filePath = path.join(ARTICLES_DIR, data.file_name);
      if (!fs.existsSync(filePath)) {
        throw new Error("Arquivo não encontrado no cofre: " + filePath);
      }

      const bodyMarkdown = blocksToMarkdown(data.blocks);
      const frontmatter = `---
title: "${data.full_title}"
clean_title: "${data.clean_title}"
category: "${data.category}"
theme: "${data.theme}"
date: "${data.date_full}"
author: "Coach Montanha"
excerpt: "${data.excerpt.replace(/"/g, '\\"')}"
---

${bodyMarkdown.trim()}
`;

      fs.writeFileSync(filePath, frontmatter, "utf-8");

      if (data.rebuild) {
        const buildScript = path.join(scriptsDir, "build-blog-hub.py");
        exec(`python "${buildScript}"`, (err, stdout, stderr) => {
          if (err) console.error("Erro ao recompilar blog:", err);
          else console.log("Blog recompilado com sucesso após edição.");
        });
      }

      return { success: true, message: "Artigo e blocos salvos com sucesso!" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

export const rebuildEntireBlogFn = createServerFn({ method: "POST" }).handler(async () => {
  return new Promise<{ success: boolean; message: string }>(async (resolve) => {
    try {
      const path = await import("node:path");
      const { exec } = await import("node:child_process");
      const scriptsDir = path.resolve(process.cwd(), "scripts");
      const buildScript = path.join(scriptsDir, "build-blog-hub.py");

      exec(`python "${buildScript}"`, (err, stdout, stderr) => {
        if (err) {
          resolve({ success: false, message: `Erro ao recompilar: ${err.message}` });
        } else {
          resolve({ success: true, message: "Todos os 182 artigos e páginas foram recompilados e publicados!" });
        }
      });
    } catch (e: any) {
      resolve({ success: false, message: `Erro ao importar dependências: ${e.message}` });
    }
  });
});
