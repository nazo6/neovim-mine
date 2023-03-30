import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { onDestroy } from 'svelte';

export function queryParamStore<T extends string>(name: string, init: T) {
	let requestParam: null | string = null;
	if (browser) {
		requestParam = new URLSearchParams(window.location.search).get(name);
	}

	const store = writable<T>((requestParam as T) ?? init);

	const unsubscribe = store.subscribe((v) => {
		if (!browser) return;
		const newParams = new URL(window.location.toString());
		newParams.searchParams.set(name, v);
		history.pushState(null, '', newParams.toString());
	});

	onDestroy(unsubscribe);

	return store;
}

export function arrayQueryParamStore<T extends string[]>(name: string, init: T) {
	let requestParam: null | string[] = null;
	if (browser) {
		const rawRequestParam = new URLSearchParams(window.location.search).get(name);
		if (rawRequestParam) {
			requestParam = decodeURIComponent(rawRequestParam).split(',');
		}
	}

	const store = writable<T>((requestParam as T) ?? init);

	const unsubscribe = store.subscribe((v) => {
		if (!browser) return;
		const newParams = new URL(window.location.toString());
		newParams.searchParams.set(name, encodeURIComponent(v.join('|')));
		history.pushState(null, '', newParams.toString());
	});

	onDestroy(unsubscribe);

	return store;
}
