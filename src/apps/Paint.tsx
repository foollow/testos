import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pencil, Trash2 } from 'lucide-react';

const Paint: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ffff00');
    const [brushSize, setBrushSize] = useState(5);
    const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size to parent size
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = brushSize;

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
        }

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="h-full w-full flex flex-col transition-colors duration-300 bg-[var(--color-bg-1)]">
            {/* Toolbar */}
            <div className="h-12 border-b flex items-center justify-between px-4 transition-colors duration-300 bg-[var(--color-fill-a4)] border-[var(--divider-color)]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 p-1 rounded-lg bg-[var(--color-fill-a2)]">
                        <button
                            onClick={() => setTool('pencil')}
                            className={`p-1.5 rounded transition-colors ${tool === 'pencil' ? 'bg-[var(--color-blue)] text-white shadow-sm' : 'text-[color:var(--color-text-4)] hover:bg-[var(--hover-bg)] hover:text-[color:var(--color-text-2)]'}`}
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={() => setTool('eraser')}
                            className={`p-1.5 rounded transition-colors ${tool === 'eraser' ? 'bg-[var(--color-blue)] text-white shadow-sm' : 'text-[color:var(--color-text-4)] hover:bg-[var(--hover-bg)] hover:text-[color:var(--color-text-2)]'}`}
                        >
                            <Eraser size={18} />
                        </button>
                    </div>

                    <div className="h-6 w-px bg-[var(--divider-color)]" />

                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />

                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-24 accent-[var(--color-blue)]"
                    />
                </div>

                <button
                    onClick={clearCanvas}
                    className="p-1.5 text-[color:var(--color-text-4)] hover:text-[color:var(--color-red)] hover:bg-[var(--color-red-bg-weak)] rounded-lg transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0"
                />
            </div>
        </div>
    );
};

export default Paint;
