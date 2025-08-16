import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Container } from '@/Components/layout';
import { Gradient } from '@/Components/graphics';
import { Link } from '@/Components/ui';
import { Image } from '@/Components/graphics';

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: 'Radiant raises $100M Series A from Tailwind Ventures',
    excerpt: "We're excited to announce our Series A funding round led by Tailwind Ventures, which will help us accelerate our mission to revolutionize sales intelligence.",
    date: 'July 15, 2025',
    author: 'Jane Smith',
    category: 'Company News',
    slug: 'radiant-raises-100m-series-a-from-tailwind-ventures'
  },
  {
    id: 2,
    title: 'Introducing Radiant AI: The Future of Sales Intelligence',
    excerpt: 'Our new AI-powered features help sales teams understand customer behavior better than ever before, leading to higher conversion rates and more closed deals.',
    date: 'June 28, 2025',
    author: 'John Doe',
    category: 'Product Updates',
    slug: 'introducing-radiant-ai-the-future-of-sales-intelligence'
  },
  {
    id: 3,
    title: '5 Ways to Improve Your Sales Pipeline with Data',
    excerpt: 'Learn how data-driven insights can transform your sales process and help you close more deals with less effort.',
    date: 'June 10, 2025',
    author: 'Sarah Johnson',
    category: 'Sales Tips',
    slug: '5-ways-to-improve-your-sales-pipeline-with-data'
  },
  {
    id: 4,
    title: 'Customer Success Story: How Company X Increased Sales by 300%',
    excerpt: 'See how Company X used Radiant to transform their sales process and achieve record-breaking results in just three months.',
    date: 'May 22, 2025',
    author: 'Michael Brown',
    category: 'Case Studies',
    slug: 'customer-success-story-how-company-x-increased-sales-by-300-percent'
  },
  {
    id: 5,
    title: 'The Future of B2B Sales in a Digital-First World',
    excerpt: 'Explore the trends shaping the future of B2B sales and how technology is enabling more personalized, efficient sales processes.',
    date: 'May 5, 2025',
    author: 'Jane Smith',
    category: 'Industry Insights',
    slug: 'the-future-of-b2b-sales-in-a-digital-first-world'
  },
  {
    id: 6,
    title: 'Announcing Our New Integration with CRM Platform',
    excerpt: 'Our latest integration with a popular CRM platform makes it easier than ever to incorporate Radiant into your existing workflow.',
    date: 'April 18, 2025',
    author: 'John Doe',
    category: 'Product Updates',
    slug: 'announcing-our-new-integration-with-crm-platform'
  }
];

export default function Blog() {
  return (
    <MainLayout title="Blog - Radiant" description="Latest news, updates, and insights from the Radiant team">
      <div className="overflow-hidden">
        <div className="relative">
          <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
          <Container className="relative py-24 sm:py-32">
            <h1 className="text-4xl font-medium tracking-tighter text-pretty text-gray-950 sm:text-6xl">
              Blog
            </h1>
            <p className="mt-6 max-w-lg text-xl/7 font-medium text-gray-950/75">
              Latest news, updates, and insights from the Radiant team.
            </p>
          </Container>
        </div>

        <Container className="py-24">
          {/* Featured Post */}
          <div className="mb-16 border-b border-gray-200 pb-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Image
                src={`/blog/${blogPosts[0].slug}.jpg`}
                alt={blogPosts[0].title}
                className="h-80"
                aspectRatio="landscape"
              />
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{blogPosts[0].category}</span>
                  <span>•</span>
                  <span>{blogPosts[0].date}</span>
                </div>
                <h2 className="mt-2 text-3xl font-medium tracking-tight text-gray-900">
                  {blogPosts[0].title}
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  {blogPosts[0].excerpt}
                </p>
                <div className="mt-6">
                  <Link href={`/blog/${blogPosts[0].slug}`} className="text-fuchsia-600 font-medium">
                    Read more
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{blogPosts[0].author}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Post Grid */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="flex flex-col">
                <Image
                  src={`/blog/${post.slug}.jpg`}
                  alt={post.title}
                  className="h-48"
                  aspectRatio="landscape"
                />
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-2 text-xl font-medium tracking-tight text-gray-900">
                  {post.title}
                </h3>
                <p className="mt-4 flex-grow text-base text-gray-600">
                  {post.excerpt}
                </p>
                <div className="mt-6">
                  <Link href={`/blog/${post.slug}`} className="text-fuchsia-600 font-medium">
                    Read more
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.author}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
