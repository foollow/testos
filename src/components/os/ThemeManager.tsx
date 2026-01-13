import React, { useEffect } from 'react';
import { useOS } from '../../store/useOS';

export const ThemeManager: React.FC = () => {
    const { theme, themeConfig } = useOS();

    useEffect(() => {
        document.documentElement.className = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // Apply themeConfig to CSS variables
        const root = document.documentElement;
        root.style.setProperty('--primary', `hsl(${themeConfig.primary})`);
        root.style.setProperty('--primary-foreground', '0 0% 100%');
        root.style.setProperty('--radius', `${themeConfig.radius}rem`);
        root.style.setProperty('--font-size', `${themeConfig.fontSize}rem`);

        // Apply global scaling by setting root font-size
        // 16px is standard, so we multiply it by the fontSize config (which is in rem)
        root.style.fontSize = `${themeConfig.fontSize * 16}px`;

        // Also update brand colors if they are used as primary
        // This allows we to use var(--primary) in our components
        root.style.setProperty('--color-blue', `hsl(${themeConfig.primary})`);

    }, [theme, themeConfig]);

    return null;
};
