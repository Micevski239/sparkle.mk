import { useState, FormEvent } from 'react';
import { useAdminGridImages, useGridImageMutations } from '../../hooks/useHomepage';
import { HomepageGridImage } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function GridImages() {
    const { images, loading, refetch } = useAdminGridImages();
    const { createGridImage, updateGridImage, deleteGridImage, uploadImage, loading: mutationLoading } = useGridImageMutations();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<HomepageGridImage | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<HomepageGridImage | null>(null);

    const [formData, setFormData] = useState({
        image_url: '',
        link_url: '',
        order_index: 0,
        is_featured: false,
        is_active: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    const openCreateModal = () => {
        setEditingImage(null);
        setFormData({
            image_url: '',
            link_url: '',
            order_index: images.length,
            is_featured: false,
            is_active: true,
        });
        setImageFile(null);
        setImagePreview(null);
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (image: HomepageGridImage) => {
        setEditingImage(image);
        setFormData({
            image_url: image.image_url,
            link_url: image.link_url || '',
            order_index: image.order_index,
            is_featured: image.is_featured,
            is_active: image.is_active,
        });
        setImagePreview(image.image_url);
        setImageFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const imageData = {
            ...formData,
            image_url: imageUrl,
            link_url: formData.link_url || null,
        };

        if (editingImage) {
            const { error } = await updateGridImage(editingImage.id, imageData);
            if (error) {
                setError(error);
                return;
            }
        } else {
            const { error } = await createGridImage(imageData);
            if (error) {
                setError(error);
                return;
            }
        }

        setIsModalOpen(false);
        refetch();
    };

    const handleDeleteClick = (image: HomepageGridImage) => {
        setImageToDelete(image);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!imageToDelete) return;

        const { error } = await deleteGridImage(imageToDelete.id);

        if (!error) {
            refetch();
        }

        setDeleteModalOpen(false);
        setImageToDelete(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark-green">Grid Images</h1>
                <Button onClick={openCreateModal}>+ Add Image</Button>
            </div>

            {/* Images List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
                    </div>
                ) : images.length === 0 ? (
                    <div className="p-8 text-center text-dark-green/60">
                        <p>No grid images yet. Add your first image!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-off-white-1">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                                        Preview
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                                        Link
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                                        Featured
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
                                {images.map((image) => (
                                    <tr key={image.id} className="hover:bg-off-white-1/50">
                                        <td className="px-4 py-3">
                                            <div className="w-24 h-16 bg-off-white-1 rounded overflow-hidden">
                                                <img
                                                    src={image.image_url}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-dark-green/80 text-sm">
                                            {image.link_url || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-dark-green/80">
                                            {image.order_index}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${image.is_featured
                                                    ? 'bg-red-1/20 text-red-1'
                                                    : 'bg-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                {image.is_featured ? 'Featured' : '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${image.is_active
                                                    ? 'bg-green/20 text-green'
                                                    : 'bg-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                {image.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(image)}
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
                                                    onClick={() => handleDeleteClick(image)}
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
                title={editingImage ? 'Edit Grid Image' : 'Add Grid Image'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-dark-green mb-2">
                            Image
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="w-32 h-20 bg-off-white-1 rounded-lg overflow-hidden flex items-center justify-center">
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
                                    Or enter image URL:
                                </p>
                                <Input
                                    id="image_url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Input
                        id="link_url"
                        label="Link URL (optional)"
                        value={formData.link_url}
                        onChange={(e) => setFormData((prev) => ({ ...prev, link_url: e.target.value }))}
                        placeholder="/products or https://example.com"
                    />

                    <Input
                        id="order_index"
                        type="number"
                        label="Order Index"
                        value={formData.order_index.toString()}
                        onChange={(e) => setFormData((prev) => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                        min="0"
                    />

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                                className="rounded border-off-white-2 text-dark-green focus:ring-dark-green"
                            />
                            <label htmlFor="is_featured" className="text-sm text-dark-green">
                                Featured (takes 50% width, spans 2 rows)
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                                className="rounded border-off-white-2 text-dark-green focus:ring-dark-green"
                            />
                            <label htmlFor="is_active" className="text-sm text-dark-green">
                                Active (visible on homepage)
                            </label>
                        </div>
                    </div>

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
                                : editingImage
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
                title="Delete Grid Image"
            >
                <p className="text-dark-green mb-6">
                    Are you sure you want to delete this grid image? This action cannot be undone.
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
