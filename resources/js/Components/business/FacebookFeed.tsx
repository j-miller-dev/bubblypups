import React from 'react';
import { Container } from '@/Components/layout';
import { SectionHeading } from "@/Components/graphics";


interface FacebookFeedProps {
  /**
   * Full Facebook page URL, defaults to the Bubbly Pups page provided.
   */
  pageUrl?: string;
  className?: string;
  height?: number;
}

/**
 * Facebook Page Plugin embed showing the latest timeline posts.
 * This does not require a Facebook API token and always shows the live feed.
 */
export const FacebookFeed: React.FC<FacebookFeedProps> = ({
  pageUrl = 'https://www.facebook.com/p/Bubbly-Pups-100063046069136/',
  className = '',
  height = 720,
}) => {
  const encoded = encodeURIComponent(pageUrl);
  const src = `https://www.facebook.com/plugins/page.php?href=${encoded}&tabs=timeline&width=500&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`;

  return (
    <div className={`py-16 ${className}`}>


      <Container className="flex flex-col items-center justify-center py-24">


        <div className="text-center mb-12">
          <SectionHeading
            subtitle="What's been happening?"
            title="Our latest updates from Facebook"
            theme="light"
          />
        </div>

        {/* Responsive Facebook Page Plugin wrapper */}
        <div className="mx-auto max-w-4xl">
          <div className="relative w-full" style={{ paddingTop: '0px' }}>
            <iframe
              title="Bubbly Pups Facebook Timeline"
              src={src}
              width="100%"
              height={height}
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Fallback link for environments where iframes are blocked */}
          <div className="mt-6 text-center text-sm text-gray-600">
            If you cannot see the feed, please visit our page directly:
            {' '}
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Bubbly Pups on Facebook
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};
