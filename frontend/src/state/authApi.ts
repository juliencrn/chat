import { createApi } from "@reduxjs/toolkit/query/react";

import { AccessToken } from "../types";
import getBaseQuery from "./getBaseQuery";

export interface LoginDto {
  username: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: getBaseQuery({ basePath: "/auth" }),
  endpoints: builder => ({
    login: builder.mutation<AccessToken, LoginDto>({
      query: dto => ({
        url: "/login",
        method: "POST",
        body: dto,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
