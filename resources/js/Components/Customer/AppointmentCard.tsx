import { Link } from "@inertiajs/react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/20/solid";

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

const statusStyles: Record<string, { badge: string; label: string }> = {
    pending: {
        badge: "bg-yellow-100 text-yellow-700",
        label: "Pending",
    },
    confirmed: {
        badge: "bg-green-100 text-green-700",
        label: "Confirmed",
    },
    waiting_on_client: {
        badge: "bg-blue-100 text-blue-700",
        label: "Awaiting Your Confirmation",
    },
    cancelled: {
        badge: "bg-red-100 text-red-700",
        label: "Cancelled",
    },
    completed: {
        badge: "bg-gray-100 text-gray-600",
        label: "Completed",
    },
};

export default function AppointmentCard({
    appointment,
    showActions = true,
}: AppointmentCardProps) {
    const status =
        statusStyles[appointment.status] ?? statusStyles.pending;

    const service = appointment.service ?? { name: "Service TBC", emoji: "🐕" };

    const isPast =
        new Date(appointment.appointment_date) <
        new Date(new Date().toDateString());

    const canCancel =
        !isPast &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed";

    const formattedDate = new Date(
        appointment.appointment_date,
    ).toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const [hours, minutes] = appointment.appointment_time.split(":");
    const t = new Date();
    t.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = t.toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <div className="card-hover p-5">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl shrink-0">{service.emoji}</span>
                    <div className="min-w-0">
                        <p className="font-display font-extrabold text-gray-900 truncate">
                            {service.name}
                        </p>
                        <p className="text-sm text-gray-500">
                            for {appointment.dog.name}
                        </p>
                    </div>
                </div>
                <span
                    className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badge}`}
                >
                    {status.label}
                </span>
            </div>

            <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon className="size-4 text-brand-400 shrink-0" />
                    {formattedDate}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClockIcon className="size-4 text-brand-400 shrink-0" />
                    {formattedTime}
                </div>
            </div>

            {showActions && (
                <div className="mt-5 flex gap-3">
                    <Link
                        href={`/my/appointments/${appointment.id}`}
                        className="btn-outline flex-1 justify-center !px-3 !py-2 !text-sm"
                    >
                        View Details
                    </Link>
                    {canCancel && (
                        <Link
                            href={`/my/appointments/${appointment.id}/cancel`}
                            method="post"
                            as="button"
                            className="rounded-button px-3 py-2 text-sm font-medium font-display text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
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
    );
}
