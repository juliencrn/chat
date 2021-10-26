import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Message, Thread, ThreadState, UserConnection } from "../../types";
import { fromMap, sortByTime, toMap } from "../../utils";
import { RootState } from "../store";

interface ChatState {
  connections: UserConnection[];
  threads: Record<string, ThreadState>;
}

const initialState: ChatState = {
  connections: [],
  threads: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    initThread: (state: ChatState, action: PayloadAction<Thread>) => {
      const thread = action.payload;
      state.threads[thread.slug] = initialThread(thread);
    },

    addMessage: (state, action: PayloadAction<MessageDto>) => {
      const { threadSlug, message } = action.payload;
      if (!state.threads[threadSlug]) {
        state.threads[threadSlug] = initialThread(message.thread);
      }

      const map = toMap(state.threads[threadSlug].messages);

      map.set(message.id, message);

      state.threads[threadSlug].messages = sortByTime(fromMap(map));
      state.threads[threadSlug].lastAddingMethod = "new_message";
    },

    setAllMessages: (state, action: PayloadAction<MessagesDto>) => {
      const { threadSlug, messages } = action.payload;

      let initialMessagesLength = 0;

      if (state.threads[threadSlug]) {
        initialMessagesLength = state.threads[threadSlug].messages.length;
      } else {
        state.threads[threadSlug] = initialThread(messages[0].thread);
      }

      if (messages.length === 0) {
        state.threads[threadSlug].lastAddingMethod = "last_fetch";
      } else {
        const map = toMap(state.threads[threadSlug].messages);

        for (const message of messages) {
          map.set(message.id, message);
        }

        state.threads[threadSlug].messages = sortByTime(fromMap(map));
        state.threads[threadSlug].lastAddingMethod =
          initialMessagesLength > 0 ? "api_refetch" : "initial_fetch";
      }
    },

    refreshConnections: (state, action: PayloadAction<UserConnection[]>) => {
      state.connections = action.payload;
    },
  },
});

export const { addMessage, setAllMessages, refreshConnections, initThread } =
  chatSlice.actions;

export const chatSelector = (state: RootState) => state.chat;
export default chatSlice.reducer;

interface MessageDto {
  message: Message;
  threadSlug: string;
}

interface MessagesDto {
  messages: Message[];
  threadSlug: string;
}

const initialThread = (thread: Thread): ThreadState => ({
  ...thread,
  messages: [],
  lastAddingMethod: "idle",
});
