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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe } from 'lucide-react';
import { useTranslation } from "@/lib/i18n";

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

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - c / 2,
            r = 0,
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
        <div className="p-8 h-full overflow-y-auto select-none">
            <h1 className="text-3xl font-bold mb-8 tracking-tight">{t.settings.title}</h1>

            <Tabs defaultValue="appearance" className="w-full max-w-2xl">
                <TabsList className="mb-8 p-1 bg-muted/60 rounded-xl backdrop-blur-md">
                    <TabsTrigger value="appearance" className="rounded-lg">{t.settings.tabs.appearance}</TabsTrigger>
                    <TabsTrigger value="components" className="rounded-lg">{t.settings.tabs.components}</TabsTrigger>
                    <TabsTrigger value="system" className="rounded-lg">{t.settings.tabs.system}</TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <section className="glass-panel p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-semibold">{t.settings.theme.title}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${theme === 'dark'
                                    ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                                    : 'border-white/5 hover:bg-white/5'
                                    }`}
                            >
                                <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-800" />
                                <span className="font-medium">{t.settings.theme.dark}</span>
                            </button>
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${theme === 'light'
                                    ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                                    : 'border-black/5 hover:bg-black/5'
                                    }`}
                            >
                                <div className="w-4 h-4 rounded-full bg-white border border-slate-200" />
                                <span className="font-medium">{t.settings.theme.light}</span>
                            </button>
                        </div>
                    </section>

                    <section className="glass-panel p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-semibold">{t.settings.brand.title}</h2>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-sm font-medium opacity-70">{t.settings.brand.primary}</Label>
                                <div className="flex gap-4 items-center">
                                    <div className="relative w-12 h-12 rounded-xl shrink-0 overflow-hidden border border-white/10 shadow-sm transition-transform active:scale-95">
                                        <input
                                            type="color"
                                            className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none bg-transparent p-0 m-0"
                                            value={hslToHex(themeConfig.primary)}
                                            onChange={(e) => handleConfigChange('primary', hexToHsl(e.target.value))}
                                        />
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {t.settings.brand.desc_primary}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-medium opacity-70">{t.settings.brand.secondary}</Label>
                                <div className="flex gap-4 items-center">
                                    <div className="relative w-12 h-12 rounded-xl shrink-0 overflow-hidden border border-white/10 shadow-sm transition-transform active:scale-95">
                                        <input
                                            type="color"
                                            className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer border-none bg-transparent p-0 m-0"
                                            value={hslToHex(themeConfig.secondary)}
                                            onChange={(e) => handleConfigChange('secondary', hexToHsl(e.target.value))}
                                        />
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {t.settings.brand.desc_secondary}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="glass-panel p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-semibold">{t.settings.typography.title}</h2>
                        <div className="space-y-4">
                            <Label className="text-sm font-medium opacity-70">{t.settings.typography.family}</Label>
                            <Select
                                value={themeConfig.fontFamily}
                                onValueChange={(val) => handleConfigChange('fontFamily', val)}
                            >
                                <SelectTrigger className="rounded-lg bg-black/5 border-white/10 transition-colors duration-300">
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
                </TabsContent>

                <TabsContent value="components" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <section className="glass-panel p-6 rounded-2xl space-y-8">
                        <h2 className="text-xl font-semibold">{t.settings.components.title}</h2>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <Label className="flex justify-between items-center pr-1">
                                    <span className="text-sm font-medium opacity-70">{t.settings.components.fontSize}</span>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{themeConfig.fontSize}px</span>
                                </Label>
                                <Slider
                                    value={[themeConfig.fontSize]}
                                    min={12}
                                    max={24}
                                    step={1}
                                    onValueChange={([val]) => handleConfigChange('fontSize', val)}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="flex justify-between items-center pr-1">
                                    <span className="text-sm font-medium opacity-70">{t.settings.components.radius}</span>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{themeConfig.radius}rem</span>
                                </Label>
                                <Slider
                                    value={[themeConfig.radius]}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    onValueChange={([val]) => handleConfigChange('radius', val)}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-medium opacity-70">{t.settings.components.shadow}</Label>
                                <div className="grid grid-cols-5 gap-2">
                                    {(['none', 'sm', 'base', 'lg', 'xl'] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleConfigChange('shadow', s)}
                                            className={`py-2 rounded-lg border text-xs font-medium transition-all duration-300 ${themeConfig.shadow === s
                                                ? 'bg-primary text-primary-white border-primary'
                                                : 'bg-black/5 border-white/10 hover:bg-primary/10'
                                                }`}
                                        >
                                            {s.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </TabsContent>

                <TabsContent value="system" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <section className="glass-panel p-6 rounded-2xl space-y-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Globe size={20} />
                            {t.settings.system.language}
                        </h2>
                        <div className="space-y-4">
                            <Label className="text-sm font-medium opacity-70">{t.settings.system.sysLanguage}</Label>
                            <Select
                                value={systemState.language}
                                onValueChange={(val: any) => setLanguage(val)}
                            >
                                <SelectTrigger className="rounded-lg bg-black/5 border-white/10 transition-colors duration-300">
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
                </TabsContent>
            </Tabs>

            <div className="mt-12 text-xs text-secondary-foreground bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p>{t.settings.tip}</p>
            </div>
        </div>
    );
};

export default Settings;
