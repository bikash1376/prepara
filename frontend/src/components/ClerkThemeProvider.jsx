import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { useTheme } from './theme-provider';
 // Make sure this path is correct

export function ClerkThemeProvider({ children, publishableKey }) {
  // Use the theme from your ThemeProvider
  const { theme } = useTheme();


  if (!publishableKey) {
    throw new Error("Missing publishableKey prop in ClerkThemeProvider");
  }
  
  return (
    <ClerkProvider
      // 2. Pass the key down to the underlying ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined
      }}
    >
      {children}
    </ClerkProvider>
  );
}
