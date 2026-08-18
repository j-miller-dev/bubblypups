import MainLayout from '@/Layouts/MainLayout'
import { Container } from '@/Components/layout'
import { Link } from '@inertiajs/react'

interface BlogPost {
    id: number
    title: string
    slug: string
    excerpt: string | null
    category: string
    cover_image_url: string | null
    published_at: string
    user: { name: string } | null
}

interface PaginatedPosts {
    data: BlogPost[]
    links: { url: string | null; label: string; active: boolean }[]
    current_page: number
    last_page: number
}

interface BlogProps {
    posts: PaginatedPosts
}

const categoryLabels: Record<string, string> = {
    grooming_tips: 'Grooming Tips',
    breed_guides: 'Breed Guides',
    dog_care: 'Dog Care',
    business_news: 'Business News',
}

function CategoryBadge({ category }: { category: string }) {
    return (
        <span className="inline-block rounded-full bg-brand-100 px-3 py-0.5 text-xs font-display font-extrabold text-brand-600">
            {categoryLabels[category] ?? category}
        </span>
    )
}

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
    const coverBg = post.cover_image_url
        ? undefined
        : 'bg-gradient-to-br from-brand-100 via-purple-100 to-blue-100'

    return (
        <article className={['flex flex-col', featured ? 'lg:flex-row gap-8' : ''].join(' ')}>
            <Link
                href={route('blog.show', post.slug)}
                className={[
                    'block shrink-0 overflow-hidden rounded-card',
                    featured ? 'lg:w-1/2 h-72' : 'h-48',
                    coverBg ?? '',
                ].join(' ')}
            >
                {post.cover_image_url ? (
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className={['h-full w-full', coverBg].join(' ')} />
                )}
            </Link>

            <div className={featured ? 'flex flex-col justify-center' : 'mt-4 flex flex-col'}>
                <div className="flex items-center gap-3">
                    <CategoryBadge category={post.category} />
                    <span className="text-sm text-gray-400">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                </div>

                <Link href={route('blog.show', post.slug)}>
                    <h2
                        className={[
                            'mt-2 font-display font-extrabold tracking-tight text-gray-900 hover:text-brand-500 transition-colors',
                            featured ? 'text-3xl' : 'text-xl',
                        ].join(' ')}
                    >
                        {post.title}
                    </h2>
                </Link>

                {post.excerpt && (
                    <p className={['mt-3 text-gray-600 flex-grow', featured ? 'text-lg' : 'text-base'].join(' ')}>
                        {post.excerpt}
                    </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                    {post.user && (
                        <span className="text-sm text-gray-500">{post.user.name}</span>
                    )}
                    <Link
                        href={route('blog.show', post.slug)}
                        className="text-sm font-display font-extrabold text-brand-500 hover:text-brand-600 transition-colors ml-auto"
                    >
                        Read more →
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default function Blog({ posts }: BlogProps) {
    const [featured, ...rest] = posts.data

    return (
        <MainLayout title="Blog — Bubbly Pups" description="Grooming tips, breed guides, and dog care advice from Bubbly Pups.">
            {/* Hero */}
            <div className="relative overflow-hidden bg-white">
                {/* Decorative blobs */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-brand-100 opacity-40 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-blue-100 opacity-40 blur-3xl"
                />

                <Container className="relative py-20 sm:py-28 text-center">
                    <span className="inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-display font-extrabold text-brand-600 mb-4">
                        The Bubbly Blog
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-gray-900 tracking-tight">
                        Tips, Guides &{' '}
                        <span className="text-brand-400">Dog Love</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
                        Grooming advice, breed-specific guides, and updates from Bubbly Pups — written with love for your pup.
                    </p>
                </Container>
            </div>

            <Container className="py-16">
                {posts.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-6xl mb-4">🐾</div>
                        <h2 className="text-2xl font-display font-extrabold text-gray-700">No posts yet</h2>
                        <p className="mt-2 text-gray-500">Check back soon — we're working on some great content!</p>
                    </div>
                ) : (
                    <>
                        {/* Featured post */}
                        {featured && (
                            <div className="mb-20 border-b border-gray-200 pb-20">
                                <PostCard post={featured} featured />
                            </div>
                        )}

                        {/* Grid */}
                        {rest.length > 0 && (
                            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                                {rest.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {posts.last_page > 1 && (
                            <div className="mt-16 flex justify-center gap-1">
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
                    </>
                )}
            </Container>
        </MainLayout>
    )
}
