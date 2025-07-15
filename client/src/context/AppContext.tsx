// client/src/context/AppContext.tsx
import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

type Groups = Record<string, string[]>;

interface AppContextType {
  ws: WebSocket | null;
  authState: 'LOGGED_OUT' | 'LOGGED_IN';
  username: string;
  groups: Groups;
  login: (user: string, pass: string) => void;
  register: (user: string, pass: string) => void;
  logout: () => void;
  getGroups: () => void;
  joinGroup: (groupName: string, user: { name: string, color: string }) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }) => {
  const [authState, setAuthState] = useState<'LOGGED_OUT' | 'LOGGED_IN'>('LOGGED_OUT');
  const [username, setUsername] = useState('');
  const [groups, setGroups] = useState<Groups>({});
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (ws.current) return;
    const socket = new WebSocket('ws://localhost:1234');
    ws.current = socket;
    
    socket.onopen = () => console.log('WebSocket Connected');
    socket.onclose = () => { /* ... */ };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data.toString());
        switch (data.type) {
          case 'auth_success':
            setUsername(data.username);
            setAuthState('LOGGED_IN');
            break;
          case 'auth_failed':
            alert(`Auth Failed: ${data.message}`);
            break;
          case 'groups_list':
            setGroups(data.payload || {});
            break;
        }
      } catch (e) {}
    };
    return () => socket.close();
  }, []);

  const login = (user: string, pass: string) => ws.current?.send(JSON.stringify({ type: 'auth', payload: { action: 'login', username: user, password: pass } }));
  const register = (user: string, pass: string) => ws.current?.send(JSON.stringify({ type: 'auth', payload: { action: 'register', username: user, password: pass } }));
  const logout = () => window.location.reload();
  const getGroups = useCallback(() => ws.current?.send(JSON.stringify({ type: 'get_groups' })), []);
  const joinGroup = useCallback((groupName: string, user: { name: string, color: string }) => {
    ws.current?.send(JSON.stringify({ type: 'join_group', payload: { groupName, user } }));
  }, []);

  const value = { ws: ws.current, authState, username, groups, login, register, logout, getGroups, joinGroup };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};