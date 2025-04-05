export const learningModulesData = {
    stockMarket: {
        title: "Stock Market Basics",
        sections: [
            {
                type: "introduction",
                title: "What is the Stock Market?",
                mainText: "The stock market is a collection of markets where stocks (pieces of ownership in businesses) are traded between investors.",
                keyBenefits: [
                    "Potential for high returns",
                    "Portfolio diversification",
                    "Ownership in companies",
                    "Dividend income"
                ],
                risks: [
                    "Market volatility",
                    "Potential losses",
                    "Economic factors",
                    "Company performance"
                ]
            },
            {
                type: "quiz",
                title: "Test Your Knowledge",
                questions: [
                    {
                        questionText: "1. What is a stock?",
                        options: [
                            "A piece of ownership in a company",
                            "A type of currency",
                            "A government bond",
                            "A savings account"
                        ],
                        correctAnswerIndex: 0
                    },
                    {
                        questionText: "2. What is market capitalization?",
                        options: [
                            "The total value of a company's shares",
                            "The number of employees in a company",
                            "The company's annual revenue",
                            "The company's profit margin"
                        ],
                        correctAnswerIndex: 0
                    }
                ]
            },
            {
                type: "funFacts",
                title: "Fun Facts",
                facts: [
                    {
                        title: "Did You Know?",
                        text: "The first stock exchange was established in Amsterdam in 1602 by the Dutch East India Company."
                    },
                    {
                        title: "Interesting Fact",
                        text: "The term \"bull market\" comes from the way a bull attacks its prey - thrusting its horns upward."
                    }
                ]
            },
            {
                type: "termMatching",
                title: "Match the Terms",
                terms: [
                    { id: 1, text: "Stock Market" },
                    { id: 2, text: "Dividend" },
                    { id: 3, text: "Bull Market" },
                    { id: 4, text: "Bear Market" }
                ],
                definitions: [
                    { id: 1, definition: "A marketplace where shares of publicly traded companies are issued, bought, and sold" },
                    { id: 2, definition: "A payment made by a corporation to its shareholders, usually as a distribution of profits" },
                    { id: 3, definition: "A market condition where prices are rising or expected to rise" },
                    { id: 4, definition: "A market condition where prices are falling or expected to fall" }
                ]
            }
        ]
    },
    mutualFunds: {
        title: "Understanding Mutual Funds",
        sections: [
            {
                type: "introduction",
                title: "What are Mutual Funds?",
                mainText: "Mutual funds pool money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities managed by professional fund managers.",
                keyBenefits: [
                    "Diversification with small investment",
                    "Professional fund management",
                    "Liquidity and ease of access",
                    "Variety of fund types to match goals"
                ],
                risks: [
                    "Management fees and expense ratios",
                    "Market risk based on holdings",
                    "Limited control over investment decisions",
                    "Past performance doesn't guarantee future returns"
                ]
            },
            {
                type: "quiz",
                title: "Mutual Fund Quiz",
                questions: [
                    {
                        questionText: "1. What is a mutual fund?",
                        options: [
                            "A government-issued savings plan",
                            "A pooled investment managed by professionals",
                            "A retirement account",
                            "A stock brokerage account"
                        ],
                        correctAnswerIndex: 1
                    }
                ]
            },
            {
                type: "funFacts",
                title: "Fun Facts",
                facts: [
                    {
                        title: "Widespread Use",
                        text: "Over 100 million people in the U.S. invest in mutual funds."
                    }
                ]
            },
            {
                type: "termMatching",
                title: "Match the Terms",
                terms: [
                    { id: 1, text: "NAV" },
                    { id: 2, text: "Expense Ratio" },
                    { id: 3, text: "Fund Manager" },
                    { id: 4, text: "Open-ended Fund" }
                ],
                definitions: [
                    { id: 1, definition: "Net Asset Value, or the price per share of the mutual fund" },
                    { id: 2, definition: "Annual fee expressed as a percentage of total assets under management" },
                    { id: 3, definition: "Professional responsible for managing the fund’s assets" },
                    { id: 4, definition: "A fund that allows investors to buy/sell units anytime at NAV" }
                ]
            }
        ]
    },
    derivatives: {
        title: "Understanding Derivatives",
        sections: [
            {
                type: "introduction",
                title: "What are Derivatives?",
                mainText: "A derivative is a financial contract whose value is derived from an underlying asset, group of assets, or benchmark.",
                keyBenefits: ["Hedging risk", "Speculation", "Leverage"],
                risks: ["Complexity", "Counterparty risk", "High potential losses"]
            },
            {
                type: "quiz",
                title: "Derivatives Quiz",
                questions: [
                    {
                        questionText: "1. What is a derivative?",
                        options: [
                            "A type of loan",
                            "A financial contract based on the value of an underlying asset",
                            "A company’s stock option",
                            "A fixed income investment"
                        ],
                        correctAnswerIndex: 1
                    },
                    {
                        questionText: "2. Which of the following is NOT a common type of derivative?",
                        options: [
                            "Options",
                            "Futures",
                            "Stocks",
                            "Swaps"
                        ],
                        correctAnswerIndex: 2
                    }
                ]
            },
            {
                type: "funFacts",
                title: "Fun Facts",
                facts: [
                    {
                        title: "Historic Use",
                        text: "One of the earliest examples of derivatives was in ancient Greece, where options contracts were used for olive presses."
                    },
                    {
                        title: "Big Numbers",
                        text: "The notional value of the global derivatives market is estimated to be in the hundreds of trillions of dollars!"
                    }
                ]
            },
            {
                type: "termMatching",
                title: "Match the Terms",
                terms: [
                    { id: 1, text: "Futures Contract" },
                    { id: 2, text: "Option" },
                    { id: 3, text: "Underlying Asset" },
                    { id: 4, text: "Leverage" }
                ],
                definitions: [
                    { id: 1, definition: "A standardized contract to buy or sell an asset at a predetermined price at a specified time in the future" },
                    { id: 2, definition: "A contract that gives the buyer the right, but not the obligation, to buy or sell an asset at a set price before a certain date" },
                    { id: 3, definition: "The financial instrument (like a stock or commodity) from which a derivative derives its value" },
                    { id: 4, definition: "Using borrowed capital to increase the potential return of an investment" }
                ]
            }
        ]
    }, 
    trading: {
        title: "Introduction to Trading",
        sections: [
            {
                type: "introduction",
                title: "What is Trading?",
                mainText: "Trading involves buying and selling financial instruments with the goal of making a profit from short-term price movements.",
                keyBenefits: ["Potential for quick profits", "Liquidity", "Variety of instruments"],
                risks: ["High volatility", "Requires skill and knowledge", "Potential for significant losses"]
            },
            {
                type: "quiz",
                title: "Trading Quiz",
                questions: [
                    {
                        questionText: "1. What is a 'limit order'?",
                        options: [
                            "An order to buy/sell at a specific price or better",
                            "An order to buy/sell immediately at the best available price",
                            "An order that expires at the end of the day"
                        ],
                        correctAnswerIndex: 0
                    }
                ]
            },
            {
                type: "funFacts",
                title: "Fun Facts",
                facts: [
                    {
                        title: "Trading Hours",
                        text: "Most stock markets are open only during specific hours on business days, but cryptocurrency markets trade 24/7."
                    },
                    {
                        title: "Flash Crashes",
                        text: "High-frequency trading algorithms can cause rapid market drops in seconds, known as 'flash crashes.'"
                    }
                ]
            },
            {
                type: "termMatching",
                title: "Match the Terms",
                terms: [
                    { id: 1, text: "Limit Order" },
                    { id: 2, text: "Market Order" },
                    { id: 3, text: "Volatility" },
                    { id: 4, text: "Liquidity" }
                ],
                definitions: [
                    { id: 1, definition: "An order to buy or sell a stock at a specific price or better" },
                    { id: 2, definition: "An order to buy or sell immediately at the best available price" },
                    { id: 3, definition: "The degree of variation in a trading price over time" },
                    { id: 4, definition: "How quickly and easily an asset can be bought or sold in the market without affecting its price" }
                ]
            }
        ]
    },  
    technicalAnalysis: {
        title: "Technical Analysis Basics",
        sections: [
            {
                type: "introduction",
                title: "What is Technical Analysis?",
                mainText: "Technical analysis involves evaluating securities by analyzing statistical trends from trading activity, such as price movement and volume.",
                keyBenefits: [
                    "Helps predict market trends",
                    "Identifies buy/sell signals",
                    "Uses historical data for insights",
                    "Applies to all liquid markets"
                ],
                risks: [
                    "May generate false signals",
                    "Requires experience to interpret accurately",
                    "Doesn’t account for external news/events",
                    "Works better in trending markets"
                ]
            },
            {
                type: "quiz",
                title: "TA Quiz",
                questions: [
                    {
                        questionText: "1. What does RSI indicate?",
                        options: ["Profit margin", "Momentum", "Volume", "Market cap"],
                        correctAnswerIndex: 1
                    }
                ]
            },
            {
                type: "funFacts",
                title: "Fun Facts",
                facts: [
                    {
                        title: "Charting Origins",
                        text: "Candlestick charts were developed in the 18th century by Japanese rice traders."
                    }
                ]
            },
            {
                type: "termMatching",
                title: "Match the Terms",
                terms: [
                    { id: 1, text: "RSI" },
                    { id: 2, text: "Support" },
                    { id: 3, text: "Resistance" },
                    { id: 4, text: "Moving Average" }
                ],
                definitions: [
                    { id: 1, definition: "Relative Strength Index – measures speed of price movements" },
                    { id: 2, definition: "A price level where a stock tends to stop falling" },
                    { id: 3, definition: "A price level where a stock tends to stop rising" },
                    { id: 4, definition: "The average of closing prices over a set period" }
                ]
            }
        ]
    }
    
    // Add more topics here as needed
};
