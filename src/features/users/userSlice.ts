/**
 * A slice for managing user status.
 *
 * @remarks.
 * This slice handles user login and logout actions.
 *
 * @packageDocumentation.
 */


 
import {createSlice} from '@reduxjs/toolkit';
import {signInWithGoogle} from '../auth/Auth.ts';
import {getUser, postUser} from './userAPI.ts';
import {User} from '../../type/User.ts';

const initialState = {
    userId: ""
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
    }
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;