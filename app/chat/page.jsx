'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";

const API_URL = import.meta.env.VITE_AI_API;

export default function Chat() {
    const { user } = useUser();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I\'m your financial planning assistant. I can help you with:\n\n' +
                    '• Investment planning\n' +
                    '• Savings strategies\n' +
                    '• Risk assessment\n' +
                    '• Retirement planning\n\n' +
                    'What would you like to discuss today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
    
        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
    
        try {
            console.log('Sending request to backend...');
            const response = await fetch('https://triphla-2862.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.detail || 'Unknown error'}`);
            }
    
            const data = await response.json();
            console.log('Data received:', data);
            
            if (!data.message) {
                throw new Error('No message in response data');
            }
    
            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `I encountered an error: ${error.message}. Please try again later.` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    

    if (!user) {
        return (
            <div data-theme="coffee" className="min-h-screen w-full">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <h1 className="text-2xl mb-4">Please sign in to access the financial planning assistant</h1>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/sign-in'}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div data-theme="coffee" className="min-h-screen w-full flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="w-full max-w-[1200px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
                    <div className="bg-base-200 rounded-lg p-4 flex-1 overflow-y-auto mb-4">
                        <div className="max-w-4xl mx-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 ${
                                        message.role === 'user' ? 'text-right' : 'text-left'
                                    }`}
                                >
                                    <div
                                        className={`inline-block p-4 rounded-lg max-w-[80%] 
                                            ${
                                            message.role === 'user'
                                                ? 'bg-base-100'
                                                : 'bg-base-300'
                                        }`}
                                    >
                                        <div className="whitespace-pre-line">{message.content}</div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="text-left">
                                    <div className="inline-block p-4 rounded-lg bg-base-300">
                                        <div className="flex items-center gap-2">
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

                    <div className="max-w-4xl mx-auto w-full">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your financial planning..."
                                className="input input-bordered flex-1"
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}