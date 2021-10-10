import { createApi } from '@reduxjs/toolkit/query/react'
import getBaseQuery from './getBaseQuery';
import { Message } from '../types';

export type AllMessageResponse = Message[]

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: getBaseQuery('messages'),
    endpoints: (builder) => ({
      getAllMessages: builder.query<AllMessageResponse, undefined>({
        query: () => '',
      }),
    }),
  })

export const { useGetAllMessagesQuery } = messagesApi;