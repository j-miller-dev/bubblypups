import CustomerLayout from "@/Layouts/CustomerLayout";
import StatCard from "@/Components/Customer/StatCard";
import AppointmentCard from "@/Components/Customer/AppointmentCard";
import { Link } from "@inertiajs/react";
import {
    CalendarIcon,
    HeartIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";

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
        dog: { id: number; name: string };
        service: { id: number; name: string; emoji: string };
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
    const nextAppointmentText = stats.nextAppointment
        ? new Date(stats.nextAppointment.appointment_date).toLocaleDateString(
              "en-AU",
              { month: "short", day: "numeric" },
          )
        : "None booked";

    const firstName = customer.name.split(" ")[0];

    return (
        <CustomerLayout customer={customer}>
            {/* Welcome header */}
            <div className="mb-8">
                <h2 className="!text-2xl md:!text-3xl text-gray-950">
                    Welcome back,{" "}
                    <span className="text-brand-500">{firstName}</span> 🐾
                </h2>
                <p className="mt-1 text-gray-500">
                    Here's what's on for your pups.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
                <StatCard
                    icon={CalendarIcon}
                    label="Upcoming Appointments"
                    value={stats.upcomingCount}
                    iconColor="text-brand-500"
                    iconBgColor="bg-brand-100"
                />
                <StatCard
                    icon={HeartIcon}
                    label="Registered Dogs"
                    value={stats.totalDogs}
                    iconColor="text-purple-500"
                    iconBgColor="bg-purple-100"
                />
                <StatCard
                    icon={ClockIcon}
                    label="Next Appointment"
                    value={nextAppointmentText}
                    iconColor="text-blue-500"
                    iconBgColor="bg-blue-100"
                />
            </div>

            {/* Upcoming appointments */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <p className="font-display font-extrabold text-gray-900">
                        Upcoming Appointments
                    </p>
                    {upcomingAppointments.length > 0 && (
                        <Link
                            href="/my/appointments"
                            className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                        >
                            View all
                        </Link>
                    )}
                </div>

                {upcomingAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingAppointments.map((appointment) => (
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
                            No upcoming appointments
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Book a grooming session for your pup today.
                        </p>
                        <div className="mt-5">
                            <Link
                                href="/booking/create"
                                className="btn-primary !text-sm !px-4 !py-2"
                            >
                                <CalendarDaysIcon className="h-4 w-4" />
                                Book Appointment
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick action CTA */}
            {upcomingAppointments.length > 0 && (
                <div className="rounded-card border border-brand-100 bg-gradient-to-r from-brand-50 to-purple-50 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-display font-extrabold text-gray-900">
                            Ready for another session?
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Book your pup's next grooming appointment.
                        </p>
                    </div>
                    <Link
                        href="/booking/create"
                        className="btn-primary shrink-0 !text-sm"
                    >
                        <CalendarDaysIcon className="h-4 w-4" />
                        Book Now
                    </Link>
                </div>
            )}
        </CustomerLayout>
    );
}
