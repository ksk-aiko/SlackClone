import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    userId: ""
}

/**
 * ユーザーの状態を管理するためのスライス。
 * 
 * @remarks
 * このスライスはユーザーのログインおよびログアウトのアクションを処理します。
 * 
 * @packageDocumentation
 */

/**
 * ユーザーIDを管理するためのスライス。
 * 
 * @param {string} name - スライスの名前。
 * @param {object} initialState - スライスの初期状態。
 * @param {object} reducers - スライスのリデューサー。
 * @param {function} reducers.login - ユーザーIDを設定するためのリデューサー。
 * @param {function} reducers.logout - ユーザーIDをクリアするためのリデューサー。
 */
const userSlice = createSlice({
    name: "userId",
    initialState,
    reducers: {
        login: (state, action) => {
            state.userId = action.payload;
        },
        logout: (state) => {
            state.userId = "";
        }
    }
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;