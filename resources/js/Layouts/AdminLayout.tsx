import { useState, type ReactNode } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
} from "@headlessui/react";
import {
    Bars3Icon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    HeartIcon,
    HomeIcon,
    NewspaperIcon,
    XMarkIcon,
    ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, usePage } from "@inertiajs/react";

const nav = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon, exact: true },
    { name: "Bookings", href: "/dashboard/bookings", icon: ClipboardDocumentListIcon, exact: false },
    { name: "Doggie Database", href: "/dashboard/dogs", icon: HeartIcon, exact: false },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon, exact: false },
    { name: "My Availability", href: "/dashboard/availability", icon: ClockIcon, exact: false },
    { name: "Blog Posts", href: "/admin/blog", icon: NewspaperIcon, exact: false },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    const isCurrent = (href: string, exact: boolean) => {
        if (exact) return url === href;
        return url === href || url.startsWith(href + "/");
    };

    const renderNav = () => (
        <ul role="list" className="-mx-2 space-y-0.5">
            {nav.map((item) => {
                const active = isCurrent(item.href, item.exact);
                return (
                    <li key={item.name}>
                        <Link
                            href={item.href}
                            className={[
                                "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-display font-extrabold transition-colors",
                                active
                                    ? "bg-brand-50 text-brand-600"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                            ].join(" ")}
                        >
                            <item.icon
                                aria-hidden
                                className={[
                                    "size-5 shrink-0 transition-colors",
                                    active
                                        ? "text-brand-500"
                                        : "text-gray-400 group-hover:text-gray-600",
                                ].join(" ")}
                            />
                            <span className="flex-1">{item.name}</span>
                            {active && (
                                <span className="size-1.5 rounded-full bg-brand-400" />
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    const renderSignOut = () => (
        <Link
            href={route("logout")}
            method="post"
            as="button"
            className="group -mx-2 flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-display font-extrabold text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
            <ArrowRightStartOnRectangleIcon
                aria-hidden
                className="size-5 shrink-0 text-gray-400 transition-colors group-hover:text-gray-600"
            />
            Sign out
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Brand accent bar */}
            <div className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-brand-400 via-purple-400 to-blue-400" />

            {/* Mobile sidebar */}
            <Dialog
                open={sidebarOpen}
                onClose={setSidebarOpen}
                className="relative z-40 lg:hidden"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />
                <div className="fixed inset-0 flex pt-1">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="-m-2.5 p-2.5"
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <XMarkIcon aria-hidden className="size-6 text-white" />
                                </button>
                            </div>
                        </TransitionChild>
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-5 pb-4 shadow-xl">
                            <div className="flex h-16 shrink-0 items-center">
                                <img
                                    alt="Bubbly Pups"
                                    src="/images/PNG%20FIles/BubblyPups_LogoAlt(LBG).png"
                                    className="h-8 w-auto"
                                />
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                    <li>{renderNav()}</li>
                                    <li className="mt-auto">{renderSignOut()}</li>
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:top-1 lg:z-40 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-100 bg-white px-5 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            alt="Bubbly Pups"
                            src="/images/PNG%20FIles/BubblyPups_LogoAlt(LBG).png"
                            className="h-8 w-auto"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <p className="mb-3 px-1 text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
                                    Navigation
                                </p>
                                {renderNav()}
                            </li>
                            <li className="mt-auto border-t border-gray-100 pt-4">
                                {renderSignOut()}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Top bar + content */}
            <div className="lg:pl-64 pt-1">
                <div className="sticky top-1 z-30 flex h-14 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/90 px-4 shadow-xs backdrop-blur-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon aria-hidden className="size-6" />
                    </button>
                    <div aria-hidden className="h-6 w-px bg-gray-200 lg:hidden" />

                    <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
                        <div aria-hidden className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
                        <Menu as="div" className="relative">
                            <MenuButton className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors">
                                <span className="sr-only">Open user menu</span>
                                <div className="flex size-7 items-center justify-center rounded-full bg-brand-100 font-display font-extrabold text-xs text-brand-600">
                                    A
                                </div>
                                <span className="hidden lg:flex lg:items-center gap-1">
                                    <span
                                        aria-hidden
                                        className="text-sm font-display font-extrabold text-gray-900"
                                    >
                                        Admin
                                    </span>
                                    <ChevronDownIcon
                                        aria-hidden
                                        className="size-4 text-gray-400"
                                    />
                                </span>
                            </MenuButton>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-card border border-gray-100 bg-white py-2 shadow-lg transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <MenuItem>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="block w-full px-3 py-1.5 text-left text-sm font-display font-extrabold text-gray-700 data-focus:bg-gray-50"
                                    >
                                        Sign out
                                    </Link>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>

                <main className="py-8">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
