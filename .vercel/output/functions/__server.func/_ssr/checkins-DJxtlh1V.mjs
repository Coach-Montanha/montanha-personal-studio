//#region node_modules/.nitro/vite/services/ssr/assets/checkins-DJxtlh1V.js
function addDays(iso, days) {
	const d = /* @__PURE__ */ new Date(`${iso}T00:00:00`);
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}
/** Distribui os check-ins (FIFO) entre os pagamentos de planos do tipo pacote. */
function allocateCheckins(payments, attendanceDates, freezes = []) {
	const result = /* @__PURE__ */ new Map();
	const packages = payments.filter((p) => p.status === "paid" && p.plans?.checkin_quota_type === "package").sort((a, b) => a.payment_date < b.payment_date ? -1 : 1).map((p) => {
		const freezeDays = (freezes ?? []).filter((f) => f.payment_id === p.id).reduce((s, f) => s + Number(f.freeze_days ?? 0), 0);
		const quota = p.checkin_quota_override ?? p.plans?.checkin_quota_amount ?? 0;
		const validDays = p.plans?.package_valid_days ?? null;
		return {
			id: p.id,
			start: p.payment_date.slice(0, 10),
			validUntil: validDays != null ? addDays(p.payment_date.slice(0, 10), validDays + freezeDays) : null,
			quota,
			isOverride: p.checkin_quota_override != null,
			freezeDays,
			used: []
		};
	});
	if (!packages.length) return result;
	const dates = [...attendanceDates].map((d) => d.slice(0, 10)).sort();
	for (const date of dates) {
		const target = packages.find((pk) => pk.used.length < pk.quota && date >= pk.start && (!pk.validUntil || date <= pk.validUntil));
		if (target) target.used.push(date);
	}
	for (const pk of packages) result.set(pk.id, {
		quota: pk.quota,
		isOverride: pk.isOverride,
		used: pk.used,
		validUntil: pk.validUntil,
		freezeDays: pk.freezeDays
	});
	return result;
}
function checkinTone(remaining, quota) {
	if (remaining <= 0) return "destructive";
	if (remaining <= Math.max(1, Math.ceil(quota * .2))) return "warning";
	return "primary";
}
/** Classe do chip compacto de check-ins, por estado semântico. */
function checkinChipClass(tone) {
	return tone === "destructive" ? "border-destructive/30 bg-destructive/10 text-destructive" : tone === "warning" ? "border-warning/40 bg-warning/15 text-foreground" : "border-primary/25 bg-primary/10 text-primary";
}
//#endregion
export { checkinChipClass as n, checkinTone as r, allocateCheckins as t };
