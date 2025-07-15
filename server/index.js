// server/index.js (最终修正版)

import { WebSocketServer } from 'ws';
import { setupWSConnection, docs } from 'y-websocket/bin/utils';

// ===================================================
// 在内存中模拟数据库
// ===================================================
const users = {}; // { 'username': { password: '...' } }
const connections = new Map(); // ws -> { username, groupName }

const wss = new WebSocketServer({ port: 1234 });
console.log('🚀 SDG-Docs WebSocket server running on ws://localhost:1234');

// ===================================================
// WebSocket Server Logic
// ===================================================
wss.on('connection', (ws) => {
  console.log('✅ Client connected.');

  ws.on('message', (message) => {
    let data;
    try { data = JSON.parse(message.toString()); } catch (e) { return; }

    switch (data.type) {
      case 'auth':
        handleAuth(ws, data.payload);
        break;
      case 'get_groups':
        handleGetGroups(ws);
        break;
      case 'join_group':
        handleJoinGroup(ws, data.payload);
        break;
    }
  });

  ws.on('close', () => {
    const connInfo = connections.get(ws);
    if (connInfo) {
      console.log(`❌ Client '${connInfo.username}' disconnected.`);
      // 当用户断开连接时，广播其所在小组的用户列表和所有小组列表的更新
      if (connInfo.groupName) {
        setTimeout(() => {
          broadcastUserList(connInfo.groupName);
          broadcastGroupListToAll();
        }, 100);
      }
      connections.delete(ws);
    }
  });
});

// ===================================================
// Business Logic Handlers
// ===================================================

function handleAuth(ws, { action, username, password }) {
    if (action === 'register') {
        if (users[username]) {
            return ws.send(JSON.stringify({ type: 'auth_failed', message: 'Username already exists.' }));
        }
        users[username] = { password };
        connections.set(ws, { username, groupName: null });
        ws.send(JSON.stringify({ type: 'auth_success', username }));
        console.log(`New user registered: ${username}`);
    } else if (action === 'login') {
        if (!users[username]) {
            return ws.send(JSON.stringify({ type: 'auth_failed', message: 'User does not exist.' }));
        }
        if (users[username].password === password) {
            connections.set(ws, { username, groupName: null });
            ws.send(JSON.stringify({ type: 'auth_success', username }));
            console.log(`User logged in: ${username}`);
        } else {
            ws.send(JSON.stringify({ type: 'auth_failed', message: 'Invalid password.' }));
        }
    }
}

function handleGetGroups(ws) {
  broadcastGroupList(ws);
}

function handleJoinGroup(ws, { groupName, user }) {
  const connInfo = connections.get(ws);
  if (!connInfo || !connInfo.username) return;

  // 如果用户之前在别的组，先广播那个组的更新
  if (connInfo.groupName && connInfo.groupName !== groupName) {
    broadcastUserList(connInfo.groupName);
    broadcastGroupListToAll();
  }
  
  connInfo.groupName = groupName;

  // 将此WebSocket连接与对应的Y.js文档进行绑定。
  // 如果名为groupName的文档不存在，y-websocket会自动创建。
  setupWSConnection(ws, null, { docName: groupName, gc: true });
  const doc = docs.get(groupName);
  if (doc) {
    doc.awareness.setLocalStateField('user', user);
  }
  
  console.log(`User '${connInfo.username}' joined group: ${groupName}`);
  ws.send(JSON.stringify({ type: 'join_success', groupName }));

  // 广播更新
  setTimeout(() => {
    broadcastGroupListToAll();
    broadcastUserList(groupName);
  }, 500);
}

// ===================================================
// Broadcast Functions
// ===================================================

// 广播在线用户列表给特定小组
function broadcastUserList(groupName) {
  const doc = docs.get(groupName);
  if (!doc) return;

  const onlineUsers = [];
  doc.awareness.getStates().forEach(state => {
    if (state.user) onlineUsers.push(state.user);
  });
  
  // 找到所有在这个房间的用户连接并广播
  for (const [socket, conn] of connections.entries()) {
    if (conn.groupName === groupName && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'presence_update', users: onlineUsers }));
    }
  }
}

// 广播所有小组及其成员的列表
function broadcastGroupList(socket) {
    const groupData = {};
    // 从 y-websocket 的 docs Map 中获取权威的小组列表
    for (const groupName of docs.keys()) {
        const doc = docs.get(groupName);
        const members = [];
        if (doc) {
            // 从 awareness 中获取当前在线的成员
            doc.awareness.getStates().forEach(state => {
                if(state.user?.name) {
                    members.push(state.user.name);
                }
            });
        }
        groupData[groupName] = members;
    }

    const targetSockets = socket ? [socket] : wss.clients;
    targetSockets.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'groups_list', payload: groupData }));
        }
    });
}
const broadcastGroupListToAll = () => broadcastGroupList(null);