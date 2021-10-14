import React from "react";

import { Redirect } from "react-router";

import PublicLayout from "../../components/PublicLayout";
import useAuth from "../../hooks/useAuth";
import LoginForm from "./LoginForm";

function Login() {
  const auth = useAuth();

  if (auth) {
    return <Redirect to="/" />;
  }

  return (
    <PublicLayout title="Sign in">
      <LoginForm />
    </PublicLayout>
  );
}

export default Login;
