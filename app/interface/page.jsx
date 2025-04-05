'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from "@/components/Navbar"; // Assuming Navbar is still needed, otherwise remove
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Calculator, Bot, BarChartHorizontalBig } from 'lucide-react'; // Added icons
import FinancialPlanner from '@/components/FinancialPlanner';

const API_URL = process.env.VITE_AI_API || "https://triphla-2862.onrender.com/api";

// Chatbot Component (Extracted for clarity)
const Chatbot = ({ messages, input, setInput, handleSubmit, isLoading, messagesEndRef }) => (
    <motion.div
        key="chat"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-[calc(100vh-20rem)] md:h-[calc(100vh-22rem)] flex flex-col bg-base-300/50 rounded-2xl p-4 md:p-6 shadow-lg border border-base-content/10" // Adjusted height and styling
    >
        <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar"> {/* Added custom scrollbar class if needed */}
            <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`inline-block p-3 md:p-4 rounded-xl max-w-[80%] shadow-md
                                ${message.role === 'user'
                                    ? 'bg-primary text-primary-content' // User message style
                                    : 'bg-base-100 text-base-content' // Assistant message style
                            }`}
                        >
                            <div className="whitespace-pre-wrap text-sm md:text-base break-words">{message.content}</div> {/* Ensure text wraps */}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="inline-block p-3 md:p-4 rounded-xl bg-base-100 text-base-content shadow-md">
                            <div className="flex items-center gap-2">
                                <span className="text-sm md:text-base">Thinking</span>
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>

        <div className="max-w-4xl mx-auto w-full pt-4 border-t border-base-content/10">
            <form onSubmit={handleSubmit} className="flex gap-2 md:gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about financial planning..."
                    className="input input-bordered flex-1 bg-base-100 focus:ring-primary focus:border-primary text-sm md:text-base" // Adjusted input style
                />
                <button
                    type="submit"
                    className="btn btn-primary text-sm md:text-base"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    </motion.div>
);


export default function InterfacePage() { // Renamed component
    const { user } = useUser();
    const [isChatMode, setIsChatMode] = useState(true); // Default to Chat Mode
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I\'m your AI financial assistant. Ask me anything about investment planning, savings strategies, risk assessment, or retirement planning.'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Scroll to bottom only if in chat mode and messages change
        if (isChatMode) {
            scrollToBottom();
        }
    }, [messages, isChatMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return; // Prevent multiple submissions

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/chat`, { // Use constant
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response.' })); // Graceful error parsing
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.detail || 'Unknown error'}`);
            }

            const data = await response.json();

            if (!data.message) {
                // Handle cases where the backend might return an empty success response
                console.warn('Received response without a message field:', data);
                setMessages(prev => [...prev, { role: 'assistant', content: "I received your message, but I don't have a specific response right now." }]);
            } else {
                 setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            }

        } catch (error) {
            console.error('Chat API Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Sorry, I encountered an issue processing your request. Please try again. Error: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div data-theme="forest" className="min-h-screen w-full bg-base-200">
                {/* <Navbar /> */}
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center p-8 bg-base-100 rounded-lg shadow-xl">
                        <h1 className="text-2xl font-semibold mb-4 text-base-content">Please sign in to access the financial tools</h1>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/sign-in'}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div data-theme="forest" className="min-h-screen w-full flex flex-col bg-gradient-to-b from-base-300 via-base-200 to-base-300 text-base-content">
            {/* <Navbar /> */}
            <div className="w-full max-w-[1200px] mx-auto flex-grow">
                <main className="container mx-auto px-4 py-12 md:py-16">
                    {/* Page Header */}
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary tracking-tight">
                            Your Financial Command Center
                        </h1>
                        <p className="text-xl md:text-2xl text-base-content/90 max-w-3xl mx-auto leading-relaxed">
                            Leverage powerful tools for smarter financial planning. Choose between our AI-powered chat assistant for quick answers or the detailed financial planner for in-depth analysis.
                        </p>
                    </header>

                    {/* Toggle and Introduction */}
                    <div className="flex justify-between text-red-500 font-bold  items-center gap-6 mb-12 p-6 bg-base-100 rounded-2xl shadow-md border border-base-content/10">
                         <p className="text-lg text-center text-base-content/80">Select your preferred tool:</p>
                         <div className="flex items-center justify-center gap-4">
                            <div className={`flex items-center gap-2 transition-colors ${isChatMode ? 'text-primary font-semibold' : 'text-base-content/70'}`}>
                                <Bot className="w-5 h-5" />
                                <span>AI Chat Assistant</span>
                            </div>
                            <Switch
                                checked={!isChatMode}
                                onCheckedChange={() => setIsChatMode(!isChatMode)}
                                className="text-red-500 font-bold animate-pulse drop-shadow-[0_0_10px_#cb95cb]  data-[state=checked]:bg-primary data-[state=unchecked]:bg-base-300" // Themed switch
                            />
                            <div className={`flex items-center gap-2 transition-colors ${!isChatMode ? 'text-primary font-semibold' : 'text-base-content/70'}`}>
                                <BarChartHorizontalBig className="w-5 h-5" />
                                <span>Detailed Planner</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area based on Toggle */}
                    <AnimatePresence mode="wait">
                        {isChatMode ? (
                             <section key="chat-section" className="mb-16">
                                <div className="flex items-center gap-4 mb-6 px-2">
                                    <Bot className="w-8 h-8 text-primary flex-shrink-0" />
                                    <h2 className="text-3xl font-bold text-primary">Chat with Your AI Financial Assistant</h2>
                                </div>
                                <p className="text-lg text-base-content/80 leading-relaxed mb-8 px-2">
                                    Get quick answers and guidance on your financial questions. Ask about investments, savings, retirement, and more. Our AI is here to help you navigate your financial journey.
                                </p>
                                <Chatbot
                                    messages={messages}
                                    input={input}
                                    setInput={setInput}
                                    handleSubmit={handleSubmit}
                                    isLoading={isLoading}
                                    messagesEndRef={messagesEndRef}
                                />
                            </section>
                        ) : (
                            <motion.section
                                key="planner-section"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="mb-16 p-6 md:p-8 bg-base-100 rounded-2xl shadow-lg border border-base-content/10"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <BarChartHorizontalBig className="w-8 h-8 text-primary flex-shrink-0" />
                                    <h2 className="text-3xl font-bold text-primary">In-Depth Financial Planner</h2>
                                </div>
                                <p className="text-lg text-base-content/80 leading-relaxed mb-8">
                                    Use the detailed planner to visualize your financial future. Input your goals, income, and expenses to get a comprehensive overview and personalized recommendations.
                                </p>
                                <FinancialPlanner />
                            </motion.section>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
