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

        // Derive weak background color from primary
        const parts = themeConfig.primary.split(' ');
        if (parts.length >= 2) {
            const h = parts[0];
            const s = parts[1];
            const isDark = theme === 'dark';

            // Light mode: 96% and 92% lightness
            // Dark mode: 15% and 25% lightness (subtle dark versions)
            const weakL = isDark ? '15%' : '96%';
            const hoverL = isDark ? '18%' : '96%';
            const activeL = isDark ? '25%' : '92%';

            root.style.setProperty('--color-blue-bg-weak', `hsl(${h} ${s} ${weakL})`);
            root.style.setProperty('--hover-bg', `hsl(${h} ${s} ${hoverL})`);
            root.style.setProperty('--active-bg', `hsl(${h} ${s} ${activeL})`);
        }

        // Apply shadow config
        const shadowMap = {
            none: 'none',
            sm: 'var(--effect-shadow-level-1-box)',
            base: 'var(--effect-shadow-level-2-box)',
            lg: 'var(--effect-shadow-level-3-box)',
            xl: 'var(--effect-shadow-level-4-box)'
        };
        root.style.setProperty('--app-shadow', shadowMap[themeConfig.shadow || 'base']);
    }, [theme, themeConfig]);

    return null;
};
