import AdminLayout from "@/Layouts/AdminLayout";
import UpcomingBookingsCal from "@/Pages/Dashboard/Components/UpcomingBookingsCal.tsx";
import AppointmentCardComponent from "@/Components/ui/AppointmentCardComponent";
import Calendar from "@/Pages/Dashboard/Components/Calendar";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "@inertiajs/react";

interface OverviewProps {
    appointments: any[];
}

export default function Overview({ appointments }: OverviewProps) {
    const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const todayString = `${y}-${m}-${d}`;

    async function loadBookings(date: string) {
        try {
            // Prepare API request. Adjust URL to your Laravel route.
            const url = `/dashboard/bookings?date=${encodeURIComponent(date)}`;
            const res = await fetch(url, {
                headers: { Accept: "application/json" },
            });
            if (!res.ok) {
                // If the route isn't ready yet, fail gracefully and return empty list.
                return [] as any[];
            }
            const data = await res.json();
            // Normalize to BookingItem[] shape expected by UpcomingBookingsCal
            // Try to infer fields; adjust as needed on backend.
            const items = (
                Array.isArray(data?.bookings)
                    ? data.bookings
                    : Array.isArray(data)
                      ? data
                      : []
            ).map((b: any, idx: number) => ({
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
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Upcoming Bookings
                    </h2>
                    <Link
                        href={route("admin.bookings.create")}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    >
                        <PlusIcon className="h-5 w-5" />
                        New Booking
                    </Link>
                </div>
                <UpcomingBookingsCal
                    currentDate={todayString}
                    appointments={appointments}
                    loadBookings={loadBookings}
                />
            </div>
        </AdminLayout>
    );
}
