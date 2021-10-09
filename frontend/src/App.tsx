import React from 'react';
import { useSelector } from "react-redux";

import Chat from './screens/Chat';
import Login from './screens/Login';
import { RootState } from './state/store';

function App() {
  const { user } = useSelector((state: RootState) => state.auth)

  // TODO: Use a router instead
  if (!user) {
    return <Login />
  } 

  return <Chat />
}

export default App;
