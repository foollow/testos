import React, { useEffect, lazy } from 'react';
import { useOS } from '../../store/useOS';
import { useTranslation } from "@/lib/i18n";
import { WindowManager } from './WindowManager';
import { Dock } from './Dock';
import { TopBar } from './TopBar';

// Lazy load apps
const SettingsApp = lazy(() => import('../../apps/Settings'));
const SafariApp = lazy(() => import('../../apps/Safari'));
const IMApp = lazy(() => import('../../apps/IM'));
const FilesApp = lazy(() => import('../../apps/Files'));
const StudyCityApp = lazy(() => import('../../apps/StudyCity'));

export const Desktop: React.FC = () => {
    const { registerApp, systemState, theme } = useOS();
    const t = useTranslation(systemState.language);

    // 统一引用一张阳光充足、高明度的白昼雪山全景
    const baseWallpaperUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop";

    useEffect(() => {
        registerApp({
            id: 'safari',
            title: t.apps.safari,
            icon: <img src="https://km.sankuai.com/api/file/cdn/2746924596/221262091308?contentType=1&isNewContent=false" alt="Safari" className="w-full h-full object-contain p-0.5" />,
            component: SafariApp,
        });

        registerApp({
            id: 'files',
            title: t.apps.files,
            icon: <img src="https://km.sankuai.com/api/file/cdn/2746924596/221266056552?contentType=1&isNewContent=false" alt="Files" className="w-full h-full object-contain p-0.5" />,
            component: FilesApp,
        });

        registerApp({
            id: 'im',
            title: t.apps.chat,
            icon: <img src="https://km.sankuai.com/api/file/cdn/2746924596/221267898919?contentType=1&isNewContent=false" alt="IM" className="w-full h-full object-contain p-0.5" />,
            component: IMApp,
            minWidth: 860,
            minHeight: 560,
        });

        registerApp({
            id: 'study-city',
            title: t.apps.studyCity,
            icon: <img src="https://km.sankuai.com/api/file/cdn/2746924596/221270181618?contentType=1&isNewContent=false" alt="StudyCity" className="w-full h-full object-contain p-0.5" />,
            component: StudyCityApp,
        });

        registerApp({
            id: 'settings',
            title: t.apps.settings,
            icon: <img src="https://km.sankuai.com/api/file/cdn/2746924596/221262329409?contentType=1&isNewContent=false" alt="Settings" className="w-full h-full object-contain p-0.5" />,
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
