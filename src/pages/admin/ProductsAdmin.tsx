import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useProductMutations } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { Product, ProductStatus } from '../../types';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { formatPrice } from '../../lib/utils';

export default function ProductsAdmin() {
  const { products, loading, refetch } = useProducts({ includeCategory: true, limit: 100 });
  const { categories } = useCategories();
  const { deleteProduct, updateProduct } = useProductMutations();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setActionLoading(true);
    setActionError(null);
    const { error } = await deleteProduct(productToDelete.id);

    if (error) {
      setActionError(error);
    } else {
      refetch();
    }

    setActionLoading(false);
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleStatusChange = async (product: Product, newStatus: ProductStatus) => {
    setActionLoading(true);
    setActionError(null);
    const { error } = await updateProduct(product.id, { status: newStatus });
    if (error) {
      setActionError(error);
    } else {
      refetch();
    }
    setActionLoading(false);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name_en || '-';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark-green">Products</h1>
        <Link to="/admin/products/new">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      {actionError && (
        <div className="mb-4 bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="ml-4 font-bold">&times;</button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-dark-green/60">
            <p>No products yet. Add your first product!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-off-white-1">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-dark-green">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-off-white-2">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-off-white-1/50">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-off-white-1 rounded overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title_en}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-off-white-2">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark-green">
                        {product.title_en}
                      </p>
                      <p className="text-sm text-dark-green/60">
                        {product.title_mk}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-dark-green/80">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-4 py-3 text-dark-green font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={product.status}
                        onChange={(e) =>
                          handleStatusChange(product, e.target.value as ProductStatus)
                        }
                        disabled={actionLoading}
                        className="text-sm border border-off-white-2 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-dark-green"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
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
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
      >
        <p className="text-dark-green mb-6">
          Are you sure you want to delete "{productToDelete?.title_en}"? This action
          cannot be undone.
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
            disabled={actionLoading}
            className="flex-1"
          >
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
