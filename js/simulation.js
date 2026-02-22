const assets = [
            // Crypto (15)
            { id: 'BTC', name: 'Bitcoin', price: 92340, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'ETH', name: 'Ethereum', price: 3450, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'SOL', name: 'Solana', price: 145, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'BNB', name: 'Binance Coin', price: 605, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'XRP', name: 'XRP', price: 0.62, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'ADA', name: 'Cardano', price: 0.45, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'DOGE', name: 'Dogecoin', price: 0.16, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'DOT', name: 'Polkadot', price: 7.20, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'LINK', name: 'Chainlink', price: 18.50, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'MATIC', name: 'Polygon', price: 0.75, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'LTC', name: 'Litecoin', price: 85.30, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'UNI', name: 'Uniswap', price: 10.40, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'AVAX', name: 'Avalanche', price: 35.60, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'SHIB', name: 'Shiba Inu', price: 0.000025, type: 'crypto', sector: 'Crypto', history: [] },
            { id: 'TON', name: 'Toncoin', price: 6.80, type: 'crypto', sector: 'Crypto', history: [] },

            // Tech (20)
            { id: 'NVDA', name: 'Nvidia', price: 179.90, type: 'stock', sector: 'Tech', history: [] },
            { id: 'AAPL', name: 'Apple', price: 269.50, type: 'stock', sector: 'Tech', history: [] },
            { id: 'MSFT', name: 'Microsoft', price: 410.20, type: 'stock', sector: 'Tech', history: [] },
            { id: 'GOOGL', name: 'Alphabet', price: 175.60, type: 'stock', sector: 'Tech', history: [] },
            { id: 'AMZN', name: 'Amazon', price: 185.30, type: 'stock', sector: 'Tech', history: [] },
            { id: 'META', name: 'Meta', price: 490.50, type: 'stock', sector: 'Tech', history: [] },
            { id: 'NFLX', name: 'Netflix', price: 620.10, type: 'stock', sector: 'Tech', history: [] },
            { id: 'ADBE', name: 'Adobe', price: 540.25, type: 'stock', sector: 'Tech', history: [] },
            { id: 'ORCL', name: 'Oracle', price: 125.40, type: 'stock', sector: 'Tech', history: [] },
            { id: 'QCOM', name: 'Qualcomm', price: 165.80, type: 'stock', sector: 'Tech', history: [] },
            { id: 'INTC', name: 'Intel', price: 30.50, type: 'stock', sector: 'Tech', history: [] },
            { id: 'CSCO', name: 'Cisco', price: 48.20, type: 'stock', sector: 'Tech', history: [] },
            { id: 'IBM', name: 'IBM', price: 170.30, type: 'stock', sector: 'Tech', history: [] },
            { id: 'TXN', name: 'Texas Inst', price: 195.40, type: 'stock', sector: 'Tech', history: [] },
            { id: 'CRM', name: 'Salesforce', price: 280.50, type: 'stock', sector: 'Tech', history: [] },
            { id: 'PLTR', name: 'Palantir', price: 25.40, type: 'stock', sector: 'Tech', history: [] },
            { id: 'SHOP', name: 'Shopify', price: 75.20, type: 'stock', sector: 'Tech', history: [] },
            { id: 'UBER', name: 'Uber', price: 72.30, type: 'stock', sector: 'Tech', history: [] },
            { id: 'ABNB', name: 'Airbnb', price: 145.60, type: 'stock', sector: 'Tech', history: [] },
            { id: 'SQ', name: 'Block', price: 78.40, type: 'stock', sector: 'Tech', history: [] },

            // Auto & Transport (7)
            { id: 'TSLA', name: 'Tesla', price: 240.10, type: 'stock', sector: 'Auto', history: [] },
            { id: 'TM', name: 'Toyota', price: 195.30, type: 'stock', sector: 'Auto', history: [] },
            { id: 'F', name: 'Ford', price: 12.50, type: 'stock', sector: 'Auto', history: [] },
            { id: 'GM', name: 'General Motors', price: 45.20, type: 'stock', sector: 'Auto', history: [] },
            { id: 'HMC', name: 'Honda', price: 32.40, type: 'stock', sector: 'Auto', history: [] },
            { id: 'RACE', name: 'Ferrari', price: 410.50, type: 'stock', sector: 'Auto', history: [] },
            { id: 'UPS', name: 'UPS', price: 142.30, type: 'stock', sector: 'Auto', history: [] },

            // Finance (12)
            { id: 'JPM', name: 'JPMorgan', price: 205.40, type: 'stock', sector: 'Finance', history: [] },
            { id: 'V', name: 'Visa', price: 280.10, type: 'stock', sector: 'Finance', history: [] },
            { id: 'MA', name: 'Mastercard', price: 450.60, type: 'stock', sector: 'Finance', history: [] },
            { id: 'BAC', name: 'Bank of America', price: 38.90, type: 'stock', sector: 'Finance', history: [] },
            { id: 'GS', name: 'Goldman Sachs', price: 460.20, type: 'stock', sector: 'Finance', history: [] },
            { id: 'MS', name: 'Morgan Stanley', price: 98.40, type: 'stock', sector: 'Finance', history: [] },
            { id: 'C', name: 'Citigroup', price: 62.50, type: 'stock', sector: 'Finance', history: [] },
            { id: 'WFC', name: 'Wells Fargo', price: 58.20, type: 'stock', sector: 'Finance', history: [] },
            { id: 'AXP', name: 'Amex', price: 230.10, type: 'stock', sector: 'Finance', history: [] },
            { id: 'PYPL', name: 'PayPal', price: 65.30, type: 'stock', sector: 'Finance', history: [] },
            { id: 'BLK', name: 'BlackRock', price: 780.40, type: 'stock', sector: 'Finance', history: [] },
            { id: 'COIN', name: 'Coinbase', price: 220.50, type: 'stock', sector: 'Finance', history: [] },

            // Consumer (12)
            { id: 'WMT', name: 'Walmart', price: 68.50, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'COST', name: 'Costco', price: 850.30, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'KO', name: 'Coca-Cola', price: 62.40, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'MCD', name: 'McDonald\'s', price: 270.80, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'NKE', name: 'Nike', price: 92.60, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'HD', name: 'Home Depot', price: 345.20, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'LOW', name: 'Lowe\'s', price: 225.40, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'SBUX', name: 'Starbucks', price: 85.30, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'TGT', name: 'Target', price: 145.20, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'PEP', name: 'PepsiCo', price: 168.40, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'PG', name: 'P&G', price: 166.50, type: 'stock', sector: 'Consumer', history: [] },
            { id: 'DIS', name: 'Disney', price: 95.40, type: 'stock', sector: 'Consumer', history: [] },

            // Healthcare (10)
            { id: 'JNJ', name: 'J&J', price: 155.20, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'LLY', name: 'Eli Lilly', price: 890.10, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'PFE', name: 'Pfizer', price: 28.40, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'UNH', name: 'UnitedHealth', price: 510.20, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'MRK', name: 'Merck', price: 128.50, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'ABBV', name: 'AbbVie', price: 175.40, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'AMGN', name: 'Amgen', price: 315.60, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'ISRG', name: 'Intuitive Surg', price: 430.20, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'TMO', name: 'Thermo Fisher', price: 580.40, type: 'stock', sector: 'Healthcare', history: [] },
            { id: 'BMY', name: 'Bristol-Myers', price: 42.50, type: 'stock', sector: 'Healthcare', history: [] },

            // Industrial & Energy (12)
            { id: 'XOM', name: 'ExxonMobil', price: 115.60, type: 'stock', sector: 'Energy', history: [] },
            { id: 'CVX', name: 'Chevron', price: 158.30, type: 'stock', sector: 'Energy', history: [] },
            { id: 'BP', name: 'BP', price: 35.40, type: 'stock', sector: 'Energy', history: [] },
            { id: 'SHEL', name: 'Shell', price: 70.20, type: 'stock', sector: 'Energy', history: [] },
            { id: 'BA', name: 'Boeing', price: 175.40, type: 'stock', sector: 'Industrial', history: [] },
            { id: 'GE', name: 'GE Aerospace', price: 165.20, type: 'stock', sector: 'Industrial', history: [] },
            { id: 'CAT', name: 'Caterpillar', price: 340.50, type: 'stock', sector: 'Industrial', history: [] },
            { id: 'LMT', name: 'Lockheed', price: 465.30, type: 'stock', sector: 'Industrial', history: [] },
            { id: 'RTX', name: 'RTX Corp', price: 105.20, type: 'stock', sector: 'Industrial', history: [] },
            { id: 'HON', name: 'Honeywell', price: 205.40, type: 'stock', sector: 'Industrial', history: [] },
            { id: 'DE', name: 'Deere', price: 380.20, type: 'stock', sector: 'Industrial', history: [] },
            { id: 'NEE', name: 'NextEra', price: 78.40, type: 'stock', sector: 'Utilities', history: [] },

            // Commodities & Forex (12)
            { id: 'GOLD', name: 'Gold', price: 2450, type: 'commodity', sector: 'Commodities', history: [] },
            { id: 'SILVER', name: 'Silver', price: 29.50, type: 'commodity', sector: 'Commodities', history: [] },
            { id: 'OIL', name: 'Crude Oil', price: 75.20, type: 'commodity', sector: 'Commodities', history: [] },
            { id: 'NG', name: 'Natural Gas', price: 2.80, type: 'commodity', sector: 'Commodities', history: [] },
            { id: 'COPPER', name: 'Copper', price: 4.50, type: 'commodity', sector: 'Commodities', history: [] },
            { id: 'PLAT', name: 'Platinum', price: 980.50, type: 'commodity', sector: 'Commodities', history: [] },
            { id: 'WHEAT', name: 'Wheat', price: 580.00, type: 'commodity', sector: 'Commodities', history: [] },
            { id: 'EURUSD', name: 'EUR/USD', price: 1.08, type: 'forex', sector: 'Forex', history: [] },
            { id: 'GBPUSD', name: 'GBP/USD', price: 1.27, type: 'forex', sector: 'Forex', history: [] },
            { id: 'USDJPY', name: 'USD/JPY', price: 155.40, type: 'forex', sector: 'Forex', history: [] },
            { id: 'USDCAD', name: 'USD/CAD', price: 1.36, type: 'forex', sector: 'Forex', history: [] },
            { id: 'AUDUSD', name: 'AUD/USD', price: 0.66, type: 'forex', sector: 'Forex', history: [] }
        ];

        // Fill Data History
        assets.forEach(a => {
            let p = a.price;
            for (let i = 0; i < 100; i++) {
                p = p * (1 + (Math.random() - 0.5) * 0.02);
                a.history.push(p);
            }
        });

        
// --- Simulation / Live Data Loop ---
async function simulateMarket() {
    // Only poll if tab is visible to avoid rate limits
    if (document.visibilityState === 'hidden') return;
    
    await DataService.updateAssets();
    updateCurrency(currentCurrency);
    updateFearGreed();
    updateAuroraIntensity();
}
