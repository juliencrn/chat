import React from 'react';
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useDispatch} from 'react-redux'
import TextInput from '../components/TextInput';
import { useLoginMutation } from '../state/authApi';
import {  logout, setCompleteUser } from '../state/authSlice';


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

function Login() {
  const dispatch = useDispatch()
  const [login, loginState] = useLoginMutation()
  const { register, ...form } = useForm<LoginFormValue>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues
  })
  
  const submit = form.handleSubmit(async (values: LoginFormValue) => {
    try {
      const res = await login(values).unwrap()
      dispatch(setCompleteUser(res))
    } catch (error) {
      dispatch(logout())
    }
  })

  const { errors } = form.formState

  return (
      <div className="flex flex-1 flex-col">
        <div className="w-full max-w-xs m-auto">
          <h2 className="font-bold text-xl tracking-wide mb-2 text-center">Connection</h2>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" noValidate onSubmit={submit}>
            {loginState.error && (
              <p className="text-red-500 text-xs italic mb-4">
                Could not connect, please try again.
              </p>
            )}
            
            <TextInput 
              {...register("username")}
              label="Username" 
              errors={errors.username}
              inputProps={{ placeholder: "Username" }}
            />
            <TextInput 
              {...register("password")}
              label="Password" 
              errors={errors.username}
              inputProps={{
                placeholder: "******************",
                autoComplete: "current-password",
                type: "password"
              }}
            />

            <button disabled={loginState.isLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
  );
}

export default Login;
