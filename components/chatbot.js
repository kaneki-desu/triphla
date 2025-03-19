"use client";
import React, { useState, useEffect } from "react";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export default function Chatbot() {
    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [model, setModel] = useState(null);

    useEffect(() => {
        if (!apiKey) {
            setError("API KEY is not set.");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        setModel(
            genAI.getGenerativeModel({
                model: "gemini-2.0-pro-exp-02-05",
                systemInstruction:
                    "You are a professional finance advisor specializing in cryptocurrency investment. Your task is to read and analyze the user’s questions and answer all their questions related to cryptocurrency and investments in it. Always stick to finance, particularly cryptocurrency and related investments in comparison to crypto investment. If asked about anything else unrelated to finance and cryptocurrency investment, politely redirect the conversation straight back to cryptocurrency and finance. Provide answers in short(within 100 words), step-by-step format, including comparisons if required. Include potential risks and future expectations on the crypto by exploring past trends related to the particular cryptocurrency or in general.",
            })
        );
    }, []);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSendMessage = async () => {
        if (!model || !userInput.trim()) {
            return;
        }

        setLoading(true);
        setError(null);

        const currentMessage = {
            role: "user",
            parts: [{ text: userInput.trim() }],
        };

        setChatHistory(prevHistory => [...prevHistory, currentMessage]); // Update with user message
        setUserInput(""); // Clear the input box

        try {
            const chatSession = model.startChat({
                generationConfig,
                history: [...chatHistory, currentMessage], // Use the updated history for the model
            });

            const result = await chatSession.sendMessage(userInput.trim());
            const botResponse = await result.response.text();

            const botMessage = {
                role: "model",
                parts: [{ text: botResponse }],
            };

            setChatHistory(prevHistory => [...prevHistory, botMessage]); // Update with bot message
            setResponse(botResponse);
        } catch (err) {
            setError(err.message || "An error occurred while sending the message.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="px-5 mt-3">Loading...</div>;
    }

    if (error) {
        return <div className="px-5 mt-3">Error: {error}</div>;
    }

    return (
        <div className="px-5 relative h-full pb-10"> {/* Added relative for absolute positioning of input */}
            <div className="max-h-full pb-5 overflow-y-auto"> {/* Added max-height and scrollbar */}
                {chatHistory.map((message, index) => (
                    <div key={index} className="mt-3">
                        <strong>{message.role === "user" ? "You:" : "Chatbot:"}</strong>
                        <div className="mb-10">{message.parts[0].text}</div>
                    </div>
                ))}
            </div>
            <div className="mx-3 mb-2 flex absolute bottom-0 left-0 right-0"> {/* Added left-0 and right-0 */}
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Ask me anything about crypto..."
                    className="p-2.5 mt-1.5 rounded-full opacity-70 h-9 border border-gray-800 grow"
                />
                <button
                    data-theme="coffee"
                    onClick={handleSendMessage}
                    disabled={loading || !model}
                    className="py-2.5 px-3.5 opacity-70 rounded-full border-none cursor-pointer ml-2"
                >
                    Send
                </button>
            </div>
            {response &&
                false && ( // Conditionally render the latest response if needed separately
                    <div>
                        <strong>Chatbot's Last Response:</strong>
                        <div>{response}</div>
                    </div>
                )}
        </div>
    );
}