import { Image as ImageIcon, Music, Film, ChevronRight, LayoutGrid, List, X, Play, FileText } from 'lucide-react';
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
    const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.code === 'Space' && selectedFile) {
            e.preventDefault();
            setPreviewFile(previewFile?.id === selectedFile.id ? null : selectedFile);
        }
        if (e.code === 'Escape') {
            setPreviewFile(null);
        }
    };

    const getIcon = (type: FileItem['type']) => {
        switch (type) {
            case 'folder': return <span className={`iconfont icon-document-actived text-blue-500 ${view === 'grid' ? 'text-[48px]' : 'text-[20px]'}`} />;
            case 'text': return <span className={`iconfont icon-document-default text-gray-500 ${view === 'grid' ? 'text-[48px]' : 'text-[20px]'}`} />;
            case 'image': return <ImageIcon className="text-purple-500" size={view === 'grid' ? 48 : 20} />;
            case 'music': return <Music className="text-pink-500" size={view === 'grid' ? 48 : 20} />;
            case 'video': return <Film className="text-red-500" size={view === 'grid' ? 48 : 20} />;
            default: return <span className={`iconfont icon-document-default text-gray-400 ${view === 'grid' ? 'text-[48px]' : 'text-[20px]'}`} />;
        }
    };

    return (
        <div
            className="flex h-full bg-background/80 backdrop-blur-md overflow-hidden text-foreground transition-colors duration-300 relative focus:outline-none"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {/* Sidebar */}
            <div className="w-48 border-r border-[var(--divider-color)] bg-muted/20 p-4 space-y-4 hidden md:block">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2">{t.files.sidebar.favorites}</p>
                    <button className="flex items-center gap-2 w-full p-2 bg-[var(--active-bg)] text-primary rounded-lg text-sm font-medium">
                        <span className="iconfont icon-document-actived text-[16px]" /> {t.files.sidebar.airdrop}
                    </button>
                    <button className="flex items-center gap-2 w-full p-2 hover:bg-[var(--hover-bg)] rounded-lg text-sm transition-colors duration-300 text-muted-foreground hover:text-foreground">
                        <span className="iconfont icon-workplace-default text-[16px]" /> {t.files.sidebar.applications}
                    </button>
                    <button className="flex items-center gap-2 w-full p-2 hover:bg-[var(--hover-bg)] rounded-lg text-sm transition-colors duration-300 text-muted-foreground hover:text-foreground">
                        <span className="iconfont icon-document-default text-[16px]" /> {t.files.sidebar.documents}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-14 border-b border-[var(--divider-color)] flex items-center justify-between px-6 bg-muted/10">
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-[var(--hover-bg)] rounded text-muted-foreground">
                            <ChevronRight className="rotate-180" size={18} />
                        </button>
                        <button className="p-1.5 hover:bg-[var(--hover-bg)] rounded text-muted-foreground">
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
                                onDoubleClick={() => setPreviewFile(file)}
                                className={view === 'grid'
                                    ? `flex flex-col items-center p-4 rounded-xl cursor-default group transition-all duration-300 ${selectedFile?.id === file.id ? 'bg-[var(--active-bg)] ring-1 ring-primary/30' : 'hover:bg-[var(--hover-bg)]'}`
                                    : `flex items-center gap-3 p-2 rounded-lg cursor-default group transition-all duration-300 text-sm ${selectedFile?.id === file.id ? 'bg-[var(--active-bg)]' : 'hover:bg-[var(--hover-bg)]'}`
                                }
                            >
                                <div className={view === 'grid' ? "mb-3 drop-shadow-lg" : ""}>
                                    {file.type === 'image' && file.thumbnail && view === 'grid' ? (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--divider-color)]">
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

        </div>
    )
}

{/* Quick Look Overlay */ }
{
    previewFile && (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setPreviewFile(null)}
        >
            <div
                className="bg-background/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-[var(--divider-color)] w-[80%] max-w-2xl max-h-[80%] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--divider-color)]">
                    <div className="flex items-center gap-2">
                        {getIcon(previewFile.type)}
                        <span className="text-sm font-semibold">{previewFile.name}</span>
                    </div>
                    <button
                        onClick={() => setPreviewFile(null)}
                        className="p-1 hover:bg-[var(--hover-bg)] rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-muted/5">
                    {previewFile.type === 'image' && (
                        <img src={previewFile.thumbnail} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" alt="Preview" />
                    )}
                    {previewFile.type === 'text' && (
                        <div className="w-full h-full bg-background rounded-lg border border-[var(--divider-color)] p-6 overflow-auto">
                            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
                                {previewFile.content || 'No content available.'}
                            </pre>
                        </div>
                    )}
                    {previewFile.type === 'video' && (
                        <div className="w-full aspect-video bg-black rounded-lg flex flex-col items-center justify-center text-white gap-4">
                            <Play size={48} className="text-white/50" />
                            <p className="text-sm">{t.files.preview.noPreview} (Video Player Simulation)</p>
                        </div>
                    )}
                    {previewFile.type === 'music' && (
                        <div className="w-64 h-64 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex flex-col items-center justify-center border border-primary/20 gap-4 shadow-inner">
                            <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center shadow-lg border border-[var(--divider-color)] animate-spin-slow">
                                <Music size={48} className="text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold">{previewFile.name}</p>
                                <p className="text-[10px] text-muted-foreground">Audio Preview Simulation</p>
                            </div>
                        </div>
                    )}
                    {previewFile.type === 'folder' && (
                        <div className="flex flex-col items-center gap-4">
                            <span className="iconfont icon-document-actived text-[80px] text-blue-500" />
                            <p className="text-sm font-medium">{previewFile.name}</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-muted/20 border-t border-[var(--divider-color)] flex justify-between items-center">
                    <div className="text-[11px] text-muted-foreground">
                        <span className="font-semibold">{t.files.preview.modified}:</span> Just now
                    </div>
                    <Button size="sm" className="rounded-lg h-8 px-4 text-xs" onClick={() => setPreviewFile(null)}>
                        {t.files.preview.open}
                    </Button>
                </div>
            </div>
        </div>
    )
}
        </div >
    );
};

export default Files;
