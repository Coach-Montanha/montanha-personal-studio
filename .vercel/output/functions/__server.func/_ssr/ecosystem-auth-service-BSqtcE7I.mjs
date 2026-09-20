import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ecosystem-auth-service-BSqtcE7I.js
var DISPOSABLE_EMAIL_DOMAINS = new Set([
	"mailinator.com",
	"tempmail.com",
	"10minutemail.com",
	"guerrillamail.com",
	"throwawaymail.com",
	"yopmail.com",
	"trashmail.com",
	"sharklasers.com",
	"getairmail.com",
	"dispostable.com",
	"disposable.com",
	"temp-mail.org",
	"fakeinbox.com",
	"maildrop.cc",
	"nada.ltd",
	"crazymailing.com",
	"tmail.ws",
	"boun.cr",
	"disposablemail.com",
	"mailcatch.com",
	"inboxalias.com"
]);
function getSupabaseClient() {
	try {
		const url = typeof import.meta !== "undefined" && "https://xhxlzawgrzmtgilrzout.supabase.co" || typeof process !== "undefined" && process.env?.SUPABASE_URL || "";
		const key = typeof import.meta !== "undefined" && "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoeGx6YXdncnptdGdpbHJ6b3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MTEwMjgsImV4cCI6MjA5ODA4NzAyOH0.ze5PYRKE9ogJ96CdBEycMRgz7oVKsQZF5oaBkXw1EbI" || typeof process !== "undefined" && (process.env?.SUPABASE_ANON_KEY || process.env?.SUPABASE_PUBLISHABLE_KEY) || "";
		if (url && key) return createClient(url, key);
	} catch (err) {
		console.warn("[EcosystemAuth] Error initializing Supabase client:", err);
	}
	return null;
}
/**
* 1. validateEmailMx(email: string)
* Validação de sintaxe e servidores MX (rejeitando domínios de e-mails descartáveis).
*/
async function validateEmailMx(email) {
	if (!email || typeof email !== "string") return {
		valid: false,
		reason: "E-mail não fornecido."
	};
	const cleanEmail = email.trim().toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return {
		valid: false,
		reason: "Formato de e-mail inválido."
	};
	const parts = cleanEmail.split("@");
	if (parts.length !== 2) return {
		valid: false,
		reason: "Formato de e-mail inválido."
	};
	const domain = parts[1];
	if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return {
		valid: false,
		reason: `O domínio "${domain}" é um serviço de e-mail descartável não permitido.`
	};
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 3e3);
		const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
			headers: { Accept: "application/dns-json" },
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		if (response.ok) {
			const data = await response.json();
			if (data.Status === 3) return {
				valid: false,
				reason: `O domínio "${domain}" não existe (servidor de e-mail não encontrado).`
			};
			if (data.Status === 0 && (!data.Answer || data.Answer.length === 0)) return {
				valid: false,
				reason: `O domínio "${domain}" não possui registros MX válidos para receber e-mails.`
			};
		}
	} catch (err) {
		console.warn("[EcosystemAuth] DNS MX lookup bypassed:", err);
	}
	return { valid: true };
}
/**
* 4. checkProjectAccess(userId: string | null, projectId: string, email?: string)
* Validação do prazo de validade (access_expires_at) e status de pagamento antes de liberar o aplicativo.
*/
async function checkProjectAccess(userId, projectId, email) {
	const supabase = getSupabaseClient();
	const cleanEmail = email ? email.trim().toLowerCase() : null;
	if (cleanEmail === "albertosarly@gmail.com" || cleanEmail === "coachmontanha1@gmail.com") return {
		hasAccess: true,
		status: "PAGO",
		expiresAt: null,
		message: "Acesso vitalício liberado."
	};
	if (supabase) try {
		let query = supabase.from("ecosystem_subscriptions").select("*").eq("project_id", projectId);
		if (userId) query = query.eq("user_id", userId);
		else if (cleanEmail) query = query.eq("email", cleanEmail);
		const { data, error } = await query.maybeSingle();
		if (error) console.warn("[EcosystemAuth] Error querying subscription access:", error.message);
		else if (data) {
			const sub = data;
			if (!sub.is_active) return {
				hasAccess: false,
				status: sub.payment_status,
				expiresAt: sub.access_expires_at,
				message: "Acesso revogado pelo Administrador para este aplicativo."
			};
			const isExpired = sub.access_expires_at ? new Date(sub.access_expires_at) <= /* @__PURE__ */ new Date() : false;
			if (sub.payment_status === "PAGO" && !isExpired) return {
				hasAccess: true,
				status: "PAGO",
				expiresAt: sub.access_expires_at,
				message: "Acesso liberado."
			};
			if (isExpired) return {
				hasAccess: false,
				status: sub.payment_status,
				expiresAt: sub.access_expires_at,
				message: "Acesso negado: a validade da sua assinatura para este app expirou."
			};
			return {
				hasAccess: false,
				status: sub.payment_status,
				expiresAt: sub.access_expires_at,
				message: `Acesso negado: status de pagamento é ${sub.payment_status}.`
			};
		}
	} catch (err) {
		console.warn("[EcosystemAuth] Exception checking project access:", err);
	}
	if (typeof window !== "undefined") {
		const localSub = localStorage.getItem(`ecosystem_sub_${projectId}_${cleanEmail || userId}`);
		if (localSub) try {
			const parsed = JSON.parse(localSub);
			const isExpired = parsed.access_expires_at ? new Date(parsed.access_expires_at) <= /* @__PURE__ */ new Date() : false;
			if (parsed.payment_status === "PAGO" && !isExpired && parsed.is_active !== false) return {
				hasAccess: true,
				status: "PAGO",
				expiresAt: parsed.access_expires_at,
				message: "Acesso liberado (local)."
			};
		} catch (err) {}
	}
	return {
		hasAccess: true,
		status: "DEMO",
		expiresAt: null,
		message: "Acesso liberado em modo demonstração."
	};
}
var APP_NAMES_MAP = {
	"smart-language": {
		name: "Montanha Language AI",
		url: "http://localhost:5173"
	},
	"eduflow-finance": {
		name: "Montanha Personal Studio",
		url: "http://localhost:5174"
	},
	"construtor-pdf": {
		name: "Montanha PDF Studio",
		url: "http://localhost:5175"
	},
	"sistema-hibrido": {
		name: "Montanha Hybrid Training",
		url: "http://localhost:5176"
	},
	"whatsapp-lovable": {
		name: "Montanha WhatsApp Automation",
		url: "http://localhost:5177"
	},
	"all": {
		name: "Ecossistema Montanha (5 Apps)",
		url: "http://localhost:5174"
	}
};
function generateTempPassword() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let code = "";
	for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * 32));
	return `MTN-${code}`;
}
async function generateTempAccessInvite(clientName, email, phone, projectId, durationDays) {
	const tempPassword = generateTempPassword();
	const cleanEmail = email.trim().toLowerCase();
	const cleanPhone = phone.replace(/\D/g, "");
	let expiresAt = null;
	let validityLabel = "";
	if (durationDays === "vitalicio") {
		const d = /* @__PURE__ */ new Date();
		d.setFullYear(d.getFullYear() + 10);
		expiresAt = d.toISOString();
		validityLabel = "Vitalício (Sem Expiração)";
	} else {
		const days = Number(durationDays) || 30;
		expiresAt = new Date(Date.now() + days * 24 * 3600 * 1e3).toISOString();
		validityLabel = `${days} dias`;
	}
	const appInfo = APP_NAMES_MAP[projectId] || {
		name: projectId,
		url: typeof window !== "undefined" ? window.location.origin : ""
	};
	const expiresFormatted = expiresAt ? expiresAt.split("T")[0] : "Indefinido";
	const inviteText = `Olá, ${clientName}! 🎟️\n\nSeu acesso ao *${appInfo.name}* (Ecossistema Montanha) foi gerado com sucesso!\n\n🔑 *Login:* ${cleanEmail}\n🔒 *Senha Temporária:* ${tempPassword}\n⏳ *Validade:* ${validityLabel} (Até ${expiresFormatted})\n🌐 *Link de Acesso:* ${appInfo.url}\n\nBons treinos e excelentes resultados! 🚀`;
	const whatsappUrl = `https://wa.me/${cleanPhone.startsWith("55") ? cleanPhone : "55" + cleanPhone}?text=${encodeURIComponent(inviteText)}`;
	const projectsToGrant = projectId === "all" ? [
		"smart-language",
		"eduflow-finance",
		"construtor-pdf",
		"sistema-hibrido",
		"whatsapp-lovable"
	] : [projectId];
	const supabase = getSupabaseClient();
	const updatedSubs = [];
	for (const pid of projectsToGrant) {
		const sub = {
			id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			email: cleanEmail,
			project_id: pid,
			payment_status: "PAGO",
			access_expires_at: expiresAt,
			is_active: true,
			created_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		updatedSubs.push(sub);
		if (typeof window !== "undefined") localStorage.setItem(`ecosystem_sub_${pid}_${cleanEmail}`, JSON.stringify(sub));
	}
	if (typeof window !== "undefined") {
		const existingRaw = localStorage.getItem("master_admin_subscriptions");
		let existing = [];
		if (existingRaw) try {
			existing = JSON.parse(existingRaw);
		} catch (e) {}
		const combined = [...updatedSubs, ...existing];
		localStorage.setItem("master_admin_subscriptions", JSON.stringify(combined));
	}
	if (supabase) try {
		await supabase.from("ecosystem_subscriptions").upsert(updatedSubs);
	} catch (err) {
		console.warn("[EcosystemAuth] Supabase sync for invite failed:", err);
	}
	return {
		success: true,
		tempPassword,
		expiresAt,
		validityLabel,
		whatsappUrl,
		inviteText,
		message: "Convite e senha temporária gerados com sucesso!"
	};
}
//#endregion
export { generateTempAccessInvite as n, validateEmailMx as r, checkProjectAccess as t };
