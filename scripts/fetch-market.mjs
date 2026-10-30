/**
 * Сбор реальных рыночных данных для статического сайта.
 *
 * Источники (без API-ключей):
 *   - Yahoo Finance chart API  -> акции и индексы (S&P 500)
 *   - CoinGecko markets API     -> крипта
 *
 * Результат: data/market.json, который коммитит GitHub Actions
 * по расписанию. Сайт читает этот файл и рисует графики.
 *
 * Запуск:  node scripts/fetch-market.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'data/market.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36';

/** Акции AI-сегмента + самые большие падения: тикер, название для журнала наблюдений. */
const STOCKS = [
  ['NVDA', 'NVIDIA Corp'],
  ['MSFT', 'Microsoft Corp'],
  ['GOOGL', 'Alphabet Inc'],
  ['AMZN', 'Amazon.com Inc'],
  ['META', 'Meta Platforms'],
  ['AMD', 'Advanced Micro Devices'],
  ['AVGO', 'Broadcom Inc'],
  ['PLTR', 'Palantir Technologies'],
  ['TSM', 'TSMC'],
  ['ORCL', 'Oracle Corp'],
  ['ARM', 'Arm Holdings'],
  ['SMCI', 'Super Micro Computer'],
  ['CRM', 'Salesforce Inc'],
  ['SNOW', 'Snowflake Inc'],
  // Топ падения (по твоему списку)
  ['APP', 'AppLovin Corp'],
  ['COIN', 'Coinbase Global'],
  ['CRWV', 'CoreWeave'],
  ['WDC', 'Western Digital'],
  ['INTC', 'Intel Corp'],
  ['SNDK', 'SanDisk'],
  ['CRCL', 'Circle Internet Group'],
  ['NOW', 'ServiceNow'],
  ['HOOD', 'Robinhood Markets'],
  ['STX', 'Seagate Technology'],
  ['MRVL', 'Marvell Technology'],
  ['ADBE', 'Adobe Inc'],
  ['MU', 'Micron Technology'],
  ['IBM', 'International Business Machines'],
];

/** Индексы для сравнения. */
const INDICES = [
  ['^GSPC', 'S&P 500'],
];

/** Крипта через CoinGecko. */
const CRYPTO = [
  ['bitcoin', 'BTC', 'Bitcoin'],
  ['ethereum', 'ETH', 'Ethereum'],
];

/** Горизонт истории в днях. */
const RANGE_DAYS = 180;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} :: ${url}`);
  return res.json();
}

/** Дневной ряд Yahoo: [{t: 'YYYY-MM-DD', c: close}] */
async function fetchYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${RANGE_DAYS}d&interval=1d`;
  const data = await getJSON(url);
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error('empty chart result');
  const stamps = result.timestamp || [];
  const closes = result?.indicators?.quote?.[0]?.close || [];
  const points = [];
  for (let i = 0; i < stamps.length; i += 1) {
    const c = closes[i];
    if (c === null || c === undefined) continue;
    const d = new Date(stamps[i] * 1000);
    points.push([d.toISOString().slice(0, 10), Number(c.toFixed(4))]);
  }
  return { points, meta: result.meta || {} };
}

