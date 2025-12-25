import React, { useState } from 'react';
import { useOS } from '../../store/useOS';
import { useTime } from '../../hooks/useTime';
import { Wifi, Volume2, Battery, Flame, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export const Taskbar: React.FC = () => {
    const { apps, launchApp, windows } = useOS();
    const time = useTime();
    const [isStartOpen, setIsStartOpen] = useState(false);

    // Get unique running apps for the dock indicator
    const runningAppIds = new Set(Object.values(windows).map(w => w.appId));

    return (
        <>
            {/* Taskbar Container */}
            <div className="fixed bottom-0 left-0 right-0 h-12 glass-panel border-t border-white/10 z-50 flex items-center justify-between px-4 select-none">

                {/* Start Button & Widgets */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsStartOpen(!isStartOpen)}
                        className={clsx(
                            "p-2 rounded-md transition-all duration-300 hover:bg-white/10 active:scale-95",
                            isStartOpen && "bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        )}
                    >
                        <Flame className="text-orange-500" size={24} fill="currentColor" />
                    </button>

                    {/* Search Placeholder */}
                    <div className="hidden md:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5 hover:bg-black/30 transition-colors cursor-text">
                        <Search size={14} className="text-white/50" />
                        <span className="text-xs text-white/50">Search Long OS...</span>
                    </div>
                </div>

                {/* Dock / Pinned Apps */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 h-full">
                    {Object.values(apps).map((app) => {
                        const isRunning = runningAppIds.has(app.id);
                        return (
                            <button
                                key={app.id}
                                onClick={() => launchApp(app.id)}
                                className="relative group p-2 rounded-lg hover:bg-white/10 transition-all active:scale-95"
                            >
                                <div className="w-8 h-8 flex items-center justify-center text-white/90 group-hover:scale-110 transition-transform">
                                    {app.icon}
                                </div>
                                {isRunning && (
                                    <motion.div
                                        layoutId="active-app-indicator"
                                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"
                                    />
                                )}

                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                                    {app.title}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* System Tray */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-default">
                        <Wifi size={16} />
                        <Volume2 size={16} />
                        <Battery size={16} />
                    </div>

                    <div className="flex flex-col items-end leading-none px-2 py-1 hover:bg-white/5 rounded-lg transition-colors cursor-default">
                        <span className="text-xs font-medium">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-white/50">
                            {time.toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Start Menu */}
            <AnimatePresence>
                {isStartOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setIsStartOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="fixed bottom-14 left-4 w-80 h-96 glass-panel rounded-xl z-50 p-4 flex flex-col gap-4"
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                                <input
                                    type="text"
                                    placeholder="Type to search..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:bg-black/30 focus:border-white/20 transition-colors"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <h3 className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Pinned</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {Object.values(apps).map(app => (
                                        <button
                                            key={app.id}
                                            onClick={() => {
                                                launchApp(app.id);
                                                setIsStartOpen(false);
                                            }}
                                            className="flex flex-col items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <div className="p-2 bg-white/5 rounded-lg">
                                                {app.icon}
                                            </div>
                                            <span className="text-xs text-center truncate w-full">{app.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                        U
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium">User</span>
                                        <span className="text-[10px] text-white/50">Admin</span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <div className="w-4 h-4 border-2 border-white/50 rounded-full border-t-transparent animate-spin" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
