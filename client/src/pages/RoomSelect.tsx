// client/src/pages/RoomSelect.tsx
import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

interface RoomSelectProps {
  username: string;
  onJoinRoom: (roomName: string) => void;
}

export const RoomSelectPage = ({ username, onJoinRoom }: RoomSelectProps) => {
  const [roomName, setRoomName] = useState('default-room');

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} sx={{ padding: 4, width: 400, textAlign: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Hello, {username}!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Enter a room name to join or create a collaborative document.
        </Typography>
        <TextField
          label="Room Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => onJoinRoom(roomName)}
        >
          Join Room
        </Button>
      </Paper>
    </Box>
  );
};