
import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  // Add resolvedTheme to match what's used in App.tsx
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  
  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme,
  };
}
