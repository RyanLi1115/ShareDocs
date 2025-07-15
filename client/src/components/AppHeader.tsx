// client/src/components/AppHeader.tsx
import { AppBar, Toolbar, Typography, Box, Avatar, Tooltip } from '@mui/material';

export default function AppHeader({ onlineUsers }) {
    return (
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar sx={{ height: '64px' }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>SDG-Docs</Typography>
                <Box display="flex" gap={1}>
                    {onlineUsers.map(user => (
                        <Tooltip key={user.name} title={user.name}>
                            <Avatar sx={{ bgcolor: user.color, width: 32, height: 32 }}>
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                        </Tooltip>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}