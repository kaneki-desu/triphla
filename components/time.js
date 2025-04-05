import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import step2pic1 from "../public/Screenshot 2025-04-03 182951.png"
import step2pic2 from "../public/Screenshot 2025-04-03 182849.png"
import step3pic1 from "../public/Screenshot 2025-04-03 222206.png"
import step3pic2 from "../public/Screenshot 2025-04-03 222235.png"
import step4pic1 from "../public/Screenshot 2025-04-04 002158.png"
import step4pic2 from "../public/Screenshot 2025-04-04 002229.png"
import step4pic3 from "../public/Screenshot 2025-04-04 002243.png"
import step4pic4 from "../public/Screenshot 2025-04-04 002300.png"
import step1pic1 from "../public/Screenshot 2025-04-04 232524.png"
import step1pic2 from "../public/Screenshot 2025-04-04 232558.png"

export function TimelineDemo() {
  const data = [
    {
      title: " STEP-1 ",
      
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          <strong>Your AI-Powered Guide to Smart Crypto and Stock Market Decisions</strong>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={step1pic1}
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src={step1pic2}
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mt-4 leading-relaxed">
  <span className="text-lg md:text-xl font-semibold text-primary">Real-Time Market Insights at Your Fingertips</span>
  <br /><br />
  The financial assistant provides <span className="font-medium text-green-600">Live Updates</span> on major cryptocurrencies, offering traders and investors <span className="text-highlight">quick and accurate</span> market insights. This includes:
</p>

<ul className="list-disc list-inside text-sm md:text-base mt-2 text-neutral-700 dark:text-neutral-300">
  <li><span className="font-semibold text-primary">Bitcoin (BTC)</span></li>
  <li><span className="font-semibold text-primary">Ethereum (ETH)</span></li>
  <li><span className="font-semibold text-primary">Tether (USDT)</span></li>
  <li><span className="font-semibold text-primary">Binance Coin (BNB)</span></li>
</ul>

<p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mt-4 leading-relaxed">
  Each cryptocurrency is displayed with <span className="font-medium text-highlight">real-time price data</span>, percentage changes, and recognizable logos—transforming the platform into a powerful <span className="font-semibold text-indigo-600">Financial Command Center.</span>
</p>

<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mt-6">
  <h3 className="text-lg md:text-xl font-semibold text-primary"> Why This Matters</h3>
  <p className="text-sm md:text-base mt-2 text-neutral-700 dark:text-neutral-300">
    These AI-powered finance tools empower users by eliminating guesswork and enhancing portfolio strategies. Whether you are a <span className="font-medium text-highlight">seasoned investor</span> or just starting out, this system ensures:
  </p>

  <ul className="list-none mt-3 space-y-2">
    <li className="flex items-center">
      <span className="text-green-500 font-semibold">✔️ Convenience:</span>
      <span className="ml-2">Ask any question, get instant answers.</span>
    </li>
    <li className="flex items-center">
      <span className="text-blue-500 font-semibold">✔️ Accuracy:</span>
      <span className="ml-2">Live data from trusted financial sources.</span>
    </li>
    <li className="flex items-center">
      <span className="text-yellow-500 font-semibold">✔️ Personalization:</span>
      <span className="ml-2">Tailored suggestions based on your interests.</span>
    </li>
  </ul>
</div>

            
          </div>
        </div>
      ),
    },
    {
      title: "STEP-2",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          <strong>Explore Our Interface – A Seamless Experience for Smarter Financial Decisions</strong>
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={step2pic1}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
             <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mt-4">
                <strong>Financial Planning Form:</strong> This tool allows users to input essential financial details such as income, expenses, expected bonuses, investment horizon, risk tolerance, and financial goals. Based on the provided data, it generates a personalized financial report, offering insights into savings, investment strategies, and long-term financial planning.
              </p>
            <Image
              src={step2pic2}
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
              <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mt-4">
                <strong>AI-Powered Financial Chatbot:</strong> This chatbot serves as a virtual financial advisor, offering expert guidance on investment planning, savings strategies, risk assessment, and retirement planning. Users can engage in real-time conversations to receive tailored financial advice and recommendations, helping them achieve their financial goals efficiently.
              </p>
           
          </div>
        </div>
      ),
    },
    {
      title: "STEP-3",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          <strong>AI-Powered Investment Dashboard </strong>

          </p>
        
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={step3pic1}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src={step3pic2}
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
         
          </div>
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md">
  <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
   
  </h2>

  <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base leading-relaxed">
    This intelligent investment dashboard provides a 
    <strong> comprehensive analysis </strong> of your portfolio, helping you make informed financial decisions. 
    It leverages <strong> AI-driven insights </strong> to assess risk, diversification, and market sentiment, 
    while offering <strong> actionable recommendations </strong> to optimize your holdings.
  </p>

  <div className="mt-6">
    <h3 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-white mb-3">
      Key Features:
    </h3>

    <ul className="space-y-4">
      <li className="flex items-start">
        <span className="text-blue-500 text-lg">🔹</span>
        <p className="ml-2 text-neutral-700 dark:text-neutral-300">
          <strong>AI Insights & Recommendations</strong> – Personalized suggestions based on your portfolio’s risk, 
          stock performance, and market trends. AI highlights key areas like sector concentration and major price movements.
        </p>
      </li>

      <li className="flex items-start">
        <span className="text-blue-500 text-lg">🔹</span>
        <p className="ml-2 text-neutral-700 dark:text-neutral-300">
          <strong>Portfolio Overview</strong> – Instantly access your <strong>total portfolio value</strong>, 
          <strong>risk level</strong>, and <strong>diversification status</strong>. Get real-time warnings if your risk is high 
          and AI-backed suggestions to rebalance.
        </p>
      </li>

      <li className="flex items-start">
        <span className="text-blue-500 text-lg">🔹</span>
        <p className="ml-2 text-neutral-700 dark:text-neutral-300">
          <strong>Holdings Breakdown</strong> – A detailed overview of your stocks, including 
          <strong> current price, percentage change, risk level, sentiment analysis,</strong> 
          and AI-recommended actions (e.g., Hold, Buy More) to assist in quick decision-making.
        </p>
      </li>

      <li className="flex items-start">
        <span className="text-blue-500 text-lg">🔹</span>
        <p className="ml-2 text-neutral-700 dark:text-neutral-300">
          <strong>Asset Allocation & Sector Distribution</strong> – Interactive visual charts display your 
          investment distribution across <strong>stocks, mutual funds, ETFs, and crypto</strong>, along with 
          sector-wise exposure (Tech, Finance, Energy, etc.).
        </p>
      </li>

      <li className="flex items-start">
        <span className="text-blue-500 text-lg">🔹</span>
        <p className="ml-2 text-neutral-700 dark:text-neutral-300">
          <strong>Market Sentiment Analysis</strong> – AI continuously evaluates <strong>overall market trends</strong>, 
          providing insights on whether the sentiment is <strong>Bullish, Neutral,</strong> or <strong>Bearish</strong> 
          to help navigate market conditions effectively.
        </p>
      </li>
    </ul>
  </div>

  <p className="mt-6 text-neutral-700 dark:text-neutral-300 text-sm md:text-base leading-relaxed">
    This <strong>user-friendly and data-driven platform</strong> empowers investors with 
    <strong>real-time insights, risk assessment, and strategic recommendations</strong> for smarter investing. 📊💡
  </p>
</div>

        </div>
      ),
    },
    {
      title: "STEP-4",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          <strong>Financial Learning Module – Interactive & Engaging Financial Education</strong>
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Image
              src={step4pic1}
              alt="hero template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
             
            <Image
              src={step4pic2}
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
             
             <Image
              src={step4pic3}
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
             <Image
              src={step4pic4}
              alt="feature template"
              width={500}
              height={500}
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
           
          </div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mt-4">
  
  <strong>Financial Learning Module – Interactive & Engaging Financial Education</strong>  
  <br /><br />
  The Financial Learning Module offers an engaging and interactive approach to understanding key financial concepts. Through structured content and hands-on activities, users can enhance their financial literacy while enjoying the learning process.  
  <br /><br />
  🔹 <strong>Introduction to the Stock Market</strong> – This section provides a comprehensive overview of the stock market, detailing its functions and significance in the global economy. Users gain insights into key benefits such as capital growth, diversification, and dividend income, while also understanding potential risks like market volatility and economic downturns.  
  <br /><br />
  🔹 <strong>Fun Facts & Insights</strong> – Explore fascinating financial facts that make learning enjoyable. This section presents historical insights, including the establishment of the first stock exchange in Amsterdam in 1602, and explains why a rising market is referred to as a "bull market." These engaging facts enhance financial awareness and spark curiosity.  
  <br /><br />
  🔹 <strong>Interactive Quiz</strong> – Reinforce knowledge through a multiple-choice quiz covering essential financial topics such as stock definitions, market capitalization, and investment principles. This interactive approach ensures better retention and deeper understanding.  
  <br /><br />
  🔹 <strong>Term Matching Activity</strong> – Strengthen financial vocabulary through an interactive matching exercise. Users connect key financial terms such as "stock market," "dividend," "bull market," and "bear market" with their correct definitions, making complex concepts easier to grasp.  
  <br /><br />
  With structured content, engaging visuals, and hands-on exercises, the Financial Learning Module serves as a valuable tool for individuals looking to improve their financial literacy in an accessible and effective way.  
</p>

        </div>
      ),
    }
  ];
  return (
    <div className="min-h-screen w-full">
      <div className="relative top-0 left-0 w-full">
        <Timeline data={data} />
      </div>
    </div>
  );
}
