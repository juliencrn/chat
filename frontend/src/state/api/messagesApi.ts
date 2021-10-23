import { createApi } from "@reduxjs/toolkit/query/react";

import { Message } from "../../types";
import getBaseQuery from "../getBaseQuery";

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: getBaseQuery({ basePath: "/messages" }),
  endpoints: builder => ({
    getMessagesByThread: builder.query<Message[], string>({
      query: threadId => (!threadId ? "/" : `/?threadIds=${threadId}`),
    }),
  }),
});

export const { useGetMessagesByThreadQuery } = messagesApi;
