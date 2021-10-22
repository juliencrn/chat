import { createApi } from "@reduxjs/toolkit/query/react";

import { Thread } from "../types";
import getBaseQuery from "./getBaseQuery";

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
  }),
});

export const { useGetAllThreadsQuery, useGetOneThreadQuery } = threadsApi;
