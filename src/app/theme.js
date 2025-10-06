// theme.js
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            background: { default: '#d8d8d8' },
          }
        : {
            background: { default: '#121212' },
          }),
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });
