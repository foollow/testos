
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

        const API_KEY = import.meta.env.VITE_LONGCAT_API_KEY;
        const API_URL = 'https://api.longcat.chat/openai/v1/chat/completions';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "LongCat-Flash-Chat",
                    messages: [
                        { role: "system", content: "你是一个集成在 Web OS 系统中的高效智能助手。" },
                        { role: "user", content: content }
                    ],
                    stream: false
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.error?.message || 'API request failed';
                throw new Error(errorMsg);
            }

            const responseText = data.choices?.[0]?.message?.content ||
                "I'm sorry, I couldn't generate a response for that.";

            setIsTyping(false);
            return {
                id: crypto.randomUUID(),
                role: 'assistant' as const,
                content: responseText.trim(),
                timestamp: Date.now(),
            };
        } catch (error: any) {
            console.error("AI API Error:", error);
            setIsTyping(false);

            return {
                id: crypto.randomUUID(),
                role: 'assistant' as const,
                content: `抱歉，连接 Longcat 时遇到问题 (${error.message})。请检查 API Key 或网络。`,
                timestamp: Date.now(),
            };
        }
    }, []);

    return {
        sendMessage,
        isTyping,
    };
};
