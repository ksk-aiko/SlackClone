import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice.ts";

/**
 * Reduxストアを設定します。
 * 
 * このストアは、`user`リデューサーを含む単一のリデューサーを持ちます。
 * 
 * @constant
 * @type {Store}
 */
export const store = configureStore({
    reducer: {
        user: userReducer
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;