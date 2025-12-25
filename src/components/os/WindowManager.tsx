import React, { Suspense, memo } from 'react';
import { DndContext, type DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useOS } from '../../store/useOS';
import { WindowFrame } from './WindowFrame';
import { clsx } from 'clsx';

export const WindowManager: React.FC = memo(() => {
    const windows = useOS((state) => state.windows);
    const windowOrder = useOS((state) => state.windowOrder);
    const updateWindowPosition = useOS((state) => state.updateWindowPosition);
    const apps = useOS((state) => state.apps);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const windowId = active.id as string;
        const windowState = windows[windowId];

        if (windowState) {
            updateWindowPosition(
                windowId,
                windowState.x + delta.x,
                windowState.y + delta.y
            );
        }
    };

    const isAnyMaximized = Object.values(windows).some(w => w.isMaximized);

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className={clsx(
                "fixed inset-0 pointer-events-none",
                isAnyMaximized ? "z-[60]" : "z-10"
            )}>
                {windowOrder.map((id, index) => {
                    const window = windows[id];
                    if (!window) return null;

                    const App = apps[window.appId]?.component;

                    return (
                        <div key={id} className="pointer-events-auto">
                            <WindowFrame window={window} zIndex={10 + index}>
                                <Suspense fallback={
                                    <div className="flex items-center justify-center h-full text-white/50">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                }>
                                    {App && <App windowId={id} />}
                                </Suspense>
                            </WindowFrame>
                        </div>
                    );
                })}
            </div>
        </DndContext>
    );
});
