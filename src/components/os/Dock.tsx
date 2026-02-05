import React, { useRef } from 'react';
import { useOS } from '../../store/useOS';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SCALE_FACTOR = 2.4; // 放大倍率
const BASE_SIZE = 36;     // 基础尺寸
const DISTANCE_THRESHOLD = 150;

const DockIcon = ({ app, isRunning, launchApp, mouseX }: { app: any; isRunning: boolean; launchApp: (id: string) => void; mouseX: any }) => {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // 宽度同步放大，用于占位挤开旁边的图标
    const widthSync = useTransform(
        distance,
        [-DISTANCE_THRESHOLD, 0, DISTANCE_THRESHOLD],
        [BASE_SIZE + 8, (BASE_SIZE + 8) * 1.6, BASE_SIZE + 8]
    );
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 18 });

    // 缩放比例，用于图标本身的视觉放大
    const scaleSync = useTransform(
        distance,
        [-DISTANCE_THRESHOLD, 0, DISTANCE_THRESHOLD],
        [1, SCALE_FACTOR, 1]
    );
    const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 180, damping: 18 });

    return (
        <div className="relative group flex flex-col items-center">
            {/* 占位层：负责水平间距的变化 */}
            <motion.div
                ref={ref}
                style={{ width }}
                onClick={() => launchApp(app.id)}
                className="h-[48px] flex items-center justify-center cursor-pointer relative"
            >
                {/* 视觉层：负责图标放大，向上溢出 Dock */}
                <motion.div
                    style={{
                        scale,
                        width: BASE_SIZE,
                        height: BASE_SIZE,
                        originY: 1 // 固定底部，实现向上放大
                    }}
                    className="flex items-center justify-center text-3xl select-none"
                >
                    {app.icon}
                </motion.div>

                {isRunning && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/90 shadow-sm" />
                )}
            </motion.div>

            {/* Tooltip */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md text-white border border-white/10 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                {app.title}
            </div>
        </div>
    );
};

export const Dock: React.FC = () => {
    const { apps, launchApp, windows } = useOS();
    const mouseX = useMotionValue(Infinity);

    const runningAppIds = new Set(Object.values(windows).map((w: any) => w.appId));

    return (
        <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className="flex items-end px-2 backdrop-blur-3xl rounded-[12px]"
                style={{
                    height: '48px', // 固定高度
                    backgroundColor: 'var(--bg-dock)',
                    border: '0.5px solid var(--border-dock)',
                    boxShadow: 'var(--app-shadow)',
                }}
            >
                {Object.values(apps).map((app: any) => (
                    <DockIcon
                        key={app.id}
                        app={app}
                        isRunning={runningAppIds.has(app.id)}
                        launchApp={launchApp}
                        mouseX={mouseX}
                    />
                ))}
            </motion.div>
        </div>
    );
};
