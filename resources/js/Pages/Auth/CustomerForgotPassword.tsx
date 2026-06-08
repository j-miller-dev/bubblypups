import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { EnvelopeIcon } from "@heroicons/react/20/solid";

export default function CustomerForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("customer.password.email"));
    };

    return (
        <MainLayout title="Forgot Password | Bubbly Pups">
            <Head title="Forgot Password" />

            <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50 py-20 sm:py-28">
                {/* Decorative blobs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-brand-100 opacity-60 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-purple-100 opacity-50 blur-3xl"
                />

                <Container>
                    <div className="mx-auto max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-medium shadow-sm mb-5">
                                <EnvelopeIcon className="h-4 w-4" />
                                Password reset
                            </span>
                            <h2 className="text-gray-950">
                                Forgot your{" "}
                                <span className="text-brand-500">password?</span>
                            </h2>
                            <p className="mt-3 text-gray-500">
                                No worries — enter your email and we'll send you a reset link.
                            </p>
                        </div>

                        {/* Card */}
                        <div className="card p-8">
                            {status && (
                                <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="label">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        required
                                        onChange={(e) => setData("email", e.target.value)}
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
                                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "Sending…" : "Send reset link"}
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-500">
                                    Remembered it?{" "}
                                    <Link
                                        href={route("customer.login.form")}
                                        className="text-brand-500 font-medium hover:text-brand-600"
                                    >
                                        Back to log in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
