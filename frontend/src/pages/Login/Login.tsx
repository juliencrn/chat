import React from "react";

import { Redirect } from "react-router";

import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import LoginForm from "./LoginForm";

function Login() {
  const auth = useAuth();

  if (auth) {
    return <Redirect to="/" />;
  }

  return (
    <Layout center card pageTitle="Sign in">
      <LoginForm />
    </Layout>
  );
}

export default Login;
