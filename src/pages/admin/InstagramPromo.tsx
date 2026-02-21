import { useState, useEffect } from 'react';
import { useAdminInstagramPromo, useInstagramPromoMutations } from '../../hooks/useInstagramPromo';
import { isValidUrl } from '../../lib/utils';

export default function InstagramPromo() {
    const { promo, loading, refetch } = useAdminInstagramPromo();
    const { updatePromo, loading: saving } = useInstagramPromoMutations();

    const [form, setForm] = useState({
        subtitle_en: '',
        subtitle_mk: '',
        title_en: '',
        title_mk: '',
        description_en: '',
        description_mk: '',
        button1_text_en: '',
        button1_text_mk: '',
        button1_link: '',
        button2_text_en: '',
        button2_text_mk: '',
        button2_link: '',
        instagram_url: '',
        is_active: true,
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (promo) {
            setForm({
                subtitle_en: promo.subtitle_en || '',
                subtitle_mk: promo.subtitle_mk || '',
                title_en: promo.title_en || '',
                title_mk: promo.title_mk || '',
                description_en: promo.description_en || '',
                description_mk: promo.description_mk || '',
                button1_text_en: promo.button1_text_en || '',
                button1_text_mk: promo.button1_text_mk || '',
                button1_link: promo.button1_link || '',
                button2_text_en: promo.button2_text_en || '',
                button2_text_mk: promo.button2_text_mk || '',
                button2_link: promo.button2_link || '',
                instagram_url: promo.instagram_url || '',
                is_active: promo.is_active,
            });
        }
    }, [promo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!promo) return;

        setSuccess(false);
        setError(null);

        const linksToValidate = [
            { value: form.button1_link, label: 'Button 1 link' },
            { value: form.button2_link, label: 'Button 2 link' },
        ];
        for (const link of linksToValidate) {
            if (link.value && !isValidUrl(link.value)) {
                setError(`${link.label} must be a relative path or a valid http/https URL`);
                return;
            }
        }

        const { error: updateError } = await updatePromo(promo.id, form);

        if (updateError) {
            setError(updateError);
        } else {
            setSuccess(true);
            refetch();
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                    <div className="space-y-3 mt-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-dark-green">Instagram Promo Section</h1>
                <p className="text-gray-600 mt-1">
                    Manage the promo section displayed between Welcome Tiles and Testimonials on the homepage.
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    Changes saved successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Active Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                        className="w-4 h-4 text-dark-green rounded border-gray-300 focus:ring-dark-green"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Section is visible on homepage
                    </span>
                </label>

                <hr />

                {/* Subtitle */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Subtitle Label</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">English</label>
                            <input
                                type="text"
                                value={form.subtitle_en}
                                onChange={(e) => setForm({ ...form, subtitle_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                                placeholder="e.g. NEW ARRIVALS"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Macedonian</label>
                            <input
                                type="text"
                                value={form.subtitle_mk}
                                onChange={(e) => setForm({ ...form, subtitle_mk: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                                placeholder="пр. НОВИ ПРОИЗВОДИ"
                            />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Main Heading</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">English</label>
                            <input
                                type="text"
                                value={form.title_en}
                                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                                placeholder="e.g. Fresh Artworks"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Macedonian</label>
                            <input
                                type="text"
                                value={form.title_mk}
                                onChange={(e) => setForm({ ...form, title_mk: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                                placeholder="пр. Нови Уметнички Дела"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Description</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">English</label>
                            <textarea
                                value={form.description_en}
                                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green resize-vertical"
                                placeholder="Description text in English..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Macedonian</label>
                            <textarea
                                value={form.description_mk}
                                onChange={(e) => setForm({ ...form, description_mk: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green resize-vertical"
                                placeholder="Опис на македонски..."
                            />
                        </div>
                    </div>
                </div>

                <hr />

                {/* Button 1 */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Button 1 (Primary)</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Text (English)</label>
                            <input
                                type="text"
                                value={form.button1_text_en}
                                onChange={(e) => setForm({ ...form, button1_text_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                                placeholder="e.g. Shop Now"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Text (Macedonian)</label>
                            <input
                                type="text"
                                value={form.button1_text_mk}
                                onChange={(e) => setForm({ ...form, button1_text_mk: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                                placeholder="пр. Купи Сега"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Link URL</label>
                        <input
                            type="text"
                            value={form.button1_link}
                            onChange={(e) => setForm({ ...form, button1_link: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                            placeholder="e.g. /products"
                        />
                    </div>
                </div>

                {/* Button 2 */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Button 2 (Outline, Optional)</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Text (English)</label>
                            <input
                                type="text"
                                value={form.button2_text_en}
                                onChange={(e) => setForm({ ...form, button2_text_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                                placeholder="e.g. Follow Us"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Text (Macedonian)</label>
                            <input
                                type="text"
                                value={form.button2_text_mk}
                                onChange={(e) => setForm({ ...form, button2_text_mk: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                                placeholder="пр. Следи Не"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Link URL</label>
                        <input
                            type="text"
                            value={form.button2_link}
                            onChange={(e) => setForm({ ...form, button2_link: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                            placeholder="e.g. https://instagram.com/yourpage"
                        />
                    </div>
                </div>

                <hr />

                {/* Instagram URL */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Instagram Embed</h3>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Instagram Embed URL</label>
                        <input
                            type="text"
                            value={form.instagram_url}
                            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-dark-green"
                            placeholder="e.g. https://www.instagram.com/reel/DRP0eFTjJfb/"
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Paste the Instagram post or reel permalink, e.g. https://www.instagram.com/reel/DRP0eFTjJfb/
                        </p>
                    </div>

                    {/* Preview note */}
                    {form.instagram_url && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-xs text-gray-500">
                                Preview is shown on the homepage. Save changes and visit the homepage to see the embed.
                            </p>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-dark-green text-white rounded-md text-sm font-medium hover:bg-dark-green/90 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
