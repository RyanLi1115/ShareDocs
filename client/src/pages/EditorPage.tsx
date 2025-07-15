// client/src/pages/EditorPage.tsx
import { Box, Paper } from '@mui/material';
import AppHeader from '../components/AppHeader';
import EditorToolbar from '../components/EditorToolbar';
import TiptapEditor from '../components/TiptapEditor';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';

export const EditorPage = ({ ydoc, provider, currentUser, onlineUsers }) => {
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
      attributes: { class: 'prosemirror' },
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader onlineUsers={onlineUsers} />
      <EditorToolbar editor={editor} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', backgroundColor: 'background.default', padding: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={2} sx={{ width: '816px', minHeight: '1122px', padding: { xs: 4, sm: 8, md: 12 }, flexShrink: 0 }}>
          <TiptapEditor editor={editor} />
        </Paper>
      </Box>
    </Box>
  );
};