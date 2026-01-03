import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";
import {
    CheckCircleIcon,
    XMarkIcon,
    CalendarIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";
import ContactModal from "@/Components/ContactModal";
import Toast from "@/Components/ui/Toast";
import { useState } from "react";
import RescheduleModal from "@/Components/RescheduleModal";

interface Booking {
    id: number;
    dog: string;
    breed: string;
    owner: string;
    photo_url: string | null;
    email: string | null;
    phone: string | null;
    service: string;
    service_emoji: string;
    price: number;
    date: string;
    time: string;
    status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "waiting_on_client";
}

interface BookingsProps {
    appointments: Booking[];
}

export default function Bookings({ appointments }: BookingsProps) {
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState<Booking | null>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Booking | null>(null);
    const pendingBookings = appointments.filter((b) => b.status === "pending");
    const confirmedBookings = appointments.filter(
        (b) => b.status === "confirmed",
    );
    const waitingOnClient = appointments.filter(
        (b: Booking) => b.status === "waiting_on_client",
    );

    const handleConfirm = (id: number) => {
        if (confirm("Confirm this appointment?")) {
            router.post(`/admin/appointments/${id}/confirm`);
        }
    };

    const handleCancel = (id: number) => {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            router.delete(`/admin/appointments/${id}`);
        }
    };

    const handleReschedule = (appointment: Booking) => {
        setSelectedAppointment(appointment);
        setIsRescheduleModalOpen(true);
    };

    const handleContact = (appointment: Booking) => {
        setSelectedContact(appointment);
        setIsContactModalOpen(true);
    };

    return (
        <AdminLayout>
            <Toast />
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Bookings
            </h1>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                To Confirm ({pendingBookings.length})
            </h2>
            <div className="bg-white shadow border border-gray-200 rounded-md">
                {pendingBookings.length === 0 ? (
                    <p className="px-6 py-4 text-gray-500">
                        No pending bookings
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {pendingBookings.map((b) => (
                            <li key={b.id} className="px-6 py-4">
                                <div className="flex items-start gap-4">
                                    {b.photo_url && (
                                        <img
                                            src={b.photo_url}
                                            alt={b.dog}
                                            className="h-14 w-14 rounded-full flex-shrink-0 object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900">
                                            {b.dog}{" "}
                                            <span className="text-sm text-gray-500">
                                                ({b.breed})
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Owner: {b.owner}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Service: {b.service_emoji} {b.service} - ${b.price}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Appointment: {b.date} at {b.time}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleConfirm(b.id)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleReschedule(b)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <CalendarIcon className="h-4 w-4" />
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => handleCancel(b.id)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleContact(b)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <PhoneIcon className="h-4 w-4" />
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                Waiting on client approval ({waitingOnClient.length})
            </h2>
            <div className="bg-white shadow border border-gray-200 rounded-md">
                {waitingOnClient.length === 0 ? (
                    <p className="px-6 py-4 text-gray-500">
                        No booking proposals waiting from clients
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {waitingOnClient.map((b) => (
                            <li key={b.id} className="px-6 py-4">
                                <div className="flex items-start gap-4">
                                    {b.photo_url && (
                                        <img
                                            src={b.photo_url}
                                            alt={b.dog}
                                            className="h-14 w-14 rounded-full flex-shrink-0 object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900">
                                            {b.dog}{" "}
                                            <span className="text-sm text-gray-500">
                                                ({b.breed})
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Owner: {b.owner}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Service: {b.service_emoji} {b.service} - ${b.price}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Appointment: {b.date} at {b.time}
                                        </div>
                                        <div className="text-sm text-yellow-600 font-medium mt-1">
                                            ⏳ Awaiting client confirmation
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleConfirm(b.id)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleReschedule(b)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <CalendarIcon className="h-4 w-4" />
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => handleCancel(b.id)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleContact(b)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <PhoneIcon className="h-4 w-4" />
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                Confirmed ({confirmedBookings.length})
            </h2>
            <div className="bg-white shadow border border-gray-200 rounded-md">
                {confirmedBookings.length === 0 ? (
                    <p className="px-6 py-4 text-gray-500">
                        No confirmed bookings
                    </p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {confirmedBookings.map((b) => (
                            <li key={b.id} className="px-6 py-4">
                                <div className="flex items-start gap-4">
                                    {b.photo_url && (
                                        <img
                                            src={b.photo_url}
                                            alt={b.dog}
                                            className="h-14 w-14 rounded-full flex-shrink-0 object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900">
                                            {b.dog}{" "}
                                            <span className="text-sm text-gray-500">
                                                ({b.breed})
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Owner: {b.owner}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Service: {b.service_emoji} {b.service} - ${b.price}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Appointment: {b.date} at {b.time}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleReschedule(b)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <CalendarIcon className="h-4 w-4" />
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => handleCancel(b.id)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleContact(b)}
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
                                        >
                                            <PhoneIcon className="h-4 w-4" />
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <RescheduleModal
                appointment={selectedAppointment}
                isOpen={isRescheduleModalOpen}
                onClose={() => {
                    setIsRescheduleModalOpen(false);
                    setSelectedAppointment(null);
                }}
            />
            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => {
                    setIsContactModalOpen(false);
                    setSelectedContact(null);
                }}
                customerName={selectedContact?.owner ?? ""}
                email={selectedContact?.email ?? null}
                phone={selectedContact?.phone ?? null}
            />
        </AdminLayout>
    );
}
