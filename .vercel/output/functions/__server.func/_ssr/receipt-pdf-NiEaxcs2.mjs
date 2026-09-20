import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { s as format } from "../_libs/date-fns.mjs";
import { a as formatDateBR, i as formatBRL, o as formatMonthLabel, u as paymentMethodLabel } from "./format-BT-nao3-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipt-pdf-NiEaxcs2.js
function bumpMonths(referenceMonth, months) {
	const [y, m] = referenceMonth.split("-").map(Number);
	const d = new Date(y, m - 1 + months, 1);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function cycleMonths(cycle) {
	switch (cycle) {
		case "quarterly": return 3;
		case "semiannual":
		case "semi_annual":
		case "biannual": return 6;
		case "annual":
		case "yearly": return 12;
		default: return 1;
	}
}
function bumpDueDate(paymentDate, cycle) {
	const d = /* @__PURE__ */ new Date(paymentDate + "T00:00:00");
	if (isNaN(d.getTime())) return null;
	d.setMonth(d.getMonth() + cycleMonths(cycle));
	return format(d, "yyyy-MM-dd");
}
/** Duplicate a payment for the next billing cycle. Returns true on success. */
async function renewPayment(payment) {
	const { data: userData } = await supabase.auth.getUser();
	const userId = userData.user?.id;
	if (!userId) {
		toast.error("Sessão expirada");
		return false;
	}
	let cycle = payment.plans?.billing_cycle;
	let planMax = payment.plans?.max_renewals;
	if ((cycle === void 0 || planMax === void 0) && payment.plan_id) {
		const { data } = await supabase.from("plans").select("billing_cycle,max_renewals").eq("id", payment.plan_id).maybeSingle();
		if (cycle === void 0) cycle = data?.billing_cycle;
		if (planMax === void 0) planMax = data?.max_renewals;
	}
	let remaining = null;
	if (payment.renewals_remaining != null) remaining = payment.renewals_remaining;
	else if (planMax != null) remaining = planMax;
	if (remaining != null && remaining <= 0) {
		toast.error("Limite de renovações automáticas atingido para este pagamento");
		return false;
	}
	const nextRemaining = remaining != null ? remaining - 1 : null;
	const months = cycleMonths(cycle);
	const nextRef = bumpMonths(payment.reference_month, months);
	const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const insertPayload = {
		user_id: userId,
		student_id: payment.student_id,
		plan_id: payment.plan_id,
		amount: Number(payment.amount),
		payment_date: today,
		due_date: bumpDueDate(today, cycle),
		reference_month: nextRef,
		payment_method: payment.payment_method,
		status: "paid",
		notes: payment.notes,
		renewed_from_payment_id: payment.id,
		auto_renew: nextRemaining == null || nextRemaining > 0,
		renewals_remaining: nextRemaining
	};
	const { error } = await supabase.from("payments").insert(insertPayload).select("id");
	if (error) {
		toast.error(error.message);
		return false;
	}
	const msg = nextRemaining != null ? `Pagamento renovado para ${nextRef} (${nextRemaining} renovação(ões) restante(s))` : `Pagamento renovado para ${nextRef}`;
	toast.success(msg);
	return true;
}
/** Duplicate a PT payment for the next month. Returns true on success. */
async function renewPtPayment(payment) {
	const { data: userData } = await supabase.auth.getUser();
	const userId = userData.user?.id;
	if (!userId) {
		toast.error("Sessão expirada");
		return false;
	}
	const nextRef = bumpMonths(payment.reference_month ?? payment.payment_date.slice(0, 7), 1);
	const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const insertPayload = {
		user_id: userId,
		pt_student_id: payment.pt_student_id,
		pt_plan_id: payment.pt_plan_id,
		amount: Number(payment.amount),
		payment_date: today,
		due_date: bumpDueDate(today, "monthly"),
		reference_month: nextRef,
		payment_method: payment.payment_method,
		status: "paid",
		notes: payment.notes,
		sessions_paid: payment.sessions_paid
	};
	const { error } = await supabase.from("pt_payments").insert(insertPayload).select("id");
	if (error) {
		toast.error(error.message);
		return false;
	}
	toast.success(`Pagamento PT renovado para ${nextRef}`);
	return true;
}
async function downloadReceiptPdf(data) {
	const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t())), import("../_libs/jspdf-autotable.mjs").then((n) => n.t)]);
	const doc = new jsPDF({
		unit: "pt",
		format: "a4"
	});
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	const margin = 40;
	const contentWidth = pageWidth - margin * 2;
	doc.setDrawColor(220, 225, 230);
	doc.setLineWidth(1);
	doc.roundedRect(margin - 10, margin - 10, contentWidth + 20, pageHeight - margin * 2 + 20, 8, 8);
	let y = 55;
	doc.setFillColor(30, 41, 59);
	doc.roundedRect(margin, y, contentWidth, 54, 6, 6, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.text(data.businessName || "STUDIO COACH MONTANHA", 58, y + 26);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);
	doc.text("GESTÃO FINANCEIRA E TREINAMENTO", 58, y + 42);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(14);
	doc.text("RECIBO", pageWidth - margin - 18, y + 26, { align: "right" });
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.text(`Nº #${data.receiptId.slice(0, 8).toUpperCase()}`, pageWidth - margin - 18, y + 42, { align: "right" });
	y += 75;
	doc.setDrawColor(22, 163, 74);
	doc.setFillColor(240, 253, 244);
	doc.roundedRect(margin, y, contentWidth, 34, 4, 4, "FD");
	doc.setTextColor(21, 128, 61);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	doc.text("✓  PAGAMENTO CONFIRMADO / QUITADO", 54, y + 21);
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.text(`Data do pagamento: ${formatDateBR(data.paymentDate)}`, pageWidth - margin - 14, y + 21, { align: "right" });
	y += 50;
	doc.setTextColor(30, 41, 59);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	doc.text("DADOS DO PAGADOR", margin, y);
	y += 8;
	const payerRows = [
		[
			"Nome do Aluno:",
			data.studentName,
			"Tipo:",
			data.kind === "pt" ? "Personal Trainer" : "Studio"
		],
		[
			"CPF:",
			data.studentCpf || "Não informado",
			"Telefone:",
			data.studentPhone || "Não informado"
		],
		[
			"E-mail:",
			data.studentEmail || "Não informado",
			"Data Emissão:",
			formatDateBR((/* @__PURE__ */ new Date()).toISOString().slice(0, 10))
		]
	];
	autoTable(doc, {
		startY: y,
		theme: "plain",
		body: payerRows,
		styles: {
			fontSize: 9.5,
			cellPadding: 3
		},
		columnStyles: {
			0: {
				fontStyle: "bold",
				textColor: [
					100,
					116,
					139
				],
				cellWidth: 90
			},
			1: {
				fontStyle: "normal",
				textColor: [
					15,
					23,
					42
				],
				cellWidth: 160
			},
			2: {
				fontStyle: "bold",
				textColor: [
					100,
					116,
					139
				],
				cellWidth: 80
			},
			3: {
				fontStyle: "normal",
				textColor: [
					15,
					23,
					42
				]
			}
		},
		margin: {
			left: margin,
			right: margin
		}
	});
	const anyDoc = doc;
	y = (anyDoc.lastAutoTable?.finalY ?? y) + 20;
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	doc.setTextColor(30, 41, 59);
	doc.text("DISCRIMINAÇÃO DO PAGAMENTO", margin, y);
	y += 8;
	const description = data.planName ? `Mensalidade / Plano: ${data.planName}` : data.kind === "pt" ? "Sessões / Treinamento Personal Trainer" : "Mensalidade Studio";
	autoTable(doc, {
		startY: y,
		head: [[
			"Item / Descrição",
			"Ref.",
			"Forma de Pagamento",
			"Valor"
		]],
		body: [[
			description,
			data.referenceMonth ? formatMonthLabel(data.referenceMonth) : "—",
			paymentMethodLabel(data.paymentMethod),
			formatBRL(data.amount)
		]],
		foot: [[
			"TOTAL RECEBIDO",
			"",
			"",
			formatBRL(data.amount)
		]],
		styles: {
			fontSize: 9.5,
			cellPadding: 8
		},
		headStyles: {
			fillColor: [
				241,
				245,
				249
			],
			textColor: [
				51,
				65,
				85
			],
			fontStyle: "bold"
		},
		footStyles: {
			fillColor: [
				248,
				250,
				252
			],
			textColor: [
				15,
				23,
				42
			],
			fontStyle: "bold",
			fontSize: 10.5
		},
		columnStyles: {
			0: { cellWidth: 230 },
			1: { cellWidth: 90 },
			2: { cellWidth: 110 },
			3: {
				halign: "right",
				fontStyle: "bold"
			}
		},
		margin: {
			left: margin,
			right: margin
		}
	});
	y = (anyDoc.lastAutoTable?.finalY ?? y) + 24;
	if (data.notes) {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(9);
		doc.setTextColor(100, 116, 139);
		doc.text("Observações:", margin, y);
		y += 12;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9);
		doc.setTextColor(71, 85, 105);
		const wrapped = doc.splitTextToSize(data.notes, contentWidth);
		doc.text(wrapped, margin, y);
		y += wrapped.length * 11 + 16;
	}
	doc.setFillColor(248, 250, 252);
	doc.roundedRect(margin, y, contentWidth, 48, 4, 4, "F");
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8.5);
	doc.setTextColor(71, 85, 105);
	const declarationText = `Declaramos para os devidos fins que recebemos de ${data.studentName} a importância de ${formatBRL(data.amount)} (${paymentMethodLabel(data.paymentMethod)}), referente aos serviços descritos acima, dando plena e geral quitação.`;
	const splitDec = doc.splitTextToSize(declarationText, contentWidth - 20);
	doc.text(splitDec, 50, y + 16);
	y += 90;
	const sigWidth = 200;
	const sigX = pageWidth / 2 - sigWidth / 2;
	doc.setDrawColor(148, 163, 184);
	doc.setLineWidth(.8);
	doc.line(sigX, y, sigX + sigWidth, y);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(9.5);
	doc.setTextColor(30, 41, 59);
	doc.text(data.businessName || "Studio Coach Montanha", pageWidth / 2, y + 14, { align: "center" });
	doc.setFont("helvetica", "normal");
	doc.setFontSize(8);
	doc.setTextColor(100, 116, 139);
	doc.text("Assinatura do Responsável", pageWidth / 2, y + 26, { align: "center" });
	const filename = `Recibo_${data.studentName.replace(/[^\w\-]+/g, "_")}${data.referenceMonth ? `_${data.referenceMonth}` : ""}.pdf`;
	doc.save(filename);
}
//#endregion
export { renewPayment as n, renewPtPayment as r, downloadReceiptPdf as t };
