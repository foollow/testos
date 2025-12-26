import React, { useState } from 'react';
import {
    Search, Plus, Smile, Type,
    Image as ImageIcon, Paperclip, Scissors, Maximize2,
    SendHorizonal, MoreHorizontal, Users, UserPlus, SearchCode,
    MessageSquare, Calendar, Users2, LayoutDashboard, Cloud, Shield, VideoIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOS } from '../store/useOS';
import { useTranslation } from "@/lib/i18n";
import { useAI } from "@/hooks/useAI";

const MOCK_CHATS = [
    {
        id: '1',
        name: '鹏哥',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        lastMessage: '今天开始就可以用新大象了哈哈哈',
        time: '11:33',
        unread: 3,
        online: true,
    },
    {
        id: '2',
        name: '办公效率产品设计研发',
        isGroup: true,
        memberCount: 32,
        avatar: 'https://img.meituan.net/diegooacontent/9ea15ba4b65a7e3932193dffad497cb115425.jpg@format=jpeg?token=1.1766797200.mn8qspmg8w5mx9cn0000000000d89d2a.bdf6039ffc552bb28e7a1c90291ca1e0',
        lastMessage: '受大雪影响，北京各工作职场今日提前下班',
        time: '11:09',
        unread: 0,
        muted: true,
    },
    {
        id: '3',
        name: 'Kiki Yang',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kiki22',
        lastMessage: '这个场景我会补充一下',
        time: '10:25',
        unread: 0,
    },
    {
        id: '4',
        name: '明哲(帅)',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
        lastMessage: '这个网站很酷',
        time: '10:15',
        unread: 0,
    },
    {
        id: '5',
        name: '齐学士',
        isApp: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=144',
        lastMessage: '我想想',
        time: '09:54',
        unread: 0,
    },
];

interface Message {
    id: string;
    sender: string;
    avatar?: string;
    isMe?: boolean;
    content: string;
    time: string;
    type?: 'audio' | 'text';
    duration?: string;
    reactions?: { emoji: string; count: number }[];
}

