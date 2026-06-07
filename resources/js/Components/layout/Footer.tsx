import { Link } from "@inertiajs/react";
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon,
} from "@heroicons/react/20/solid";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Book an Appointment", href: "/booking/start" },
];

const contactDetails = [
    {
        icon: MapPinIcon,
        text: "Sunbury VIC 3429",
        subtext: "Also servicing Diggers Rest, Riddells Creek & surrounds",
    },
    {
        icon: PhoneIcon,
        text: "(03) 0000 0000",
        href: "tel:+61300000000",
    },
    {
        icon: EnvelopeIcon,
        text: "hello@bubblypups.com.au",
        href: "mailto:hello@bubblypups.com.au",
    },
    {
        icon: ClockIcon,
        text: "Mon – Sat: 8:00 am – 5:00 pm",
        subtext: "Closed Sundays & Public Holidays",
    },
];

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
    );
}

const socialLinks = [
    {
        name: "Facebook",
        href: "https://facebook.com/bubblypups",
        Icon: FacebookIcon,
    },
    {
        name: "Instagram",
        href: "https://instagram.com/bubblypups",
        Icon: InstagramIcon,
    },
];

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-white">
            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-r from-brand-400 via-purple-400 to-blue-400" />

            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">

                    {/* Column 1: Brand */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="block w-fit">
                            <img
                                src="/images/PNG%20FIles/BubblyPups_LogoAlt(DBG).png"
                                alt="Bubbly Pups"
                                className="h-12 w-auto"
                            />
                        </Link>

                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            A calm, loving grooming experience for every pup — from bubbly
                            baths to tidy trims, all in Sunbury, VIC.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map(({ name, href, Icon }) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={name}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors duration-200 hover:bg-brand-400/20 hover:text-brand-300"
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-sm font-display font-extrabold uppercase tracking-widest text-gray-500 mb-6">
                            Quick Links
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {quickLinks.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-sm text-gray-400 transition-colors duration-200 hover:text-brand-300"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h3 className="text-sm font-display font-extrabold uppercase tracking-widest text-gray-500 mb-6">
                            Get in Touch
                        </h3>
                        <ul className="flex flex-col gap-5">
                            {contactDetails.map(({ icon: Icon, text, subtext, href }) => (
                                <li key={text} className="flex items-start gap-3">
                                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                                    <div>
                                        {href ? (
                                            <a
                                                href={href}
                                                className="text-sm text-gray-300 transition-colors duration-200 hover:text-brand-300"
                                            >
                                                {text}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-300">{text}</p>
                                        )}
                                        {subtext && (
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {subtext}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="text-xs text-gray-500">
                        &copy; {year} Bubbly Pups. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-600">
                        Made with 🐾 in Sunbury, VIC
                    </p>
                </div>
            </div>
        </footer>
    );
}
