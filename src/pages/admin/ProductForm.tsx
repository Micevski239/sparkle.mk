import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useProductMutations } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { ProductStatus } from '../../types';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { product, loading: productLoading } = useProduct(id);
  const { categories } = useCategories();
  const { createProduct, updateProduct, uploadImage, loading: mutationLoading } = useProductMutations();

  const [formData, setFormData] = useState({
    title_mk: '',
    title_en: '',
    description_mk: '',
    description_en: '',
    price: '',
    sale_price: '',
    category_id: '',
    status: 'draft' as ProductStatus,
    image_url: '',
    is_on_sale: false,
    is_best_seller: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        title_mk: product.title_mk,
        title_en: product.title_en,
        description_mk: product.description_mk || '',
        description_en: product.description_en || '',
        price: product.price.toString(),
        sale_price: product.sale_price?.toString() || '',
        category_id: product.category_id || '',
        status: product.status,
        image_url: product.image_url || '',
        is_on_sale: product.is_on_sale || false,
        is_best_seller: product.is_best_seller || false,
      });
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    }
  }, [product]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    let imageUrl = formData.image_url;

    // Upload new image if selected
    if (imageFile) {
      const { url, error: uploadError } = await uploadImage(imageFile);
      if (uploadError) {
        setError(uploadError);
        return;
      }
      imageUrl = url || '';
    }

    const productData = {
      title_mk: formData.title_mk,
      title_en: formData.title_en,
      description_mk: formData.description_mk || null,
      description_en: formData.description_en || null,
      price: parseFloat(formData.price) || 0,
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      category_id: formData.category_id || null,
      status: formData.status,
      image_url: imageUrl || null,
      is_on_sale: formData.is_on_sale,
      is_best_seller: formData.is_best_seller,
    };

    if (isEditing && id) {
      const { error } = await updateProduct(id, productData);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const { error } = await createProduct(productData as any);
      if (error) {
        setError(error);
        return;
      }
    }

    navigate('/admin');
  };

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...categories.map((c) => ({ value: c.id, label: c.name_en })),
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'sold', label: 'Sold' },
  ];

  if (isEditing && productLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-green mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-dark-green mb-2">
              Product Image
            </label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 bg-off-white-1 rounded-lg overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-off-white-2"
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
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-dark-green
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-medium
                    file:bg-dark-green file:text-white
                    hover:file:bg-dark-green/90
                    cursor-pointer"
                />
                <p className="mt-2 text-sm text-dark-green/60">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Title MK */}
          <Input
            id="title_mk"
            name="title_mk"
            label="Title (Macedonian)"
            value={formData.title_mk}
            onChange={handleInputChange}
            placeholder="Наслов на производот"
            required
          />

          {/* Title EN */}
          <Input
            id="title_en"
            name="title_en"
            label="Title (English)"
            value={formData.title_en}
            onChange={handleInputChange}
            placeholder="Product title"
            required
          />

          {/* Description MK */}
          <Textarea
            id="description_mk"
            name="description_mk"
            label="Description (Macedonian)"
            value={formData.description_mk}
            onChange={handleInputChange}
            placeholder="Опис на производот..."
          />

          {/* Description EN */}
          <Textarea
            id="description_en"
            name="description_en"
            label="Description (English)"
            value={formData.description_en}
            onChange={handleInputChange}
            placeholder="Product description..."
          />

          {/* Price */}
          <Input
            id="price"
            name="price"
            type="number"
            label="Price (MKD)"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            step="1"
            required
          />

          {/* Sale Price */}
          <Input
            id="sale_price"
            name="sale_price"
            type="number"
            label="Sale Price (MKD) - Leave empty if not on sale"
            value={formData.sale_price}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            step="1"
          />

          {/* Category */}
          <Select
            id="category_id"
            name="category_id"
            label="Category"
            value={formData.category_id}
            onChange={handleInputChange}
            options={categoryOptions}
          />

          {/* Status */}
          <Select
            id="status"
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
          />

          {/* Product Flags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-green mb-2">
              Product Flags
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_on_sale"
                name="is_on_sale"
                checked={formData.is_on_sale}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_on_sale: e.target.checked }))}
                className="rounded border-off-white-2 text-dark-green focus:ring-dark-green"
              />
              <label htmlFor="is_on_sale" className="text-sm text-dark-green">
                On Sale (shows in Sale Items section on homepage)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_best_seller"
                name="is_best_seller"
                checked={formData.is_best_seller}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_best_seller: e.target.checked }))}
                className="rounded border-off-white-2 text-dark-green focus:ring-dark-green"
              />
              <label htmlFor="is_best_seller" className="text-sm text-dark-green">
                Best Seller (shows in Best Sellers section on homepage)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutationLoading}>
              {mutationLoading
                ? 'Saving...'
                : isEditing
                  ? 'Update Product'
                  : 'Create Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
