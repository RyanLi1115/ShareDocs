// client/src/components/AppHeader.tsx

import { AppBar, Toolbar, Typography, Box, Avatar, Tooltip } from '@mui/material';

// 1. 定义与 App.tsx 一致的用户接口
interface OnlineUser {
  id: number;
  name: string;
  color: string;
}

interface AppHeaderProps {
  onlineUsers: OnlineUser[];
}

const AppHeader = ({ onlineUsers }: AppHeaderProps) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ height: '64px' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 400, fontSize: '22px' }}>
          SDG-Docs
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onlineUsers.map((user) => (
            // 2. 使用 user.id, user.name, 和 user.color
            <Tooltip key={user.id} title={user.name}>
              <Avatar sx={{ bgcolor: user.color, width: 32, height: 32, fontSize: '16px' }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;