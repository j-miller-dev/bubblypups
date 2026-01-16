import React, { useState } from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import AppointmentCard from "@/Components/Customer/AppointmentCard";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface AppointmentsProps {
    customer: {
        id: number;
        name: string;
        email: string;
    };
    appointments: {
        upcoming: Array<{
            id: number;
            appointment_date: string;
            appointment_time: string;
            status: string;
            dog: {
                id: number;
                name: string;
            };
            service: {
                id: number;
                name: string;
                emoji: string;
            };
        }>;
        past: Array<{
            id: number;
            appointment_date: string;
            appointment_time: string;
            status: string;
            dog: {
                id: number;
                name: string;
            };
            service: {
                id: number;
                name: string;
                emoji: string;
            };
        }>;
        cancelled: Array<{
            id: number;
            appointment_date: string;
            appointment_time: string;
            status: string;
            dog: {
                id: number;
                name: string;
            };
            service: {
                id: number;
                name: string;
                emoji: string;
            };
        }>;
    };
}

type TabType = "upcoming" | "past" | "cancelled";

export default function Appointments({
    customer,
    appointments,
}: AppointmentsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("upcoming");

    const tabs: { key: TabType; label: string; count: number }[] = [
        {
            key: "upcoming",
            label: "Upcoming",
            count: appointments.upcoming.length,
        },
        { key: "past", label: "Past", count: appointments.past.length },
        {
            key: "cancelled",
            label: "Cancelled",
            count: appointments.cancelled.length,
        },
    ];

    const currentAppointments = appointments[activeTab];

    return (
        <CustomerLayout customer={customer}>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    My Appointments
                </h1>
                <p className="mt-2 text-gray-600">
                    View and manage your grooming appointments
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`${
                                activeTab === tab.key
                                    ? "border-primary-500 text-primary-600"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
                        >
                            {tab.label}
                            <span
                                className={`${
                                    activeTab === tab.key
                                        ? "bg-primary-100 text-primary-600"
                                        : "bg-gray-100 text-gray-900"
                                } ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Appointments Grid */}
            {currentAppointments.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {currentAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            showActions={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <CalendarIcon
                        className="mx-auto size-12 text-gray-400"
                        aria-hidden
                    />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        No {activeTab} appointments
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {activeTab === "upcoming"
                            ? "You don't have any upcoming appointments. Book one today!"
                            : activeTab === "past"
                              ? "You haven't had any completed appointments yet."
                              : "You don't have any cancelled appointments."}
                    </p>
                </div>
            )}
        </CustomerLayout>
    );
}
