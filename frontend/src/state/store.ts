import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux"
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
  } from "redux-persist"
  import { PersistConfig } from "redux-persist/es/types"
  import storage from "redux-persist/lib/storage"

import authReducer from "./authSlice";
import { authApi } from "./authApi";

const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
})

const persistConfig: PersistConfig<RootState> = {
    key: "root",
    storage,
    whitelist: ["auth"],
    version: 0,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
          serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
    })
    .concat(
        authApi.middleware
    )
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
