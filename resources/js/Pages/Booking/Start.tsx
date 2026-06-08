import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { Head } from "@inertiajs/react";
import { Link } from "@/Components/ui";
import {
    CalendarDaysIcon,
    UserCircleIcon,
    UserPlusIcon,
    PhoneIcon,
} from "@heroicons/react/20/solid";

export default function Start() {
    return (
        <MainLayout title="Book a Grooming Appointment">
            <Head title="Book a Grooming Appointment" />

            <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50 py-20 sm:py-28">
                {/* Decorative blobs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand-100 opacity-60 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-100 opacity-50 blur-3xl"
                />

                <Container>
                    {/* Header */}
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-medium shadow-sm mb-6">
                            <CalendarDaysIcon className="h-4 w-4" />
                            Ready to book?
                        </span>
                        <h2 className="text-gray-950">
                            Book a grooming{" "}
                            <span className="text-brand-500">appointment</span>
                        </h2>
                        <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                            Are you a returning customer, or is this your first
                            visit with Bubbly Pups?
                        </p>
                    </div>

                    {/* Option cards */}
                    <div className="mx-auto max-w-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Returning customer */}
                            <div className="flex flex-col card-hover p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                                        <UserCircleIcon className="w-7 h-7 text-brand-400" />
                                    </div>
                                </div>
                                <p className="font-display font-extrabold text-gray-900 mb-2">
                                    I'm a returning customer
                                </p>
                                <p className="text-sm text-gray-500 mb-5 flex-1">
                                    Log in and book your next appointment in
                                    seconds.
                                </p>
                                <Link
                                    href="/booking/create"
                                    className="btn-primary w-full"
                                >
                                    Continue
                                </Link>
                            </div>

                            {/* New customer */}
                            <div className="flex flex-col card-hover p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                                        <UserPlusIcon className="w-7 h-7 text-purple-400" />
                                    </div>
                                </div>
                                <p className="font-display font-extrabold text-gray-900 mb-2">
                                    I'm new here
                                </p>
                                <p className="text-sm text-gray-500 mb-5 flex-1">
                                    Create a quick profile for you and your pup.
                                    It only takes a minute.
                                </p>
                                <Link
                                    href="/register"
                                    className="btn-secondary w-full"
                                >
                                    Get started
                                </Link>
                            </div>
                        </div>

                        {/* Phone option */}
                        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-card border border-brand-100 bg-brand-50 px-5 py-4">
                            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-white border border-brand-100 flex items-center justify-center shrink-0">
                                    <PhoneIcon className="w-7 h-7 md:w-4 md:h-4 text-brand-400" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="font-display font-extrabold text-gray-900 text-sm">
                                        Prefer to call?
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Sometimes a quick chat is all you need.
                                    </p>
                                </div>
                            </div>
                            <a
                                href="tel:+61300000000"
                                className="btn-primary shrink-0 whitespace-nowrap"
                            >
                                <PhoneIcon className="h-4 w-4" />
                                Call to Book
                            </a>
                        </div>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
