// client/src/main.tsx
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)