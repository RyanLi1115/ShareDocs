// client/src/main.tsx
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './context/AppContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './styles/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </AppProvider>
);