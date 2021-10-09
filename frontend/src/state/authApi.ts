import { createApi } from '@reduxjs/toolkit/query/react'
import getBaseQuery from './getBaseQuery';
import { User } from '../types';

export interface LoginDto {
    username: string
    password: string
}

export interface LoginResponse {
    accessToken: string
    user: User
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: getBaseQuery('auth'),
    endpoints: (builder) => ({
      login: builder.mutation<LoginResponse, LoginDto>({
        query: (dto) => ({
            url: "/login",
            method: "POST",
            body: dto
        }),
      }),
    }),
  })

export const { useLoginMutation } = authApi;