import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { validateImageFile, compressImage, STORAGE_CACHE_OPTIONS } from '../lib/utils';
import { Testimonial } from '../types';

// Public hook for frontend - fetches active testimonials
export function useTestimonials() {
    const { data: testimonials = [], isLoading: loading, error } = useQuery({
        queryKey: ['testimonials'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('testimonials')
                .select('id,customer_name,customer_photo_url,customer_location_en,customer_location_mk,quote_en,quote_mk,rating,display_order')
                .eq('is_active', true)
                .order('display_order', { ascending: true });
            if (error) throw error;
            return (data as unknown as Testimonial[]) || [];
        },
    });

    return { testimonials, loading, error: error?.message ?? null };
}

// Admin hook - fetches all testimonials with refetch capability
export function useAdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTestimonials = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('testimonials')
                .select('*')
                .order('display_order', { ascending: true });

            if (fetchError) throw fetchError;
            setTestimonials((data as unknown as Testimonial[]) || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    return { testimonials, loading, error, refetch: fetchTestimonials };
}

// Mutations hook for CRUD operations
export function useTestimonialMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: createError } = await supabase
                .from('testimonials')
                .insert(testimonial)
                .select()
                .single();

            if (createError) throw createError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create testimonial';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: updateError } = await supabase
                .from('testimonials')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (updateError) throw updateError;
            return { data, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update testimonial';
            setError(errorMessage);
            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const deleteTestimonial = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { error: deleteError } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            return { error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete testimonial';
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const uploadPhoto = async (file: File): Promise<{ url: string | null; error: string | null }> => {
        const validationError = validateImageFile(file);
        if (validationError) {
            setError(validationError);
            return { url: null, error: validationError };
        }

        try {
            setLoading(true);
            setError(null);

            const compressed = await compressImage(file, 400);
            const fileExt = compressed.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `testimonials/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, compressed, STORAGE_CACHE_OPTIONS);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return { url: publicUrl, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload photo';
            setError(errorMessage);
            return { url: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        createTestimonial,
        updateTestimonial,
        deleteTestimonial,
        uploadPhoto,
        loading,
        error,
    };
}
