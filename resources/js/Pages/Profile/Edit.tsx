import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    return (
        <AdminLayout>
            <Head title="Profile" />

            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h2 className="!text-2xl md:!text-3xl text-gray-950">
                        Account{" "}
                        <span className="text-brand-500">Settings</span>
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your profile information and account security.
                    </p>
                </div>

                <div className="card p-6 sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="card p-6 sm:p-8">
                    <UpdatePasswordForm />
                </div>

                <div className="card border-red-100 p-6 sm:p-8">
                    <DeleteUserForm />
                </div>
            </div>
        </AdminLayout>
    );
}
