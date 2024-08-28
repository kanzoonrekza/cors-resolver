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

	// Handle CORS preflight request
	if (request.method === 'OPTIONS') {
		return handleOptions(request);
	}

	const init = {
		method: request.method,
		headers: request.headers,
		body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
		redirect: 'follow',
	};

	try {
		const response = await fetch(targetUrl, init);

		const headers = new Headers(response.headers);
		headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
		headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
		headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-mal-client-id');
		headers.set('Vary', 'Origin');

		let body;
    const contentType = response.headers.get('Content-Type') || '';
    
    if (contentType.includes('application/json')) {
      body = JSON.stringify(await response.json());
    } else if (contentType.includes('text/')) {
      body = await response.text();
    } else {
      body = await response.blob();
    }

		return new Response(body, {
			status: response.status,
			statusText: response.statusText,
			headers: headers,
		});
	} catch (error) {
		return new Response('Error: ' + error.message, { status: 500 });
	}
}

function handleOptions(request) {
	const headers = new Headers();
	headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
	headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
	headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-mal-client-id');
	headers.set('Access-Control-Max-Age', '86400'); // Cache the preflight response for 24 hours
	headers.set('Vary', 'Origin');

	return new Response(null, {
		status: 204,
		headers: headers,
	});
}
