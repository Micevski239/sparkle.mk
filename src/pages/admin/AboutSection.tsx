import { useState, FormEvent } from 'react';
import {
    useAdminAboutStats,
    useAdminAboutContent,
    useAdminAboutGallery,
    useAboutStatMutations,
    useAboutContentMutations,
    useAboutGalleryMutations,
} from '../../hooks/useAbout';
import { AboutStat, AboutGalleryImage } from '../../types';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

type TabType = 'content' | 'stats' | 'gallery';

export default function AboutSectionAdmin() {
    const [activeTab, setActiveTab] = useState<TabType>('content');

    const tabs: { id: TabType; label: string }[] = [
        { id: 'content', label: 'Content' },
        { id: 'stats', label: 'Stats' },
        { id: 'gallery', label: 'Gallery' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-dark-green mb-6">About Section</h1>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b border-off-white-2">
                    <nav className="flex gap-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-dark-green text-dark-green'
                                    : 'border-transparent text-dark-green/60 hover:text-dark-green'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'content' && <ContentTab />}
                    {activeTab === 'stats' && <StatsTab />}
                    {activeTab === 'gallery' && <GalleryTab />}
                </div>
            </div>
        </div>
    );
}

// Content Tab Component
function ContentTab() {
    const { content, loading, refetch } = useAdminAboutContent();
    const { updateContent, uploadImage, loading: mutationLoading } = useAboutContentMutations();

    const mainContent = content.find((c) => c.section === 'main');
    const quoteContent = content.find((c) => c.section === 'quote');

    const [mainForm, setMainForm] = useState({
        title_en: '',
        title_mk: '',
        subtitle_en: '',
        subtitle_mk: '',
        description_en: '',
        description_mk: '',
    });

    const [quoteForm, setQuoteForm] = useState({
        title_en: '',
        title_mk: '',
        founder_name: '',
        signature_url: '',
    });

    const [signatureFile, setSignatureFile] = useState<File | null>(null);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Load data when content is fetched
    useState(() => {
        if (mainContent) {
            setMainForm({
                title_en: mainContent.title_en || '',
                title_mk: mainContent.title_mk || '',
                subtitle_en: mainContent.subtitle_en || '',
                subtitle_mk: mainContent.subtitle_mk || '',
                description_en: mainContent.description_en || '',
                description_mk: mainContent.description_mk || '',
            });
        }
        if (quoteContent) {
            setQuoteForm({
                title_en: quoteContent.title_en || '',
                title_mk: quoteContent.title_mk || '',
                founder_name: quoteContent.founder_name || '',
                signature_url: quoteContent.signature_url || '',
            });
            setSignaturePreview(quoteContent.signature_url);
        }
    });

    // Update forms when data loads
    if (!loading && mainContent && mainForm.title_en === '' && mainContent.title_en) {
        setMainForm({
            title_en: mainContent.title_en || '',
            title_mk: mainContent.title_mk || '',
            subtitle_en: mainContent.subtitle_en || '',
            subtitle_mk: mainContent.subtitle_mk || '',
            description_en: mainContent.description_en || '',
            description_mk: mainContent.description_mk || '',
        });
    }

    if (!loading && quoteContent && quoteForm.title_en === '' && quoteContent.title_en) {
        setQuoteForm({
            title_en: quoteContent.title_en || '',
            title_mk: quoteContent.title_mk || '',
            founder_name: quoteContent.founder_name || '',
            signature_url: quoteContent.signature_url || '',
        });
        if (!signaturePreview && quoteContent.signature_url) {
            setSignaturePreview(quoteContent.signature_url);
        }
    }

    const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSignatureFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignaturePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMainSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!mainContent) {
            setError('Content not loaded. Please refresh.');
            return;
        }

        const { error } = await updateContent(mainContent.id, mainForm);
        if (error) {
            setError(error);
        } else {
            setSuccess('Main content updated successfully!');
            refetch();
        }
    };

    const handleQuoteSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!quoteContent) {
            setError('Content not loaded. Please refresh.');
            return;
        }

        let signatureUrl = quoteForm.signature_url;

        if (signatureFile) {
            const { url, error: uploadError } = await uploadImage(signatureFile, 'about');
            if (uploadError) {
                setError(uploadError);
                return;
            }
            signatureUrl = url || '';
        }

        const { error } = await updateContent(quoteContent.id, {
            ...quoteForm,
            signature_url: signatureUrl,
        });

        if (error) {
            setError(error);
        } else {
            setSuccess('Quote content updated successfully!');
            refetch();
        }
    };

    if (loading) {
        return (
            <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {error && (
                <div className="bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green/10 border border-green/20 text-green px-4 py-3 rounded-md text-sm">
                    {success}
                </div>
            )}

            {/* Main Content Section */}
            <div>
                <h3 className="text-lg font-medium text-dark-green mb-4">Main Content</h3>
                <form onSubmit={handleMainSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            id="subtitle_en"
                            label="Subtitle (English)"
                            value={mainForm.subtitle_en}
                            onChange={(e) => setMainForm((prev) => ({ ...prev, subtitle_en: e.target.value }))}
                            placeholder="Our Story"
                        />
                        <Input
                            id="subtitle_mk"
                            label="Subtitle (Macedonian)"
                            value={mainForm.subtitle_mk}
                            onChange={(e) => setMainForm((prev) => ({ ...prev, subtitle_mk: e.target.value }))}
                            placeholder="Нашата приказна"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            id="title_en"
                            label="Title (English)"
                            value={mainForm.title_en}
                            onChange={(e) => setMainForm((prev) => ({ ...prev, title_en: e.target.value }))}
                            placeholder="Created with Love"
                        />
                        <Input
                            id="title_mk"
                            label="Title (Macedonian)"
                            value={mainForm.title_mk}
                            onChange={(e) => setMainForm((prev) => ({ ...prev, title_mk: e.target.value }))}
                            placeholder="Создадено со љубов"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Textarea
                            id="description_en"
                            label="Description (English)"
                            value={mainForm.description_en}
                            onChange={(e) => setMainForm((prev) => ({ ...prev, description_en: e.target.value }))}
                            placeholder="Every product we create is unique..."
                            rows={4}
                        />
                        <Textarea
                            id="description_mk"
                            label="Description (Macedonian)"
                            value={mainForm.description_mk}
                            onChange={(e) => setMainForm((prev) => ({ ...prev, description_mk: e.target.value }))}
                            placeholder="Секој производ што го создаваме е единствен..."
                            rows={4}
                        />
                    </div>
                    <Button type="submit" disabled={mutationLoading}>
                        {mutationLoading ? 'Saving...' : 'Save Main Content'}
                    </Button>
                </form>
            </div>

            <hr className="border-off-white-2" />

            {/* Quote Section */}
            <div>
                <h3 className="text-lg font-medium text-dark-green mb-4">Founder Quote</h3>
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Textarea
                            id="quote_en"
                            label="Quote (English)"
                            value={quoteForm.title_en}
                            onChange={(e) => setQuoteForm((prev) => ({ ...prev, title_en: e.target.value }))}
                            placeholder="Every piece I create carries a part of my heart..."
                            rows={3}
                        />
                        <Textarea
                            id="quote_mk"
                            label="Quote (Macedonian)"
                            value={quoteForm.title_mk}
                            onChange={(e) => setQuoteForm((prev) => ({ ...prev, title_mk: e.target.value }))}
                            placeholder="Секој производ што го создавам носи дел од моето срце..."
                            rows={3}
                        />
                    </div>
                    <Input
                        id="founder_name"
                        label="Founder Name"
                        value={quoteForm.founder_name}
                        onChange={(e) => setQuoteForm((prev) => ({ ...prev, founder_name: e.target.value }))}
                        placeholder="Ana"
                    />
                    <div>
                        <label className="block text-sm font-medium text-dark-green mb-2">
                            Signature Image (Optional)
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="w-32 h-16 bg-off-white-1 rounded-lg overflow-hidden flex items-center justify-center">
                                    {signaturePreview ? (
                                        <img
                                            src={signaturePreview}
                                            alt="Signature"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    ) : (
                                        <span className="text-sm text-dark-green/40">No signature</span>
                                    )}
                                </div>
                                {signaturePreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSignaturePreview(null);
                                            setSignatureFile(null);
                                            setQuoteForm((prev) => ({ ...prev, signature_url: '' }));
                                        }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                        title="Remove signature"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleSignatureChange}
                                className="block text-sm text-dark-green
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-dark-green file:text-white
                                    hover:file:bg-dark-green/90
                                    cursor-pointer"
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={mutationLoading}>
                        {mutationLoading ? 'Saving...' : 'Save Quote'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

// Stats Tab Component
function StatsTab() {
    const { stats, loading, refetch } = useAdminAboutStats();
    const { createStat, updateStat, deleteStat, loading: mutationLoading } = useAboutStatMutations();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStat, setEditingStat] = useState<AboutStat | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [statToDelete, setStatToDelete] = useState<AboutStat | null>(null);

    const [formData, setFormData] = useState({
        value: '',
        label_en: '',
        label_mk: '',
        icon: '',
        display_order: 0,
        is_active: true,
    });
    const [error, setError] = useState('');

    const openCreateModal = () => {
        setEditingStat(null);
        setFormData({
            value: '',
            label_en: '',
            label_mk: '',
            icon: '',
            display_order: stats.length,
            is_active: true,
        });
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (stat: AboutStat) => {
        setEditingStat(stat);
        setFormData({
            value: stat.value,
            label_en: stat.label_en,
            label_mk: stat.label_mk,
            icon: stat.icon || '',
            display_order: stat.display_order,
            is_active: stat.is_active,
        });
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const statData = {
            ...formData,
            icon: formData.icon || null,
        };

        if (editingStat) {
            const { error } = await updateStat(editingStat.id, statData);
            if (error) {
                setError(error);
                return;
            }
        } else {
            const { error } = await createStat(statData);
            if (error) {
                setError(error);
                return;
            }
        }

        setIsModalOpen(false);
        refetch();
    };

    const handleDeleteClick = (stat: AboutStat) => {
        setStatToDelete(stat);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!statToDelete) return;

        const { error } = await deleteStat(statToDelete.id);
        if (!error) {
            refetch();
        }

        setDeleteModalOpen(false);
        setStatToDelete(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-dark-green/60 text-sm">
                    Statistics displayed in the About section on the homepage.
                </p>
                <Button onClick={openCreateModal}>+ Add Stat</Button>
            </div>

            {loading ? (
                <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
                </div>
            ) : stats.length === 0 ? (
                <div className="py-8 text-center text-dark-green/60">
                    <p>No stats yet. Add your first stat!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-off-white-1">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Value</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Label (EN)</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Label (MK)</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Order</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Status</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-dark-green">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-off-white-2">
                            {stats.map((stat) => (
                                <tr key={stat.id} className="hover:bg-off-white-1/50">
                                    <td className="px-4 py-3 font-bold text-dark-green">{stat.value}</td>
                                    <td className="px-4 py-3 text-dark-green">{stat.label_en}</td>
                                    <td className="px-4 py-3 text-dark-green">{stat.label_mk}</td>
                                    <td className="px-4 py-3 text-dark-green/80">{stat.display_order}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${stat.is_active
                                                ? 'bg-green/20 text-green'
                                                : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {stat.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(stat)}
                                                className="text-dark-green hover:text-red-1 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(stat)}
                                                className="text-dark-green hover:text-red-1 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

            {/* Create/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStat ? 'Edit Stat' : 'Add Stat'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        id="value"
                        label="Value"
                        value={formData.value}
                        onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                        placeholder="200+"
                        required
                    />

                    <Input
                        id="label_en"
                        label="Label (English)"
                        value={formData.label_en}
                        onChange={(e) => setFormData((prev) => ({ ...prev, label_en: e.target.value }))}
                        placeholder="Products"
                        required
                    />

                    <Input
                        id="label_mk"
                        label="Label (Macedonian)"
                        value={formData.label_mk}
                        onChange={(e) => setFormData((prev) => ({ ...prev, label_mk: e.target.value }))}
                        placeholder="Производи"
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
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutationLoading} className="flex-1">
                            {mutationLoading ? 'Saving...' : editingStat ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Stat">
                <p className="text-dark-green mb-6">
                    Are you sure you want to delete "{statToDelete?.value} {statToDelete?.label_en}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} disabled={mutationLoading} className="flex-1">
                        {mutationLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

// Gallery Tab Component
function GalleryTab() {
    const { images, loading, refetch } = useAdminAboutGallery();
    const { createImage, updateImage, deleteImage, uploadImage, loading: mutationLoading } = useAboutGalleryMutations();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<AboutGalleryImage | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<AboutGalleryImage | null>(null);

    const [formData, setFormData] = useState({
        image_url: '',
        alt_en: '',
        alt_mk: '',
        display_order: 0,
        is_active: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    const openCreateModal = () => {
        setEditingImage(null);
        setFormData({
            image_url: '',
            alt_en: '',
            alt_mk: '',
            display_order: images.length,
            is_active: true,
        });
        setImageFile(null);
        setImagePreview(null);
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (image: AboutGalleryImage) => {
        setEditingImage(image);
        setFormData({
            image_url: image.image_url,
            alt_en: image.alt_en || '',
            alt_mk: image.alt_mk || '',
            display_order: image.display_order,
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

        if (imageFile) {
            const { url, error: uploadError } = await uploadImage(imageFile);
            if (uploadError) {
                setError(uploadError);
                return;
            }
            imageUrl = url || '';
        }

        if (!imageUrl) {
            setError('Please upload an image or provide a URL');
            return;
        }

        const imageData = {
            ...formData,
            image_url: imageUrl,
            alt_en: formData.alt_en || null,
            alt_mk: formData.alt_mk || null,
        };

        if (editingImage) {
            const { error } = await updateImage(editingImage.id, imageData);
            if (error) {
                setError(error);
                return;
            }
        } else {
            const { error } = await createImage(imageData);
            if (error) {
                setError(error);
                return;
            }
        }

        setIsModalOpen(false);
        refetch();
    };

    const handleDeleteClick = (image: AboutGalleryImage) => {
        setImageToDelete(image);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!imageToDelete) return;

        const { error } = await deleteImage(imageToDelete.id);
        if (!error) {
            refetch();
        }

        setDeleteModalOpen(false);
        setImageToDelete(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className="text-dark-green/60 text-sm">
                    4 images for the gallery layout. Position 1 is large, 2-3 are small, and 4 is wide.
                </p>
                <Button onClick={openCreateModal}>+ Add Image</Button>
            </div>

            {loading ? (
                <div className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
                </div>
            ) : images.length === 0 ? (
                <div className="py-8 text-center text-dark-green/60">
                    <p>No gallery images yet. Add your first image!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={image.id} className="relative group">
                            <div className="aspect-square bg-off-white-1 rounded-lg overflow-hidden">
                                <img
                                    src={image.image_url}
                                    alt={image.alt_en || `Gallery image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                <button
                                    onClick={() => openEditModal(image)}
                                    className="p-2 bg-white rounded-full text-dark-green hover:bg-off-white-1 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(image)}
                                    className="p-2 bg-white rounded-full text-red-1 hover:bg-off-white-1 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-2 text-sm">
                                <span className="font-medium text-dark-green">#{image.display_order + 1}</span>
                                {!image.is_active && (
                                    <span className="ml-2 text-dark-green/60">(Hidden)</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingImage ? 'Edit Gallery Image' : 'Add Gallery Image'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-dark-green mb-2">
                            Image
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="w-24 h-24 bg-off-white-1 rounded-lg overflow-hidden flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-12 h-12 text-off-white-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                                <p className="mt-2 text-sm text-dark-green/60">Or enter image URL:</p>
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
                        id="alt_en"
                        label="Alt Text (English)"
                        value={formData.alt_en}
                        onChange={(e) => setFormData((prev) => ({ ...prev, alt_en: e.target.value }))}
                        placeholder="Crafting process"
                    />

                    <Input
                        id="alt_mk"
                        label="Alt Text (Macedonian)"
                        value={formData.alt_mk}
                        onChange={(e) => setFormData((prev) => ({ ...prev, alt_mk: e.target.value }))}
                        placeholder="Процес на изработка"
                    />

                    <Input
                        id="display_order"
                        type="number"
                        label="Position (0=large left, 1=top right, 2=bottom right, 3=wide bottom)"
                        value={formData.display_order.toString()}
                        onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                        min="0"
                        max="3"
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
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutationLoading} className="flex-1">
                            {mutationLoading ? 'Saving...' : editingImage ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Gallery Image">
                <p className="text-dark-green mb-6">
                    Are you sure you want to delete this gallery image? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} disabled={mutationLoading} className="flex-1">
                        {mutationLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
