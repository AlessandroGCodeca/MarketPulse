// --- Data Service ---
const DataService = {
    coingeckoMap: {
        'BTC': 'bitcoin', 'ETH': 'ethereum', 'SOL': 'solana', 'BNB': 'binancecoin',
        'XRP': 'ripple', 'ADA': 'cardano', 'DOGE': 'dogecoin', 'DOT': 'polkadot',
        'LINK': 'chainlink', 'MATIC': 'matic-network', 'LTC': 'litecoin',
        'UNI': 'uniswap', 'AVAX': 'avalanche-2', 'SHIB': 'shiba-inu', 'TON': 'the-open-network'
    },

    async fetchCryptoPrices() {
        try {
            const ids = Object.values(this.coingeckoMap).join(',');
            // Use SecureFetch with rate limiting
            const res = await SecureFetch.fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
                'coingecko'
            );
            if (!res.ok) {
                if (res.status === 429) console.warn('CoinGecko: Rate limited');
                throw new Error('API Rate Limit');
            }
            const data = await res.json();
            return data;
        } catch (e) {
            console.warn('Crypto API Error (using sim):', e);
            return null;
        }
    },

    async updateAssets() {
        const cryptoData = await this.fetchCryptoPrices();

        assets.forEach(a => {
            let price = a.price;

            if (a.type === 'crypto' && cryptoData && DataService.coingeckoMap[a.id]) {
                const newPrice = cryptoData[DataService.coingeckoMap[a.id]]?.usd;
                if (newPrice) price = newPrice;
            } else {
                // Simulation Fallback for Stocks/Others (or if API fails)
                const change = (Math.random() - 0.5) * (a.price * 0.005);
                price += change;
            }

            a.price = price;
            a.history.push(price);
            if (a.history.length > 100) a.history.shift();
        });

        renderTicker();
        renderHeatmap(); // Update heatmap values
        if (currentAssetId) openChart(currentAssetId); // Live chart update
    }
};

// --- Init Ticker (CRITICAL: Must run first to populate asset history) ---
function initTicker() {
    assets.forEach(a => {
        if (!a.history || a.history.length === 0) {
            a.history = Array(20).fill(a.price);
        }
    });
}

