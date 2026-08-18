import MainLayout from '@/Layouts/MainLayout'
import { Container } from '@/Components/layout'
import { Link } from '@inertiajs/react'

interface BlogPost {
    id: number
    title: string
    slug: string
    excerpt: string | null
    body: string
    category: string
    cover_image_url: string | null
    published_at: string
    user: { name: string } | null
}

interface ShowProps {
    post: BlogPost
}

const categoryLabels: Record<string, string> = {
    grooming_tips: 'Grooming Tips',
    breed_guides: 'Breed Guides',
    dog_care: 'Dog Care',
    business_news: 'Business News',
}

export default function Show({ post }: ShowProps) {
    return (
        <MainLayout
            title={`${post.title} — Bubbly Pups`}
            description={post.excerpt ?? undefined}
        >
            {/* Cover image */}
            {post.cover_image_url && (
                <div className="h-72 w-full overflow-hidden sm:h-96">
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            <Container className="py-16">
                <div className="mx-auto max-w-3xl">
                    {/* Back link */}
                    <Link
                        href={route('blog')}
                        className="inline-flex items-center gap-1.5 text-sm font-display font-extrabold text-brand-500 hover:text-brand-600 transition-colors mb-8"
                    >
                        ← Back to Blog
                    </Link>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-block rounded-full bg-brand-100 px-3 py-0.5 text-xs font-display font-extrabold text-brand-600">
                            {categoryLabels[post.category] ?? post.category}
                        </span>
                        <span className="text-sm text-gray-400">
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                        {post.user && (
                            <span className="text-sm text-gray-400">by {post.user.name}</span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-display font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        {post.title}
                    </h1>

                    {/* Body */}
                    <div
                        className="prose prose-lg max-w-none mt-10 prose-headings:font-display prose-headings:font-extrabold prose-h2:mt-12 prose-h3:mt-8 prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: post.body }}
                    />

                    {/* Footer nav */}
                    <div className="mt-16 border-t border-gray-200 pt-8">
                        <Link
                            href={route('blog')}
                            className="inline-flex items-center gap-1.5 text-sm font-display font-extrabold text-brand-500 hover:text-brand-600 transition-colors"
                        >
                            ← All Posts
                        </Link>
                    </div>
                </div>
            </Container>
        </MainLayout>
    )
}
