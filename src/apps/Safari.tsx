import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Shield, ShieldOff } from 'lucide-react';
import { useOS } from '../store/useOS';

interface SafariProps {
    url?: string;
}

const Safari: React.FC<SafariProps> = ({ url: propUrl }) => {
    const { systemState } = useOS();
    const [url, setUrl] = useState(propUrl || 'https://en.wikipedia.org/wiki/Main_Page');
    const [inputUrl, setInputUrl] = useState(propUrl ? propUrl.replace(/^https?:\/\//, '') : 'wikipedia.org');
    const [useProxy, setUseProxy] = useState(true);

    React.useEffect(() => {
        console.log("Safari: useEffect triggered with url prop:", propUrl);
        if (propUrl) {
            console.log("Safari: Setting internal url state to:", propUrl);
            setUrl(propUrl);
            setInputUrl(propUrl.replace(/^https?:\/\//, ''));
        }
    }, [propUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let target = inputUrl.trim();
        if (!target) return;

        // Handle common shortcuts like 'google.com'
        if (!target.includes('.') && !target.startsWith('http')) {
            target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
        } else if (!target.startsWith('http')) {
            target = 'https://' + target;
        }

        setUrl(target);
        if (target.startsWith('https://') || target.startsWith('http://')) {
            setInputUrl(target.replace(/^https?:\/\//, ''));
        }
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
                    <button className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"><ArrowLeft size={16} /></button>
                    <button className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"><ArrowRight size={16} /></button>
                    <button className="p-1 hover:bg-[var(--hover-bg)] rounded transition-colors"><RotateCw size={14} /></button>
                    <button
                        onClick={() => setUseProxy(!useProxy)}
                        className={`p-1 rounded transition-colors ${useProxy ? 'text-primary' : 'opacity-40'}`}
                        title={useProxy ? "Proxy Enabled" : "Proxy Disabled"}
                    >
                        {useProxy ? <Shield size={16} /> : <ShieldOff size={16} />}
                    </button>
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
                    src={useProxy && url.startsWith('http') ? `${systemState.proxyUrl}${encodeURIComponent(url)}` : url}
                    className="w-full h-full border-0 block bg-white"
                    title="Browser View"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                    referrerPolicy="no-referrer"
                />
            </div>
        </div>
    );
};

export default Safari;
