import React, { useEffect, useState } from 'react';
import { Battery } from 'lucide-react';

const BatteryIcon = ({ level, charging, outline = false }: { level: number, charging: boolean, outline?: boolean }) => {
    if (outline) {
        return <Battery size={18} className="opacity-80" />;
    }

    const fillWidth = Math.max(0, Math.min(100, level * 100));
    const isLow = !charging && level <= 0.2;

    return (
        <div className="relative flex items-center">
            <div
                className="relative flex w-[22px] h-[11px] rounded-[3px] border-[1px] border-current opacity-80"
                style={{ padding: '1px', borderColor: 'currentColor' }}
            >
                <div
                    className={`h-full rounded-[1px] ${isLow ? 'bg-red-500' : 'bg-current'} transition-all duration-300`}
                    style={{ width: `${fillWidth}%` }}
                />
            </div>
            {/* Nub */}
            <div className="w-[1.5px] h-[4px] bg-current rounded-r-[2px] opacity-80" />

            {charging && (
                <div className="absolute inset-0 flex items-center justify-center left-[-1px]">
                    {/* Lightning bolt icon */}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-current mix-blend-difference drop-shadow-sm">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export const BatteryStatus: React.FC = () => {
    const [level, setLevel] = useState<number | null>(null);
    const [charging, setCharging] = useState<boolean>(false);
    const [supported, setSupported] = useState<boolean>(true);

    useEffect(() => {
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                setLevel(battery.level);
                setCharging(battery.charging);

                const updateLevel = () => {
                    setLevel(battery.level);
                };
                const updateCharging = () => {
                    setCharging(battery.charging);
                };

                battery.addEventListener('levelchange', updateLevel);
                battery.addEventListener('chargingchange', updateCharging);

                return () => {
                    battery.removeEventListener('levelchange', updateLevel);
                    battery.removeEventListener('chargingchange', updateCharging);
                };
            }).catch(() => {
                setSupported(false);
            });
        } else {
            setSupported(false);
        }
    }, []);

    if (!supported) {
        // Fallback if the browser doesn't support getBattery() API (e.g., Safari, Firefox)
        return (
            <div className="flex items-center gap-1 opacity-80" title="当前浏览器不支持获取物理电池状态">
                <BatteryIcon level={1} charging={false} outline={true} />
            </div>
        );
    }

    if (level === null) return null; // Still loading

    return (
        <div className="flex items-center gap-1.5 opacity-90" title={`电池电量: ${Math.round(level * 100)}%`}>
            <span className="text-[12px] tabular-nums font-medium tracking-wide">
                {Math.round(level * 100)}%
            </span>
            <BatteryIcon level={level} charging={charging} />
        </div>
    );
};
