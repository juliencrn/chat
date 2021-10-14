import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Message, Model, Thread, ThreadState, UserConnection } from "../types";
import { fromMap, toMap } from "../utils";
import { RootState } from "./store";

interface ChatState {
  connections: UserConnection[];
  messages: Message[];
  threads: Record<string, ThreadState>;
}

const initialState: ChatState = {
  connections: [],
  messages: [],
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

      state.threads[threadSlug].messages = fromMap(map);
    },
    setAllMessages: (state, action: PayloadAction<MessagesDto>) => {
      const { threadSlug, messages } = action.payload;
      if (!state.threads[threadSlug]) {
        state.threads[threadSlug] = initialThread(messages[0].thread);
      }

      const map = toMap(state.threads[threadSlug].messages);

      for (const message of messages) {
        map.set(message.id, message);
      }

      state.threads[threadSlug].messages = fromMap(map);
      state.threads[threadSlug].fetched = true;
    },

    // TODO: Outdated
    updateConnections: (state, action: PayloadAction<UserConnection[]>) => {
      state.connections = action.payload;
    },
  },
});

export const { addMessage, setAllMessages, updateConnections, initThread } =
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
  fetched: false,
});
