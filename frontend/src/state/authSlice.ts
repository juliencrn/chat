import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../types'

export interface AuthState {
  accessToken: string
  user: User
}

const initialState: Partial<AuthState> = {
  accessToken: undefined,
  user: undefined,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCompleteUser: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
    },
    logout: state => initialState,
  }
})

export const { setCompleteUser, logout } = authSlice.actions
export default authSlice.reducer
