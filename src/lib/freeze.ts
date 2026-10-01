import { supabase } from "@/integrations/supabase/client";
import { addDays, format } from "date-fns";

/**
 * Desloca a data de vencimento do pagamento vigente pelo número de dias de trancamento.
 * Suporta edição diferencial (delta de dias entre o trancamento anterior e o novo).
 */
export async function applyFreezeToPayment({
  studentId,
  days,
  previousDays = 0,
  paymentId,
  isPt = false,
}: {
  studentId: string;
  days: number;
  previousDays?: number;
  paymentId?: string | null;
  isPt?: boolean;
}): Promise<{ paymentId: string | null; newDueDate: string | null }> {
  try {
    const deltaDays = days - previousDays;
    const table = isPt ? "pt_payments" : "payments";
    const studentCol = isPt ? "pt_student_id" : "student_id";

    let p: any = null;
    if (paymentId) {
      const { data } = await supabase
        .from(table)
        .select("id, due_date, payment_date")
        .eq("id", paymentId)
        .maybeSingle();
      p = data;
    }

    if (!p) {
      const { data } = await supabase
        .from(table)
        .select("id, due_date, payment_date")
        .eq(studentCol, studentId)
        .is("deleted_at", null)
        .order("due_date", { ascending: false, nullsFirst: false })
        .order("payment_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      p = data;
    }

    if (!p) {
      return { paymentId: null, newDueDate: null };
    }

    if (deltaDays === 0) {
      return { paymentId: p.id, newDueDate: p.due_date || p.payment_date };
    }

    const baseDateStr = p.due_date || p.payment_date;
    if (!baseDateStr) return { paymentId: p.id, newDueDate: null };

    const baseDate = new Date(baseDateStr.includes("T") ? baseDateStr : `${baseDateStr}T00:00:00`);
    if (isNaN(baseDate.getTime())) return { paymentId: p.id, newDueDate: null };

    const extendedDate = addDays(baseDate, deltaDays);
    const newDueDate = format(extendedDate, "yyyy-MM-dd");

    await supabase.from(table).update({ due_date: newDueDate }).eq("id", p.id);

    return { paymentId: p.id, newDueDate };
  } catch (err) {
    console.error("Erro ao deslocar vencimento do pagamento:", err);
    return { paymentId: null, newDueDate: null };
  }
}
