import { useState } from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import AppointmentCard from "@/Components/Customer/AppointmentCard";
import { Link } from "@inertiajs/react";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    status: string;
    dog: { id: number; name: string };
    service: { id: number; name: string; emoji: string };
}

interface AppointmentsProps {
    customer: {
        id: number;
        name: string;
        email: string;
    };
    appointments: {
        upcoming: Appointment[];
        past: Appointment[];
        cancelled: Appointment[];
    };
}

type TabType = "upcoming" | "past" | "cancelled";

const emptyMessages: Record<TabType, string> = {
    upcoming: "No upcoming appointments. Book one today!",
    past: "You haven't had any completed appointments yet.",
    cancelled: "No cancelled appointments.",
};

export default function Appointments({
    customer,
    appointments,
}: AppointmentsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("upcoming");

    const tabs: { key: TabType; label: string; count: number }[] = [
        { key: "upcoming", label: "Upcoming", count: appointments.upcoming.length },
        { key: "past", label: "Past", count: appointments.past.length },
        { key: "cancelled", label: "Cancelled", count: appointments.cancelled.length },
    ];

    const current = appointments[activeTab];

    return (
        <CustomerLayout customer={customer}>
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="!text-2xl md:!text-3xl text-gray-950">
                        My{" "}
                        <span className="text-brand-500">Appointments</span>
                    </h2>
                    <p className="mt-1 text-gray-500">
                        View and manage your grooming appointments.
                    </p>
                </div>
                <Link href="/booking/create" className="btn-primary shrink-0 !text-sm">
                    <CalendarDaysIcon className="h-4 w-4" />
                    Book New
                </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex gap-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={[
                                "inline-flex items-center gap-2 border-b-2 py-3 text-sm font-medium font-display transition-colors whitespace-nowrap",
                                activeTab === tab.key
                                    ? "border-brand-400 text-brand-500"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                            ].join(" ")}
                        >
                            {tab.label}
                            <span
                                className={[
                                    "rounded-full px-2 py-0.5 text-xs font-medium",
                                    activeTab === tab.key
                                        ? "bg-brand-100 text-brand-600"
                                        : "bg-gray-100 text-gray-500",
                                ].join(" ")}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {current.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {current.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            showActions={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-card border-2 border-dashed border-gray-200 p-12 text-center">
                    <CalendarIcon
                        className="mx-auto size-10 text-gray-300"
                        aria-hidden
                    />
                    <p className="mt-3 font-display font-extrabold text-gray-900 text-sm">
                        No {activeTab} appointments
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {emptyMessages[activeTab]}
                    </p>
                    {activeTab === "upcoming" && (
                        <div className="mt-5">
                            <Link
                                href="/booking/create"
                                className="btn-primary !text-sm !px-4 !py-2"
                            >
                                <CalendarDaysIcon className="h-4 w-4" />
                                Book Appointment
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </CustomerLayout>
    );
}
