// client/src/App.tsx (最终、完整、稳定版 V2)

import { useState, useEffect } from 'react';
import { Box, CssBaseline, Paper } from '@mui/material';
import AppHeader from './components/AppHeader';
import EditorToolbar from './components/EditorToolbar';
import TiptapEditor from './components/TiptapEditor';
import './styles/editor.css';

import { ydoc, provider } from './lib/yjs';

// TipTap and Y.js imports
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';

// 1. 定义统一的用户接口
interface OnlineUser {
  id: number;
  name: string;
  color: string;
}

// Helper functions for user simulation
const userColors = ['#F44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A', '#FFC107', '#FF5722'];
const userNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Peyton'];
const getRandomElement = (list: string[]) => list[Math.floor(Math.random() * list.length)];

// 2. 创建当前用户时，也遵循这个接口 (id 是 Y.js 内部的 clientID，会自动分配)
const currentUser = {
  name: getRandomElement(userNames),
  color: getRandomElement(userColors),
};

function App() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: true, autolink: true }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider: provider,
        user: currentUser,
      }),
    ],
    editorProps: {
        attributes: {
          class: 'prosemirror',
        },
      },
  });

  // 这个 useEffect 现在会生成正确格式的用户列表
  useEffect(() => {
    if (!provider) return;
    const awareness = provider.awareness;

    const updateUsers = () => {
      // awareness.getStates() 返回一个 Map(clientID => state)
      const states = Array.from(awareness.getStates().entries());
      const users: OnlineUser[] = states
        // 3. 将 [clientID, state] 映射为 { id, name, color } 的标准格式
        .map(([clientID, state]) => ({
          id: clientID,
          name: state.user?.name || 'Anonymous', // 添加默认值以防万一
          color: state.user?.color || '#000000',
        }));
      setOnlineUsers(users);
    };

    awareness.on('change', updateUsers);
    updateUsers(); // Initial load

    return () => {
      awareness.off('change', updateUsers);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <AppHeader onlineUsers={onlineUsers} />
      <EditorToolbar editor={editor} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'background.default', padding: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ width: '816px', minHeight: '1122px', padding: { xs: 4, sm: 8, md: 12 }, flexShrink: 0 }}>
          <TiptapEditor editor={editor} />
        </Paper>
      </Box>
    </Box>
  );
}

export default App;