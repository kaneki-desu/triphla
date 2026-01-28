import json
import re

def clean_response(text):
    # Remove markdown JSON code block indicators (```json ... ```)
    cleaned_text = re.sub(r"```json\s*|\s*```", "", text, flags=re.MULTILINE)
     # Replace single quotes around keys and values with double quotes
    cleaned_text = re.sub(r"(?<=\{|,)\s*'(\w+)'(?=\s*:)", r'"\1"', cleaned_text)  # Keys
    cleaned_text = re.sub(r":\s*'([^']*)'", r': "\1"', cleaned_text)  # String values

    # Parse JSON
    json_data = json.loads(cleaned_text)

    # Convert to compact JSON format
    compact_json = json.dumps(json_data, separators=(",", ":"))

    return compact_json
if __name__ =="__main__":
    text= "[{\"headline\":\"Indian Stock Markets Erase 2025 Losses As RBI's Liquidity Push And Govt Spending Boost Investor Confidence\\u2014Nifty Surges 7 Per Cent\",\"link\":\"https://swarajyamag.com/news-brief/indian-stock-markets-erase-2025-losses-as-rbis-liquidity-push-and-govt-spending-boost-investor-confidencenifty-surges-7-per-cent\",\"sentiment\":\"Bullish\"},{\"headline\":\"Share Market Highlights: Sensex jumps 1.4%, Nifty gains 1.32% as foreign buying lifts markets\",\"link\":\"https://www.thehindubusinessline.com/markets/stock-market-highlights-24-march-2025/article69365394.ece\",\"sentiment\":\"Bullish\"},{\"headline\":\"Sensex Today | Stock Market LIVE Updates: Sensex soars 1000 pts; Nifty above 23,600; private bank stocks rally\",\"link\":\"https://economictimes.indiatimes.com/markets/stocks/live-blog/bse-sensex-today-live-nifty-stock-market-updates-24-march-2025/liveblog/119400722.cms\",\"sentiment\":\"Bullish\"},{\"headline\":\"Why did BSE soar 1,079 points? Is stock market bullish on Donald Trump's tariff decisions?\",\"link\":\"https://www.dnaindia.com/business/report-why-did-bse-sensex-soar-1079-points-is-stock-market-bullish-on-donald-trump-s-reciprocal-tariff-decisions-3140724\",\"sentiment\":\"Bearish\"},{\"headline\":\"Stock Market Updates: Sensex Gains 1,200 Points Higher, Nifty Above 23,700; Financials, Realty Up\",\"link\":\"https://www.news18.com/business/markets/stock-market-updates-sensex-opens-500-points-higher-nifty-tests-23500-financials-gain-9272396.html\",\"sentiment\":\"Bullish\"},{\"headline\":\"Stock Market LIVE Updates: GIFT Nifty suggests a positive start; US markets gain, Asia mixed\",\"link\":\"https://www.moneycontrol.com/news/business/markets/stock-market-live-sensex-nifty-50-share-price-gift-nifty-latest-updates-24-03-2025-liveblog-12972943.html\",\"sentiment\":\"Bullish\"},{\"headline\":\"Why the stock market rose today: 5 key factors behind 1,079-point Sensex surge, Nifty above 23,650\",\"link\":\"https://www.msn.com/en-in/news/other/why-the-stock-market-rose-today-5-key-factors-behind-1-079-point-sensex-surge-nifty-above-23-650/ar-AA1Bwuod\",\"sentiment\":\"Bullish\"},{\"headline\":\"Stock Market Highlights: Markets extend gains for fifth day; Nifty closes above 23,300, small and midcap outperform\",\"link\":\"https://www.financialexpress.com/market/bse-sensex-nifty-50-stock-market-today-live-updates-21-march-2025-3783579/\",\"sentiment\":\"Bullish\"},{\"headline\":\"Stock market update: Nifty Pharma index advances 0.59% in an upbeat market\",\"link\":\"https://www.msn.com/en-in/money/markets/stock-market-update-nifty-pharma-index-advances-059-in-an-upbeat-market/ar-AA1Bws1d\",\"sentiment\":\"Bullish\"},{\"headline\":\"Stock Market Highlight: Nifty closes above 22,900 for the first time in 16 sessions, small and midcap stocks outperformed\",\"link\":\"https://www.financialexpress.com/market/bse-sensex-nifty-50-stock-market-today-live-updates-19-march-2025-3781349/\",\"sentiment\":\"Bearish\"}]"
    print(clean_response(text))
