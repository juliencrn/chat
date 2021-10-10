import React from 'react';

import LoginForm from './LoginForm';
import PublicLayout from '../../components/PublicLayout';

function Login() {
  return (
    <PublicLayout title="Sign in">
      <LoginForm />
    </PublicLayout>
  );
}

export default Login;
