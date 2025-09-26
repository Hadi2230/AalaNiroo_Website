import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress React DevTools warning in development
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('Download the React DevTools')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(<App />);
