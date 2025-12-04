import React from 'react';
import { Head } from '@inertiajs/react';
import { Navbar, Footer } from '@/Components/layout';
import Toast from '@/Components/ui/Toast';


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
      </Head>
      <Toast />
      <div className="flex min-h-screen flex-col overflow-hidden">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />

      </div>
    </>
  );
}
