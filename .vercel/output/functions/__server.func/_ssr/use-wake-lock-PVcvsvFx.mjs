import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-wake-lock-PVcvsvFx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useWakeLock(enabled = true) {
	(0, import_react.useEffect)(() => {
		if (!enabled || typeof window === "undefined" || !("wakeLock" in navigator)) return;
		let wakeLock = null;
		const requestWakeLock = async () => {
			try {
				wakeLock = await navigator.wakeLock.request("screen");
				console.log("Wake Lock is active");
				wakeLock.addEventListener("release", () => {
					console.log("Wake Lock was released");
				});
			} catch (err) {
				console.error(`${err.name}, ${err.message}`);
			}
		};
		requestWakeLock();
		const handleVisibilityChange = async () => {
			if (wakeLock !== null && document.visibilityState === "visible") await requestWakeLock();
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			if (wakeLock) {
				wakeLock.release();
				wakeLock = null;
			}
		};
	}, [enabled]);
}
//#endregion
export { useWakeLock as t };
