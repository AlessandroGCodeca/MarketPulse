// --- Renderers ---
function renderTicker() {
    if (isLoading) {
        document.getElementById('ticker').innerHTML = Array(10).fill('<div class="ticker-item skeleton" style="width:100px;height:20px;margin-right:30px"></div>').join('');
        document.getElementById('ticker-2').innerHTML = '';
        return;
    }

    const tickers = [document.getElementById('ticker'), document.getElementById('ticker-2')];

    tickers.forEach(container => {
        if (!container) return;

        // If the correct number of children don't exist, build them first
        if (container.children.length !== assets.length) {
            container.innerHTML = assets.map(a => `
                    <div class="ticker-item" id="ticker-item-${container.id}-${a.id}" onclick="openChart('${a.id}')" onmousemove="showTickerTooltip(event, '${a.id}')" onmouseleave="hideTickerTooltip()">
                        <span class="ticker-id">${a.id}</span>
                        <svg class="sparkline"></svg>
                        <span class="ticker-price"></span>
                    </div>`).join('');
        }

        // Update text and classes without replacing DOM tree
        assets.forEach((a, index) => {
            const item = container.children[index];
            if (!item) return;

            const hist = a.history.slice(-10);
            const color = hist[9] > hist[0] ? 'var(--bullish)' : 'var(--bearish)';
            const points = hist.map((v, i) => `${(i / 9) * 40},${20 - ((v - Math.min(...hist)) / (Math.max(...hist) - Math.min(...hist))) * 20}`).join(' ');

            let flashClass = '';
            if (a.history.length > 2) {
                const latest = a.history[a.history.length - 1];
                const prev = a.history[a.history.length - 2];
                if (Math.abs(latest - prev) > 0.00001) {
                    flashClass = latest > prev ? 'flash-up' : 'flash-down';
                }
            }

            const change24 = (a.price - a.history[0]) / a.history[0];
            let glowClass = '';
            if (change24 > 0.03) glowClass = 'bullish-glow';
            if (change24 < -0.03) glowClass = 'bearish-glow';

            item.className = `ticker-item ${flashClass} ${glowClass}`;
            item.querySelector('.ticker-id').innerText = a.id;

            const svg = item.querySelector('svg');
            if (svg) {
                svg.style.stroke = color;
                svg.innerHTML = `<polyline points="${points}"/>`;
            }

            const priceSpan = item.querySelector('.ticker-price');
            if (priceSpan) {
                priceSpan.innerText = formatPrice(a.price);
            }
        });
    });
}

// --- Ticker Tooltip Logic ---
function showTickerTooltip(e, id) {
    const a = assets.find(x => x.id === id);
    if (!a) return;
    const tip = document.getElementById('ticker-tooltip');

    // Calculate Day Stats (Simulated for now based on history)
    const low = Math.min(...a.history);
    const high = Math.max(...a.history);
    const change = ((a.price - a.history[0]) / a.history[0] * 100).toFixed(2);
    const color = change >= 0 ? 'var(--bullish)' : 'var(--bearish)';

    tip.innerHTML = `
                <div style="font-weight:700; font-size:14px; margin-bottom:5px">${a.name} (${a.id})</div>
                <div style="opacity:0.8; margin-bottom:2px">Price: <b>${formatPrice(a.price)}</b></div>
                <div style="opacity:0.8; margin-bottom:2px; color:${color}">24h: ${change > 0 ? '+' : ''}${change}%</div>
                <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:5px; padding-top:5px; display:flex; justify-content:space-between; opacity:0.6; font-size:10px">
                    <span>L: ${formatPrice(low)}</span>
                    <span>H: ${formatPrice(high)}</span>
                </div>
            `;

    // Positioning (Safe bounds)
    let top = e.clientY + 15;
    let left = e.clientX + 15;
    if (left + 160 > window.innerWidth) left -= 170; // Flip left if near edge

    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
    tip.style.display = 'block';
}

function hideTickerTooltip() {
    document.getElementById('ticker-tooltip').style.display = 'none';
}

