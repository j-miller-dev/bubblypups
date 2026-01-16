import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Link, router } from "@inertiajs/react";
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";

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
        waiting_on_client: "Awaiting Your Confirmation",
        cancelled: "Cancelled",
        completed: "Completed",
    };

    return {
        className: badges[status as keyof typeof badges] || badges.pending,
        label: labels[status as keyof typeof labels] || status,
    };
}

export default function AppointmentDetail({
    customer,
    appointment,
}: AppointmentDetailProps) {
    const statusBadge = getStatusBadge(appointment.status);
    const isPast =
        new Date(appointment.appointment_date) <
        new Date(new Date().toDateString());
    const canCancel =
        !isPast &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed";

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
            <nav className="mb-6 flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link
                            href="/my/appointments"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Appointments
                        </Link>
                    </li>
                    <li className="text-sm text-gray-500">/</li>
                    <li className="text-sm font-medium text-gray-900">
                        Appointment Details
                    </li>
                </ol>
            </nav>

            {/* Page Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-x-3">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Appointment Details
                        </h1>
                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusBadge.className}`}
                        >
                            {statusBadge.label}
                        </span>
                    </div>
                    <p className="mt-2 text-gray-600">
                        Booking #{appointment.id}
                    </p>
                </div>
                {canCancel && (
                    <button
                        onClick={handleCancel}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                    >
                        Cancel Appointment
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Service Information */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-6 py-5">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Service Details
                            </h2>
                            <div className="flex items-start gap-x-4">
                                <span className="text-4xl">
                                    {appointment.service.emoji}
                                </span>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {appointment.service.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        {appointment.service.description}
                                    </p>
                                    <div className="mt-4 flex items-center gap-x-6">
                                        <div>
                                            <span className="text-sm text-gray-500">
                                                Duration
                                            </span>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {appointment.duration} minutes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-6 py-5">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Date & Time
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-700">
                                    <CalendarIcon
                                        className="mr-3 size-6 text-gray-400"
                                        aria-hidden
                                    />
                                    <span>{formattedDate}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <ClockIcon
                                        className="mr-3 size-6 text-gray-400"
                                        aria-hidden
                                    />
                                    <span>{formattedTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="px-6 py-5">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                    Special Notes
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {appointment.notes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Dog Information */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-6 py-5">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Dog Information
                            </h2>
                            <div className="flex items-center gap-x-4">
                                {appointment.dog.photo_url ? (
                                    <img
                                        src={appointment.dog.photo_url}
                                        alt={appointment.dog.name}
                                        className="size-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-16 items-center justify-center rounded-full bg-primary-100">
                                        <span className="text-2xl">🐶</span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {appointment.dog.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {appointment.dog.breed}
                                    </p>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {appointment.dog.size} size
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/my/dogs/${appointment.dog.id}`}
                                className="mt-4 block text-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                View Dog Profile
                            </Link>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="overflow-hidden rounded-lg bg-primary-50 shadow">
                        <div className="px-6 py-5">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Need to Reschedule?
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Please contact us to reschedule your
                                appointment.
                            </p>
                            <a
                                href="tel:+1234567890"
                                className="flex items-center text-sm text-primary-700 hover:text-primary-600"
                            >
                                <PhoneIcon
                                    className="mr-2 size-5"
                                    aria-hidden
                                />
                                Call us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
