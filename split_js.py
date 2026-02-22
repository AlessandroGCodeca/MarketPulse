import re

with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Define boundaries
p_service = js.find('// --- Data Service ---')
p_news = js.find('// --- Dynamic News Engine (Hybrid: RSS + Simulation) ---')
p_assets = js.find('const assets = [')
p_init = js.find('// --- Init ---')
p_renderers = js.find('// --- Renderers ---')

state_code = js[:p_service]
data_code = js[p_service:p_news]
news_code = js[p_news:p_assets]
assets_code = js[p_assets:p_init]
ui_code = js[p_renderers:]

# Reconstruct
api_js = data_code + news_code + """
// --- Currency Converter ---
let currencyRates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5 };
let activeCurrency = 'USD';

async function fetchCurrencyRates() {
    try {
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
"""

simulation_js = assets_code + """
// --- Simulation / Live Data Loop ---
async function simulateMarket() {
    // Only poll if tab is visible to avoid rate limits
    if (document.visibilityState === 'hidden') return;
    
    await DataService.updateAssets();
    updateCurrency(currentCurrency);
    updateFearGreed();
    updateAuroraIntensity();
}
"""

# Extract currency code from ui_code
ui_code = re.sub(r'// --- Currency Converter ---.*?}\n}', '', ui_code, flags=re.DOTALL)
ui_code = re.sub(r'async function simulateMarket.*?\n}', '', ui_code, flags=re.DOTALL)

app_js = state_code + js[p_init:p_renderers] + """
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
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\\n");
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
"""

ui_code = ui_code.replace("const change = items.reduce((acc, i) => acc + (i.price - i.history[0]) / i.history[0], 0) / items.length;", """const change = items.reduce((acc, i) => acc + (i.price - i.history[0]) / i.history[0], 0) / items.length;""")

for p in ["function formatPrice", "function updateCurrency", "function toggleTheme", "function showToast", "function setView", "function exportCSV", "function initPWA"]:
    ui_code = re.sub(r'// --- Helpers ---.*', '', ui_code, flags=re.DOTALL)


# Write files
with open("js/api.js", "w", encoding="utf-8") as f: f.write(api_js)
with open("js/simulation.js", "w", encoding="utf-8") as f: f.write(simulation_js)
with open("js/ui.js", "w", encoding="utf-8") as f: f.write(ui_code)
with open("js/app.js", "w", encoding="utf-8") as f: f.write(app_js)

print("Split accomplished")
