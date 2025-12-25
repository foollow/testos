export const translations = {
    'en': {
        system: {
            settings: 'System Settings',
            appearance: 'Appearance',
            components: 'Components',
            system: 'System',
        },
        settings: {
            themeMode: 'Theme Mode',
            darkMode: 'Dark Mode',
            lightMode: 'Light Mode',
            brandColors: 'Brand Colors',
            primaryColor: 'Primary Color',
            secondaryColor: 'Secondary Color',
            typography: 'Typography',
            fontFamily: 'Font Family',
            componentStyling: 'Component Styling',
            fontSize: 'Font Size',
            borderRadius: 'Border Radius',
            shadowStyle: 'Shadow Style',
            language: 'Language',
            systemLanguage: 'System Language',
            selectLanguage: 'Select Language',
            simplerHexTip: '🎨 Tip: Pick a color to instantly update the system theme.',
        }
    },
    'zh-CN': {
        system: {
            settings: '系统设置',
            appearance: '外观',
            components: '组件',
            system: '系统',
        },
        settings: {
            themeMode: '主题模式',
            darkMode: '深色模式',
            lightMode: '浅色模式',
            brandColors: '品牌颜色',
            primaryColor: '主色调',
            secondaryColor: '次色调',
            typography: '字体设置',
            fontFamily: '字体家族',
            componentStyling: '组件样式',
            fontSize: '字体大小',
            borderRadius: '圆角大小',
            shadowStyle: '阴影风格',
            language: '语言',
            systemLanguage: '系统语言',
            selectLanguage: '选择语言',
            simplerHexTip: '🎨 提示：选择颜色即可即时更新系统主题。',
        }
    },
    'zh-TW': {
        system: {
            settings: '系統設置',
            appearance: '外觀',
            components: '組件',
            system: '系統',
        },
        settings: {
            themeMode: '主題模式',
            darkMode: '深色模式',
            lightMode: '淺色模式',
            brandColors: '品牌顏色',
            primaryColor: '主色調',
            secondaryColor: '次色調',
            typography: '字體設置',
            fontFamily: '字體家族',
            componentStyling: '組件樣式',
            fontSize: '字體大小',
            borderRadius: '圓角大小',
            shadowStyle: '陰影風格',
            language: '語言',
            systemLanguage: '系統語言',
            selectLanguage: '選擇語言',
            simplerHexTip: '🎨 提示：選擇顏色即可即時更新系統主題。',
        }
    }
};

export type Language = keyof typeof translations;
