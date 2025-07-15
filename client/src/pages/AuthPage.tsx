// client/src/pages/AuthPage.tsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Box, TextField, Button, Typography, Paper, Tabs, Tab } from '@mui/material';

export const AuthPage = () => {
  const { login, register } = useApp(); // 从 context 获取函数
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState(0);

  const action = tab === 0 ? 'login' : 'register';

  // 我们不再需要在这里监听 onmessage

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ padding: 4, width: 400, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">SDG-Docs</Typography>
        <Tabs value={tab} onChange={(_event, newValue) => setTab(newValue)} centered>
            <Tab label="Login" />
            <Tab label="Register" />
        </Tabs>
        <TextField label="Username" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" size="large" onClick={() => (tab === 0 ? login(username, password) : register(username, password))} disabled={!username || !password}>
          {action === 'login' ? 'Login' : 'Register'}
        </Button>
      </Paper>
    </Box>
  );
};