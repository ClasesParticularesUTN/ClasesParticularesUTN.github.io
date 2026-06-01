/**
 * Regenera JS/canonical-routes.js a partir de los .html del sitio.
 * Uso: node scripts/generate-canonical-routes.mjs
 */
import { readdir, writeFile } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const skipDirs = new Set(['.git', '.vscode', 'node_modules', '.cursor', 'scripts']);

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      await walk(full, files);
    } else if (/\.html?$/i.test(entry.name)) {
      files.push(relative(root, full).replace(/\\/g, '/'));
    }
  }
  return files;
}

function pathsForHtml(rel) {
  const out = new Set();
  if (rel === 'index.html') {
    out.add('/');
    out.add('/index.html');
    return [...out];
  }
  const dir = dirname(rel).replace(/\\/g, '/');
  const file = rel.split('/').pop();
  if (file === 'index.html') {
    const base = dir === '.' ? '' : `/${dir}`;
    if (base) out.add(base);
    out.add(`${base}/`);
    out.add(`${base}/index.html`);
  } else {
    out.add(`/${rel}`);
    const parent = dir === '.' ? '' : `/${dir}`;
    if (parent) out.add(`${parent}/`);
  }
  return [...out];
}

const htmlFiles = await walk(root);
const routes = [...new Set(htmlFiles.flatMap(pathsForHtml))].sort((a, b) =>
  a.localeCompare(b, 'es')
);

const banner = `/* Generado por scripts/generate-canonical-routes.mjs — no editar a mano */\n`;
const body = `${banner}window.CANONICAL_ROUTES = ${JSON.stringify(routes, null, 2)};\n`;
await writeFile(join(root, 'JS', 'canonical-routes.js'), body, 'utf8');
console.log(`OK: ${routes.length} rutas en JS/canonical-routes.js`);
