// client/src/components/TiptapEditor.tsx

import { EditorContent } from '@tiptap/react';
import React from 'react';

// 接收一个 editor 对象作为 prop
const TiptapEditor = ({ editor }) => {
  // 我们不再需要在这里使用 useEditor Hook
  return (
    <EditorContent editor={editor} />
  );
};

export default TiptapEditor;