import CustomerLayout from "@/Layouts/CustomerLayout";
import { Link, router } from "@inertiajs/react";
import {
    CalendarIcon,
    ClockIcon,
    PhoneIcon,
    ChevronLeftIcon,
} from "@heroicons/react/20/solid";

interface AppointmentDetailProps {
    customer: {
        id: number;
        name: string;
        email: string;
    };
    appointment: {
        id: number;
        appointment_date: string;
        appointment_time: string;
        duration: number;
        status: string;
        notes?: string;
        dog: {
            id: number;
            name: string;
            breed: string;
            size: string;
            photo_url?: string;
        };
        service: {
            id: number;
            name: string;
            description: string;
            emoji: string;
            base_price: number;
        };
    };
}

const statusStyles: Record<string, { badge: string; label: string }> = {
    pending: { badge: "bg-amber-100 text-amber-700", label: "Penciled In" },
    confirmed: { badge: "bg-green-100 text-green-700", label: "Confirmed" },
    waiting_on_client: {
        badge: "bg-blue-100 text-blue-700",
        label: "Awaiting Your Confirmation",
    },
    cancelled: { badge: "bg-red-100 text-red-700", label: "Cancelled" },
    completed: { badge: "bg-gray-100 text-gray-600", label: "Completed" },
};

export default function AppointmentDetail({
    customer,
    appointment,
}: AppointmentDetailProps) {
    const status =
        statusStyles[appointment.status] ?? statusStyles.pending;

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
        weekday: "long",
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

    const handleCancel = () => {
        if (
            confirm(
                "Are you sure you want to cancel this appointment? This action cannot be undone.",
            )
        ) {
            router.post(`/my/appointments/${appointment.id}/cancel`);
        }
    };

    return (
        <CustomerLayout customer={customer}>
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
                <Link
                    href="/my/appointments"
                    className="flex items-center gap-1 text-gray-400 hover:text-brand-500 transition-colors font-display font-extrabold"
                >
                    <ChevronLeftIcon className="size-4" />
                    Appointments
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-600 font-display font-extrabold">
                    Details
                </span>
            </nav>

            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="!text-2xl md:!text-3xl text-gray-950">
                            Appointment{" "}
                            <span className="text-brand-500">Details</span>
                        </h2>
                        <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badge}`}
                        >
                            {status.label}
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400 font-display font-extrabold">
                        Booking #{appointment.id}
                    </p>
                </div>
                {canCancel && (
                    <button
                        onClick={handleCancel}
                        className="shrink-0 rounded-button px-4 py-2 text-sm font-medium font-display text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                        Cancel Appointment
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Service Information */}
                    <div className="card p-6">
                        <p className="font-display font-extrabold text-gray-900 mb-5">
                            Service Details
                        </p>
                        <div className="flex items-start gap-4">
                            <span className="text-4xl shrink-0">
                                {appointment.service.emoji}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h3 className="!text-lg text-gray-900">
                                    {appointment.service.name}
                                </h3>
                                <p className="mt-1.5 text-sm text-gray-500">
                                    {appointment.service.description}
                                </p>
                                <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
                                    <ClockIcon className="size-4 text-brand-400 shrink-0" />
                                    {appointment.duration} minutes
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="card p-6">
                        <p className="font-display font-extrabold text-gray-900 mb-5">
                            Date &amp; Time
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                <CalendarIcon className="size-4 text-brand-400 shrink-0" />
                                {formattedDate}
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                <ClockIcon className="size-4 text-brand-400 shrink-0" />
                                {formattedTime}
                            </div>
                        </div>
                    </div>

                    {/* Penciled in notice */}
                    {appointment.status === "pending" && (
                        <div className="rounded-card border border-amber-200 bg-amber-50 px-5 py-4">
                            <div className="flex items-start gap-3">
                                <span className="text-xl shrink-0 mt-0.5">📋</span>
                                <div>
                                    <p className="text-sm font-display font-extrabold text-amber-800">
                                        This appointment is penciled in
                                    </p>
                                    <p className="mt-1 text-sm text-amber-700">
                                        We'll review the job requirements and confirm your time — or reach out if a small adjustment is needed. You'll receive an email once it's locked in.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {appointment.notes && (
                        <div className="card p-6">
                            <p className="font-display font-extrabold text-gray-900 mb-3">
                                Special Notes
                            </p>
                            <p className="text-sm text-gray-600">
                                {appointment.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Dog Information */}
                    <div className="card p-6">
                        <p className="font-display font-extrabold text-gray-900 mb-5">
                            Dog
                        </p>
                        <div className="flex items-center gap-3">
                            {appointment.dog.photo_url ? (
                                <img
                                    src={appointment.dog.photo_url}
                                    alt={appointment.dog.name}
                                    className="size-14 rounded-full object-cover shrink-0"
                                />
                            ) : (
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-2xl">
                                    🐶
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="font-display font-extrabold text-gray-900 truncate">
                                    {appointment.dog.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {appointment.dog.breed}
                                </p>
                                <p className="text-xs text-gray-400 capitalize">
                                    {appointment.dog.size}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/my/dogs/${appointment.dog.id}`}
                            className="btn-outline mt-4 w-full justify-center !text-sm !px-3 !py-2"
                        >
                            View Dog Profile
                        </Link>
                    </div>

                    {/* Reschedule */}
                    <div className="rounded-card border border-brand-100 bg-brand-50 px-5 py-4">
                        <p className="font-display font-extrabold text-gray-900 text-sm">
                            Need to Reschedule?
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Give us a call and we'll sort it out for you.
                        </p>
                        <a
                            href="tel:+61400000000"
                            className="mt-3 flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-display font-extrabold transition-colors"
                        >
                            <PhoneIcon className="size-4 shrink-0" />
                            Call us
                        </a>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
