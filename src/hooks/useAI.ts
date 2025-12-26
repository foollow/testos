
import { useState, useCallback } from 'react';

export interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export const useAI = () => {
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = useCallback(async (content: string) => {
        setIsTyping(true);

        // Using Vite's environment variables
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: content }]
                    }]
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();

            // Handle cases where response might be empty or blocked
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm sorry, I couldn't generate a response for that.";

            setIsTyping(false);
            return {
                id: crypto.randomUUID(),
                role: 'assistant' as const,
                content: responseText.trim(),
                timestamp: Date.now(),
            };
        } catch (error) {
            console.error("AI API Error:", error);
            setIsTyping(false);
            return {
                id: crypto.randomUUID(),
                role: 'assistant' as const,
                content: "抱歉，连接大模型时遇到问题。请检查网络或稍后再试。",
                timestamp: Date.now(),
            };
        }
    }, []);

    return {
        sendMessage,
        isTyping,
    };
};
