/**
 * Custom hook that manages the authentication state of the user.
 * 
 * This hook listens for changes in the authentication state using Firebase's `onAuthStateChanged` method.
 * When the authentication state changes, it dispatches either a login or logout action to the Redux store.
 * 
 * @returns {void}
 * 
 * @example
 * // Usage in a component
 * const MyComponent = () => {
 *   useAuthState();
 *   // Component logic here
 * };
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from './Auth';
import { login, logout } from '../users/userSlice';
import { updateUser } from '../users/userAPI';

const useAuthState = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Listen for changes in the authentication state
        const unsubscribe = auth.onAuthStateChanged((loginUser) => {
            if (loginUser) {
                dispatch(login(loginUser.uid));
                // FirestoreのUserコレクションを更新
                updateUser({
                    uid: loginUser.uid,
                    user: {
                        displayName: loginUser.displayName ?? '',
                        email: loginUser.email ?? '',
                        profile_picture: loginUser.photoURL ?? '',
                        isOnline: true
                    }
                });
            } else {
                dispatch(logout());
            }
        });

        // Unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, [dispatch]);

    return;
}

export default useAuthState;