import AdminLayout from "@/Layouts/AdminLayout";
import UpcomingBookingsCal from "@/Pages/Dashboard/Components/UpcomingBookingsCal.tsx";

export default function Overview() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const todayString = `${y}-${m}-${d}`;

    async function loadBookings(date: string) {
        try {
            // Prepare API request. Adjust URL to your Laravel route.
            const url = `/dashboard/bookings?date=${encodeURIComponent(date)}`;
            const res = await fetch(url, { headers: { Accept: "application/json" } });
            if (!res.ok) {
                // If the route isn't ready yet, fail gracefully and return empty list.
                return [] as any[];
            }
            const data = await res.json();
            // Normalize to BookingItem[] shape expected by UpcomingBookingsCal
            // Try to infer fields; adjust as needed on backend.
            const items = (Array.isArray(data?.bookings) ? data.bookings : Array.isArray(data) ? data : [])
                .map((b: any, idx: number) => ({
                    id: b.id ?? idx,
                    name: b.name ?? b.client_name ?? b.dog_name ?? "Booking",
                    datetime: b.datetime ?? b.start_at ?? `${date}T00:00:00`,
                    date: b.date ?? undefined,
                    time: b.time ?? undefined,
                    imageUrl: b.imageUrl ?? b.avatar_url ?? undefined,
                    location: b.location ?? b.address ?? undefined,
                }));
            return items;
        } catch (e) {
            return [] as any[];
        }
    }

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
                <UpcomingBookingsCal currentDate={todayString} loadBookings={loadBookings} />
            </div>
        </AdminLayout>
    );
}
