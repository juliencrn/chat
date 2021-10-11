import React from "react";

import PublicLayout from "../../components/PublicLayout";
import LoginForm from "./LoginForm";

function Login() {
  return (
    <PublicLayout title="Sign in">
      <LoginForm />
    </PublicLayout>
  );
}

export default Login;
