import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Plus, Smile,
    ImageIcon, Paperclip, Scissors, Maximize2,
    SendHorizonal, MoreHorizontal, Users, UserPlus, SearchCode,
    MessageSquare, Calendar, LayoutDashboard, VideoIcon,
    Contact2, GraduationCap, Cloud, Monitor, ShieldCheck,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    const [activeChat, setActiveChat] = useState(MOCK_CHATS[0]);
    const [message, setMessage] = useState('');
    const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const adjustHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [message]);

    useEffect(() => {
        inputRef.current?.focus();
        adjustHeight();
    }, [activeChat.id]);

    const currentMessages = messagesByChat[activeChat.id] || [];

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [currentMessages, activeChat.id]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const newMessage = {
            id: `m-${Date.now()}`,
            sender: 'Me',
            isMe: true,
            content: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessagesByChat(prev => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
        }));

        const userMessageContent = message;
        setMessage('');

        try {
            const response = await ai.sendMessage(userMessageContent);

            const aiMessage = {
                id: response.id,
                sender: activeChat.name,
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
        <div className="flex h-full text-[var(--color-text-main)] overflow-hidden">
            {/* Left Rail - Navigation */}
            <div className="w-16 flex flex-col items-center pb-4 shrink-0 pt-11">
                <Avatar className="h-9 w-9 border border-[var(--color-border-strong)] hover:scale-105 transition-transform cursor-pointer mb-6">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-2 flex-1 items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-inverse)] bg-[var(--color-blue)] shadow-[0_4px_12px_rgba(0,140,255,0.3)]">
                                    <MessageSquare size={22} strokeWidth={2.5} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{t.chat.messages}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors">
                                    <GraduationCap size={22} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">学城</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors">
                                    <Contact2 size={22} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">通讯录</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors">
                                    <Calendar size={22} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">日程</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors">
                                    <SearchCode size={22} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">审批</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors">
                                    <LayoutDashboard size={22} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">工作台</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Separator className="w-8 my-2 bg-[var(--color-border-weak)]" />

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors">
                                    <Cloud size={20} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">云盘</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors">
                                    <Monitor size={20} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">视频会议</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[var(--radius-12)] text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors mt-auto">
                                    <ShieldCheck size={20} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">VPN</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Main Area Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Content Container (Layered White Box) */}
                <div className="flex-1 ml-0 mt-10 mb-4 mr-4 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[var(--color-border-weak)] flex overflow-hidden">
                    {/* Middle Panel - Chat List */}
                    <div className="w-72 flex flex-col border-r border-[var(--color-border-weak)] shrink-0 bg-[#fbfbfb]">
                        <div className="pt-6 p-4 pb-0 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-[17px] font-bold tracking-tight text-[var(--color-text-title)]">消息</h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-text-minor)]"><Plus size={18} /></Button>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--color-text-assist)]" />
                                <Input
                                    placeholder={t.chat.search}
                                    className="pl-9 h-9 bg-[var(--color-bg-3)] border-none focus-visible:ring-1 focus-visible:ring-[var(--color-blue-active)]/30 text-[var(--color-text-main)] rounded-[var(--radius-8)]"
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                    {MOCK_CHATS.filter(c => !c.isGroup && !c.isApp).map(contact => (
                                        <div key={contact.id} className="flex flex-col items-center gap-1.5 min-w-[56px] group cursor-pointer">
                                            <div className="relative">
                                                <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-[var(--color-blue)] transition-colors rounded-full">
                                                    <AvatarImage src={contact.avatar} />
                                                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                                </Avatar>
                                                {contact.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--color-blue)] border-2 border-[var(--color-bg-page)]" />}
                                            </div>
                                            <span className="text-[var(--font-xs-size)] text-[var(--color-text-main)] truncate w-full text-center font-medium">{contact.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList className="bg-transparent h-auto p-0 gap-4 w-full justify-start border-none rounded-none overflow-x-auto no-scrollbar">
                                        <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-blue)] data-[state=active]:bg-transparent px-1 pb-2 font-bold text-[var(--color-text-main)] transition-all">全部</TabsTrigger>
                                        <TabsTrigger value="later" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-blue)] data-[state=active]:bg-transparent px-1 pb-2 font-medium text-[var(--color-text-minor)] transition-all flex items-center gap-1">
                                            稍后处理 <Badge variant="secondary" className="h-4 min-w-[16px] px-1 bg-[var(--color-bg-3)] text-[var(--color-text-assist)] border-none text-[8px]">3</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="group" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-blue)] data-[state=active]:bg-transparent px-1 pb-2 font-medium text-[var(--color-text-minor)] transition-all">分组</TabsTrigger>
                                        <TabsTrigger value="unread" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-blue)] data-[state=active]:bg-transparent px-1 pb-2 font-medium text-[var(--color-text-minor)] transition-all flex items-center gap-1">
                                            未读 <Badge variant="secondary" className="h-4 min-w-[16px] px-1 bg-[var(--color-bg-3)] text-[var(--color-text-assist)] border-none text-[8px]">3</Badge>
                                        </TabsTrigger>
                                        <TabsTrigger value="at" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-blue)] data-[state=active]:bg-transparent px-1 pb-2 font-medium text-[var(--color-text-minor)] transition-all">@我</TabsTrigger>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto flex-shrink-0 text-[var(--color-text-minor)] hover:text-[var(--color-text-main)] transition-colors"><MoreHorizontal size={16} /></Button>
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
                                        className={`flex items-center gap-3 p-3 rounded-[var(--radius-12)] cursor-pointer transition-all hover:bg-[var(--color-fill-2)] group mb-1 ${activeChat.id === chat.id ? 'bg-[var(--color-fill-2)]' : ''}`}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 rounded-[var(--radius-12)] group-hover:scale-105 transition-transform overflow-hidden">
                                                <AvatarImage src={chat.avatar} />
                                                <AvatarFallback>{chat.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className={`text-[var(--font-sm-size)] font-semibold truncate text-[var(--color-text-main)] transition-colors`}>
                                                    {chat.name}
                                                    {chat.isGroup && <span className="ml-1 text-[var(--font-xs-size)] text-[var(--color-text-minor)] font-normal">{chat.memberCount}人</span>}
                                                </span>
                                                <span className="text-[var(--font-xs-size)] text-[var(--color-text-minor)]">{chat.time}</span>
                                            </div>
                                            <p className="text-[var(--font-xs-size)] text-[var(--color-text-assist)] truncate leading-relaxed">
                                                {chat.lastMessage}
                                            </p>
                                        </div>
                                        {chat.muted && (
                                            <div className="text-[var(--color-text-assist)]">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.1001 19.1L4.8999 4.8999M10.1999 4.3999L6.1999 8.3999H3.1999V15.6H6.1999L10.1999 19.6V4.3999ZM15.1999 8.3999C16.1999 9.3999 16.7999 10.6 16.7999 12M18.8999 5.3999C20.6 7.0999 21.6 9.3999 21.6 12C21.6 14.6001 20.6 17 18.8999 18.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Main Area */}
                    <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
                        {/* Chat Header */}
                        <header className="h-[64px] flex items-center justify-between px-6 border-b border-[var(--color-border-weak)] shrink-0 bg-white/80 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-[var(--radius-8)] overflow-hidden">
                                    <AvatarImage src={activeChat.avatar} />
                                    <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[var(--font-base-size)] font-bold text-[var(--color-text-title)]">{activeChat.name}</h3>
                                        {activeChat.isGroup && <span className="text-[var(--font-xs-size)] text-[var(--color-text-assist)] font-normal">{activeChat.memberCount}人</span>}
                                    </div>
                                    <p className="text-[var(--font-xs-size)] text-[var(--color-text-assist)] truncate max-w-[400px]">
                                        {ai.isTyping ? '正在输入...' : '周会请提前订会议室，会议文档及时发出，会后同步纪要'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[var(--color-text-minor)]">
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[var(--color-text-main)] transition-colors"><Users size={20} /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[var(--color-text-main)] transition-colors"><UserPlus size={20} /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[var(--color-text-main)] transition-colors"><Search size={20} /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[var(--color-text-main)] transition-colors"><MoreHorizontal size={20} /></Button>
                            </div>
                        </header>

                        {/* Messages List */}
                        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
                            <div className="max-w-4xl mx-auto space-y-8">
                                {currentMessages.map((msg) => (
                                    <div key={msg.id} className={`flex gap-3 group ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                        {!msg.isMe && (
                                            <Avatar className="h-9 w-9 shrink-0 rounded-[var(--radius-8)] overflow-hidden">
                                                <AvatarImage src={msg.avatar} />
                                                <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={`flex flex-col gap-1 max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`flex items-baseline gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                                <span className="text-[11px] font-medium text-[var(--color-text-assist)]">{msg.sender}</span>
                                                <span className="text-[10px] text-[var(--color-text-assist)] opacity-0 group-hover:opacity-100 transition-opacity">{msg.time}</span>
                                            </div>

                                            <div className={`relative px-4 py-2 rounded-[var(--radius-12)] text-[var(--font-base-size)] leading-relaxed select-text ${msg.isMe
                                                ? 'bg-[var(--color-blue)] text-[var(--color-text-inverse)]'
                                                : 'bg-[var(--color-bg-2)] border border-[var(--color-border-weak)] text-[var(--color-text-main)]'
                                                } transition-all`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="px-6 pb-6 pt-2 shrink-0 border-t border-transparent">
                            <div className="max-w-[1240px] mx-auto rounded-[var(--radius-16)] border border-[var(--color-border-weak)] bg-[var(--color-bg-1)] shadow-[var(--effect-shadow-level-1-box)] p-1.5 focus-within:ring-1 focus-within:ring-[var(--color-blue-active)]/10 transition-all flex flex-col group">
                                <div className="relative flex items-end">
                                    <Textarea
                                        ref={inputRef}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="输入“/”，大象AI帮你..."
                                        className="border-none focus-visible:ring-0 bg-transparent text-[var(--font-base-size)] min-h-[44px] px-3 shadow-none h-auto py-2.5 flex-1 pr-12 resize-none overflow-y-auto text-[var(--color-text-main)] placeholder:text-[var(--color-text-assist)]"
                                        rows={1}
                                    />
                                </div>

                                <div className="flex items-center gap-0.5 text-[var(--color-text-minor)] px-1 pb-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors"><Plus size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors"><Smile size={18} /></Button>
                                    <div className="flex items-center h-8 px-2 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors cursor-pointer text-[13px] font-medium ml-1">
                                        Aa
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors"><ImageIcon size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors"><Paperclip size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors"><Scissors size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors"><VideoIcon size={18} /></Button>
                                    <div className="flex items-center h-8 px-2 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors cursor-pointer text-[13px] font-medium">
                                        ✨
                                    </div>

                                    <div className="ml-auto flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors"><Maximize2 size={16} /></Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleSendMessage}
                                            disabled={!message.trim()}
                                            className={`h-8 w-8 flex items-center justify-center rounded-[var(--radius-8)] transition-all ${message.trim()
                                                ? "text-[var(--color-blue)]"
                                                : "text-[var(--color-text-assist)]/40"
                                                }`}
                                        >
                                            <SendHorizonal size={18} />
                                        </Button>
                                        <div className="flex items-center px-1 text-[var(--color-text-assist)]">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IMApp;