// --- Economic Calendar (Timeline) ---
function updateCalendar() {
    const events = [
        { time: '14:30', event: 'US Non-Farm Payrolls', impact: 'high', status: 'past' },
        { time: '15:00', event: 'ISM Manufacturing PMI', impact: 'medium', status: 'past' },
        { time: 'NOW', event: 'Market Open', impact: 'high', status: 'active' },
        { time: '16:00', event: 'Fed Chair Speech', impact: 'high', status: 'future' },
        { time: 'Tomorrow', event: 'ECB Rate Decision', impact: 'high', status: 'future' }
    ];

    const html = `
                <div style="margin:20px 0; border-top:1px solid var(--card-border); padding-top:20px">
                    <div style="font-weight:600; font-size:14px; margin-bottom:15px; display:flex; justify-content:space-between">
                        <span data-i18n="calendar">Market Timeline</span>
                        <span style="opacity:0.5; font-size:11px">EST</span>
                    </div>
                    <div class="timeline-container">
                    ${events.map(e => `
                        <div class="timeline-event ${e.status === 'active' ? 'active' : ''}">
                            <div style="opacity:0.6; margin-bottom:4px">${e.time}</div>
                            <div style="font-weight:600; margin-bottom:4px">${e.event}</div>
                            <div style="display:flex;align-items:center;gap:5px">
                                <span class="cal-impact" style="background:${e.impact === 'high' ? 'var(--bearish)' : 'var(--neutral)'}"></span>
                                <span style="font-size:10px;opacity:0.8">${e.impact.toUpperCase()}</span>
                            </div>
                        </div>
                    `).join('')}
                    </div>
                </div>
            `;

    const existing = document.getElementById('eco-calendar');
    if (existing) existing.innerHTML = html;
    else {
        const div = document.createElement('div');
        div.id = 'eco-calendar';
        div.innerHTML = html;
        document.getElementById('analyst-insights').after(div);
    }
}

// --- Stock Screener ---
let activeFilter = 'all';
let searchQuery = '';

// --- Search Handler (with input validation) ---
function handleSearch(query) {
    // Validate and sanitize search input
    const validation = InputValidator.validate(query, 'search');

    if (!validation.valid && validation.errors.length > 0) {
        // Show warning for significant validation issues
        const criticalErrors = validation.errors.filter(e => !e.includes('truncated') && !e.includes('removed'));
        if (criticalErrors.length > 0) {
            showToast('⚠️ Invalid search input', 'warning');
            return;
        }
    }

    searchQuery = (validation.value || '').toLowerCase();
    renderGrid();
}

// --- Bookmarks (localStorage) ---
const savedBookmarks = JSON.parse(localStorage.getItem('newsBookmarks') || '[]');

function toggleBookmark(articleId) {
    const idx = savedBookmarks.indexOf(articleId);
    if (idx > -1) {
        savedBookmarks.splice(idx, 1);
    } else {
        savedBookmarks.push(articleId);
    }
    localStorage.setItem('newsBookmarks', JSON.stringify(savedBookmarks));
    renderGrid();
}

function isBookmarked(articleId) {
    return savedBookmarks.includes(articleId);
}

// --- Currency Converter ---
let currencyRates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5 };
let activeCurrency = 'USD';

async function fetchCurrencyRates() {
    try {
        // Use SecureFetch with rate limiting
        const res = await SecureFetch.fetch(
            'https://api.exchangerate-api.com/v4/latest/USD',
            'exchangerate'
        );
        if (!res.ok) {
            if (res.status === 429) console.warn('ExchangeRate: Rate limited');
            throw new Error('Currency API rate limited');
        }
        const data = await res.json();
        currencyRates = { USD: 1, EUR: data.rates.EUR, GBP: data.rates.GBP, JPY: data.rates.JPY };
    } catch (e) {
        console.warn('Currency API Error (using defaults):', e);
    }
}

function setCurrency(currency) {
    activeCurrency = currency;
    renderTicker();
    renderHeatmap();
}

function formatPrice(usdPrice) {
    const converted = usdPrice * (currencyRates[activeCurrency] || 1);
    const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
    const decimals = activeCurrency === 'JPY' ? 0 : 2;
    return symbols[activeCurrency] + converted.toFixed(decimals);
}

// Wire up currency selector
document.addEventListener('DOMContentLoaded', () => {
    const currSel = document.getElementById('currency-select');
    if (currSel) {
        currSel.addEventListener('change', (e) => setCurrency(e.target.value));
    }
    fetchCurrencyRates();
});

