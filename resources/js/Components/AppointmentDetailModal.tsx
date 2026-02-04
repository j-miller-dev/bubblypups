import {
    Dialog,
    DialogTitle,
    DialogBody,
    DialogActions,
} from "@/Components/ui/Dialog";
import { Button } from "@/Components/ui/Button";
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { Appointment } from "@/types";

interface AppointmentDetailModalProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (appointment: Appointment) => void;
}

function getStatusBadge(status: string) {
    const badges: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        waiting_on_client: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
        completed: "bg-gray-100 text-gray-800",
    };

    const labels: Record<string, string> = {
        pending: "Pending",
        confirmed: "Confirmed",
        waiting_on_client: "Awaiting Client",
        cancelled: "Cancelled",
        completed: "Completed",
    };

    return {
        className: badges[status] || badges.pending,
        label: labels[status] || status,
    };
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export default function AppointmentDetailModal({
    appointment,
    isOpen,
    onClose,
    onEdit,
}: AppointmentDetailModalProps) {
    if (!appointment) {
        return null;
    }

    const statusBadge = getStatusBadge(appointment.status);
    const canEdit =
        appointment.status !== "cancelled" &&
        appointment.status !== "completed";

    return (
        <Dialog open={isOpen} onClose={onClose} size="xl">
            <div className="flex items-start justify-between">
                <DialogTitle>Appointment Details</DialogTitle>
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusBadge.className}`}
                >
                    {statusBadge.label}
                </span>
            </div>

            <DialogBody>
                <div className="space-y-6">
                    {/* Dog and Customer Info */}
                    <div className="flex items-start gap-4">
                        {appointment.dog?.photo_url ? (
                            <img
                                src={appointment.dog.photo_url}
                                alt={appointment.dog?.name}
                                className="size-16 rounded-full object-cover ring-2 ring-gray-200"
                            />
                        ) : (
                            <div className="flex size-16 items-center justify-center rounded-full bg-indigo-100 ring-2 ring-indigo-200">
                                <span className="text-2xl">🐶</span>
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {appointment.dog?.name ?? "Unknown Dog"}
                            </h3>
                            {appointment.dog?.breed && (
                                <p className="text-sm text-gray-500">
                                    {appointment.dog.breed}
                                </p>
                            )}
                            {appointment.dog?.customer && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <UserIcon className="mr-2 size-4 text-gray-400" />
                                        {appointment.dog.customer.name}
                                    </div>
                                    {appointment.dog.customer.email && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <EnvelopeIcon className="mr-2 size-4 text-gray-400" />
                                            <a
                                                href={`mailto:${appointment.dog.customer.email}`}
                                                className="text-indigo-600 hover:text-indigo-500"
                                            >
                                                {appointment.dog.customer.email}
                                            </a>
                                        </div>
                                    )}
                                    {appointment.dog.customer.phone && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <PhoneIcon className="mr-2 size-4 text-gray-400" />
                                            <a
                                                href={`tel:${appointment.dog.customer.phone}`}
                                                className="text-indigo-600 hover:text-indigo-500"
                                            >
                                                {appointment.dog.customer.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Info */}
                    {appointment.service && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-3xl">
                                    {appointment.service.emoji}
                                </span>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                        {appointment.service.name}
                                    </h4>
                                    {appointment.service.description && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            {appointment.service.description}
                                        </p>
                                    )}
                                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                                        <span>
                                            {appointment.service.duration_minutes}{" "}
                                            minutes
                                        </span>
                                        {appointment.service.base_price && (
                                            <span>
                                                $
                                                {Number(appointment.service.base_price).toFixed(
                                                    2,
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex items-center text-gray-700">
                                <CalendarIcon className="mr-3 size-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Date</p>
                                    <p className="font-medium">
                                        {formatDate(appointment.appointment_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex items-center text-gray-700">
                                <ClockIcon className="mr-3 size-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Time</p>
                                    <p className="font-medium">
                                        {formatTime(appointment.appointment_time)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Notes
                            </h4>
                            <p className="text-sm text-gray-600">
                                {appointment.notes}
                            </p>
                        </div>
                    )}
                </div>
            </DialogBody>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                {canEdit && (
                    <Button
                        onClick={() => onEdit(appointment)}
                        className="bg-indigo-600 text-white hover:bg-indigo-500"
                    >
                        Edit / Reschedule
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
