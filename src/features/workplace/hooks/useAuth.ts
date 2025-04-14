/**
 * Custom React hook that monitors and manages Firebase authentication state.
 *
 * @remarks
 * This hook sets up a listener for Firebase auth state changes. When the auth state changes,
 * it updates the local user state accordingly and sets the loading flag to false.
 *
 * @returns An object containing:
 *  - user: The current authenticated Firebase user, or null if no user is authenticated.
 *  - loading: A boolean indicating whether the authentication state is still loading.
 *
 * @example
 * const { user, loading } = useWorkplaceAuth();
 */

import { useState, useEffect } from 'react';
import { firebaseApp } from '../../../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { User } from 'firebase/auth';

const auth =  getAuth(firebaseApp);

export const useAuth = () => {
    // Manage the user state
    const [user, setUser] = useState<User | null>(null);
    // Manage the loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Firebase authentication state change monitoring
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        // Clean up the subscription
        return () => unsubscribe();
    }, []); 

    return { user, loading };
};
