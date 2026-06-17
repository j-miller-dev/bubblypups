import AdminLayout from '@/Layouts/AdminLayout'
import { useForm } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { RichTextEditor } from '@/Components/ui/RichTextEditor'
import { useEffect } from 'react'

type BlogFormData = {
    title: string
    slug: string
    excerpt: string
    body: string
    category: string
    cover_image_url: string
    published_at: string
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<BlogFormData>({
        title: '',
        slug: '',
        excerpt: '',
        body: '',
        category: 'grooming_tips',
        cover_image_url: '',
        published_at: '',
    })

    // Auto-populate slug from title
    useEffect(() => {
        if (data.title) {
            setData('slug', data.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-'))
        }
    }, [data.title])

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('admin.blog.store'))
    }

    const handlePublish = (e: React.MouseEvent) => {
        e.preventDefault()
        router.post(route('admin.blog.store'), {
            ...data,
            published_at: new Date().toISOString(),
        })
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <h1 className="text-2xl font-display font-extrabold text-gray-900 mb-8">New Blog Post</h1>

                <form onSubmit={handleSaveDraft} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-display font-extrabold text-gray-700 mb-1.5">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="input"
                            placeholder="How to Desensitize Your Pup to Grooming"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-display font-extrabold text-gray-700 mb-1.5">
                            Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="input font-mono text-sm"
                            placeholder="how-to-desensitize-your-pup"
                        />
                        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-display font-extrabold text-gray-700 mb-1.5">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="input"
                        >
                            <option value="grooming_tips">Grooming Tips</option>
                            <option value="breed_guides">Breed Guides</option>
                            <option value="dog_care">Dog Care</option>
                            <option value="business_news">Business News</option>
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-display font-extrabold text-gray-700 mb-1.5">
                            Excerpt
                            <span className="ml-2 text-xs font-normal text-gray-400">Optional — shown in post listings</span>
                        </label>
                        <textarea
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            className="input"
                            rows={3}
                            maxLength={500}
                            placeholder="A short summary of this post..."
                        />
                        {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                    </div>

                    {/* Cover Image URL */}
                    <div>
                        <label className="block text-sm font-display font-extrabold text-gray-700 mb-1.5">
                            Cover Image URL
                            <span className="ml-2 text-xs font-normal text-gray-400">Optional</span>
                        </label>
                        <input
                            type="url"
                            value={data.cover_image_url}
                            onChange={(e) => setData('cover_image_url', e.target.value)}
                            className="input"
                            placeholder="https://..."
                        />
                        {errors.cover_image_url && <p className="mt-1 text-sm text-red-600">{errors.cover_image_url}</p>}
                    </div>

                    {/* Body */}
                    <div>
                        <label className="block text-sm font-display font-extrabold text-gray-700 mb-1.5">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={data.body}
                            onChange={(val) => setData('body', val)}
                            placeholder="Write your post content here..."
                        />
                        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-button border border-gray-300 bg-white px-4 py-2.5 text-sm font-display font-extrabold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            onClick={handlePublish}
                            className="inline-flex items-center rounded-button bg-brand-400 px-4 py-2.5 text-sm font-display font-extrabold text-white hover:bg-brand-500 disabled:opacity-50 transition-colors"
                        >
                            Publish Now
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
