// client/src/pages/EditorPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import AppHeader from '../components/AppHeader';
import EditorToolbar from '../components/EditorToolbar';
import TiptapEditor from '../components/TiptapEditor';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEditor, Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Underline from '@tiptap/extension-underline';

// 定义用户和 props 的类型
interface OnlineUser {
    name: string;
    color: string;
}

interface EditorPageProps {
  groupName: string;
  username: string;
}

export const EditorPage = ({ groupName, username }: EditorPageProps) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  
  // 使用 useMemo 来创建和缓存 ydoc, provider, 和 editor 实例
  // 它们只会在 groupName 或 username 改变时重新创建
  const editor = useMemo(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', groupName, ydoc);
    const userColor = ['#F44336', '#9C27B0', '#3F51B5', '#03A9F4'][Math.floor(Math.random() * 4)];
    const currentUser = { name: username, color: userColor };

    provider.awareness.setLocalStateField('user', currentUser);

    const editorInstance = new Editor({
        extensions: [
            StarterKit.configure({ history: false }),
            Underline,
            Collaboration.configure({ document: ydoc }),
            CollaborationCursor.configure({ provider: provider, user: currentUser }),
        ],
    });

    const awareness = provider.awareness;
    const updateUsers = () => {
        const users = Array.from(awareness.getStates().values()).map(state => state.user);
        setOnlineUsers(users.filter(Boolean) as OnlineUser[]);
    };

    awareness.on('change', updateUsers);
    updateUsers(); // 立即获取一次

    // 返回 editor 实例和清理函数
    return {
        instance: editorInstance,
        cleanup: () => {
            awareness.off('change', updateUsers);
            provider.destroy();
            editorInstance.destroy();
        }
    };
  }, [groupName, username]);

  // 使用 useEffect 来处理组件卸载时的清理工作
  useEffect(() => {
    return () => {
        editor.cleanup();
    };
  }, [editor]);

  if (!editor.instance) {
      return <Typography>Loading Editor...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader onlineUsers={onlineUsers.filter(u => u.name !== username)} />
      <EditorToolbar editor={editor.instance} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'background.default', padding: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ width: '816px', minHeight: '1122px', padding: { xs: 4, sm: 8, md: 12 }, flexShrink: 0 }}>
          <TiptapEditor editor={editor.instance} />
        </Paper>
      </Box>
    </Box>
  );
};