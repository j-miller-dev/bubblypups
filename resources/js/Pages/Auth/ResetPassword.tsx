import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <MainLayout
            title="Reset Password — Bubbly Pups"
            description="Choose a new password for your Bubbly Pups admin account."
        >
            <Head title="Reset Password" />

            <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-white to-brand-50 flex items-center justify-center py-16 px-4">
                {/* Decorative blobs */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-brand-100 opacity-60 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-purple-100 opacity-60 blur-3xl"
                />

                <div className="relative w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-brand-100 text-3xl">
                            🔐
                        </div>
                        <h2 className="!text-2xl md:!text-3xl text-gray-950">
                            Reset your{" "}
                            <span className="text-brand-500">password</span>
                        </h2>
                        <p className="mt-1.5 text-sm text-gray-500">
                            Choose a new password to secure your account.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="label">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
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
                                <label htmlFor="password" className="label">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    autoFocus
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
                                    Confirm Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? "Resetting…"
                                    : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
