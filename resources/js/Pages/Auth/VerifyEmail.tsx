import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <MainLayout
            title="Verify Email — Bubbly Pups"
            description="Verify your Bubbly Pups admin account email address."
        >
            <Head title="Email Verification" />

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
                            📧
                        </div>
                        <h2 className="!text-2xl md:!text-3xl text-gray-950">
                            Verify your{" "}
                            <span className="text-brand-500">email</span>
                        </h2>
                        <p className="mt-1.5 text-sm text-gray-500">
                            Thanks for signing up! Click the link we emailed
                            you to verify your address.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card p-8">
                        {status === "verification-link-sent" && (
                            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                                A new verification link has been sent to the
                                email address you provided during
                                registration.
                            </div>
                        )}

                        <form
                            onSubmit={submit}
                            className="flex flex-col items-center gap-4"
                        >
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? "Sending…"
                                    : "Resend Verification Email"}
                            </button>

                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="text-sm font-medium text-gray-500 underline hover:text-gray-700"
                            >
                                Log Out
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
