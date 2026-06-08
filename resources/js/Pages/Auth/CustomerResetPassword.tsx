import { Head, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { LockClosedIcon } from "@heroicons/react/20/solid";

export default function CustomerResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("customer.password.update"));
    };

    return (
        <MainLayout title="Reset Password | Bubbly Pups">
            <Head title="Reset Password" />

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
                                <LockClosedIcon className="h-4 w-4" />
                                Choose a new password
                            </span>
                            <h2 className="text-gray-950">
                                Reset your{" "}
                                <span className="text-brand-500">password</span>
                            </h2>
                            <p className="mt-3 text-gray-500">
                                Enter a new password for your Bubbly Pups account.
                            </p>
                        </div>

                        {/* Card */}
                        <div className="card p-8">
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

                                <div>
                                    <label htmlFor="password" className="label">
                                        New password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="new-password"
                                        autoFocus
                                        required
                                        onChange={(e) => setData("password", e.target.value)}
                                        className="input"
                                    />
                                    {errors.password && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="label">
                                        Confirm new password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        required
                                        onChange={(e) =>
                                            setData("password_confirmation", e.target.value)
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
                                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "Resetting…" : "Reset password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
