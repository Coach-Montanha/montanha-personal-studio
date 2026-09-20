import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Kt as Dumbbell, Ln as ArrowLeft, O as Sparkles, Ot as Image, ct as MessageCircle, g as Trophy, n as X, qt as Download, sn as CircleCheck, v as TrendingUp, vn as Camera } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-C0L5fFXX.mjs";
import { t as supabase } from "./client-CCQALzHq.mjs";
import { n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C26xL9O3.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as toPng } from "../_libs/html-to-image.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WorkoutSummaryDialog-EMqTb5_R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseNumericLoad(s) {
	if (s === null || s === void 0) return null;
	if (typeof s === "number") return s;
	const m = String(s).replace(",", ".").trim().match(/-?\d+(?:\.\d+)?/);
	return m ? Number(m[0]) : null;
}
function parseReps(s) {
	if (typeof s === "number") return s;
	if (!s) return 10;
	const cleaned = String(s).toLowerCase();
	const matchReps = (cleaned.includes("x") ? cleaned.split("x").slice(1).join("x") : cleaned).match(/(\d+)(?:\s*-\s*\d+)?/);
	if (matchReps && matchReps[1]) {
		const val = parseInt(matchReps[1], 10);
		return isNaN(val) || val <= 0 ? 10 : val;
	}
	return 10;
}
function WorkoutSummaryDialog({ open, onOpenChange, dayName, duration, exercises, loads, feedback, executionId, initialExcludedExercises, onExcludedExercisesChange, completedSets, doneExercises: doneProp, previousExecutions = [], studentName = "Aluno" }) {
	const [viewMode, setViewMode] = (0, import_react.useState)("summary");
	const [bgImage, setBgImage] = (0, import_react.useState)(null);
	const [logoImage, setLogoImage] = (0, import_react.useState)(null);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [excludedIds, setExcludedIds] = (0, import_react.useState)(initialExcludedExercises || []);
	const storyCardRef = (0, import_react.useRef)(null);
	const candidateExercises = (0, import_react.useMemo)(() => {
		return exercises.filter((ex) => !ex.substitute_exercise_id);
	}, [exercises]);
	const isExercisePerformed = (ex) => {
		const isDone = Array.isArray(doneProp) ? doneProp.includes(ex.id) : !!doneProp?.[ex.id];
		const sets = completedSets?.[ex.id];
		const hasSets = Array.isArray(sets) && sets.length > 0;
		const hasLoad = !!(loads && loads[ex.id] && String(loads[ex.id]).trim());
		if (completedSets !== void 0 || doneProp !== void 0) return isDone || hasSets || hasLoad;
		return true;
	};
	(0, import_react.useEffect)(() => {
		if (open) {
			setViewMode("summary");
			const unperformedIds = candidateExercises.filter((ex) => !isExercisePerformed(ex)).map((ex) => ex.id);
			setExcludedIds(Array.from(new Set([...initialExcludedExercises || [], ...unperformedIds])));
		}
	}, [open, initialExcludedExercises]);
	(0, import_react.useEffect)(() => {
		async function loadLogo() {
			const { data } = await supabase.from("studio_settings").select("logo_pt_base64").maybeSingle();
			if (data?.logo_pt_base64) setLogoImage(data.logo_pt_base64);
			else {
				const savedLogo = localStorage.getItem("coach.logo.pt");
				if (savedLogo) setLogoImage(savedLogo);
			}
		}
		if (open) loadLogo();
	}, [open]);
	const performedList = (0, import_react.useMemo)(() => {
		return candidateExercises.filter((ex) => !excludedIds.includes(ex.id));
	}, [candidateExercises, excludedIds]);
	const durationHours = Math.floor(duration / 3600);
	const durationMins = Math.floor(duration % 3600 / 60);
	const durationHuman = durationHours > 0 ? `${durationHours}h${String(durationMins).padStart(2, "0")}` : `${Math.max(1, durationMins)}min`;
	const totalReps = (0, import_react.useMemo)(() => {
		return performedList.reduce((acc, ex) => {
			const sets = completedSets?.[ex.id];
			return acc + (Array.isArray(sets) && sets.length > 0 ? sets.length : typeof ex.series === "number" && ex.series > 0 ? ex.series : 3) * parseReps(ex.sets_reps);
		}, 0);
	}, [performedList, completedSets]);
	const totalVolumeKg = (0, import_react.useMemo)(() => {
		return performedList.reduce((acc, ex) => {
			const sets = completedSets?.[ex.id];
			const count = Array.isArray(sets) && sets.length > 0 ? sets.length : typeof ex.series === "number" && ex.series > 0 ? ex.series : 3;
			const reps = parseReps(ex.sets_reps);
			const loadVal = parseNumericLoad(loads[ex.id] || ex.load) || 0;
			return acc + count * reps * loadVal;
		}, 0);
	}, [
		performedList,
		completedSets,
		loads
	]);
	const formattedVolume = `${Math.round(totalVolumeKg).toLocaleString("pt-BR")}kg`;
	const now = /* @__PURE__ */ new Date();
	const startDate = /* @__PURE__ */ new Date(now.getTime() - Math.max(60, duration) * 1e3);
	const formatDateTime = (d) => {
		return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
	};
	const personalRecords = (0, import_react.useMemo)(() => {
		const list = [];
		performedList.forEach((ex) => {
			const currentLoad = parseNumericLoad(loads[ex.id] || ex.load);
			if (!currentLoad || currentLoad <= 0) return;
			let previousMax = null;
			previousExecutions.forEach((exec) => {
				if (!exec.notes) return;
				try {
					const prevLoads = (typeof exec.notes === "string" ? JSON.parse(exec.notes) : exec.notes).loads || {};
					const n = parseNumericLoad(prevLoads[ex.id] || prevLoads[ex.name]);
					if (n && (previousMax === null || n > previousMax)) previousMax = n;
				} catch {}
			});
			if (previousMax !== null && currentLoad > previousMax) list.push({
				exerciseId: ex.id,
				name: ex.name,
				previousMax,
				newRecord: currentLoad
			});
		});
		return list;
	}, [
		performedList,
		loads,
		previousExecutions
	]);
	const progressions = (0, import_react.useMemo)(() => {
		const list = [];
		performedList.forEach((ex) => {
			const currentLoad = parseNumericLoad(loads[ex.id] || ex.load) || 0;
			const currentSets = completedSets?.[ex.id];
			const currentSetsCount = Array.isArray(currentSets) && currentSets.length > 0 ? currentSets.length : typeof ex.series === "number" && ex.series > 0 ? ex.series : 3;
			const currentRepsTotal = parseReps(ex.sets_reps) * currentSetsCount;
			let foundPrevLoad = null;
			let foundPrevReps = null;
			for (const exec of previousExecutions) {
				if (!exec.notes) continue;
				try {
					const parsed = typeof exec.notes === "string" ? JSON.parse(exec.notes) : exec.notes;
					const prevLoads = parsed.loads || {};
					const rawVal = prevLoads[ex.id] || prevLoads[ex.name];
					if (rawVal !== void 0) {
						foundPrevLoad = parseNumericLoad(rawVal) || 0;
						const pSets = parsed.completedSets?.[ex.id];
						const pCount = Array.isArray(pSets) && pSets.length > 0 ? pSets.length : 3;
						foundPrevReps = parseReps(ex.sets_reps) * pCount;
						break;
					}
				} catch {}
			}
			if (foundPrevLoad !== null && foundPrevLoad !== void 0) {
				const loadChanged = currentLoad > foundPrevLoad;
				const repsChanged = foundPrevReps !== null && currentRepsTotal > foundPrevReps;
				if (loadChanged || repsChanged) list.push({
					exerciseId: ex.id,
					name: ex.name,
					loadProgression: loadChanged ? {
						from: foundPrevLoad,
						to: currentLoad
					} : void 0,
					repsProgression: repsChanged && foundPrevReps ? {
						from: foundPrevReps,
						to: currentRepsTotal
					} : void 0
				});
			}
		});
		return list;
	}, [
		performedList,
		loads,
		completedSets,
		previousExecutions
	]);
	const handleImageFile = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setBgImage(reader.result);
				setViewMode("share");
			};
			reader.readAsDataURL(file);
		}
	};
	const generateImage = async () => {
		const node = storyCardRef.current;
		if (!node) return null;
		setGenerating(true);
		try {
			const dataUrl = await toPng(node, {
				quality: .98,
				cacheBust: true,
				pixelRatio: 3
			});
			setGenerating(false);
			return dataUrl;
		} catch (err) {
			console.error(err);
			toast.error("Erro ao gerar imagem");
			setGenerating(false);
			return null;
		}
	};
	const handleShareWhatsApp = async () => {
		const dataUrl = await generateImage();
		if (!dataUrl) return;
		if (navigator.share && navigator.canShare) try {
			const blob = await (await fetch(dataUrl)).blob();
			const file = new File([blob], "treino.png", { type: "image/png" });
			if (navigator.canShare({ files: [file] })) {
				await navigator.share({
					files: [file],
					title: "Meu Treino no Studio Coach Montanha",
					text: `Treino ${dayName} concluído em ${durationHuman}! Volume: ${formattedVolume}, Reps: ${totalReps}x 💪`
				});
				return;
			}
		} catch (err) {
			console.error(err);
		}
		const prsText = personalRecords.map((pr) => `🏆 ${pr.name}: ${pr.previousMax}kg → *${pr.newRecord}kg*`).join("\n");
		const progsText = progressions.map((p) => {
			let text = `📈 ${p.name}: `;
			if (p.loadProgression) text += `${p.loadProgression.from}kg → *${p.loadProgression.to}kg*`;
			if (p.repsProgression) text += ` • ${p.repsProgression.from}x → *${p.repsProgression.to}x*`;
			return text;
		}).join("\n");
		const text = encodeURIComponent(`*Treino Concluído!* 💪\n\n*Rotina:* ${dayName}\n*Duração:* ${durationHuman}\n*Volume:* ${formattedVolume}\n*Reps Totais:* ${totalReps}x\n\n${prsText ? `*Recordes Pessoais:*\n${prsText}\n\n` : ""}${progsText ? `*Progressões:*\n${progsText}\n\n` : ""}Studio Coach Montanha ⚡`);
		window.open(`https://wa.me/?text=${text}`, "_blank");
	};
	const handleDownload = async (isInstagram = false) => {
		const dataUrl = await generateImage();
		if (!dataUrl) return;
		const link = document.createElement("a");
		link.download = `treino-${(/* @__PURE__ */ new Date()).getTime()}.png`;
		link.href = dataUrl;
		link.click();
		if (isInstagram) {
			toast.success("Imagem salva! Agora abra o Instagram para postar no Story.");
			setTimeout(() => {
				window.location.href = "instagram://story-camera";
				setTimeout(() => {
					if (document.hasFocus()) window.open("https://www.instagram.com", "_blank");
				}, 1e3);
			}, 500);
		} else toast.success("Imagem salva com sucesso na galeria!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-[95vw] sm:max-w-md bg-zinc-950 text-white border border-zinc-800 p-4 sm:p-6 rounded-3xl shadow-2xl overflow-y-auto max-h-[95vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					id: "camera-input",
					className: "hidden",
					accept: "image/*",
					capture: "environment",
					onChange: handleImageFile
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					id: "gallery-input",
					className: "hidden",
					accept: "image/*",
					onChange: handleImageFile
				}),
				viewMode === "summary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 animate-in fade-in duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
									className: "text-xl font-bold tracking-tight text-white",
									children: "Treino concluído"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onOpenChange(false),
								className: "flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors",
								"aria-label": "Fechar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-1 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums",
									children: durationHuman
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1",
									children: "Duração"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-x border-zinc-800/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums",
										children: ["• ", formattedVolume]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1",
										children: "Volume"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums",
									children: [
										"• ",
										totalReps,
										"x"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1",
									children: "Reps/Tempo"
								})] })
							]
						}),
						personalRecords.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-4 space-y-3 shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4 text-amber-400 fill-amber-400/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recordes pessoais" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: personalRecords.map((pr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs sm:text-sm py-1 border-b border-zinc-800/50 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-zinc-200 truncate pr-2",
										children: pr.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 font-mono text-xs sm:text-sm tabular-nums shrink-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-zinc-400",
												children: [pr.previousMax, "kg"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-zinc-500",
												children: "→"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30",
												children: [pr.newRecord, "kg"]
											})
										]
									})]
								}, pr.exerciseId))
							})]
						}),
						progressions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-4 space-y-3 shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progressões" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: progressions.map((prog) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs sm:text-sm py-1 border-b border-zinc-800/50 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-zinc-200 truncate pr-2",
										children: prog.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 font-mono text-xs sm:text-sm tabular-nums shrink-0",
										children: [
											prog.loadProgression && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-zinc-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-zinc-400",
														children: [prog.loadProgression.from, "kg"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-zinc-500 mx-1",
														children: "→"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20",
														children: [prog.loadProgression.to, "kg"]
													})
												]
											}),
											prog.loadProgression && prog.repsProgression && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-zinc-600",
												children: "•"
											}),
											prog.repsProgression && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-zinc-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-zinc-400",
														children: [prog.repsProgression.from, "x"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-zinc-500 mx-1",
														children: "→"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20",
														children: [prog.repsProgression.to, "x"]
													})
												]
											})
										]
									})]
								}, prog.exerciseId))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-2 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm font-semibold text-zinc-300",
								children: "Que tal compartilhar esse resultado?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										onClick: () => document.getElementById("camera-input")?.click(),
										className: "w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 text-sm shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5" }), " Tirar uma foto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => document.getElementById("gallery-input")?.click(),
										className: "w-full h-12 rounded-2xl border-orange-500/40 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 font-bold gap-2 text-sm active:scale-[0.98] transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-5 w-5" }), " Escolher da galeria"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-4 pt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setViewMode("share"),
												className: "text-xs font-semibold text-primary hover:underline transition-colors py-1 cursor-pointer",
												children: "Ver card para Story sem foto"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-zinc-600",
												children: "•"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onOpenChange(false),
												className: "text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors py-1 cursor-pointer",
												children: "Pular"
											})
										]
									})
								]
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 animate-in fade-in duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setViewMode("summary"),
									className: "gap-1.5 text-xs text-zinc-400 hover:text-white px-2 h-8 rounded-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Voltar"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Story de Vitória"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onOpenChange(false),
									className: "flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white",
									"aria-label": "Fechar",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center w-full overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: storyCardRef,
								className: "relative w-full max-w-[340px] aspect-[9/16] min-h-[580px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-5 text-white select-none border border-white/10",
								style: { background: bgImage ? `url(${bgImage}) center/cover no-repeat` : "linear-gradient(155deg, #09090b 0%, #18181b 45%, #050505 100%)" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85 backdrop-blur-[2px] pointer-events-none" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between border-b border-white/15 pb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2",
												children: logoImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: logoImage,
													className: "h-7 max-w-[100px] object-contain rounded",
													alt: "Logo"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-3.5 w-3.5" }), " Studio Coach Montanha"]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-medium text-zinc-400",
												children: dayName
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2 rounded-xl bg-black/40 border border-white/10 p-2.5 backdrop-blur-md",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[9px] uppercase font-bold text-zinc-400",
												children: "Data de início"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] font-mono font-bold text-zinc-200 mt-0.5",
												children: formatDateTime(startDate)
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "border-l border-white/10 pl-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[9px] uppercase font-bold text-zinc-400",
													children: "Data de fim"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] font-mono font-bold text-zinc-200 mt-0.5",
													children: formatDateTime(now)
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 my-auto space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-2xl bg-black/50 border border-white/15 p-3.5 backdrop-blur-md space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] uppercase font-bold text-zinc-400 block",
														children: "Duração"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-base font-black font-mono text-white",
														children: durationHuman
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-right",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] uppercase font-bold text-zinc-400 block",
															children: "Reps"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-base font-black font-mono text-white",
															children: [totalReps, "x"]
														})]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "border-t border-white/10 pt-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] uppercase font-bold text-zinc-400 block",
														children: "Volume"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xl font-black font-mono text-orange-400",
														children: formattedVolume
													})]
												})]
											}),
											personalRecords.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-2xl bg-black/50 border border-amber-500/25 p-3 backdrop-blur-md space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5" }), " Recordes pessoais"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-1 max-h-24 overflow-hidden",
													children: personalRecords.slice(0, 3).map((pr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-[11px]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-zinc-200 font-semibold truncate pr-2",
															children: pr.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-mono text-[11px] shrink-0",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-zinc-400",
																	children: [pr.previousMax, "kg"]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-zinc-500 mx-1",
																	children: "→"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
																	className: "text-amber-400",
																	children: [pr.newRecord, "kg"]
																})
															]
														})]
													}, pr.exerciseId))
												})]
											}),
											progressions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-2xl bg-black/50 border border-emerald-500/25 p-3 backdrop-blur-md space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), " Progressões"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-1 max-h-24 overflow-hidden",
													children: progressions.slice(0, 3).map((prog) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-[11px]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-zinc-200 font-semibold truncate pr-2",
															children: prog.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-mono text-[11px] shrink-0 text-emerald-400 font-bold",
															children: [prog.loadProgression && `${prog.loadProgression.from}kg → ${prog.loadProgression.to}kg`, prog.repsProgression && ` • ${prog.repsProgression.from}x → ${prog.repsProgression.to}x`]
														})]
													}, prog.exerciseId))
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 pt-2 border-t border-white/15 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] font-bold text-zinc-400",
												children: "Aluno em evolução:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-black text-white tracking-wide",
												children: studentName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[9px] uppercase tracking-[0.25em] text-orange-400 font-extrabold mt-0.5",
												children: "Missão Cumprida"
											})
										]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => document.getElementById("camera-input")?.click(),
									className: "h-10 rounded-xl border-zinc-800 text-xs font-semibold gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }),
										" ",
										bgImage ? "Tirar Outra" : "Tirar Foto"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => document.getElementById("gallery-input")?.click(),
									className: "h-10 rounded-xl border-zinc-800 text-xs font-semibold gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }), " Galeria"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										className: "h-11 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-95 font-bold text-xs gap-1.5",
										onClick: () => handleDownload(true),
										disabled: generating,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Instagram Story"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										className: "h-11 rounded-xl border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 font-bold text-xs gap-1.5",
										onClick: handleShareWhatsApp,
										disabled: generating,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " WhatsApp"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										className: "h-11 rounded-xl border-zinc-800 text-zinc-200 hover:bg-zinc-900 font-bold text-xs gap-1.5",
										onClick: () => handleDownload(false),
										disabled: generating,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Baixar PNG"]
									})
								]
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { WorkoutSummaryDialog as t };
