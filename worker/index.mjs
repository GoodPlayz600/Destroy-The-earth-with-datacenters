import { gameApi } from './game-api.mjs';
import { files } from 'clearcut:assets';

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path.startsWith('/api/game/')) {
      try {
        return await gameApi(request, env);
      } catch (failure) {
        console.error('Game API request failed', failure);
        return Response.json({ error: 'Online services are temporarily unavailable.' }, {
          status: 503,
          headers: { 'Cache-Control': 'private, no-store' },
        });
      }
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const asset = files[path === '/' ? '/index.html' : path];
    if (!asset) return new Response('Not found', { status: 404 });
    const [type, packed, data] = asset;
    let body = null;
    if (request.method === 'GET') {
      const bytes = Uint8Array.from(atob(data), character => character.charCodeAt(0));
      body = packed ? new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')) : bytes;
    }
    return new Response(body, {
      headers: {
        'Content-Type': type,
        'Cache-Control': path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });
  },
};
