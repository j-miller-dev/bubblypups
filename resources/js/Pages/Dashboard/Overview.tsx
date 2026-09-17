import AdminLayout from "@/Layouts/AdminLayout";
import UpcomingBookingsCal from "@/Pages/Dashboard/Components/UpcomingBookingsCal.tsx";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/react";

interface OverviewProps {
    appointments: any[];
}

export default function Overview({ appointments }: OverviewProps) {
    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="!text-2xl md:!text-3xl text-gray-950">
                            Upcoming{" "}
                            <span className="text-brand-500">Bookings</span>
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {today.toLocaleDateString("en-AU", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <Link
                        href={route("admin.bookings.create")}
                        className="btn-primary !text-sm shrink-0"
                    >
                        <PlusIcon className="size-4" aria-hidden />
                        New Booking
                    </Link>
                </div>

                <UpcomingBookingsCal
                    currentDate={todayString}
                    appointments={appointments}
                />
            </div>
        </AdminLayout>
    );
}
