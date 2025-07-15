// client/src/App.tsx
import { useState, useCallback } from 'react';
import { useApp } from './context/AppContext';
import { AuthPage } from './pages/AuthPage';
import { GroupPage } from './pages/GroupPage';
import { EditorPage } from './pages/EditorPage';

function App() {
  const { authState, username, joinGroup } = useApp();
  const [currentGroup, setCurrentGroup] = useState<string | null>(null);

  // 创建一个 memoized 版本的 join group handler
  const handleJoinGroup = useCallback((groupName: string) => {
    if (!username) return;

    // 随机生成当前用户的信息
    const userColors = ['#F44336', '#9C27B0', '#3F51B5', '#03A9F4'];
    const color = userColors[Math.floor(Math.random() * userColors.length)];
    const currentUser = { name: username, color };
    
    // 调用 context 中的 joinGroup 函数，并传入用户信息
    joinGroup(groupName, currentUser);

    // 更新本地状态以切换页面
    setCurrentGroup(groupName);
  }, [username, joinGroup]);

  if (authState === 'LOGGED_OUT') {
    return <AuthPage />;
  }
  
  if (!currentGroup) {
    // 将新的 handler 传给 GroupPage
    return <GroupPage username={username} onJoinGroup={handleJoinGroup} />;
  }

  return <EditorPage groupName={currentGroup} username={username} />;
}

export default App;