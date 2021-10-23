import { createApi } from "@reduxjs/toolkit/query/react";

import { User } from "../../types";
import getBaseQuery from "../getBaseQuery";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: getBaseQuery({ basePath: "/users" }),
  endpoints: builder => ({
    // TODO: Require limits like pagination, but will be fixed with thread system
    getUsers: builder.query<User[], undefined>({
      query: () => "",
    }),
    getUser: builder.query<User, string>({
      query: userId => `/${userId}`,
    }),
    profile: builder.query<User, string | undefined>({
      query: _token => "/profile",
    }),
  }),
});

export const { useGetUserQuery, useGetUsersQuery, useProfileQuery } = usersApi;
