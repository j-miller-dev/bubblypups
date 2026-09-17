import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section>
            <header>
                <h3 className="text-lg font-display font-extrabold text-gray-900">
                    Profile Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Update your account's name and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="name" className="label">
                        Name
                    </label>
                    <input
                        id="name"
                        className="input"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-sm text-amber-800">
                            Your email address is unverified.{" "}
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="font-medium underline hover:text-amber-900"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <p className="mt-2 text-sm font-medium text-green-700">
                                A new verification link has been sent to your
                                email address.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-500">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
