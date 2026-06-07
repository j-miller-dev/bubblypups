import MainLayout from "@/Layouts/MainLayout.tsx";
import { useForm } from "@inertiajs/react";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/20/solid";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <MainLayout
            title="Admin Login — Bubbly Pups"
            description="Sign in to the Bubbly Pups admin dashboard."
        >
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
                            🐾
                        </div>
                        <h2 className="!text-2xl md:!text-3xl text-gray-950">
                            Admin{" "}
                            <span className="text-brand-500">Sign In</span>
                        </h2>
                        <p className="mt-1.5 text-sm text-gray-500">
                            Welcome back. Enter your credentials to continue.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="label">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <EnvelopeIcon className="size-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="input pl-9"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="label">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockClosedIcon className="size-4 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="input pl-9"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="size-4 rounded border-gray-300 text-brand-400 focus:ring-brand-400"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-gray-600"
                                >
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center disabled:opacity-50"
                            >
                                {processing ? "Signing in…" : "Sign In"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
