import React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

import TextInput from "../../components/TextInput";
import { useLoginMutation } from "../../state/api/authApi";
import { logout, setToken } from "../../state/slices/authSlice";

export interface LoginFormValue {
  username: string;
  password: string;
}

const initialValues: LoginFormValue = {
  username: "julien2",
  password: "password",
};

const validationSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(8).required(),
});

function LoginForm() {
  const dispatch = useDispatch();
  const [login, loginState] = useLoginMutation();
  const { register, ...form } = useForm<LoginFormValue>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const submit = form.handleSubmit(async (values: LoginFormValue) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setToken(res.accessToken));
    } catch (error) {
      dispatch(logout());
    }
  });

  const { errors } = form.formState;

  return (
    <form noValidate onSubmit={submit}>
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
          type: "password",
        }}
      />

      <button
        disabled={loginState.isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
