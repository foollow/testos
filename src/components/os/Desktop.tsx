import React, { useEffect, lazy } from 'react';
import { useOS } from '../../store/useOS';
import { useTranslation } from "@/lib/i18n";
import { WindowManager } from './WindowManager';
import { Dock } from './Dock';
import { TopBar } from './TopBar';
import { Settings as SettingsIcon, Palette, Globe, MessageSquare, FolderOpen } from 'lucide-react';

// Lazy load apps
const SettingsApp = lazy(() => import('../../apps/Settings'));
const PaintApp = lazy(() => import('../../apps/Paint'));
const SafariApp = lazy(() => import('../../apps/Safari'));
const IMApp = lazy(() => import('../../apps/IM'));
const FilesApp = lazy(() => import('../../apps/Files'));

export const Desktop: React.FC = () => {
    const { registerApp, systemState, theme } = useOS();
    const t = useTranslation(systemState.language);

    // 统一引用一张阳光充足、高明度的白昼雪山全景
    const baseWallpaperUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop";

    useEffect(() => {
        registerApp({
            id: 'safari',
            title: t.apps.safari,
            icon: <Globe size={28} className="text-blue-400" />,
            component: SafariApp,
        });

        registerApp({
            id: 'paint',
            title: t.apps.paint,
            icon: <Palette size={28} className="text-purple-400" />,
            component: PaintApp,
        });

        registerApp({
            id: 'files',
            title: t.apps.files,
            icon: <FolderOpen size={28} className="text-yellow-400" />,
            component: FilesApp,
        });

        registerApp({
            id: 'im',
            title: t.apps.chat,
            icon: <MessageSquare size={28} className="text-emerald-400" />,
            component: IMApp,
            minWidth: 860,
            minHeight: 560,
        });

        registerApp({
            id: 'settings',
            title: t.apps.settings,
            icon: <SettingsIcon size={28} className="text-gray-400" />,
            component: SettingsApp,
        });
    }, [registerApp, t]);

    return (
        <div className="relative w-full h-screen overflow-hidden select-none">
            {/* 背景层：独立应用滤镜，不影响上方内容 */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
                style={{
                    backgroundImage: `url('${baseWallpaperUrl}')`,
                    // 深色模式下 programmatically 处理成“夜景”
                    filter: theme === 'dark'
                        ? 'brightness(0.3) contrast(1.1) saturate(0.6) hue-rotate(15deg)'
                        : 'brightness(1.05) contrast(1)'
                }}
            />

            {/* 氛围遮罩：浅色模式增加一点亮度补正，深色模式增加深蓝冷调 */}
            <div className={`absolute inset-0 transition-colors duration-1000 ${theme === 'light' ? 'bg-white/5' : 'bg-blue-950/20'
                }`} />

            {/* 内容层：始终清晰，不受滤镜影响 */}
            <div className="relative z-10 h-full w-full">
                <TopBar />
                <WindowManager />
                <Dock />
            </div>
        </div>
    );
};
