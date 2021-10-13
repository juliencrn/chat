import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LegacyThread, Message, UserConnection } from "../types";

type ChatState = LegacyThread;

const initialState: ChatState = {
  name: "Chat default thread",
  connections: [],
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setAllMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    updateConnections: (state, action: PayloadAction<UserConnection[]>) => {
      state.connections = action.payload;
    },
  },
});

export const { addMessage, setAllMessages, updateConnections } =
  chatSlice.actions;
export default chatSlice.reducer;
