import { useState, useEffect, useRef } from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { Link } from "../ui/Link";
import { usePage } from "@inertiajs/react";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./PlusGrid";
import { MobileNavBubbles } from "../graphics/MobileNavBubbles";

// Desktop nav links — only links to routes that actually exist.
const navLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
];

// Mobile menu shows the full set including Book Now and Login.
const mobileLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/booking/start", label: "Book Now" },
    { href: "/customer/login", label: "Login" },
];

function DesktopNav() {
    const { url } = usePage();

    const isActive = (href: string): boolean => {
        if (href === "/") return url === "/";
        return url.startsWith(href);
    };

    return (
        <nav className="relative hidden lg:flex items-center">
            {navLinks.map(({ href, label }) => (
                <PlusGridItem key={href} className="relative flex">
                    <Link
                        href={href}
                        className={[
                            "flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200",
                            isActive(href)
                                ? "text-brand-500"
                                : "text-gray-700 hover:text-gray-950",
                        ].join(" ")}
                    >
                        {label}
                    </Link>
                </PlusGridItem>
            ))}

            {/* Login + Book Now grouped at the end */}
            <PlusGridItem className="relative flex items-center gap-3 pl-2">
                <Link
                    href="/customer/login"
                    className={[
                        "text-sm font-medium transition-colors duration-200 px-3 py-3",
                        isActive("/customer/login")
                            ? "text-brand-500"
                            : "text-gray-500 hover:text-gray-800",
                    ].join(" ")}
                >
                    Login
                </Link>
                <Link
                    href="/booking/start"
                    className="inline-flex items-center gap-1.5 bg-brand-400 text-white rounded-button px-4 py-2 text-sm font-medium font-display hover:bg-brand-500 active:bg-brand-600 transition-colors duration-200 shadow-sm"
                >
                    <CalendarIcon className="h-4 w-4" />
                    Book Now
                </Link>
            </PlusGridItem>
        </nav>
    );
}

function MobileNavButton() {
    return (
        <DisclosureButton
            className="flex size-12 items-center justify-center self-center rounded-lg hover:bg-black/5 transition-colors duration-200 lg:hidden"
            aria-label="Open main menu"
        >
            <Bars2Icon className="size-6" />
        </DisclosureButton>
    );
}

function MobileNav() {
    const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const refObjects = navRefs.current
        .filter((el): el is HTMLAnchorElement => el !== null)
        .map((el) => ({ current: el }));

    const mainLinks = mobileLinks.slice(0, 4);
    const bookNow = mobileLinks[4];
    const login = mobileLinks[5];

    return (
        <DisclosurePanel className="lg:hidden">
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-400">
                <MobileNavBubbles navRefs={refObjects} />

                <nav className="flex flex-col items-center relative z-10">
                    {/* Main nav links */}
                    {mainLinks.map(({ href, label }, linkIndex) => (
                        <motion.div
                            key={href}
                            initial={{ opacity: 0, rotateX: -90 }}
                            animate={{ opacity: 1, rotateX: 0 }}
                            transition={{
                                duration: 0.15,
                                ease: "easeInOut",
                                rotateX: {
                                    duration: 0.3,
                                    delay: linkIndex * 0.08,
                                },
                            }}
                        >
                            <Link
                                href={href}
                                className="block px-6 py-2.5 text-3xl font-extrabold text-white"
                                ref={(el) => {
                                    navRefs.current[linkIndex] = el;
                                }}
                            >
                                {label}
                            </Link>
                        </motion.div>
                    ))}

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="my-6 w-10 border-t border-white/30"
                    />

                    {/* Book Now CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.2 }}
                    >
                        <Link
                            href={bookNow.href}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-xl font-extrabold font-display text-brand-500 shadow-sm"
                            ref={(el) => {
                                navRefs.current[4] = el;
                            }}
                        >
                            <CalendarIcon className="size-5" />
                            {bookNow.label}
                        </Link>
                    </motion.div>

                    {/* Login */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            href={login.href}
                            className="mt-3 block px-4 py-2 text-sm font-display font-extrabold text-white/60 hover:text-white transition-colors"
                            ref={(el) => {
                                navRefs.current[5] = el;
                            }}
                        >
                            Already a customer? Login
                        </Link>
                    </motion.div>
                </nav>

                <DisclosureButton
                    className="absolute bottom-8 flex size-14 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                    aria-label="Close menu"
                >
                    <XMarkIcon className="size-7 text-white" />
                </DisclosureButton>
            </div>
        </DisclosurePanel>
    );
}

export function NavbarItem({
    className,
    children,
    ...props
}: React.ComponentPropsWithoutRef<"button">) {
    return (
        <button
            className={`flex size-12 items-center justify-center self-center rounded-lg hover:bg-black/5 ${className ?? ""}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Disclosure
            as="header"
            className={[
                "sticky top-0 z-40 bg-white/95 transition-shadow duration-300 px-4 sm:px-6 lg:px-8",
                scrolled ? "shadow-md" : "",
            ].join(" ")}
        >
            <PlusGrid>
                <PlusGridRow className="relative flex justify-between">
                    <div className="relative flex gap-6">
                        <PlusGridItem className="py-3">
                            <Link href="/" title="Home" className="block">
                                <img
                                    src="/images/PNG%20FIles/BubblyPups_LogoAlt(LBG).png"
                                    alt="Bubbly Pups"
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </PlusGridItem>
                        {banner && (
                            <div className="relative hidden items-center py-3 lg:flex">
                                {banner}
                            </div>
                        )}
                    </div>
                    <DesktopNav />
                    <MobileNavButton />
                </PlusGridRow>
            </PlusGrid>
            <MobileNav />
        </Disclosure>
    );
}
