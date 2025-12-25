import React from 'react';
import { useTime } from '../../hooks/useTime';
import { Wifi, Battery, Search, Apple } from 'lucide-react';

export const TopBar: React.FC = () => {
    const time = useTime();

    return (
        <div
            className="fixed top-0 left-0 right-0 h-8 backdrop-blur-xl flex items-center justify-between px-4 z-50 text-sm select-none transition-colors duration-300"
            style={{
                backgroundColor: 'var(--bg-header-transparent)',
                color: 'var(--text-primary)'
            }}
        >
            <div className="flex items-center gap-4">
                <button className="hover:bg-[var(--bg-panel-hover)] p-1 rounded transition-colors">
                    <Apple size={16} fill="currentColor" />
                </button>
                <span className="font-semibold">Finder</span>
                <div className="flex items-center gap-4" style={{ color: 'var(--text-primary)' }}>
                    <span className="hover:bg-[var(--bg-panel-hover)] px-2 py-0.5 rounded transition-colors cursor-default">File</span>
                    <span className="hover:bg-[var(--bg-panel-hover)] px-2 py-0.5 rounded transition-colors cursor-default">Edit</span>
                    <span className="hover:bg-[var(--bg-panel-hover)] px-2 py-0.5 rounded transition-colors cursor-default">View</span>
                    <span className="hover:bg-[var(--bg-panel-hover)] px-2 py-0.5 rounded transition-colors cursor-default">Go</span>
                    <span className="hover:bg-[var(--bg-panel-hover)] px-2 py-0.5 rounded transition-colors cursor-default">Window</span>
                    <span className="hover:bg-[var(--bg-panel-hover)] px-2 py-0.5 rounded transition-colors cursor-default">Help</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                    <Battery size={18} className="opacity-80" />
                    <Wifi size={16} className="opacity-80" />
                    <Search size={16} className="opacity-80" />
                </div>

                <div className="flex items-center gap-2 cursor-default">
                    <span>{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    );
};
