import React from 'react';
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { TextInput } from '../components/form-utils';

export interface LoginProps {
    onSuccess: (username: string) => void
}

export interface LoginFormValue {
  username: string
  password: string
}

const initialValues: LoginFormValue = {
  username: 'julien',
  password: 'password',
}

const validationSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(8).required(),
})

function Login({ onSuccess }: LoginProps) {
  const { register, ...form } = useForm<LoginFormValue>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  })
  
  const submit = form.handleSubmit((values: LoginFormValue) => {
    console.log('login submit success', { values});
    // Form validated by Yup, now call API to auth
    // TODO: Call auth/login API
    onSuccess(values.username)
  })

  const { errors } = form.formState

  return (
      <div className="flex flex-1 flex-col">
        <div className="w-full max-w-xs m-auto">
          <h2 className="font-bold text-xl tracking-wide mb-2 text-center">Connection</h2>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" noValidate onSubmit={submit}>
            <TextInput 
              name="username" 
              label="Username" 
              errors={errors.username}
              inputProps={{
                ...register("username"),
                placeholder: "Username"
              }}
            />
            <TextInput 
              name="password" 
              label="Password" 
              errors={errors.username}
              inputProps={{
                ...register("password"),
                placeholder: "******************",
                autoComplete: "current-password",
                type: "password"
              }}
            />

            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Sign In
              </button>
              {/* <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                Forgot Password?
              </a> */}
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2020 Blabla. All rights reserved.
          </p>
        </div>
      </div>
  );
}

export default Login;
