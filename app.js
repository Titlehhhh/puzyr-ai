/* ==========================================================
   Р СџР Р€Р вЂ”Р В«Р В Р В¬ AI РІР‚вЂќ РЎРѓРЎвЂљР В°Р Р…РЎвЂ Р С‘РЎРЏ Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р ВµР Р…Р С‘РЎРЏ Р В·Р В° Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎвЂР С
   Р В§Р С‘РЎРѓРЎвЂљРЎвЂ№Р в„– РЎРѓРЎвЂљР В°РЎвЂљР С‘РЎвЂЎР ВµРЎРѓР С”Р С‘Р в„– РЎРѓР С”РЎР‚Р С‘Р С—РЎвЂљ: Р В±Р ВµР В· РЎРѓР В±Р С•РЎР‚Р С”Р С‘ Р С‘ Р В±Р ВµР В· Р В·Р В°Р Р†Р С‘РЎРѓР С‘Р СР С•РЎРѓРЎвЂљР ВµР в„–.
   ========================================================== */
(function () {
  'use strict';

  var DEFAULT_TARGET = '2028-03-31T23:59:59';
  var SPAN_DAYS = 1095;            // РЎв‚¬Р С”Р В°Р В»Р В° Р Т‘Р В°Р Р†Р В»Р ВµР Р…Р С‘РЎРЏ РЎР‚Р В°РЎРѓРЎвЂљРЎРЏР Р…РЎС“РЎвЂљР В° Р Р…Р В° РЎвЂљРЎР‚Р С‘ Р С–Р С•Р Т‘Р В°
  var KEY = {
    sound: 'puzyr.sound.v1',
    lang: 'puzyr.lang.v1',
    visits: 'puzyr.visits.v1'
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------- Р Р‡Р В·РЎвЂ№Р С”Р С‘ ---------------- */

  var I18N = {
    ru: {
      station: 'Р РЋРЎвЂљР В°Р Р…РЎвЂ Р С‘РЎРЏ Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р ВµР Р…Р С‘РЎРЏ',
      deadline: 'Р вЂќР С• РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†Р В°',
      sound: 'Р вЂ”Р Р†РЎС“Р С”',
      pressure: 'Р вЂќР В°Р Р†Р В»Р ВµР Р…Р С‘Р Вµ Р Р† Р С—РЎС“Р В·РЎвЂ№РЎР‚Р Вµ',
      hpa: 'Р С–Р СџР В°',
      untilBreak: 'Р Т‘Р С• РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†Р В° Р СР ВµР СР В±РЎР‚Р В°Р Р…РЎвЂ№',
      chartTitle: 'Р вЂР В°РЎР‚Р С•Р С–РЎР‚Р В°РЎвЂћ: Р С‘Р Р…Р Т‘Р ВµР С”РЎРѓ Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЏ',
      noData: 'Р вЂќР В°Р Р…Р Р…РЎвЂ№Р Вµ Р ВµРЎвЂ°РЎвЂ Р Р…Р Вµ Р В·Р В°Р С–РЎР‚РЎС“Р В·Р С‘Р В»Р С‘РЎРѓРЎРЉ',
      stamp: 'Р Т‘Р В°Р Р…Р Р…РЎвЂ№Р Вµ Р Р…Р Вµ Р В·Р В°Р С–РЎР‚РЎС“Р В¶Р ВµР Р…РЎвЂ№',
      journalTitle: 'Р вЂ“РЎС“РЎР‚Р Р…Р В°Р В» Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р ВµР Р…Р С‘Р в„–',
      passport: 'Р СџР В°РЎРѓР С—Р С•РЎР‚РЎвЂљ Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р ВµР Р…Р С‘РЎРЏ',
      passStarted: 'Р СњР В°Р В±Р В»РЎР‹Р Т‘Р ВµР Р…Р С‘Р Вµ Р Р…Р В°РЎвЂЎР В°РЎвЂљР С•',
      passChecks: 'Р С›РЎвЂљР СР ВµРЎвЂљР С•Р С” Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р В°РЎвЂљР ВµР В»РЎРЏ',
      passDefault: 'Р вЂќР ВµР Т‘Р В»Р В°Р в„–Р Р… РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†Р В°',
      passSource: 'Р ВРЎРѓРЎвЂљР С•РЎвЂЎР Р…Р С‘Р С” Р С”Р С•РЎвЂљР С‘РЎР‚Р С•Р Р†Р С•Р С”',
      disclaimer: 'Р С”Р С•Р СР СР ВµР Р…РЎвЂљР В°РЎР‚Р С‘Р С‘ Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р В°РЎвЂљР ВµР В»РЎРЏ, Р В° Р Р…Р Вµ Р С‘Р Р…Р Р†Р ВµРЎРѓРЎвЂљР С‘РЎвЂ Р С‘Р С•Р Р…Р Р…РЎвЂ№Р в„– РЎРѓР С•Р Р†Р ВµРЎвЂљ',
      colTicker: 'Р СћР С‘Р С”Р ВµРЎР‚',
      colPrice: 'Р В¦Р ВµР Р…Р В°',
      colChange: 'Р ВР В·Р С.',
      colNote: 'Р СњР В°Р В±Р В»РЎР‹Р Т‘Р ВµР Р…Р С‘Р Вµ',
      sourceNote: 'Р ВРЎРѓРЎвЂљР С•РЎвЂЎР Р…Р С‘Р С” Р С—РЎР‚Р С•Р С–Р Р…Р С•Р В·Р В°: Р С–Р В°Р Т‘Р В°Р Р…Р С‘Р Вµ Р Р…Р В° Р С”Р С•РЎвЂћР ВµР в„–Р Р…Р С•Р в„– Р С–РЎС“РЎвЂ°Р Вµ. Р С™Р С•РЎвЂљР С‘РЎР‚Р С•Р Р†Р С”Р С‘: Yahoo Finance Р С‘ CoinGecko, Р С•Р В±Р Р…Р С•Р Р†Р В»РЎРЏРЎР‹РЎвЂљРЎРѓРЎРЏ Р В°Р Р†РЎвЂљР С•Р СР В°РЎвЂљР С‘РЎвЂЎР ВµРЎРѓР С”Р С‘.',
      localTime: 'Р С—Р С• Р СР ВµРЎРѓРЎвЂљР Р…Р С•Р СРЎС“ Р Р†РЎР‚Р ВµР СР ВµР Р…Р С‘',
      burstTitle: 'Р СџРЎР‚Р С•РЎвЂљР С•Р С”Р С•Р В» РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†Р В°',
      burstHeadline: 'Р СџР Р€Р вЂ”Р В«Р В Р В¬ Р вЂєР С›Р СџР СњР Р€Р вЂє',
      replay: 'Р вЂўРЎвЂ°РЎвЂ РЎР‚Р В°Р В·',
      share: 'Р СџР С•Р Т‘Р ВµР В»Р С‘РЎвЂљРЎРЉРЎРѓРЎРЏ',
      copied: 'Р РЋРЎРѓРЎвЂ№Р В»Р С”Р В° РЎРѓР С”Р С•Р С—Р С‘РЎР‚Р С•Р Р†Р В°Р Р…Р В°',
      fresh: 'РЎвЂљР С•Р В»РЎРЉР С”Р С• РЎвЂЎРЎвЂљР С•',
      minAgo: 'Р СР С‘Р Р… Р Р…Р В°Р В·Р В°Р Т‘',
      hoursAgo: 'РЎвЂЎ Р Р…Р В°Р В·Р В°Р Т‘',
      daysAgo: 'Р Т‘Р Р… Р Р…Р В°Р В·Р В°Р Т‘',
      statsLife: 'Р вЂќР Р…Р ВµР в„– РЎРѓ РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†Р В°',
      statsChecks: 'Р С›РЎвЂљР СР ВµРЎвЂљР С•Р С” Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р В°РЎвЂљР ВµР В»РЎРЏ',
      statsIndex: 'Р ВР Р…Р Т‘Р ВµР С”РЎРѓ Р Р…Р В° РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†Р Вµ',
      statsNotes: 'Р вЂ”Р В°Р С—Р С‘РЎРѓР ВµР в„– Р Р† Р В¶РЎС“РЎР‚Р Р…Р В°Р В»Р Вµ',
      days: 'Р Т‘Р ВµР Р…РЎРЉ',
      months: 'Р СР ВµРЎРѓРЎРЏРЎвЂ ',
      years: 'Р С–Р С•Р Т‘',
      hours: 'РЎвЂЎР В°РЎРѓ',
      minutes: 'Р СР С‘Р Р…РЎС“РЎвЂљР В°',
      seconds: 'РЎРѓР ВµР С”РЎС“Р Р…Р Т‘Р В°',
      lessMinute: 'Р СР ВµР Р…РЎРЉРЎв‚¬Р Вµ Р СР С‘Р Р…РЎС“РЎвЂљРЎвЂ№',
      tabs: { bubble: 'Р ВР Р…Р Т‘Р ВµР С”РЎРѓ', nvda: 'NVIDIA', gspc: 'S&P 500', bitcoin: 'Bitcoin' },
      seriesNames: { bubble: 'Р ВР Р…Р Т‘Р ВµР С”РЎРѓ Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЏ', nvda: 'NVIDIA', gspc: 'S&P 500', bitcoin: 'Bitcoin' },
      states: {
        calm: 'Р Р€РЎРѓРЎвЂљР С•Р в„–РЎвЂЎР С‘Р Р†',
        growth: 'Р СњР В°Р С—Р С•Р В»Р Р…РЎРЏР ВµРЎвЂљРЎРѓРЎРЏ',
        warm: 'Р вЂ™РЎвЂ№РЎв‚¬Р Вµ Р Р…Р С•РЎР‚Р СРЎвЂ№',
        nervous: 'Р СњР ВµРЎРѓРЎвЂљР В°Р В±Р С‘Р В»Р ВµР Р…',
        panic: 'Р С™РЎР‚Р С‘РЎвЂљР С‘РЎвЂЎР ВµР Р…',
        critical: 'Р С’Р Р†Р В°РЎР‚Р С‘Р в„–Р Р…РЎвЂ№Р в„–',
        final: 'Р СџРЎР‚Р ВµР Т‘Р ВµР В»РЎРЉР Р…РЎвЂ№Р в„–',
        burst: 'Р В Р В°Р В·РЎР‚РЎвЂ№Р Р†'
      },
      stateLines: {
        calm: 'Р СџРЎС“Р В·РЎвЂ№РЎР‚РЎРЉ Р Т‘Р ВµРЎР‚Р В¶Р С‘РЎвЂљ РЎвЂћР С•РЎР‚Р СРЎС“. Р вЂќР В°Р Р†Р В»Р ВµР Р…Р С‘Р Вµ Р Р† Р Р…Р С•РЎР‚Р СР Вµ, Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р В°РЎвЂљР ВµР В»РЎРЉ Р Р…Р В° Р СР ВµРЎРѓРЎвЂљР Вµ.',
        growth: 'Р СџРЎС“Р В·РЎвЂ№РЎР‚РЎРЉ Р Р…Р В°Р В±Р С‘РЎР‚Р В°Р ВµРЎвЂљ Р С•Р В±РЎР‰РЎвЂР С. Р СџР С•Р С”Р В° РЎРЊРЎвЂљР С• Р Р†РЎвЂ№Р С–Р В»РЎРЏР Т‘Р С‘РЎвЂљ Р С”Р В°Р С” Р С•Р В±РЎвЂ№РЎвЂЎР Р…РЎвЂ№Р в„– РЎР‚Р С•РЎРѓРЎвЂљ.',
        warm: 'Р вЂќР В°Р Р†Р В»Р ВµР Р…Р С‘Р Вµ Р Р†РЎвЂ№РЎв‚¬Р Вµ Р Р…Р С•РЎР‚Р СРЎвЂ№. Р В РЎвЂ№Р Р…Р С•Р С” РЎв‚¬РЎС“РЎР‚РЎв‚¬Р С‘РЎвЂљ Р С‘ Р Т‘Р ВµР В»Р В°Р ВµРЎвЂљ Р Р†Р С‘Р Т‘, РЎвЂЎРЎвЂљР С• РЎвЂљР В°Р С” Р С‘ Р Т‘Р С•Р В»Р В¶Р Р…Р С• Р В±РЎвЂ№РЎвЂљРЎРЉ.',
        nervous: 'Р СљР ВµР СР В±РЎР‚Р В°Р Р…Р В° Р Р…Р В°РЎвЂљРЎРЏР Р…РЎС“РЎвЂљР В°. Р С’Р Р…Р В°Р В»Р С‘РЎвЂљР С‘Р С”Р С‘ РЎС“Р Р†Р ВµРЎР‚РЎРЏРЎР‹РЎвЂљ, РЎвЂЎРЎвЂљР С• РЎРЊРЎвЂљР С• Р ВµРЎвЂ°РЎвЂ Р Р…Р Вµ Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЉ.',
        panic: 'Р вЂќР Р…Р С‘ Р С—Р С•РЎв‚¬Р В»Р С‘. Р С™РЎвЂљР С•-РЎвЂљР С• РЎС“Р В¶Р Вµ Р С—РЎР‚Р С•Р Т‘Р В°Р В» РЎРѓРЎвЂљРЎС“Р В».',
        critical: 'Р С›РЎРѓРЎвЂљР В°Р В»Р С•РЎРѓРЎРЉ Р СР ВµР Р…РЎРЉРЎв‚¬Р Вµ РЎРѓРЎС“РЎвЂљР С•Р С”. Р С›РЎвЂљР Т‘Р ВµР В» Р С”Р В°Р Т‘РЎР‚Р С•Р Р† Р С•Р В±Р Р…Р С•Р Р†Р В»РЎРЏР ВµРЎвЂљ РЎР‚Р ВµР В·РЎР‹Р СР Вµ.',
        final: 'Р СљР С‘Р Р…РЎС“РЎвЂљРЎвЂ№ Р Т‘Р С• РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†Р В°. Р вЂ™РЎРѓРЎвЂ РЎР‚Р ВµРЎв‚¬Р ВµР Р…Р С•, Р С•РЎРѓРЎвЂљР В°Р В»Р С•РЎРѓРЎРЉ Р С•РЎвЂћР С•РЎР‚Р СР С‘РЎвЂљРЎРЉ.',
        burst: 'Р СљР ВµР СР В±РЎР‚Р В°Р Р…Р В° Р В»Р С•Р С—Р Р…РЎС“Р В»Р В°. Р СџРЎС“Р В·РЎвЂ№РЎР‚РЎРЏ Р В±Р С•Р В»РЎРЉРЎв‚¬Р Вµ Р Р…Р ВµРЎвЂљ, Р Р…Р С• Р С–РЎР‚Р В°РЎвЂћР С‘Р С” Р С•РЎРѓРЎвЂљР В°Р В»РЎРѓРЎРЏ.'
      },
      notes: {
        calm: 'Р СџР С•Р С”Р В° Р Р†РЎРѓРЎвЂ РЎРѓР С—Р С•Р С”Р С•Р в„–Р Р…Р С•: Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЉ Р Р…Р В°Р Т‘РЎС“Р Р†Р В°Р ВµРЎвЂљРЎРѓРЎРЏ Р СР ВµР Т‘Р В»Р ВµР Р…Р Р…Р С•, Р С‘ РЎР‚РЎвЂ№Р Р…Р С•Р С” Р ВµРЎвЂ°РЎвЂ Р С•Р В±РЎР‰РЎРЏРЎРѓР Р…РЎРЏР ВµРЎвЂљ РЎР‚Р С•РЎРѓРЎвЂљ Р Р†РЎвЂ№РЎР‚РЎС“РЎвЂЎР С”Р С•Р в„–.',
        growth: 'Р СџРЎС“Р В·РЎвЂ№РЎР‚РЎРЉ РЎРѓРЎвЂљР В°Р В» Р В±Р С•Р В»РЎРЉРЎв‚¬Р Вµ, Р Р…Р С• Р СР ВµР СР В±РЎР‚Р В°Р Р…Р В° Р ВµРЎвЂ°РЎвЂ Р Т‘Р ВµРЎР‚Р В¶Р С‘РЎвЂљ. Р С™РЎвЂљР С•-РЎвЂљР С• РЎС“Р В¶Р Вµ Р Р…Р В°Р В·Р Р†Р В°Р В» РЎРЊРЎвЂљР С• Р В·Р Т‘Р С•РЎР‚Р С•Р Р†Р С•Р в„– РЎР‚РЎвЂ№Р Р…Р С•РЎвЂЎР Р…Р С•Р в„– Р Т‘Р С‘Р Р…Р В°Р СР С‘Р С”Р С•Р в„–.',
        warm: 'Р вЂќР В°Р Р†Р В»Р ВµР Р…Р С‘Р Вµ Р С—Р С•Р Т‘Р Р…РЎРЏР В»Р С•РЎРѓРЎРЉ Р Р†РЎвЂ№РЎв‚¬Р Вµ Р Р…Р С•РЎР‚Р СРЎвЂ№. Р ВР Р…Р Т‘Р ВµР С”РЎРѓ Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЏ РЎР‚Р В°РЎРѓРЎвЂљРЎвЂРЎвЂљ Р В±РЎвЂ№РЎРѓРЎвЂљРЎР‚Р ВµР Вµ, РЎвЂЎР ВµР С РЎС“РЎРѓР С—Р ВµР Р†Р В°РЎР‹РЎвЂљ РЎРѓРЎвЂЎР С‘РЎвЂљР В°РЎвЂљРЎРЉ Р В°Р Р…Р В°Р В»Р С‘РЎвЂљР С‘Р С”Р С‘.',
        nervous: 'Р СљР ВµР СР В±РЎР‚Р В°Р Р…Р В° Р Р…Р В°РЎвЂљРЎРЏР Р…РЎС“РЎвЂљР В°. Р В Р В°Р В·Р С–Р С•Р Р†Р С•РЎР‚РЎвЂ№ Р С—Р ВµРЎР‚Р ВµРЎв‚¬Р В»Р С‘ Р С•РЎвЂљ Р С—Р ВµРЎР‚РЎРѓР С—Р ВµР С”РЎвЂљР С‘Р Р† Р С” Р’В«Р В° Р Р†Р Т‘РЎР‚РЎС“Р С–Р’В».',
        panic: 'Р С›РЎРѓРЎвЂљР В°Р В»Р С•РЎРѓРЎРЉ Р Р…Р ВµРЎРѓР С”Р С•Р В»РЎРЉР С”Р С• Р Т‘Р Р…Р ВµР в„–. Р В§Р В°РЎвЂљ Р С—Р ВµРЎР‚Р ВµР С—Р С•Р В»Р Р…Р ВµР Р… Р С—РЎР‚Р С•Р С–Р Р…Р С•Р В·Р В°Р СР С‘, Р С‘ Р Р…Р С‘ Р С•Р Т‘Р С‘Р Р… Р С‘Р В· Р Р…Р С‘РЎвЂ¦ Р Р…Р Вµ Р С—РЎР‚Р С• РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†.',
        critical: 'Р СљР ВµР Р…РЎРЉРЎв‚¬Р Вµ РЎРѓРЎС“РЎвЂљР С•Р С”. Р вЂ™РЎРѓР Вµ Р С—РЎР‚Р С‘Р Р†РЎвЂ№РЎвЂЎР Р…РЎвЂ№Р Вµ Р С•Р В±РЎР‰РЎРЏРЎРѓР Р…Р ВµР Р…Р С‘РЎРЏ Р С•РЎвЂљР СР ВµР Р…РЎРЏРЎР‹РЎвЂљРЎРѓРЎРЏ.',
        final: 'Р СљР С‘Р Р…РЎС“РЎвЂљРЎвЂ№. Р С™РЎвЂљР С•-РЎвЂљР С• Р ВµРЎвЂ°РЎвЂ Р С—Р С‘РЎв‚¬Р ВµРЎвЂљ Р С—РЎР‚Р С•Р С–Р Р…Р С•Р В·, Р С”РЎвЂљР С•-РЎвЂљР С• РЎС“Р В¶Р Вµ Р В·Р В°Р С”РЎР‚РЎвЂ№Р В» РЎвЂљР ВµРЎР‚Р СР С‘Р Р…Р В°Р В».',
        burst: 'Р СџРЎС“Р В·РЎвЂ№РЎР‚РЎРЉ Р В»Р С•Р С—Р Р…РЎС“Р В». Р ВР Р…Р Т‘Р ВµР С”РЎРѓ Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЏ Р С—РЎР‚Р С•Р Т‘Р С•Р В»Р В¶Р В°Р ВµРЎвЂљ РЎР‚Р В°РЎРѓРЎвЂљР С‘: РЎР‚РЎвЂ№Р Р…Р С•Р С” Р ВµРЎвЂ°РЎвЂ Р Р…Р Вµ Р С—Р С•Р Р…РЎРЏР В», РЎвЂЎРЎвЂљР С• Р С—РЎР‚Р С•Р С‘Р В·Р С•РЎв‚¬Р В»Р С•.'
      },
      jokes: [
        'Р СљР ВµР СР В±РЎР‚Р В°Р Р…Р В° Р Р†РЎРѓР С”РЎР‚РЎвЂ№Р В»Р В°РЎРѓРЎРЉ, Р С‘ Р С—Р С• Р Р†РЎРѓР ВµР СРЎС“ РЎвЂљР ВµРЎР‚Р СР С‘Р Р…Р В°Р В»РЎС“ РЎР‚Р В°Р В·Р С•РЎв‚¬РЎвЂР В»РЎРѓРЎРЏ Р В·Р В°Р С—Р В°РЎвЂ¦ Р С—РЎР‚Р В°Р В·Р Т‘Р Р…Р С‘Р С”Р В° Р С‘ РЎС“Р В±РЎвЂ№РЎвЂљР С”Р С•Р Р†.',
        'Р СњР В°Р В±Р В»РЎР‹Р Т‘Р В°РЎвЂљР ВµР В»РЎРЉ Р Р†РЎРѓР С”РЎР‚РЎвЂ№Р В» Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЉ РЎР‚Р В°Р Р…РЎРЉРЎв‚¬Р Вµ РЎРѓРЎР‚Р С•Р С”Р В°. Р С™Р В°Р С” Р С‘ Р С—РЎР‚Р ВµР Т‘РЎС“Р С—РЎР‚Р ВµР В¶Р Т‘Р В°Р В»Р С‘: Р Р†РЎвЂ№Р Т‘Р ВµРЎР‚Р В¶Р В°РЎвЂљРЎРЉ Р С”Р В°Р Т‘РЎР‚ Р Т‘Р С• Р С”Р С•Р Р…РЎвЂ Р В° Р Р…Р Вµ Р Р†РЎвЂ№РЎв‚¬Р В»Р С•.',
        'Р СџРЎС“Р В·РЎвЂ№РЎР‚РЎРЉ Р В»Р С•Р С—Р Р…РЎС“Р В» РЎР‚Р С•Р Р†Р Р…Р С• Р Р† РЎРѓРЎР‚Р С•Р С”. Р СњР С‘Р С”РЎвЂљР С• Р Р…Р Вµ Р В·Р В°Р СР ВµРЎвЂљР С‘Р В». Р вЂњРЎР‚Р В°РЎвЂћР С‘Р С” Р С—РЎР‚Р С•Р Т‘Р С•Р В»Р В¶Р С‘Р В» РЎР‚Р В°РЎРѓРЎвЂљР С‘, Р С”Р В°Р С” Р Р…Р С‘ Р Р† РЎвЂЎРЎвЂР С Р Р…Р Вµ Р В±РЎвЂ№Р Р†Р В°Р В»Р С•.',
        'Р В Р В°Р В·РЎР‚РЎвЂ№Р Р† Р С—РЎР‚Р С•РЎв‚¬РЎвЂР В» Р В±Р ВµР В· Р С—Р С•Р СР ВµРЎвЂ¦. Р СљР ВµР СР В±РЎР‚Р В°Р Р…Р В° Р В±РЎвЂ№Р В»Р В° РЎвЂљР С•Р Р…Р С”Р С•Р в„–, Р С—Р С•Р С”Р В°Р В·Р В°Р Р…Р С‘РЎРЏ РЎвЂЎР ВµРЎРѓРЎвЂљР Р…РЎвЂ№Р СР С‘, Р В° Р Р†РЎвЂ№Р Р†Р С•Р Т‘РЎвЂ№ РЎРѓР Т‘Р ВµР В»Р В°Р Р…РЎвЂ№ Р С—Р С•Р В·Р В¶Р Вµ.',
        'Р СџРЎС“Р В·РЎвЂ№РЎР‚РЎРЉ Р В»Р С•Р С—Р Р…РЎС“Р В». Р СћРЎР‚Р С‘ РЎвЂћР С•Р Р…Р Т‘Р В° Р Р…Р В°Р В·Р Р†Р В°Р В»Р С‘ РЎРЊРЎвЂљР С• Р В·Р Т‘Р С•РЎР‚Р С•Р Р†Р С•Р в„– Р С”Р С•РЎР‚РЎР‚Р ВµР С”РЎвЂ Р С‘Р ВµР в„– Р С‘ РЎРѓРЎР‚Р В°Р В·РЎС“ Р С”РЎС“Р С—Р С‘Р В»Р С‘ Р С—РЎР‚Р С•РЎРѓР В°Р Т‘Р С”РЎС“.'
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

  /* ---------------- Р РЋР С•РЎРѓРЎвЂљР С•РЎРЏР Р…Р С‘РЎРЏ Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЏ ---------------- */

  /* Р СџР С•РЎР‚РЎРЏР Т‘Р С•Р С” Р Р†Р В°Р В¶Р ВµР Р…: РЎРѓР С•РЎРѓРЎвЂљР С•РЎРЏР Р…Р С‘РЎРЏ Р С‘Р Т‘РЎС“РЎвЂљ Р С—Р С• Р Р†Р С•Р В·РЎР‚Р В°РЎРѓРЎвЂљР В°Р Р…Р С‘РЎР‹ Р С—Р С•РЎР‚Р С•Р С–Р В°, Р С‘ Р С—Р С•Р С‘РЎРѓР С” Р В±Р ВµРЎР‚РЎвЂРЎвЂљ
     Р С—Р ВµРЎР‚Р Р†Р С•Р Вµ, РЎС“ Р С”Р С•РЎвЂљР С•РЎР‚Р С•Р С–Р С• Р Т‘Р Р…Р ВµР в„–_Р С•РЎРѓРЎвЂљР В°Р В»Р С•РЎРѓРЎРЉ <= max. Р СџР С•РЎРЊРЎвЂљР С•Р СРЎС“ calm РЎРѓРЎвЂљР С•Р С‘РЎвЂљ Р С—Р С•РЎРѓР В»Р ВµР Т‘Р Р…Р С‘Р С. */
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

  /* Р вЂ”Р В°Р СР ВµРЎвЂљР С”Р С‘ Р Р…Р В°Р В±Р В»РЎР‹Р Т‘Р В°РЎвЂљР ВµР В»РЎРЏ Р С” Р С”Р В°Р В¶Р Т‘Р С•Р СРЎС“ РЎвЂљР С‘Р С”Р ВµРЎР‚РЎС“. Р В­РЎвЂљР С• РЎв‚¬РЎС“РЎвЂљР С”Р В°, Р В° Р Р…Р Вµ РЎвЂћР В°Р С”РЎвЂљ Р С• Р С”Р С•Р СР С—Р В°Р Р…Р С‘Р С‘. */
  var NOTES = {
    NVDA: 'Р вЂќР ВµРЎР‚Р В¶Р С‘РЎвЂљ Р Р…Р В° РЎРѓР ВµР В±Р Вµ Р Р†Р ВµРЎРѓРЎРЉ Р С‘Р Р…Р Т‘Р ВµР С”РЎРѓ Р С‘ Р Р…Р Вµ РЎРѓР С•Р В±Р С‘РЎР‚Р В°Р ВµРЎвЂљРЎРѓРЎРЏ Р Т‘Р ВµР В»Р С‘РЎвЂљРЎРЉРЎРѓРЎРЏ',
    MSFT: 'Р С™Р В°Р С—Р С‘РЎвЂљР В°Р В»Р С‘Р В·Р В°РЎвЂ Р С‘РЎРЏ Р С—Р ВµРЎР‚Р ВµРЎРѓРЎвЂљР В°Р В»Р В° Р С—Р С•Р СР ВµРЎвЂ°Р В°РЎвЂљРЎРЉРЎРѓРЎРЏ Р Р† Р С–Р С•Р В»Р С•Р Р†Р Вµ',
    GOOGL: 'Р СџР ВµРЎР‚Р Р†РЎвЂ№Р С РЎРѓР Т‘РЎС“Р В»РЎРѓРЎРЏ, Р С—Р ВµРЎР‚Р Р†РЎвЂ№Р С Р В¶Р Вµ Р С‘ Р С•РЎвЂљРЎРѓР С”Р С•РЎвЂЎР С‘Р В»',
    AMZN: 'Р С™Р В°Р С—Р С‘РЎвЂљР В°Р В»Р С‘Р В·Р С‘РЎР‚РЎС“Р ВµРЎвЂљ Р Р…Р В° РЎвЂЎРЎС“Р В¶Р С•Р С Р В°Р В¶Р С‘Р С•РЎвЂљР В°Р В¶Р Вµ Р С‘ Р Т‘Р В°Р В¶Р Вµ Р Р…Р Вµ Р СР С•РЎР‚РЎвЂ°Р С‘РЎвЂљРЎРѓРЎРЏ',
    META: 'Р СџРЎР‚Р С•Р Т‘Р В°Р В» Р С—Р С•Р В»Р С•Р Р†Р С‘Р Р…РЎС“ Р С‘Р Р…РЎвЂљР ВµРЎР‚Р Р…Р ВµРЎвЂљР В° РЎР‚Р В°Р Т‘Р С‘ Р С—Р С•Р Т‘Р С—Р С‘РЎРѓР С”Р С‘ Р Р…Р В° РЎР‚Р В°Р В·Р С–Р С•Р Р†Р С•РЎР‚РЎвЂ№ РЎРѓ РЎР‚Р С•Р В±Р С•РЎвЂљР С•Р С',
    AMD: 'Р вЂќР С•Р С–Р С•Р Р…РЎРЏР ВµРЎвЂљ, Р Р…Р С• Р Р† Р С•РЎвЂљРЎвЂЎРЎвЂРЎвЂљР В°РЎвЂ¦ РЎС“Р В¶Р Вµ Р С—Р С•Р В±Р ВµР Т‘Р С‘РЎвЂљР ВµР В»РЎРЉ',
    AVGO: 'Р СџРЎР‚Р С•Р Т‘Р В°РЎвЂРЎвЂљ Р С”Р В°РЎРѓРЎвЂљР С•Р СР Р…РЎвЂ№Р Вµ РЎвЂЎР С‘Р С—РЎвЂ№ Р С—Р С• РЎвЂ Р ВµР Р…Р Вµ Р СР ВµРЎвЂЎРЎвЂљРЎвЂ№',
    PLTR: 'Р В Р В°РЎРѓРЎвЂљРЎвЂРЎвЂљ Р В±РЎвЂ№РЎРѓРЎвЂљРЎР‚Р ВµР Вµ, РЎвЂЎР ВµР С РЎС“РЎРѓР С—Р ВµР Р†Р В°РЎР‹РЎвЂљ РЎРѓРЎвЂЎР С‘РЎвЂљР В°РЎвЂљРЎРЉ Р В°Р Р…Р В°Р В»Р С‘РЎвЂљР С‘Р С”Р С‘',
    TSM: 'Р вЂќР ВµР В»Р В°Р ВµРЎвЂљ РЎвЂЎР С‘Р С—РЎвЂ№ Р Т‘Р В»РЎРЏ Р Р†РЎРѓР ВµРЎвЂ¦, Р С”РЎвЂљР С• Р Т‘Р ВµР В»Р В°Р ВµРЎвЂљ РЎвЂЎР С‘Р С—РЎвЂ№',
    ORCL: 'Р С’РЎР‚Р ВµР Р…Р Т‘РЎС“Р ВµРЎвЂљ Р Р†РЎвЂ№РЎвЂЎР С‘РЎРѓР В»Р ВµР Р…Р С‘РЎРЏ Р С‘ Р Р…Р В°Р В·РЎвЂ№Р Р†Р В°Р ВµРЎвЂљ РЎРЊРЎвЂљР С• Р С•Р В±Р В»Р В°Р С”Р С•Р С',
    ARM: 'Р РЋР С•Р В±Р С‘РЎР‚Р В°Р ВµРЎвЂљ Р В»Р С‘РЎвЂ Р ВµР Р…Р В·Р С‘Р С•Р Р…Р Р…РЎвЂ№Р в„– РЎРѓР В±Р С•РЎР‚ РЎРѓР С• Р Р†РЎРѓР ВµР в„– Р С•РЎвЂљРЎР‚Р В°РЎРѓР В»Р С‘',
    SMCI: 'Р РЋР ВµРЎР‚Р Р†Р ВµРЎР‚РЎвЂ№ Р Р…Р В°РЎРѓРЎвЂљР С•Р В»РЎРЉР С”Р С• Р В±РЎвЂ№РЎРѓРЎвЂљРЎР‚РЎвЂ№Р Вµ, РЎвЂЎРЎвЂљР С• Р С‘РЎвЂ¦ Р С—РЎС“РЎвЂљР В°РЎР‹РЎвЂљ РЎРѓ Р СР ВµРЎвЂљР ВµР С•РЎРѓРЎвЂљР В°Р Р…РЎвЂ Р С‘РЎРЏР СР С‘',
    CRM: 'Р СџРЎР‚Р С•Р Т‘Р В°РЎвЂРЎвЂљ Р Р†Р С•Р В·Р Т‘РЎС“РЎвЂ¦ Р С—Р С• Р С—Р С•Р Т‘Р С—Р С‘РЎРѓР С”Р Вµ, Р Р…Р С• Р Р† CRM',
    SNOW: 'Р ТђРЎР‚Р В°Р Р…Р С‘РЎвЂљ Р Т‘Р В°Р Р…Р Р…РЎвЂ№Р Вµ Р С• РЎвЂљР С•Р С, РЎвЂЎРЎвЂљР С• Р Т‘Р В°Р Р…Р Р…РЎвЂ№Р Вµ Р Р…Р С‘Р С”РЎвЂљР С• Р Р…Р Вµ РЎвЂ¦РЎР‚Р В°Р Р…Р С‘РЎвЂљ',
    BTC: 'Р С™РЎР‚Р С‘Р С—РЎвЂљР В° Р Р…Р В° Р СР ВµРЎРѓРЎвЂљР Вµ, Р С”РЎР‚Р С‘Р С—РЎвЂљР В° Р Р…Р С‘Р С”РЎС“Р Т‘Р В° Р Р…Р Вµ Р Т‘Р ВµР Р…Р ВµРЎвЂљРЎРѓРЎРЏ',
    ETH: 'Р СћР С•РЎвЂљ Р В¶Р Вµ Р С–РЎР‚Р В°РЎвЂћР С‘Р С”, Р Р†Р С‘Р Т‘ РЎРѓР В±Р С•Р С”РЎС“, Р Р†Р Т‘Р Р†Р С•Р Вµ Р Т‘Р С•РЎР‚Р С•Р В¶Р Вµ',
    '^GSPC': 'Р В РЎвЂ№Р Р…Р С•Р С” Р Р† РЎвЂ Р ВµР В»Р С•Р С. Р РЋР С”РЎС“РЎвЂЎР Р…Р С• Р С‘ РЎРѓРЎвЂљР В°Р В±Р С‘Р В»РЎРЉР Р…Р С•, Р СРЎвЂ№ РЎРЊРЎвЂљР С• РЎС“Р Р†Р В°Р В¶Р В°Р ВµР С',
    // Р СћР С•Р С— Р С—Р В°Р Т‘Р ВµР Р…Р С‘РЎРЏ
    APP: 'Р СљР С•Р В±Р С‘Р В»РЎРЉР Р…Р В°РЎРЏ РЎР‚Р ВµР С”Р В»Р В°Р СР В° Р В»Р С•Р С—Р Р…РЎС“Р В»Р В° РЎР‚Р В°Р Р…РЎРЉРЎв‚¬Р Вµ, РЎвЂЎР ВµР С РЎС“РЎРѓР С—Р ВµР В»Р С‘ Р В·Р В°Р СР ВµРЎвЂљР С‘РЎвЂљРЎРЉ',
    COIN: 'Р С™РЎР‚Р С‘Р С—РЎвЂљР С•Р В±Р С‘РЎР‚Р В¶Р В°, Р С”Р С•РЎвЂљР С•РЎР‚Р В°РЎРЏ РЎРѓР В°Р СР В° РЎРѓРЎвЂљР В°Р В»Р В° Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎвЂР С',
    CRWV: 'GPU Р В°РЎР‚Р ВµР Р…Р Т‘Р В° РІР‚вЂќ Р Р…Р С•Р Р†РЎвЂ№Р в„– РЎРѓР В°Р В±Р С—РЎР‚Р С‘Р С, РЎвЂљР С•Р В»РЎРЉР С”Р С• Р В¶Р ВµР В»Р ВµР В·Р С• Р Т‘Р С•РЎР‚Р С•Р В¶Р Вµ',
    WDC: 'Р вЂ“Р ВµРЎРѓРЎвЂљР С”Р С‘Р Вµ Р Т‘Р С‘РЎРѓР С”Р С‘ Р Р† Р СР С‘РЎР‚Р Вµ SSD? Р С™Р В»Р В°РЎРѓРЎРѓР С‘Р С”Р В° Р В¶Р В°Р Р…РЎР‚Р В°',
    INTC: 'Р СџРЎР‚Р С•Р С—РЎС“РЎРѓРЎвЂљР С‘Р В» Р С—Р С•Р ВµР В·Р Т‘, РЎвЂљР ВµР С—Р ВµРЎР‚РЎРЉ Р С–Р С•Р Р…Р С‘РЎвЂљРЎРѓРЎРЏ Р С—Р ВµРЎв‚¬Р С”Р С•Р С',
    SNDK: 'Р В¤Р В»Р ВµРЎв‚¬Р С”Р С‘ Р Р…Р Вµ РЎРѓР С—Р В°РЎРѓР В»Р С‘ Р С•РЎвЂљ РЎвЂљР С•Р С–Р С•, РЎвЂЎРЎвЂљР С• Р С•Р В±Р В»Р В°Р С”Р С• РЎРѓРЎР‰Р ВµР В»Р С• Р СР С‘РЎР‚',
    CRCL: 'Р РЋРЎвЂљР ВµР в„–Р В±Р В»Р С”Р С•Р С‘Р Р…, Р С”Р С•РЎвЂљР С•РЎР‚РЎвЂ№Р в„– РЎРѓРЎвЂљР В°Р В±Р С‘Р В»Р ВµР Р…, Р С—Р С•Р С”Р В° Р Р…Р Вµ РЎС“Р С—Р В°Р В»',
    NOW: 'ITSM Р Р…Р В° РЎРѓРЎвЂљР ВµРЎР‚Р С•Р С‘Р Т‘Р В°РЎвЂ¦, Р Р…Р С• Р С”Р В»Р С‘Р ВµР Р…РЎвЂљРЎвЂ№ РЎС“РЎвЂ¦Р С•Р Т‘РЎРЏРЎвЂљ',
    HOOD: 'Р В Р С•Р В±Р С‘Р Р… Р вЂњРЎС“Р Т‘, Р С”Р С•РЎвЂљР С•РЎР‚РЎвЂ№Р в„– Р С–РЎР‚Р В°Р В±Р С‘РЎвЂљ Р В±Р ВµР Т‘Р Р…РЎвЂ№РЎвЂ¦ Р В·Р В° Р С”Р С•Р СР СР С‘РЎРѓРЎРѓР С‘РЎР‹',
    STX: 'Р вЂўРЎвЂ°РЎвЂ Р С•Р Т‘Р С‘Р Р… HDD Р Т‘Р С‘Р Р…Р С•Р В·Р В°Р Р†РЎР‚ Р Р† РЎвЂљР В°РЎР‚Р С•Р Р†РЎвЂ№РЎвЂ¦ РЎРЏР СР В°РЎвЂ¦',
    MRVL: 'Р В§Р С‘Р С—РЎвЂ№ Р Т‘Р В»РЎРЏ Р Т‘Р В°РЎвЂљР В°РЎвЂ Р ВµР Р…РЎвЂљРЎР‚Р С•Р Р†, Р С”Р С•Р С–Р Т‘Р В° Р Т‘Р В°РЎвЂљР В°РЎвЂ Р ВµР Р…РЎвЂљРЎР‚РЎвЂ№ Р С—РЎС“РЎРѓРЎвЂљРЎвЂ№',
    ADBE: 'Р вЂњР ВµР Р…Р ВµРЎР‚Р В°РЎвЂљР С‘Р Р†Р Р…РЎвЂ№Р в„– Р ВР В РЎРѓРЎР‰Р ВµР Т‘Р В°Р ВµРЎвЂљ Р С‘РЎвЂ¦ Р С•Р В±Р ВµР Т‘, Р В° Р С•Р Р…Р С‘ Р С—РЎР‚Р С•Р Т‘Р В°РЎР‹РЎвЂљ Р С—Р С•Р Т‘Р С—Р С‘РЎРѓР С”РЎС“',
    MU: 'Р В¦Р С‘Р С”Р В»Р С‘РЎвЂЎР Р…Р С•РЎРѓРЎвЂљРЎРЉ Р С—Р В°Р СРЎРЏРЎвЂљР С‘: РЎРѓР ВµР в„–РЎвЂЎР В°РЎРѓ Р Р†Р Р…Р С‘Р В·РЎС“, Р В·Р В°Р Р†РЎвЂљРЎР‚Р В° РІР‚вЂќ Р С”РЎвЂљР С• Р В·Р Р…Р В°Р ВµРЎвЂљ',
    IBM: 'Р С™Р С•Р Р…РЎРѓР В°Р В»РЎвЂљР С‘Р Р…Р С– Р Р† Р С•Р В±РЎвЂРЎР‚РЎвЂљР С”Р Вµ "Р ВР В", Р Р†Р Р…РЎС“РЎвЂљРЎР‚Р С‘ РІР‚вЂќ Р СР ВµР в„–Р Р…РЎвЂћРЎР‚Р ВµР в„–Р СРЎвЂ№ 70-РЎвЂ¦'
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
    CRWV: 'GPU rental РІР‚вЂќ new subprime, but hardware costs more',
    WDC: 'Hard drives in an SSD world? Classic',
    INTC: 'Missed the train, now chasing on foot',
    SNDK: 'Flash drives couldn\'t save them from the cloud eating the world',
    CRCL: 'Stablecoin that\'s stable until it isn\'t',
    NOW: 'ITSM on steroids, but customers are leaving',
    HOOD: 'Robin Hood robbing the poor for fees',
    STX: 'Another HDD dinosaur in tar pits',
    MRVL: 'Datacenter chips when datacenters are empty',
    ADBE: 'GenAI eating their lunch while they sell subscriptions',
    MU: 'Memory cyclicality: at the bottom now, tomorrow РІР‚вЂќ who knows',
    IBM: 'Consulting wrapped in "AI", mainframes from the 70s inside'
  };

  /* ---------------- Р РЋР С•РЎРѓРЎвЂљР С•РЎРЏР Р…Р С‘Р Вµ Р С—РЎР‚Р С‘Р В»Р С•Р В¶Р ВµР Р…Р С‘РЎРЏ ---------------- */

  /* Р вЂќР ВµР Т‘Р В»Р В°Р в„–Р Р… РЎвЂћР С‘Р С”РЎРѓР С‘РЎР‚Р С•Р Р†Р В°Р Р…: Р Т‘Р В°РЎвЂљРЎС“ Р Р…Р ВµР В»РЎРЉР В·РЎРЏ РЎС“РЎРѓРЎвЂљР В°Р Р…Р С•Р Р†Р С‘РЎвЂљРЎРЉ, Р С‘Р В·Р СР ВµР Р…Р С‘РЎвЂљРЎРЉ Р С‘Р В»Р С‘ Р С—Р С•Р Т‘РЎРѓРЎС“Р Р…РЎС“РЎвЂљРЎРЉ РЎРѓРЎРѓРЎвЂ№Р В»Р С”Р С•Р в„–. */
  var target = new Date(DEFAULT_TARGET);
  var soundOn = localStorage.getItem(KEY.sound) !== 'off';
  var market = null;
  var chartKey = 'bubble';
  var burstFired = false;
  var lastSecond = -1;

  /* ---------------- Р В РЎС“РЎРѓРЎРѓР С”Р С‘Р Вµ РЎРѓР С”Р В»Р С•Р Р…Р ВµР Р…Р С‘РЎРЏ ---------------- */

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
      if (parts.y) out.push(parts.y + ' ' + plural(parts.y, t('years'), 'Р С–Р С•Р Т‘Р В°', 'Р В»Р ВµРЎвЂљ'));
      if (parts.mo) out.push(parts.mo + ' ' + plural(parts.mo, t('months'), 'Р СР ВµРЎРѓРЎРЏРЎвЂ Р В°', 'Р СР ВµРЎРѓРЎРЏРЎвЂ Р ВµР Р†'));
      if (parts.d) out.push(parts.d + ' ' + plural(parts.d, t('days'), 'Р Т‘Р Р…РЎРЏ', 'Р Т‘Р Р…Р ВµР в„–'));
      if (!out.length) out.push(parts.h + ' ' + plural(parts.h, t('hours'), 'РЎвЂЎР В°РЎРѓР В°', 'РЎвЂЎР В°РЎРѓР С•Р Р†'));
    }
    return out.join(' ');
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------------- Р РЋР С•РЎРѓРЎвЂљР С•РЎРЏР Р…Р С‘Р Вµ Р С—РЎР‚Р С‘Р В±Р С•РЎР‚Р В° ---------------- */

  function stateFor(ms) {
    var days = ms / 86400000;
    for (var i = 0; i < STATES.length; i += 1) {
      if (days <= STATES[i].max) return STATES[i].id;
    }
    return 'calm';
  }

  /* ---------------- Р вЂ”Р Р†РЎС“Р С” ---------------- */

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

  /* ---------------- Р С›РЎвЂљРЎР‚Р С‘РЎРѓР С•Р Р†Р С”Р В° Р С—РЎР‚Р С‘Р В±Р С•РЎР‚Р В° ---------------- */

  function paintInstrument(progress, state) {
    var pressure = Math.round(1013 + progress * 237);
    $('#pressureValue').textContent = String(pressure).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    var angle = -135 + ((pressure - 950) / 300) * 270;
    var marker = $('#marker');
    if (marker) marker.style.setProperty('--marker-rot', (angle + 51.3).toFixed(2) + 'deg');

    var bubble = $('#bubble');
    // Р СџР С•РЎРѓР В»Р Вµ РЎР‚Р В°Р В·РЎР‚РЎвЂ№Р Р†Р В° Р С—РЎС“Р В·РЎвЂ№РЎР‚РЎРЉ Р Р…Р Вµ Р Р…Р В°Р Т‘РЎС“Р Р†Р В°Р ВµРЎвЂљРЎРѓРЎРЏ Р С•Р В±РЎР‚Р В°РЎвЂљР Р…Р С•: РЎРѓР С•РЎРѓРЎвЂљР С•РЎРЏР Р…Р С‘Р Вµ Р Р…Р ВµР С•Р В±РЎР‚Р В°РЎвЂљР С‘Р СР С•.
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

  /* ---------------- Р С›РЎвЂљРЎР‚Р С‘РЎРѓР С•Р Р†Р С”Р В° Р С–РЎР‚Р В°РЎвЂћР С‘Р С”Р В° ---------------- */

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
    delta.textContent = (change >= 0 ? '+' : 'РІв‚¬вЂ™') + fmtNumber(Math.abs(change)) + '%';
    delta.className = 'mono delta ' + (change >= 0 ? 'up' : 'down');

    var win = $('#chartWindow');
    if (win) {
      var days = Math.round((new Date(points[points.length - 1][0]) - new Date(points[0][0])) / 86400000);
      win.textContent = lang === 'ru'
        ? (days >= 170 ? 'Р В·Р В° Р С—Р С•Р В»Р С–Р С•Р Т‘Р В°' : 'Р В·Р В° ' + days + ' ' + plural(days, 'Р Т‘Р ВµР Р…РЎРЉ', 'Р Т‘Р Р…РЎРЏ', 'Р Т‘Р Р…Р ВµР в„–'))
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

  var MONTHS_RU = ['РЎРЏР Р…Р Р†Р В°РЎР‚РЎРЏ', 'РЎвЂћР ВµР Р†РЎР‚Р В°Р В»РЎРЏ', 'Р СР В°РЎР‚РЎвЂљР В°', 'Р В°Р С—РЎР‚Р ВµР В»РЎРЏ', 'Р СР В°РЎРЏ', 'Р С‘РЎР‹Р Р…РЎРЏ',
    'Р С‘РЎР‹Р В»РЎРЏ', 'Р В°Р Р†Р С–РЎС“РЎРѓРЎвЂљР В°', 'РЎРѓР ВµР Р…РЎвЂљРЎРЏР В±РЎР‚РЎРЏ', 'Р С•Р С”РЎвЂљРЎРЏР В±РЎР‚РЎРЏ', 'Р Р…Р С•РЎРЏР В±РЎР‚РЎРЏ', 'Р Т‘Р ВµР С”Р В°Р В±РЎР‚РЎРЏ'];
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

  /* Р СџР С•Р Т‘Р С—Р С‘РЎРѓР С‘ Р С•РЎРѓР С‘: Р С”РЎР‚РЎС“Р С–Р В»РЎвЂ№Р Вµ РЎвЂЎР С‘РЎРѓР В»Р В° Р В±Р ВµР В· РЎР‚Р В°Р В·Р Т‘Р ВµР В»Р С‘РЎвЂљР ВµР В»РЎРЏ РЎР‚Р В°Р В·РЎР‚РЎРЏР Т‘Р С•Р Р†. */
  function fmtAxis(v) {
    if (Math.abs(v) >= 100) return String(Math.round(v));
    return String(Math.round(v * 10) / 10);
  }

  /* ---------------- Р вЂ“РЎС“РЎР‚Р Р…Р В°Р В» ---------------- */

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
      var note = notes[q.symbol] || (lang === 'ru' ? 'Р СњР В°Р В±Р В»РЎР‹Р Т‘Р ВµР Р…Р С‘Р в„– Р Р…Р ВµРЎвЂљ, Р Р…Р С• РЎвЂљР С‘Р С”Р ВµРЎР‚ Р Р† РЎРѓР С—Р С‘РЎРѓР С”Р Вµ' : 'No note, but the ticker is on the list');
      return '<tr>' +
        '<td class="ticker-cell">' + q.symbol + '</td>' +
        '<td class="price-cell mono">' + fmtNumber(q.price) + '</td>' +
        '<td class="mono ' + cls + '">' + (change > 0 ? '+' : (change < 0 ? 'РІв‚¬вЂ™' : '')) + fmtNumber(Math.abs(change)) + '%</td>' +
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

  /* ---------------- Р вЂ™Р С”Р В»Р В°Р Т‘Р С”Р С‘ Р С–РЎР‚Р В°РЎвЂћР С‘Р С”Р В° ---------------- */

  function renderTabs() {
    var wrap = $('#tabs');
    if (!wrap || !market || !market.series) return;
    var keys = Object.keys(market.series);
    wrap.innerHTML = keys.map(function (key) {
      var label = (I18N[lang].tabs && I18N[lang].tabs[key]) || (market.series[key].label || key);
      return '<button class="tab" type="button" role="tab" data-key="' + key + '" aria-selected="' + (key === chartKey) + '">' + label + '</button>';
    }).join('');
  }

  /* ---------------- Р С›РЎРѓР Р…Р С•Р Р†Р Р…Р С•Р в„– РЎвЂљР С‘Р С” ---------------- */

  function tick() {
    var now = Date.now();
    var remaining = target.getTime() - now;
    var state = stateFor(remaining);
    var parts = humanize(Math.max(0, remaining));

    var main = $('#humanMain');
    if (remaining <= 0) {
      main.textContent = lang === 'ru' ? 'Р СџРЎС“Р В·РЎвЂ№РЎР‚РЎРЉ Р В»Р С•Р С—Р Р…РЎС“Р В»' : 'The bubble burst';
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
    document.title = (remaining > 0 ? main.textContent + ' Р’В· ' : 'Р СџР Р€Р вЂ”Р В«Р В Р В¬ Р вЂєР С›Р СџР СњР Р€Р вЂє Р’В· ') + 'Р СџР Р€Р вЂ”Р В«Р В Р В¬ AI';

    if (remaining <= 0 && !burstFired) fireBurst();
  }

  /* ---------------- Р В¤Р С‘Р Р…Р В°Р В» ---------------- */

  function slipStats() {
    var points = seriesPoints('bubble');
    var indexValue = points.length ? points[points.length - 1][1] : null;
    var visits = parseInt(localStorage.getItem(KEY.visits) || '1', 10);
    var since = Math.max(0, Math.round((Date.now() - target.getTime()) / 86400000));
    return [
      [t('statsLife'), since + ' ' + (lang === 'ru' ? plural(since, 'Р Т‘Р ВµР Р…РЎРЉ', 'Р Т‘Р Р…РЎРЏ', 'Р Т‘Р Р…Р ВµР в„–') : pluralEn(since, 'day'))],
      [t('statsChecks'), String(visits)],
      [t('statsIndex'), indexValue === null ? 'РІР‚вЂќ' : fmtNumber(indexValue)],
      [t('statsNotes'), market && market.quotes ? String(market.quotes.length) : 'РІР‚вЂќ']
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

  /* ---------------- Р Р‡Р В·РЎвЂ№Р С” ---------------- */

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

  /* ---------------- Р СћР С•РЎРѓРЎвЂљ ---------------- */

  var toastTimer = null;
  function toast(message) {
    var el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2400);
  }

  /* ---------------- Р вЂќР В°Р Р…Р Р…РЎвЂ№Р Вµ ---------------- */

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

  /* ---------------- Р вЂ”Р В°Р С—РЎС“РЎРѓР С” ---------------- */

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
    soundBtn.textContent = soundOn ? (lang === 'ru' ? 'Р вЂ”Р Р†РЎС“Р С”' : 'Sound') : (lang === 'ru' ? 'Р вЂ”Р Р†РЎС“Р С” Р Р†РЎвЂ№Р С”Р В»' : 'Muted');

    applyLang();
    loadMarket();
    tick();
    setInterval(tick, 1000);
    setInterval(renderStamp, 60000);

    $('#soundBtn').addEventListener('click', function () {
      soundOn = !soundOn;
      localStorage.setItem(KEY.sound, soundOn ? 'on' : 'off');
      soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      soundBtn.textContent = soundOn ? (lang === 'ru' ? 'Р вЂ”Р Р†РЎС“Р С”' : 'Sound') : (lang === 'ru' ? 'Р вЂ”Р Р†РЎС“Р С” Р Р†РЎвЂ№Р С”Р В»' : 'Muted');
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
})();