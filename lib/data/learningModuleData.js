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
                        options: ["An order to buy/sell at a specific price or better", "An order to buy/sell immediately at the best available price", "An order that expires at the end of the day"],
                        correctAnswerIndex: 0
                    }
                ]
            },
            // Add fun facts and term matching for trading if desired
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
            // Add quiz, fun facts, term matching for derivatives if desired
        ]
    }
    // Add more topics here as needed
};
