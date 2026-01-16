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
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, usePage, router } from "@inertiajs/react";

function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

interface CustomerLayoutProps {
    children: React.ReactNode;
    customer: {
        id: number;
        name: string;
        email: string;
    };
}

export default function CustomerLayout({
    children,
    customer,
}: CustomerLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url } = usePage();

    const navigation = [
        { name: "Dashboard", href: "/my/dashboard", icon: HomeIcon },
        { name: "Appointments", href: "/my/appointments", icon: CalendarIcon },
        { name: "My Dogs", href: "/my/dogs", icon: HeartIcon },
        { name: "Profile", href: "/my/profile", icon: UserIcon },
    ];

    const isCurrent = (href: string) => url.startsWith(href);

    const handleLogout = () => {
        router.post("/customer/logout");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
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
                        <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        isCurrent(item.href)
                                            ? "border-primary-500 text-gray-900"
                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* User Menu */}
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <Menu as="div" className="relative ml-3">
                                <MenuButton className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    <div className="flex items-center gap-x-3">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                                            <span className="text-sm font-semibold">
                                                {customer.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {customer.name}
                                        </span>
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="size-5 text-gray-400"
                                        />
                                    </div>
                                </MenuButton>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                    <MenuItem>
                                        <Link
                                            href="/my/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100"
                                        >
                                            Your Profile
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            href="/booking/create"
                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100"
                                        >
                                            Book Appointment
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100"
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
                                className="-mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
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

                        {/* Mobile User Info */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <div className="flex items-center">
                                <div className="flex size-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                                    <span className="text-base font-semibold">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">
                                        {customer.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {customer.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation Links */}
                        <div className="space-y-1 px-2 pb-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        isCurrent(item.href)
                                            ? "bg-primary-50 text-primary-700"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                        "flex items-center gap-x-3 rounded-md px-3 py-2 text-base font-medium",
                                    )}
                                >
                                    <item.icon
                                        className={classNames(
                                            isCurrent(item.href)
                                                ? "text-primary-700"
                                                : "text-gray-400",
                                            "size-6",
                                        )}
                                        aria-hidden
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Actions */}
                        <div className="border-t border-gray-200 px-4 py-6">
                            <Link
                                href="/booking/create"
                                className="block rounded-md bg-primary-600 px-4 py-2 text-center text-base font-medium text-white hover:bg-primary-700"
                            >
                                Book Appointment
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="mt-3 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-base font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Sign out
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Main Content */}
            <main>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
