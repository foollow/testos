import React from 'react';
import { Search } from 'lucide-react';

const StudyCity: React.FC = () => {
    return (
        <div className="flex flex-col h-full w-full bg-[var(--color-bg-2)]">
            {/* Content Area - Centered Search Bar */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-2xl relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-[var(--color-text-5)] group-focus-within:text-[var(--color-blue)] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="在学城中搜索..."
                        className="w-full h-16 pl-14 pr-6 rounded-[var(--radius-16)] bg-[var(--color-bg-1)]
                                 border border-[var(--color-border-1)]
                                 text-xl text-[var(--color-text-2)] placeholder:text-[var(--color-text-6)]
                                 shadow-[var(--effect-shadow-level-1-box)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]/20 focus:border-[var(--color-blue)]/50
                                 transition-all duration-300"
                    />

                    {/* Optional Shortcut Tip */}
                    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex gap-4 text-[length:var(--font-size-14)] text-[var(--color-text-5)]">
                        <span>按 Enter 搜索</span>
                        <span className="opacity-20">|</span>
                        <span>搜索课程、文档或社区</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyCity;
