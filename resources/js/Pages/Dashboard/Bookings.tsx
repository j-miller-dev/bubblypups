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
import { ConfirmDialog } from "@/Components/ui/ConfirmDialog";

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

function BookingRow({
    b,
    showConfirm,
    onConfirm,
    onReschedule,
    onCancel,
    onContact,
}: {
    b: Booking;
    showConfirm: boolean;
    onConfirm: (id: number) => void;
    onReschedule: (b: Booking) => void;
    onCancel: (id: number) => void;
    onContact: (b: Booking) => void;
}) {
    return (
        <li className="px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
                {b.photo_url ? (
                    <img
                        src={b.photo_url}
                        alt={b.dog}
                        className="size-12 rounded-full shrink-0 object-cover"
                    />
                ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-purple-400 font-display font-extrabold text-white text-lg">
                        {b.dog.charAt(0)}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="font-display font-extrabold text-gray-900">
                            {b.dog}
                        </p>
                        <span className="text-xs text-gray-400 font-display font-extrabold">
                            {b.breed}
                        </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Owner: {b.owner}
                    </p>
                    <p className="text-sm text-gray-500">
                        {b.service_emoji} {b.service} —{" "}
                        <span className="font-medium text-gray-700">
                            ${b.price}
                        </span>
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {b.date} at {b.time}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                    {showConfirm && (
                        <button
                            onClick={() => onConfirm(b.id)}
                            className="inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-sm font-display font-extrabold text-white bg-green-500 hover:bg-green-600 transition-colors"
                        >
                            <CheckCircleIcon className="size-4" />
                            Confirm
                        </button>
                    )}
                    <button
                        onClick={() => onReschedule(b)}
                        className="inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-sm font-display font-extrabold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <CalendarIcon className="size-4" />
                        Reschedule
                    </button>
                    <button
                        onClick={() => onCancel(b.id)}
                        className="inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-sm font-display font-extrabold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                        <XMarkIcon className="size-4" />
                        Cancel
                    </button>
                    <button
                        onClick={() => onContact(b)}
                        className="inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-sm font-display font-extrabold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <PhoneIcon className="size-4" />
                        Contact
                    </button>
                </div>
            </div>
        </li>
    );
}

function SectionHeader({
    label,
    count,
    accent,
}: {
    label: string;
    count: number;
    accent: string;
}) {
    return (
        <div className="flex items-center gap-3 mb-3">
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-display font-extrabold ${accent}`}
            >
                {count}
            </span>
            <p className="font-display font-extrabold text-gray-900">{label}</p>
        </div>
    );
}

export default function Bookings({ appointments }: BookingsProps) {
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState<Booking | null>(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Booking | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: "confirm" | "cancel" | null;
        appointmentId: number | null;
    }>({ open: false, type: null, appointmentId: null });

    const pendingBookings = appointments.filter((b) => b.status === "pending");
    const waitingOnClient = appointments.filter(
        (b) => b.status === "waiting_on_client",
    );
    const confirmedBookings = appointments.filter(
        (b) => b.status === "confirmed",
    );

    const handleConfirm = (id: number) => {
        setConfirmDialog({ open: true, type: "confirm", appointmentId: id });
    };

    const handleCancel = (id: number) => {
        setConfirmDialog({ open: true, type: "cancel", appointmentId: id });
    };

    const handleDialogConfirm = () => {
        if (confirmDialog.type === "confirm") {
            router.post(`/admin/appointments/${confirmDialog.appointmentId}/confirm`);
        } else if (confirmDialog.type === "cancel") {
            router.delete(`/admin/appointments/${confirmDialog.appointmentId}`);
        }
        setConfirmDialog({ open: false, type: null, appointmentId: null });
    };

    const handleReschedule = (appointment: Booking) => {
        setSelectedAppointment(appointment);
        setIsRescheduleModalOpen(true);
    };

    const handleContact = (appointment: Booking) => {
        setSelectedContact(appointment);
        setIsContactModalOpen(true);
    };

    const emptyRow = (message: string) => (
        <li className="px-5 py-8 text-center text-sm text-gray-400 font-display font-extrabold">
            {message}
        </li>
    );

    return (
        <AdminLayout>
            <Toast />

            <div className="mb-8">
                <h2 className="!text-2xl md:!text-3xl text-gray-950">
                    Booking <span className="text-brand-500">Management</span>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Review and manage all appointment requests.
                </p>
            </div>

            <div className="space-y-8">
                <div>
                    <SectionHeader
                        label="To Confirm"
                        count={pendingBookings.length}
                        accent="bg-yellow-100 text-yellow-700"
                    />
                    <div className="card overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {pendingBookings.length === 0
                                ? emptyRow("No pending bookings")
                                : pendingBookings.map((b) => (
                                      <BookingRow
                                          key={b.id}
                                          b={b}
                                          showConfirm={true}
                                          onConfirm={handleConfirm}
                                          onReschedule={handleReschedule}
                                          onCancel={handleCancel}
                                          onContact={handleContact}
                                      />
                                  ))}
                        </ul>
                    </div>
                </div>

                <div>
                    <SectionHeader
                        label="Waiting on Client Approval"
                        count={waitingOnClient.length}
                        accent="bg-blue-100 text-blue-700"
                    />
                    <div className="card overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {waitingOnClient.length === 0
                                ? emptyRow("No booking proposals waiting from clients")
                                : waitingOnClient.map((b) => (
                                      <BookingRow
                                          key={b.id}
                                          b={b}
                                          showConfirm={true}
                                          onConfirm={handleConfirm}
                                          onReschedule={handleReschedule}
                                          onCancel={handleCancel}
                                          onContact={handleContact}
                                      />
                                  ))}
                        </ul>
                    </div>
                </div>

                <div>
                    <SectionHeader
                        label="Confirmed"
                        count={confirmedBookings.length}
                        accent="bg-green-100 text-green-700"
                    />
                    <div className="card overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {confirmedBookings.length === 0
                                ? emptyRow("No confirmed bookings")
                                : confirmedBookings.map((b) => (
                                      <BookingRow
                                          key={b.id}
                                          b={b}
                                          showConfirm={false}
                                          onConfirm={handleConfirm}
                                          onReschedule={handleReschedule}
                                          onCancel={handleCancel}
                                          onContact={handleContact}
                                      />
                                  ))}
                        </ul>
                    </div>
                </div>
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
            <ConfirmDialog
                open={confirmDialog.open}
                onClose={() =>
                    setConfirmDialog({ open: false, type: null, appointmentId: null })
                }
                onConfirm={handleDialogConfirm}
                title={
                    confirmDialog.type === "confirm"
                        ? "Confirm appointment?"
                        : "Cancel appointment?"
                }
                description={
                    confirmDialog.type === "confirm"
                        ? "This will notify the customer that their appointment is confirmed."
                        : "Are you sure? This will notify the customer that their appointment has been cancelled."
                }
                confirmLabel={
                    confirmDialog.type === "confirm"
                        ? "Yes, confirm"
                        : "Cancel appointment"
                }
                destructive={confirmDialog.type === "cancel"}
            />
        </AdminLayout>
    );
}
