import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';

interface ThemeContextProps {
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'dark',
  toggleColorMode: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as 'light' | 'dark') || 'dark';
  });

  const toggleColorMode = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

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
          primary: {
            main: mode === 'light' ? '#1976d2' : '#42a5f5',
            light: mode === 'light' ? '#42a5f5' : '#64b5f6',
            dark: mode === 'light' ? '#1565c0' : '#1976d2',
            contrastText: '#ffffff',
          },
          secondary: {
            main: mode === 'light' ? '#9c27b0' : '#ba68c8',
            light: mode === 'light' ? '#ba68c8' : '#ce93d8',
            dark: mode === 'light' ? '#7b1fa2' : '#9c27b0',
            contrastText: '#ffffff',
          },
          success: {
            main: mode === 'light' ? '#2e7d32' : '#4caf50',
            light: mode === 'light' ? '#4caf50' : '#66bb6a',
            dark: mode === 'light' ? '#1b5e20' : '#2e7d32',
            contrastText: '#ffffff',
          },
          warning: {
            main: mode === 'light' ? '#ed6c02' : '#ff9800',
            light: mode === 'light' ? '#ff9800' : '#ffb74d',
            dark: mode === 'light' ? '#e65100' : '#ed6c02',
            contrastText: '#ffffff',
          },
          error: {
            main: mode === 'light' ? '#d32f2f' : '#f44336',
            light: mode === 'light' ? '#f44336' : '#e57373',
            dark: mode === 'light' ? '#c62828' : '#d32f2f',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'light' ? '#fafafa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#212121' : '#ffffff',
            secondary: mode === 'light' ? '#757575' : '#b0b0b0',
          },
          divider: mode === 'light' ? '#e0e0e0' : '#424242',
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '2.5rem',
            lineHeight: 1.2,
            fontWeight: 700,
          },
          h2: {
            fontSize: '2rem',
            lineHeight: 1.2,
            fontWeight: 700,
          },
          h3: {
            fontSize: '1.75rem',
            lineHeight: 1.2,
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.5rem',
            lineHeight: 1.2,
            fontWeight: 600,
          },
          h5: {
            fontSize: '1.25rem',
            lineHeight: 1.2,
            fontWeight: 600,
          },
          h6: {
            fontSize: '1.125rem',
            lineHeight: 1.2,
            fontWeight: 600,
          },
          body1: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
          body2: {
            fontSize: '0.8125rem',
            lineHeight: 1.5,
          },
          button: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            fontWeight: 600,
          },
          caption: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
          },
          overline: {
            fontSize: '0.6875rem',
            lineHeight: 1.5,
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
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