/** Дневной ряд CoinGecko: [{t: 'YYYY-MM-DD', c: price}] */
async function fetchCoinGecko(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${RANGE_DAYS}&interval=daily`;
  const data = await getJSON(url);
  const points = [];
  for (const [ts, price] of data.prices || []) {
    const d = new Date(ts);
    points.push([d.toISOString().slice(0, 10), Number(price.toFixed(4))]);
  }
  return { points, meta: { currency: 'usd' } };
}

/** Проценты изменения: (last / first - 1) * 100. */
function pctChange(points) {
  if (!points.length) return 0;
  const first = points[0][1];
  const last = points[points.length - 1][1];
  if (!first) return 0;
  return Number((((last / first) - 1) * 100).toFixed(2));
}

/** Сводный «Индекс пузыря»: среднее нормированных цен корзины, база 1000. */
function buildIndex(seriesList) {
  const usable = seriesList.filter((s) => s.points.length > 10);
  if (!usable.length) return null;

  const byDate = new Map();
  for (const s of usable) {
    const base = s.points[0][1];
    for (const [date, value] of s.points) {
      if (!byDate.has(date)) byDate.set(date, []);
      byDate.get(date).push(value / base);
    }
  }

  // Оставляем только даты, где видна вся корзина: иначе среднее прыгает.
  const full = usable.length;
  const dates = [...byDate.entries()]
    .filter(([, values]) => values.length === full)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date]) => date);

  if (dates.length < 10) return null;

  const points = dates.map((date) => {
    const values = byDate.get(date);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return [date, Number((mean * 1000).toFixed(2))];
  });

  return points;
}

/** Приведение к общей сетке дат: нужно для сравнения кривых на одном графике. */
function toSharedGrid(seriesList) {
  const dates = new Set();
  for (const s of seriesList) for (const [d] of s.points) dates.add(d);
  const sorted = [...dates].sort();
  const common = sorted.filter((d) => seriesList.every((s) => s.points.some(([pd]) => pd === d)));
  return common.length >= 10 ? common : sorted.slice(-Math.min(sorted.length, 60));
}

async function main() {
  const series = {};
  const quotes = [];
  const failures = [];

  for (const [symbol, name] of [...STOCKS, ...INDICES]) {
    try {
      const { points, meta } = await fetchYahoo(symbol);
      const key = symbol.replace(/^\^/, '').toLowerCase();
      const currency = meta.currency || 'USD';
      series[key] = { label: name, symbol, kind: 'equity', points };
      if (points.length) {
        const last = points[points.length - 1][1];
        const prev = points.length > 1 ? points[points.length - 2][1] : last;
        quotes.push({
          symbol,
          name,
          price: last,
          changePct: prev ? Number((((last / prev) - 1) * 100).toFixed(2)) : 0,
          changePctWindow: pctChange(points),
          currency,
          observedAt: points[points.length - 1][0],
        });
      }
    } catch (err) {
      failures.push(`${symbol}: ${err.message}`);
    }
    await sleep(220);
  }

  for (const [id, symbol, name] of CRYPTO) {
    try {
      const { points } = await fetchCoinGecko(id);
      series[id] = { label: name, symbol, kind: 'crypto', points };
      if (points.length) {
        const last = points[points.length - 1][1];
        const prev = points.length > 1 ? points[points.length - 2][1] : last;
        quotes.push({
          symbol,
          name,
          price: last,
          changePct: prev ? Number((((last / prev) - 1) * 100).toFixed(2)) : 0,
          changePctWindow: pctChange(points),
          currency: 'USD',
          observedAt: points[points.length - 1][0],
        });
      }
    } catch (err) {
      failures.push(`${symbol}: ${err.message}`);
    }
    await sleep(900);
  }

  const basket = STOCKS.map(([s]) => s.replace(/^\^/, '').toLowerCase())
    .filter((k) => series[k] && series[k].points.length > 10)
    .map((k) => series[k]);

  const indexPoints = buildIndex(basket);
  if (indexPoints) {
    series.bubble = { label: 'Индекс пузыря', symbol: 'BUBBLE', kind: 'index', points: indexPoints };
  }

  const chartKeys = ['bubble', 'nvda', 'gspc', 'bitcoin'].filter((k) => series[k]);
  const sharedDates = toSharedGrid(chartKeys.map((k) => series[k]));
  const charts = {};
  for (const key of chartKeys) {
    const map = new Map(series[key].points);
    charts[key] = {
      label: series[key].label,
      symbol: series[key].symbol,
      kind: series[key].kind,
      points: sharedDates.map((d) => [d, map.get(d)]).filter(([, v]) => v !== undefined),
    };
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    sources: [
      { name: 'Yahoo Finance', url: 'https://finance.yahoo.com', usedFor: 'акции и индексы' },
      { name: 'CoinGecko', url: 'https://www.coingecko.com', usedFor: 'крипта' },
    ],
    failures,
    series: charts,
    quotes: quotes.sort((a, b) => b.changePct - a.changePct),
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 1) + '\n', 'utf8');

  console.log(`market.json: ${quotes.length} котировок, серий: ${Object.keys(charts).join(', ')}`);
  if (failures.length) console.log('не удалось:', failures.join(' | '));
}

main().catch((err) => {
  console.error('СБОЙ:', err.message);
  process.exit(1);
});
