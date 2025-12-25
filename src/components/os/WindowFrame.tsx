import React, { useState, memo, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useOS, type WindowState } from '../../store/useOS';
import { clsx } from 'clsx';

interface WindowFrameProps {
    window: WindowState;
    zIndex: number;
    children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = memo(({ window, zIndex, children }) => {
    // Optimized selectors to prevent unnecessary re-renders
    const closeWindow = useOS((state) => state.closeWindow);
    const focusWindow = useOS((state) => state.focusWindow);
    const minimizeWindow = useOS((state) => state.minimizeWindow);
    const maximizeWindow = useOS((state) => state.maximizeWindow);
    const restoreWindow = useOS((state) => state.restoreWindow);
    const updateWindowPosition = useOS((state) => state.updateWindowPosition);
    const updateWindowSize = useOS((state) => state.updateWindowSize);
    const isActive = useOS((state) => state.windowOrder[state.windowOrder.length - 1] === window.id);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: window.id,
        data: { id: window.id, x: window.x, y: window.y },
        disabled: window.isMaximized,
    });

    const [isResizing, setIsResizing] = useState(false);

    const handleResize = useCallback((direction: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsResizing(true);
        const cursor = document.defaultView?.getComputedStyle(e.target as Element).cursor;
        if (cursor) document.body.style.cursor = cursor;

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = window.width;
        const startHeight = window.height;
        const startPosX = window.x;
        const startPosY = window.y;

        const app = useOS.getState().apps[window.appId];
        const minW = app?.minWidth || 300;
        const minH = app?.minHeight || 200;

        const onMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startPosX;
            let newY = startPosY;

            if (direction.includes('e')) newWidth = Math.max(minW, startWidth + deltaX);
            if (direction.includes('s')) newHeight = Math.max(minH, startHeight + deltaY);
            if (direction.includes('w')) {
                const w = Math.max(minW, startWidth - deltaX);
                newWidth = w;
                newX = startPosX + (startWidth - w);
            }
            if (direction.includes('n')) {
                const h = Math.max(minH, startHeight - deltaY);
                newHeight = h;
                newY = startPosY + (startHeight - h);
            }

            if (newWidth !== window.width || newHeight !== window.height) {
                updateWindowSize(window.id, newWidth, newHeight);
            }
            if (newX !== window.x || newY !== window.y) {
                updateWindowPosition(window.id, newX, newY);
            }
        };

        const onMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }, [window, updateWindowPosition, updateWindowSize]);

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        left: window.isMaximized ? 0 : window.x,
        top: window.isMaximized ? 0 : window.y,
        width: window.isMaximized ? '100vw' : window.width,
        height: window.isMaximized ? '100vh' : window.height,
        zIndex,
        position: 'absolute',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                "flex flex-col overflow-hidden transition-all duration-300 ease-out",
                "glass-panel rounded-2xl", // Increased rounding for macOS 26 look
                window.isMaximized && "rounded-none border-0 transition-none",
                window.isMinimized && "opacity-0 pointer-events-none scale-95",
                (isDragging || isResizing) && "scale-[1.005] shadow-2xl cursor-grabbing transition-none" // No opacity change
            )}
            onMouseDown={() => focusWindow(window.id)}
        >
            {/* Title Bar */}
            <div
                {...attributes}
                {...listeners}
                className="h-11 flex items-center px-4 select-none cursor-default relative transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-header)' }}
                onDoubleClick={() => window.isMaximized ? restoreWindow(window.id) : maximizeWindow(window.id)}
            >
                {/* Traffic Lights */}
                <div className={clsx(
                    "flex items-center gap-2 absolute left-4 z-10 group transition-opacity duration-300",
                    !isActive && "opacity-40 grayscale hover:opacity-100 hover:grayscale-0"
                )} onMouseDown={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => closeWindow(window.id)}
                        className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center text-transparent hover:text-black/40 transition-colors"
                    >
                        <X size={8} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => minimizeWindow(window.id)}
                        className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center text-transparent hover:text-black/40 transition-colors"
                    >
                        <Minus size={8} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => window.isMaximized ? restoreWindow(window.id) : maximizeWindow(window.id)}
                        className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center text-transparent hover:text-black/40 transition-colors"
                    >
                        {window.isMaximized ? <Square size={6} strokeWidth={3} /> : <Maximize2 size={6} strokeWidth={3} />}
                    </button>
                </div>

                {/* Title */}
                <div className="flex-1 flex justify-center items-center text-sm font-medium transition-colors duration-300" style={{ color: 'var(--text-secondary)' }}>
                    <span>{useOS(state => state.apps[window.appId]?.title) || window.title}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden backdrop-blur-3xl transition-colors duration-300" style={{ backgroundColor: 'var(--bg-content)' }}>
                {/* Iframe Fix Overlay */}
                {(isDragging || isResizing) && (
                    <div className="absolute inset-0 z-50 bg-transparent" />
                )}
                {children}
            </div>

            {/* Resize Handles */}
            {!window.isMaximized && (
                <>
                    <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize z-20" onMouseDown={handleResize('n')} />
                    <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize z-20" onMouseDown={handleResize('s')} />
                    <div className="absolute top-0 left-0 h-full w-1 cursor-w-resize z-20" onMouseDown={handleResize('w')} />
                    <div className="absolute top-0 right-0 h-full w-1 cursor-e-resize z-20" onMouseDown={handleResize('e')} />

                    <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-30" onMouseDown={handleResize('nw')} />
                    <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-30" onMouseDown={handleResize('ne')} />
                    <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-30" onMouseDown={handleResize('sw')} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-30" onMouseDown={handleResize('se')} />
                </>
            )}
        </div>
    );
});
