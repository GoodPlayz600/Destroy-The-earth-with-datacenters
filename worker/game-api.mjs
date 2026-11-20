import { TOTAL } from '../src/catalog.ts';
import { desertified } from '../src/land.ts';
import { validateSave } from '../src/storage.ts';

const maxSaveBytes = 32 * 1024 * 1024;
const modes = new Set(['standard', 'noCompute', 'leanPower']);
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (data, status = 200) => Response.json(data, { status, headers });
const error = (message, status) => json({ error: message }, status);
const metadata = (object) => object ? { revision: object.etag, savedAt: object.uploaded.toISOString(), bytes: object.size } : null;

async function readBytes(request, limit) {
  if (Number(request.headers.get('Content-Length')) > limit) return null;
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function parseSave(bytes) {
  return validateSave(JSON.parse(new TextDecoder().decode(bytes)));
}

export async function gameApi(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  const player = request.headers.get('oai-authenticated-user-id');
  const signedIn = Boolean(player);

  if (!env.DB || !env.SAVES) return error('Online services are temporarily unavailable.', 503);
  if (path === '/api/game/leaderboard' && method === 'GET') {
    const mode = url.searchParams.get('mode') ?? 'standard';
    if (!modes.has(mode)) return error('Unknown campaign mode.', 400);
    const { results } = await env.DB.prepare(`
      SELECT name, cells, earned, completion, updated_at AS updatedAt,
        CASE WHEN player_id = ? THEN 1 ELSE 0 END AS yours
      FROM leaderboard WHERE mode = ?
      ORDER BY cells DESC, completion IS NULL, completion ASC, earned DESC, updated_at ASC LIMIT 50
    `).bind(player, mode).all();
    return json({ entries: results, totalCells: TOTAL });
  }

  if (path === '/api/game/account' && method === 'GET') {
    if (!signedIn) return json({ signedIn: false, cloud: null, entries: [] });
    const [cloud, board] = await Promise.all([
      env.SAVES.head('campaigns/' + player),
      env.DB.prepare('SELECT mode, name FROM leaderboard WHERE player_id = ? ORDER BY updated_at DESC').bind(player).all(),
    ]);
    return json({ signedIn, cloud: metadata(cloud), entries: board.results });
  }

  if (!signedIn) return error('Sign in to use your game account.', 401);
  if (method !== 'GET' && (request.headers.get('X-Clearcut-Action') !== '1'
      || request.headers.get('Sec-Fetch-Site') === 'cross-site'
      || (request.headers.has('Origin') && request.headers.get('Origin') !== url.origin))) {
    return error('This action must come from the game.', 403);
  }

  const key = 'campaigns/' + player;
  if (path === '/api/game/save' && method === 'GET') {
    const object = await env.SAVES.get(key);
    if (!object) return error('No cloud backup exists yet.', 404);
    return new Response(object.body, { headers: { ...headers, 'Content-Type': 'application/json', 'X-Save-Revision': object.etag } });
  }
  if (path === '/api/game/save' && method === 'PUT') {
    const revision = request.headers.get('X-Save-Revision');
    if (revision === null || revision.length > 128) return error('Refresh the account before saving.', 428);
    const bytes = await readBytes(request, maxSaveBytes);
    if (bytes === null) return error('Cloud backups support saves up to 32 MiB. Export this campaign from Settings.', 413);
    let save;
    try { save = parseSave(bytes); }
    catch { return error('The campaign backup did not pass validation.', 422); }
    let cells = 0;
    for (const [, soil] of save.soil) if (desertified(soil)) cells++;
    const completion = cells === TOTAL && save.won && save.completionTime > 0 && save.completionTime <= save.clock
      ? Math.ceil(save.completionTime) : null;
    const ranked = { mode: save.challenge ?? 'standard', cells, earned: Math.min(Math.floor(save.stats.earned), Number.MAX_SAFE_INTEGER), completion };
    const object = await env.SAVES.put(key, bytes, {
      onlyIf: revision === '' ? { etagDoesNotMatch: '*' } : { etagMatches: revision },
      httpMetadata: { contentType: 'application/json' },
      customMetadata: { ranked: JSON.stringify(ranked) },
    });
    if (!object) return error('The cloud backup changed on another device. Refresh and review it before overwriting.', 409);
    return json({ cloud: metadata(object) });
  }

  if (path === '/api/game/leaderboard' && method === 'POST') {
    const bytes = await readBytes(request, 1024);
    if (bytes === null) return error('The display name is too long.', 413);
    let name;
    try { name = JSON.parse(new TextDecoder().decode(bytes))?.name?.trim(); }
    catch { return error('Enter a valid display name.', 400); }
    if (typeof name !== 'string' || !/^[\p{L}\p{N}][\p{L}\p{N} _-]{2,23}$/u.test(name)) {
      return error('Use 3–24 letters, numbers, spaces, underscores or hyphens.', 400);
    }
    const object = await env.SAVES.head(key);
    if (!object?.customMetadata?.ranked) return error('Back up a campaign before posting your progress.', 409);
    if (request.headers.get('X-Save-Revision') !== object.etag) {
      return error('The cloud backup changed. Refresh the account before posting.', 409);
    }
    const { mode, cells, earned, completion } = JSON.parse(object.customMetadata.ranked);
    if (!cells && !earned) return error('Earn money or stabilize a desert cell before posting.', 422);
    await env.DB.prepare(`
      INSERT INTO leaderboard (player_id, mode, name, cells, earned, completion, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (player_id, mode) DO UPDATE SET name = excluded.name, cells = excluded.cells,
        earned = excluded.earned, completion = excluded.completion, updated_at = excluded.updated_at
    `).bind(player, mode, name, cells, earned, completion, Date.now()).run();
    return json({ mode });
  }
  if (path === '/api/game/leaderboard' && method === 'DELETE') {
    const mode = url.searchParams.get('mode');
    if (!modes.has(mode)) return error('Unknown campaign mode.', 400);
    await env.DB.prepare('DELETE FROM leaderboard WHERE player_id = ? AND mode = ?').bind(player, mode).run();
    return json({ removed: true });
  }
  return error('Unknown game endpoint.', 404);
}
