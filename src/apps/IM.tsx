import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Plus, Smile,
    ImageIcon, Paperclip, Scissors, Maximize2,
    SendHorizonal, MoreHorizontal, Users, UserPlus,
    VideoIcon, Edit2, RefreshCw, AlertCircle,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useOS } from '../store/useOS';
import { useTranslation } from "@/lib/i18n";
import { useAI } from "@/hooks/useAI";

// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase initialization wrapper to prevent crashes
const getFirebase = () => {
    try {
        if (typeof __firebase_config === 'undefined' || !__firebase_config || __firebase_config === '{}') {
            console.warn("Firebase config is empty or undefined");
            return null;
        }

        let configStr = __firebase_config;

        // Defensive check: if it's double stringified or contains escaped quotes, clean it
        if (configStr.startsWith('"') && configStr.endsWith('"')) {
            try {
                configStr = JSON.parse(configStr);
            } catch (e) { }
        }

        const config = typeof configStr === 'string' ? JSON.parse(configStr) : configStr;

        const app = initializeApp(config);
        return {
            auth: getAuth(app),
            db: getFirestore(app),
            appId: typeof __app_id !== 'undefined' ? __app_id : 'p2p-chat-v1'
        };
    } catch (e) {
        console.error("Firebase Init Failed:", e);
        // Log a hint about the common JSON error to help user
        if (e instanceof SyntaxError) {
            console.error("Potential JSON format issue. Check if keys like apiKey are quoted with double quotes (\").");
        }
        return null;
    }
};

const FOOD_NAMES = [
    "麻婆豆腐", "红烧狮子头", "大盘鸡", "冰糖葫芦", "脆皮烤鸭",
    "小笼汤包", "螺蛳粉", "酸菜鱼", "宫保鸡丁", "锅包肉",
    "芝士火锅", "手撕包菜", "地三鲜", "佛跳墙"
];

