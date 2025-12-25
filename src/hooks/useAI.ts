
import { useState, useCallback } from 'react';

export interface AIMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export const useAI = () => {
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = useCallback(async (content: string, history: AIMessage[] = []) => {
        setIsTyping(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        let responseText = "I'm a system-level AI assistant. I can help you with tasks or answer questions.";

        if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi')) {
            responseText = "Hello! How can I assist you today?";
        } else if (content.toLowerCase().includes('time')) {
            responseText = `Current time is ${new Date().toLocaleTimeString()}.`;
        } else if (content.toLowerCase().includes('meeting')) {
            responseText = "I can help you schedule a meeting. When would you like it to be?";
        }

        setIsTyping(false);
        return {
            id: crypto.randomUUID(),
            role: 'assistant' as const,
            content: responseText,
            timestamp: Date.now(),
        };
    }, []);

    return {
        sendMessage,
        isTyping,
    };
};
