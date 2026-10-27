import { supabase } from "@/integrations/supabase/client";
import { formatDateBR } from "@/lib/format";
import { groupDaysByWeek, parseDayMeta } from "@/lib/training-weeks";

const CATEGORY_LABELS: Record<string, string> = {
  hypertrophy: "Hipertrofia",
  conditioning: "Condicionamento físico",
  strength: "Força",
  cardio: "Cardio",
  general: "Geral",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export async function downloadProgramPdf(programId: string, studentName?: string) {
  if (!programId) throw new Error("ID do programa não informado");

  const { data: program, error: pErr } = await supabase
    .from("pt_programs" as never)
    .select("*")
    .eq("id", programId)
    .maybeSingle();

  if (pErr) throw new Error(`Erro ao buscar rotina: ${pErr.message}`);
  if (!program) throw new Error("Rotina não encontrada");
  const p = program as any;

  const { data: days = [], error: dErr } = await supabase
    .from("pt_training_days" as never)
    .select("*")
    .eq("program_id", programId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (dErr) throw new Error(`Erro ao buscar dias de treino: ${dErr.message}`);

  const dayIds = (days as any[]).map((d) => d.id);
  const { data: exercises = [], error: exErr } = dayIds.length
    ? await supabase
        .from("pt_training_exercises" as never)
        .select("*")
        .in("training_day_id", dayIds)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true })
    : { data: [] as any[], error: null };

  if (exErr) throw new Error(`Erro ao buscar exercícios: ${exErr.message}`);

  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default || autoTableModule;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 48;

  // Cabeçalho Principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(p.name ?? "Rotina de treino", 40, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);

  if (studentName) {
    doc.text(`Aluno: ${studentName}`, 40, y);
    y += 14;
  }

  const period = `${p.start_date ? formatDateBR(p.start_date) : "Sem data"}${p.end_date ? ` — ${formatDateBR(p.end_date)}` : ""}`;
  doc.text(`Período: ${period}`, 40, y);
  y += 14;

  const cat = CATEGORY_LABELS[p.category] ?? p.category ?? "Geral";
  const lev = LEVEL_LABELS[p.level] ?? p.level ?? "Geral";
  doc.text(`Categoria: ${cat} · Nível: ${lev}`, 40, y);
  y += 16;
  doc.setTextColor(0);

  if (p.goals) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Objetivos", 40, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const wrapped = doc.splitTextToSize(p.goals, pageWidth - 80);
    doc.text(wrapped, 40, y);
    y += wrapped.length * 12 + 8;
  }

  // Agrupamento Semanal para o PDF
  const weeklyGroups = groupDaysByWeek(days as any[]);

  weeklyGroups.forEach(({ weekNumber, days: weekDays }) => {
    if (y > 700) {
      doc.addPage();
      y = 48;
    }

    // Título da Semana se houver mais de uma semana ou para demarcação clara
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(40, y, pageWidth - 80, 22, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 120);
    doc.text(`SEMANA ${weekNumber} (${weekDays.length} ${weekDays.length === 1 ? "sessão" : "sessões"})`, 48, y + 15);
    doc.setTextColor(0);
    y += 30;

    weekDays.forEach((d) => {
      if (y > 700) {
        doc.addPage();
        y = 48;
      }

      const meta = parseDayMeta(d, (days as any[]).indexOf(d), days.length);
      const coachTag = meta.isWithCoach ? " [COM PROFESSOR]" : "";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${d.name}  •  ${d.day_label}${coachTag}`, 40, y);
      y += 13;

      const descText = meta.cleanDescription || d.description;
      if (descText) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(90);
        const wrapped = doc.splitTextToSize(descText, pageWidth - 80);
        doc.text(wrapped, 40, y);
        y += wrapped.length * 11 + 4;
        doc.setTextColor(0);
      }

      const dayExercises = (exercises as any[]).filter((e) => e.training_day_id === d.id);
      if (dayExercises.length > 0) {
        autoTable(doc, {
          startY: y + 2,
          head: [["Exercício", "Séries x Reps", "Carga", "Descanso", "Observações"]],
          body: dayExercises.map((ex) => [
            ex.name ?? "",
            ex.sets_reps ?? "",
            ex.load ?? "",
            ex.rest_seconds ? `${ex.rest_seconds}s` : "",
            ex.observations ?? "",
          ]),
          styles: { fontSize: 8.5, cellPadding: 4 },
          headStyles: { fillColor: [40, 40, 50] },
          margin: { left: 40, right: 40 },
        });
        const anyDoc = doc as unknown as { lastAutoTable?: { finalY: number } };
        y = (anyDoc.lastAutoTable?.finalY ?? y) + 16;
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(120);
        doc.text("Nenhum exercício adicionado a esta sessão.", 40, y);
        doc.setTextColor(0);
        y += 16;
      }
    });
  });

  const filename = `${(p.name ?? "rotina").replace(/[^\w\-]+/g, "_")}.pdf`;

  // Disparo direto e confiável do download de arquivo (evita bloqueios do Web Share em navegadores desktop)
  try {
    doc.save(filename);
  } catch (err) {
    console.warn("doc.save falhou, usando download por elemento âncora com Blob URL:", err);
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 1500);
  }
}
