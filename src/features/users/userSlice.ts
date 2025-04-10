/**
 * A slice for managing user status.
 *
 * @remarks.
 * This slice handles user login and logout actions.
 *
 * @packageDocumentation.
 */


 
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {signInWithGoogle} from '../auth/Auth.ts';
import {getUser, postUser, fetchUsers } from './userAPI.ts';
import {User, UserRef} from '../../type/User.ts';
import { create } from '@mui/material/styles/createTransitions.js';

interface UserState {
    userId: string;
    users: UserRef[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    userId: "",
    users: [],
    loading: false,
    error: null,
}

/**
 * Function to sign in with Google and set up a user account.
 *
 * @returns {Promise<string>} Promise containing the user ID.
 */
export const googleSignInAndUserSetup = async () => {
    try {
        const result = await signInWithGoogle();
        const login_user = result.user;
        const user = await getUser(login_user.uid);

        if (!user) {
            const newUser: User = {
                profile_picture: login_user.photoURL ?? "",
                email: login_user.email ?? "",
                displayName: login_user.displayName ?? "",
                isOnline: true,
            }
            await postUser({
                uid: login_user.uid,
                user: newUser
            })
        }
        return login_user.uid;
    } catch (error) {
        console.error('Login failed:', error);
}
}

export const fetchUsersAsync = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        return await fetchUsers();
    }
);

/**
 * Slice to manage user IDs.
 *
 * @param {string} name - Name of the slice.
 * @param {object} initialState - Initial state of the slice.
 * @param {object} reducers - reducers for the slice.
 * @param {function} reducers.login - Reducer to set the user ID.
 * @param {function} reducers.logout - reducer for clearing user id.
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsersAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load users';
            });
    }
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;