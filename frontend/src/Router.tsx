import React from "react";

import {
  BrowserRouter,
  Redirect,
  Route as BaseRoute,
  RouteComponentProps,
  RouteProps,
  Switch,
} from "react-router-dom";

import useAuth from "./hooks/useAuth";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound";
import Thread from "./pages/Thread";
import { AuthState } from "./state/authSlice";

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/thread/:slug" component={Thread} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export interface ProtectedRouteProps extends RouteComponentProps, AuthState {}

interface CustomRouteProps<T = RouteComponentProps> extends RouteProps {
  component: (props: T) => React.ReactElement | null;
}

function ProtectedRoute({
  component: Component,
  ...rest
}: CustomRouteProps<ProtectedRouteProps>) {
  const auth = useAuth();
  return (
    <BaseRoute
      {...rest}
      render={props =>
        !!auth ? (
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

function Route({ component: Component, ...rest }: CustomRouteProps) {
  return <BaseRoute {...rest} render={props => <Component {...props} />} />;
}
