import AdminLayout from '@/Layouts/AdminLayout'
import { Link, router } from '@inertiajs/react'
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface BlogPost {
    id: number
    title: string
    slug: string
    category: string
    published_at: string | null
    created_at: string
    user: { name: string } | null
}

interface PaginatedPosts {
    data: BlogPost[]
    links: { url: string | null; label: string; active: boolean }[]
    last_page: number
}

interface BlogIndexProps {
    posts: PaginatedPosts
}

const categoryLabels: Record<string, string> = {
    grooming_tips: 'Grooming Tips',
    breed_guides: 'Breed Guides',
    dog_care: 'Dog Care',
    business_news: 'Business News',
}

export default function BlogIndex({ posts }: BlogIndexProps) {
    const handleDelete = (post: BlogPost) => {
        if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) {
            return
        }
        router.delete(route('admin.blog.destroy', post.id))
    }

    const handlePublishToggle = (post: BlogPost) => {
        router.patch(route('admin.blog.publish', post.id))
    }

    return (
        <AdminLayout>
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-display font-extrabold text-gray-900">Blog Posts</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your blog content</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href={route('admin.blog.create')}
                        className="inline-flex items-center gap-2 rounded-button bg-brand-400 px-4 py-2.5 text-sm font-display font-extrabold text-white hover:bg-brand-500 transition-colors"
                    >
                        <PlusIcon className="size-4" />
                        New Post
                    </Link>
                </div>
            </div>

            <div className="mt-8 card overflow-hidden">
                {posts.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-5xl mb-3">📝</div>
                        <p className="font-display font-extrabold text-gray-600">No blog posts yet</p>
                        <p className="text-sm text-gray-400 mt-1">Create your first post to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-display font-extrabold uppercase tracking-wider text-gray-500">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-display font-extrabold uppercase tracking-wider text-gray-500">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-display font-extrabold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-display font-extrabold uppercase tracking-wider text-gray-500">
                                        Date
                                    </th>
                                    <th className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {posts.data.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-display font-extrabold text-gray-900 line-clamp-1">{post.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-block rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-display font-extrabold text-brand-600">
                                                {categoryLabels[post.category] ?? post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {post.published_at ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-display font-extrabold text-green-700">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-display font-extrabold text-gray-600">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    title={post.published_at ? 'Move to draft' : 'Publish'}
                                                    onClick={() => handlePublishToggle(post)}
                                                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                                >
                                                    {post.published_at ? (
                                                        <EyeSlashIcon className="size-4" />
                                                    ) : (
                                                        <EyeIcon className="size-4" />
                                                    )}
                                                </button>
                                                <Link
                                                    href={route('admin.blog.edit', post.id)}
                                                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <PencilSquareIcon className="size-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    title="Delete"
                                                    onClick={() => handleDelete(post)}
                                                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                >
                                                    <TrashIcon className="size-4" />
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

            {/* Pagination */}
            {posts.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-1">
                    {posts.links.map((link, i) => (
                        link.url ? (
                            <Link
                                key={i}
                                href={link.url}
                                className={[
                                    'px-3 py-1.5 rounded text-sm font-display font-extrabold transition-colors',
                                    link.active
                                        ? 'bg-brand-400 text-white'
                                        : 'text-gray-600 hover:bg-gray-100',
                                ].join(' ')}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={i}
                                className="px-3 py-1.5 rounded text-sm text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>
            )}
        </AdminLayout>
    )
}
