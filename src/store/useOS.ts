import { create } from 'zustand';
import { type ReactNode, type ComponentType, type LazyExoticComponent } from 'react';

export interface App {
    id: string;
    title: string;
    icon: ReactNode;
    component: LazyExoticComponent<any> | ComponentType<any>;
    minWidth?: number;
    minHeight?: number;
}

export interface WindowState {
    id: string;
    appId: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isMinimized: boolean;
    isMaximized: boolean;
}

interface SystemState {
    cpuUsage: number;
    memoryUsage: number;
    volume: number;
    wifi: boolean;
    language: 'zh-CN' | 'zh-TW' | 'en';
}

export interface ThemeConfig {
    primary: string; // HSL string: "H S% L%"
    secondary: string;
    radius: number;
    fontSize: number;
    fontFamily: string;
    shadow: 'none' | 'sm' | 'base' | 'lg' | 'xl';
    spacing: number;
}

interface OSState {
    apps: Record<string, App>;
    windows: Record<string, WindowState>;
    windowOrder: string[]; // Array of window IDs, last is on top
    systemState: SystemState;
    theme: 'dark' | 'light';
    themeConfig: ThemeConfig;

    registerApp: (app: App) => void;
    launchApp: (appId: string) => void;
    closeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    updateWindowPosition: (id: string, x: number, y: number) => void;
    updateWindowSize: (id: string, width: number, height: number) => void;
    setTheme: (theme: 'dark' | 'light') => void;
    setLanguage: (language: 'zh-CN' | 'zh-TW' | 'en') => void;
    updateThemeConfig: (config: Partial<ThemeConfig>) => void;
}

export const useOS = create<OSState>((set, get) => ({
    apps: {},
    windows: {},
    windowOrder: [],
    theme: 'dark',
    themeConfig: {
        primary: "262.1 83.3% 57.8%", // Default purple
        secondary: "262.1 40% 90%",
        radius: 0.5,
        fontSize: 16,
        fontFamily: 'Inter',
        shadow: 'base',
        spacing: 1,
    },
    systemState: {
        cpuUsage: 12,
        memoryUsage: 34,
        volume: 80,
        wifi: true,
        language: 'zh-CN',
    },

    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set((state) => ({
        systemState: { ...state.systemState, language }
    })),
    updateThemeConfig: (newConfig) => set((state) => ({
        themeConfig: { ...state.themeConfig, ...newConfig }
    })),

    registerApp: (app) => set((state) => ({
        apps: { ...state.apps, [app.id]: app }
    })),

    launchApp: (appId) => {
        const { apps, windows, windowOrder, focusWindow } = get();

        // Check if app is already running
        const existingWindow = Object.values(windows).find(w => w.appId === appId);
        if (existingWindow) {
            focusWindow(existingWindow.id);
            return;
        }

        const app = apps[appId];
        if (!app) return;

        const id = `${appId}-${Date.now()}`;

        // Respect app's minimum dimensions
        const width = Math.max(app.minWidth || 300, 800);
        const height = Math.max(app.minHeight || 200, 600);

        // Center the window with some randomness
        const x = (window.innerWidth - width) / 2 + (Math.random() * 40 - 20);
        const y = (window.innerHeight - height) / 2 + (Math.random() * 40 - 20);

        const newWindow: WindowState = {
            id,
            appId,
            title: app.title,
            x,
            y,
            width,
            height,
            isMinimized: false,
            isMaximized: false,
        };

        set({
            windows: { ...windows, [id]: newWindow },
            windowOrder: [...windowOrder, id],
        });
    },

    closeWindow: (id) => set((state) => {
        const { [id]: _, ...remainingWindows } = state.windows;
        return {
            windows: remainingWindows,
            windowOrder: state.windowOrder.filter((wId) => wId !== id),
        };
    }),

    focusWindow: (id) => set((state) => {
        if (!state.windows[id]) return {};

        const isLast = state.windowOrder[state.windowOrder.length - 1] === id;
        const isMinimized = state.windows[id]?.isMinimized;

        if (isLast && !isMinimized) return {};

        return {
            windowOrder: isLast ? state.windowOrder : [...state.windowOrder.filter((wId) => wId !== id), id],
            windows: {
                ...state.windows,
                [id]: { ...state.windows[id], isMinimized: false }
            }
        };
    }),

    minimizeWindow: (id) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMinimized: true }
        }
    })),

    maximizeWindow: (id) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMaximized: true }
        }
    })),

    restoreWindow: (id) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], isMaximized: false, isMinimized: false }
        }
    })),

    updateWindowPosition: (id, x, y) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], x, y }
        }
    })),

    updateWindowSize: (id, width, height) => set((state) => ({
        windows: {
            ...state.windows,
            [id]: { ...state.windows[id], width, height }
        }
    })),
}));
