import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface ThemeContextProps {
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleColorMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    // Initialize from localStorage on component mount
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as 'light' | 'dark') || 'light';
  });

  const toggleColorMode = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      // Save to localStorage
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  // Sync with localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setMode(savedMode as 'light' | 'dark');
    }
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
