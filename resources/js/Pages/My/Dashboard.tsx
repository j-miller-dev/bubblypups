import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import StatCard from "@/Components/Customer/StatCard";
import AppointmentCard from "@/Components/Customer/AppointmentCard";
import { Link } from "@inertiajs/react";
import {
    CalendarIcon,
    HeartIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

interface DashboardProps {
    customer: {
        id: number;
        name: string;
        email: string;
    };
    upcomingAppointments: Array<{
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
    stats: {
        upcomingCount: number;
        totalDogs: number;
        nextAppointment: {
            appointment_date: string;
            appointment_time: string;
        } | null;
    };
}

export default function Dashboard({
    customer,
    upcomingAppointments,
    stats,
}: DashboardProps) {
    // Format next appointment date
    const nextAppointmentText = stats.nextAppointment
        ? new Date(stats.nextAppointment.appointment_date).toLocaleDateString(
              "en-US",
              {
                  month: "short",
                  day: "numeric",
              },
          )
        : "None";

    return (
        <CustomerLayout customer={customer}>
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {customer.name.split(" ")[0]}! 🐶
                </h1>
                <p className="mt-2 text-gray-600">
                    Here's what's happening with your appointments
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <StatCard
                    icon={CalendarIcon}
                    label="Upcoming Appointments"
                    value={stats.upcomingCount}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                />
                <StatCard
                    icon={HeartIcon}
                    label="Registered Dogs"
                    value={stats.totalDogs}
                    iconColor="text-pink-600"
                    iconBgColor="bg-pink-100"
                />
                <StatCard
                    icon={ClockIcon}
                    label="Next Appointment"
                    value={nextAppointmentText}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
            </div>

            {/* Upcoming Appointments Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Upcoming Appointments
                    </h2>
                    {upcomingAppointments.length > 0 && (
                        <Link
                            href="/my/appointments"
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                            View all
                        </Link>
                    )}
                </div>

                {upcomingAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingAppointments.map((appointment) => (
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
                            No upcoming appointments
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by booking your first grooming
                            appointment.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/booking/create"
                                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                            >
                                Book New Appointment
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            {upcomingAppointments.length > 0 && (
                <div className="rounded-lg bg-primary-50 p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Ready for another grooming session?
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Book a new appointment for your furry friend
                    </p>
                    <Link
                        href="/booking/create"
                        className="mt-4 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                    >
                        Book New Appointment
                    </Link>
                </div>
            )}
        </CustomerLayout>
    );
}
