/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		return await handleRequest(request);
	},
};

async function handleRequest(request) {
	const url = new URL(request.url);
	const targetUrl = url.pathname.slice(1) + url.search;

	if (!targetUrl.startsWith('http')) {
		return new Response('Invalid URL', { status: 400 });
	}

	const init = {
		method: request.method,
		headers: request.headers,
		body: request.body,
		redirect: 'follow',
	};

	try {
		const response = await fetch(targetUrl, init);

		const headers = new Headers(response.headers);
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

		const body = await response.text();
		return new Response(body, {
			status: response.status,
			statusText: response.statusText,
			headers: headers,
		});
	} catch (error) {
		return new Response('Error: ' + error.message, { status: 500 });
	}
}
