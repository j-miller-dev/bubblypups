import React from "react";
import { Link } from "@inertiajs/react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

interface AppointmentCardProps {
    appointment: {
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
    };
    showActions?: boolean;
}

function getStatusBadge(status: string) {
    const badges = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        waiting_on_client: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
        completed: "bg-gray-100 text-gray-800",
    };

    const labels = {
        pending: "Pending",
        confirmed: "Confirmed",
        waiting_on_client: "Awaiting Confirmation",
        cancelled: "Cancelled",
        completed: "Completed",
    };

    return {
        className: badges[status as keyof typeof badges] || badges.pending,
        label: labels[status as keyof typeof labels] || status,
    };
}

export default function AppointmentCard({
    appointment,
    showActions = true,
}: AppointmentCardProps) {
    const statusBadge = getStatusBadge(appointment.status);
    const isPast =
        new Date(appointment.appointment_date) <
        new Date(new Date().toDateString());
    const canCancel =
        !isPast &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed";

    const service = appointment.service || {
        name: "Service Not Set",
        emoji: "🐕",
    };

    // Format date
    const appointmentDate = new Date(appointment.appointment_date);
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Format time
    const [hours, minutes] = appointment.appointment_time.split(":");
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-x-2">
                            <span className="text-2xl">{service.emoji}</span>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {service.name}
                            </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                            for {appointment.dog.name}
                        </p>
                    </div>
                    <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge.className}`}
                    >
                        {statusBadge.label}
                    </span>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon
                            className="mr-2 size-5 text-gray-400"
                            aria-hidden
                        />
                        {formattedDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon
                            className="mr-2 size-5 text-gray-400"
                            aria-hidden
                        />
                        {formattedTime}
                    </div>
                </div>

                {showActions && (
                    <div className="mt-6 flex gap-x-3">
                        <Link
                            href={`/my/appointments/${appointment.id}`}
                            className="flex-1 rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            View Details
                        </Link>
                        {canCancel && (
                            <Link
                                href={`/my/appointments/${appointment.id}/cancel`}
                                method="post"
                                as="button"
                                className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                                onBefore={() =>
                                    confirm(
                                        "Are you sure you want to cancel this appointment?",
                                    )
                                }
                            >
                                Cancel
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
