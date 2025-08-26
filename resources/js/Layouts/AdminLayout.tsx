import React, { useState } from "react";
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
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Link, usePage } from "@inertiajs/react";

function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();

    const nav = [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
        { name: "Bookings", href: "/dashboard/bookings", icon: CalendarIcon },
        { name: "Doggie Database", href: "/dashboard/dogs", icon: UsersIcon },
        { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
        { name: "Documents", href: "#", icon: DocumentDuplicateIcon },
        {
            name: "My Availability",
            href: "/dashboard/availability",
            icon: ChartPieIcon,
        },
    ];

    const teams = [{ id: 1, name: "Bubbly Pups", href: "#", initial: "BP" }];

    const userNavigation = [
        { name: "Your profile", href: "#" },
        { name: "Sign out", href: "#" },
    ];

    const isCurrent = (href: string) => url.startsWith(href);

    return (
        <div>
            {/* Mobile sidebar */}
            <Dialog
                open={sidebarOpen}
                onClose={setSidebarOpen}
                className="relative z-50 lg:hidden"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />
                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="-m-2.5 p-2.5"
                                >
                                    <span className="sr-only">
                                        Close sidebar
                                    </span>
                                    <XMarkIcon
                                        aria-hidden="true"
                                        className="size-6 text-white"
                                    />
                                </button>
                            </div>
                        </TransitionChild>

                        <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                            <div className="relative flex h-16 shrink-0 items-center">
                                <img
                                    alt="Bubbly Pups"
                                    src="/images/PNG%20FIles/BubblyPups_LogoAlt(LBG).png"
                                    className="h-8 w-auto"
                                />
                            </div>
                            <nav className="relative flex flex-1 flex-col">
                                <ul
                                    role="list"
                                    className="flex flex-1 flex-col gap-y-7"
                                >
                                    <li>
                                        <ul
                                            role="list"
                                            className="-mx-2 space-y-1"
                                        >
                                            {nav.map((item) => (
                                                <li key={item.name}>
                                                    <Link
                                                        href={item.href}
                                                        className={classNames(
                                                            isCurrent(item.href)
                                                                ? "bg-gray-50 text-indigo-600"
                                                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                                        )}
                                                    >
                                                        <item.icon
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                isCurrent(
                                                                    item.href,
                                                                )
                                                                    ? "text-indigo-600"
                                                                    : "text-gray-400 group-hover:text-indigo-600",
                                                                "size-6 shrink-0",
                                                            )}
                                                        />
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                    <li>
                                        <div className="text-xs/6 font-semibold text-gray-400">
                                            Your team
                                        </div>
                                        <ul
                                            role="list"
                                            className="-mx-2 mt-2 space-y-1"
                                        >
                                            {teams.map((team) => (
                                                <li key={team.name}>
                                                    <a
                                                        href={team.href}
                                                        className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                                    >
                                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium">
                                                            {team.initial}
                                                        </span>
                                                        <span className="truncate">
                                                            {team.name}
                                                        </span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Desktop sidebar */}
            <div className="hidden bg-gray-900 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            alt="Bubbly Pups"
                            src="/images/PNG%20FIles/BubblyPups_LogoAlt(LBG).png"
                            className="h-8 w-auto"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                        >
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {nav.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={classNames(
                                                    isCurrent(item.href)
                                                        ? "bg-gray-50 text-indigo-600"
                                                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                                    "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                                )}
                                            >
                                                <item.icon
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        isCurrent(item.href)
                                                            ? "text-indigo-600"
                                                            : "text-gray-400 group-hover:text-indigo-600",
                                                        "size-6 shrink-0",
                                                    )}
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <a
                                    href="#"
                                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                >
                                    <Cog6ToothIcon
                                        aria-hidden="true"
                                        className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                    />
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Top bar */}
            <div className="lg:pl-72">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                    <div
                        aria-hidden
                        className="h-6 w-px bg-gray-200 lg:hidden"
                    />

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <form
                            action="#"
                            method="GET"
                            className="grid flex-1 grid-cols-1"
                        >
                            <input
                                name="search"
                                placeholder="Search"
                                aria-label="Search"
                                className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                            />
                            <MagnifyingGlassIcon
                                aria-hidden
                                className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                            />
                        </form>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">
                                    View notifications
                                </span>
                                <BellIcon aria-hidden className="size-6" />
                            </button>
                            <div
                                aria-hidden
                                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                            />
                            <Menu as="div" className="relative">
                                <MenuButton className="relative flex items-center">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    <img
                                        alt=""
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80"
                                        className="size-8 rounded-full bg-gray-50 outline -outline-offset-1 outline-black/5"
                                    />
                                    <span className="hidden lg:flex lg:items-center">
                                        <span
                                            aria-hidden
                                            className="ml-4 text-sm/6 font-semibold text-gray-900"
                                        >
                                            Admin
                                        </span>
                                        <ChevronDownIcon
                                            aria-hidden
                                            className="ml-2 size-5 text-gray-400"
                                        />
                                    </span>
                                </MenuButton>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg outline-1 outline-gray-900/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                    {userNavigation.map((item) => (
                                        <MenuItem key={item.name}>
                                            <a
                                                href={item.href}
                                                className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                                            >
                                                {item.name}
                                            </a>
                                        </MenuItem>
                                    ))}
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>
                </div>

                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
