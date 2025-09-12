import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/theme-provider';
import { ClerkThemeProvider } from './components/ClerkThemeProvider'; // Import the new wrapper
import './index.css';
import App from './App.jsx';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 1. ThemeProvider is now the outermost provider */}
    <ThemeProvider defaultTheme="system" storageKey="testsat-ui-theme">
      {/* 2. ClerkThemeProvider sits inside, so it can access the theme */}
      <ClerkThemeProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkThemeProvider>
    </ThemeProvider>
  </StrictMode>,
);
