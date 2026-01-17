import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { HomepageHeroSlide, HomepageGridImage } from '../types';

// Public hooks for frontend
export function useHomepageHeroSlides() {
    const [slides, setSlides] = useState<HomepageHeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSlides() {
            try {
                setLoading(true);
                setError(null);

                const { data, error: fetchError } = await supabase
                    .from('homepage_hero_slides')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (fetchError) throw fetchError;
                setSlides((data as unknown as HomepageHeroSlide[]) || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch hero slides');
            } finally {
                setLoading(false);
            }
        }

        fetchSlides();
    }, []);

    return { slides, loading, error };
}

export function useHomepageGridImages() {
    const [images, setImages] = useState<HomepageGridImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImages() {
            try {
                setLoading(true);
                setError(null);

                const { data, error: fetchError } = await supabase
                    .from('homepage_grid_images')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (fetchError) throw fetchError;
                setImages((data as unknown as HomepageGridImage[]) || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch grid images');
            } finally {
                setLoading(false);
            }
        }

        fetchImages();
    }, []);

    return { images, loading, error };
}

// Admin hooks for managing content
export function useAdminHeroSlides() {
    const [slides, setSlides] = useState<HomepageHeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSlides = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('homepage_hero_slides')
                .select('*')
                .order('order_index', { ascending: true });

            if (fetchError) throw fetchError;
            setSlides((data as unknown as HomepageHeroSlide[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch hero slides');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSlides();
    }, [fetchSlides]);

    return { slides, loading, error, refetch: fetchSlides };
}

export function useAdminGridImages() {
    const [images, setImages] = useState<HomepageGridImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('homepage_grid_images')
                .select('*')
                .order('order_index', { ascending: true });

            if (fetchError) throw fetchError;
            setImages((data as unknown as HomepageGridImage[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch grid images');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    return { images, loading, error, refetch: fetchImages };
}

// Mutations for hero slides
export function useHeroSlideMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createHeroSlide = async (slide: Omit<HomepageHeroSlide, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: createError } = await supabase
                .from('homepage_hero_slides')
                .insert(slide)
                .select()
                .single();

            if (createError) throw createError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create hero slide';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateHeroSlide = async (id: string, updates: Partial<HomepageHeroSlide>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('homepage_hero_slides')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update hero slide';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const deleteHeroSlide = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error: deleteError } = await supabase
                .from('homepage_hero_slides')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            return { error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete hero slide';
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
        try {
            setLoading(true);
            setError(null);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `homepage/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return { url: publicUrl, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setError(errorMessage);
            return { url: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        createHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        uploadImage,
        loading,
        error,
    };
}

// Mutations for grid images
export function useGridImageMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createGridImage = async (image: Omit<HomepageGridImage, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: createError } = await supabase
                .from('homepage_grid_images')
                .insert(image)
                .select()
                .single();

            if (createError) throw createError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create grid image';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateGridImage = async (id: string, updates: Partial<HomepageGridImage>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('homepage_grid_images')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update grid image';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const deleteGridImage = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error: deleteError } = await supabase
                .from('homepage_grid_images')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            return { error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete grid image';
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
        try {
            setLoading(true);
            setError(null);

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `homepage/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return { url: publicUrl, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setError(errorMessage);
            return { url: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        createGridImage,
        updateGridImage,
        deleteGridImage,
        uploadImage,
        loading,
        error,
    };
}
