import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../context/ThemeContext';

const ThemeToggleButton: React.FC = () => {
  const { mode, toggleColorMode } = useThemeContext();
  return (
    <IconButton
      sx={{
        ml: 2,
        '&:focus': {
          outline: 'none',
        },
        '&:focus-visible': {
          outline: 'none',
        },
        '&.Mui-focusVisible': {
          outline: 'none',
        }
      }}
      onClick={toggleColorMode}
      color="inherit"
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeToggleButton;