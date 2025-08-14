import React, { useEffect, useState } from 'react';
import { Container } from '@/Components/Container';
import SectionHeading from "@/Components/SectionHeading.tsx";

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url: string;
}

interface FacebookFeedProps {
  pageId?: string;
  accessToken?: string;
  postsToShow?: number;
  className?: string;
}

export const FacebookFeed: React.FC<FacebookFeedProps> = ({
  pageId = 'bubbly.pups.grooming', // Replace with your actual Facebook page ID
  accessToken = 'placeholder-token', // This would be replaced with a real token in production
  postsToShow = 3,
  className = '',
}) => {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, you would fetch actual data from the Facebook Graph API
  // For this demo, we'll use placeholder data
  useEffect(() => {
    // Simulating API fetch delay
    const timer = setTimeout(() => {
      try {
        // Mock data for demonstration
        const mockPosts: FacebookPost[] = [
          {
            id: '1',
            message: 'Meet Bella, our adorable client of the day! She loved her full grooming session and left looking fabulous! 🐶✨ #DogGrooming #HappyPups',
            created_time: '2025-08-01T14:30:00+0000',
            full_picture: '/images/Social%20Files/SocialProfile_1.jpg',
            permalink_url: 'https://www.facebook.com/bubbly.pups.grooming/posts/1',
          },
          {
            id: '2',
            message: 'We\'re excited to announce our new puppy package! First-time grooming for puppies under 6 months at a special rate. Call us to book your appointment! 🐾',
            created_time: '2025-07-28T10:15:00+0000',
            full_picture: '/images/Social%20Files/SocialProfile_2.jpg',
            permalink_url: 'https://www.facebook.com/bubbly.pups.grooming/posts/2',
          },
          {
            id: '3',
            message: 'Summer special! Book a full grooming package and get a free de-shedding treatment. Limited time offer! ☀️🐕',
            created_time: '2025-07-25T16:45:00+0000',
            full_picture: '/images/Social%20Files/SocialProfile_3.jpg',
            permalink_url: 'https://www.facebook.com/bubbly.pups.grooming/posts/3',
          },
          {
            id: '4',
            message: 'Happy customers make our day! Max and his human are all smiles after his grooming session. #BeforeAndAfter',
            created_time: '2025-07-20T13:20:00+0000',
            full_picture: '/images/Social%20Files/SocialProfile_4.jpg',
            permalink_url: 'https://www.facebook.com/bubbly.pups.grooming/posts/4',
          },
        ];

        setPosts(mockPosts.slice(0, postsToShow));
        setLoading(false);
      } catch (err) {
        setError('Failed to load Facebook posts');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [postsToShow]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-8">
              Latest from Facebook
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-16 ${className}`}>
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">
              Latest from Facebook
            </h2>
            <p className="text-red-500">{error}</p>
            <p className="mt-4">
              <a
                href={`https://www.facebook.com/${pageId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Visit our Facebook page
              </a>
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={`py-16 bg-blue-50 ${className}`}>
      <Container>
        <div className="text-center mb-12">
            <SectionHeading
                subtitle="What's been happening?"
                title="Our latest updates from Facebook"
                theme="light"
            />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md"
            >
              {post.full_picture && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.full_picture}
                    alt="Facebook post"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(post.created_time)}
                </p>

                <p className="text-gray-800 mb-4">
                  {post.message && post.message.length > 150
                    ? `${post.message.substring(0, 150)}...`
                    : post.message}
                </p>

                <a
                  href={post.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Read More on Facebook
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={`https://www.facebook.com/${pageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Visit Our Facebook Page
          </a>
        </div>
      </Container>
    </div>
  );
};
