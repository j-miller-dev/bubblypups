import AdminLayout from "@/Layouts/AdminLayout";

export default function Availability() {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-semibold mb-4 text-gray-900">
                My Availability
            </h1>

            <p>
                Date and time scheduling to establish when I can take bookings
                and update/block out on booking calendar
            </p>
        </AdminLayout>
    );
}
