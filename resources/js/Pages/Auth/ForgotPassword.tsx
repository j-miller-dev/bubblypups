import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <MainLayout
            title="Forgot Password — Bubbly Pups"
            description="Reset your Bubbly Pups admin account password."
        >
            <Head title="Forgot Password" />

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
                            🔑
                        </div>
                        <h2 className="!text-2xl md:!text-3xl text-gray-950">
                            Forgot your{" "}
                            <span className="text-brand-500">password?</span>
                        </h2>
                        <p className="mt-1.5 text-sm text-gray-500">
                            No problem. Enter your email and we'll send you a
                            reset link.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card p-8">
                        {status && (
                            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

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
                                    autoFocus
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? "Sending…"
                                    : "Email Password Reset Link"}
                            </button>
                        </form>

                        <div className="mt-6 border-t border-gray-100 pt-6 text-center">
                            <p className="text-sm text-gray-500">
                                Remembered it?{" "}
                                <Link
                                    href={route("login")}
                                    className="font-medium text-brand-500 hover:text-brand-600"
                                >
                                    Back to sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
