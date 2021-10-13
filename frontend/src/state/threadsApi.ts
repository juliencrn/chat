import { createApi } from "@reduxjs/toolkit/query/react";

import { APIThread } from "../types";
import getBaseQuery from "./getBaseQuery";

export type AllThreadsResponse = APIThread[];

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