// --- Dynamic News Engine (Hybrid: RSS + Simulation) ---
const RSSFetcher = {
    feeds: {
        "The Economist": "https://www.economist.com/finance-and-economics/rss.xml",
        "Bloomberg": "https://feeds.bloomberg.com/markets/news.rss",
        "Wall Street Journal": "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
        "Forbes": "https://www.forbes.com/investing/feed/",
        "Marketwatch": "http://feeds.marketwatch.com/marketwatch/topstories/",
        "Reuters": "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
        "CNBC": "https://www.cnbc.com/id/10000664/device/rss/rss.html",
        "Barron's": "https://feeds.barrons.com/barrons/index.xml",
        "Business Insider": "https://feeds.businessinsider.com/custom/all",
        "Yahoo Finance": "https://finance.yahoo.com/news/rssindex",
        "Harvard Business Review": "http://feeds.hbr.org/harvardbusiness",
        "Financial Times": "https://www.ft.com/?format=rss"
    },

    async fetchNews(sourceName) {
        const url = this.feeds[sourceName];
        if (!url) return null;

        try {
            // Use SecureFetch with rate limiting
            const response = await SecureFetch.fetch(
                `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
                'rss2json'
            );
            if (!response.ok) {
                if (response.status === 429) console.warn('RSS2JSON: Rate limited');
                return null;
            }
            const data = await response.json();

            if (data.status === 'ok' && data.items.length > 0) {
                const item = data.items[0]; // Get latest
                // Use XSS sanitizer for external content
                return {
                    source: XSSSanitizer.escapeHtml(sourceName),
                    headline: XSSSanitizer.escapeHtml(item.title || ''),
                    snippet: XSSSanitizer.sanitizeExternalContent(item.description || '').substring(0, 100) + '...',
                    link: XSSSanitizer.sanitizeUrl(item.link || '#'),
                    timestamp: Date.now()
                };
            }
        } catch (e) {
            console.warn(`RSS Fetch failed for ${sourceName}, falling back to simulation.`);
        }
        return null;
    }
};

const NewsGenerator = {
    sources: ["The Economist", "Financial Times", "Bloomberg", "Wall Street Journal", "Forbes", "Marketwatch", "Reuters", "Investopedia", "Harvard Business Review", "Morningstar", "Business Insider", "Yahoo Finance", "CNBC", "Barron's"],
    verbs: ["surges", "soars", "plummets", "drops", "rallies", "stabilizes", "rebounds", "crashes", "jumps", "slides"],
    adjectives: ["unprecedented", "massive", "unexpected", "sharp", "steady", "volatile", "record-breaking", "sudden"],
    reasons: ["after Fed comments", "following earnings beat", "amid regulatory fears", "on tech optimism", "despite inflation data", "after analyst upgrade", "on supply chain woes", "amid geopolitical tension"],
    templates: [
        "{Asset} {Verb} {Reason} in early trading.",
        "{Source} reports {Adjective} outlook for {Sector} stocks.",
        "Why {Asset} is seeing {Adjective} volatility today.",
        "{Sector} market {Verb} as investors digest new data.",
        "Analysts warn of {Adjective} risks for {Asset} following {Reason}."
    ],

    generate() {
        const source = this.sources[Math.floor(Math.random() * this.sources.length)];
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const verb = this.verbs[Math.floor(Math.random() * this.verbs.length)];
        const adj = this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
        const reason = this.reasons[Math.floor(Math.random() * this.reasons.length)];
        const template = this.templates[Math.floor(Math.random() * this.templates.length)];

        const headline = template
            .replace("{Asset}", asset.name)
            .replace("{Verb}", verb)
            .replace("{Reason}", reason)
            .replace("{Source}", source)
            .replace("{Adjective}", adj)
            .replace("{Sector}", asset.sector);

        return {
            source: source,
            headline: headline,
            snippet: `Latest updates from ${source} on the developing situation regarding ${asset.name}.`,
            link: "#",
            timestamp: Date.now()
        };
    }
};

async function updateNews(manual = false) {
    const btn = document.querySelector('button[title="Refresh Feed"]');
    if (manual && btn) {
        btn.style.transform = 'rotate(360deg)';
        btn.style.transition = 'transform 1s';
    }

    // Pick 1-2 sources to update
    const targets = manual ? 3 : 1;

    for (let i = 0; i < targets; i++) {
        // Try 50/50 Real vs Sim if manual, or just random source
        const sourceList = NewsGenerator.sources;
        const targetSource = sourceList[Math.floor(Math.random() * sourceList.length)];

        let article = await RSSFetcher.fetchNews(targetSource);

        // Fallback if RSS failed or no feed for this source
        if (!article) {
            article = NewsGenerator.generate();
        }

        if (typeof marketData !== 'undefined' && marketData.length > 0) {
            // Ensure uniqueness to avoid duplicate RSS items
            const exists = marketData[0].articles.find(a => a.headline === article.headline);
            if (!exists) {
                marketData[0].articles.unshift(article);
                if (marketData[0].articles.length > 50) marketData[0].articles.pop();
            }
        }
    }

    renderGrid();

    if (manual && btn) {
        setTimeout(() => { btn.style.transform = 'none'; btn.style.transition = ''; }, 1000);
    }
}

// Micro-Interactions: Ripple Effect
document.body.addEventListener('click', function (e) {
    const target = e.target.closest('button, .filter-chip, .ticker-item, .article-card');
    if (target) {
        const rect = target.getBoundingClientRect();
        const circle = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const oldRipple = target.getElementsByClassName('ripple')[0];
        if (oldRipple) oldRipple.remove(); // Clean up

        if (window.getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
        }
        if (window.getComputedStyle(target).overflow !== 'hidden') {
            target.style.overflow = 'hidden';
        }

        target.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    }
});

// News Auto-Update (1 Hour)
setInterval(() => updateNews(false), 3600000);



