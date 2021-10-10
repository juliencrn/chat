import React from 'react';
import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  RouteProps
} from "react-router-dom";

import Chat from './screens/Chat';
import Login from './screens/Login';
import { RootState } from './state/store';

function App() {
  return <AppRouter />
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <PublicOnlyRoute path="/login">
          <Login />
        </PublicOnlyRoute>
        <PrivateRoute path="/">
          <Chat />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

function useAuth(): boolean {
  const auth = useSelector((state: RootState) => state.auth)
  return !!auth.user && !!auth.accessToken
}

function PrivateRoute({ children, ...props }: RouteProps) {
  const isAuth = useAuth()
  return (
    <Route 
      {...props}
      render={({ location }) => isAuth
        ? children
        : (
          <Redirect to={{
            pathname: "/login",
            state: { from: location }
          }} />
        )
      }
    />
  )
}

function PublicOnlyRoute({ children, ...props }: RouteProps) {
  const isAuth = useAuth()
  return (
    <Route 
      {...props}
      render={({ location }) => !isAuth
        ? children
        : (
          <Redirect to={{
            pathname: "/",
            state: { from: location }
          }} />
        )
      }
    />
  )
}