import React, { useEffect, lazy } from 'react';
import { useOS } from '../../store/useOS';
import { useTranslation } from "@/lib/i18n";
import { WindowManager } from './WindowManager';
import { Dock } from './Dock';
import { TopBar } from './TopBar';
import { Terminal, Settings as SettingsIcon, Calculator as CalculatorIcon, Palette, Globe, MessageSquare, FolderOpen } from 'lucide-react';

// Lazy load apps
const TerminalApp = lazy(() => import('../../apps/Terminal'));
const SettingsApp = lazy(() => import('../../apps/Settings'));
const CalculatorApp = lazy(() => import('../../apps/Calculator'));
const PaintApp = lazy(() => import('../../apps/Paint'));
const SafariApp = lazy(() => import('../../apps/Safari'));
const IMApp = lazy(() => import('../../apps/IM'));
const FilesApp = lazy(() => import('../../apps/Files'));

export const Desktop: React.FC = () => {
    const { registerApp, systemState } = useOS();
    const t = useTranslation(systemState.language);

    useEffect(() => {
        registerApp({
            id: 'terminal',
            title: t.apps.terminal,
            icon: <Terminal size={28} />,
            component: TerminalApp,
        });

        registerApp({
            id: 'safari',
            title: t.apps.safari,
            icon: <Globe size={28} className="text-blue-400" />,
            component: SafariApp,
        });

        registerApp({
            id: 'calculator',
            title: t.apps.calculator,
            icon: <CalculatorIcon size={28} className="text-orange-400" />,
            component: CalculatorApp,
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
        <div className="relative w-full h-screen overflow-hidden select-none bg-[url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/10" /> {/* Overlay */}
            <TopBar />
            <WindowManager />
            <Dock />
        </div>
    );
};
