import { Desktop } from './components/os/Desktop';
import { ThemeManager } from './components/os/ThemeManager';
import { useOS } from './store/useOS';
import { useEffect } from 'react';

function App() {
  const { theme } = useOS();

  useEffect(() => {
    // 核心切换逻辑：确保根节点 class 准确
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);

    // 同时应用到 body，以防某些全局样式使用了 body.dark
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);

    console.log('DOM Theme updated:', theme);
  }, [theme]);

  return (
    <div className="h-full w-full">
      <ThemeManager />
      <Desktop />
    </div>
  );
}

export default App;
