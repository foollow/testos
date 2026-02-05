import React from 'react';
import { useTime } from '../../hooks/useTime';
import { Wifi, Battery } from 'lucide-react';
import { useOS } from '../../store/useOS';
import { useTranslation } from "@/lib/i18n";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TopBar: React.FC = () => {
    const time = useTime();
    const { systemState } = useOS();
    const t = useTranslation(systemState.language);

    const activeWindowId = useOS((state) => state.windowOrder[state.windowOrder.length - 1]);
    const activeWindow = useOS((state) => activeWindowId ? state.windows[activeWindowId] : null);
    const activeApp = useOS((state) => activeWindow ? state.apps[activeWindow.appId] : null);

    const activeAppName = activeApp?.title || 'Finder';

    return (
        <div
            className="fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 z-50 text-sm font-medium select-none transition-colors duration-300"
            style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text-white)'
            }}
        >
            <div className="flex items-center gap-1">
                <button className="hover:bg-white/10 dark:hover:bg-black/10 px-2 py-1 rounded transition-colors flex items-center justify-center">
                    <span className="iconfont icon-apple-logo text-[18px] -mt-[2px]" />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="hover:bg-white/10 dark:hover:bg-black/10 px-2 py-0.5 rounded transition-colors cursor-default outline-none">
                            <span className="font-bold">{activeAppName}</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 glass-panel border-none shadow-xl mt-1">
                        <DropdownMenuItem className="focus:bg-primary focus:text-white rounded-md mx-1">
                            {t.apps.about} {activeAppName}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-divider-color opacity-50" />
                        <DropdownMenuItem className="focus:bg-primary focus:text-white rounded-md mx-1">
                            {systemState.language === 'en' ? 'Preferences...' : '偏好设置...'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <Battery size={18} className="opacity-80" />
                    <Wifi size={16} className="opacity-80" />
                    <span className="iconfont icon-message-default opacity-80 text-[16px]" />
                </div>

                <div className="flex items-center gap-2 cursor-default opacity-90">
                    <span>{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    );
};
