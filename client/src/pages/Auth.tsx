// client/src/pages/Auth.tsx
import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

interface AuthProps {
  onAuth: (type: 'login' | 'register', username, password) => void;
}

export const AuthPage = ({ onAuth }: AuthProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to SDG-Docs
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" onClick={() => onAuth('login', username, password)}>
            Login
          </Button>
          <Button variant="outlined" onClick={() => onAuth('register', username, password)}>
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};