"use client";

import { useRef } from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Link } from "../ui/Link";
import { PlusGrid, PlusGridItem, PlusGridRow } from "./PlusGrid";
import { MobileNavBubbles } from "../graphics/MobileNavBubbles";

const links = [
    { href: "/pricing", label: "Pricing" },
    { href: "/booking/start", label: "Book Now" },
    { href: "/company", label: "Company" },
    { href: "/blog", label: "Blog" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
];

function DesktopNav() {
    return (
        <nav className="relative hidden lg:flex">
            {links.map(({ href, label }) => (
                <PlusGridItem key={href} className="relative flex">
                    <Link
                        href={href}
                        className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/2.5"
                    >
                        {label}
                    </Link>
                </PlusGridItem>
            ))}
        </nav>
    );
}

function MobileNavButton() {
    return (
        <DisclosureButton
            className="flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 lg:hidden"
            aria-label="Open main menu"
        >
            <Bars2Icon className="size-6" />
        </DisclosureButton>
    );
}

function MobileNav() {
    // Create refs for each nav link to detect collisions
    const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    // Convert to RefObject array for MobileNavBubbles
    const refObjects = navRefs.current
        .filter((el): el is HTMLAnchorElement => el !== null)
        .map((el) => ({ current: el }));

    return (
        <DisclosurePanel className="lg:hidden">
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-400">
                {/* Bubbles animation in the background */}
                <MobileNavBubbles navRefs={refObjects} />

                <nav className="flex flex-col items-center gap-8 relative z-10">
                    {links.map(({ href, label }, linkIndex) => (
                        <motion.div
                            initial={{ opacity: 0, rotateX: -90 }}
                            animate={{ opacity: 1, rotateX: 0 }}
                            transition={{
                                duration: 0.15,
                                ease: "easeInOut",
                                rotateX: {
                                    duration: 0.3,
                                    delay: linkIndex * 0.1,
                                },
                            }}
                            key={href}
                        >
                            <Link
                                href={href}
                                className="text-3xl font-medium text-white"
                                ref={(el) => {
                                    navRefs.current[linkIndex] = el;
                                }}
                            >
                                {label}
                            </Link>
                        </motion.div>
                    ))}
                </nav>
                <DisclosureButton
                    className="absolute bottom-8 flex items-center justify-center z-10"
                    aria-label="Close menu"
                >
                    <XMarkIcon className="size-12 text-white" />
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
            className={`flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 ${className || ""}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
    return (
        <Disclosure as="header" className="pt-4 sm:pt-16 px-4">
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
