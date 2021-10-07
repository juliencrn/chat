import React, { useState } from 'react';

import Chat from './Chat/Chat';
import Login from './Login/Login';

function App() {
  const [username, setUsername] = useState("");

  const logout = () => setUsername("")

  return !!username
    ? <Chat username={username} onLogout={logout} />
    : <Login onSuccess={setUsername} />
}

export default App;
