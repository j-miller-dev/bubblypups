import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { useForm } from "@inertiajs/react";
import { UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

interface ProfileProps {
    customer: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
}

export default function Profile({ customer }: ProfileProps) {
    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch("/my/profile");
    };

    return (
        <CustomerLayout customer={customer}>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="mt-2 text-gray-600">
                    Manage your personal information
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Sidebar - Profile Summary */}
                <div className="lg:col-span-1">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-6 py-5">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="flex size-24 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                                    <span className="text-3xl font-semibold">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>

                                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                                    {customer.name}
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Customer Account
                                </p>
                            </div>

                            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                                <div className="flex items-center text-sm">
                                    <EnvelopeIcon
                                        className="mr-3 size-5 text-gray-400"
                                        aria-hidden
                                    />
                                    <span className="text-gray-700 truncate">
                                        {customer.email}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <PhoneIcon
                                        className="mr-3 size-5 text-gray-400"
                                        aria-hidden
                                    />
                                    <span className="text-gray-700">
                                        {customer.phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content - Edit Form */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-6 py-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Personal Information
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Full Name *
                                    </label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <UserIcon
                                                className="size-5 text-gray-400"
                                                aria-hidden
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email Address *
                                    </label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <EnvelopeIcon
                                                className="size-5 text-gray-400"
                                                aria-hidden
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        We'll send appointment confirmations to
                                        this email.
                                    </p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Phone Number *
                                    </label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <PhoneIcon
                                                className="size-5 text-gray-400"
                                                aria-hidden
                                            />
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                            required
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        We'll use this to contact you about your
                                        appointments.
                                    </p>
                                </div>

                                {/* Success Message */}
                                {recentlySuccessful && (
                                    <div className="rounded-md bg-green-50 p-4">
                                        <div className="flex">
                                            <div className="shrink-0">
                                                <svg
                                                    className="size-5 text-green-400"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-green-800">
                                                    Profile updated
                                                    successfully!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex items-center justify-end gap-x-3 border-t border-gray-200 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData({
                                                name: customer.name,
                                                email: customer.email,
                                                phone: customer.phone,
                                            });
                                        }}
                                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Additional Info Card */}
                    <div className="mt-6 overflow-hidden rounded-lg bg-blue-50 shadow">
                        <div className="px-6 py-5">
                            <h4 className="text-sm font-semibold text-gray-900">
                                Need to update your password?
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                                For security reasons, please contact us to reset
                                your password.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
