import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock } from 'lucide-react';

const Safari: React.FC = () => {
    const [url, setUrl] = useState('https://www.apple.com');
    const [inputUrl, setInputUrl] = useState('apple.com');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let target = inputUrl;
        if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        setUrl(target);
    };

    return (
        <div className="h-full w-full flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-content)' }}>
            {/* Toolbar */}
            <div
                className="h-12 border-b flex items-center px-4 gap-4 transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--bg-header)',
                    borderColor: 'var(--border-primary)'
                }}
            >
                <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <button className="p-1 hover:bg-[var(--bg-panel-hover)] rounded transition-colors"><ArrowLeft size={16} /></button>
                    <button className="p-1 hover:bg-[var(--bg-panel-hover)] rounded transition-colors"><ArrowRight size={16} /></button>
                    <button className="p-1 hover:bg-[var(--bg-panel-hover)] rounded transition-colors"><RotateCw size={14} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-50" style={{ color: 'var(--text-secondary)' }}>
                            <Lock size={12} className="mr-1" />
                        </div>
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            className="w-full rounded-lg py-1.5 pl-8 pr-4 text-sm text-center focus:text-left transition-all outline-none"
                            style={{
                                backgroundColor: 'var(--bg-input)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                </form>

                <div className="w-20" /> {/* Spacer for balance */}
            </div>

            {/* Content */}
            <div className="flex-1 relative bg-white">
                <iframe
                    src={url}
                    className="w-full h-full border-0 block"
                    title="Browser View"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                    referrerPolicy="no-referrer"
                />
            </div>
        </div>
    );
};

export default Safari;