const getRandomFood = () => FOOD_NAMES[Math.floor(Math.random() * FOOD_NAMES.length)];
const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || 'default')}`;

const QA_BOT = {
    id: 'longcat-bot',
    uid: 'longcat-bot',
    name: 'LongCat',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LongCat',
    lastMessage: '你好！我是 LongCat，有什么我可以帮你的吗？',
    time: '刚刚',
    unread: 0,
    online: true,
    isBot: true,
};

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    avatar?: string;
    text: string;
    timestamp: string;
    createdAt?: any;
}

const IMApp: React.FC<{ windowId: string }> = () => {
    const { systemState } = useOS();
    const t = useTranslation(systemState.language);
    const ai = useAI();

    // Auth & Profile State
    const [user, setUser] = useState<any>(null);
    const [authStatus, setAuthStatus] = useState('connecting'); // 'connecting', 'authenticated', 'error', 'guest'
    const [nickname, setNickname] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tempNickname, setTempNickname] = useState('');

    // Firebase instance
    const fb = React.useMemo(() => getFirebase(), []);
    const auth = fb?.auth;
    const db = fb?.db;
    const appId = fb?.appId || 'p2p-chat-v1';

    // Chat State
    const [activeChat, setActiveChat] = useState<any>(QA_BOT);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([QA_BOT]);
    const [firestoreMessages, setFirestoreMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');

    const [activeTab, setActiveTab] = useState('messages');
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Helpers
    const retryAction = async (fn: () => Promise<any>, maxRetries = 3) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (err) {
                if (i === maxRetries - 1) throw err;
                await new Promise(r => setTimeout(r, Math.pow(2, i) * 800));
            }
        }
    };

    const NAV_ITEMS = [
        { id: 'messages', label: t.chat.messages, icon: 'message' },
        { id: 'docs', label: '学城', icon: 'document' },
        { id: 'calendar', label: '日程', icon: 'calendar' },
        { id: 'approval', label: '审批', icon: 'approval' },
        { id: 'workplace', label: '工作台', icon: 'workplace' },
    ];

    const adjustHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            // Use rem-based calculation for max height (12.5rem = 200px at 16px base)
            const maxHeight = 12.5 * parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, maxHeight)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [message]);

    useEffect(() => {
        inputRef.current?.focus();
        adjustHeight();
    }, [activeChat.id, activeChat.uid]);

    // 1. Auth Logic
    useEffect(() => {
        let isMounted = true;

        const performAuth = async () => {
            if (!auth) {
                setAuthStatus('error');
                return;
            }
            try {
                setAuthStatus('connecting');
                try {
                    await setPersistence(auth, browserLocalPersistence);
                } catch (e) {
                    await setPersistence(auth, inMemoryPersistence);
                }

                await retryAction(async () => {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                });
            } catch (error) {
                console.error("Auth Error:", error);
                if (isMounted) setAuthStatus('error');
            }
        };

        performAuth();

        if (!auth || !db) return;
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser && isMounted) {
                setUser(currentUser);
                setAuthStatus('authenticated');

                if (db) {
                    const userSettingsRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'settings', 'profile');
                    try {
                        const docSnap = await getDoc(userSettingsRef);
                        let currentName = docSnap.exists() ? docSnap.data().name : getRandomFood();

                        setNickname(currentName);
                        await setDoc(userSettingsRef, { name: currentName, lastLogin: serverTimestamp() }, { merge: true });

                        // Register Online
                        const publicUserRef = doc(db, 'artifacts', appId, 'public', 'data', 'online_users', currentUser.uid);
                        await setDoc(publicUserRef, {
                            uid: currentUser.uid,
                            name: currentName,
                            lastActive: serverTimestamp()
                        }, { merge: true });
                    } catch (e) {
                        console.error("Firestore Init Error:", e);
                    }
                }
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    // 2. Real-time Data Sync
    useEffect(() => {
        if (!user || authStatus !== 'authenticated' || !db) return;

        // Listen for online users
        const usersQuery = collection(db, 'artifacts', appId, 'public', 'data', 'online_users');
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const usersList = snapshot.docs
                .map(doc => doc.data())
                .filter(u => u.uid !== user.uid);
            setOnlineUsers([QA_BOT, ...usersList]);
        });

        // Determine room ID
        let roomId;
        const targetId = activeChat.uid || activeChat.id;
        if (activeChat.isBot) {
            roomId = `bot_qa_${user.uid}`;
        } else {
            roomId = [user.uid, targetId].sort().join('_');
        }

        // Listen for messages
        const msgsQuery = collection(db, 'artifacts', appId, 'public', 'data', `room_${roomId}`);
        const unsubscribeMsgs = onSnapshot(msgsQuery, (snapshot) => {
            const loadedMsgs = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Message))
                .sort((a, b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
            setFirestoreMessages(loadedMsgs);
        }, (err) => console.warn("Messages sync restricted:", err));

        return () => {
            unsubscribeUsers();
            unsubscribeMsgs();
        };
    }, [user, authStatus, activeChat.uid, activeChat.id, db, appId]);

    const scrollToBottom = () => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [firestoreMessages, activeChat.id]);

    const handleUpdateNickname = async () => {
        if (!tempNickname.trim() || !user) return;

        const newName = tempNickname.trim();
        setNickname(newName);

        if (authStatus === 'authenticated' && db) {
            const userSettingsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile');
            await setDoc(userSettingsRef, { name: newName }, { merge: true });
            const publicUserRef = doc(db, 'artifacts', appId, 'public', 'data', 'online_users', user.uid);
            await setDoc(publicUserRef, { name: newName }, { merge: true });
        }

        setIsEditModalOpen(false);
    };

    const enterAsGuest = () => {
        const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
        const name = getRandomFood();
        setNickname(name);
        setUser({ uid: guestId, isGuest: true });
        setAuthStatus('guest');
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!message.trim() || !user) return;

        const text = message;
        setMessage('');

        let roomId;
        const targetId = activeChat.uid || activeChat.id;
        if (activeChat.isBot) {
            roomId = `bot_qa_${user.uid}`;
        } else {
            roomId = [user.uid, targetId].sort().join('_');
        }

        const chatRef = collection(db!, 'artifacts', appId, 'public', 'data', `room_${roomId}`);

        await addDoc(chatRef, {
            text,
            senderId: user.uid,
            senderName: nickname,
            createdAt: serverTimestamp(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        if (activeChat.isBot) {
            try {
                const response = await ai.sendMessage(text);
                await addDoc(chatRef, {
                    text: response.content,
                    senderId: 'bot',
                    senderName: activeChat.name,
                    createdAt: serverTimestamp(),
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: activeChat.avatar
                });
            } catch (error) {
                console.error("AI Error:", error);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (authStatus === 'error') {
        return (
            <div className="flex items-center justify-center h-full bg-[var(--color-bg-1)] p-6">
                <div className="bg-[var(--color-bg-2)] p-10 rounded-[3rem] shadow-2xl max-w-sm text-center border border-[var(--color-border-a1)]">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-black mb-2">连接受限</h2>
                    <p className="text-[color:var(--color-text-4)] text-sm mb-6">检测到网络拦截，这通常由于环境安全策略引起。您可以刷新页面或以预览模式进入。</p>
                    <div className="space-y-2">
                        <Button onClick={() => window.location.reload()} className="w-full bg-[var(--color-blue)] text-white font-bold py-6 rounded-2xl shadow-lg">重新连接</Button>
                        <Button onClick={enterAsGuest} variant="ghost" className="w-full text-[color:var(--color-text-4)] font-bold py-6 rounded-2xl">本地预览</Button>
                    </div>
                </div>
            </div>
        );
    }

    if (authStatus === 'connecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-[var(--color-bg-1)]">
                <div className="w-12 h-12 border-4 border-[var(--color-border-a1)] border-t-[var(--color-blue)] rounded-full animate-spin mb-4"></div>
                <p className="text-[color:var(--color-text-4)] font-black text-[length:var(--font-xs-size)] tracking-[0.3em] uppercase">Initializing P2P Node</p>
            </div>
        );
    }

    return (
        <div className="flex h-full text-[color:var(--color-text-2)] overflow-hidden">
            {/* Left Rail - Navigation */}
            <div className="w-16 flex flex-col items-center pb-4 shrink-0 pt-11">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative cursor-pointer mb-6 group" onClick={() => { setTempNickname(nickname); setIsEditModalOpen(true); }}>
                                <Avatar className="h-9 w-9 border border-[var(--color-border-a1)] group-hover:scale-105 transition-transform">
                                    <AvatarImage src={getAvatarUrl(nickname)} />
                                    <AvatarFallback>{nickname[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[var(--color-bg-1)] rounded-full"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <Edit2 className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">修改资料: {nickname}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex flex-col gap-3 flex-1 items-center">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <Button
                                key={item.id}
                                variant="ghost"
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center justify-center h-auto w-14 py-2 rounded-[var(--radius-12)] transition-all gap-1 ${isActive
                                    ? 'text-[color:var(--color-blue)] bg-[var(--color-blue-bg-weak)]'
                                    : 'text-[color:var(--color-text-4)] hover:text-[color:var(--color-text-2)] hover:bg-[var(--color-fill-a2)]'
                                    }`}
                            >
                                <span className={`iconfont icon-${item.icon}-${isActive ? 'actived' : 'default'} text-[1.375rem]`} />
                                <span className="text-[length:var(--font-xs-size)] scale-90 origin-top font-medium mt-0.5">{item.label}</span>
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Main Area Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Content Container (Layered White Box) */}
                <div className="flex-1 ml-0 mt-10 mb-4 mr-4 bg-[var(--color-bg-1)] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[var(--divider-color)] flex overflow-hidden">
                    {/* Middle Panel - Chat List */}
                    <div className="w-72 flex flex-col border-r border-[var(--divider-color)] shrink-0 bg-[var(--color-fill-2)] max-w-full overflow-x-hidden">
                        <div className="pt-6 px-4 pb-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[length:var(--font-base-size)] font-bold tracking-tight text-[color:var(--color-text-1)]">消息</h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[color:var(--color-text-4)]"><Plus size={18} /></Button>
                            </div>

                        </div>

                        <ScrollArea className="flex-1">
                            <div className="px-3 space-y-1 pb-4">
                                {onlineUsers.map(chat => (
                                    <div
                                        key={chat.uid || chat.id}
                                        onClick={() => setActiveChat(chat)}
                                        className={`flex items-center gap-3 p-3 rounded-[var(--radius-12)] cursor-pointer transition-all hover:bg-[var(--hover-bg)] group mb-1 min-w-0 ${(activeChat.uid || activeChat.id) === (chat.uid || chat.id) ? 'bg-[var(--active-bg)] border border-[var(--divider-color)]' : ''}`}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 rounded-[var(--radius-12)] group-hover:scale-105 transition-transform overflow-hidden">
                                                <AvatarImage src={chat.avatar || getAvatarUrl(chat.name)} />
                                                <AvatarFallback>{chat.name[0]}</AvatarFallback>
                                            </Avatar>
                                            {!chat.isBot && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[var(--color-bg-1)] rounded-full"></div>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-[length:var(--font-base-size)] font-bold truncate text-[color:var(--color-text-1)]">
                                                    {chat.name}
                                                </span>
                                                <span className="text-[length:var(--font-xs-size)] text-[color:var(--color-text-5)]">{chat.time || '刚刚'}</span>
                                            </div>
                                            <p className="text-[length:var(--font-xs-size)] text-[color:var(--color-text-5)] truncate opacity-80">
                                                {chat.lastMessage || (chat.isBot ? '长猫 AI 助手' : '点击发起私聊')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Main Area */}
                    <div className="flex-1 flex flex-col relative overflow-hidden bg-[var(--color-bg-1)]">
                        {/* Chat Header */}
                        <header className="h-[4rem] flex items-center justify-between px-6 border-b border-[var(--divider-color)] shrink-0 bg-[var(--color-bg-1)]/80 backdrop-blur-md z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-[var(--radius-8)] overflow-hidden">
                                    <AvatarImage src={activeChat.avatar} />
                                    <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[length:var(--font-base-size)] font-bold text-[color:var(--color-text-1)]">{activeChat.name}</h3>
                                    </div>
                                    <p className="text-[length:var(--font-xs-size)] text-[color:var(--color-text-5)] opacity-80 truncate max-w-[400px]">
                                        {ai.isTyping ? '正在输入...' : '有什么可以帮您的？'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[color:var(--color-text-4)]">
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[color:var(--color-text-2)] transition-colors"><Users size={20} /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[color:var(--color-text-2)] transition-colors"><UserPlus size={20} /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[color:var(--color-text-2)] transition-colors"><Search size={20} /></Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-[color:var(--color-text-2)] transition-colors"><MoreHorizontal size={20} /></Button>
                            </div>
                        </header>

                        {/* Messages List */}
                        <ScrollArea ref={scrollAreaRef} className="flex-1 p-5">
                            <div className="max-w-4xl mx-auto space-y-8">
                                {firestoreMessages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-[color:var(--color-text-5)] py-20 gap-4 opacity-40">
                                        <div className="w-20 h-20 bg-[var(--color-fill-3)] rounded-[2.5rem] flex items-center justify-center border border-[var(--color-border-a1)]">
                                            <Search className="w-8 h-8 opacity-20" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[length:var(--font-sm-size)] font-black uppercase tracking-widest">已开启加密对话</p>
                                            <p className="text-[length:var(--font-xs-size)]">只有你和 {activeChat.name} 能看到此对话内容</p>
                                        </div>
                                    </div>
                                ) : (
                                    firestoreMessages.map((msg: Message) => (
                                        <div key={msg.id} className={`flex gap-3 group ${msg.senderId === user.uid ? 'flex-row-reverse' : ''}`}>
                                            {msg.senderId !== user.uid && (
                                                <Avatar className="h-9 w-9 shrink-0 rounded-[var(--radius-8)] overflow-hidden">
                                                    <AvatarImage src={msg.avatar || getAvatarUrl(msg.senderName)} />
                                                    <AvatarFallback>{msg.senderName?.[0]}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={`flex flex-col gap-1 max-w-[75%] ${msg.senderId === user.uid ? 'items-end' : 'items-start'}`}>
                                                <div className={`flex items-baseline gap-2 ${msg.senderId === user.uid ? 'flex-row-reverse' : ''}`}>
                                                    <span className="text-[length:var(--font-base-size)] font-semibold text-[color:var(--color-text-5)]">{msg.senderId === user.uid ? '我' : msg.senderName}</span>
                                                    <span className="text-[length:var(--font-xs-size)] text-[color:var(--color-text-5)] opacity-0 group-hover:opacity-100 transition-opacity">{msg.timestamp}</span>
                                                </div>

                                                <div className={`relative px-4 py-2 rounded-[var(--radius-12)] text-[length:var(--font-sm-size)] leading-relaxed select-text ${msg.senderId === user.uid
                                                    ? 'bg-[var(--color-blue)] text-white'
                                                    : 'bg-[var(--color-bg-2)] border border-[var(--divider-color)] text-[color:var(--color-text-2)]'
                                                    } transition-all`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="px-5 pb-5 pt-2 shrink-0">
                            <div className="max-w-[77.5rem] mx-auto rounded-[var(--radius-12)] border border-[var(--divider-color)] bg-[var(--color-bg-1)] shadow-[var(--effect-shadow-level-1-box)] p-1.5 focus-within:ring-1 focus-within:ring-[var(--color-blue-active)]/10 transition-all flex flex-col group">
                                <div className="relative flex items-end">
                                    <Textarea
                                        ref={inputRef}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="输入“/”，大象AI帮你..."
                                        className="border-none focus-visible:ring-0 bg-transparent text-[length:var(--font-base-size)] min-h-[44px] px-3 shadow-none h-auto py-2.5 flex-1 pr-12 resize-none overflow-y-auto text-[color:var(--color-text-2)] placeholder:text-[color:var(--color-text-5)]"
                                        rows={1}
                                    />
                                </div>

                                <div className="flex items-center gap-0.5 text-[color:var(--color-text-4)] px-1 pb-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--hover-bg)] transition-colors"><Plus size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--hover-bg)] transition-colors"><Smile size={18} /></Button>
                                    <div className="flex items-center h-8 px-2 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer text-[0.8125rem] font-medium ml-1">
                                        Aa
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--hover-bg)] transition-colors"><ImageIcon size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--hover-bg)] transition-colors"><Paperclip size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--hover-bg)] transition-colors"><Scissors size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--hover-bg)] transition-colors"><VideoIcon size={18} /></Button>
                                    <div className="flex items-center h-8 px-2 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--color-blue-bg-weak)]/50 transition-colors cursor-pointer text-[0.8125rem] font-medium">
                                        ✨
                                    </div>

                                    <div className="ml-auto flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--radius-8)] hover:text-[color:var(--color-blue)] hover:bg-[var(--hover-bg)] transition-colors"><Maximize2 size={16} /></Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleSendMessage}
                                            disabled={!message.trim()}
                                            className={`h-8 w-8 flex items-center justify-center rounded-[var(--radius-8)] transition-all ${message.trim()
                                                ? "text-[color:var(--color-blue)] bg-[var(--color-blue-bg-weak)]"
                                                : "text-[color:var(--color-text-5)] opacity-30"
                                                }`}
                                        >
                                            <SendHorizonal size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-[var(--color-border-a1)] bg-[var(--color-bg-1)] p-8">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black mb-2">修改个人资料</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="flex flex-col items-center gap-4 mb-2">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 border-2 border-[var(--color-border-a1)] shadow-xl">
                                    <AvatarImage src={getAvatarUrl(tempNickname || nickname)} />
                                    <AvatarFallback>{nickname[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <RefreshCw className="w-6 h-6 text-white animate-spin-slow" />
                                </div>
                            </div>
                            <p className="text-[length:var(--font-xs-size)] font-black uppercase tracking-widest text-[color:var(--color-text-5)]">头像随昵称自动生成</p>
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="nickname" className="text-[length:var(--font-xs-size)] font-black uppercase tracking-widest text-[color:var(--color-text-4)] pl-1">新昵称 (菜名推荐)</label>
                            <Input
                                id="nickname"
                                value={tempNickname}
                                onChange={(e) => setTempNickname(e.target.value)}
                                placeholder="起个有意思的菜名..."
                                className="h-12 bg-[var(--color-fill-2)] border-transparent focus-visible:ring-1 focus-visible:ring-[var(--color-blue)] transition-all rounded-xl font-bold"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-xl font-bold">取消</Button>
                        <Button type="submit" onClick={handleUpdateNickname} className="bg-[var(--color-blue)] text-white rounded-xl font-bold px-8 shadow-lg shadow-[var(--color-blue)]/20 transition-all hover:scale-105 active:scale-95">确认修改</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default IMApp;
