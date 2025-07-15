// client/src/lib/yjs.ts

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// 定义一个函数来设置协同环境
export const setupCollaboration = (roomName: string) => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(
    'ws://localhost:1234',
    roomName,
    ydoc
  );

  // 返回一个 Promise，它将在连接成功后解析
  return new Promise<{ ydoc: Y.Doc; provider: WebsocketProvider }>((resolve) => {
    // 监听 provider 的状态变化
    provider.on('status', (event: { status: string }) => {
      // 当状态变为 "connected" 时，Promise 成功，并返回 ydoc 和 provider
      if (event.status === 'connected') {
        console.log(`✅ Y.js Provider connected to room: ${roomName}`);
        resolve({ ydoc, provider });
      }
    });
  });
};