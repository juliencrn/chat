import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { PersistConfig } from "redux-persist/es/types";
import storage from "redux-persist/lib/storage";

import { authApi } from "./api/authApi";
import { messagesApi } from "./api/messagesApi";
import { threadsApi } from "./api/threadsApi";
import { usersApi } from "./api/usersApi";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import modalReducer from "./slices/modalSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  modal: modalReducer,
  [authApi.reducerPath]: authApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [threadsApi.reducerPath]: threadsApi.reducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["auth"],
  version: 0,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      messagesApi.middleware,
      usersApi.middleware,
      threadsApi.middleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
