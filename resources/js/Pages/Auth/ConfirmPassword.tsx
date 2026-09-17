import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <MainLayout
            title="Confirm Password — Bubbly Pups"
            description="Confirm your password to continue."
        >
            <Head title="Confirm Password" />

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
                            🔒
                        </div>
                        <h2 className="!text-2xl md:!text-3xl text-gray-950">
                            Confirm your{" "}
                            <span className="text-brand-500">password</span>
                        </h2>
                        <p className="mt-1.5 text-sm text-gray-500">
                            This is a secure area. Please confirm your
                            password before continuing.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="password" className="label">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? "Confirming…" : "Confirm"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
