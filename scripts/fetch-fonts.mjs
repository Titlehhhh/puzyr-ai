/**
 * Скачивание шрифтов для локального хостинга.
 * Сайт не должен зависеть от внешнего CDN: файлы лежат в fonts/.
 *
 * Запуск: node scripts/fetch-fonts.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_DIR = resolve(ROOT, 'fonts');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36';

const FAMILIES = [
  { name: 'Jost', query: 'Jost:wght@300;400;500' },
  { name: 'JetBrains Mono', query: 'JetBrains+Mono:wght@400;500' },
];

/* Только нужные подмножества: кириллица и латиница. */
const KEEP = ['cyrillic', 'latin'];

async function main() {
  await mkdir(FONT_DIR, { recursive: true });
  const out = [];

  for (const family of FAMILIES) {
    const url = `https://fonts.googleapis.com/css2?family=${family.query}&display=swap`;
    const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();

    // Каждому @font-face предшествует комментарий с именем подмножества.
    const blocks = css.split(/\/\*\s*([a-z-]+)\s*\*\//i).slice(1);
    for (let i = 0; i < blocks.length; i += 2) {
      const subset = blocks[i].toLowerCase();
      const body = blocks[i + 1] || '';
      if (!KEEP.includes(subset)) continue;

      const match = body.match(/@font-face\s*\{[^}]*\}/);
      if (!match) continue;
      let face = match[0];
      const src = face.match(/url\((https:\/\/[^)]+\.woff2)\)/);
      if (!src) continue;

      const weight = (face.match(/font-weight:\s*(\d+)/) || [, '400'])[1];
      const familyName = (face.match(/font-family:\s*'([^']+)'/) || [, family.name])[1];
      const file = `${familyName.toLowerCase().replace(/\s+/g, '-')}-${weight}-${subset}.woff2`;

      const bin = Buffer.from(await (await fetch(src[1], { headers: { 'User-Agent': UA } })).arrayBuffer());
      await writeFile(resolve(FONT_DIR, file), bin);
      face = face.replace(src[1], `fonts/${file}`);
      out.push(`/* ${subset} */\n${face}`);
      console.log(`${file}  ${(bin.length / 1024).toFixed(1)} KB`);
    }
  }

  const header = `/* Локальные шрифты. Сгенерировано scripts/fetch-fonts.mjs. Источник: Google Fonts (OFL). */\n\n`;
  await writeFile(resolve(ROOT, 'fonts.css'), header + out.join('\n\n') + '\n', 'utf8');
  console.log('fonts.css готов');
}

main().catch((err) => {
  console.error('СБОЙ:', err.message);
  process.exit(1);
});
