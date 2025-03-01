import { useState, useEffect } from 'react';
import { useAuth } from './useAuth.ts';
import { workplaceApi } from '../api/workplaceApi.ts';
import { Workplace } from '../types/workplace.ts';

/**
 * Custom React hook that fetches and manages workplace data.
 * This hook handles:
 * - Fetching workplaces from the API
 * - Managing loading states during API calls
 * - Error handling for failed requests
 * - Maintaining workplace data in local state
 * 
 * @returns {Object} Object containing:
 * - workplaces: Array of workplace objects
 * - loading: Boolean indicating if data is being fetched
 * - error: Error object if request fails, null otherwise
 */
export const useWorkplaces = () => {
    const { user } = useAuth();
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchWorkplaces = async () => {
            try {
                const data = await workplaceApi.listWorkplaces(user.uid);
                setWorkplaces(data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchWorkplaces();
    }, [user]);

    return { workplaces, loading, error };
}