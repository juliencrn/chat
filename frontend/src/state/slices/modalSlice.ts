import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Thread } from "../../types";
import { RootState } from "../store";

export type ModalType = "LOGOUT" | "CREATE_THREAD" | "DELETE_THREAD";

interface ModalStateBase {
  type: ModalType | null;
  payload?: any;
}

export interface DeleteThreadModalState extends ModalStateBase {
  type: "DELETE_THREAD";
  payload: Thread;
}

export interface CreateThreadModalState extends ModalStateBase {
  type: "CREATE_THREAD";
}

export interface LogoutModalState extends ModalStateBase {
  type: "LOGOUT";
}

interface ClosedModalState extends ModalStateBase {
  type: null;
}

export type ModalState =
  | DeleteThreadModalState
  | CreateThreadModalState
  | LogoutModalState
  | ClosedModalState;

const initialState: ModalState = {
  type: null,
  payload: undefined,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showLogoutModal: (state: ModalState) => {
      state.type = "LOGOUT";
      state.payload = undefined;
    },
    showDeleteThreadModal: (
      state: ModalState,
      action: PayloadAction<Thread>,
    ) => {
      state.type = "DELETE_THREAD";
      state.payload = action.payload;
    },
    showCreateThreadModal: (state: ModalState) => {
      state.type = "CREATE_THREAD";
      state.payload = undefined;
    },
    closeModal: state => {
      state.type = null;
      state.payload = undefined;
    },
  },
});

export const {
  showCreateThreadModal,
  showDeleteThreadModal,
  showLogoutModal,
  closeModal,
} = modalSlice.actions;

export const modalSelector = (state: RootState) => state.modal;
export default modalSlice.reducer;
