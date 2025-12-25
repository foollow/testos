import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const Terminal: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            theme: {
                background: '#00000000', // Transparent
                foreground: '#ffffff',
            },
            allowTransparency: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        term.writeln('\x1b[1;32mWelcome to Long OS v0.3.0\x1b[0m');
        term.writeln('Type "help" for a list of commands.');
        term.write('\r\n$ ');

        let currentLine = '';

        term.onData((data) => {
            const code = data.charCodeAt(0);

            if (code === 13) { // Enter
                term.write('\r\n');
                handleCommand(currentLine.trim());
                currentLine = '';
                term.write('$ ');
            } else if (code === 127) { // Backspace
                if (currentLine.length > 0) {
                    currentLine = currentLine.slice(0, -1);
                    term.write('\b \b');
                }
            } else {
                currentLine += data;
                term.write(data);
            }
        });

        const handleCommand = (cmd: string) => {
            switch (cmd) {
                case 'help':
                    term.writeln('Available commands:');
                    term.writeln('  ls        List files');
                    term.writeln('  uname -a  Show system info');
                    term.writeln('  clear     Clear terminal');
                    term.writeln('  help      Show this help message');
                    break;
                case 'ls':
                    term.writeln('Documents  Downloads  Music  Pictures  Videos');
                    break;
                case 'uname -a':
                    term.writeln('LongOS v0.3.0 (React 19 Kernel) x86_64 GNU/Linux');
                    break;
                case 'clear':
                    term.clear();
                    break;
                case '':
                    break;
                default:
                    term.writeln(`Command not found: ${cmd}`);
            }
        };

        // Handle resize
        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        // Also fit after a short delay to ensure container is ready
        setTimeout(() => fitAddon.fit(), 100);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
        };
    }, []);

    return (
        <div className="h-full w-full bg-black/80 p-2 overflow-hidden">
            <div ref={terminalRef} className="h-full w-full" />
        </div>
    );
};

export default Terminal;
