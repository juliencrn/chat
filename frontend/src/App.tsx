import React from "react";

import {
  BrowserRouter,
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
} from "react-router-dom";

import useAuth from "./hooks/useAuth";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound";
import Thread from "./pages/Thread/Thread";
import { AuthState } from "./state/authSlice";

function App() {
  return <AppRouter />;
}

export default App;

function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/" exact component={Chat} />
        <PublicOnlyRoute path="/login" component={Login} />
        <PrivateRoute path="/thread/:name" component={Thread} />
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export interface PrivateRouteProps extends RouteComponentProps, AuthState {}

interface CustomRouteProps<T = RouteComponentProps> extends RouteProps {
  component: (props: T) => React.ReactElement | null;
}

function PrivateRoute({
  component: Component,
  path,
  ...rest
}: CustomRouteProps<PrivateRouteProps>) {
  const auth = useAuth();
  return (
    <Route
      path={path}
      {...rest}
      render={props =>
        auth ? (
          <Component {...{ ...props, ...auth }} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

function PublicOnlyRoute({
  component: Component,
  path,
  ...rest
}: CustomRouteProps) {
  const auth = useAuth();
  return (
    <Route
      path={path}
      {...rest}
      render={props =>
        !auth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
