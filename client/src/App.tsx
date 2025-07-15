// client/src/App.tsx
import { useState, useEffect, useRef } from 'react';
import { CssBaseline } from '@mui/material';
import { AuthPage } from './pages/Auth';
import { RoomSelectPage } from './pages/RoomSelect';
import { EditorPage } from './pages/EditorPage';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// 定义用户和状态的类型
type User = { name: string; color: string; };
type OnlineUser = { name: string; color: string; };

const WS_URL = 'ws://localhost:1234';

function App() {
  // 全局状态
  const [username, setUsername] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  
  // Y.js 和 WebSocket 的实例
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentUserRef = useRef<User | null>(null);

  useEffect(() => {
    // 建立一个通用的 WebSocket 连接用于业务逻辑
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'auth_success') {
        setUsername(data.username);
      } else if (data.type === 'auth_failed') {
        alert(data.message);
      } else if (data.type === 'user_list_update') {
        setOnlineUsers(data.users);
      }
    };
    
    return () => {
      ws.close();
    };
  }, []);

  const handleAuth = (type: 'login' | 'register', user, pass) => {
    wsRef.current?.send(JSON.stringify({
      type: 'auth',
      payload: { action: type, username: user, password: pass },
    }));
  };

  const handleJoinRoom = (room) => {
    // 随机生成当前用户的信息
    const userColors = ['#F44336', '#9C27B0', '#3F51B5', '#03A9F4'];
    const color = userColors[Math.floor(Math.random() * userColors.length)];
    currentUserRef.current = { name: username!, color };

    // 创建 Y.js 文档和 Provider
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(WS_URL, room, ydoc);
    
    // Y.js 的 awareness 协议用于同步光标等瞬时状态
    provider.awareness.setLocalStateField('user', currentUserRef.current);
    
    ydocRef.current = ydoc;
    providerRef.current = provider;

    setRoomName(room);

    // 发送加入房间的业务消息
    wsRef.current?.send(JSON.stringify({
      type: 'joinRoom',
      payload: { roomName: room },
    }));
  };
  
  // 根据应用状态决定渲染哪个页面
  if (!username) {
    return <AuthPage onAuth={handleAuth} />;
  }
  
  if (!roomName) {
    return <RoomSelectPage username={username} onJoinRoom={handleJoinRoom} />;
  }

  return (
    <>
      <CssBaseline />
      <EditorPage
        ydoc={ydocRef.current}
        provider={providerRef.current}
        currentUser={currentUserRef.current}
        onlineUsers={onlineUsers}
      />
    </>
  );
}

export default App;