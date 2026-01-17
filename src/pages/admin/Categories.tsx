import { useState, FormEvent } from 'react';
import { useCategories, useCategoryMutations } from '../../hooks/useCategories';
import { Category } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
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
  });
  const [error, setError] = useState('');

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name_mk: '', name_en: '', slug: '' });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_mk: category.name_mk,
      name_en: category.name_en,
      slug: category.slug,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const slug = formData.slug || slugify(formData.name_en);

    if (editingCategory) {
      const { error } = await updateCategory(editingCategory.id, {
        ...formData,
        slug,
      });
      if (error) {
        setError(error);
        return;
      }
    } else {
      const { error } = await createCategory({
        ...formData,
        slug,
      });
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
                    Slug
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-dark-green">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-off-white-2">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-off-white-1/50">
                    <td className="px-4 py-3 font-medium text-dark-green">
                      {category.name_en}
                    </td>
                    <td className="px-4 py-3 text-dark-green/80">
                      {category.name_mk}
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
        <p className="text-dark-green mb-6">
          Are you sure you want to delete "{categoryToDelete?.name_en}"? Products in
          this category will have their category set to none.
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