const IMApp: React.FC<{ windowId: string }> = () => {
    const { systemState } = useOS();
    const t = useTranslation(systemState.language);
    const ai = useAI();
    const [activeChat, setActiveChat] = useState(MOCK_CHATS[1]);
    const [message, setMessage] = useState('');
    const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});

    const currentMessages = messagesByChat[activeChat.id] || [];

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const newMessage = {
            id: `m-${Date.now()}`,
            sender: 'Me',
            isMe: true,
            content: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Optimistically add user message
        setMessagesByChat(prev => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
        }));

        const userMessageContent = message; // Capture for async closure
        setMessage('');

        // Trigger AI reply
        try {
            const response = await ai.sendMessage(userMessageContent);

            const aiMessage = {
                id: response.id,
                sender: activeChat.name, // The person you are chatting with "is" the AI in this context
                isMe: false,
                content: response.content,
                time: new Date(response.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: activeChat.avatar
            };

            setMessagesByChat(prev => ({
                ...prev,
                [activeChat.id]: [...(prev[activeChat.id] || []), aiMessage]
            }));
        } catch (error) {
            console.error("AI Error:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-full bg-background text-foreground overflow-hidden">
            {/* Left Rail - Navigation */}
            <div className="w-16 flex flex-col items-center py-4 gap-6 bg-muted/30 border-r shrink-0">
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:scale-105 transition-transform cursor-pointer">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-4 mt-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-primary bg-primary/10 relative">
                                    <MessageSquare size={24} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{t.chat.messages}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-foreground">
                                    <LayoutDashboard size={24} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">学城</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-foreground">
                                    <Users2 size={24} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{t.chat.contacts}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-foreground">
                                    <Calendar size={24} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">日程</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-foreground">
                                    <SearchCode size={24} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">审批</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-foreground">
                                    <LayoutDashboard size={24} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">工作台</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div >

                <div className="mt-auto flex flex-col gap-4">
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><Cloud size={20} /></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><VideoIcon size={20} /></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground"><Shield size={20} /></Button>
                </div>
            </div >

            {/* Middle Panel - Chat List */}
            <div className="w-80 flex flex-col border-r bg-background shrink-0">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">{t.chat.messages}</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Plus size={18} /></Button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t.chat.search}
                            className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                            {MOCK_CHATS.filter(c => !c.isGroup && !c.isApp).map(contact => (
                                <div key={contact.id} className="flex flex-col items-center gap-1 min-w-[56px]">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                                            <AvatarImage src={contact.avatar} />
                                            <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                        </Avatar>
                                        {contact.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">{contact.name}</span>
                                </div>
                            ))}
                        </div>

                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="bg-transparent h-auto p-0 gap-4 w-full justify-start border-b rounded-none">
                                <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 font-medium">全部</TabsTrigger>
                                <TabsTrigger value="later" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 font-medium">稍后处理</TabsTrigger>
                                <TabsTrigger value="unread" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 font-medium">未读</TabsTrigger>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto"><MoreHorizontal size={16} /></Button>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-2">
                        {MOCK_CHATS.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-muted/50 group mb-1 ${activeChat.id === chat.id ? 'bg-primary/10' : ''}`}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 rounded-xl group-hover:scale-105 transition-transform">
                                        <AvatarImage src={chat.avatar} />
                                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span className={`text-sm font-semibold truncate ${activeChat.id === chat.id ? 'text-primary' : ''}`}>
                                            {chat.name}
                                            {chat.isGroup && <span className="ml-1 text-[10px] text-muted-foreground font-normal">{chat.memberCount}人</span>}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate leading-relaxed">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Main Area */}
            <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
                {/* Chat Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b shrink-0 bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10 rounded-lg">
                                <AvatarImage src={activeChat.avatar} />
                                <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                {activeChat.name}
                                {activeChat.isGroup && <span className="text-[10px] text-muted-foreground font-normal">{activeChat.memberCount}人</span>}
                            </h3>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[300px]">
                                {ai.isTyping ? '正在输入...' : '周会请提前订会议室，会议文档及时发出，会后同步纪要'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground"><Users size={20} /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground"><UserPlus size={20} /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground"><Search size={20} /></Button>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground"><MoreHorizontal size={20} /></Button>
                    </div>
                </header>

                {/* Messages List */}
                <ScrollArea className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {currentMessages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 group ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                {!msg.isMe && (
                                    <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                                        <AvatarImage src={msg.avatar} />
                                        <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`flex flex-col gap-1.5 max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-baseline gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-xs font-semibold text-muted-foreground">{msg.sender}</span>
                                        <span className="text-[10px] text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">{msg.time}</span>
                                    </div>

                                    <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm border text-sm leading-relaxed ${msg.isMe
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-muted/30 border-muted'
                                        }`}>
                                        {msg.type === 'audio' ? (
                                            <div className="flex items-center gap-3 min-w-[200px]">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-background shrink-0">
                                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-primary border-b-[5px] border-b-transparent ml-1" />
                                                </Button>
                                                <span className="text-[10px] tabular-nums">{msg.duration}</span>
                                                <div className="flex-1 flex items-end gap-0.5 h-6">
                                                    {[2, 4, 8, 3, 6, 2, 9, 5, 3, 7, 4, 2, 6, 8, 4, 3, 2, 6, 4, 3, 5, 2, 4, 7, 3, 2].map((h, i) => (
                                                        <div key={i} className={`flex-1 rounded-full ${i < 10 ? 'bg-primary' : 'bg-muted-foreground/30'}`} style={{ height: `${h * 10}%` }} />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">01:32</span>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}

                                        {msg.reactions && (
                                            <div className="absolute -bottom-3 left-2 flex gap-1 items-center scale-90 origin-left">
                                                {msg.reactions.map((r, i) => (
                                                    <Badge key={i} variant="secondary" className="px-1.5 py-0.5 bg-background border rounded-full text-[10px] font-normal flex gap-1 hover:bg-muted transition-colors cursor-pointer shadow-sm">
                                                        <span>{r.emoji}</span>
                                                        <span className="text-muted-foreground">{r.count}</span>
                                                    </Badge>
                                                ))}
                                                <Button variant="outline" size="icon" className="h-5 w-5 rounded-full bg-background"><Smile size={10} /></Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-background shrink-0 border-t">
                    <div className="max-w-4xl mx-auto rounded-2xl border bg-background shadow-lg p-2 focus-within:ring-1 focus-within:ring-primary/30 transition-shadow flex flex-col">
                        <div className="flex items-center gap-0.5 text-muted-foreground px-2 py-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><Plus size={18} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><Smile size={18} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><Type size={18} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><ImageIcon size={18} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><Paperclip size={18} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><Scissors size={18} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><VideoIcon size={18} /></Button>
                            <Separator orientation="vertical" className="h-4 mx-1" />
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><SearchCode size={18} /></Button>
                            <div className="ml-auto flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><Maximize2 size={16} /></Button>
                                <Separator orientation="vertical" className="h-4 mx-1" />
                                <div className="flex items-center gap-0.5 px-1 hover:text-primary cursor-pointer">
                                    <span className="text-[10px] font-bold">A</span>
                                    <span className="text-[10px] italic">I</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex items-end">
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t.chat.typeMessage}
                                className="border-none focus-visible:ring-0 bg-transparent text-sm min-h-[40px] px-3 shadow-none h-auto py-2 flex-1 pr-12"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className={`h-8 w-8 mb-1 mr-1 rounded-lg transition-all ${message.trim()
                                    ? "text-primary bg-primary/10 opacity-100"
                                    : "text-muted-foreground/40 opacity-40 cursor-not-allowed"
                                    }`}
                            >
                                <SendHorizonal size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IMApp;
