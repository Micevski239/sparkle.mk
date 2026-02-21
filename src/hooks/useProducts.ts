import { useState, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { validateImageFile } from '../lib/utils';
import { Product, ProductStatus, SortOption } from '../types';

interface UseProductsOptions {
  categoryId?: string | null;
  categoryIds?: string[];
  status?: ProductStatus | ProductStatus[];
  includeCategory?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: SortOption;
  language?: 'mk' | 'en';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyProductSort(query: any, sortBy?: SortOption, language?: string) {
  switch (sortBy) {
    case 'on_sale':
      return query.order('is_on_sale', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });
    case 'price_asc':
      return query.order('price', { ascending: true });
    case 'price_desc':
      return query.order('price', { ascending: false });
    case 'name':
      return query.order(language === 'mk' ? 'title_mk' : 'title_en', { ascending: true });
    case 'newest':
    default:
      return query.order('created_at', { ascending: false });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyProductFilters(
  query: any,
  options: { categoryId?: string | null; categoryIds?: string[]; status?: ProductStatus | ProductStatus[]; isBestSeller?: boolean; isOnSale?: boolean }
) {
  let q = query;
  if (options.categoryId) {
    q = q.eq('category_id', options.categoryId);
  }
  if (options.categoryIds?.length) {
    q = q.in('category_id', options.categoryIds);
  }
  if (options.status) {
    if (Array.isArray(options.status)) {
      q = q.in('status', options.status);
    } else {
      q = q.eq('status', options.status);
    }
  }
  if (options.isBestSeller !== undefined) {
    q = q.eq('is_best_seller', options.isBestSeller);
  }
  if (options.isOnSale !== undefined) {
    q = q.eq('is_on_sale', options.isOnSale);
  }
  return q;
}

export function useProducts(options: UseProductsOptions = {}) {
  const queryKey = [
    'products',
    options.categoryId,
    options.categoryIds,
    options.status,
    options.includeCategory,
    options.isBestSeller,
    options.isOnSale,
    options.limit,
    options.offset,
    options.sortBy,
    options.language,
  ];

  const { data: products = [], isLoading: loading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(options.includeCategory
          ? 'id,title_mk,title_en,price,sale_price,image_url,status,is_best_seller,is_on_sale,category_id,created_at,category:categories(id,name_mk,name_en,slug)'
          : 'id,title_mk,title_en,price,sale_price,image_url,status,is_best_seller,is_on_sale,category_id,created_at');

      query = applyProductSort(query, options.sortBy, options.language);
      query = applyProductFilters(query, options);

      if (options.offset !== undefined && options.limit !== undefined) {
        query = query.range(options.offset, options.offset + options.limit - 1);
      } else if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown as Product[]) || [];
    },
  });

  return { products, loading, error: error?.message ?? null, refetch };
}

// Hook for paginated products with Load More functionality
interface UsePaginatedProductsOptions {
  categoryId?: string | null;
  categoryIds?: string[];
  status?: ProductStatus | ProductStatus[];
  sortBy?: SortOption;
  pageSize?: number;
  language?: 'mk' | 'en';
}

export function usePaginatedProducts(options: UsePaginatedProductsOptions = {}) {
  const pageSize = options.pageSize || 12;

  const queryKey = [
    'products-paginated',
    options.categoryId,
    options.categoryIds,
    options.status,
    options.sortBy,
    options.language,
    pageSize,
  ];

  const {
    data,
    isLoading: loading,
    isFetchingNextPage: loadingMore,
    error,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('products')
        .select('id,title_mk,title_en,description_mk,description_en,price,sale_price,image_url,status,is_best_seller,is_on_sale,category_id,created_at,category:categories(id,name_mk,name_en,slug)');

      query = applyProductSort(query, options.sortBy, options.language);
      query = applyProductFilters(query, options);

      // Fetch pageSize + 1 to determine hasMore
      query = query.range(pageParam, pageParam + pageSize);

      const { data, error } = await query;
      if (error) throw error;

      const fetched = (data as unknown as Product[]) || [];
      const hasMore = fetched.length > pageSize;
      const items = hasMore ? fetched.slice(0, pageSize) : fetched;

      return { items, nextOffset: hasMore ? pageParam + pageSize : undefined };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });

  const products = data?.pages.flatMap((p) => p.items) ?? [];

  const loadMore = useCallback(() => {
    if (!loadingMore && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, loadingMore, hasNextPage]);

  return {
    products,
    loading,
    loadingMore,
    error: error?.message ?? null,
    totalCount: products.length + (hasNextPage ? 1 : 0),
    hasMore: !!hasNextPage,
    loadMore,
    reset: () => {},
  };
}

export function useProduct(id: string | undefined) {
  const { data: product = null, isLoading: loading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as unknown as Product;
    },
    enabled: !!id,
  });

  return { product, loading, error: error?.message ?? null };
}

export function useProductMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (createError) throw createError;
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
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

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

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
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    loading,
    error,
  };
}
