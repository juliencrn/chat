import { createApi } from "@reduxjs/toolkit/query/react";

import { Thread } from "../../types";
import getBaseQuery from "../getBaseQuery";

export const threadsApi = createApi({
  reducerPath: "threadsApi",
  baseQuery: getBaseQuery({ basePath: "/threads" }),
  endpoints: builder => ({
    getAllThreads: builder.query<Thread[], undefined>({
      query: () => "",
    }),

    getOneThread: builder.query<Thread, string>({
      query: slug => `/${slug}`,
    }),

    createThread: builder.mutation<Thread, { name: string }>({
      query: body => ({
        url: "",
        method: "POST",
        body,
      }),
    }),

    deleteThread: builder.mutation<Thread, string>({
      query: threadId => ({
        url: `/${threadId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllThreadsQuery,
  useGetOneThreadQuery,
  useCreateThreadMutation,
  useDeleteThreadMutation,
} = threadsApi;
