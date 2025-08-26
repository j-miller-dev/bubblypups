import AdminLayout from "@/Layouts/AdminLayout";
import UpcomingBookingsCal from "@/Pages/Dashboard/Components/UpcomingBookingsCal.tsx";

export default function Overview() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Dashboard
                </h1>
                <p className="text-gray-600">
                    Welcome to your Bubbly Pups admin dashboard. Use the sidebar
                    to navigate.
                </p>
                <h2>Upcoming Bookings</h2>
                <UpcomingBookingsCal />
            </div>
        </AdminLayout>
    );
}
