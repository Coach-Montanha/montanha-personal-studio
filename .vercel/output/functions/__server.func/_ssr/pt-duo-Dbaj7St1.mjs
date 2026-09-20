import { t as supabase } from "./client-CCQALzHq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pt-duo-Dbaj7St1.js
var SCOPES = "https://www.googleapis.com/auth/calendar.events";
async function getGcalToken() {
	const clientId = localStorage.getItem("edufinance.gcalClientId");
	if (!clientId) return null;
	return new Promise((resolve) => {
		if (!window.google) {
			const script = document.createElement("script");
			script.src = "https://accounts.google.com/gsi/client";
			script.onload = () => initTokenClient(clientId, resolve);
			script.onerror = () => resolve(null);
			document.head.appendChild(script);
		} else initTokenClient(clientId, resolve);
	});
}
function initTokenClient(clientId, resolve) {
	window.google.accounts.oauth2.initTokenClient({
		client_id: clientId,
		scope: SCOPES,
		callback: (response) => {
			if (response.error) {
				resolve(null);
				return;
			}
			resolve(response.access_token);
		}
	}).requestAccessToken({ prompt: "consent" });
}
async function addSessionToCalendar(params) {
	const token = await getGcalToken();
	if (!token) return false;
	const calendarId = localStorage.getItem("edufinance.gcalId") ?? "primary";
	const { studentName, sessionDate, sessionTime, durationMinutes, notes } = params;
	const time = sessionTime.length >= 5 ? sessionTime.slice(0, 5) : sessionTime;
	const startDateTime = `${sessionDate}T${time}`;
	const endDate = /* @__PURE__ */ new Date(`${sessionDate}T${time}`);
	endDate.setMinutes(endDate.getMinutes() + durationMinutes);
	const pad = (n) => String(n).padStart(2, "0");
	const endDateTime = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
	const event = {
		summary: `Aula PT — ${studentName}`,
		description: notes ?? `Sessão de Personal Trainer com ${studentName}`,
		start: {
			dateTime: startDateTime + ":00",
			timeZone: "America/Sao_Paulo"
		},
		end: {
			dateTime: endDateTime + ":00",
			timeZone: "America/Sao_Paulo"
		},
		reminders: {
			useDefault: false,
			overrides: [{
				method: "popup",
				minutes: 30
			}]
		}
	};
	try {
		return (await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(event)
		})).ok;
	} catch {
		return false;
	}
}
var DUO_TAG_REGEX = /\[DUO_PARTNER:([a-f0-9-]+)\]/i;
/**
* Extrai o ID do parceiro de treino e retorna as notas limpas sem a tag técnica.
*/
function parseStudentPartner(notes) {
	if (!notes) return {
		cleanNotes: "",
		partnerId: null
	};
	const match = notes.match(DUO_TAG_REGEX);
	const partnerId = match ? match[1] : null;
	return {
		cleanNotes: notes.replace(/\[DUO_PARTNER:[a-f0-9-]+\]\r?\n?/gi, "").trim(),
		partnerId
	};
}
/**
* Constrói o texto de notas preservando a tag de parceiro de treino.
*/
function buildStudentPartnerNotes(cleanNotes, partnerId) {
	const base = (cleanNotes ?? "").trim();
	if (!partnerId) return base;
	return base ? `${base}\n[DUO_PARTNER:${partnerId}]` : `[DUO_PARTNER:${partnerId}]`;
}
/**
* Garante a sincronização bidirecional entre dois alunos parceiros de treino.
* Ao vincular o Aluno A ao Aluno B, o Aluno B também recebe o vínculo com o Aluno A.
* Se o vínculo for alterado ou removido, o antigo parceiro é desvinculado.
*/
async function syncDuoPartners(studentAId, oldPartnerId, newPartnerId) {
	if (oldPartnerId === newPartnerId) return;
	if (oldPartnerId && oldPartnerId !== newPartnerId) try {
		const { data: oldStudent } = await supabase.from("pt_students").select("notes").eq("id", oldPartnerId).single();
		if (oldStudent) {
			const { cleanNotes, partnerId } = parseStudentPartner(oldStudent.notes);
			if (partnerId === studentAId) await supabase.from("pt_students").update({ notes: cleanNotes || null }).eq("id", oldPartnerId);
		}
	} catch (e) {
		console.error("Erro ao desvincular antigo parceiro:", e);
	}
	if (newPartnerId) try {
		const { data: newStudent } = await supabase.from("pt_students").select("notes").eq("id", newPartnerId).single();
		if (newStudent) {
			const { cleanNotes } = parseStudentPartner(newStudent.notes);
			const updatedNotes = buildStudentPartnerNotes(cleanNotes, studentAId);
			await supabase.from("pt_students").update({ notes: updatedNotes }).eq("id", newPartnerId);
		}
	} catch (e) {
		console.error("Erro ao vincular novo parceiro:", e);
	}
}
//#endregion
export { syncDuoPartners as i, buildStudentPartnerNotes as n, parseStudentPartner as r, addSessionToCalendar as t };
