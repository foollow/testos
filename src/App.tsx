import { Desktop } from './components/os/Desktop';
import { ThemeManager } from './components/os/ThemeManager';
import { useOS } from './store/useOS';
import { useEffect } from 'react';

function App() {
  const { theme } = useOS();

  useEffect(() => {
    // Apply theme to body for global styles if needed, or just rely on the wrapper
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // We can also return a wrapper if we want scoped styles
  return (
    <div className={theme}>
      <ThemeManager />
      <Desktop />
    </div>
  );
}

export default App;
