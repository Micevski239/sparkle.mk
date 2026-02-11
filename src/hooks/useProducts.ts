import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
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

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const columns = 'id, title_mk, title_en, description_mk, description_en, price, sale_price, image_url, category_id, status, is_on_sale, is_best_seller, created_at';
      let query = supabase
        .from('products')
        .select(options.includeCategory ? `${columns}, category:categories(id, name_mk, name_en, slug)` : columns);

      // Apply sorting
      switch (options.sortBy) {
        case 'on_sale':
          query = query.order('is_on_sale', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name':
          query = query.order(options.language === 'mk' ? 'title_mk' : 'title_en', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options.categoryIds?.length) {
        query = query.in('category_id', options.categoryIds);
      }

      if (options.status) {
        if (Array.isArray(options.status)) {
          query = query.in('status', options.status);
        } else {
          query = query.eq('status', options.status);
        }
      }

      if (options.isBestSeller !== undefined) {
        query = query.eq('is_best_seller', options.isBestSeller);
      }

      if (options.isOnSale !== undefined) {
        query = query.eq('is_on_sale', options.isOnSale);
      }

      // Apply pagination
      if (options.offset !== undefined && options.limit !== undefined) {
        query = query.range(options.offset, options.offset + options.limit - 1);
      } else if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setProducts((data as unknown as Product[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [options.categoryId, JSON.stringify(options.categoryIds), JSON.stringify(options.status), options.includeCategory, options.isBestSeller, options.isOnSale, options.limit, options.offset, options.sortBy, options.language]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = options.pageSize || 12;

  const fetchProducts = useCallback(async (offset: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setProducts([]);
      }
      setError(null);

      const cols = 'id, title_mk, title_en, price, sale_price, image_url, category_id, status, is_on_sale, is_best_seller, created_at';
      let query = supabase
        .from('products')
        .select(`${cols}, category:categories(id, name_mk, name_en, slug)`, { count: 'exact' });

      // Apply sorting
      switch (options.sortBy) {
        case 'on_sale':
          query = query.order('is_on_sale', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });
          break;
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name':
          query = query.order(options.language === 'mk' ? 'title_mk' : 'title_en', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options.categoryIds?.length) {
        query = query.in('category_id', options.categoryIds);
      }

      if (options.status) {
        if (Array.isArray(options.status)) {
          query = query.in('status', options.status);
        } else {
          query = query.eq('status', options.status);
        }
      }

      query = query.range(offset, offset + pageSize - 1);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      const newProducts = (data as unknown as Product[]) || [];

      if (append) {
        setProducts((prev) => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setTotalCount(count || 0);
      setHasMore(offset + newProducts.length < (count || 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [options.categoryId, JSON.stringify(options.categoryIds), JSON.stringify(options.status), options.sortBy, pageSize, options.language]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchProducts(products.length, true);
    }
  }, [fetchProducts, products.length, loadingMore, hasMore]);

  const reset = useCallback(() => {
    fetchProducts(0, false);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts(0, false);
  }, [fetchProducts]);

  return {
    products,
    loading,
    loadingMore,
    error,
    totalCount,
    hasMore,
    loadMore,
    reset,
  };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('products')
          .select('id, title_mk, title_en, description_mk, description_en, price, sale_price, image_url, category_id, status, is_on_sale, is_best_seller, created_at, updated_at, category:categories(id, name_mk, name_en, slug)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data as unknown as Product);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
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
