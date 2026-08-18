import { Link } from "@inertiajs/react";

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
    );
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
    );
}

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="h-1 bg-gradient-to-r from-brand-400 via-purple-400 to-blue-400" />
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    <Link href="/" className="block">
                        <img
                            src="/images/PNG%20FIles/BubblyPups_LogoAlt(LBG).png"
                            alt="Bubbly Pups"
                            className="h-8 w-auto"
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://facebook.com/bubblypups"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-gray-400 hover:text-brand-500 transition-colors"
                        >
                            <FacebookIcon className="size-5" />
                        </a>
                        <a
                            href="https://instagram.com/bubblypups"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-gray-400 hover:text-brand-500 transition-colors"
                        >
                            <InstagramIcon className="size-5" />
                        </a>
                    </div>

                    <p className="text-xs text-gray-400">
                        &copy; {year} Bubbly Pups. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
