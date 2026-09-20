import { t as supabase } from "./_ssr/client-CCQALzHq.mjs";
import { j as redirect, m as createFileRoute, p as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-AYP6ZP_0.js
var oauth = supabase.auth.oauth;
var $$splitErrorComponentImporter = () => import("./_._lovable.oauth.consent-C7KIV-gA.mjs");
var $$splitComponentImporter = () => import("./_._lovable.oauth.consent-Bc-Y-9Cz.mjs");
var Route = createFileRoute("/.lovable/oauth/consent")({
	ssr: false,
	validateSearch: (s) => ({ authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "" }),
	beforeLoad: async ({ search, location }) => {
		if (!search.authorization_id) throw new Error("authorization_id ausente");
		const { data } = await supabase.auth.getSession();
		const next = location.pathname + location.searchStr;
		if (!data.session) throw redirect({
			to: "/auth",
			search: { next }
		});
	},
	loader: async ({ location }) => {
		const authorizationId = new URLSearchParams(location.search).get("authorization_id");
		const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
		if (error) throw new Error(error.message);
		const immediate = data?.redirect_url ?? data?.redirect_to;
		if (immediate && !data?.client) throw redirect({ href: immediate });
		return data;
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
//#endregion
export { oauth as n, Route as t };
