import { useForm } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckCircleIcon,
} from "@heroicons/react/20/solid";

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

    const initials = customer.name.charAt(0).toUpperCase();

    return (
        <CustomerLayout customer={customer}>
            {/* Header */}
            <div className="mb-8">
                <h2 className="!text-2xl md:!text-3xl text-gray-950">
                    My <span className="text-brand-500">Profile</span>
                </h2>
                <p className="mt-1 text-gray-500">
                    Manage your personal information.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="card p-6 text-center">
                        <div className="flex size-20 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-display font-extrabold text-2xl mx-auto">
                            {initials}
                        </div>
                        <p className="mt-4 font-display font-extrabold text-gray-900">
                            {customer.name}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Customer Account
                        </p>

                        <div className="mt-6 space-y-3 border-t border-gray-100 pt-6 text-left">
                            <div className="flex items-center gap-3 text-sm">
                                <EnvelopeIcon className="size-4 text-brand-400 shrink-0" />
                                <span className="text-gray-600 truncate">
                                    {customer.email}
                                </span>
                            </div>
                            {customer.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <PhoneIcon className="size-4 text-brand-400 shrink-0" />
                                    <span className="text-gray-600">
                                        {customer.phone}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <p className="font-display font-extrabold text-gray-900 mb-6">
                            Personal Information
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="label">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UserIcon className="size-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="input pl-9"
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="label">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <EnvelopeIcon className="size-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="input pl-9"
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                                <p className="mt-1.5 text-xs text-gray-400">
                                    Appointment confirmations are sent here.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="phone" className="label">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <PhoneIcon className="size-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className="input pl-9"
                                        required
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {recentlySuccessful && (
                                <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                                    <CheckCircleIcon className="size-4 shrink-0" />
                                    Profile updated successfully.
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData({
                                            name: customer.name,
                                            email: customer.email,
                                            phone: customer.phone,
                                        })
                                    }
                                    className="btn-outline !text-sm !px-4 !py-2"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-primary !text-sm !px-4 !py-2 disabled:opacity-50"
                                >
                                    {processing ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Password note */}
                    <div className="rounded-card border border-brand-100 bg-brand-50 px-5 py-4">
                        <p className="text-sm font-display font-extrabold text-gray-900">
                            Need to update your password?
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Use the{" "}
                            <a
                                href={route("customer.password.request")}
                                className="font-medium text-brand-500 hover:text-brand-600"
                            >
                                forgot password
                            </a>{" "}
                            flow to reset it yourself.
                        </p>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
