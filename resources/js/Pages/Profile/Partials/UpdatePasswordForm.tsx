import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section>
            <header>
                <h3 className="text-lg font-display font-extrabold text-gray-900">
                    Update Password
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Ensure your account is using a long, random password to
                    stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="current_password" className="label">
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="input"
                        autoComplete="current-password"
                    />
                    {errors.current_password && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.current_password}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="label">
                        New Password
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="input"
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="label">
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="input"
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1.5 text-sm text-red-600">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

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
