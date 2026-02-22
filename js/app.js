
        let currentLang = 'en';

        // --- State ---
        let currentCurrency = 'USD';
        let currentAssetId = null;
        let isLoading = true;
        let filteredArticles = []; // Global for interactions
        const rates = { 'USD': 1, 'EUR': 0.92, 'GBP': 0.79 };
        const syms = { 'USD': '$', 'EUR': '€', 'GBP': '£' };

        // --- Init ---
        function init() {
            initTicker(); // Initialize asset data FIRST
            renderTicker();
            renderGrid();
            renderHeatmap();
            renderCloud();
            initPWA();
            analyzeSentiment();
            updateCalendar(); // New Calendar Widget
            updateMarketStatus(); // Market Status Indicator
            updateFearGreed(); // Enhanced Fear & Greed
            updateAuroraIntensity(); // Dynamic aurora
            initMobileGestures(); // Swipe & pinch
            initInfiniteScroll(); // Load more on scroll
            updateCorrelationMatrix(); // Asset correlations
            updateEconomicIndicators(); // Macro data
            setInterval(simulateMarket, 1000);
            setInterval(updateClocks, 1000);
            setInterval(updateMarketStatus, 60000); // Update market status every minute
            setInterval(checkMarketBell, 60000); // Check for market open/close
            setInterval(cycleTitle, 3000); // New Dynamic Title
            updateClocks();
            checkMarketBell(); // Initialize market state
            isLoading = false; // CRITICAL: Reveal the content after init
        }

        // --- Immersion Features ---
        let titleIdx = 0;
        function cycleTitle() {
            const keyAssets = ['BTC', 'NVDA', 'ETH', 'TSLA'];
            const a = assets.find(x => x.id === keyAssets[titleIdx % keyAssets.length]);
            titleIdx++;
            if (a) {
                const price = formatPrice(a.price).split('.')[0];
                document.title = `${a.id} ${price} | Market Pulse`
            }
        }

        // --- Clocks ---
        function updateClocks() {
            const now = new Date();
            const fmt = (tz) => now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
            document.getElementById('time-ny').innerText = fmt('America/New_York');
            document.getElementById('time-ldn').innerText = fmt('Europe/London');
            document.getElementById('time-tky').innerText = fmt('Asia/Tokyo');
        }

        // --- Market Status Indicator ---
        function updateMarketStatus() {
            const now = new Date();
            const markets = [
                { name: 'NYSE', tz: 'America/New_York', open: 9.5, close: 16, flag: '🇺🇸' },
                { name: 'LSE', tz: 'Europe/London', open: 8, close: 16.5, flag: '🇬🇧' },
                { name: 'TSE', tz: 'Asia/Tokyo', open: 9, close: 15, flag: '🇯🇵' }
            ];
            const statusBar = document.getElementById('market-status-bar');
            if (!statusBar) return;
            statusBar.innerHTML = markets.map(m => {
                const localTime = new Date(now.toLocaleString('en-US', { timeZone: m.tz }));
                const hours = localTime.getHours() + localTime.getMinutes() / 60;
                const isOpen = hours >= m.open && hours < m.close;
                const isWeekend = localTime.getDay() === 0 || localTime.getDay() === 6;
                let status, color, countdown;
                if (isWeekend) { status = 'CLOSED'; color = 'var(--text-secondary)'; countdown = 'Weekend'; }
                else if (isOpen) { status = 'OPEN'; color = 'var(--bullish)'; const minsLeft = Math.floor((m.close - hours) * 60); countdown = `Closes in ${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m`; }
                else { status = 'CLOSED'; color = 'var(--bearish)'; const minsToOpen = hours < m.open ? Math.floor((m.open - hours) * 60) : Math.floor((24 - hours + m.open) * 60); countdown = `Opens in ${Math.floor(minsToOpen / 60)}h ${minsToOpen % 60}m`; }
                return `<div style="display:flex;align-items:center;gap:6px"><span>${m.flag}</span><span style="font-weight:600">${m.name}</span><span style="padding:2px 6px;border-radius:4px;background:${color}20;color:${color};font-weight:600">${status}</span><span style="opacity:0.6">${countdown}</span></div>`;
            }).join('');
        }

        // --- Top Movers ---
        function updateTopMovers() {
            const sorted = [...assets].map(a => ({ ...a, change: ((a.price - a.history[0]) / a.history[0]) * 100 })).sort((a, b) => b.change - a.change);
            const gainers = sorted.slice(0, 3);
            const losers = sorted.slice(-3).reverse();
            document.getElementById('top-gainers').innerHTML = gainers.map(a => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer" onclick="openChart('${a.id}')"><span style="font-weight:500">${a.id}</span><span style="color:var(--bullish);font-family:var(--font-mono)">+${a.change.toFixed(2)}%</span></div>`).join('');
            document.getElementById('top-losers').innerHTML = losers.map(a => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer" onclick="openChart('${a.id}')"><span style="font-weight:500">${a.id}</span><span style="color:var(--bearish);font-family:var(--font-mono)">${a.change.toFixed(2)}%</span></div>`).join('');
        }

        // --- Enhanced Fear & Greed ---
        function updateFearGreed() {
            let upCount = 0, totalChange = 0;
            assets.forEach(a => { const change = (a.price - a.history[0]) / a.history[0]; totalChange += change; if (change > 0) upCount++; });
            const upRatio = upCount / assets.length;
            const avgChange = totalChange / assets.length;
            let score = Math.round((upRatio * 50) + (Math.min(avgChange * 500, 50) + 50) / 2);
            score = Math.max(0, Math.min(100, score));
            let label, color;
            if (score < 25) { label = 'Extreme Fear'; color = 'var(--bearish)'; }
            else if (score < 40) { label = 'Fear'; color = '#f97316'; }
            else if (score < 60) { label = 'Neutral'; color = 'var(--neutral)'; }
            else if (score < 75) { label = 'Greed'; color = '#84cc16'; }
            else { label = 'Extreme Greed'; color = 'var(--bullish)'; }
            document.getElementById('sentiment-val').innerText = score;
            document.getElementById('sentiment-val').style.color = color;
            document.getElementById('sentiment-text').innerText = label;
        }

        // --- Dynamic Aurora Intensity ---
        function updateAuroraIntensity() {
            // Calculate market volatility from price changes
            let totalVolatility = 0;
            assets.forEach(a => {
                const change = Math.abs((a.price - a.history[0]) / a.history[0]);
                totalVolatility += change;
            });
            const avgVolatility = totalVolatility / assets.length;

            const ambient = document.querySelector('.ambient-light');
            if (!ambient) return;

            // Update intensity based on volatility
            const intensity = Math.min(0.3 + avgVolatility * 5, 0.7);
            document.documentElement.style.setProperty('--aurora-intensity', intensity);

            // Apply volatility class
            ambient.classList.remove('volatile', 'calm');
            if (avgVolatility > 0.02) {
                ambient.classList.add('volatile');
            } else if (avgVolatility < 0.005) {
                ambient.classList.add('calm');
            }
        }

        // --- Market Bell ---
        let bellMuted = false;
        let lastMarketState = {};

        // Base64 encoded soft bell sound
        const bellSound = new Audio('data:audio/wav;base64,UklGRl4EAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToEAACAgICAgICAgICAgICAgICA/3+Ab319f4qMkpWTkY2IgoF+fHl3dnV1dnl8gIWKj5OWmZqYlI+JgntyamNfX2JocHmDjpefo6WloJmPg3ZqYFpYW2FrcnmAhoyRlZeXlZGMhoB5c25qZ2dpbHJ4fYOIjJCSlJSTkY2IgoB9e3p5eXl6fH+ChYiLjZCRkZCOjIqHhIKAgH9/f4CAgYOEhYaGh4eGhoWEg4KBgIB/f39/f4CAgYKDg4SFhYWFhIOCgYB/fn5+fn5/f4CAgYKCg4OEhISEg4OCgYB/fn5+fn5+f3+AgIGBgoKDg4ODg4KCgYCAf39+fn5+fn9/gICBgYKCgoKDg4OCgoGAgH9/f35+fn5/f4CAgIGBgoKCgoKCgoGBgIB/f35+fn5+fn9/gICAgYGCgoKCgoKBgYCAf39/fn5+fn5/f4CAgICBgYKCgoKCgYGAgIB/f35+fn5+fn9/gICAgYGBgoKCgoGBgICAgH9/fn5+fn5+f3+AgICAgYGBgoKCgYGAgIB/f39+fn5+fn5/f4CAgICBgYGCgoGBgYCAgH9/f35+fn5+fn9/gICAgIGBgYKCgYGBgICAf39/fn5+fn5+f3+AgICAgYGBgYGBgYGAgIB/f39+fn5+fn5/f4CAgICBgYGBgYGBgICAf39/fn5+fn5+f3+AgICAgIGBgYGBgYCAgIB/f39+fn5+fn5/f4CAgICBgYGBgYGAgICAf39/f35+fn5+f3+AgICAgIGBgYGBgYCAgIB/f39+fn5+fn5/f4CAgICAgYGBgYGAgICAf39/f35+fn5+f3+AgICAgIGBgYGBgYCAgIB/f39+fn5+fn5/f4CAgICAgYGBgYGAgICAf39/f35+fn5+f3+AgICAgICBgYGBgYCAgIB/f39+fn5+fn5/f4CAgICAgYGBgYCAgICAf39/f35+fn5+f3+AgICAgICBgYGBgICAf39/f39+fn5+fn5/f4CAgICAgYGBgYCAgIB/f39/fn5+fn5+f3+AgICAgICBgYGAgICAf39/f35+fn5+fn5/f4CAgICAgYGBgICAf39/f39+fn5+fn5/f4CAgICAgIGBgYCAgH9/f39/fn5+fn5+f3+AgICAgICBgYGAgIB/f39/f35+fn5+fn9/gICAgICAgYGAgICAf39/f39+fn5+fn5/f4CAgICAgICBgICAf39/f39/fn5+fn5+f3+AgICAgICAgYCAgH9/f39/f35+fn5+fn9/gICAgICAgICAgIB/f39/f39+fn5+fn5/f4CAgICAgICAgIB/f39/f39+fn5+fn5/f4CAgICAgICAgIB/f39/f35+fn5+fn5/gICAgICAgA==');
        bellSound.volume = 0.3;

        function checkMarketBell() {
            if (bellMuted) return;

            const now = new Date();
            const markets = [
                { name: 'NYSE', tz: 'America/New_York', open: 9.5, close: 16 },
                { name: 'LSE', tz: 'Europe/London', open: 8, close: 16.5 }
            ];

            markets.forEach(m => {
                const localTime = new Date(now.toLocaleString('en-US', { timeZone: m.tz }));
                const hours = localTime.getHours() + localTime.getMinutes() / 60;
                const isWeekend = localTime.getDay() === 0 || localTime.getDay() === 6;
                const isOpen = !isWeekend && hours >= m.open && hours < m.close;

                // Check for state change
                if (lastMarketState[m.name] !== undefined && lastMarketState[m.name] !== isOpen) {
                    bellSound.currentTime = 0;
                    bellSound.play().catch(() => { }); // Ignore autoplay restrictions
                    showToast(`🔔 ${m.name} Market ${isOpen ? 'Open' : 'Closed'}`, isOpen ? 'up' : 'down');
                }
                lastMarketState[m.name] = isOpen;
            });
        }

        function toggleBellMute() {
            bellMuted = !bellMuted;
            const btn = document.getElementById('bell-mute-btn');
            if (btn) btn.innerText = bellMuted ? '🔕' : '🔔';
            showToast(bellMuted ? 'Market bell muted' : 'Market bell enabled', 'info');
        }

        // --- Infinite Scroll ---
        let newsPage = 0;
        const articlesPerPage = 6;
        let allNewsArticles = [];

        function initInfiniteScroll() {
            const grid = document.getElementById('grid-view');
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    loadMoreNews();
                }
            }, { threshold: 0.1 });

            // Create sentinel element
            const sentinel = document.createElement('div');
            sentinel.id = 'scroll-sentinel';
            sentinel.style.height = '20px';
            grid.parentNode.insertBefore(sentinel, grid.nextSibling);
            observer.observe(sentinel);
        }

        function loadMoreNews() {
            const grid = document.getElementById('grid-view');
            const start = newsPage * articlesPerPage;
            const end = start + articlesPerPage;
            const moreArticles = filteredArticles.slice(start, end);

            if (moreArticles.length === 0) return;

            newsPage++;
            moreArticles.forEach((a, i) => {
                const idx = start + i;
                const sent = getSentiment(a.headline);
                const bookmarked = isBookmarked(a.id);
                const card = document.createElement('div');
                card.className = 'article-card';
                card.style.cursor = 'pointer';
                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px">
                         <div style="font-size:10px;opacity:0.6;text-transform:uppercase">${a.source || 'News'}</div>
                         <div style="display:flex;gap:8px;align-items:center">
                             <button onclick="event.stopPropagation();toggleBookmark('${a.id}')" style="background:none;border:none;cursor:pointer;font-size:14px;opacity:${bookmarked ? 1 : 0.4};transition:opacity 0.2s" title="${bookmarked ? 'Remove bookmark' : 'Save article'}">${bookmarked ? '🔖' : '📑'}</button>
                             <div style="font-size:9px;padding:2px 6px;border-radius:4px;background:${sent.color}20;color:${sent.color}">${sent.label}</div>
                         </div>
                    </div>
                    <div class="headline" onclick="openNews(${idx})">${a.headline}</div>
                    <div style="font-size:13px;opacity:0.8" onclick="openNews(${idx})">${a.snippet}</div>
                `;
                grid.appendChild(card);
            });
        }

        // --- Mobile Gestures ---
        let touchStartX = 0;
        let touchStartY = 0;
        let heatmapScale = 1;
        let initialPinchDistance = 0;

        function initMobileGestures() {
            const main = document.querySelector('main');
            if (!main) return;

            // Swipe left/right to switch views
            main.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            main.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 1) {
                    const dx = e.changedTouches[0].clientX - touchStartX;
                    const dy = e.changedTouches[0].clientY - touchStartY;

                    // Only if horizontal swipe > 50px and more horizontal than vertical
                    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                        const gridHidden = document.getElementById('grid-view').classList.contains('view-hidden');
                        if (dx > 0 && gridHidden) {
                            setView('grid');
                            showToast('📰 Grid View', 'info');
                        } else if (dx < 0 && !gridHidden) {
                            setView('heatmap');
                            showToast('🔥 Heatmap View', 'info');
                        }
                    }
                }
            }, { passive: true });

            // Pinch-to-zoom on heatmap
            const heatmap = document.getElementById('heatmap-view');
            if (heatmap) {
                heatmap.addEventListener('touchstart', (e) => {
                    if (e.touches.length === 2) {
                        initialPinchDistance = Math.hypot(
                            e.touches[1].clientX - e.touches[0].clientX,
                            e.touches[1].clientY - e.touches[0].clientY
                        );
                    }
                }, { passive: true });

                heatmap.addEventListener('touchmove', (e) => {
                    if (e.touches.length === 2) {
                        const currentDistance = Math.hypot(
                            e.touches[1].clientX - e.touches[0].clientX,
                            e.touches[1].clientY - e.touches[0].clientY
                        );
                        const scaleDelta = currentDistance / initialPinchDistance;
                        heatmapScale = Math.min(Math.max(heatmapScale * scaleDelta, 0.5), 3);
                        heatmap.style.transform = `scale(${heatmapScale})`;
                        heatmap.style.transformOrigin = 'center center';
                        initialPinchDistance = currentDistance;
                    }
                }, { passive: true });

                // Double-tap to reset zoom
                let lastTap = 0;
                heatmap.addEventListener('touchend', (e) => {
                    const now = Date.now();
                    if (now - lastTap < 300) {
                        heatmapScale = 1;
                        heatmap.style.transform = 'scale(1)';
                        showToast('🔄 Zoom reset', 'info');
                    }
                    lastTap = now;
                });
            }
        }

        // --- Correlation Matrix ---
        function calculateCorrelation(arr1, arr2) {
            const n = Math.min(arr1.length, arr2.length, 20);
            if (n < 2) return 0;
            const s1 = arr1.slice(-n), s2 = arr2.slice(-n);
            const mean1 = s1.reduce((a, b) => a + b, 0) / n;
            const mean2 = s2.reduce((a, b) => a + b, 0) / n;
            let num = 0, den1 = 0, den2 = 0;
            for (let i = 0; i < n; i++) {
                const d1 = s1[i] - mean1, d2 = s2[i] - mean2;
                num += d1 * d2; den1 += d1 * d1; den2 += d2 * d2;
            }
            return den1 && den2 ? num / Math.sqrt(den1 * den2) : 0;
        }

        function updateCorrelationMatrix() {
            const keyAssets = ['BTC', 'ETH', 'NVDA', 'AAPL'];
            const el = document.getElementById('correlation-matrix');
            if (!el) return;
            el.innerHTML = keyAssets.flatMap(id1 =>
                keyAssets.map(id2 => {
                    const a1 = assets.find(a => a.id === id1);
                    const a2 = assets.find(a => a.id === id2);
                    const corr = id1 === id2 ? 1 : (a1 && a2 ? calculateCorrelation(a1.history, a2.history) : 0);
                    const bg = corr > 0.3 ? `rgba(34,197,94,${Math.abs(corr)})` : corr < -0.3 ? `rgba(239,68,68,${Math.abs(corr)})` : 'rgba(255,255,255,0.1)';
                    return `<div style="padding:4px;text-align:center;border-radius:3px;background:${bg}" title="${id1}/${id2}">${id1 === id2 ? id1 : corr.toFixed(1)}</div>`;
                })
            ).join('');
        }

        // --- Economic Indicators ---
        const ecoData = { CPI: { v: 3.2, d: 'Inflation' }, Unemployment: { v: 3.7, d: 'Jobless' }, GDP: { v: 2.1, d: 'Growth' }, FedRate: { v: 5.25, d: 'Fed Rate' } };
        function updateEconomicIndicators() {
            const el = document.getElementById('economic-indicators');
            if (!el) return;
            el.innerHTML = Object.entries(ecoData).map(([k, d]) => {
                d.v += (Math.random() - 0.5) * 0.02;
                const color = k === 'GDP' ? 'var(--bullish)' : k === 'CPI' ? 'var(--bearish)' : 'var(--neutral)';
                return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05)"><span>${d.d}</span><span style="font-weight:600;color:${color}">${d.v.toFixed(1)}%</span></div>`;
            }).join('');
        }

        
