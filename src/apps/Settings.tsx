import React from 'react';
import { useOS, type ThemeConfig } from '../store/useOS';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe, Pipette } from 'lucide-react';
import { useTranslation } from "@/lib/i18n";

const PRESET_COLORS = [
    { name: 'Blue', hsl: "212.1 100% 50%" },
    { name: 'Red', hsl: "0 100% 60%" },
    { name: 'Green', hsl: "142.1 76.2% 45.3%" },
    { name: 'Orange', hsl: "24.6 95% 53.1%" },
    { name: 'Purple', hsl: "262.1 83.3% 57.8%" },
];

const hexToHsl = (hex: string): string => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin;
    let h = 0,
        s = 0,
        l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `${h} ${s}% ${l}%`;
};

const hslToHex = (hsl: string): string => {
    try {
        const [hStr, sStr, lStr] = hsl.replace(/%/g, '').split(' ');
        const h = parseFloat(hStr);
        const s = parseFloat(sStr) / 100;
        const l = parseFloat(lStr) / 100;

        const c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - c / 2;
        let r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        const toHex = (n: number) => {
            const hex = n.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return "#" + toHex(r) + toHex(g) + toHex(b);
    } catch (e) {
        return "#000000";
    }
};

const Settings: React.FC = () => {
    const { theme, setTheme, themeConfig, updateThemeConfig, systemState, setLanguage } = useOS();
    const t = useTranslation(systemState.language);

    const handleConfigChange = (key: keyof ThemeConfig, value: any) => {
        updateThemeConfig({ [key]: value });
    };

    return (
        /* 主容器：p-8 (内边距), h-full (高度充满), overflow-y-auto (纵向滚动), space-y-12 (子元素纵向间距) */
        <div className="p-8 pb-12 h-full overflow-y-auto select-none space-y-12">
            <div className="space-y-8 w-full">
                {/* 外观设置区块：glass-panel (毛玻璃效果), p-6 (内边距), rounded-2xl (大圆角) */}
                <section className="glass-panel p-6 rounded-2xl space-y-6">
                    <h2 className="text-xl font-semibold">{t.settings.theme.title}</h2>
                    {/* 亮色/暗色切换网格：grid-cols-1 (移动端单列), sm:grid-cols-2 (平板以上双列) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 亮色模式按钮：transition-all (过渡动画), duration-300 (动画时长) */}
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border-2 transition-all duration-300 ${theme === 'light'
                                ? 'bg-primary/10 border-primary ring-2 ring-primary/20' // 选中态：主题背景色, 主题色边框, 外光晕
                                : 'bg-black/5 dark:bg-white/5 border-transparent hover:bg-black/10 dark:hover:bg-white/10' // 未选中态：浅淡背景, 透明边框
                                }`}
                        >
                            {/* 按钮内的样式预览小圆点 */}
                            <div className="w-3.5 h-3.5 rounded-full bg-white border border-slate-200" />
                            <span className="text-sm font-medium">{t.settings.theme.light}</span>
                        </button>
                        {/* 暗色模式按钮 */}
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border-2 transition-all duration-300 ${theme === 'dark'
                                ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                                : 'bg-black/5 dark:bg-white/5 border-transparent hover:bg-black/10 dark:hover:bg-white/10'
                                }`}
                        >
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800" />
                            <span className="text-sm font-medium">{t.settings.theme.dark}</span>
                        </button>
                    </div>
                </section>

                {/* 品牌色设置区块 */}
                <section className="glass-panel p-6 rounded-2xl space-y-6">
                    <h2 className="text-xl font-semibold">{t.settings.brand.title}</h2>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {/* 颜色选择网格：不同屏幕尺寸下的列数变化 (cols-4 到 cols-10) */}
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => handleConfigChange('primary', color.hsl)}
                                        /* 这里的样式控制：aspect-square (保持正方形), hover:scale-105 (鼠标悬停缩放), active:scale-95 (点击缩停) */
                                        className={`group relative w-10 h-10 aspect-square rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${themeConfig.primary === color.hsl
                                            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 shadow-lg' // 选中时：外环(ring), 偏移量, 阴影
                                            : 'border border-black/5 dark:border-white/10 hover:shadow-md' // 未选中：极淡边框
                                            }`}
                                        style={{ backgroundColor: `hsl(${color.hsl})` }}
                                        title={color.name}
                                    >
                                        {/* 选中的中心指示白点 */}
                                        {themeConfig.primary === color.hsl && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                                {/* 自定义颜色选择器 (吸管图标按钮) */}
                                <div className={`relative w-10 h-10 aspect-square rounded-xl border-2 border-dashed transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 ${!PRESET_COLORS.find(c => c.hsl === themeConfig.primary)
                                    ? 'border-primary bg-primary/5' // 当前是自定义颜色时：虚线边框变为主题色
                                    : 'border-black/10 dark:border-white/10' // 否则：淡色虚线
                                    }`}>
                                    <input
                                        type="color"
                                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0" // 隐藏原生 input，让美化后的 div 接收点击
                                        value={hslToHex(themeConfig.primary)}
                                        onChange={(e) => handleConfigChange('primary', hexToHsl(e.target.value))}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <Pipette size={18} className={!PRESET_COLORS.find(c => c.hsl === themeConfig.primary) ? 'text-primary' : 'opacity-40'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 组件详细样式区块 */}
                <section className="glass-panel p-6 rounded-2xl space-y-8">
                    <h2 className="text-xl font-semibold">{t.settings.components.title}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* 字体大小调整 */}
                        <div className="space-y-4">
                            <Label className="flex justify-between items-center pr-1">
                                <span className="text-sm font-medium opacity-70">{t.settings.components.fontSize}</span>
                                {/* 当前值显示标签：bg-primary/20 (20%透明度的主题色背景), font-mono (等宽字体) */}
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">{themeConfig.fontSize}rem</span>
                            </Label>
                            {/* 滑块背景容器：px-4 py-3 (减少内边距以对齐其他项高度) */}
                            <div className="px-4 py-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 transition-colors duration-300">
                                <Slider
                                    value={[themeConfig.fontSize]}
                                    min={0.75}
                                    max={1.5}
                                    step={0.05}
                                    onValueChange={([val]) => handleConfigChange('fontSize', val)}
                                />
                            </div>
                        </div>

                        {/* 圆角调整 */}
                        <div className="space-y-4">
                            <Label className="flex justify-between items-center pr-1">
                                <span className="text-sm font-medium opacity-70">{t.settings.components.radius}</span>
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">{themeConfig.radius}rem</span>
                            </Label>
                            <div className="px-4 py-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 transition-colors duration-300">
                                <Slider
                                    value={[themeConfig.radius]}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    onValueChange={([val]) => handleConfigChange('radius', val)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 阴影等级选择 */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium opacity-70">{t.settings.components.shadow}</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {(['none', 'sm', 'base', 'lg', 'xl'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleConfigChange('shadow', s)}
                                    /* 阴影按钮：uppercase (大写), tracking-wider (宽字间距) */
                                    className={`py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${themeConfig.shadow === s
                                        ? 'bg-primary/10 text-primary border-primary shadow-lg shadow-primary/20 scale-[1.02] dark:bg-primary dark:text-white' // 选中：加重主题色，放大 1.02 倍
                                        : 'bg-black/5 dark:bg-white/5 border-transparent hover:border-primary/30 hover:bg-primary/5' // 未选中：悬停时边框微亮
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 字体选择下拉框 */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium opacity-70">{t.settings.typography.family}</Label>
                        <Select
                            value={themeConfig.fontFamily}
                            onValueChange={(val) => handleConfigChange('fontFamily', val)}
                        >
                            {/* 下拉触发器样式：h-12 (固定高度), hover:bg-black/10 (悬停加深) */}
                            <SelectTrigger className="h-12 rounded-xl bg-black/5 dark:bg-white/5 border-transparent transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-panel border-white/10">
                                <SelectItem value="Inter">Inter (Default)</SelectItem>
                                <SelectItem value="'Roboto Mono', monospace">Roboto Mono</SelectItem>
                                <SelectItem value="'Outfit', sans-serif">Outfit</SelectItem>
                                <SelectItem value="serif">Times New Roman</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </section>

                {/* 系统设置 */}
                <section className="glass-panel p-6 rounded-2xl space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Globe size={20} className="text-primary" />
                        {t.settings.system.language}
                    </h2>
                    <div className="space-y-4">
                        <Select
                            value={systemState.language}
                            onValueChange={(val: any) => setLanguage(val)}
                        >
                            <SelectTrigger className="h-12 rounded-xl bg-black/5 dark:bg-white/5 border-transparent transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10">
                                <SelectValue placeholder={t.settings.system.placeholder} />
                            </SelectTrigger>
                            <SelectContent className="glass-panel border-white/10">
                                <SelectItem value="zh-CN">简体中文</SelectItem>
                                <SelectItem value="zh-TW">繁體中文</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
