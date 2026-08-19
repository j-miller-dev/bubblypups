import React from "react";
import BreedSelector from "@/Components/ui/BreedSelector";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { UserPlusIcon } from "@heroicons/react/20/solid";

function SectionDivider({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
                {label}
            </span>
            <div className="h-px flex-1 bg-gray-100" />
        </div>
    );
}

export default function CustomerRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        dog_name: "",
        dog_breed: "",
        dog_size: "medium",
        dog_notes: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("customer.register"));
    };

    return (
        <MainLayout title="Create Account | Bubbly Pups">
            <Head title="Create Account" />

            <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50 py-16 sm:py-24">
                {/* Decorative blobs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-purple-100 opacity-50 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-brand-100 opacity-40 blur-3xl"
                />

                <div className="mx-auto max-w-2xl px-6 lg:px-8">
                    {/* Page header */}
                    <div className="mb-10">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 text-purple-600 text-sm font-medium shadow-sm mb-5">
                            <UserPlusIcon className="h-4 w-4" />
                            New customer
                        </span>
                        <h2 className="text-gray-950">
                            Welcome to{" "}
                            <span className="text-brand-500">Bubbly Pups</span>
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Create your account and tell us about your pup.
                            We'll get you booked in right away.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Owner details */}
                        <div className="space-y-4">
                            <SectionDivider label="About you" />

                            <div>
                                <label htmlFor="name" className="label">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    autoFocus
                                    required
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="input"
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="label">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="username"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="input"
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="label">
                                        Mobile number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className="input"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="input"
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="label"
                                    >
                                        Confirm password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        className="input"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dog details */}
                        <div className="space-y-4">
                            <SectionDivider label="About your pup" />

                            <div>
                                <label htmlFor="dog_name" className="label">
                                    Dog's name
                                </label>
                                <input
                                    id="dog_name"
                                    name="dog_name"
                                    type="text"
                                    required
                                    value={data.dog_name}
                                    onChange={(e) =>
                                        setData("dog_name", e.target.value)
                                    }
                                    className="input"
                                />
                                {errors.dog_name && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.dog_name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <BreedSelector
                                    value={data.dog_breed}
                                    onChange={(breed) =>
                                        setData("dog_breed", breed)
                                    }
                                    error={errors.dog_breed}
                                    label="Breed"
                                    required
                                />
                                <div>
                                    <label htmlFor="dog_size" className="label">
                                        Size
                                    </label>
                                    <select
                                        id="dog_size"
                                        name="dog_size"
                                        required
                                        value={data.dog_size}
                                        onChange={(e) =>
                                            setData("dog_size", e.target.value)
                                        }
                                        className="input"
                                    >
                                        <option value="small">
                                            Small (under 10 kg)
                                        </option>
                                        <option value="medium">
                                            Medium (10–25 kg)
                                        </option>
                                        <option value="large">
                                            Large (25 kg+)
                                        </option>
                                    </select>
                                    {errors.dog_size && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.dog_size}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="dog_notes" className="label">
                                    Special notes{" "}
                                    <span className="text-gray-400 font-normal">
                                        (optional)
                                    </span>
                                </label>
                                <textarea
                                    id="dog_notes"
                                    name="dog_notes"
                                    rows={3}
                                    value={data.dog_notes}
                                    onChange={(e) =>
                                        setData("dog_notes", e.target.value)
                                    }
                                    placeholder="Allergies, anxiety, special care instructions — anything we should know."
                                    className="input"
                                />
                                {errors.dog_notes && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.dog_notes}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
                            <p className="text-sm text-gray-500">
                                Already have an account?{" "}
                                <Link
                                    href={route("customer.login.form")}
                                    className="text-brand-500 font-medium hover:text-brand-600"
                                >
                                    Log in
                                </Link>
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {processing
                                    ? "Creating account…"
                                    : "Create Account & Book"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </MainLayout>
    );
}
