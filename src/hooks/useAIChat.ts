import { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useOS } from '@/store/useOS';

export interface Message {
    id: string;
    sender: 'user' | 'ai' | 'other';
    content: string;
    timestamp: Date;
    senderName?: string;
    avatar?: string;
}

export const useAIChat = () => {
    const { systemState } = useOS();
    const t = useTranslation(systemState.language);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'ai',
            content: "Hello! I'm your AI assistant. How can I help you today?", // You might want to localize this initial message too if strictly needed, but for now English/generic is fine or use a key
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            senderName: t.chat.aiAssistant,
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = useCallback(async (content: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            content,
            timestamp: new Date(),
            senderName: 'You', // In a real app this would come from user profile
        };

        setMessages((prev) => [...prev, newMessage]);

        // Simulate AI response if it's a command or just a general chat
        // For the demo, we'll just echo or give a canned response
        if (content.trim()) {
            setIsTyping(true);

            // Mock delay
            setTimeout(() => {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'ai',
                    content: `I received your message: "${content}". This is a simulated AI response.`,
                    timestamp: new Date(),
                    senderName: t.chat.aiAssistant,
                };
                setMessages((prev) => [...prev, aiResponse]);
                setIsTyping(false);
            }, 1000 + Math.random() * 2000);
        }
    }, [t.chat.aiAssistant]);

    return {
        messages,
        sendMessage,
        isTyping
    };
};
