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
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'data/market.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36';

/** Акции AI-сегмента + самые большие падения: тикер, название для журнала наблюдений. */
const STOCKS = [
  ['ANT', 'Anthropic, PBC'],
  ['NVDA', 'NVIDIA Corp'],
  ['MSFT', 'Microsoft Corp'],
  ['GOOGL', 'Alphabet Inc'],
  ['AMZN', 'Amazon.com Inc'],
  ['META', 'Meta Platforms'],
  ['AMD', 'Advanced Micro Devices'],
  ['NBIS', 'Nebius Group'],
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

/**
 * Горизонт истории в днях. Обе площадки приводим к одному календарному окну:
 * Yahoo получает period1/period2, CoinGecko — days. Иначе акции приходят
 * за 180 торговых дней, крипта за 180 календарных, и окна не совпадают.
 */
const RANGE_DAYS = 180;
const PERIOD2 = Math.floor(Date.now() / 1000);
const PERIOD1 = PERIOD2 - RANGE_DAYS * 86400;

/** Доля от самой длинной серии, ниже которой бумага не идёт в корзину индекса. */
const BASKET_COVERAGE = 0.9;

/**
 * Реальные события, которые отмечаются на графике. Это факты, а не подписи-шутки.
 * price используется как опорная точка, если биржа ещё не отдала историю:
 * 83 — документированная цена размещения ANT (18.11.2026).
 */
const EVENTS = {
  ant: {
    name: 'Anthropic, PBC',
    date: '2026-11-18',
    price: 83,
    label: { ru: 'IPO · $83', en: 'IPO · $83' }
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * GET с таймаутом и повторами. 429 и 5xx ретраим, 404 — сразу наружу:
 * для неизвестного тикера повторять бессмысленно.
 */
async function getJSON(url, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) {
        const err = new Error(`${res.status} ${res.statusText} :: ${url}`);
        err.retryable = res.status === 429 || res.status >= 500;
        if (!err.retryable) throw err;
        throw err;
      }
      return await res.json();
    } catch (err) {
      lastError = err;
      if (err.retryable === false || i === attempts - 1) break;
      await sleep(1200 * (i + 1));
    }
  }
  throw lastError;
}

/** Дневной ряд Yahoo: [{t: 'YYYY-MM-DD', c: close}] */
async function fetchYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${PERIOD1}&period2=${PERIOD2}&interval=1d`;
  const data = await getJSON(url);
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error('empty chart result');
  const stamps = result.timestamp || [];
  const closes = result?.indicators?.quote?.[0]?.close || [];
  const points = [];
  for (let i = 0; i < stamps.length; i += 1) {
    const c = closes[i];
    if (c === null || c === undefined || !Number.isFinite(Number(c))) continue;
    const d = new Date(stamps[i] * 1000);
    points.push([d.toISOString().slice(0, 10), Number(Number(c).toFixed(4))]);
  }
  if (!points.length) throw new Error('no points in chart result');
  return { points, meta: result.meta || {} };
}

/** Дневной ряд CoinGecko: [{t: 'YYYY-MM-DD', c: price}] */
async function fetchCoinGecko(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${RANGE_DAYS}&interval=daily`;
  const data = await getJSON(url);
  const points = [];
  for (const [ts, price] of data.prices || []) {
    if (!Number.isFinite(Number(price))) continue;
    const d = new Date(ts);
    points.push([d.toISOString().slice(0, 10), Number(Number(price).toFixed(4))]);
  }
  if (!points.length) throw new Error('no points in coingecko chart');
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

/**
 * Сводный «Индекс пузыря»: среднее нормированных цен корзины, база 1000
 * на первой общей дате. Нормируем именно по общей дате, иначе бумага,
 * начавшая торговаться позже, сдвигает весь индекс.
 */
function buildIndex(seriesList) {
  const usable = seriesList.filter((s) => s.points.length > 10);
  if (!usable.length) return null;

  const maps = usable.map((s) => new Map(s.points));
  const dates = [...maps[0].keys()]
    .filter((date) => maps.every((m) => m.has(date)))
    .sort((a, b) => String(a).localeCompare(String(b)));

  if (dates.length < 10) return null;

  const base = maps.map((m) => m.get(dates[0]));
  if (base.some((v) => !v)) return null;

  const points = [];
  for (const date of dates) {
    let sum = 0;
    for (let i = 0; i < maps.length; i += 1) sum += maps[i].get(date) / base[i];
    points.push([date, Number(((sum / maps.length) * 1000).toFixed(2))]);
  }

  return points;
}

/** Читает предыдущий market.json: нужен для устойчивости к частичным сбоям. */
async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT, 'utf8'));
  } catch (err) {
    return null;
  }
}

