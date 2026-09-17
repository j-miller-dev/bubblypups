import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] =
        useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e: React.FormEvent) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section>
            <header>
                <h3 className="text-lg font-display font-extrabold text-red-600">
                    Delete Account
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Once your account is deleted, all of its resources and
                    data will be permanently deleted. Please download any
                    data you wish to retain before proceeding.
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="btn mt-6 border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200"
            >
                Delete Account
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 sm:p-8">
                    <h3 className="text-lg font-display font-extrabold text-gray-900">
                        Are you sure you want to delete your account?
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Enter your password
                        to confirm you would like to permanently delete your
                        account.
                    </p>

                    <div className="mt-6">
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="input"
                            autoFocus
                            placeholder="Password"
                        />
                        {errors.password && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="btn-outline"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="btn bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Delete Account
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
