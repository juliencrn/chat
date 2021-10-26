import { createApi } from "@reduxjs/toolkit/query/react";

import { Message } from "../../types";
import { toQueryParams } from "../../utils";
import getBaseQuery from "../getBaseQuery";

interface GetMessagesDto {
  threadId?: string;
  lastId?: string;
}

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: getBaseQuery({ basePath: "/messages" }),
  endpoints: builder => ({
    getMessagesByThread: builder.query<Message[], GetMessagesDto>({
      query: params => `/${toQueryParams({ limit: 20, ...params })}`,
    }),
  }),
});

export const { useGetMessagesByThreadQuery } = messagesApi;
