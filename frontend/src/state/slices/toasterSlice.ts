import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { RootState } from "../store";

export interface Toast {
  id: string;
  message: string;
  createdAt: number;
}

interface ToasterState {
  toasts: Toast[];
}

const initialState: ToasterState = {
  toasts: [],
};

export const toasterSlice = createSlice({
  name: "toaster",
  initialState,
  reducers: {
    showToast: (state: ToasterState, action: PayloadAction<Toast>) => {
      state.toasts.push(action.payload);
    },
    deleteToast: (state: ToasterState, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToaster: (state: ToasterState) => {
      state.toasts = [];
    },
  },
});

export const { showToast, deleteToast, clearToaster } = toasterSlice.actions;

export const toasterSelector = (state: RootState) => state.toaster;
export default toasterSlice.reducer;

const prepareToast = (message: string): Toast => ({
  id: uuid(),
  message,
  createdAt: Date.now(),
});

export function addToast(dispatch: Dispatch, message: string) {
  const newToast = prepareToast(message);
  dispatch(showToast(newToast));

  setTimeout(() => {
    dispatch(deleteToast(newToast.id));
  }, 10000);
}
