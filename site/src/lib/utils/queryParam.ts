import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { onDestroy } from 'svelte';
import { goto } from '$app/navigation';

export function queryParamStore<T extends string>(name: string, init: T) {
	let requestParam: null | string = null;
	if (browser) {
		requestParam = new URLSearchParams(window.location.search).get(name);
	}

	const store = writable<T>((requestParam as T) ?? init);

	const unsubscribe = store.subscribe(async (v) => {
		if (!browser) return;
		const newParams = new URL(window.location.toString());
		newParams.searchParams.set(name, v);
		await goto(newParams.toString(), { keepFocus: true });
	});

	onDestroy(unsubscribe);

	return store;
}

export function arrayQueryParamStore<T extends string[]>(name: string, init: T) {
	let requestParam: null | string[] = null;
	if (browser) {
		const rawRequestParam = new URLSearchParams(window.location.search).getAll(name);
		if (rawRequestParam) {
			requestParam = rawRequestParam.map((v) => decodeURIComponent(v));
		}
	}

	const store = writable<T>((requestParam as T) ?? init);

	const unsubscribe = store.subscribe(async (v) => {
		if (!browser) return;
		const newParams = new URL(window.location.toString());
		newParams.searchParams.delete(name);
		v.forEach((v) => newParams.searchParams.append(name, encodeURIComponent(v)));
		await goto(newParams.toString(), { keepFocus: true });
	});

	onDestroy(unsubscribe);

	return store;
}
