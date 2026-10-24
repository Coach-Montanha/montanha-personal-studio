import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/payments/infinitepay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);

          if (!body) {
            return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const orderNsu = body.order_nsu || body.data?.order_nsu || body.nsu;
          const status = (body.status || body.data?.status || body.event || "").toLowerCase();

          if (!orderNsu) {
            return new Response(JSON.stringify({ error: "Missing order_nsu" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const isPaid = status === "approved" || status === "paid" || status === "payment.approved" || status === "success";

          if (!isPaid) {
            if (status === "failed" || status === "cancelled") {
              await supabaseAdmin
                .from("payment_orders")
                .update({ status: "failed", updated_at: new Date().toISOString() })
                .eq("order_nsu", orderNsu);
            }

            return new Response(JSON.stringify({ message: `Status ignored: ${status}` }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 1. Localizar o pedido
          const { data: order, error: orderErr } = await supabaseAdmin
            .from("payment_orders")
            .select("id, student_id, pt_student_id, plan_id, pt_plan_id, plan_type, amount, status, user_id")
            .eq("order_nsu", orderNsu)
            .maybeSingle();

          if (orderErr || !order) {
            return new Response(JSON.stringify({ error: "Order not found", details: orderErr?.message }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (order.status === "paid") {
            return new Response(JSON.stringify({ message: "Order already processed" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const planType = order.plan_type || "studio";
          const studentId = planType === "pt" ? order.pt_student_id : order.student_id;
          const planId = planType === "pt" ? order.pt_plan_id : order.plan_id;

          // 2. Chamar RPC para efetivar o pagamento e a migração de plano
          const { data: rpcRes, error: rpcErr } = await supabaseAdmin.rpc("apply_plan_migration_and_payment", {
            p_student_id: studentId,
            p_plan_id: planId,
            p_amount: order.amount,
            p_payment_method: "infinitepay",
            p_order_nsu: orderNsu,
            p_plan_type: planType,
          });

          if (rpcErr) {
            console.error("[InfinitePay Webhook] Erro ao aplicar migração de plano:", rpcErr);
            return new Response(JSON.stringify({ error: "Failed to apply migration", details: rpcErr.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true, result: rpcRes }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("[InfinitePay Webhook] Erro inesperado:", err);
          return new Response(JSON.stringify({ error: err?.message || "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
