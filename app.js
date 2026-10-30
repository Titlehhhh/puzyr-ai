/* ==========================================================
   РџРЈР—Р«Р Р¬ AI вЂ” СЃС‚Р°РЅС†РёСЏ РЅР°Р±Р»СЋРґРµРЅРёСЏ Р·Р° РїСѓР·С‹СЂС‘Рј
   Р§РёСЃС‚С‹Р№ СЃС‚Р°С‚РёС‡РµСЃРєРёР№ СЃРєСЂРёРїС‚: Р±РµР· СЃР±РѕСЂРєРё Рё Р±РµР· Р·Р°РІРёСЃРёРјРѕСЃС‚РµР№.
   ========================================================== */
(function () {
  'use strict';

  var DEFAULT_TARGET = '2028-03-31T23:59:59';
  var SPAN_DAYS = 1095;            // С€РєР°Р»Р° РґР°РІР»РµРЅРёСЏ СЂР°СЃС‚СЏРЅСѓС‚Р° РЅР° С‚СЂРё РіРѕРґР°
  var KEY = {
    sound: 'puzyr.sound.v1',
    lang: 'puzyr.lang.v1',
    visits: 'puzyr.visits.v1'
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------- РЇР·С‹РєРё ---------------- */

  var I18N = {
    ru: {
      station: 'РЎС‚Р°РЅС†РёСЏ РЅР°Р±Р»СЋРґРµРЅРёСЏ',
      deadline: 'Р”Рѕ СЂР°Р·СЂС‹РІР°',
      sound: 'Р—РІСѓРє',
      pressure: 'Р”Р°РІР»РµРЅРёРµ РІ РїСѓР·С‹СЂРµ',
      hpa: 'РіРџР°',
      untilBreak: 'РґРѕ СЂР°Р·СЂС‹РІР° РјРµРјР±СЂР°РЅС‹',
      chartTitle: 'Р‘Р°СЂРѕРіСЂР°С„: РёРЅРґРµРєСЃ РїСѓР·С‹СЂСЏ',
      noData: 'Р”Р°РЅРЅС‹Рµ РµС‰С‘ РЅРµ Р·Р°РіСЂСѓР·РёР»РёСЃСЊ',
      stamp: 'РґР°РЅРЅС‹Рµ РЅРµ Р·Р°РіСЂСѓР¶РµРЅС‹',
      journalTitle: 'Р–СѓСЂРЅР°Р» РЅР°Р±Р»СЋРґРµРЅРёР№',
      passport: 'РџР°СЃРїРѕСЂС‚ РЅР°Р±Р»СЋРґРµРЅРёСЏ',
      passStarted: 'РќР°Р±Р»СЋРґРµРЅРёРµ РЅР°С‡Р°С‚Рѕ',
      passChecks: 'РћС‚РјРµС‚РѕРє РЅР°Р±Р»СЋРґР°С‚РµР»СЏ',
      passDefault: 'Р”РµРґР»Р°Р№РЅ СЂР°Р·СЂС‹РІР°',
      passSource: 'РСЃС‚РѕС‡РЅРёРє РєРѕС‚РёСЂРѕРІРѕРє',
      disclaimer: 'РєРѕРјРјРµРЅС‚Р°СЂРёРё РЅР°Р±Р»СЋРґР°С‚РµР»СЏ, Р° РЅРµ РёРЅРІРµСЃС‚РёС†РёРѕРЅРЅС‹Р№ СЃРѕРІРµС‚',
      colTicker: 'РўРёРєРµСЂ',
      colPrice: 'Р¦РµРЅР°',
      colChange: 'РР·Рј.',
      colNote: 'РќР°Р±Р»СЋРґРµРЅРёРµ',
      sourceNote: 'РСЃС‚РѕС‡РЅРёРє РїСЂРѕРіРЅРѕР·Р°: РіР°РґР°РЅРёРµ РЅР° РєРѕС„РµР№РЅРѕР№ РіСѓС‰Рµ. РљРѕС‚РёСЂРѕРІРєРё: Yahoo Finance Рё CoinGecko, РѕР±РЅРѕРІР»СЏСЋС‚СЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё.',
      localTime: 'РїРѕ РјРµСЃС‚РЅРѕРјСѓ РІСЂРµРјРµРЅРё',
      burstTitle: 'РџСЂРѕС‚РѕРєРѕР» СЂР°Р·СЂС‹РІР°',
      burstHeadline: 'РџРЈР—Р«Р Р¬ Р›РћРџРќРЈР›',
      replay: 'Р•С‰С‘ СЂР°Р·',
      share: 'РџРѕРґРµР»РёС‚СЊСЃСЏ',
      copied: 'РЎСЃС‹Р»РєР° СЃРєРѕРїРёСЂРѕРІР°РЅР°',
      fresh: 'С‚РѕР»СЊРєРѕ С‡С‚Рѕ',
      minAgo: 'РјРёРЅ РЅР°Р·Р°Рґ',
      hoursAgo: 'С‡ РЅР°Р·Р°Рґ',
      daysAgo: 'РґРЅ РЅР°Р·Р°Рґ',
      statsLife: 'Р”РЅРµР№ СЃ СЂР°Р·СЂС‹РІР°',
      statsChecks: 'РћС‚РјРµС‚РѕРє РЅР°Р±Р»СЋРґР°С‚РµР»СЏ',
      statsIndex: 'РРЅРґРµРєСЃ РЅР° СЂР°Р·СЂС‹РІРµ',
      statsNotes: 'Р—Р°РїРёСЃРµР№ РІ Р¶СѓСЂРЅР°Р»Рµ',
      days: 'РґРµРЅСЊ',
      months: 'РјРµСЃСЏС†',
      years: 'РіРѕРґ',
      hours: 'С‡Р°СЃ',
      minutes: 'РјРёРЅСѓС‚Р°',
      seconds: 'СЃРµРєСѓРЅРґР°',
      lessMinute: 'РјРµРЅСЊС€Рµ РјРёРЅСѓС‚С‹',
      tabs: { bubble: 'РРЅРґРµРєСЃ', nvda: 'NVIDIA', gspc: 'S&P 500', bitcoin: 'Bitcoin' },
      seriesNames: { bubble: 'РРЅРґРµРєСЃ РїСѓР·С‹СЂСЏ', nvda: 'NVIDIA', gspc: 'S&P 500', bitcoin: 'Bitcoin' },
      states: {
        calm: 'РЈСЃС‚РѕР№С‡РёРІ',
        growth: 'РќР°РїРѕР»РЅСЏРµС‚СЃСЏ',
        warm: 'Р’С‹С€Рµ РЅРѕСЂРјС‹',
        nervous: 'РќРµСЃС‚Р°Р±РёР»РµРЅ',
        panic: 'РљСЂРёС‚РёС‡РµРЅ',
        critical: 'РђРІР°СЂРёР№РЅС‹Р№',
        final: 'РџСЂРµРґРµР»СЊРЅС‹Р№',
        burst: 'Р Р°Р·СЂС‹РІ'
      },
      stateLines: {
        calm: 'РџСѓР·С‹СЂСЊ РґРµСЂР¶РёС‚ С„РѕСЂРјСѓ. Р”Р°РІР»РµРЅРёРµ РІ РЅРѕСЂРјРµ, РЅР°Р±Р»СЋРґР°С‚РµР»СЊ РЅР° РјРµСЃС‚Рµ.',
        growth: 'РџСѓР·С‹СЂСЊ РЅР°Р±РёСЂР°РµС‚ РѕР±СЉС‘Рј. РџРѕРєР° СЌС‚Рѕ РІС‹РіР»СЏРґРёС‚ РєР°Рє РѕР±С‹С‡РЅС‹Р№ СЂРѕСЃС‚.',
        warm: 'Р”Р°РІР»РµРЅРёРµ РІС‹С€Рµ РЅРѕСЂРјС‹. Р С‹РЅРѕРє С€СѓСЂС€РёС‚ Рё РґРµР»Р°РµС‚ РІРёРґ, С‡С‚Рѕ С‚Р°Рє Рё РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ.',
        nervous: 'РњРµРјР±СЂР°РЅР° РЅР°С‚СЏРЅСѓС‚Р°. РђРЅР°Р»РёС‚РёРєРё СѓРІРµСЂСЏСЋС‚, С‡С‚Рѕ СЌС‚Рѕ РµС‰С‘ РЅРµ РїСѓР·С‹СЂСЊ.',
        panic: 'Р”РЅРё РїРѕС€Р»Рё. РљС‚Рѕ-С‚Рѕ СѓР¶Рµ РїСЂРѕРґР°Р» СЃС‚СѓР».',
        critical: 'РћСЃС‚Р°Р»РѕСЃСЊ РјРµРЅСЊС€Рµ СЃСѓС‚РѕРє. РћС‚РґРµР» РєР°РґСЂРѕРІ РѕР±РЅРѕРІР»СЏРµС‚ СЂРµР·СЋРјРµ.',
        final: 'РњРёРЅСѓС‚С‹ РґРѕ СЂР°Р·СЂС‹РІР°. Р’СЃС‘ СЂРµС€РµРЅРѕ, РѕСЃС‚Р°Р»РѕСЃСЊ РѕС„РѕСЂРјРёС‚СЊ.',
        burst: 'РњРµРјР±СЂР°РЅР° Р»РѕРїРЅСѓР»Р°. РџСѓР·С‹СЂСЏ Р±РѕР»СЊС€Рµ РЅРµС‚, РЅРѕ РіСЂР°С„РёРє РѕСЃС‚Р°Р»СЃСЏ.'
      },
      notes: {
        calm: 'РџРѕРєР° РІСЃС‘ СЃРїРѕРєРѕР№РЅРѕ: РїСѓР·С‹СЂСЊ РЅР°РґСѓРІР°РµС‚СЃСЏ РјРµРґР»РµРЅРЅРѕ, Рё СЂС‹РЅРѕРє РµС‰С‘ РѕР±СЉСЏСЃРЅСЏРµС‚ СЂРѕСЃС‚ РІС‹СЂСѓС‡РєРѕР№.',
        growth: 'РџСѓР·С‹СЂСЊ СЃС‚Р°Р» Р±РѕР»СЊС€Рµ, РЅРѕ РјРµРјР±СЂР°РЅР° РµС‰С‘ РґРµСЂР¶РёС‚. РљС‚Рѕ-С‚Рѕ СѓР¶Рµ РЅР°Р·РІР°Р» СЌС‚Рѕ Р·РґРѕСЂРѕРІРѕР№ СЂС‹РЅРѕС‡РЅРѕР№ РґРёРЅР°РјРёРєРѕР№.',
        warm: 'Р”Р°РІР»РµРЅРёРµ РїРѕРґРЅСЏР»РѕСЃСЊ РІС‹С€Рµ РЅРѕСЂРјС‹. РРЅРґРµРєСЃ РїСѓР·С‹СЂСЏ СЂР°СЃС‚С‘С‚ Р±С‹СЃС‚СЂРµРµ, С‡РµРј СѓСЃРїРµРІР°СЋС‚ СЃС‡РёС‚Р°С‚СЊ Р°РЅР°Р»РёС‚РёРєРё.',
        nervous: 'РњРµРјР±СЂР°РЅР° РЅР°С‚СЏРЅСѓС‚Р°. Р Р°Р·РіРѕРІРѕСЂС‹ РїРµСЂРµС€Р»Рё РѕС‚ РїРµСЂСЃРїРµРєС‚РёРІ Рє В«Р° РІРґСЂСѓРіВ».',
        panic: 'РћСЃС‚Р°Р»РѕСЃСЊ РЅРµСЃРєРѕР»СЊРєРѕ РґРЅРµР№. Р§Р°С‚ РїРµСЂРµРїРѕР»РЅРµРЅ РїСЂРѕРіРЅРѕР·Р°РјРё, Рё РЅРё РѕРґРёРЅ РёР· РЅРёС… РЅРµ РїСЂРѕ СЂР°Р·СЂС‹РІ.',
        critical: 'РњРµРЅСЊС€Рµ СЃСѓС‚РѕРє. Р’СЃРµ РїСЂРёРІС‹С‡РЅС‹Рµ РѕР±СЉСЏСЃРЅРµРЅРёСЏ РѕС‚РјРµРЅСЏСЋС‚СЃСЏ.',
        final: 'РњРёРЅСѓС‚С‹. РљС‚Рѕ-С‚Рѕ РµС‰С‘ РїРёС€РµС‚ РїСЂРѕРіРЅРѕР·, РєС‚Рѕ-С‚Рѕ СѓР¶Рµ Р·Р°РєСЂС‹Р» С‚РµСЂРјРёРЅР°Р».',
        burst: 'РџСѓР·С‹СЂСЊ Р»РѕРїРЅСѓР». РРЅРґРµРєСЃ РїСѓР·С‹СЂСЏ РїСЂРѕРґРѕР»Р¶Р°РµС‚ СЂР°СЃС‚Рё: СЂС‹РЅРѕРє РµС‰С‘ РЅРµ РїРѕРЅСЏР», С‡С‚Рѕ РїСЂРѕРёР·РѕС€Р»Рѕ.'
      },
      jokes: [
        'РњРµРјР±СЂР°РЅР° РІСЃРєСЂС‹Р»Р°СЃСЊ, Рё РїРѕ РІСЃРµРјСѓ С‚РµСЂРјРёРЅР°Р»Сѓ СЂР°Р·РѕС€С‘Р»СЃСЏ Р·Р°РїР°С… РїСЂР°Р·РґРЅРёРєР° Рё СѓР±С‹С‚РєРѕРІ.',
        'РќР°Р±Р»СЋРґР°С‚РµР»СЊ РІСЃРєСЂС‹Р» РїСѓР·С‹СЂСЊ СЂР°РЅСЊС€Рµ СЃСЂРѕРєР°. РљР°Рє Рё РїСЂРµРґСѓРїСЂРµР¶РґР°Р»Рё: РІС‹РґРµСЂР¶Р°С‚СЊ РєР°РґСЂ РґРѕ РєРѕРЅС†Р° РЅРµ РІС‹С€Р»Рѕ.',
        'РџСѓР·С‹СЂСЊ Р»РѕРїРЅСѓР» СЂРѕРІРЅРѕ РІ СЃСЂРѕРє. РќРёРєС‚Рѕ РЅРµ Р·Р°РјРµС‚РёР». Р“СЂР°С„РёРє РїСЂРѕРґРѕР»Р¶РёР» СЂР°СЃС‚Рё, РєР°Рє РЅРё РІ С‡С‘Рј РЅРµ Р±С‹РІР°Р»Рѕ.',
        'Р Р°Р·СЂС‹РІ РїСЂРѕС€С‘Р» Р±РµР· РїРѕРјРµС…. РњРµРјР±СЂР°РЅР° Р±С‹Р»Р° С‚РѕРЅРєРѕР№, РїРѕРєР°Р·Р°РЅРёСЏ С‡РµСЃС‚РЅС‹РјРё, Р° РІС‹РІРѕРґС‹ СЃРґРµР»Р°РЅС‹ РїРѕР·Р¶Рµ.',
        'РџСѓР·С‹СЂСЊ Р»РѕРїРЅСѓР». РўСЂРё С„РѕРЅРґР° РЅР°Р·РІР°Р»Рё СЌС‚Рѕ Р·РґРѕСЂРѕРІРѕР№ РєРѕСЂСЂРµРєС†РёРµР№ Рё СЃСЂР°Р·Сѓ РєСѓРїРёР»Рё РїСЂРѕСЃР°РґРєСѓ.'
      ]
    },
    en: {
      station: 'Observation station',
      deadline: 'Until rupture',
      sound: 'Sound',
      pressure: 'Pressure in the bubble',
      hpa: 'hPa',
      untilBreak: 'until the membrane bursts',
      chartTitle: 'Barograph: bubble index',
      noData: 'No data loaded yet',
      stamp: 'no data loaded',
      journalTitle: 'Observer log',
      passport: 'Observation passport',
      passStarted: 'Observation started',
      passChecks: "Observer's marks",
      passDefault: 'Rupture deadline',
      passSource: 'Quote source',
      disclaimer: 'observer notes, not investment advice',
      colTicker: 'Ticker',
      colPrice: 'Price',
      colChange: 'Chg.',
      colNote: 'Observation',
      sourceNote: 'Forecast source: coffee grounds. Quotes: Yahoo Finance and CoinGecko, refreshed automatically.',
      localTime: 'local time',
      burstTitle: 'Rupture protocol',
      burstHeadline: 'THE BUBBLE BURST',
      replay: 'Again',
      share: 'Share',
      copied: 'Link copied',
      fresh: 'just now',
      minAgo: 'min ago',
      hoursAgo: 'h ago',
      daysAgo: 'd ago',
      statsLife: 'Days since rupture',
      statsChecks: "Observer's marks",
      statsIndex: 'Index at rupture',
      statsNotes: 'Log entries',
      days: 'day',
      months: 'months',
      years: 'year',
      hours: 'hour',
      minutes: 'minute',
      seconds: 'second',
      lessMinute: 'less than a minute',
      tabs: { bubble: 'Index', nvda: 'NVIDIA', gspc: 'S&P 500', bitcoin: 'Bitcoin' },
      seriesNames: { bubble: 'Bubble index', nvda: 'NVIDIA', gspc: 'S&P 500', bitcoin: 'Bitcoin' },
      states: {
        calm: 'Steady', growth: 'Filling', warm: 'Above norm', nervous: 'Unstable',
        panic: 'Critical', critical: 'Emergency', final: 'Final', burst: 'Burst'
      },
      stateLines: {
        calm: 'The bubble holds its shape. Pressure is normal, the observer is on site.',
        growth: 'The bubble is gaining volume. It still looks like ordinary growth.',
        warm: 'Pressure is above normal. The market rustles and pretends this is normal.',
        nervous: 'The membrane is stretched. Analysts insist this is not a bubble.',
        panic: 'Days are running. Somebody already sold a chair.',
        critical: 'Less than a day left. The HR team is updating resumes.',
        final: 'Minutes to rupture. It is all decided, only the paperwork is left.',
        burst: 'The membrane is gone. The bubble is gone. The chart is not.'
      },
      notes: {
        calm: 'All quiet for now: the bubble inflates slowly and the market still explains growth with revenue.',
        growth: 'The bubble is bigger but the membrane still holds. Someone already called it healthy market dynamics.',
        warm: 'Pressure is above normal. The bubble index climbs faster than analysts can count.',
        nervous: 'The membrane is stretched. The talk has moved from prospects to "what if".',
        panic: 'A few days left. The chat is full of forecasts, and none of them mention the rupture.',
        critical: 'Less than a day. All the usual explanations are cancelled.',
        final: 'Minutes. Somebody is still writing forecasts, somebody has closed the terminal.',
        burst: 'The bubble burst. The bubble index keeps rising: the market has not noticed yet.'
      },
      jokes: [
        'The membrane opened, and the smell of celebration and losses spread across the terminal.',
        'The observer opened the bubble early. As warned: the print could not be held to the end.',
        'The bubble burst exactly on time. Nobody noticed. The chart kept rising as if nothing had happened.',
        'The rupture went without a hitch. The membrane was thin, the readings honest, the conclusions late.',
        'The bubble burst. Three funds called it a healthy correction and bought the dip immediately.'
      ]
    }
  };

  var lang = 'ru';
  function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.ru[key] || key; }

  /* ---------------- РЎРѕСЃС‚РѕСЏРЅРёСЏ РїСѓР·С‹СЂСЏ ---------------- */

  /* РџРѕСЂСЏРґРѕРє РІР°Р¶РµРЅ: СЃРѕСЃС‚РѕСЏРЅРёСЏ РёРґСѓС‚ РїРѕ РІРѕР·СЂР°СЃС‚Р°РЅРёСЋ РїРѕСЂРѕРіР°, Рё РїРѕРёСЃРє Р±РµСЂС‘С‚
     РїРµСЂРІРѕРµ, Сѓ РєРѕС‚РѕСЂРѕРіРѕ РґРЅРµР№_РѕСЃС‚Р°Р»РѕСЃСЊ <= max. РџРѕСЌС‚РѕРјСѓ calm СЃС‚РѕРёС‚ РїРѕСЃР»РµРґРЅРёРј. */
  var STATES = [
    { id: 'burst',    max: -1,     line: 'burst' },
    { id: 'final',    max: 1 / 24, line: 'final' },
    { id: 'critical', max: 1,      line: 'critical' },
    { id: 'panic',    max: 7,      line: 'panic' },
    { id: 'nervous',  max: 30,     line: 'nervous' },
    { id: 'warm',     max: 90,     line: 'warm' },
    { id: 'growth',   max: 365,    line: 'growth' },
    { id: 'calm',     max: Infinity, line: 'calm' }
  ];

  /* Р—Р°РјРµС‚РєРё РЅР°Р±Р»СЋРґР°С‚РµР»СЏ Рє РєР°Р¶РґРѕРјСѓ С‚РёРєРµСЂСѓ. Р­С‚Рѕ С€СѓС‚РєР°, Р° РЅРµ С„Р°РєС‚ Рѕ РєРѕРјРїР°РЅРёРё. */
  var NOTES = {
    NVDA: 'Р”РµСЂР¶РёС‚ РЅР° СЃРµР±Рµ РІРµСЃСЊ РёРЅРґРµРєСЃ Рё РЅРµ СЃРѕР±РёСЂР°РµС‚СЃСЏ РґРµР»РёС‚СЊСЃСЏ',
    MSFT: 'РљР°РїРёС‚Р°Р»РёР·Р°С†РёСЏ РїРµСЂРµСЃС‚Р°Р»Р° РїРѕРјРµС‰Р°С‚СЊСЃСЏ РІ РіРѕР»РѕРІРµ',
    GOOGL: 'РџРµСЂРІС‹Рј СЃРґСѓР»СЃСЏ, РїРµСЂРІС‹Рј Р¶Рµ Рё РѕС‚СЃРєРѕС‡РёР»',
    AMZN: 'РљР°РїРёС‚Р°Р»РёР·РёСЂСѓРµС‚ РЅР° С‡СѓР¶РѕРј Р°Р¶РёРѕС‚Р°Р¶Рµ Рё РґР°Р¶Рµ РЅРµ РјРѕСЂС‰РёС‚СЃСЏ',
    META: 'РџСЂРѕРґР°Р» РїРѕР»РѕРІРёРЅСѓ РёРЅС‚РµСЂРЅРµС‚Р° СЂР°РґРё РїРѕРґРїРёСЃРєРё РЅР° СЂР°Р·РіРѕРІРѕСЂС‹ СЃ СЂРѕР±РѕС‚РѕРј',
    AMD: 'Р”РѕРіРѕРЅСЏРµС‚, РЅРѕ РІ РѕС‚С‡С‘С‚Р°С… СѓР¶Рµ РїРѕР±РµРґРёС‚РµР»СЊ',
    AVGO: 'РџСЂРѕРґР°С‘С‚ РєР°СЃС‚РѕРјРЅС‹Рµ С‡РёРїС‹ РїРѕ С†РµРЅРµ РјРµС‡С‚С‹',
    PLTR: 'Р Р°СЃС‚С‘С‚ Р±С‹СЃС‚СЂРµРµ, С‡РµРј СѓСЃРїРµРІР°СЋС‚ СЃС‡РёС‚Р°С‚СЊ Р°РЅР°Р»РёС‚РёРєРё',
    TSM: 'Р”РµР»Р°РµС‚ С‡РёРїС‹ РґР»СЏ РІСЃРµС…, РєС‚Рѕ РґРµР»Р°РµС‚ С‡РёРїС‹',
    ORCL: 'РђСЂРµРЅРґСѓРµС‚ РІС‹С‡РёСЃР»РµРЅРёСЏ Рё РЅР°Р·С‹РІР°РµС‚ СЌС‚Рѕ РѕР±Р»Р°РєРѕРј',
    ARM: 'РЎРѕР±РёСЂР°РµС‚ Р»РёС†РµРЅР·РёРѕРЅРЅС‹Р№ СЃР±РѕСЂ СЃРѕ РІСЃРµР№ РѕС‚СЂР°СЃР»Рё',
    SMCI: 'РЎРµСЂРІРµСЂС‹ РЅР°СЃС‚РѕР»СЊРєРѕ Р±С‹СЃС‚СЂС‹Рµ, С‡С‚Рѕ РёС… РїСѓС‚Р°СЋС‚ СЃ РјРµС‚РµРѕСЃС‚Р°РЅС†РёСЏРјРё',
    CRM: 'РџСЂРѕРґР°С‘С‚ РІРѕР·РґСѓС… РїРѕ РїРѕРґРїРёСЃРєРµ, РЅРѕ РІ CRM',
    SNOW: 'РҐСЂР°РЅРёС‚ РґР°РЅРЅС‹Рµ Рѕ С‚РѕРј, С‡С‚Рѕ РґР°РЅРЅС‹Рµ РЅРёРєС‚Рѕ РЅРµ С…СЂР°РЅРёС‚',
    BTC: 'РљСЂРёРїС‚Р° РЅР° РјРµСЃС‚Рµ, РєСЂРёРїС‚Р° РЅРёРєСѓРґР° РЅРµ РґРµРЅРµС‚СЃСЏ',
    ETH: 'РўРѕС‚ Р¶Рµ РіСЂР°С„РёРє, РІРёРґ СЃР±РѕРєСѓ, РІРґРІРѕРµ РґРѕСЂРѕР¶Рµ',
    '^GSPC': 'Р С‹РЅРѕРє РІ С†РµР»РѕРј. РЎРєСѓС‡РЅРѕ Рё СЃС‚Р°Р±РёР»СЊРЅРѕ, РјС‹ СЌС‚Рѕ СѓРІР°Р¶Р°РµРј',
    // РўРѕРї РїР°РґРµРЅРёСЏ
    APP: 'РњРѕР±РёР»СЊРЅР°СЏ СЂРµРєР»Р°РјР° Р»РѕРїРЅСѓР»Р° СЂР°РЅСЊС€Рµ, С‡РµРј СѓСЃРїРµР»Рё Р·Р°РјРµС‚РёС‚СЊ',
    COIN: 'РљСЂРёРїС‚РѕР±РёСЂР¶Р°, РєРѕС‚РѕСЂР°СЏ СЃР°РјР° СЃС‚Р°Р»Р° РїСѓР·С‹СЂС‘Рј',
    CRWV: 'GPU Р°СЂРµРЅРґР° вЂ” РЅРѕРІС‹Р№ СЃР°Р±РїСЂРёРј, С‚РѕР»СЊРєРѕ Р¶РµР»РµР·Рѕ РґРѕСЂРѕР¶Рµ',
    WDC: 'Р–РµСЃС‚РєРёРµ РґРёСЃРєРё РІ РјРёСЂРµ SSD? РљР»Р°СЃСЃРёРєР° Р¶Р°РЅСЂР°',
    INTC: 'РџСЂРѕРїСѓСЃС‚РёР» РїРѕРµР·Рґ, С‚РµРїРµСЂСЊ РіРѕРЅРёС‚СЃСЏ РїРµС€РєРѕРј',
    SNDK: 'Р¤Р»РµС€РєРё РЅРµ СЃРїР°СЃР»Рё РѕС‚ С‚РѕРіРѕ, С‡С‚Рѕ РѕР±Р»Р°РєРѕ СЃСЉРµР»Рѕ РјРёСЂ',
    CRCL: 'РЎС‚РµР№Р±Р»РєРѕРёРЅ, РєРѕС‚РѕСЂС‹Р№ СЃС‚Р°Р±РёР»РµРЅ, РїРѕРєР° РЅРµ СѓРїР°Р»',
    NOW: 'ITSM РЅР° СЃС‚РµСЂРѕРёРґР°С…, РЅРѕ РєР»РёРµРЅС‚С‹ СѓС…РѕРґСЏС‚',
    HOOD: 'Р РѕР±РёРЅ Р“СѓРґ, РєРѕС‚РѕСЂС‹Р№ РіСЂР°Р±РёС‚ Р±РµРґРЅС‹С… Р·Р° РєРѕРјРјРёСЃСЃРёСЋ',
    STX: 'Р•С‰С‘ РѕРґРёРЅ HDD РґРёРЅРѕР·Р°РІСЂ РІ С‚Р°СЂРѕРІС‹С… СЏРјР°С…',
    MRVL: 'Р§РёРїС‹ РґР»СЏ РґР°С‚Р°С†РµРЅС‚СЂРѕРІ, РєРѕРіРґР° РґР°С‚Р°С†РµРЅС‚СЂС‹ РїСѓСЃС‚С‹',
    ADBE: 'Р“РµРЅРµСЂР°С‚РёРІРЅС‹Р№ РР СЃСЉРµРґР°РµС‚ РёС… РѕР±РµРґ, Р° РѕРЅРё РїСЂРѕРґР°СЋС‚ РїРѕРґРїРёСЃРєСѓ',
    MU: 'Р¦РёРєР»РёС‡РЅРѕСЃС‚СЊ РїР°РјСЏС‚Рё: СЃРµР№С‡Р°СЃ РІРЅРёР·Сѓ, Р·Р°РІС‚СЂР° вЂ” РєС‚Рѕ Р·РЅР°РµС‚',
    IBM: 'РљРѕРЅСЃР°Р»С‚РёРЅРі РІ РѕР±С‘СЂС‚РєРµ "РР", РІРЅСѓС‚СЂРё вЂ” РјРµР№РЅС„СЂРµР№РјС‹ 70-С…'
  };
  var NOTES_EN = {
    NVDA: 'Carries the whole index and refuses to share',
    MSFT: 'Market cap stopped fitting in a human head',
    GOOGL: 'Deflated first and bounced first',
    AMZN: 'Capitalises on someone else\'s hype without flinching',
    META: 'Sold half the internet to sell subscriptions to a chatbot',
    AMD: 'Still catching up, already winning in the reports',
    AVGO: 'Sells custom chips at the price of a dream',
    PLTR: 'Grows faster than analysts can count',
    TSM: 'Makes the chips for everyone who makes chips',
    ORCL: 'Rents out computing and calls it the cloud',
    ARM: 'Collects a licence fee from the whole industry',
    SMCI: 'Servers so fast they get mistaken for weather stations',
    CRM: 'Sells air by subscription, but in a CRM',
    SNOW: 'Stores data about how nobody stores data',
    BTC: 'Crypto stays put, crypto is not going anywhere',
    ETH: 'Same chart, side view, twice the price',
    '^GSPC': 'The market as a whole. Boring and steady, we respect that',
    // Top losers
    APP: 'Mobile ads popped before anyone noticed',
    COIN: 'Crypto exchange that became the bubble itself',
    CRWV: 'GPU rental вЂ” new subprime, but hardware costs more',
    WDC: 'Hard drives in an SSD world? Classic',
    INTC: 'Missed the train, now chasing on foot',
    SNDK: 'Flash drives couldn\'t save them from the cloud eating the world',
    CRCL: 'Stablecoin that\'s stable until it isn\'t',
    NOW: 'ITSM on steroids, but customers are leaving',
    HOOD: 'Robin Hood robbing the poor for fees',
    STX: 'Another HDD dinosaur in tar pits',
    MRVL: 'Datacenter chips when datacenters are empty',
    ADBE: 'GenAI eating their lunch while they sell subscriptions',
    MU: 'Memory cyclicality: at the bottom now, tomorrow вЂ” who knows',
    IBM: 'Consulting wrapped in "AI", mainframes from the 70s inside'
  };

  /* ---------------- РЎРѕСЃС‚РѕСЏРЅРёРµ РїСЂРёР»РѕР¶РµРЅРёСЏ ---------------- */

  /* Р”РµРґР»Р°Р№РЅ С„РёРєСЃРёСЂРѕРІР°РЅ: РґР°С‚Сѓ РЅРµР»СЊР·СЏ СѓСЃС‚Р°РЅРѕРІРёС‚СЊ, РёР·РјРµРЅРёС‚СЊ РёР»Рё РїРѕРґСЃСѓРЅСѓС‚СЊ СЃСЃС‹Р»РєРѕР№. */
  var target = new Date(DEFAULT_TARGET);
  var soundOn = localStorage.getItem(KEY.sound) !== 'off';
  var market = null;
  var chartKey = 'bubble';
  var burstFired = false;
  var lastSecond = -1;

  /* ---------------- Р СѓСЃСЃРєРёРµ СЃРєР»РѕРЅРµРЅРёСЏ ---------------- */

  function plural(n, one, few, many) {
    var n10 = Math.abs(n) % 10, n100 = Math.abs(n) % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few;
    return many;
  }

  function pluralEn(n, word) { return n === 1 ? word : word + 's'; }

  function humanize(ms) {
    var now = new Date();
    var totalDays = Math.floor(ms / 86400000);
    var rest = ms - totalDays * 86400000;
    var h = Math.floor(rest / 3600000);
    var m = Math.floor((rest % 3600000) / 60000);
    var s = Math.floor((rest % 60000) / 1000);

    var anchor = new Date(now.getTime() + totalDays * 86400000);
    var y = anchor.getFullYear() - now.getFullYear();
    var mo = anchor.getMonth() - now.getMonth();
    var d = anchor.getDate() - now.getDate();
    if (d < 0) {
      mo -= 1;
      d += new Date(anchor.getFullYear(), anchor.getMonth(), 0).getDate();
    }
    if (mo < 0) { y -= 1; mo += 12; }
    return { y: y, mo: mo, d: d, h: h, m: m, s: s };
  }

  function humanMain(parts) {
    var out = [];
    if (lang === 'en') {
      if (parts.y) out.push(parts.y + ' ' + pluralEn(parts.y, t('years')));
      if (parts.mo) out.push(parts.mo + ' ' + pluralEn(parts.mo, t('months')));
      if (parts.d) out.push(parts.d + ' ' + pluralEn(parts.d, t('days')));
      if (!out.length) out.push(parts.h + ' ' + pluralEn(parts.h, t('hours')));
    } else {
      if (parts.y) out.push(parts.y + ' ' + plural(parts.y, t('years'), 'РіРѕРґР°', 'Р»РµС‚'));
      if (parts.mo) out.push(parts.mo + ' ' + plural(parts.mo, t('months'), 'РјРµСЃСЏС†Р°', 'РјРµСЃСЏС†РµРІ'));
      if (parts.d) out.push(parts.d + ' ' + plural(parts.d, t('days'), 'РґРЅСЏ', 'РґРЅРµР№'));
      if (!out.length) out.push(parts.h + ' ' + plural(parts.h, t('hours'), 'С‡Р°СЃР°', 'С‡Р°СЃРѕРІ'));
    }
    return out.join(' ');
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------------- РЎРѕСЃС‚РѕСЏРЅРёРµ РїСЂРёР±РѕСЂР° ---------------- */

  function stateFor(ms) {
    var days = ms / 86400000;
    for (var i = 0; i < STATES.length; i += 1) {
      if (days <= STATES[i].max) return STATES[i].id;
    }
    return 'calm';
  }

  /* ---------------- Р—РІСѓРє ---------------- */

  var audio = { ctx: null, master: null };

  function audioReady() {
    if (!soundOn) return null;
    if (!audio.ctx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audio.ctx = new Ctx();
      audio.master = audio.ctx.createGain();
      audio.master.gain.value = 0.5;
      audio.master.connect(audio.ctx.destination);
    }
    if (audio.ctx.state === 'suspended') audio.ctx.resume();
    return audio.ctx;
  }

  function blip(freq, duration, type, gain) {
    var ctx = audioReady();
    if (!ctx) return;
    var osc = ctx.createOscillator();
    var env = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(gain || 0.06, ctx.currentTime + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(env); env.connect(audio.master);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  }

  function pop() {
    var ctx = audioReady();
    if (!ctx) return;
    var len = Math.floor(ctx.sampleRate * 0.5);
    var buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < len; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4);
    }
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.45);
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.5, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    src.connect(filter); filter.connect(env); env.connect(audio.master);
    src.start();

    var osc = ctx.createOscillator();
    var oenv = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.4);
    oenv.gain.setValueAtTime(0.35, ctx.currentTime);
    oenv.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    osc.connect(oenv); oenv.connect(audio.master);
    osc.start(); osc.stop(ctx.currentTime + 0.55);
  }

  /* ---------------- РћС‚СЂРёСЃРѕРІРєР° РїСЂРёР±РѕСЂР° ---------------- */

  function paintInstrument(progress, state) {
    var pressure = Math.round(1013 + progress * 237);
    $('#pressureValue').textContent = String(pressure).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    var angle = -135 + ((pressure - 950) / 300) * 270;
    var marker = $('#marker');
    if (marker) marker.style.setProperty('--marker-rot', (angle + 51.3).toFixed(2) + 'deg');

    var bubble = $('#bubble');
    // РџРѕСЃР»Рµ СЂР°Р·СЂС‹РІР° РїСѓР·С‹СЂСЊ РЅРµ РЅР°РґСѓРІР°РµС‚СЃСЏ РѕР±СЂР°С‚РЅРѕ: СЃРѕСЃС‚РѕСЏРЅРёРµ РЅРµРѕР±СЂР°С‚РёРјРѕ.
    if (bubble && state !== 'burst') {
      bubble.style.setProperty('--bubble-scale', (0.62 + progress * 0.38).toFixed(3));
    }

    document.body.dataset.state = state;
    var chip = $('#stateChip');
    if (chip) {
      chip.dataset.state = state;
      chip.textContent = t('states')[state] || state;
    }
    var line = $('#stateLine');
    if (line) line.textContent = t('stateLines')[state] || '';
    var note = $('#countNote');
    if (note) note.textContent = t('notes')[state] || '';
  }

  /* ---------------- РћС‚СЂРёСЃРѕРІРєР° РіСЂР°С„РёРєР° ---------------- */

  function seriesPoints(key) {
    if (!market || !market.series) return [];
    var s = market.series[key];
    return s && s.points ? s.points : [];
  }

  function drawChart() {
    var svg = $('#chart');
    if (!svg) return;
    var points = seriesPoints(chartKey);
    if (!points.length) {
      svg.innerHTML = '';
      $('#plotEmpty').hidden = false;
      return;
    }
    $('#plotEmpty').hidden = true;

    var w = svg.clientWidth || 640;
    var h = svg.clientHeight || 224;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    var padL = 44, padR = 10, padT = 12, padB = 22;
    var values = points.map(function (p) { return p[1]; });
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    if (max === min) { max += 1; min -= 1; }
    var span = max - min;
    min -= span * 0.12;
    max += span * 0.12;

    var plotW = w - padL - padR;
    var plotH = h - padT - padB;

    var x = function (i) { return padL + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW); };
    var y = function (v) { return padT + plotH - ((v - min) / (max - min)) * plotH; };

    var line = '', area = '';
    for (var i = 0; i < points.length; i += 1) {
      line += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(points[i][1]).toFixed(1) + ' ';
    }
    area = line + 'L' + x(points.length - 1).toFixed(1) + ' ' + (padT + plotH) + ' L' + x(0).toFixed(1) + ' ' + (padT + plotH) + ' Z';

    var grid = '';
    for (var g = 0; g <= 4; g += 1) {
      var gy = padT + (g / 4) * plotH;
      var gv = max - (g / 4) * (max - min);
      grid += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + gy.toFixed(1) + '" stroke="#1A1E25" stroke-width="1"/>';
      grid += '<text x="' + (padL - 8) + '" y="' + (gy + 3.5).toFixed(1) + '" fill="#8A93A0" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="end">' + fmtAxis(gv) + '</text>';
    }

    var labels = '';
    var count = Math.min(5, points.length);
    for (var k = 0; k < count; k += 1) {
      var idx = Math.round((k / (count - 1)) * (points.length - 1));
      var lx = x(idx);
      var anchor = k === 0 ? 'start' : (k === count - 1 ? 'end' : 'middle');
      labels += '<text x="' + lx.toFixed(1) + '" y="' + (h - 5) + '" fill="#8A93A0" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="' + anchor + '">' + fmtDate(points[idx][0]) + '</text>';
    }

    var lastX = x(points.length - 1), lastY = y(points[points.length - 1][1]);
    var rising = points[points.length - 1][1] >= points[0][1];

    var drumTop = 'M ' + padL + ' ' + (padT - 4) + ' Q ' + (w / 2) + ' ' + (padT - 14) + ' ' + (w - padR) + ' ' + (padT - 4);
    var drumBottom = 'M ' + padL + ' ' + (h - padB + 10) + ' Q ' + (w / 2) + ' ' + (h - padB + 18) + ' ' + (w - padR) + ' ' + (h - padB + 10);

    svg.innerHTML =
      '<defs><linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#0B0E12"/><stop offset="55%" stop-color="#0E1218"/><stop offset="100%" stop-color="#0A0D11"/>' +
      '</linearGradient><linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0%" stop-color="#0E1116" stop-opacity=".85"/><stop offset="12%" stop-color="#0E1116" stop-opacity="0"/>' +
      '<stop offset="88%" stop-color="#0E1116" stop-opacity="0"/><stop offset="100%" stop-color="#0E1116" stop-opacity=".85"/>' +
      '</linearGradient></defs>' +
      '<path d="' + drumTop + '" fill="none" stroke="#242A33" stroke-width="1"/>' +
      '<path d="' + drumBottom + '" fill="none" stroke="#242A33" stroke-width="1"/>' +
      grid +
      '<path d="' + area + '" fill="rgba(231,227,215,.05)"/>' +
      '<path d="' + line + '" fill="none" stroke="#E7E3D7" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle cx="' + lastX.toFixed(1) + '" cy="' + lastY.toFixed(1) + '" r="3.6" fill="' + (rising ? '#4FA97A' : '#E0432A') + '"/>' +
      '<rect x="' + padL + '" y="' + (padT - 4) + '" width="' + plotW + '" height="' + (plotH + 4) + '" fill="url(#fade)"/>' +
      labels;

    var name = (I18N[lang].seriesNames && I18N[lang].seriesNames[chartKey]) ||
      (market.series[chartKey] && market.series[chartKey].label) || '';
    var value = points[points.length - 1][1];
    var first = points[0][1];
    var change = first ? ((value / first) - 1) * 100 : 0;
    $('#chartName').textContent = name;
    $('#chartValue').textContent = fmtNumber(value);
    var delta = $('#chartDelta');
    delta.textContent = (change >= 0 ? '+' : 'в€’') + fmtNumber(Math.abs(change)) + '%';
    delta.className = 'mono delta ' + (change >= 0 ? 'up' : 'down');

    var win = $('#chartWindow');
    if (win) {
      var days = Math.round((new Date(points[points.length - 1][0]) - new Date(points[0][0])) / 86400000);
      win.textContent = lang === 'ru'
        ? (days >= 170 ? 'Р·Р° РїРѕР»РіРѕРґР°' : 'Р·Р° ' + days + ' ' + plural(days, 'РґРµРЅСЊ', 'РґРЅСЏ', 'РґРЅРµР№'))
        : (days >= 170 ? 'over 6 months' : 'over ' + days + ' ' + pluralEn(days, 'day'));
    }
  }

  function fmtNumber(n) {
    var rounded = Math.abs(n) >= 100 ? Math.round(n * 10) / 10 : Math.round(n * 100) / 100;
    var s = String(rounded);
    var dot = s.indexOf('.');
    var intPart = dot === -1 ? s : s.slice(0, dot);
    var frac = dot === -1 ? '' : s.slice(dot);
    if (lang === 'en') {
      return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + frac;
    }
    return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + frac.replace('.', ',');
  }

  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    try {
      return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' });
    } catch (e) { return iso; }
  }

  var MONTHS_RU = ['СЏРЅРІР°СЂСЏ', 'С„РµРІСЂР°Р»СЏ', 'РјР°СЂС‚Р°', 'Р°РїСЂРµР»СЏ', 'РјР°СЏ', 'РёСЋРЅСЏ',
    'РёСЋР»СЏ', 'Р°РІРіСѓСЃС‚Р°', 'СЃРµРЅС‚СЏР±СЂСЏ', 'РѕРєС‚СЏР±СЂСЏ', 'РЅРѕСЏР±СЂСЏ', 'РґРµРєР°Р±СЂСЏ'];
  var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  function fmtDateLong(date) {
    var time = pad2(date.getHours()) + ':' + pad2(date.getMinutes());
    if (lang === 'en') {
      return MONTHS_EN[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ', ' + time;
    }
    return date.getDate() + ' ' + MONTHS_RU[date.getMonth()] + ' ' + date.getFullYear() + ', ' + time;
  }

  function fmtShortDate(date) {
    return pad2(date.getDate()) + '.' + pad2(date.getMonth() + 1) + '.' + date.getFullYear() +
      ' ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes());
  }

  /* РџРѕРґРїРёСЃРё РѕСЃРё: РєСЂСѓРіР»С‹Рµ С‡РёСЃР»Р° Р±РµР· СЂР°Р·РґРµР»РёС‚РµР»СЏ СЂР°Р·СЂСЏРґРѕРІ. */
  function fmtAxis(v) {
    if (Math.abs(v) >= 100) return String(Math.round(v));
    return String(Math.round(v * 10) / 10);
  }

  /* ---------------- Р–СѓСЂРЅР°Р» ---------------- */

  function renderLog() {
    var body = $('#logBody');
    if (!body) return;
    if (!market || !market.quotes || !market.quotes.length) {
      body.innerHTML = '<tr class="log-empty"><td colspan="4">' + t('noData') + '</td></tr>';
      return;
    }
    var notes = lang === 'ru' ? NOTES : NOTES_EN;
    var rows = market.quotes.map(function (q) {
      var change = q.changePct || 0;
      var cls = change > 0 ? 'up' : (change < 0 ? 'down' : '');
      var note = notes[q.symbol] || (lang === 'ru' ? 'РќР°Р±Р»СЋРґРµРЅРёР№ РЅРµС‚, РЅРѕ С‚РёРєРµСЂ РІ СЃРїРёСЃРєРµ' : 'No note, but the ticker is on the list');
      return '<tr>' +
        '<td class="ticker-cell">' + q.symbol + '</td>' +
        '<td class="price-cell mono">' + fmtNumber(q.price) + '</td>' +
        '<td class="mono ' + cls + '">' + (change > 0 ? '+' : (change < 0 ? 'в€’' : '')) + fmtNumber(Math.abs(change)) + '%</td>' +
        '<td class="note-cell">' + note + '</td>' +
        '</tr>';
    });
    body.innerHTML = rows.join('');
  }

  function renderStamp() {
    var stamp = $('#dataStamp');
    if (!stamp) return;
    if (!market || !market.generatedAt) { stamp.textContent = t('stamp'); return; }
    var mins = Math.floor((Date.now() - new Date(market.generatedAt).getTime()) / 60000);
    if (mins < 2) stamp.textContent = t('fresh');
    else if (mins < 60) stamp.textContent = mins + ' ' + t('minAgo');
    else if (mins < 1440) stamp.textContent = Math.floor(mins / 60) + ' ' + t('hoursAgo');
    else stamp.textContent = Math.floor(mins / 1440) + ' ' + t('daysAgo');
  }

  /* ---------------- Р’РєР»Р°РґРєРё РіСЂР°С„РёРєР° ---------------- */

  function renderTabs() {
    var wrap = $('#tabs');
    if (!wrap || !market || !market.series) return;
    var keys = Object.keys(market.series);
    wrap.innerHTML = keys.map(function (key) {
      var label = (I18N[lang].tabs && I18N[lang].tabs[key]) || (market.series[key].label || key);
      return '<button class="tab" type="button" role="tab" data-key="' + key + '" aria-selected="' + (key === chartKey) + '">' + label + '</button>';
    }).join('');
  }

  /* ---------------- РћСЃРЅРѕРІРЅРѕР№ С‚РёРє ---------------- */

  function tick() {
    var now = Date.now();
    var remaining = target.getTime() - now;
    var state = stateFor(remaining);
    var parts = humanize(Math.max(0, remaining));

    var main = $('#humanMain');
    if (remaining <= 0) {
      main.textContent = lang === 'ru' ? 'РџСѓР·С‹СЂСЊ Р»РѕРїРЅСѓР»' : 'The bubble burst';
      $('#humanClock').textContent = '00:00:00';
    } else if (remaining < 60000) {
      main.textContent = t('lessMinute');
      $('#humanClock').textContent = '00:00:' + pad2(parts.s);
    } else {
      main.textContent = humanMain(parts);
      $('#humanClock').textContent = pad2(parts.h) + ':' + pad2(parts.m) + ':' + pad2(parts.s);
    }

    var progress = 1 - Math.min(Math.max(remaining, 0), SPAN_DAYS * 86400000) / (SPAN_DAYS * 86400000);
    paintInstrument(progress, state);

    if (parts.s !== lastSecond) {
      lastSecond = parts.s;
      if (remaining > 0 && remaining < 11000) blip(1180, 0.05, 'square', 0.035);
      else if (parts.s === 0) blip(760, 0.16, 'sine', 0.05);
    }

    $('#clockNow').textContent = new Date().toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    document.title = (remaining > 0 ? main.textContent + ' В· ' : 'РџРЈР—Р«Р Р¬ Р›РћРџРќРЈР› В· ') + 'РџРЈР—Р«Р Р¬ AI';

    if (remaining <= 0 && !burstFired) fireBurst();
  }

  /* ---------------- Р¤РёРЅР°Р» ---------------- */

  function slipStats() {
    var points = seriesPoints('bubble');
    var indexValue = points.length ? points[points.length - 1][1] : null;
    var visits = parseInt(localStorage.getItem(KEY.visits) || '1', 10);
    var since = Math.max(0, Math.round((Date.now() - target.getTime()) / 86400000));
    return [
      [t('statsLife'), since + ' ' + (lang === 'ru' ? plural(since, 'РґРµРЅСЊ', 'РґРЅСЏ', 'РґРЅРµР№') : pluralEn(since, 'day'))],
      [t('statsChecks'), String(visits)],
      [t('statsIndex'), indexValue === null ? 'вЂ”' : fmtNumber(indexValue)],
      [t('statsNotes'), market && market.quotes ? String(market.quotes.length) : 'вЂ”']
    ];
  }

  function renderSlipStats() {
    var wrap = $('#slipStats');
    if (!wrap) return;
    wrap.innerHTML = slipStats().map(function (s) {
      return '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>';
    }).join('');
  }

  function fireBurst() {
    burstFired = true;
    pop();
    var flash = $('#burstFlash');
    if (flash) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
    var bubble = $('#bubble');
    if (bubble) bubble.style.setProperty('--bubble-scale', '0.05');

    var jokes = t('jokes');
    var joke = jokes[Math.floor(Math.random() * jokes.length)];

    renderSlipStats();
    $('#slipJoke').textContent = joke;
    $('#slip').hidden = false;
  }

  /* ---------------- РЇР·С‹Рє ---------------- */

  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (I18N[lang][key] !== undefined) el.textContent = I18N[lang][key];
    });
    $('#langBtn').textContent = lang === 'ru' ? 'EN' : 'RU';
    $('#targetDate').textContent = fmtDateLong(target);
    $('#deadlineValue').textContent = fmtShortDate(target);
    if (market) { renderTabs(); renderLog(); }
    renderStamp();
    tick();
    drawChart();
  }

  /* ---------------- РўРѕСЃС‚ ---------------- */

  var toastTimer = null;
  function toast(message) {
    var el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2400);
  }

  /* ---------------- Р”Р°РЅРЅС‹Рµ ---------------- */

  function loadMarket() {
    return fetch('data/market.json', { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        market = data;
        if (!market.series[chartKey]) {
          var first = Object.keys(market.series)[0];
          if (first) chartKey = first;
        }
        renderTabs();
        renderLog();
        renderStamp();
        drawChart();
        if (burstFired) renderSlipStats();
      })
      .catch(function (err) {
        console.error('loadMarket error:', err);
        renderLog();
        $('#plotEmpty').hidden = false;
        renderStamp();
      });
  }

  /* ---------------- Р—Р°РїСѓСЃРє ---------------- */

  function init() {
    var stored = localStorage.getItem(KEY.lang);
    lang = (stored === 'ru' || stored === 'en') ? stored : 'ru';

    var visits = parseInt(localStorage.getItem(KEY.visits) || '0', 10) + 1;
    localStorage.setItem(KEY.visits, String(visits));

    var born = localStorage.getItem('puzyr.born.v1');
    if (!born) {
      born = new Date().toISOString();
      localStorage.setItem('puzyr.born.v1', born);
    }
    var passStarted = $('#passStarted');
    if (passStarted) passStarted.textContent = fmtShortDate(new Date(born));
    var passChecks = $('#passChecks');
    if (passChecks) passChecks.textContent = String(visits);

    var soundBtn = $('#soundBtn');
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundBtn.textContent = soundOn ? (lang === 'ru' ? 'Р—РІСѓРє' : 'Sound') : (lang === 'ru' ? 'Р—РІСѓРє РІС‹РєР»' : 'Muted');

    applyLang();
    loadMarket();
    tick();
    setInterval(tick, 1000);
    setInterval(renderStamp, 60000);

    $('#soundBtn').addEventListener('click', function () {
      soundOn = !soundOn;
      localStorage.setItem(KEY.sound, soundOn ? 'on' : 'off');
      soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      soundBtn.textContent = soundOn ? (lang === 'ru' ? 'Р—РІСѓРє' : 'Sound') : (lang === 'ru' ? 'Р—РІСѓРє РІС‹РєР»' : 'Muted');
      if (soundOn) { audioReady(); blip(900, 0.08, 'sine', 0.05); }
    });

    $('#langBtn').addEventListener('click', function () {
      lang = lang === 'ru' ? 'en' : 'ru';
      localStorage.setItem(KEY.lang, lang);
      applyLang();
    });

    $('#tabs').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-key]');
      if (!btn) return;
      chartKey = btn.getAttribute('data-key');
      $$('#tabs .tab').forEach(function (t) {
        t.setAttribute('aria-selected', t.getAttribute('data-key') === chartKey ? 'true' : 'false');
      });
      drawChart();
    });

    $('#slipReplay').addEventListener('click', function () {
      $('#slip').hidden = true;
      var bubble = $('#bubble');
      if (bubble) bubble.style.setProperty('--bubble-scale', '0.05');
      setTimeout(function () {
        pop();
        var flash = $('#burstFlash');
        if (flash) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
        renderSlipStats();
        $('#slip').hidden = false;
      }, 500);
    });
    $('#slipShare').addEventListener('click', function () {
      var url = location.origin + location.pathname;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { toast(t('copied')); },
          function () { toast(url); });
      } else {
        toast(url);
      }
    });

    var bubbleWrap = $('#bubble');
    if (bubbleWrap) {
      bubbleWrap.addEventListener('click', function () {
        bubbleWrap.style.setProperty('--bubble-scale', '0.66');
        setTimeout(function () {
          var remaining = target.getTime() - Date.now();
          var progress = 1 - Math.min(Math.max(remaining, 0), SPAN_DAYS * 86400000) / (SPAN_DAYS * 86400000);
          bubbleWrap.style.setProperty('--bubble-scale', (0.62 + progress * 0.38).toFixed(3));
        }, 420);
        if (soundOn) blip(520, 0.12, 'sine', 0.05);
      });
    }

    if (window.ResizeObserver) {
      new ResizeObserver(function () { drawChart(); }).observe($('#plot'));
    } else {
      window.addEventListener('resize', drawChart);
    }

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { tick(); drawChart(); }
    });

    var unlock = function () { audioReady(); document.removeEventListener('pointerdown', unlock); };
    document.addEventListener('pointerdown', unlock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();/ /   f o r c e  
 