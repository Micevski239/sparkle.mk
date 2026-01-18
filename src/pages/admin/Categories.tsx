import { useState, FormEvent, useMemo } from 'react';
import { useCategories, useCategoryMutations, buildCategoryTree } from '../../hooks/useCategories';
import { Category } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import { slugify } from '../../lib/utils';

export default function Categories() {
  const { categories, loading, refetch } = useCategories();
  const { createCategory, updateCategory, deleteCategory, loading: mutationLoading } = useCategoryMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name_mk: '',
    name_en: '',
    slug: '',
    parent_id: '',
    display_order: 0,
  });
  const [error, setError] = useState('');

  // Build category tree for display
  const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

  // Get parent category options (exclude current category and its children when editing)
  const parentOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [
      { value: '', label: '— No Parent (Top Level) —' },
    ];

    const getChildIds = (cat: Category): string[] => {
      const ids = [cat.id];
      if (cat.subcategories) {
        cat.subcategories.forEach((sub) => {
          ids.push(...getChildIds(sub));
        });
      }
      return ids;
    };

    const excludeIds = editingCategory
      ? getChildIds(categoryTree.find((c) => c.id === editingCategory.id) || editingCategory)
      : [];

    const addOptions = (cats: Category[], prefix: string = '') => {
      cats.forEach((cat) => {
        if (!excludeIds.includes(cat.id)) {
          options.push({
            value: cat.id,
            label: `${prefix}${cat.name_en}`,
          });
          if (cat.subcategories) {
            addOptions(cat.subcategories, `${prefix}  `);
          }
        }
      });
    };

    addOptions(categoryTree);
    return options;
  }, [categories, categoryTree, editingCategory]);

  // Flatten categories for table display with indentation info
  const flattenedCategories = useMemo(() => {
    const result: { category: Category; level: number }[] = [];

    const flatten = (cats: Category[], level: number = 0) => {
      cats.forEach((cat) => {
        result.push({ category: cat, level });
        if (cat.subcategories) {
          flatten(cat.subcategories, level + 1);
        }
      });
    };

    flatten(categoryTree);
    return result;
  }, [categoryTree]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name_mk: '', name_en: '', slug: '', parent_id: '', display_order: 0 });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_mk: category.name_mk,
      name_en: category.name_en,
      slug: category.slug,
      parent_id: category.parent_id || '',
      display_order: category.display_order || 0,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const slug = formData.slug || slugify(formData.name_en);
    const categoryData = {
      name_mk: formData.name_mk,
      name_en: formData.name_en,
      slug,
      parent_id: formData.parent_id || null,
      display_order: formData.display_order,
    };

    if (editingCategory) {
      const { error } = await updateCategory(editingCategory.id, categoryData);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const { error } = await createCategory(categoryData);
      if (error) {
        setError(error);
        return;
      }
    }

    setIsModalOpen(false);
    refetch();
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    const { error } = await deleteCategory(categoryToDelete.id);

    if (!error) {
      refetch();
    }

    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleNameEnChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name_en: value,
      slug: slugify(value),
    }));
  };

  // Get parent category name for display
  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId) return null;
    const parent = categories.find((c) => c.id === parentId);
    return parent?.name_en || null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark-green">Categories</h1>
        <Button onClick={openCreateModal}>+ Add Category</Button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-dark-green/60">
            <p>No categories yet. Add your first category!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-off-white-1">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Name (EN)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Name (MK)
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Parent
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-dark-green">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-off-white-2">
                {flattenedCategories.map(({ category, level }) => (
                  <tr key={category.id} className="hover:bg-off-white-1/50">
                    <td className="px-4 py-3 font-medium text-dark-green">
                      <span style={{ paddingLeft: `${level * 24}px` }} className="flex items-center gap-2">
                        {level > 0 && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        {category.name_en}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-dark-green/80">
                      {category.name_mk}
                    </td>
                    <td className="px-4 py-3 text-dark-green/60 text-sm">
                      {getParentName(category.parent_id) || '—'}
                    </td>
                    <td className="px-4 py-3 text-dark-green/60 text-sm">
                      {category.display_order || 0}
                    </td>
                    <td className="px-4 py-3 text-dark-green/60 text-sm">
                      {category.slug}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-dark-green hover:text-red-1 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="text-dark-green hover:text-red-1 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Input
            id="name_en"
            label="Name (English)"
            value={formData.name_en}
            onChange={(e) => handleNameEnChange(e.target.value)}
            placeholder="Category name"
            required
          />

          <Input
            id="name_mk"
            label="Name (Macedonian)"
            value={formData.name_mk}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name_mk: e.target.value }))
            }
            placeholder="Име на категорија"
            required
          />

          <Select
            id="parent_id"
            label="Parent Category"
            value={formData.parent_id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, parent_id: e.target.value }))
            }
            options={parentOptions}
          />

          <Input
            id="display_order"
            label="Display Order"
            type="number"
            value={formData.display_order.toString()}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                display_order: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="0"
          />

          <Input
            id="slug"
            label="Slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            placeholder="category-slug"
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutationLoading} className="flex-1">
              {mutationLoading
                ? 'Saving...'
                : editingCategory
                ? 'Update'
                : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Category"
      >
        <p className="text-dark-green mb-4">
          Are you sure you want to delete "{categoryToDelete?.name_en}"?
        </p>
        {categoryToDelete?.parent_id === null && categories.some((c) => c.parent_id === categoryToDelete?.id) && (
          <p className="text-amber-600 text-sm mb-4">
            Warning: This category has subcategories. Deleting it will also delete all subcategories.
          </p>
        )}
        <p className="text-dark-green/70 text-sm mb-6">
          Products in this category will have their category set to none.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModalOpen(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={mutationLoading}
            className="flex-1"
          >
            {mutationLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
