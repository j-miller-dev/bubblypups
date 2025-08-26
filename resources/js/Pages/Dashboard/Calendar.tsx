import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout.tsx";

export default function Calendar({}) {
    return (
        <AdminLayout>
            <Head title="Calendar" />

            <div className="flex justify-between items-center mb-4"></div>
        </AdminLayout>
    );
}
