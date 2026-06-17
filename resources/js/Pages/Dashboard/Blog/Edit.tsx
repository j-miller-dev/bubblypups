import AdminLayout from '@/Layouts/AdminLayout'
import { useForm } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { RichTextEditor } from '@/Components/ui/RichTextEditor'

interface BlogPost {
    id: number
    title: string
    slug: string
    excerpt: string | null
    body: string
    category: string
    cover_image_url: string | null
    published_at: string | null
}

interface EditProps {
    post: BlogPost
}

type BlogFormData = {
    title: string
    slug: string
    excerpt: string
    body: string
    category: string
    cover_image_url: string
    published_at: string
}

export default function Edit({ post }: EditProps) {
    const { data, setData, patch, processing, errors } = useForm<BlogFormData>({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        body: post.body,
        category: post.category,
        cover_image_url: post.cover_image_url ?? '',
        published_at: post.published_at ?? '',
    })

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        patch(route('admin.blog.update', post.id))
    }

    const handlePublish = (e: React.MouseEvent) => {
        e.preventDefault()
        router.patch(route('admin.blog.update', post.id), {
            ...data,
            published_at: new Date().toISOString(),
        })
    }

    const handleUnpublish = (e: React.MouseEvent) => {
        e.preventDefault()
        router.patch(route('admin.blog.update', post.id), {
            ...data,
            published_at: '',
        })
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-display font-extrabold text-gray-900">Edit Blog Post</h1>
                    <span className={[
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-display font-extrabold',
                        post.published_at
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600',
                    ].join(' ')}>
                        {post.published_at ? 'Published' : 'Draft'}
                    </span>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
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
                        />
                        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center rounded-button border border-gray-300 bg-white px-4 py-2.5 text-sm font-display font-extrabold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Save Changes
                        </button>
                        {post.published_at ? (
                            <button
                                type="button"
                                disabled={processing}
                                onClick={handleUnpublish}
                                className="inline-flex items-center rounded-button border border-gray-300 bg-white px-4 py-2.5 text-sm font-display font-extrabold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Move to Draft
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled={processing}
                                onClick={handlePublish}
                                className="inline-flex items-center rounded-button bg-brand-400 px-4 py-2.5 text-sm font-display font-extrabold text-white hover:bg-brand-500 disabled:opacity-50 transition-colors"
                            >
                                Publish Now
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
