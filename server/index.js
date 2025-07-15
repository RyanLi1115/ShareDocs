// server/index.js (最终稳定版)

import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

const wss = new WebSocketServer({ port: 1234 });

wss.on('connection', (ws, req) => {
  console.log('✅ Client connected');
  setupWSConnection(ws, req); // 直接交由 y-websocket 处理所有消息
});

console.log('🚀 SDG-Docs WebSocket server running on ws://localhost:1234');