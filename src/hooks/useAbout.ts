import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { validateImageFile, compressImage, STORAGE_CACHE_OPTIONS } from '../lib/utils';
import { AboutStat, AboutContent, AboutGalleryImage } from '../types';

// Public hooks for frontend — powered by TanStack Query

export function useAboutStats() {
    const { data: stats = [], isLoading: loading, error } = useQuery({
        queryKey: ['about-stats'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('about_stats')
                .select('id,value,label_en,label_mk,display_order')
                .eq('is_active', true)
                .order('display_order', { ascending: true });
            if (error) throw error;
            return (data as unknown as AboutStat[]) || [];
        },
    });

    return { stats, loading, error: error?.message ?? null };
}

export function useAboutContent() {
    const { data: content = { main: null, quote: null }, isLoading: loading, error } = useQuery({
        queryKey: ['about-content'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('about_content')
                .select('id,section,title_en,title_mk,subtitle_en,subtitle_mk,description_en,description_mk,founder_name,signature_url');
            if (error) throw error;
            const contentData = data as unknown as AboutContent[];
            return {
                main: contentData?.find(c => c.section === 'main') || null,
                quote: contentData?.find(c => c.section === 'quote') || null,
            };
        },
    });

    return { content, loading, error: error?.message ?? null };
}

export function useAboutGallery() {
    const { data: images = [], isLoading: loading, error } = useQuery({
        queryKey: ['about-gallery'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('about_gallery')
                .select('id,image_url,alt_en,alt_mk,display_order')
                .eq('is_active', true)
                .order('display_order', { ascending: true });
            if (error) throw error;
            return (data as unknown as AboutGalleryImage[]) || [];
        },
    });

    return { images, loading, error: error?.message ?? null };
}

// Admin hooks

export function useAdminAboutStats() {
    const [stats, setStats] = useState<AboutStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('about_stats')
                .select('*')
                .order('display_order', { ascending: true });

            if (fetchError) throw fetchError;
            setStats((data as unknown as AboutStat[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch about stats');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}

export function useAdminAboutContent() {
    const [content, setContent] = useState<AboutContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('about_content')
                .select('*');

            if (fetchError) throw fetchError;
            setContent((data as unknown as AboutContent[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch about content');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return { content, loading, error, refetch: fetchContent };
}

export function useAdminAboutGallery() {
    const [images, setImages] = useState<AboutGalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('about_gallery')
                .select('*')
                .order('display_order', { ascending: true });

            if (fetchError) throw fetchError;
            setImages((data as unknown as AboutGalleryImage[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch about gallery');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    return { images, loading, error, refetch: fetchImages };
}

// Mutations for about stats
export function useAboutStatMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createStat = async (stat: Omit<AboutStat, 'id' | 'created_at'>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: createError } = await supabase
                .from('about_stats')
                .insert(stat)
                .select()
                .single();

            if (createError) throw createError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create stat';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateStat = async (id: string, updates: Partial<AboutStat>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('about_stats')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update stat';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const deleteStat = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error: deleteError } = await supabase
                .from('about_stats')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            return { error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete stat';
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        createStat,
        updateStat,
        deleteStat,
        loading,
        error,
    };
}

// Mutations for about content
export function useAboutContentMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateContent = async (id: string, updates: Partial<AboutContent>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('about_content')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update content';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file: File, folder: string = 'about'): Promise<{ url: string | null; error: string | null }> => {
        const validationError = validateImageFile(file);
        if (validationError) {
            setError(validationError);
            return { url: null, error: validationError };
        }

        try {
            setLoading(true);
            setError(null);

            const compressed = await compressImage(file);
            const fileExt = compressed.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, compressed, STORAGE_CACHE_OPTIONS);

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
        updateContent,
        uploadImage,
        loading,
        error,
    };
}

// Mutations for about gallery
export function useAboutGalleryMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createImage = async (image: Omit<AboutGalleryImage, 'id' | 'created_at'>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: createError } = await supabase
                .from('about_gallery')
                .insert(image)
                .select()
                .single();

            if (createError) throw createError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create gallery image';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateImage = async (id: string, updates: Partial<AboutGalleryImage>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('about_gallery')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update gallery image';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const deleteImage = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error: deleteError } = await supabase
                .from('about_gallery')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            return { error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete gallery image';
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file: File): Promise<{ url: string | null; error: string | null }> => {
        const validationError = validateImageFile(file);
        if (validationError) {
            setError(validationError);
            return { url: null, error: validationError };
        }

        try {
            setLoading(true);
            setError(null);

            const [compressed, thumbnail] = await Promise.all([
              compressImage(file),
              compressImage(file, 400, 0.75),
            ]);
            const fileExt = compressed.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `about-gallery/${fileName}`;
            const thumbPath = `about-gallery/thumb/${fileName}`;

            const [mainResult, thumbResult] = await Promise.all([
              supabase.storage.from('product-images').upload(filePath, compressed, STORAGE_CACHE_OPTIONS),
              supabase.storage.from('product-images').upload(thumbPath, thumbnail, STORAGE_CACHE_OPTIONS),
            ]);

            if (mainResult.error) throw mainResult.error;
            if (thumbResult.error) console.warn('Thumbnail upload failed:', thumbResult.error);

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
        createImage,
        updateImage,
        deleteImage,
        uploadImage,
        loading,
        error,
    };
}
