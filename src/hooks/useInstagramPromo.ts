import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { InstagramPromo } from '../types';

// Public hook - fetches the single active record
export function useInstagramPromo() {
    const [promo, setPromo] = useState<InstagramPromo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPromo() {
            try {
                setLoading(true);
                setError(null);

                const { data, error: fetchError } = await supabase
                    .from('instagram_promo')
                    .select('*')
                    .eq('is_active', true)
                    .limit(1)
                    .single();

                if (fetchError) throw fetchError;
                setPromo(data as unknown as InstagramPromo);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch instagram promo');
            } finally {
                setLoading(false);
            }
        }

        fetchPromo();
    }, []);

    return { promo, loading, error };
}

// Admin hook - fetches the single record with refetch
export function useAdminInstagramPromo() {
    const [promo, setPromo] = useState<InstagramPromo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPromo = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('instagram_promo')
                .select('*')
                .limit(1)
                .single();

            if (fetchError) throw fetchError;
            setPromo(data as unknown as InstagramPromo);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch instagram promo');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPromo();
    }, [fetchPromo]);

    return { promo, loading, error, refetch: fetchPromo };
}

// Mutations hook - only update needed (single-row table)
export function useInstagramPromoMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updatePromo = async (id: string, updates: Partial<InstagramPromo>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('instagram_promo')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update instagram promo';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return { updatePromo, loading, error };
}