// --- Sparkline Drawing ---
function drawSparkline(canvas, data, color = '#3b82f6') {
    if (!canvas || !data || data.length < 2) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    data.forEach((val, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((val - min) / range) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

function applyScreener(filter) {
    activeFilter = filter;

    // innovative UI feedback: scroll to top of view
    const view = document.querySelector('main');
    if (view) view.scrollIntoView({ behavior: 'smooth' });

    // Update UI Interface
    document.querySelectorAll('.filter-chip').forEach(btn => {
        if (btn.innerText.toLowerCase().includes(filter.replace('gainers', 'gain').replace('tech', 'tech').replace('crypto', 'crypto'))) {
            btn.classList.add('active');
        } else if (filter === 'all' && btn.innerText === 'All') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Re-render active views
    renderGrid();
    renderHeatmap();
}

// --- Renderers Updated for Screener & Sentiment ---
function getSentiment(text) {
    const pos = ['surge', 'jump', 'record', 'soar', 'rally', 'approval', 'breakthrough', 'profit', 'beat', 'bull', 'trillion'];
    const neg = ['drop', 'fall', 'crash', 'miss', 'fear', 'crisis', 'selloff', 'warn', 'struggle', 'bubble', 'rout', 'threaten'];
    const txt = text.toLowerCase();
    if (pos.some(w => txt.includes(w))) return { label: 'Positive', color: 'var(--bullish)' };
    if (neg.some(w => txt.includes(w))) return { label: 'Negative', color: 'var(--bearish)' };
    return { label: 'Neutral', color: 'var(--text-secondary)' };
}

function renderGrid() {
    const grid = document.getElementById('grid-view');
    let allArticles = (typeof marketData !== 'undefined' ? marketData : []).flatMap(s => s.articles.map(a => ({ ...a, source: s.source })));

    // Add unique IDs if missing
    allArticles.forEach((a, i) => {
        if (!a.id) a.id = `article-${i}-${a.headline.substring(0, 20).replace(/\s/g, '')}`;
    });

    // Search Filter
    if (searchQuery) {
        allArticles = allArticles.filter(a => {
            const txt = (a.headline + a.snippet + a.source).toLowerCase();
            return txt.includes(searchQuery);
        });
    }

    // Category Filter Logic
    if (activeFilter !== 'all') {
        allArticles = allArticles.filter(a => {
            const txt = (a.headline + a.snippet).toLowerCase();
            if (activeFilter === 'tech') return txt.match(/tech|ai|chip|apple|nvidia|amd|microsoft|google/);
            if (activeFilter === 'crypto') return txt.match(/crypto|bitcoin|coin|token|block/);
            if (activeFilter === 'gainers') return txt.match(/surge|jump|record|soar|rally/);
            if (activeFilter === 'saved') return isBookmarked(a.id);
            return true;
        });
    }

    filteredArticles = allArticles;

    grid.innerHTML = filteredArticles.length ? filteredArticles.map((a, i) => {
        const sent = getSentiment(a.headline);
        const bookmarked = isBookmarked(a.id);
        const delay = Math.min(i * 0.05, 0.5);
        return `
                <div class="article-card" style="cursor:pointer; animation: fadeUp 0.4s ease forwards; animation-delay: ${delay}s; opacity: 0;" tabindex="0" role="button" aria-label="Read article: ${a.headline.replace(/"/g, '&quot;')}" onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openNews(${i}); }">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px">
                         <div style="font-size:10px;opacity:0.6;text-transform:uppercase">${a.source || 'News'}</div>
                         <div style="display:flex;gap:8px;align-items:center">
                             <button onclick="event.stopPropagation();toggleBookmark('${a.id}')" style="background:none;border:none;cursor:pointer;font-size:14px;opacity:${bookmarked ? 1 : 0.4};transition:opacity 0.2s" title="${bookmarked ? 'Remove bookmark' : 'Save article'}">${bookmarked ? '🔖' : '📑'}</button>
                             <div style="font-size:9px;padding:2px 6px;border-radius:4px;background:${sent.color}20;color:${sent.color}">${sent.label}</div>
                         </div>
                    </div>
                    <div class="headline" onclick="openNews(${i})">${a.headline}</div>
                    <div style="font-size:13px;opacity:0.8" onclick="openNews(${i})">${a.snippet}</div>
                </div>`;
    }).join('') : '<div style="grid-column:1/-1;text-align:center;padding:40px;opacity:0.5">No news matches this filter.</div>';
}

function renderHeatmap() {
    if (isLoading) {
        document.getElementById('heatmap-view').innerHTML = Array(6).fill('<div class="heatmap-cell skeleton"></div>').join('');
        return;
    }
    const sectors = {};
    // Filter Assets
    const filteredAssets = assets.filter(a => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'tech') return a.sector === 'Tech';
        if (activeFilter === 'crypto') return a.type === 'crypto';
        if (activeFilter === 'gainers') {
            const chg = (a.price - a.history[0]) / a.history[0];
            return chg > 0;
        }
        return true;
    });

    filteredAssets.forEach(a => {
        if (!sectors[a.sector]) sectors[a.sector] = [];
        sectors[a.sector].push(a);
    });

    const keys = Object.keys(sectors);
    const container = document.getElementById('heatmap-view');

    if (keys.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;opacity:0.5">No assets match this filter.</div>';
        return;
    }

    // Remove no-assets message if it exists
    if (container.children.length === 1 && container.children[0].innerText.includes('No assets')) {
        container.innerHTML = '';
    }

    // Ensure exact same number of DOM nodes exist
    if (container.children.length !== keys.length) {
        container.innerHTML = keys.map(s => `<div class="heatmap-cell" tabindex="0" role="button" aria-label="View sector details for ${s}">
                    <div class="heatmap-title" style="font-size:18px;font-weight:bold"></div>
                    <div class="heatmap-change"></div>
                    <div class="heatmap-count" style="font-size:11px;opacity:0.7;margin-top:5px"></div>
                </div>`).join('');
    }

    keys.forEach((s, i) => {
        const items = sectors[s];
        const change = items.reduce((acc, a) => acc + (a.price - a.history[0]) / a.history[0], 0) / items.length;
        const hue = change >= 0 ? 142 : 0;

        let glowClass = '';
        if (change > 0.02) glowClass = 'bullish-glow';
        if (change < -0.02) glowClass = 'bearish-glow';

        const cell = container.children[i];
        cell.className = `heatmap-cell ${glowClass}`;
        cell.style.background = `hsl(${hue}, ${Math.min(Math.abs(change) * 5000, 80)}%, 30%)`;
        cell.onclick = () => showSectorDetails(s);
        cell.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showSectorDetails(s); } };

        cell.querySelector('.heatmap-title').innerText = s;
        cell.querySelector('.heatmap-change').innerText = `${(change * 100).toFixed(2)}%`;
        cell.querySelector('.heatmap-count').innerText = `${items.length} Assets`;
    });
}
function renderCloud() {
    const words = ['Market', 'Rate', 'Growth', 'AI', 'Crypto', 'Stocks', 'Fed', 'Inflation', 'Tech', 'Oil', 'China', 'Earnings'];
    document.getElementById('word-cloud').innerHTML = words.map(w =>
        `<span class="cloud-tag" style="font-size:${12 + Math.random() * 20}px;opacity:${0.5 + Math.random() * 0.5}">${w}</span>`
    ).join('');
}

// --- TradingView Chart V3 ---
function getTVSymbol(name, id, type) {
    // Heuristics for TradingView Symbols
    if (type === 'crypto') return `BINANCE:${id}USDT`;
    if (type === 'forex') return `FX:${id}`;
    if (type === 'commodity') {
        if (id === 'GOLD') return 'OANDA:XAUUSD';
        if (id === 'SILVER') return 'OANDA:XAGUSD';
        if (id === 'OIL') return 'TVC:USOIL';
        return `TVC:${id}`; // Fallback
    }
    // Stocks - Try NASDAQ/NYSE
    const nyse = ['JPM', 'V', 'MA', 'BAC', 'GS', 'MS', 'C', 'WFC', 'WMT', 'KO', 'MCD', 'NKE', 'HD', 'LOW', 'DIS', 'XOM', 'CVX', 'BA', 'GE', 'CAT', 'LMT', 'RTX', 'DE'];
    return nyse.includes(id) ? `NYSE:${id}` : `NASDAQ:${id}`;
}

let currentTVSymbol = null;

function openChart(id) {
    currentAssetId = id;
    const asset = assets.find(a => a.id === id);
    document.getElementById('chart-modal').style.display = 'flex';
    document.getElementById('chart-title').innerText = `${asset.name} (${asset.id})`;

    const symbol = getTVSymbol(asset.name, asset.id, asset.type);

    if (currentTVSymbol === symbol) {
        // Widget already loaded with this symbol, no need to recreate
        return;
    }

    currentTVSymbol = symbol;

    // Initialize TradingView Widget
    if (document.getElementById('tv-chart')) {
        document.getElementById('tv-chart').innerHTML = ''; // Clear previous
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tv-chart",
            "hide_side_toolbar": false
        });
    }
}

