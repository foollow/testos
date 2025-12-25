# Long OS (DragonOS Web)

A high-fidelity Web Desktop Environment built with React 19, Tailwind CSS v4, and Zustand.

## Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit/core
- **Terminal**: xterm.js
- **Icons**: lucide-react

## File Structure

```
src/
├── apps/
│   ├── Settings.tsx       # React 19 Actions Demo
│   └── Terminal.tsx       # xterm.js Integration
├── components/
│   └── os/
│       ├── Desktop.tsx    # Main Layout Entry
│       ├── Taskbar.tsx    # Start Menu, Dock, Tray
│       ├── WindowFrame.tsx # Draggable Window Container
│       └── WindowManager.tsx # DndContext & Window Rendering
├── hooks/
│   └── useTime.ts         # Live Clock Hook
├── store/
│   └── useOS.ts           # Global Kernel Store (Zustand)
├── App.tsx
├── main.tsx
└── index.css              # Global Styles & Tailwind v4 Setup
```

## Features
- **Kernel**: Centralized window and app management.
- **Window Manager**: Draggable windows with z-index stacking and minimization.
- **Terminal**: Functional mock shell with `ls`, `uname`, `help`.
- **Settings**: Demonstrates React 19 `useActionState` for async form handling.
- **Glassmorphism**: Premium visual style using `backdrop-blur-xl`.

## Running
```bash
npm install
npm run dev
```
