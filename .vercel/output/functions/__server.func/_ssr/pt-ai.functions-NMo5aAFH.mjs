import { l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DZO41X7i.mjs";
import { t as createServerRpc } from "./createServerRpc-TAUNrjZd.mjs";
import { f as object, p as string } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pt-ai.functions-NMo5aAFH.js
var InputSchema = object({
	programId: string().uuid(),
	prompt: string().min(3).max(4e3)
});
var prescribeTrainingWithAi_createServerFn_handler = createServerRpc({
	id: "f874d9df14d72bd20ca761cdb07ada8f110a8ab965d7484cd9343d6dbb74c372",
	name: "prescribeTrainingWithAi",
	filename: "src/lib/pt-ai.functions.ts"
}, (opts) => prescribeTrainingWithAi.__executeServer(opts));
var prescribeTrainingWithAi = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((raw) => InputSchema.parse(raw)).handler(prescribeTrainingWithAi_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: programRow, error } = await supabase.from("pt_programs").select("id,name,category,level,training_type,goals,start_date,end_date").eq("id", data.programId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!programRow) throw new Error("Rotina não encontrada");
	const program = programRow;
	const key = process.env.LOVABLE_API_KEY;
	if (!key) throw new Error("Configuração do motor Híbrido/KB Fitness ausente (LOVABLE_API_KEY)");
	const system = `Você é um Personal Trainer experiente. Gere uma prescrição de treino em português (Brasil).
Responda APENAS com JSON válido, sem markdown, no formato:
{
  "days": [
    {
      "name": "Treino 1",
      "day_label": "Dia A",
      "description": "Foco muscular / observações gerais",
      "exercises": [
        { 
          "name": "Supino reto", 
          "series_type": "reps_load", 
          "sets_reps": "4x10", 
          "load": "60kg", 
          "rest_seconds": 90, 
          "observations": "Cadência 2:1" 
        }
      ]
    }
  ],
  "notes": "Observações finais do plano"
}
Tipos de série (series_type):
- "reps_load": Repetições e carga (campos: sets_reps, load)
- "reps_load_time": Repetições, carga e tempo (campos: sets_reps, load, time_seconds)
- "sets_time": Séries e tempo (campos: sets_reps, time_seconds)
- "reps_time": Repetições e tempo (campos: sets_reps, time_seconds)
- "time_inclination": Tempo e inclinação (campos: time_seconds, inclination)
- "run": Corrida (campos: load para distância, pace)
- "cadence": Cadência (campo: cadence)
Regras: 4 a 8 exercícios por dia. "day_label" segue o tipo (numérico "Dia 1/2/3..." ou alfabético "Dia A/B/C...").`;
	const user = `Rotina: ${program.name}
Categoria: ${program.category}
Nível: ${program.level}
Tipo de nomenclatura: ${program.training_type}
Período: ${program.start_date}${program.end_date ? ` até ${program.end_date}` : ""}
Objetivos: ${program.goals ?? "(não informado)"}

Instruções do trainer:
${data.prompt}`;
	const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Lovable-API-Key": key
		},
		body: JSON.stringify({
			model: "google/gemini-3-flash-preview",
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}],
			response_format: { type: "json_object" }
		})
	});
	if (res.status === 429) throw new Error("Limite de uso da IA atingido. Tente novamente em alguns instantes.");
	if (res.status === 402) throw new Error("Créditos da IA esgotados. Adicione créditos no workspace.");
	if (!res.ok) throw new Error(`Falha na IA (${res.status})`);
	const content = (await res.json()).choices?.[0]?.message?.content ?? "{}";
	let parsed;
	try {
		parsed = JSON.parse(content);
	} catch {
		throw new Error("Resposta da IA não pôde ser interpretada.");
	}
	if (!Array.isArray(parsed.days)) parsed.days = [];
	return parsed;
});
//#endregion
export { prescribeTrainingWithAi_createServerFn_handler };
