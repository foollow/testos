import React, { useEffect } from 'react';
import { useOS } from '../../store/useOS';

export const ThemeManager: React.FC = () => {
    const { themeConfig, theme } = useOS();

    useEffect(() => {
        const root = document.documentElement;

        // Colors
        if (!themeConfig.primary.includes('(')) {
            root.style.setProperty('--primary', `hsl(${themeConfig.primary})`);
        } else {
            root.style.setProperty('--primary', themeConfig.primary);
        }

        if (!themeConfig.secondary.includes('(')) {
            root.style.setProperty('--secondary', `hsl(${themeConfig.secondary})`);
        } else {
            root.style.setProperty('--secondary', themeConfig.secondary);
        }

        // Radius
        root.style.setProperty('--radius', `${themeConfig.radius}rem`);

        // Font size
        root.style.setProperty('--font-size-base', `${themeConfig.fontSize}px`);
        document.body.style.fontSize = `${themeConfig.fontSize}px`;

        // Font family
        root.style.setProperty('--font-family', themeConfig.fontFamily);
        document.body.style.fontFamily = themeConfig.fontFamily;

        // Spacing (multiplier)
        root.style.setProperty('--spacing-scale', themeConfig.spacing.toString());

        const shadows: Record<string, string> = {
            none: 'none',
            sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
        };
        root.style.setProperty('--shadow-custom', shadows[themeConfig.shadow || 'base']);

    }, [themeConfig, theme]);

    return null;
};
