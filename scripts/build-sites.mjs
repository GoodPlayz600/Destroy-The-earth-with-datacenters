import { copyFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { build } from 'esbuild';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};
const files = Object.create(null);
for (const path of ['index.html', ...(await readdir('dist/assets')).sort().map(name => 'assets/' + name)]) {
  const type = types[extname(path)];
  if (!type) throw new Error('Missing content type for ' + path);
  const raw = await readFile('dist/' + path);
  const packed = type.startsWith('text/');
  files['/' + path] = [type, packed, (packed ? gzipSync(raw, { level: 9 }) : raw).toString('base64')];
}

await build({
  entryPoints: ['worker/index.mjs'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2022',
  outfile: 'dist/server/index.js',
  plugins: [{
    name: 'game-assets',
    setup(context) {
      context.onResolve({ filter: /^clearcut:assets$/ }, () => ({ path: 'assets', namespace: 'clearcut' }));
      context.onLoad({ filter: /.*/, namespace: 'clearcut' }, () => ({
        contents: 'export const files = Object.assign(Object.create(null), ' + JSON.stringify(files) + ');',
      }));
    },
  }],
});
await mkdir('dist/.openai', { recursive: true });
await copyFile('.openai/hosting.json', 'dist/.openai/hosting.json');
