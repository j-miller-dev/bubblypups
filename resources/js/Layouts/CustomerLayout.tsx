import React, { useState } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    CalendarIcon,
    UserIcon,
    HeartIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, CalendarDaysIcon } from "@heroicons/react/20/solid";
import { Link, usePage, router } from "@inertiajs/react";

interface CustomerLayoutProps {
    children: React.ReactNode;
    customer: {
        id: number;
        name: string;
        email: string;
    };
}

const navigation = [
    { name: "Dashboard", href: "/my/dashboard", icon: HomeIcon },
    { name: "Appointments", href: "/my/appointments", icon: CalendarIcon },
    { name: "My Dogs", href: "/my/dogs", icon: HeartIcon },
    { name: "Profile", href: "/my/profile", icon: UserIcon },
];

export default function CustomerLayout({
    children,
    customer,
}: CustomerLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url } = usePage();

    const isCurrent = (href: string) => url.startsWith(href);

    const handleLogout = () => {
        router.post("/customer/logout");
    };

    const initials = customer.name.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Brand accent bar */}
            <div className="h-1 bg-gradient-to-r from-brand-400 via-purple-400 to-blue-400" />

            {/* Top Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <img
                                    alt="Bubbly Pups"
                                    src="/images/PNG%20FIles/BubblyPups_LogoAlt(LBG).png"
                                    className="h-8 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden sm:flex sm:items-center sm:gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={[
                                        "inline-flex items-center gap-1.5 border-b-2 px-3 pt-1 pb-0.5 text-sm font-medium font-display transition-colors",
                                        isCurrent(item.href)
                                            ? "border-brand-400 text-brand-500"
                                            : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                                    ].join(" ")}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop right side: Book + User menu */}
                        <div className="hidden sm:flex sm:items-center sm:gap-4">
                            <Link
                                href="/booking/create"
                                className="btn-primary !py-2 !text-sm"
                            >
                                <CalendarDaysIcon className="h-4 w-4" />
                                Book Now
                            </Link>

                            <Menu as="div" className="relative">
                                <MenuButton className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-sm font-display font-extrabold">
                                        {initials}
                                    </div>
                                    <span className="font-medium text-gray-700">
                                        {customer.name.split(" ")[0]}
                                    </span>
                                    <ChevronDownIcon className="size-4 text-gray-400" />
                                </MenuButton>

                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-card bg-white py-1 shadow-lg ring-1 ring-black/5 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                    <MenuItem>
                                        <Link
                                            href="/my/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-50"
                                        >
                                            Your Profile
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-50"
                                        >
                                            Sign out
                                        </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="-mx-2 inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="size-6" aria-hidden />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="relative z-50 sm:hidden"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-600/75 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />
                <div className="fixed inset-0 z-50 flex">
                    <DialogPanel
                        transition
                        className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <div className="flex px-4 pt-5 pb-2">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="size-6" aria-hidden />
                            </button>
                        </div>

                        {/* Mobile user info */}
                        <div className="border-t border-gray-100 px-4 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-display font-extrabold">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {customer.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {customer.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile nav links */}
                        <div className="space-y-1 px-2 pb-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={[
                                        "flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium font-display transition-colors",
                                        isCurrent(item.href)
                                            ? "bg-brand-50 text-brand-600"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                    ].join(" ")}
                                >
                                    <item.icon
                                        className={[
                                            "size-5",
                                            isCurrent(item.href)
                                                ? "text-brand-500"
                                                : "text-gray-400",
                                        ].join(" ")}
                                        aria-hidden
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile actions */}
                        <div className="border-t border-gray-100 px-4 py-5 space-y-3">
                            <Link
                                href="/booking/create"
                                className="btn-primary w-full justify-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <CalendarDaysIcon className="h-4 w-4" />
                                Book Appointment
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn-outline w-full justify-center"
                            >
                                Sign out
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Page content */}
            <main>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
