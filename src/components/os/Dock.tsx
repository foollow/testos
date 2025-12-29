import React from 'react';
import { useOS } from '../../store/useOS';
import { Button } from "@/components/ui/button";

export const Dock: React.FC = () => {
    const { apps, launchApp, windows } = useOS();

    // Get unique running apps for the dock indicator
    const runningAppIds = new Set(Object.values(windows).map((w: any) => w.appId));

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div
                className="flex items-end gap-2 px-4 py-3 backdrop-blur-2xl rounded-2xl shadow-2xl transition-colors duration-300"
                style={{
                    backgroundColor: 'var(--bg-dock)',
                    border: '1px solid var(--border-dock)'
                }}
            >
                {Object.values(apps).map((app: any) => {
                    const isRunning = runningAppIds.has(app.id);
                    return (
                        <div key={app.id} className="relative group">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => launchApp(app.id)}
                                className="w-16 h-12 flex items-center justify-center rounded-xl transition-all duration-300 hover:-translate-y-2 hover:bg-primary/20"
                            >
                                <div className="w-16 h-12 flex items-center justify-center text-2xl">
                                    {app.icon}
                                </div>
                                {isRunning && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </Button>

                            {/* Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-popover text-popover-foreground rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border">
                                {app.title}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
