import { createFileRoute } from "@tanstack/react-router";
import * as fs from "node:fs";
import * as path from "node:path";

function getStatsFilePath(): string {
  return path.resolve(process.cwd(), "public/materiais/data/stats.json");
}

function readStats(): { visits: number; updated_at: string } {
  try {
    const filePath = getStatsFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (typeof parsed?.visits === "number") {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[api.blog.stats] Erro ao ler stats.json:", err);
  }
  return { visits: 4576, updated_at: new Date().toISOString() };
}

function saveStats(stats: { visits: number; updated_at: string }) {
  try {
    const filePath = getStatsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2), "utf-8");

    // Também sincroniza com diretórios de build se existirem
    const vercelPath = path.resolve(process.cwd(), ".vercel/output/static/materiais/data/stats.json");
    if (fs.existsSync(path.dirname(vercelPath))) {
      try {
        fs.writeFileSync(vercelPath, JSON.stringify(stats, null, 2), "utf-8");
      } catch {}
    }
  } catch (err) {
    console.warn("[api.blog.stats] Erro ao salvar stats.json:", err);
  }
}

export const Route = createFileRoute("/api/blog/stats")({
  server: {
    handlers: {
      GET: async () => {
        const stats = readStats();
        return new Response(JSON.stringify(stats), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
      POST: async () => {
        const current = readStats();
        const next = {
          visits: current.visits + 1,
          updated_at: new Date().toISOString(),
        };
        saveStats(next);
        return new Response(JSON.stringify(next), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      },
    },
  },
});
