import { createApi } from "@reduxjs/toolkit/query/react";

import { Thread } from "../types";
import getBaseQuery from "./getBaseQuery";

export type AllThreadsResponse = Thread[];

export const threadsApi = createApi({
  reducerPath: "threadsApi",
  baseQuery: getBaseQuery("threads"),
  endpoints: builder => ({
    getAllThreads: builder.query<AllThreadsResponse, undefined>({
      query: () => "",
    }),
  }),
});

export const { useGetAllThreadsQuery } = threadsApi;
