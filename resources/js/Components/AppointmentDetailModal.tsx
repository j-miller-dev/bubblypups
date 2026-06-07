import {
    Dialog,
    DialogTitle,
    DialogBody,
    DialogActions,
} from "@/Components/ui/Dialog";
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Appointment } from "@/types";

interface AppointmentDetailModalProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (appointment: Appointment) => void;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    confirmed: { bg: "bg-green-100", text: "text-green-800", label: "Confirmed" },
    waiting_on_client: { bg: "bg-blue-100", text: "text-blue-800", label: "Awaiting Client" },
    cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    completed: { bg: "bg-gray-100", text: "text-gray-600", label: "Completed" },
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const d = new Date();
    d.setHours(parseInt(hours), parseInt(minutes));
    return d.toLocaleTimeString("en-AU", {
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
    if (!appointment) return null;

    const status = statusConfig[appointment.status] ?? statusConfig.pending;
    const canEdit =
        appointment.status !== "cancelled" && appointment.status !== "completed";

    return (
        <Dialog open={isOpen} onClose={onClose} size="xl">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
                <DialogTitle>Appointment Details</DialogTitle>
                <span
                    className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-display font-extrabold ${status.bg} ${status.text}`}
                >
                    {status.label}
                </span>
            </div>

            <DialogBody>
                <div className="space-y-5">
                    {/* Dog & Customer */}
                    <div className="flex items-start gap-4 rounded-card border border-gray-100 bg-gray-50 p-4">
                        {appointment.dog?.photo_url ? (
                            <img
                                src={appointment.dog.photo_url}
                                alt={appointment.dog.name}
                                className="size-14 rounded-full object-cover ring-2 ring-brand-200 shrink-0"
                            />
                        ) : (
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-100 ring-2 ring-brand-200">
                                <span className="text-xl">🐶</span>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="font-display font-extrabold text-gray-900 text-base">
                                {appointment.dog?.name ?? "Unknown Dog"}
                            </p>
                            {appointment.dog?.breed && (
                                <p className="text-sm text-gray-500">
                                    {appointment.dog.breed}
                                </p>
                            )}
                            {appointment.dog?.customer && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <UserIcon className="size-4 text-brand-400 shrink-0" />
                                        {appointment.dog.customer.name}
                                    </div>
                                    {appointment.dog.customer.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <EnvelopeIcon className="size-4 text-brand-400 shrink-0" />
                                            <a
                                                href={`mailto:${appointment.dog.customer.email}`}
                                                className="text-brand-500 hover:text-brand-400 truncate"
                                            >
                                                {appointment.dog.customer.email}
                                            </a>
                                        </div>
                                    )}
                                    {appointment.dog.customer.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <PhoneIcon className="size-4 text-brand-400 shrink-0" />
                                            <a
                                                href={`tel:${appointment.dog.customer.phone}`}
                                                className="text-brand-500 hover:text-brand-400"
                                            >
                                                {appointment.dog.customer.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service */}
                    {appointment.service && (
                        <div className="rounded-card border border-brand-100 bg-brand-50 p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl shrink-0">
                                    {appointment.service.emoji}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="font-display font-extrabold text-gray-900">
                                        {appointment.service.name}
                                    </p>
                                    {appointment.service.description && (
                                        <p className="mt-0.5 text-sm text-gray-500">
                                            {appointment.service.description}
                                        </p>
                                    )}
                                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="size-3.5 text-brand-400" />
                                            {appointment.service.duration_minutes} min
                                        </span>
                                        {appointment.service.base_price && (
                                            <span className="font-display font-extrabold text-brand-500">
                                                ${Number(appointment.service.base_price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-card border border-gray-100 bg-white p-4">
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="size-5 text-brand-400 shrink-0" />
                                <div>
                                    <p className="text-xs font-display font-extrabold text-gray-400 uppercase tracking-wide">
                                        Date
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                                        {formatDate(appointment.appointment_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-card border border-gray-100 bg-white p-4">
                            <div className="flex items-center gap-3">
                                <ClockIcon className="size-5 text-brand-400 shrink-0" />
                                <div>
                                    <p className="text-xs font-display font-extrabold text-gray-400 uppercase tracking-wide">
                                        Time
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">
                                        {formatTime(appointment.appointment_time)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                        <div className="rounded-card border border-gray-100 bg-white p-4">
                            <p className="text-xs font-display font-extrabold text-gray-400 uppercase tracking-wide mb-2">
                                Notes
                            </p>
                            <p className="text-sm text-gray-600">{appointment.notes}</p>
                        </div>
                    )}
                </div>
            </DialogBody>

            <DialogActions>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-outline"
                >
                    Close
                </button>
                {canEdit && (
                    <button
                        type="button"
                        onClick={() => onEdit(appointment)}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <PencilSquareIcon className="size-4" />
                        Reschedule
                    </button>
                )}
            </DialogActions>
        </Dialog>
    );
}