async function main() {
  const series = {};
  const quotes = [];
  const failures = [];
  const prevPayload = await readPrevious();

  for (const [symbol, name] of [...STOCKS, ...INDICES]) {
    try {
      const { points, meta } = await fetchYahoo(symbol);
      const key = symbol.replace(/^\^/, '').toLowerCase();
      const currency = meta.currency || 'USD';
      series[key] = { label: name, symbol, kind: 'equity', points };
      if (points.length) {
        const last = points[points.length - 1][1];
        // Дневное изменение. Для бумаги с одним днём истории (свежий листинг)
        // опираемся на цену размещения из EVENTS, иначе на chartPreviousClose.
        const event = EVENTS[key];
        const prev = points.length > 1
          ? points[points.length - 2][1]
          : (event && event.price) || Number(meta.chartPreviousClose) || last;
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

  // Если биржа не отдала бумагу из EVENTS совсем, собираем серию из события:
  // свежий листинг важнее, чем отсутствие истории.
  for (const [key, ev] of Object.entries(EVENTS)) {
    if (!series[key]) {
      series[key] = { label: ev.name, symbol: key.toUpperCase(), kind: 'equity', points: [] };
    }
    if (!series[key].points.some(([d]) => d === ev.date)) {
      series[key].points.unshift([ev.date, ev.price]);
      series[key].points.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    }
  }

  // Корзина индекса: только бумаги, которые покрывают почти всё окно.
  // Иначе новая бумага с 15 днями истории обрезает индекс до своих 15 дней.
  const candidates = STOCKS.map(([s]) => s.replace(/^\^/, '').toLowerCase())
    .filter((k) => series[k] && series[k].points.length > 10)
    .map((k) => series[k]);
  const maxLen = candidates.reduce((m, s) => Math.max(m, s.points.length), 0);
  const basket = candidates.filter((s) => s.points.length >= maxLen * BASKET_COVERAGE);

  // Частичный сбой даёт другую корзину и другую историю индекса. Если кто-то
  // из бумаг индекса не загрузился, оставляем прошлую кривую как есть.
  const basketFailed = failures.some((f) => {
    const sym = String(f.split(':')[0]).toUpperCase();
    return STOCKS.some(([s]) => s.replace(/^\^/, '').toUpperCase() === sym);
  });
  let indexPoints = null;
  if (!basketFailed && basket.length) indexPoints = buildIndex(basket);
  if (!indexPoints) indexPoints = prevPayload?.series?.bubble?.points || null;

  if (indexPoints) {
    series.bubble = { label: 'Индекс пузыря', symbol: 'BUBBLE', kind: 'index', points: indexPoints };
  }

  // Каждый график живёт на своей сетке дат: вкладки независимы, а общая сетка
  // обрезала индекс по календарю крипты и теряла выходные у Bitcoin.
  const chartKeys = ['bubble', 'nvda', 'amd', 'gspc', 'bitcoin', 'nbis', 'ant']
    .filter((k) => series[k] && series[k].points.length);
  const charts = {};
  for (const key of chartKeys) charts[key] = series[key];

  const events = {};
  for (const [key, ev] of Object.entries(EVENTS)) {
    if (charts[key]) events[key] = { date: ev.date, label: ev.label };
  }

  // Защита от полного отказа источников: пустой файл не должен затирать рабочий.
  const total = STOCKS.length + INDICES.length + CRYPTO.length;
  const healthy = total - failures.length;
  if (!chartKeys.length || healthy < total * 0.8) {
    console.error(`СБОЙ: источники недоступны (${healthy}/${total}, графиков ${chartKeys.length}). Файл не перезаписан.`);
    if (failures.length) console.error(failures.join('\n'));
    process.exit(1);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    sources: [
      { name: 'Yahoo Finance', url: 'https://finance.yahoo.com', usedFor: 'акции и индексы' },
      { name: 'CoinGecko', url: 'https://www.coingecko.com', usedFor: 'крипта' },
    ],
    failures,
    series: charts,
    events,
    quotes: quotes.sort((a, b) => b.changePct - a.changePct),
  };

  // Если данные не изменились, сохраняем прежнюю метку времени: тогда workflow
  // увидит пустой diff и не будет коммитить и деплоить каждые 30 минут.
  if (prevPayload) {
    const same = JSON.stringify({ ...prevPayload, generatedAt: '' }) ===
      JSON.stringify({ ...payload, generatedAt: '' });
    if (same) payload.generatedAt = prevPayload.generatedAt || payload.generatedAt;
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(payload, null, 1) + '\n', 'utf8');

  console.log(`market.json: ${quotes.length} котировок, серий: ${Object.keys(charts).join(', ')}`);
  if (failures.length) console.log('не удалось:', failures.join(' | '));
}

main().catch((err) => {
  console.error('СБОЙ:', err.message);
  process.exit(1);
});
