import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/theme-provider';
import { ClerkThemeProvider } from './components/ClerkThemeProvider';
import './index.css';
import App from './App.jsx';

// 🔍 Eruda — enable only when needed
if (window.location.search.includes('eruda=true')) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/eruda';
  script.onload = () => {
    window.eruda.init();
  };
  document.body.appendChild(script);
}

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="prepara-ui-theme">
      <ClerkThemeProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkThemeProvider>
    </ThemeProvider>
  </StrictMode>
);