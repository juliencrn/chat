import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AccessToken, User } from "../../types";
import { RootState } from "../store";

export interface AuthState extends AccessToken {
  accessToken: string;
  user: User;
}

const initialState: Partial<AuthState> = {
  accessToken: undefined,
  user: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: () => initialState,
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export default authSlice.reducer;
