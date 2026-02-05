import React, { useState } from 'react';
import { Image as ImageIcon, Music, Film, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useOS } from "@/store/useOS";

interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'text' | 'image' | 'music' | 'video';
    size?: string;
    content?: string;
    thumbnail?: string;
}

const mockFiles: FileItem[] = [
    { id: '1', name: 'Documents', type: 'folder' },
    { id: '2', name: 'Pictures', type: 'folder' },
    { id: '3', name: 'Music', type: 'folder' },
    { id: '4', name: 'Project_Design.txt', type: 'text', size: '1.2 KB', content: 'This is a sample project design document.\n\nKey features:\n- Modern UI\n- Dynamic Themes\n- High Performance\n- Responsive Layout' },
    { id: '5', name: 'Wallpaper.jpg', type: 'image', size: '3.5 MB', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
    { id: '6', name: 'Meeting_Notes.txt', type: 'text', size: '856 B', content: 'Agenda for next week:\n1. Update primary colors\n2. Fix border radius logic\n3. Add file preview feature' },
    { id: '7', name: 'Intro_Video.mp4', type: 'video', size: '42 MB' },
    { id: '8', name: 'Theme_Song.mp3', type: 'music', size: '4.8 MB' },
];

const Files: React.FC = () => {
    const { systemState } = useOS();
    const t = useTranslation(systemState.language);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

    const getIcon = (type: FileItem['type']) => {
        switch (type) {
            case 'folder': return <span className={`iconfont icon-document-actived text-[var(--color-blue)] ${view === 'grid' ? 'text-[var(--font-size-48)]' : 'text-[var(--font-size-20)]'}`} />;
            case 'text': return <span className={`iconfont icon-document-default text-[var(--color-text-5)] ${view === 'grid' ? 'text-[var(--font-size-48)]' : 'text-[var(--font-size-20)]'}`} />;
            case 'image': return <ImageIcon className="text-[var(--color-purple)]" size={view === 'grid' ? 48 : 20} />;
            case 'music': return <Music className="text-[var(--color-hotpink)]" size={view === 'grid' ? 48 : 20} />;
            case 'video': return <Film className="text-[var(--color-red)]" size={view === 'grid' ? 48 : 20} />;
            default: return <span className={`iconfont icon-document-default text-[var(--color-text-6)] ${view === 'grid' ? 'text-[var(--font-size-48)]' : 'text-[var(--font-size-20)]'}`} />;
        }
    };

    return (
        <div className="flex h-full bg-[var(--color-bg-1)]/80 backdrop-blur-md overflow-hidden text-[var(--color-text-2)] transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-48 border-r border-[var(--divider-color)] bg-[var(--color-fill-a2)] p-4 space-y-4 hidden md:block">
                <div className="space-y-1">
                    <p className="text-[length:var(--font-size-10)] font-bold text-[var(--color-text-5)] uppercase tracking-wider px-2">{t.files.sidebar.favorites}</p>
                    <button className="flex items-center gap-2 w-full p-2 bg-[var(--active-bg)] text-[var(--color-blue)] rounded-[var(--radius-8)] text-sm font-medium">
                        <span className="iconfont icon-document-actived text-[var(--font-size-16)]" /> {t.files.sidebar.airdrop}
                    </button>
                    <button className="flex items-center gap-2 w-full p-2 hover:bg-[var(--hover-bg)] rounded-[var(--radius-8)] text-sm transition-colors duration-300 text-[var(--color-text-4)] hover:text-[var(--color-text-2)]">
                        <span className="iconfont icon-workplace-default text-[var(--font-size-16)]" /> {t.files.sidebar.applications}
                    </button>
                    <button className="flex items-center gap-2 w-full p-2 hover:bg-[var(--hover-bg)] rounded-[var(--radius-8)] text-sm transition-colors duration-300 text-[var(--color-text-4)] hover:text-[var(--color-text-2)]">
                        <span className="iconfont icon-document-default text-[var(--font-size-16)]" /> {t.files.sidebar.documents}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-14 border-b border-[var(--divider-color)] flex items-center justify-between px-6 bg-[var(--color-fill-a2)]">
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-[var(--hover-bg)] rounded text-[var(--color-text-4)]">
                            <ChevronRight className="rotate-180" size={18} />
                        </button>
                        <button className="p-1.5 hover:bg-[var(--hover-bg)] rounded text-[var(--color-text-4)]">
                            <ChevronRight size={18} />
                        </button>
                        <h2 className="ml-4 font-semibold text-sm">{t.files.header.allFiles}</h2>
                    </div>
                    <div className="flex items-center gap-2 bg-[var(--color-fill-a3)] p-1 rounded-[var(--radius-8)]">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-1.5 rounded-md transition-all duration-300 ${view === 'grid' ? 'bg-[var(--color-bg-1)] shadow-[var(--effect-shadow-level-1-box)]' : 'text-[var(--color-text-4)] hover:text-[var(--color-text-2)]'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-1.5 rounded-md transition-all duration-300 ${view === 'list' ? 'bg-[var(--color-bg-1)] shadow-[var(--effect-shadow-level-1-box)]' : 'text-[var(--color-text-4)] hover:text-[var(--color-text-2)]'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 text-[var(--color-text-2)]">
                    <div className={view === 'grid' ? "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4" : "space-y-1"}>
                        {mockFiles.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => setSelectedFile(file)}
                                className={view === 'grid'
                                    ? `flex flex-col items-center p-4 rounded-[var(--radius-12)] cursor-default group transition-all duration-300 ${selectedFile?.id === file.id ? 'bg-[var(--active-bg)] ring-1 ring-[var(--color-blue)]/30' : 'hover:bg-[var(--hover-bg)]'}`
                                    : `flex items-center gap-3 p-2 rounded-[var(--radius-8)] cursor-default group transition-all duration-300 text-sm ${selectedFile?.id === file.id ? 'bg-[var(--active-bg)]' : 'hover:bg-[var(--hover-bg)]'}`
                                }
                            >
                                <div className={view === 'grid' ? "mb-3 drop-shadow-lg" : ""}>
                                    {file.type === 'image' && file.thumbnail && view === 'grid' ? (
                                        <div className="w-12 h-12 rounded-[var(--radius-8)] overflow-hidden border border-[var(--divider-color)]">
                                            <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : getIcon(file.type)}
                                </div>
                                <div className={view === 'grid' ? "text-center" : "flex-1 flex items-center justify-between"}>
                                    <p className="text-[length:var(--font-size-12)] font-medium truncate max-w-[100px]">{file.name}</p>
                                    {view === 'list' && (
                                        <div className="flex items-center gap-8">
                                            <p className="text-[length:var(--font-size-10)] text-[var(--color-text-5)] w-16">{file.type.toUpperCase()}</p>
                                            <p className="text-[length:var(--font-size-10)] text-[var(--color-text-5)] w-16 text-right">{file.size || '--'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview Pane (Inspector) */}
            {selectedFile && (
                <div className="w-72 border-l border-[var(--divider-color)] bg-[var(--color-fill-a2)] p-6 flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-200">
                    <div className="w-full mb-6">
                        {selectedFile.type === 'image' && selectedFile.thumbnail ? (
                            <img src={selectedFile.thumbnail} className="w-full aspect-video object-cover rounded-[var(--radius-12)] shadow-[var(--effect-shadow-level-2-box)] border border-[var(--divider-color)]" alt="Preview" />
                        ) : (
                            <div className="w-full aspect-video bg-[var(--color-fill-a3)] rounded-[var(--radius-12)] flex items-center justify-center border border-[var(--divider-color)] border-dashed">
                                {getIcon(selectedFile.type)}
                            </div>
                        )}
                    </div>

                    <h3 className="font-bold mb-1 truncate w-full text-[length:var(--font-size-18)]">{selectedFile.name}</h3>
                    <p className="text-[length:var(--font-size-12)] text-[var(--color-text-5)] mb-6">{selectedFile.type.toUpperCase()} • {selectedFile.size || 'Folder'}</p>

                    <div className="w-full space-y-4">
                        <Button className="w-full rounded-[var(--radius-12)]">{t.files.preview.open}</Button>
                        {selectedFile.content && (
                            <div className="text-left bg-[var(--color-fill-a2)] p-3 rounded-[var(--radius-8)] border border-[var(--divider-color)] max-h-48 overflow-auto">
                                <p className="text-[length:var(--font-size-10)] leading-relaxed font-mono whitespace-pre-wrap text-[var(--color-text-4)]">
                                    {selectedFile.content}
                                </p>
                            </div>
                        )}
                        {!selectedFile.content && selectedFile.type !== 'image' && (
                            <p className="text-[length:var(--font-size-10)] text-[var(--color-text-5)] italic">{t.files.preview.noPreview}</p>
                        )}
                    </div>

                    <div className="mt-auto pt-6 w-full text-left space-y-2">
                        <div className="flex justify-between text-[length:var(--font-size-10)]">
                            <span className="text-[var(--color-text-5)] font-semibold">{t.files.preview.created}</span>
                            <span>Dec 18, 2025</span>
                        </div>
                        <div className="flex justify-between text-[length:var(--font-size-10)]">
                            <span className="text-[var(--color-text-5)] font-semibold">{t.files.preview.modified}</span>
                            <span>Just now</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Files;
