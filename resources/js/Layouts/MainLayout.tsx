import React from 'react';
import { Head } from '@inertiajs/react';
import { Navbar } from '@/Components/Navbar';
import { Footer } from '@/Components/Footer';
import { CallNowButton } from '@/Components/CallNowButton';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function MainLayout({
  children,
  title = 'Bubbly Pups Website',
  description = 'Professional dog grooming and care. Serving our community with bubbly, happy pups!'
}: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
      </Head>
      <div className="flex min-h-screen flex-col overflow-hidden">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CallNowButton phoneNumber="555-123-4567" />
      </div>
    </>
  );
}
