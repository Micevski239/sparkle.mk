import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

// Utility function to build category tree from flat list
export function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const roots: Category[] = [];

  // First pass: create a map of all categories with empty subcategories arrays
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, subcategories: [] });
  });

  // Second pass: build the tree structure
  categories.forEach((cat) => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      const parent = categoryMap.get(cat.parent_id)!;
      parent.subcategories = parent.subcategories || [];
      parent.subcategories.push(category);
    } else {
      roots.push(category);
    }
  });

  // Sort by display_order at each level
  const sortByOrder = (cats: Category[]) => {
    cats.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    cats.forEach((cat) => {
      if (cat.subcategories?.length) {
        sortByOrder(cat.subcategories);
      }
    });
  };
  sortByOrder(roots);

  return roots;
}

export function useCategories() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })
        .order(language === 'mk' ? 'name_mk' : 'name_en', { ascending: true });

      if (fetchError) throw fetchError;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

// Hook to get categories with product counts and tree structure
export function useCategoriesWithCounts() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoriesWithCounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })
        .order(language === 'mk' ? 'name_mk' : 'name_en', { ascending: true });

      if (catError) throw catError;

      // Fetch product counts per category (only published products)
      const { data: countsData, error: countsError } = await supabase
        .from('products')
        .select('category_id')
        .in('status', ['published', 'sold']);

      if (countsError) throw countsError;

      // Count products per category
      const countMap = new Map<string, number>();
      countsData?.forEach((product) => {
        if (product.category_id) {
          countMap.set(product.category_id, (countMap.get(product.category_id) || 0) + 1);
        }
      });

      // Add counts to categories
      const categoriesWithCounts = (categoriesData || []).map((cat) => ({
        ...cat,
        productCount: countMap.get(cat.id) || 0,
      }));

      setCategories(categoriesWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchCategoriesWithCounts();
  }, [fetchCategoriesWithCounts]);

  // Build tree from flat list
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

  // Calculate total product count including subcategories
  const getTotalCount = useCallback((category: Category): number => {
    let count = category.productCount || 0;
    if (category.subcategories) {
      category.subcategories.forEach((sub) => {
        count += getTotalCount(sub);
      });
    }
    return count;
  }, []);

  return {
    categories,
    categoryTree,
    loading,
    error,
    refetch: fetchCategoriesWithCounts,
    getTotalCount,
  };
}

export function useCategoryMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (createError) throw createError;
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading,
    error,
  };
}
