import React, { useEffect } from 'react';
import { useOS } from '../../store/useOS';

export const ThemeManager: React.FC = () => {
    const { theme } = useOS();

    useEffect(() => {
        // 同步 document root 仅作为备用，核心逻辑已移至 App.tsx 的 .theme-provider
        document.documentElement.className = theme;
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return null;
};
