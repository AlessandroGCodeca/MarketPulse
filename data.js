const marketData = [
    {
        "source": "The Economist",
        "articles": [
            {
                "headline": "A long-awaited trade truce between America and India",
                "snippet": "Will it last?",
                "link": "https://www.economist.com/finance-and-economics/2026/02/01/trade-truce-india-usa"
            },
            {
                "headline": "An AI bubble is not big tech’s only worry",
                "snippet": "Are Meta and Google ads really recession-proof?",
                "link": "https://www.economist.com/business/2026/02/02/ai-bubble-tech-worry"
            },
            {
                "headline": "Has America hit “peak tariff”?",
                "snippet": "Uncle Sam’s take may go downhill from here",
                "link": "https://www.economist.com/finance-and-economics/2026/02/03/peak-tariff-america"
            }
        ]
    },
    {
        "source": "Financial Times",
        "articles": [
            {
                "headline": "US tech stocks hit with fresh wave of selling as chipmaker AMD tumbles",
                "snippet": "Declines follow steep falls for software shares in previous session over worries about new AI tool.",
                "link": "https://www.ft.com/content/tech-stocks-selloff-amd"
            },
            {
                "headline": "‘We made a lot of money working together’: Epstein’s in-house trader revealed",
                "snippet": "Investigation into the financier's inner circle.",
                "link": "https://www.ft.com/content/epstein-trader-revealed"
            },
            {
                "headline": "How Anthropic achieved AI coding breakthroughs — and rattled business",
                "snippet": "The start-up's new tool is causing ripples in the industry.",
                "link": "https://www.ft.com/content/anthropic-coding-breakthrough"
            }
        ]
    },
    {
        "source": "Bloomberg",
        "articles": [
            {
                "headline": "Bitcoin Falls to $72,000 as Traders Navigate a ‘Crisis of Faith’",
                "snippet": "Bitcoin led a cryptocurrency rout that erased nearly half a trillion dollars in value in a week.",
                "link": "https://www.bloomberg.com/crypto/bitcoin-price-drop-crisis"
            },
            {
                "headline": "$160 Billion Abu Dhabi Fund Eyes Bolder Bets for 10% Returns",
                "snippet": "The fund is looking for higher returns through more aggressive investment strategies.",
                "link": "https://www.bloomberg.com/news/abu-dhabi-fund-bolder-bets"
            },
            {
                "headline": "Bitcoin-Led Crypto Rout Erases Nearly $500 Billion in a Week",
                "snippet": "The broader crypto market is seeing a major selloff.",
                "link": "https://www.bloomberg.com/crypto/market-rout-500-billion"
            }
        ]
    },
    {
        "source": "Wall Street Journal",
        "articles": [
            {
                "headline": "AI Threatens a Wall Street Cash Cow: Financial and Legal Data",
                "snippet": "The rise of artificial intelligence is beginning to disrupt the lucrative business of selling financial and legal data.",
                "link": "https://www.wsj.com/finance/ai-threatens-data-cash-cow"
            },
            {
                "headline": "Are We in an AI Bubble?",
                "snippet": "Investors and analysts are increasingly debating whether the massive valuations of AI-related stocks represent a sustainable shift or a speculative bubble.",
                "link": "https://www.wsj.com/markets/ai-bubble-debate"
            },
            {
                "headline": "Spain’s Santander Launches Buyback Alongside Earnings Beat",
                "snippet": "Banco Santander announced a significant share buyback program after reporting quarterly earnings that exceeded analyst expectations.",
                "link": "https://www.wsj.com/business/santander-earnings-buyback"
            }
        ]
    },
    {
        "source": "Forbes",
        "articles": [
            {
                "headline": "Watchdog Warns IRS May Struggle During The 2026 Tax Filing Season",
                "snippet": "A federal watchdog has issued a warning that the IRS may face significant operational challenges during the upcoming 2026 tax season.",
                "link": "https://www.forbes.com/tax/irs-struggle-2026-season"
            },
            {
                "headline": "Silver Is Moving Faster Than Gold. That Almost Never Happens.",
                "snippet": "Silver prices have seen a rare and rapid surge that is outpacing gold, a phenomenon that historically signals unique market conditions.",
                "link": "https://www.forbes.com/investing/silver-outpacing-gold"
            },
            {
                "headline": "The Small Business Guide To Tax Season",
                "snippet": "A comprehensive overview of what small business owners need to know to navigate the complexities of the current tax filing season.",
                "link": "https://www.forbes.com/small-business/tax-guide"
            }
        ]
    },
    {
        "source": "Fortune",
        "articles": [
            {
                "headline": "Palmer Luckey says AI will make hardware so cheap you’ll be able to buy a ‘Ford F-150 for $1,000’",
                "snippet": "The Anduril founder predicts that AI-driven manufacturing efficiencies will drastically reduce the cost of complex hardware in the near future.",
                "link": "https://fortune.com/tech/palmer-luckey-ai-hardware-clean"
            },
            {
                "headline": "‘Immigrants are subsidizing the U.S. government’: how the undocumented helped shrink the deficit by $14.5 trillion over 3 decades",
                "snippet": "A new report highlights the significant fiscal contribution of undocumented immigrants to the U.S. economy and government revenue.",
                "link": "https://fortune.com/economy/immigrants-subsidizing-government"
            },
            {
                "headline": "Philippines’ first male Olympic gold medalist in history was given a fully furnished $555,000 condo to go with his medals",
                "snippet": "Carlos Yulo’s historic achievement at the Olympics has been met with massive rewards, including a luxury condominium in Manila.",
                "link": "https://fortune.com/asia/philippines-gold-medalist-condo"
            }
        ]
    },
    {
        "source": "Barron's",
        "articles": [
            {
                "headline": "Alphabet’s Earnings Are Focused on the Cloud",
                "snippet": "All eyes will be on the sales and expense growth at Google Cloud.",
                "link": "https://www.barrons.com/tech/alphabet-earnings-cloud-focus"
            },
            {
                "headline": "Uber Stock Falls on Earnings Miss",
                "snippet": "The ride-hailing company posts 19% growth in revenue but adjusted earnings fall well short of Wall Street estimates.",
                "link": "https://www.barrons.com/articles/uber-earnings-stock-miss"
            },
            {
                "headline": "Tesla Stock Is Falling. It Really Needs the Optimus Robot.",
                "snippet": "The electric-vehicle maker's stock has been under pressure as investors worry about demand and competition.",
                "link": "https://www.barrons.com/articles/tesla-stock-optimus-robot"
            }
        ]
    },
    {
        "source": "Harvard Business Review",
        "articles": [
            {
                "headline": "How to Foster Psychological Safety When AI Erodes Trust on Your Team",
                "snippet": "Psychological safety is more important than ever as AI reshapes work and affects team dynamics.",
                "link": "https://hbr.org/2026/02/psychological-safety-ai"
            },
            {
                "headline": "AI-Generated 'Workslop' Is Destroying Productivity",
                "snippet": "Low-effort, AI-generated work is wasting people’s time and seeding frustration across organizations.",
                "link": "https://hbr.org/2026/02/ai-workslop-productivity"
            },
            {
                "headline": "Stop Treating Every Conflict Like a Battle",
                "snippet": "A new approach to workplace disagreement that emphasizes collaboration over confrontation.",
                "link": "https://hbr.org/2026/02/conflict-collaboration"
            }
        ]
    },
    {
        "source": "CNBC Finance",
        "articles": [
            {
                "headline": "32-year-old woman and her husband built her mom a tiny home in their backyard for under $32,000",
                "snippet": "A look inside a creative and cost-effective housing solution for multi-generational living.",
                "link": "https://www.cnbc.com/make-it/tiny-home-backyard-32k"
            },
            {
                "headline": "S&P 500 falls for a second day, Nasdaq sheds 2% as chip stocks decline, led by AMD: Live updates",
                "snippet": "Markets react to a significant selloff in technology and semiconductor stocks.",
                "link": "https://www.cnbc.com/markets/sp500-nasdaq-chip-stocks"
            },
            {
                "headline": "Stocks making the biggest moves midday: MGM Resorts, Amgen, Advanced Micro Devices, Enphase & more",
                "snippet": "A report on the most significant stock price changes during the midday trading session.",
                "link": "https://www.cnbc.com/investing/midday-movers-mgm-amd"
            }
        ]
    },
    {
        "source": "MarketWatch",
        "articles": [
            {
                "headline": "AMD’s stock is heading toward its worst day in years after earnings",
                "snippet": "AMD shares are witnessing a significant decline following an earnings report that failed to meet investor expectations for growth, particularly in the AI sector.",
                "link": "https://www.marketwatch.com/story/amd-stock-worst-day-earnings"
            },
            {
                "headline": "The Social Security data breach is a national-security disaster that could hurt Americans for the rest of their lives: whistleblower",
                "snippet": "A whistleblower has raised alarms over a massive data breach involving Social Security information from 2.9 billion records.",
                "link": "https://www.marketwatch.com/story/social-security-breach-whistleblower"
            },
            {
                "headline": "Super Micro logs record revenue from AI demand, and the stock surges",
                "snippet": "Super Micro Computer Inc. (SMCI) reported record-breaking revenue fueled by the high demand for AI-related infrastructure, leading to a sharp rise in its stock price.",
                "link": "https://www.marketwatch.com/story/smci-record-revenue-ai-demand"
            }
        ]
    },
    {
        "source": "Reuters",
        "articles": [
            {
                "headline": "Global markets brace for central bank decisions",
                "snippet": "Investors worldwide are holding their breath as major central banks prepare to announce their latest interest rate decisions.",
                "link": "https://www.reuters.com/markets/global-central-banks"
            },
            {
                "headline": "Oil prices stable as supply concerns offset demand fears",
                "snippet": "Crude oil benchmarks remain steady amidst conflicting signals of tightening supply and potential economic slowdowns.",
                "link": "https://www.reuters.com/business/energy/oil-prices-stable"
            },
            {
                "headline": "Tech giants face new EU regulatory hurdles",
                "snippet": "European Union regulators are preparing a fresh set of guidelines aimed at curbing the dominance of major technology firms.",
                "link": "https://www.reuters.com/technology/eu-tech-regulations"
            }
        ]
    },
    {
        "source": "Investopedia",
        "articles": [
            {
                "headline": "Understanding the Beta Coefficient in Stocks",
                "snippet": "A deep dive into what beta means for your portfolio and how to use it to manage risk.",
                "link": "https://www.investopedia.com/terms/b/beta.asp"
            },
            {
                "headline": "Top 5 ETFs for 2026",
                "snippet": "Our analysts count down the best Exchange Traded Funds to hold for the coming year.",
                "link": "https://www.investopedia.com/articles/etfs-2026"
            },
            {
                "headline": "What is Quantitative Easing?",
                "snippet": "Explaining the complex monetary policy tool used by central banks to stimulate the economy.",
                "link": "https://www.investopedia.com/terms/q/quantitative-easing.asp"
            }
        ]
    },
    {
        "source": "Morningstar",
        "articles": [
            {
                "headline": "3 Undervalued Stocks for Dividend Investors",
                "snippet": "These high-yield stocks are currently trading below their fair value estimates.",
                "link": "https://www.morningstar.com/stocks/undervalued-dividend-stocks"
            },
            {
                "headline": "Fund Manager Views: Navigating the Bond Market",
                "snippet": "Top fixed-income managers share their strategies for a volatile interest rate environment.",
                "link": "https://www.morningstar.com/funds/bond-market-strategies"
            },
            {
                "headline": "The Case for International Investing",
                "snippet": "Why now might be the right time to diversify your portfolio beyond domestic equities.",
                "link": "https://www.morningstar.com/articles/international-investing-case"
            }
        ]
    },
    {
        "source": "Yahoo Finance",
        "articles": [
            {
                "headline": "NVIDIA (NVDA) Stock Split: What Investors Need to Know",
                "snippet": "Everything you need to know about the upcoming stock split and how it affects your holdings.",
                "link": "https://finance.yahoo.com/news/nvidia-stock-split-details"
            },
            {
                "headline": "Housing Market Update: Mortgage Rates Dip Below 6%",
                "snippet": "A welcome relief for homebuyers as mortgage rates hit a six-month low.",
                "link": "https://finance.yahoo.com/news/housing-market-mortgage-rates"
            },
            {
                "headline": "Warren Buffett's Latest Portfolio Moves",
                "snippet": "Berkshire Hathaway's latest 13F filing reveals new positions and exits.",
                "link": "https://finance.yahoo.com/news/warren-buffett-portfolio-updates"
            }
        ]
    },
    {
        "source": "Business Insider",
        "articles": [
            {
                "headline": "Gen Z is ditching traditional 9-to-5s for 'portfolio careers'",
                "snippet": "Why the younger generation is preferring multiple income streams over a single employer.",
                "link": "https://www.businessinsider.com/gen-z-portfolio-careers-trend"
            },
            {
                "headline": "The rise of 'quiet hiring' in corporate America",
                "snippet": "Companies are finding new ways to fill skills gaps without adding full-time headcount.",
                "link": "https://www.businessinsider.com/quiet-hiring-corporate-trend"
            },
            {
                "headline": "Remote work is here to stay, says top CEO",
                "snippet": "Despite return-to-office mandates, leaders admit that flexibility is key to retention.",
                "link": "https://www.businessinsider.com/remote-work-staying-ceo-views"
            }
        ]
    }
];
