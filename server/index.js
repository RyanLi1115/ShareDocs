// server/index.js

import { WebSocketServer } from 'ws';
import { setupWSConnection, docs } from 'y-websocket/bin/utils';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 1234 });

// ===================================================
// In-Memory Database (用内存模拟数据库)
// ===================================================
// { 'username': { password: '...' } }
const users = {}; 
// { 'userId': ws }
const connections = {}; 
// { 'roomName': Set<ws> }
const rooms = {};

// ===================================================
// WebSocket Server Logic
// ===================================================

wss.on('connection', (ws, req) => {
  const userId = uuidv4();
  connections[userId] = ws;
  console.log(`✅ Client connected: ${userId}`);

  // 监听来自客户端的消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // --- 处理业务逻辑 ---
      if (data.type === 'auth') {
        handleAuth(ws, data.payload);
      } else if (data.type === 'joinRoom') {
        handleJoinRoom(ws, data.payload.roomName);
      }

    } catch (e) {
      // 如果消息不是JSON格式，我们假定它是Y.js的二进制消息
      // (这是一个简化的处理方式，更健壮的系统会使用不同的信道或消息头)
      // y-websocket 的 setupWSConnection 会处理这些消息
    }
  });

  ws.on('close', () => {
    console.log(`❌ Client disconnected: ${userId}`);
    // 清理用户连接和所在房间信息
    for (const roomName in rooms) {
      if (rooms[roomName].has(ws)) {
        rooms[roomName].delete(ws);
        broadcastUserList(roomName); // 广播更新后的用户列表
      }
    }
    delete connections[userId];
  });
});

// ===================================================
// Business Logic Handlers (业务逻辑处理器)
// ===================================================

function handleAuth(ws, { action, username, password }) {
  if (action === 'register') {
    if (users[username]) {
      ws.send(JSON.stringify({ type: 'auth_failed', message: 'Username already exists' }));
    } else {
      users[username] = { password };
      ws.send(JSON.stringify({ type: 'auth_success', username }));
      console.log(`New user registered: ${username}`);
    }
  } else if (action === 'login') {
    if (users[username] && users[username].password === password) {
      ws.send(JSON.stringify({ type: 'auth_success', username }));
      console.log(`User logged in: ${username}`);
    } else {
      ws.send(JSON.stringify({ type: 'auth_failed', message: 'Invalid credentials' }));
    }
  }
}

function handleJoinRoom(ws, roomName) {
  // 如果房间不存在，则创建一个
  if (!rooms[roomName]) {
    rooms[roomName] = new Set();
  }
  
  // 将用户加入房间
  rooms[roomName].add(ws);
  
  // 将此WebSocket连接与对应的Y.js文档进行绑定
  // 'docs' 是 y-websocket/bin/utils 导出的一个Map，用于存储Y.Doc实例
  setupWSConnection(ws, null, { docName: roomName, gc: true });
  console.log(`User joined room: ${roomName}`);
  
  // 广播当前房间的用户列表
  broadcastUserList(roomName);
}

function broadcastUserList(roomName) {
  const room = rooms[roomName];
  if (!room) return;

  // y-websocket/bin/utils 导出的 docs Map 中存储了每个房间的 Y.Doc
  const doc = docs.get(roomName);
  if (!doc) return;
  
  // 从 awareness 状态中获取在线用户
  const onlineUsers = [];
  doc.awareness.getStates().forEach(state => {
    if (state.user) {
      onlineUsers.push(state.user);
    }
  });

  // 向房间内的每个客户端发送最新的用户列表
  room.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'user_list_update', users: onlineUsers }));
    }
  });
}

console.log('🚀 SDG-Docs WebSocket server running on ws://localhost:1234');