function closeChart() { document.getElementById('chart-modal').style.display = 'none'; currentAssetId = null; }

let currentNewsArticle = null;

function openNews(index) {
    const article = filteredArticles[index];
    if (!article) return;
    currentNewsArticle = article; // Store for sharing
    document.getElementById('news-source').innerText = article.source || 'News';
    document.getElementById('news-headline').innerText = article.headline;
    document.getElementById('news-snippet').innerText = article.snippet;
    document.getElementById('news-link-btn').onclick = () => window.open(article.link, '_blank');
    document.getElementById('news-modal').style.display = 'flex';
}

function closeNews() {
    document.getElementById('news-modal').style.display = 'none';
    currentNewsArticle = null;
}

// --- Social Sharing ---
function shareToTwitter() {
    if (!currentNewsArticle) return;
    const text = encodeURIComponent(`${currentNewsArticle.headline} via @MarketPulse`);
    const url = encodeURIComponent(currentNewsArticle.link || window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
}

function shareToLinkedIn() {
    if (!currentNewsArticle) return;
    const url = encodeURIComponent(currentNewsArticle.link || window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=520');
}

function copyNewsLink() {
    if (!currentNewsArticle) return;
    const link = currentNewsArticle.link || window.location.href;
    navigator.clipboard.writeText(link).then(() => {
        showToast('Link copied to clipboard!', 'info');
    }).catch(() => {
        showToast('Failed to copy link', 'down');
    });
}

// --- Sector Drill-down ---
function showSectorDetails(sector) {
    const items = assets.filter(a => a.sector === sector);
    document.getElementById('sector-title').innerText = sector;
    document.getElementById('sector-subtitle').innerText = `${items.length} Assets in this sector`;

    document.getElementById('sector-list').innerHTML = items.map(a => {
        const change = (a.price - a.history[0]) / a.history[0];
        const color = change >= 0 ? 'var(--bullish)' : 'var(--bearish)';
        const hist = a.history.slice(-10);
        const points = hist.map((v, i) => `${(i / 9) * 50},${15 - ((v - Math.min(...hist)) / (Math.max(...hist) - Math.min(...hist))) * 15}`).join(' ');

        return `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer" onclick="openChart('${a.id}');closeSector()">
                    <td style="padding:15px 10px; font-weight:500">
                        <div style="display:flex;align-items:center;gap:10px">
                            <div style="width:24px;height:24px;background:rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px">${a.id[0]}</div>
                            ${a.name} <span style="opacity:0.5;font-size:10px">${a.id}</span>
                        </div>
                    </td>
                    <td style="padding:10px">${formatPrice(a.price)}</td>
                    <td style="padding:10px">
                         <svg width="50" height="15" style="stroke:${color}; fill:none; stroke-width:1.5"><polyline points="${points}"/></svg>
                    </td>
                    <td style="padding:10px; text-align:right; color:${color}">${(change * 100).toFixed(2)}%</td>
                </tr>`;
    }).join('');

    document.getElementById('sector-modal').style.display = 'flex';
}

function closeSector() {
    document.getElementById('sector-modal').style.display = 'none';
}

// --- Comparision Logic ---
function compareAsset(compareId) {
    if (!compareId || !chart) return;
    const compareSeries = chart.addLineSeries({ color: '#fbbf24', lineWidth: 2, title: compareId });

    // Basic Compare: Normalize to start at same point or just overlay
    // Ideally we fetch history for `compareId`, here we simulate or use existing asset history
    const target = assets.find(a => a.id === compareId);
    if (!target) return;

    let time = Math.floor(Date.now() / 1000) - (target.history.length * 86400);
    const data = target.history.map(p => {
        time += 86400;
        return { time, value: p };
    });

    compareSeries.setData(data);
    chart.timeScale().fitContent();
}

// --- AI Analyst ---
function analyzeSentiment() {
    const headlines = (typeof marketData !== 'undefined' ? marketData : []).flatMap(s => s.articles.map(a => a.headline)).join(' ');
    const pos = (headlines.match(/surge|record|jump|growth|high|bull/gi) || []).length;
    const neg = (headlines.match(/drop|crash|fear|inflation|crisis|bear/gi) || []).length;
    const score = 50 + (pos - neg) * 5;
    const val = Math.max(0, Math.min(100, score));

    const el = document.getElementById('sentiment-val');
    el.innerText = val;
    el.style.color = val > 60 ? 'var(--bullish)' : (val < 40 ? 'var(--bearish)' : 'var(--neutral)');
    document.getElementById('sentiment-text').innerText = val > 60 ? "Greed" : (val < 40 ? "Fear" : "Neutral");

    document.getElementById('analyst-insights').innerHTML = `
                <div class="analysis-point">Market sentiment is leaning <b>${val > 50 ? 'Bullish' : 'Bearish'}</b> driven by ${pos > neg ? 'growth narratives' : 'risk factors'}.</div>
            `;
}
function toggleSidebar() { document.body.classList.toggle('sidebar-open'); }

// --- Simulation / Live Data Loop ---
async function simulateMarket() {
    await DataService.updateAssets();
    updateCurrency(currentCurrency);
    updateFearGreed();
    updateAuroraIntensity();
}

