import { a as dehydrate, o as hydrate } from "../tanstack__query-core.mjs";
//#region node_modules/@tanstack/query-persist-client-core/build/modern/persist.js
var cacheEventTypes = [
	"added",
	"removed",
	"updated"
];
function isCacheEventType(eventType) {
	return cacheEventTypes.includes(eventType);
}
async function persistQueryClientRestore({ queryClient, persister, maxAge = 1e3 * 60 * 60 * 24, buster = "", hydrateOptions }) {
	try {
		const persistedClient = await persister.restoreClient();
		if (persistedClient) if (persistedClient.timestamp) {
			const expired = Date.now() - persistedClient.timestamp > maxAge;
			const busted = persistedClient.buster !== buster;
			if (expired || busted) return persister.removeClient();
			else hydrate(queryClient, persistedClient.clientState, hydrateOptions);
		} else return persister.removeClient();
	} catch (err) {
		await persister.removeClient();
		throw err;
	}
}
async function persistQueryClientSave({ queryClient, persister, buster = "", dehydrateOptions }) {
	const persistClient = {
		buster,
		timestamp: Date.now(),
		clientState: dehydrate(queryClient, dehydrateOptions)
	};
	await persister.persistClient(persistClient);
}
function persistQueryClientSubscribe(props) {
	const unsubscribeQueryCache = props.queryClient.getQueryCache().subscribe((event) => {
		if (isCacheEventType(event.type)) persistQueryClientSave(props);
	});
	const unsubscribeMutationCache = props.queryClient.getMutationCache().subscribe((event) => {
		if (isCacheEventType(event.type)) persistQueryClientSave(props);
	});
	return () => {
		unsubscribeQueryCache();
		unsubscribeMutationCache();
	};
}
function persistQueryClient(props) {
	let hasUnsubscribed = false;
	let persistQueryClientUnsubscribe;
	const unsubscribe = () => {
		hasUnsubscribed = true;
		persistQueryClientUnsubscribe?.();
	};
	return [unsubscribe, persistQueryClientRestore(props).then(() => {
		if (!hasUnsubscribed) persistQueryClientUnsubscribe = persistQueryClientSubscribe(props);
	})];
}
//#endregion
export { persistQueryClient as t };
