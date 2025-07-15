// client/src/styles/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4285F4', // Google Blue
    },
    background: {
      default: '#F8F9FA', // M3 Surface Container
      paper: '#FFFFFF',   // M3 Surface
    },
    text: {
      primary: '#1F1F1F',   // M3 On Surface
      secondary: '#444746', // M3 On Surface Variant
    },
    divider: '#C4C7C5', // M3 Outline
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 8, // M3 a'da standart köşe yuvarlaklığı
  },
  components: {
    // MuiToggleButton'ın stillerini özelleştirme
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(66, 133, 244, 0.12)', // Primary color with 12% opacity
            color: '#0b57d0',
            '&:hover': {
              backgroundColor: 'rgba(66, 133, 244, 0.16)',
            },
          },
        },
      },
    },
  },
});

export default theme;