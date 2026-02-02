import React from 'react';
import { Search } from 'lucide-react';

const StudyCity: React.FC = () => {
    return (
        <div className="flex flex-col h-full w-full bg-[#f5f5f7] dark:bg-[#1c1c1e]">
            {/* Content Area - Centered Search Bar */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-2xl relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="在学城中搜索..."
                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white dark:bg-black/20 
                                 border border-black/5 dark:border-white/10
                                 text-xl text-slate-800 dark:text-slate-100 placeholder-slate-400
                                 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
                                 transition-all duration-300"
                    />

                    {/* Optional Shortcut Tip */}
                    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex gap-4 text-sm text-slate-400">
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