// --- Helpers ---
function formatPrice(p) { return syms[currentCurrency] + (p * currencyRates[currentCurrency]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function updateCurrency(c) { currentCurrency = c; renderTicker(); }
function toggleTheme() { document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; }
function showToast(msg, type = 'info') {
    const t = document.createElement('div'); t.className = 'toast';
    const icon = type === 'up' ? '📈' : (type === 'down' ? '��' : '🔔');
    t.innerHTML = `${icon} ${msg}`;
    const c = document.getElementById('toast-container'); c.appendChild(t);
    setTimeout(() => t.style.transform = 'translateX(0)', 10);
    setTimeout(() => { t.style.transform = 'translateX(100%)'; setTimeout(() => t.remove(), 300); }, 5000);
}
function setView(v) {
    document.getElementById('grid-view').classList.toggle('view-hidden', v !== 'grid');
    document.getElementById('heatmap-view').classList.toggle('view-hidden', v === 'grid');
}

// --- Export CSV ---
function exportCSV() {
    const headers = ["ID,Name,Type,Sector,Price,Change%"];
    const rows = assets.map(a => {
        const change = ((a.price - a.history[0]) / a.history[0] * 100).toFixed(2);
        return `${a.id},${a.name},${a.type},${a.sector},${a.price.toFixed(2)},${change}%`;
    });
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `market_pulse_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Market Data Exported", "info");
}

// --- PWA ---
function initPWA() {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
}

// Wire up currency selector
document.addEventListener('DOMContentLoaded', () => {
    const currSel = document.getElementById('currency-select');
    if (currSel) {
        currSel.addEventListener('change', (e) => setCurrency(e.target.value));
    }
    fetchCurrencyRates();
});

function setCurrency(currency) {
    activeCurrency = currency;
    renderTicker();
    renderHeatmap();
}

init();
