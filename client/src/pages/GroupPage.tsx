// client/src/pages/GroupPage.tsx
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Box, TextField, Button, Typography, Paper, List, ListItemButton, ListItemText, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface GroupPageProps {
  username: string;
  onJoinGroup: (groupName: string) => void;
}

export const GroupPage = ({ username, onJoinGroup }: GroupPageProps) => {
  const { groups, getGroups, logout } = useApp();
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  // 创建和加入现在是同一个动作
  const handleJoinOrCreate = (groupName: string) => {
    if (!groupName.trim()) {
      alert("Group name cannot be empty.");
      return;
    }
    onJoinGroup(groupName);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ padding: 4, width: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Welcome, {username}!</Typography>
          <Button onClick={logout}>Logout</Button>
        </Box>
        <Typography variant="h6">Existing Groups</Typography>
        <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          {Object.keys(groups).length > 0 ? Object.entries(groups).map(([name, members]: [string, string[]]) => (
            <Accordion key={name} TransitionProps={{ unmountOnExit: true }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ flexGrow: 1 }}>{name}</Typography>
                <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); handleJoinOrCreate(name); }}>Join</Button>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" gutterBottom>Members ({members.length}):</Typography>
                <List dense>
                  {Array.isArray(members) && members.map(member => <ListItemText key={member} primary={`- ${member}`} />)}
                </List>
              </AccordionDetails>
            </Accordion>
          )) : <Typography color="textSecondary" sx={{p: 2}}>No groups found. Create one!</Typography>}
        </Box>
        <Divider>OR CREATE NEW</Divider>
        <Box display="flex" gap={2}>
          <TextField label="New Group Name" fullWidth value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
          <Button variant="contained" onClick={() => handleJoinOrCreate(newGroupName)} disabled={!newGroupName}>Create & Join</Button>
        </Box>
      </Paper>
    </Box>
  );
};