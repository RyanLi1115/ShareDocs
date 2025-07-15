// client/src/components/EditorToolbar.tsx

// We no longer need to import React here.
import { useCallback } from 'react';
import type { Editor } from '@tiptap/core'; // 1. Import the 'Editor' type from TipTap's core.
import { Box, IconButton, Divider, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';

// Icon imports remain the same...
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import LinkIcon from '@mui/icons-material/Link';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

// 2. Define the type for our component's props.
// 'editor' can be null initially while it's loading.
interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) {
    return null;
  }

  // The rest of the component logic remains exactly the same...
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const activeButtons = [
    'bold', 'italic', 'underline', 'strike', 
    'bulletList', 'orderedList', 'blockquote', 'codeBlock'
  ].filter(type => editor.isActive(type));

  const activeHeading = () => {
    for (let i = 1; i <= 3; i++) {
      if (editor.isActive('heading', { level: i })) return `h${i}`;
    }
    return '';
  }

  const activeAlignment = () => {
    if (editor.isActive({ textAlign: 'center' })) return 'center';
    if (editor.isActive({ textAlign: 'right' })) return 'right';
    return 'left';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '4px 16px',
        borderBottom: '1px solid #C4C7C5',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: '64px',
        zIndex: 10,
      }}
    >
      {/* Heading Group */}
      <ToggleButtonGroup size="small" value={activeHeading()} exclusive>
        <Tooltip title="Heading 1"><ToggleButton value="h1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><LooksOneIcon /></ToggleButton></Tooltip>
        <Tooltip title="Heading 2"><ToggleButton value="h2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><LooksTwoIcon /></ToggleButton></Tooltip>
        <Tooltip title="Heading 3"><ToggleButton value="h3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Looks3Icon /></ToggleButton></Tooltip>
      </ToggleButtonGroup>
      <Divider flexItem orientation="vertical" sx={{ mx: 1, my: 1 }} />

      {/* Basic Formatting Group */}
      <ToggleButtonGroup size="small" value={activeButtons}>
        <Tooltip title="Bold (Ctrl+B)"><ToggleButton value="bold" onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon /></ToggleButton></Tooltip>
        <Tooltip title="Italic (Ctrl+I)"><ToggleButton value="italic" onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon /></ToggleButton></Tooltip>
        <Tooltip title="Underline (Ctrl+U)"><ToggleButton value="underline" onClick={() => editor.chain().focus().toggleUnderline().run()}><FormatUnderlinedIcon /></ToggleButton></Tooltip>
        <Tooltip title="Strikethrough"><ToggleButton value="strike" onClick={() => editor.chain().focus().toggleStrike().run()}><FormatStrikethroughIcon /></ToggleButton></Tooltip>
      </ToggleButtonGroup>
      <Divider flexItem orientation="vertical" sx={{ mx: 1, my: 1 }} />
      
      {/* Alignment Group */}
      <ToggleButtonGroup size="small" value={activeAlignment()} exclusive>
        <Tooltip title="Align Left"><ToggleButton value="left" onClick={() => editor.chain().focus().setTextAlign('left').run()}><FormatAlignLeftIcon /></ToggleButton></Tooltip>
        <Tooltip title="Align Center"><ToggleButton value="center" onClick={() => editor.chain().focus().setTextAlign('center').run()}><FormatAlignCenterIcon /></ToggleButton></Tooltip>
        <Tooltip title="Align Right"><ToggleButton value="right" onClick={() => editor.chain().focus().setTextAlign('right').run()}><FormatAlignRightIcon /></ToggleButton></Tooltip>
      </ToggleButtonGroup>
      <Divider flexItem orientation="vertical" sx={{ mx: 1, my: 1 }} />

      {/* Block Formatting Group */}
      <ToggleButtonGroup size="small" value={activeButtons}>
        <Tooltip title="Bullet List"><ToggleButton value="bulletList" onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon /></ToggleButton></Tooltip>
        <Tooltip title="Numbered List"><ToggleButton value="orderedList" onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon /></ToggleButton></Tooltip>
        <Tooltip title="Blockquote"><ToggleButton value="blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuoteIcon /></ToggleButton></Tooltip>
        <Tooltip title="Code Block"><ToggleButton value="codeBlock" onClick={() => editor.chain().focus().toggleCodeBlock().run()}><CodeIcon /></ToggleButton></Tooltip>
      </ToggleButtonGroup>
      <Divider flexItem orientation="vertical" sx={{ mx: 1, my: 1 }} />

      {/* Special Elements Group */}
      <Tooltip title="Insert/Edit Link">
        <IconButton onClick={setLink}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Horizontal Rule">
        <IconButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <HorizontalRuleIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default EditorToolbar;