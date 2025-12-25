import React, { useState } from 'react';
import { Folder, File, FileText, Image as ImageIcon, Music, Film, ChevronRight, LayoutGrid, List } from 'lucide-react';
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
            case 'folder': return <Folder className="text-blue-500 fill-blue-500/20" size={view === 'grid' ? 48 : 20} />;
            case 'text': return <FileText className="text-gray-500" size={view === 'grid' ? 48 : 20} />;
            case 'image': return <ImageIcon className="text-purple-500" size={view === 'grid' ? 48 : 20} />;
            case 'music': return <Music className="text-pink-500" size={view === 'grid' ? 48 : 20} />;
            case 'video': return <Film className="text-red-500" size={view === 'grid' ? 48 : 20} />;
            default: return <File className="text-gray-400" size={view === 'grid' ? 48 : 20} />;
        }
    };

    return (
        <div className="flex h-full bg-background/80 backdrop-blur-md overflow-hidden text-foreground transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-48 border-r border-border/40 bg-muted/20 p-4 space-y-4 hidden md:block">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">{t.files.sidebar.favorites}</p>
                    <button className="flex items-center gap-2 w-full p-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                        <Folder size={16} /> {t.files.sidebar.airdrop}
                    </button>
                    <button className="flex items-center gap-2 w-full p-2 hover:bg-muted/50 rounded-lg text-sm transition-colors duration-300 text-muted-foreground hover:text-foreground">
                        <LayoutGrid size={16} /> {t.files.sidebar.applications}
                    </button>
                    <button className="flex items-center gap-2 w-full p-2 hover:bg-muted/50 rounded-lg text-sm transition-colors duration-300 text-muted-foreground hover:text-foreground">
                        <FileText size={16} /> {t.files.sidebar.documents}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-14 border-b border-border/40 flex items-center justify-between px-6 bg-muted/10">
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-muted rounded text-muted-foreground">
                            <ChevronRight className="rotate-180" size={18} />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded text-muted-foreground">
                            <ChevronRight size={18} />
                        </button>
                        <h2 className="ml-4 font-semibold text-sm">{t.files.header.allFiles}</h2>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-1.5 rounded-md transition-all duration-300 ${view === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-1.5 rounded-md transition-all duration-300 ${view === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4">
                    <div className={view === 'grid' ? "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4" : "space-y-1"}>
                        {mockFiles.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => setSelectedFile(file)}
                                className={view === 'grid'
                                    ? `flex flex-col items-center p-4 rounded-xl cursor-default group transition-all duration-300 ${selectedFile?.id === file.id ? 'bg-primary/20 ring-1 ring-primary/30' : 'hover:bg-muted/40'}`
                                    : `flex items-center gap-3 p-2 rounded-lg cursor-default group transition-all duration-300 text-sm ${selectedFile?.id === file.id ? 'bg-primary/20' : 'hover:bg-muted/40'}`
                                }
                            >
                                <div className={view === 'grid' ? "mb-3 drop-shadow-lg" : ""}>
                                    {file.type === 'image' && file.thumbnail && view === 'grid' ? (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-border/50">
                                            <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : getIcon(file.type)}
                                </div>
                                <div className={view === 'grid' ? "text-center" : "flex-1 flex items-center justify-between"}>
                                    <p className="text-xs font-medium truncate max-w-[100px]">{file.name}</p>
                                    {view === 'list' && (
                                        <div className="flex items-center gap-8">
                                            <p className="text-[10px] text-muted-foreground w-16">{file.type.toUpperCase()}</p>
                                            <p className="text-[10px] text-muted-foreground w-16 text-right">{file.size || '--'}</p>
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
                <div className="w-72 border-l border-border/40 bg-muted/10 p-6 flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-200">
                    <div className="w-full mb-6">
                        {selectedFile.type === 'image' && selectedFile.thumbnail ? (
                            <img src={selectedFile.thumbnail} className="w-full aspect-video object-cover rounded-xl shadow-xl border border-border/50" alt="Preview" />
                        ) : (
                            <div className="w-full aspect-video bg-muted/40 rounded-xl flex items-center justify-center border border-border/50 border-dashed">
                                {getIcon(selectedFile.type)}
                            </div>
                        )}
                    </div>

                    <h3 className="text-lg font-bold mb-1 truncate w-full">{selectedFile.name}</h3>
                    <p className="text-xs text-muted-foreground mb-6">{selectedFile.type.toUpperCase()} • {selectedFile.size || 'Folder'}</p>

                    <div className="w-full space-y-4">
                        <Button className="w-full rounded-xl">{t.files.preview.open}</Button>
                        {selectedFile.content && (
                            <div className="text-left bg-muted/40 p-3 rounded-lg border border-border/50 max-h-48 overflow-auto">
                                <p className="text-[11px] leading-relaxed font-mono whitespace-pre-wrap text-muted-foreground">
                                    {selectedFile.content}
                                </p>
                            </div>
                        )}
                        {!selectedFile.content && selectedFile.type !== 'image' && (
                            <p className="text-[11px] text-muted-foreground italic">{t.files.preview.noPreview}</p>
                        )}
                    </div>

                    <div className="mt-auto pt-6 w-full text-left space-y-2">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground font-semibold">{t.files.preview.created}</span>
                            <span>Dec 18, 2025</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground font-semibold">{t.files.preview.modified}</span>
                            <span>Just now</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Files;
