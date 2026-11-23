/* ==========================================================
   ПУЗЫРЬ AI — станция наблюдения за пузырём
   Чистый статический скрипт: без сборки и без зависимостей.
   ========================================================== */
(function () {
  'use strict';

  var DEFAULT_TARGET = '2028-03-31T23:59:59';
  var SPAN_DAYS = 1095;            // шкала давления растянута на три года
  var KEY = {
    sound: 'puzyr.sound.v1',
    lang: 'puzyr.lang.v1'
  };

  /* Глобальный счётчик заходов: GoatCounter, без cookie и без своего сервера. */
  var OBSERVATIONS_URL = 'https://titlehhhh.goatcounter.com/counter/TOTAL.json';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------- Языки ---------------- */

  var I18N = {
    ru: {
      station: 'Станция наблюдения',
      deadline: 'До разрыва',
      sound: 'Звук',
      pressure: 'Давление в пузыре',
      hpa: 'гПа',
      untilBreak: 'до разрыва мембраны',
      chartTitle: 'Барограф: индекс пузыря',
      chartPanel: 'График',
      tabsLabel: 'Выбор графика',
      noData: 'Данные ещё не загрузились',
      stamp: 'данные не загружены',
      journalTitle: 'Журнал наблюдений',
      passport: 'Паспорт наблюдения',
      passStarted: 'Наблюдение начато',
      passChecks: 'Заходов на станцию',
      passDefault: 'Дедлайн разрыва',
      passSource: 'Источник котировок',
      disclaimer: 'комментарии наблюдателя, а не инвестиционный совет',
      colTicker: 'Тикер',
      colPrice: 'Цена',
      colChange: 'Изм.',
      colNote: 'Наблюдение',
      sourceNote: 'Источник прогноза: гадание на кофейной гуще. Котировки: Yahoo Finance и CoinGecko, обновляются автоматически. Заходы: GoatCounter, без cookie.',
      localTime: 'по местному времени',
      burstTitle: 'Протокол разрыва',
      burstHeadline: 'ПУЗЫРЬ ЛОПНУЛ',
      replay: 'Ещё раз',
      share: 'Поделиться',
      copied: 'Ссылка скопирована',
      fresh: 'только что',
      minAgo: 'мин назад',
      hoursAgo: 'ч назад',
      daysAgo: 'дн назад',
      statsLife: 'Дней с разрыва',
      statsChecks: 'Заходов на станцию',
      statsIndex: 'Индекс на разрыве',
      statsNotes: 'Записей в журнале',
      days: 'день',
      months: 'месяц',
      years: 'год',
      hours: 'час',
      minutes: 'минута',
      seconds: 'секунда',
      lessMinute: 'меньше минуты',
      tabs: { bubble: 'Индекс', nvda: 'NVIDIA', amd: 'AMD', gspc: 'S&P 500', bitcoin: 'Bitcoin', nbis: 'NBIS', ant: 'ANT' },
      seriesNames: { bubble: 'Индекс пузыря', nvda: 'NVIDIA', amd: 'AMD', gspc: 'S&P 500', bitcoin: 'Bitcoin', nbis: 'Nebius (NBIS)', ant: 'Anthropic (ANT)' },
      ipoWindow: 'с момента IPO',
      states: {
        calm: 'Устойчив',
        growth: 'Наполняется',
        warm: 'Выше нормы',
        nervous: 'Нестабилен',
        panic: 'Критичен',
        critical: 'Аварийный',
        final: 'Предельный',
        burst: 'Разрыв'
      },
      stateLines: {
        calm: 'Пузырь держит форму. Давление в норме, наблюдатель на месте.',
        growth: 'Пузырь набирает объём. Пока это выглядит как обычный рост.',
        warm: 'Давление выше нормы. Рынок шуршит и делает вид, что так и должно быть.',
        nervous: 'Мембрана натянута. Аналитики уверяют, что это ещё не пузырь.',
        panic: 'Дни пошли. Кто-то уже продал стул.',
        critical: 'Осталось меньше суток. Отдел кадров обновляет резюме.',
        final: 'Минуты до разрыва. Всё решено, осталось оформить.',
        burst: 'Мембрана лопнула. Пузыря больше нет, но график остался.'
      },
      notes: {
        calm: 'Пока всё спокойно: пузырь надувается медленно, и рынок ещё объясняет рост выручкой.',
        growth: 'Пузырь стал больше, но мембрана ещё держит. Кто-то уже назвал это здоровой рыночной динамикой.',
        warm: 'Давление поднялось выше нормы. Индекс пузыря растёт быстрее, чем успевают считать аналитики.',
        nervous: 'Мембрана натянута. Разговоры перешли от перспектив к «а вдруг».',
        panic: 'Осталось несколько дней. Чат переполнен прогнозами, и ни один из них не про разрыв.',
        critical: 'Меньше суток. Все привычные объяснения отменяются.',
        final: 'Минуты. Кто-то ещё пишет прогноз, кто-то уже закрыл терминал.',
        burst: 'Пузырь лопнул. Индекс пузыря продолжает расти: рынок ещё не понял, что произошло.'
      },
      jokes: [
        'Мембрана вскрылась, и по всему терминалу разошёлся запах праздника и убытков.',
        'Наблюдатель вскрыл пузырь раньше срока. Как и предупреждали: выдержать кадр до конца не вышло.',
        'Пузырь лопнул ровно в срок. Никто не заметил. График продолжил расти, как ни в чём не бывало.',
        'Разрыв прошёл без помех. Мембрана была тонкой, показания честными, а выводы сделаны позже.',
        'Пузырь лопнул. Три фонда назвали это здоровой коррекцией и сразу купили просадку.'
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
      chartPanel: 'Chart',
      tabsLabel: 'Chart selection',
      noData: 'No data loaded yet',
      stamp: 'no data loaded',
      journalTitle: 'Observer log',
      passport: 'Observation passport',
      passStarted: 'Observation started',
      passChecks: 'Visits to the station',
      passDefault: 'Rupture deadline',
      passSource: 'Quote source',
      disclaimer: 'observer notes, not investment advice',
      colTicker: 'Ticker',
      colPrice: 'Price',
      colChange: 'Chg.',
      colNote: 'Observation',
      sourceNote: 'Forecast source: coffee grounds. Quotes: Yahoo Finance and CoinGecko, refreshed automatically. Visits: GoatCounter, no cookies.',
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
      statsChecks: 'Visits to the station',
      statsIndex: 'Index at rupture',
      statsNotes: 'Log entries',
      days: 'day',
      months: 'month',
      years: 'year',
      hours: 'hour',
      minutes: 'minute',
      seconds: 'second',
      lessMinute: 'less than a minute',
      tabs: { bubble: 'Index', nvda: 'NVIDIA', amd: 'AMD', gspc: 'S&P 500', bitcoin: 'Bitcoin', nbis: 'NBIS', ant: 'ANT' },
      seriesNames: { bubble: 'Bubble index', nvda: 'NVIDIA', amd: 'AMD', gspc: 'S&P 500', bitcoin: 'Bitcoin', nbis: 'Nebius (NBIS)', ant: 'Anthropic (ANT)' },
      ipoWindow: 'since IPO',
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

  /* ---------------- Состояния пузыря ---------------- */

  /* Порядок важен: состояния идут по возрастанию порога, и поиск берёт
     первое, у которого дней_осталось <= max. Поэтому calm стоит последним. */
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

  /* Заметки наблюдателя к каждому тикеру. Это шутка, а не факт о компании. */
  var NOTES = {
    ANT: 'Вышла на биржу и устроила крупнейшее IPO в истории',
    NVDA: 'Держит на себе весь индекс и не собирается делиться',
    MSFT: 'Капитализация перестала помещаться в голове',
    GOOGL: 'Первым сдулся, первым же и отскочил',
    AMZN: 'Капитализирует на чужом ажиотаже и даже не морщится',
    META: 'Продал половину интернета ради подписки на разговоры с роботом',
    AMD: 'Догоняет, но в отчётах уже победитель',
    NBIS: 'Вчерашний «Яндекс», который теперь продаёт вычисления',
    AVGO: 'Продаёт кастомные чипы по цене мечты',
    PLTR: 'Растёт быстрее, чем успевают считать аналитики',
    TSM: 'Делает чипы для всех, кто делает чипы',
    ORCL: 'Арендует вычисления и называет это облаком',
    ARM: 'Собирает лицензионный сбор со всей отрасли',
    SMCI: 'Серверы настолько быстрые, что их путают с метеостанциями',
    CRM: 'Продаёт воздух по подписке, но в CRM',
    SNOW: 'Хранит данные о том, что данные никто не хранит',
    BTC: 'Крипта на месте, крипта никуда не денется',
    ETH: 'Тот же график, вид сбоку, вдвое дороже',
    '^GSPC': 'Рынок в целом. Скучно и стабильно, мы это уважаем',
    // Топ падения
    APP: 'Мобильная реклама лопнула раньше, чем успели заметить',
    COIN: 'Криптобиржа, которая сама стала пузырём',
    CRWV: 'GPU аренда — новый сабприм, только железо дороже',
    WDC: 'Жесткие диски в мире SSD? Классика жанра',
    INTC: 'Пропустил поезд, теперь гонится пешком',
    SNDK: 'Флешки не спасли от того, что облако съело мир',
    CRCL: 'Стейблкоин, который стабилен, пока не упал',
    NOW: 'ITSM на стероидах, но клиенты уходят',
    HOOD: 'Робин Гуд, который грабит бедных за коммиссию',
    STX: 'Ещё один HDD динозавр в таровых ямах',
    MRVL: 'Чипы для датацентров, когда датацентры пусты',
    ADBE: 'Генеративный ИИ съедает их обед, а они продают подписку',
    MU: 'Цикличность памяти: сейчас внизу, завтра — кто знает',
    IBM: 'Консалтинг в обёртке "ИИ", внутри — мейнфреймы 70-х'
  };
  var NOTES_EN = {
    ANT: 'Went public with the largest IPO on record',
    NVDA: 'Carries the whole index and refuses to share',
    MSFT: 'Market cap stopped fitting in a human head',
    GOOGL: 'Deflated first and bounced first',
    AMZN: 'Capitalises on someone else\'s hype without flinching',
    META: 'Sold half the internet to sell subscriptions to a chatbot',
    AMD: 'Still catching up, already winning in the reports',
    NBIS: 'Yesterday\'s Yandex, now selling compute',
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
    CRWV: 'GPU rental — new subprime, but hardware costs more',
    WDC: 'Hard drives in an SSD world? Classic',
    INTC: 'Missed the train, now chasing on foot',
    SNDK: 'Flash drives couldn\'t save them from the cloud eating the world',
    CRCL: 'Stablecoin that\'s stable until it isn\'t',
    NOW: 'ITSM on steroids, but customers are leaving',
    HOOD: 'Robin Hood robbing the poor for fees',
    STX: 'Another HDD dinosaur in tar pits',
    MRVL: 'Datacenter chips when datacenters are empty',
    ADBE: 'GenAI eating their lunch while they sell subscriptions',
    MU: 'Memory cyclicality: at the bottom now, tomorrow — who knows',
    IBM: 'Consulting wrapped in "AI", mainframes from the 70s inside'
  };

  /* ---------------- Состояние приложения ---------------- */

  /* Дедлайн фиксирован: дату нельзя установить, изменить или подсунуть ссылкой. */
  var target = new Date(DEFAULT_TARGET);
  var soundOn = localStorage.getItem(KEY.sound) !== 'off';
  var market = null;
  var chartKey = 'bubble';
  var burstFired = false;
  var lastSecond = -1;

  /* ---------------- Русские склонения ---------------- */

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
      if (parts.y) out.push(parts.y + ' ' + plural(parts.y, t('years'), 'года', 'лет'));
      if (parts.mo) out.push(parts.mo + ' ' + plural(parts.mo, t('months'), 'месяца', 'месяцев'));
      if (parts.d) out.push(parts.d + ' ' + plural(parts.d, t('days'), 'дня', 'дней'));
      if (!out.length) out.push(parts.h + ' ' + plural(parts.h, t('hours'), 'часа', 'часов'));
    }
    return out.join(' ');
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------------- Состояние прибора ---------------- */

  function stateFor(ms) {
    // Разрыв наступает ровно в дедлайн, а не через сутки после него.
    if (ms <= 0) return 'burst';
    var days = ms / 86400000;
    for (var i = 0; i < STATES.length; i += 1) {
      if (days <= STATES[i].max) return STATES[i].id;
    }
    return 'calm';
  }

  /* ---------------- Звук ---------------- */

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

  /* ---------------- Отрисовка прибора ---------------- */

  function paintInstrument(progress, state) {
    var pressure = Math.round(1013 + progress * 237);
    $('#pressureValue').textContent = String(pressure).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    var angle = -135 + ((pressure - 950) / 300) * 270;
    var marker = $('#marker');
    if (marker) marker.style.setProperty('--marker-rot', (angle + 51.3).toFixed(2) + 'deg');

    var bubble = $('#bubble');
    // После разрыва пузырь не надувается обратно: состояние необратимо.
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

  /* ---------------- Отрисовка графика ---------------- */

  function seriesPoints(key) {
    if (!market || !market.series) return [];
    var s = market.series[key];
    return s && s.points ? s.points : [];
  }

  function seriesName(key) {
    return (I18N[lang].seriesNames && I18N[lang].seriesNames[key]) ||
      (market && market.series && market.series[key] && market.series[key].label) || '';
  }

  function drawChart() {
    var svg = $('#chart');
    if (!svg) return;
    // Битые точки (null, строки, невалидные даты) не должны превращаться в NaN в SVG.
    var points = seriesPoints(chartKey).filter(function (p) {
      return p && typeof p[0] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p[0]) &&
        typeof p[1] === 'number' && isFinite(p[1]);
    });
    if (!points.length) {
      svg.innerHTML = '';
      $('#plotEmpty').hidden = false;
      $('#chartName').textContent = seriesName(chartKey);
      $('#chartValue').textContent = '—';
      $('#chartDelta').textContent = '';
      $('#chartDelta').className = 'mono delta';
      $('#chartWindow').textContent = '';
      return;
    }
    $('#plotEmpty').hidden = true;

    var w = svg.clientWidth || 640;
    var h = svg.clientHeight || 224;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    var padR = 10, padT = 12, padB = 22;
    var values = points.map(function (p) { return p[1]; });
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    if (max === min) { max += 1; min -= 1; }
    var span = max - min;
    min -= span * 0.12;
    max += span * 0.12;

    // Левое поле по самой длинной подписи оси: иначе 1 200 000 упирается в край.
    var axisValues = [];
    for (var a = 0; a <= 4; a += 1) axisValues.push(max - (a / 4) * (max - min));
    var axisLen = axisValues.reduce(function (m, v) { return Math.max(m, fmtAxis(v).length); }, 0);
    var padL = Math.min(76, Math.max(44, axisLen * 7 + 14));

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
      var idx = count === 1 ? 0 : Math.round((k / (count - 1)) * (points.length - 1));
      var lx = x(idx);
      var anchor = k === 0 ? 'start' : (k === count - 1 ? 'end' : 'middle');
      labels += '<text x="' + lx.toFixed(1) + '" y="' + (h - 5) + '" fill="#8A93A0" font-family="JetBrains Mono, monospace" font-size="11" text-anchor="' + anchor + '">' + fmtDate(points[idx][0]) + '</text>';
    }

    var lastX = x(points.length - 1), lastY = y(points[points.length - 1][1]);
    var rising = points[points.length - 1][1] >= points[0][1];

    // У короткой серии (свежий листинг) точек мало — показываем их все.
    var dots = '';
    if (points.length <= 12) {
      for (var d = 0; d < points.length; d += 1) {
        dots += '<circle cx="' + x(d).toFixed(1) + '" cy="' + y(points[d][1]).toFixed(1) + '" r="2.4" fill="#E7E3D7"/>';
      }
    }

    // Отметка реального события (например, IPO) — вертикаль и подпись на графике.
    var eventMark = '';
    var event = market.events && market.events[chartKey];
    var eventDate = event && event.date;
    var eventLabel = event && (typeof event.label === 'string'
      ? event.label
      : (event.label && (event.label[lang] || event.label.ru))) || '';
    var hasEvent = false;
    if (eventDate) {
      var evIdx = -1;
      for (var e = 0; e < points.length; e += 1) {
        if (points[e][0] >= eventDate) { evIdx = e; break; }
      }
      if (evIdx >= 0) {
        hasEvent = true;
        var evX = x(evIdx);
        var evText = eventLabel || eventDate;
        // Подпись уходит вправо, но у правого края разворачивается влево.
        var evTextW = evText.length * 6.4;
        var evFlip = evX + 7 + evTextW > w - padR;
        var evColor = '#D9A441';
        eventMark =
          '<line x1="' + evX.toFixed(1) + '" y1="' + padT + '" x2="' + evX.toFixed(1) + '" y2="' + (padT + plotH) + '" stroke="' + evColor + '" stroke-width="1" stroke-dasharray="3 4" opacity=".6"/>' +
          '<circle cx="' + evX.toFixed(1) + '" cy="' + (padT + 3) + '" r="2.4" fill="' + evColor + '"/>' +
          '<text x="' + (evFlip ? evX - 7 : evX + 7).toFixed(1) + '" y="' + (padT + 10) + '" text-anchor="' + (evFlip ? 'end' : 'start') + '" fill="' + evColor + '" font-family="Jost, sans-serif" font-size="11" letter-spacing=".08em">' + esc(evText) + '</text>';
      }
    }

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
      dots +
      '<circle cx="' + lastX.toFixed(1) + '" cy="' + lastY.toFixed(1) + '" r="3.6" fill="' + (rising ? '#4FA97A' : '#E0432A') + '"/>' +
      '<rect x="' + padL + '" y="' + (padT - 4) + '" width="' + plotW + '" height="' + (plotH + 4) + '" fill="url(#fade)"/>' +
      eventMark +
      labels;

    var name = seriesName(chartKey);
    var value = points[points.length - 1][1];
    var first = points[0][1];
    var change = first ? ((value / first) - 1) * 100 : 0;
    svg.setAttribute('aria-label', (name ? name + ' — ' : '') + t('chartTitle'));
    $('#chartName').textContent = name;
    $('#chartValue').textContent = fmtNumber(value);
    var delta = $('#chartDelta');
    var win = $('#chartWindow');

    if (points.length < 2) {
      // Одна точка — это не измерение динамики: не выдумываем «+0% за 0 дней».
      delta.textContent = '';
      delta.className = 'mono delta';
      if (win) win.textContent = '';
      return;
    }

    delta.textContent = (change >= 0 ? '+' : '−') + fmtNumber(Math.abs(change)) + '%';
    delta.className = 'mono delta ' + (change >= 0 ? 'up' : 'down');

    if (win) {
      if (hasEvent) {
        win.textContent = t('ipoWindow');
      } else {
        var days = Math.round((new Date(points[points.length - 1][0]) - new Date(points[0][0])) / 86400000);
        win.textContent = lang === 'ru'
          ? (days >= 170 ? 'за полгода' : 'за ' + days + ' ' + plural(days, 'день', 'дня', 'дней'))
          : (days >= 170 ? 'over 6 months' : 'over ' + days + ' ' + pluralEn(days, 'day'));
      }
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
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

  var MONTHS_RU = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
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

  /* Подписи оси: круглые числа без разделителя разрядов. */
  function fmtAxis(v) {
    if (Math.abs(v) >= 100) return String(Math.round(v));
    return String(Math.round(v * 10) / 10);
  }

  /* ---------------- Журнал ---------------- */

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
      var note = notes[q.symbol] || (lang === 'ru' ? 'Наблюдений нет, но тикер в списке' : 'No note, but the ticker is on the list');
      return '<tr>' +
        '<td class="ticker-cell">' + esc(q.symbol) + '</td>' +
        '<td class="price-cell mono">' + fmtNumber(q.price) + '</td>' +
        '<td class="mono ' + cls + '">' + (change > 0 ? '+' : (change < 0 ? '−' : '')) + fmtNumber(Math.abs(change)) + '%</td>' +
        '<td class="note-cell">' + esc(note) + '</td>' +
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

  /* ---------------- Вкладки графика ---------------- */

  function renderTabs() {
    var wrap = $('#tabs');
    if (!wrap || !market || !market.series) return;
    var keys = Object.keys(market.series);
    if (!keys.length) { wrap.innerHTML = ''; return; }
    if (keys.indexOf(chartKey) === -1) chartKey = keys[0];
    // Перерисовка каждые 5 минут не должна выбивать фокус у клавиатурного пользователя.
    var focused = document.activeElement && document.activeElement.closest
      ? document.activeElement.closest('#tabs [data-key]') : null;
    var focusedKey = focused && focused.getAttribute('data-key');
    wrap.innerHTML = keys.map(function (key) {
      var label = (I18N[lang].tabs && I18N[lang].tabs[key]) || (market.series[key].label || key);
      var selected = key === chartKey;
      return '<button class="tab" type="button" role="tab" id="tab-' + esc(key) + '" aria-controls="plot" data-key="' + esc(key) + '" aria-selected="' + selected + '" tabindex="' + (selected ? '0' : '-1') + '">' + esc(label) + '</button>';
    }).join('');
    if (focusedKey) {
      var again = wrap.querySelector('[data-key="' + focusedKey.replace(/"/g, '\\"') + '"]');
      if (again) again.focus();
    }
  }

  /* ---------------- Основной тик ---------------- */

  function tick() {
    var now = Date.now();
    var remaining = target.getTime() - now;
    var state = stateFor(remaining);
    var parts = humanize(Math.max(0, remaining));

    var main = $('#humanMain');
    if (remaining <= 0) {
      main.textContent = lang === 'ru' ? 'Пузырь лопнул' : 'The bubble burst';
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
    document.title = (remaining > 0 ? main.textContent + ' · ' : 'ПУЗЫРЬ ЛОПНУЛ · ') + 'ПУЗЫРЬ AI';

    if (remaining <= 0 && !burstFired) fireBurst();
  }

  /* ---------------- Финал ---------------- */

  function slipStats() {
    var points = seriesPoints('bubble');
    var indexValue = points.length ? points[points.length - 1][1] : null;
    var since = Math.max(0, Math.round((Date.now() - target.getTime()) / 86400000));
    return [
      [t('statsLife'), since + ' ' + (lang === 'ru' ? plural(since, 'день', 'дня', 'дней') : pluralEn(since, 'day'))],
      [t('statsChecks'), observationsLabel()],
      [t('statsIndex'), indexValue === null ? '—' : fmtNumber(indexValue)],
      [t('statsNotes'), market && market.quotes ? String(market.quotes.length) : '—']
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

  /* ---------------- Язык ---------------- */

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
    syncSoundLabel();
    paintObservations();
    var tabsWrap = $('#tabs');
    if (tabsWrap) tabsWrap.setAttribute('aria-label', t('tabsLabel'));
    var plotWrap = $('#plot');
    if (plotWrap) plotWrap.setAttribute('aria-label', t('chartPanel'));
    if (market) { renderTabs(); renderLog(); }
    renderStamp();
    tick();
    drawChart();
  }

  function syncSoundLabel() {
    var btn = $('#soundBtn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    btn.textContent = soundOn
      ? (lang === 'ru' ? 'Звук' : 'Sound')
      : (lang === 'ru' ? 'Звук выкл' : 'Muted');
  }

  /** Выбор вкладки графика: без перерисовки DOM, чтобы не терять фокус. */
  function selectTab(key, focus) {
    chartKey = key;
    $$('#tabs .tab').forEach(function (tab) {
      var on = tab.getAttribute('data-key') === key;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.setAttribute('tabindex', on ? '0' : '-1');
      if (on && focus) tab.focus();
    });
    drawChart();
  }

  /* ---------------- Тост ---------------- */

  var toastTimer = null;
  function toast(message) {
    var el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2400);
  }

  /* ---------------- Данные ---------------- */

  /* Глобальные заходы. null — счётчик недоступен или ещё не включён. */
  var observations = null;

  function observationsLabel() {
    return observations === null ? '—' : fmtNumber(observations);
  }

  function paintObservations() {
    var el = $('#passChecks');
    if (el) el.textContent = observationsLabel();
    if (burstFired) renderSlipStats();
  }

  function loadObservations() {
    return fetch(OBSERVATIONS_URL, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        // GoatCounter отдаёт готовую строку с разделителями: "1 235".
        var n = parseInt(String(data && data.count).replace(/[^\d]/g, ''), 10);
        if (!isFinite(n)) throw new Error('bad count');
        observations = n;
        paintObservations();
      })
      .catch(function (err) {
        console.warn('observations:', err.message);
        paintObservations();
      });
  }

  function loadMarket() {
    return fetch('data/market.json', { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        market = data;
        var keys = (market && market.series) ? Object.keys(market.series) : [];
        if (keys.indexOf(chartKey) === -1 && keys.length) chartKey = keys[0];
        renderTabs();
        renderLog();
        renderStamp();
        drawChart();
        if (burstFired) renderSlipStats();
      })
      .catch(function (err) {
        console.error('loadMarket error:', err);
        renderLog();
        // Не накрываем уже нарисованный график: показываем пустоту только
        // если данных не было вовсе.
        if (!market) $('#plotEmpty').hidden = false;
        renderStamp();
      });
  }

  /* ---------------- Запуск ---------------- */

  function init() {
    var stored = localStorage.getItem(KEY.lang);
    lang = (stored === 'ru' || stored === 'en') ? stored : 'ru';

    var born = localStorage.getItem('puzyr.born.v1');
    if (!born) {
      born = new Date().toISOString();
      localStorage.setItem('puzyr.born.v1', born);
    }
    var passStarted = $('#passStarted');
    if (passStarted) passStarted.textContent = fmtShortDate(new Date(born));

    var soundBtn = $('#soundBtn');
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundBtn.textContent = soundOn ? (lang === 'ru' ? 'Звук' : 'Sound') : (lang === 'ru' ? 'Звук выкл' : 'Muted');

    applyLang();
    loadObservations();
    loadMarket();
    tick();
    setInterval(tick, 1000);
    setInterval(renderStamp, 60000);
    // Котировки обновляем сами: раз в 5 минут и при возврате на вкладку
    setInterval(loadMarket, 5 * 60 * 1000);

    $('#soundBtn').addEventListener('click', function () {
      soundOn = !soundOn;
      localStorage.setItem(KEY.sound, soundOn ? 'on' : 'off');
      soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      soundBtn.textContent = soundOn ? (lang === 'ru' ? 'Звук' : 'Sound') : (lang === 'ru' ? 'Звук выкл' : 'Muted');
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
      selectTab(btn.getAttribute('data-key'), false);
    });

    // ARIA tabs: стрелки двигают выбор, Home/End прыгают к краям.
    $('#tabs').addEventListener('keydown', function (e) {
      var keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (keys.indexOf(e.key) === -1) return;
      var tabs = $$('#tabs .tab');
      if (!tabs.length) return;
      var current = tabs.indexOf(document.activeElement);
      if (current === -1) current = tabs.indexOf($('#tabs .tab[aria-selected="true"]'));
      var next = current;
      if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
      else next = (current - 1 + tabs.length) % tabs.length;
      e.preventDefault();
      selectTab(tabs[next].getAttribute('data-key'), true);
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
        // После разрыва пузырь не надувается обратно.
        if (burstFired || stateFor(target.getTime() - Date.now()) === 'burst') return;
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
      if (!document.hidden) { tick(); loadMarket(); drawChart(); }
    });

    window.addEventListener('focus', function () { loadMarket(); });

    var unlock = function () { audioReady(); document.removeEventListener('pointerdown', unlock); };
    document.addEventListener('pointerdown', unlock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
