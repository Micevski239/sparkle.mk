import { useState, FormEvent } from 'react';
import { useAdminWelcomeTiles, useWelcomeTileMutations } from '../../hooks/useHomepage';
import { WelcomeTile } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function WelcomeTiles() {
    const { tiles, loading, refetch } = useAdminWelcomeTiles();
    const { createTile, updateTile, deleteTile, uploadImage, loading: mutationLoading } = useWelcomeTileMutations();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTile, setEditingTile] = useState<WelcomeTile | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [tileToDelete, setTileToDelete] = useState<WelcomeTile | null>(null);

    const [formData, setFormData] = useState({
        image_url: '',
        label_en: '',
        label_mk: '',
        bg_color: '#333333',
        link_url: '/products',
        display_order: 0,
        is_active: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    const openCreateModal = () => {
        setEditingTile(null);
        setFormData({
            image_url: '',
            label_en: '',
            label_mk: '',
            bg_color: '#333333',
            link_url: '/products',
            display_order: tiles.length,
            is_active: true,
        });
        setImageFile(null);
        setImagePreview(null);
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (tile: WelcomeTile) => {
        setEditingTile(tile);
        setFormData({
            image_url: tile.image_url || '',
            label_en: tile.label_en,
            label_mk: tile.label_mk,
            bg_color: tile.bg_color,
            link_url: tile.link_url,
            display_order: tile.display_order,
            is_active: tile.is_active,
        });
        setImagePreview(tile.image_url);
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

        const tileData = {
            ...formData,
            image_url: imageUrl || null,
        };

        if (editingTile) {
            const { error } = await updateTile(editingTile.id, tileData);
            if (error) {
                setError(error);
                return;
            }
        } else {
            const { error } = await createTile(tileData);
            if (error) {
                setError(error);
                return;
            }
        }

        setIsModalOpen(false);
        refetch();
    };

    const handleDeleteClick = (tile: WelcomeTile) => {
        setTileToDelete(tile);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!tileToDelete) return;

        const { error } = await deleteTile(tileToDelete.id);

        if (!error) {
            refetch();
        }

        setDeleteModalOpen(false);
        setTileToDelete(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark-green">Welcome Tiles</h1>
                <Button onClick={openCreateModal}>+ Add Tile</Button>
            </div>

            {/* Tiles List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
                    </div>
                ) : tiles.length === 0 ? (
                    <div className="p-8 text-center text-dark-green/60">
                        <p>No welcome tiles yet. Add your first tile!</p>
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
                                        Label (EN)
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                                        Color
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                                        Link
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">
                                        Order
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
                                {tiles.map((tile) => (
                                    <tr key={tile.id} className="hover:bg-off-white-1/50">
                                        <td className="px-4 py-3">
                                            <div className="w-16 h-16 bg-off-white-1 rounded overflow-hidden">
                                                {tile.image_url ? (
                                                    <img
                                                        src={tile.image_url}
                                                        alt={tile.label_en}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-full h-full flex items-center justify-center text-white text-xs"
                                                        style={{ backgroundColor: tile.bg_color }}
                                                    >
                                                        No img
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-dark-green">
                                            {tile.label_en}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded border border-gray-200"
                                                    style={{ backgroundColor: tile.bg_color }}
                                                />
                                                <span className="text-sm text-dark-green/60">
                                                    {tile.bg_color}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-dark-green/80 text-sm">
                                            {tile.link_url}
                                        </td>
                                        <td className="px-4 py-3 text-dark-green/80">
                                            {tile.display_order}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${tile.is_active
                                                    ? 'bg-green/20 text-green'
                                                    : 'bg-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                {tile.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(tile)}
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
                                                    onClick={() => handleDeleteClick(tile)}
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
                title={editingTile ? 'Edit Welcome Tile' : 'Add Welcome Tile'}
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
                            Tile Image
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="w-24 h-24 bg-off-white-1 rounded-lg overflow-hidden flex items-center justify-center">
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
                                />
                            </div>
                        </div>
                    </div>

                    <Input
                        id="label_en"
                        label="Label (English)"
                        value={formData.label_en}
                        onChange={(e) => setFormData((prev) => ({ ...prev, label_en: e.target.value }))}
                        placeholder="Gift Ideas"
                        required
                    />

                    <Input
                        id="label_mk"
                        label="Label (Macedonian)"
                        value={formData.label_mk}
                        onChange={(e) => setFormData((prev) => ({ ...prev, label_mk: e.target.value }))}
                        placeholder="Идеи за подарок"
                        required
                    />

                    <div>
                        <label htmlFor="bg_color" className="block text-sm font-medium text-dark-green mb-1">
                            Label Background Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                id="bg_color"
                                value={formData.bg_color}
                                onChange={(e) => setFormData((prev) => ({ ...prev, bg_color: e.target.value }))}
                                className="w-12 h-10 rounded border border-off-white-2 cursor-pointer"
                            />
                            <Input
                                id="bg_color_text"
                                value={formData.bg_color}
                                onChange={(e) => setFormData((prev) => ({ ...prev, bg_color: e.target.value }))}
                                placeholder="#333333"
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <Input
                        id="link_url"
                        label="Link URL"
                        value={formData.link_url}
                        onChange={(e) => setFormData((prev) => ({ ...prev, link_url: e.target.value }))}
                        placeholder="/products?category=gifts"
                        required
                    />

                    <Input
                        id="display_order"
                        type="number"
                        label="Display Order"
                        value={formData.display_order.toString()}
                        onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                        min="0"
                    />

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
                                : editingTile
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
                title="Delete Welcome Tile"
            >
                <p className="text-dark-green mb-6">
                    Are you sure you want to delete "{tileToDelete?.label_en}"? This action cannot be undone.
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
