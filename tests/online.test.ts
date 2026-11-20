import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { Campaign } from '../src/campaign';
import { defaultSoil, desertRules } from '../src/land';
import { gameApi } from '../worker/game-api.mjs';

function fixture() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../drizzle/0000_leaderboard.sql', import.meta.url), 'utf8'));
  type ObjectRecord = {
    etag: string; uploaded: Date; size: number; body: Uint8Array; customMetadata: { ranked: string };
  };
  const objects = new Map<string, ObjectRecord>();
  const env = {
    DB: {
      prepare(sql: string) {
        const statement = db.prepare(sql);
        return { bind: (...params: Parameters<typeof statement.all>) => ({
          all: async () => ({ results: statement.all(...params) }),
          run: async () => statement.run(...params),
        }) };
      },
    },
    SAVES: {
      head: async (key: string) => objects.get(key) ?? null,
      get: async (key: string) => objects.get(key) ?? null,
      put: async (key: string, body: Uint8Array, options: {
        onlyIf: { etagMatches?: string; etagDoesNotMatch?: string }; customMetadata: ObjectRecord['customMetadata'];
      }) => {
        const previous = objects.get(key);
        const { etagMatches, etagDoesNotMatch } = options.onlyIf;
        if (etagMatches !== undefined && previous?.etag !== etagMatches) return null;
        if (etagDoesNotMatch === '*' && previous) return null;
        const record = {
          etag: createHash('sha256').update(body).digest('hex'),
          uploaded: new Date(), size: body.byteLength, body, customMetadata: options.customMetadata,
        };
        objects.set(key, record);
        return record;
      },
    },
  };
  const send = (path: string, player?: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    if (player) headers.set('oai-authenticated-user-id', player);
    return gameApi(new Request('https://game.test/api/game/' + path, { ...options, headers }), env);
  };
  const backUp = (player: string | undefined, save: unknown, revision = '', extra: Record<string, string> = {}) => send('save', player,
    { method: 'PUT', body: JSON.stringify(save), headers: { 'X-Clearcut-Action': '1', 'X-Save-Revision': revision, ...extra } });
  const post = async (player: string, name: string, revision?: string) => {
    const { cloud } = await (await send('account', player)).json();
    return send('leaderboard', player, {
      method: 'POST', body: JSON.stringify({ name }),
      headers: { 'X-Clearcut-Action': '1', 'X-Save-Revision': revision ?? cloud?.revision ?? '' },
    });
  };
  return { db, send, backUp, post };
}

test('cloud backups validate campaigns, isolate players and guard against stale writes', async (t) => {
  const { db, send, backUp } = fixture();
  t.after(() => db.close());
  const save = new Campaign().snapshot();
  assert.equal((await backUp(undefined, save)).status, 401);
  assert.equal((await backUp('a', save, '', { Origin: 'https://other.test' })).status, 403);
  assert.equal((await backUp('a', { ...save, version: -1 })).status, 422);
  const created = await backUp('a', save);
  assert.equal(created.status, 200);
  const { cloud } = await created.json();
  assert.equal((await send('save', 'b')).status, 404);
  assert.equal((await send('account', 'b')).status, 200);
  assert.equal((await (await send('account', 'b')).json()).cloud, null);
  assert.equal((await backUp('a', save)).status, 409);
  const updated = { ...save, cash: 24 };
  const replaced = await backUp('a', updated, cloud.revision);
  assert.equal(replaced.status, 200);
  assert.equal((await backUp('a', save, cloud.revision)).status, 409);
  const downloaded = await send('save', 'a');
  assert.deepEqual(await downloaded.json(), JSON.parse(JSON.stringify(updated)));
  assert.equal(downloaded.headers.get('X-Save-Revision'), (await replaced.json()).cloud.revision);
  assert.equal(downloaded.headers.get('Cache-Control'), 'private, no-store');
});

test('leaderboard requires opt-in, uses ranked cloud progress and separates modes', async (t) => {
  const { db, send, backUp, post } = fixture();
  t.after(() => db.close());
  const first = new Campaign();
  first.stats.earned = 250;
  const second = new Campaign();
  second.stats.earned = 5;
  second.soil.set(350, {
    ...defaultSoil(), vegetation: 0, moisture: 0, groundwater: 0, fertility: 0,
    substrate: 1, stable: desertRules.stabilization,
  });
  assert.equal((await backUp('first', first.snapshot())).status, 200);
  assert.equal((await backUp('second', second.snapshot())).status, 200);
  assert.deepEqual((await (await send('leaderboard')).json()).entries, []);
  assert.equal((await post('first', '<script>')).status, 400);
  assert.equal((await post('first', 'North Mill', 'stale')).status, 409);
  assert.equal((await post('first', 'North Mill')).status, 200);
  assert.equal((await post('second', 'Dry Soil')).status, 200);
  const lean = new Campaign(210, 'leanPower');
  lean.stats.earned = 400;
  assert.equal((await backUp('lean', lean.snapshot())).status, 200);
  assert.equal((await post('lean', 'Low Power')).status, 200);
  const entries = (await (await send('leaderboard', 'second')).json()).entries;
  assert.deepEqual(entries.map(({ name, cells, yours, earned }) => [name, cells, yours, earned]),
    [['Dry Soil', 1, 1, 5], ['North Mill', 0, 0, 250]]);
  assert.equal(entries[0].player_id, undefined);
  assert.equal((await (await send('leaderboard?mode=leanPower')).json()).entries[0].name, 'Low Power');
  const remove = { method: 'DELETE', headers: { 'X-Clearcut-Action': '1' } };
  assert.equal((await send('leaderboard?mode=standard', 'first', remove)).status, 200);
  assert.deepEqual((await (await send('leaderboard')).json()).entries.map(({ name }) => name), ['Dry Soil']);
});
