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

import { authApi } from "./authApi";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";
import { messagesApi } from "./messagesApi";
import { threadsApi } from "./threadsApi";
import { usersApi } from "./usersApi";

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  [authApi.reducerPath]: authApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [threadsApi.reducerPath]: threadsApi.reducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["auth", "usersApi", "threadsApi"],
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
