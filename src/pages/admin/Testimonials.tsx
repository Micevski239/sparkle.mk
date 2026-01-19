import { useState, FormEvent } from 'react';
import {
    useAdminTestimonials,
    useTestimonialMutations,
} from '../../hooks/useTestimonials';
import { Testimonial } from '../../types';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

// Star Rating Input Component
function StarRatingInput({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star as 1 | 2 | 3 | 4 | 5)}
                    className="focus:outline-none"
                >
                    <svg
                        className={`w-6 h-6 ${star <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

// Star Rating Display Component
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function TestimonialsAdmin() {
    const { testimonials, loading, refetch } = useAdminTestimonials();
    const { createTestimonial, updateTestimonial, deleteTestimonial, uploadPhoto, loading: mutationLoading } = useTestimonialMutations();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_photo_url: '',
        customer_location_en: '',
        customer_location_mk: '',
        quote_en: '',
        quote_mk: '',
        rating: 5 as 1 | 2 | 3 | 4 | 5,
        display_order: 0,
        is_active: true,
        is_featured: false,
        testimonial_date: new Date().toISOString().split('T')[0],
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    const openCreateModal = () => {
        setEditingTestimonial(null);
        setFormData({
            customer_name: '',
            customer_photo_url: '',
            customer_location_en: '',
            customer_location_mk: '',
            quote_en: '',
            quote_mk: '',
            rating: 5,
            display_order: testimonials.length,
            is_active: true,
            is_featured: false,
            testimonial_date: new Date().toISOString().split('T')[0],
        });
        setPhotoFile(null);
        setPhotoPreview(null);
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            customer_name: testimonial.customer_name,
            customer_photo_url: testimonial.customer_photo_url || '',
            customer_location_en: testimonial.customer_location_en || '',
            customer_location_mk: testimonial.customer_location_mk || '',
            quote_en: testimonial.quote_en,
            quote_mk: testimonial.quote_mk,
            rating: testimonial.rating,
            display_order: testimonial.display_order,
            is_active: testimonial.is_active,
            is_featured: testimonial.is_featured,
            testimonial_date: testimonial.testimonial_date.split('T')[0],
        });
        setPhotoPreview(testimonial.customer_photo_url);
        setPhotoFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.customer_name.trim()) {
            setError('Customer name is required');
            return;
        }

        if (!formData.quote_en.trim() || !formData.quote_mk.trim()) {
            setError('Quote in both languages is required');
            return;
        }

        let photoUrl = formData.customer_photo_url;

        if (photoFile) {
            const { url, error: uploadError } = await uploadPhoto(photoFile);
            if (uploadError) {
                setError(uploadError);
                return;
            }
            photoUrl = url || '';
        }

        const testimonialData = {
            customer_name: formData.customer_name.trim(),
            customer_photo_url: photoUrl || null,
            customer_location_en: formData.customer_location_en.trim() || null,
            customer_location_mk: formData.customer_location_mk.trim() || null,
            quote_en: formData.quote_en.trim(),
            quote_mk: formData.quote_mk.trim(),
            rating: formData.rating,
            display_order: formData.display_order,
            is_active: formData.is_active,
            is_featured: formData.is_featured,
            testimonial_date: formData.testimonial_date,
        };

        if (editingTestimonial) {
            const { error } = await updateTestimonial(editingTestimonial.id, testimonialData);
            if (error) {
                setError(error);
                return;
            }
        } else {
            const { error } = await createTestimonial(testimonialData);
            if (error) {
                setError(error);
                return;
            }
        }

        setIsModalOpen(false);
        refetch();
    };

    const handleDeleteClick = (testimonial: Testimonial) => {
        setTestimonialToDelete(testimonial);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!testimonialToDelete) return;

        const { error } = await deleteTestimonial(testimonialToDelete.id);
        if (!error) {
            refetch();
        }

        setDeleteModalOpen(false);
        setTestimonialToDelete(null);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-dark-green mb-6">Testimonials</h1>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-off-white-2">
                    <div className="flex items-center justify-between">
                        <p className="text-dark-green/60 text-sm">
                            Customer testimonials displayed on the homepage carousel.
                        </p>
                        <Button onClick={openCreateModal}>+ Add Testimonial</Button>
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="py-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-green mx-auto"></div>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="py-8 text-center text-dark-green/60">
                            <p>No testimonials yet. Add your first testimonial!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-off-white-1">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Customer</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Quote (EN)</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Rating</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Order</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-dark-green">Status</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-dark-green">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-off-white-2">
                                    {testimonials.map((testimonial) => (
                                        <tr key={testimonial.id} className="hover:bg-off-white-1/50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {testimonial.customer_photo_url ? (
                                                        <img
                                                            src={testimonial.customer_photo_url}
                                                            alt={testimonial.customer_name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                                                            {testimonial.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-dark-green">{testimonial.customer_name}</p>
                                                        {testimonial.customer_location_en && (
                                                            <p className="text-xs text-dark-green/60">{testimonial.customer_location_en}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-dark-green text-sm truncate max-w-xs" title={testimonial.quote_en}>
                                                    "{testimonial.quote_en.slice(0, 60)}{testimonial.quote_en.length > 60 ? '...' : ''}"
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StarRating rating={testimonial.rating} />
                                            </td>
                                            <td className="px-4 py-3 text-dark-green/80">{testimonial.display_order}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-xs font-medium ${testimonial.is_active
                                                            ? 'bg-green/20 text-green'
                                                            : 'bg-gray-200 text-gray-600'
                                                            }`}
                                                    >
                                                        {testimonial.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    {testimonial.is_featured && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(testimonial)}
                                                        className="text-dark-green hover:text-red-1 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(testimonial)}
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
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-1/10 border border-red-1/20 text-red-1 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        id="customer_name"
                        label="Customer Name *"
                        value={formData.customer_name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, customer_name: e.target.value }))}
                        placeholder="John Doe"
                        required
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            id="customer_location_en"
                            label="Location (English)"
                            value={formData.customer_location_en}
                            onChange={(e) => setFormData((prev) => ({ ...prev, customer_location_en: e.target.value }))}
                            placeholder="Skopje"
                        />
                        <Input
                            id="customer_location_mk"
                            label="Location (Macedonian)"
                            value={formData.customer_location_mk}
                            onChange={(e) => setFormData((prev) => ({ ...prev, customer_location_mk: e.target.value }))}
                            placeholder="Скопје"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Textarea
                            id="quote_en"
                            label="Quote (English) *"
                            value={formData.quote_en}
                            onChange={(e) => setFormData((prev) => ({ ...prev, quote_en: e.target.value }))}
                            placeholder="Beautiful candles, highly recommend!"
                            rows={3}
                            required
                        />
                        <Textarea
                            id="quote_mk"
                            label="Quote (Macedonian) *"
                            value={formData.quote_mk}
                            onChange={(e) => setFormData((prev) => ({ ...prev, quote_mk: e.target.value }))}
                            placeholder="Прекрасни свеќи, препорачувам!"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-green mb-2">
                            Rating *
                        </label>
                        <StarRatingInput
                            value={formData.rating}
                            onChange={(rating) => setFormData((prev) => ({ ...prev, rating: rating as 1 | 2 | 3 | 4 | 5 }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-green mb-2">
                            Customer Photo (Optional)
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-off-white-1 rounded-full overflow-hidden flex items-center justify-center">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm text-dark-green/40">No photo</span>
                                    )}
                                </div>
                                {photoPreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhotoPreview(null);
                                            setPhotoFile(null);
                                            setFormData((prev) => ({ ...prev, customer_photo_url: '' }));
                                        }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                        title="Remove photo"
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
                                onChange={handlePhotoChange}
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

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            id="display_order"
                            type="number"
                            label="Display Order"
                            value={formData.display_order.toString()}
                            onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                            min="0"
                        />
                        <Input
                            id="testimonial_date"
                            type="date"
                            label="Testimonial Date"
                            value={formData.testimonial_date}
                            onChange={(e) => setFormData((prev) => ({ ...prev, testimonial_date: e.target.value }))}
                        />
                    </div>

                    <div className="flex items-center gap-6">
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
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                                className="rounded border-off-white-2 text-dark-green focus:ring-dark-green"
                            />
                            <label htmlFor="is_featured" className="text-sm text-dark-green">
                                Featured
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutationLoading} className="flex-1">
                            {mutationLoading ? 'Saving...' : editingTestimonial ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Testimonial">
                <p className="text-dark-green mb-6">
                    Are you sure you want to delete the testimonial from "{testimonialToDelete?.customer_name}"? This action cannot be undone.
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
