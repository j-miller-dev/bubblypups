import { Appointment } from "@/types";

interface AppointmentBlockProps {
    appointment: Appointment;
    onClick?: (appointment: Appointment) => void;
    colStart?: number; // 1-7 for week view columns
    startHourOffset?: number; // Hour offset when grid doesn't start at midnight (e.g., 7 for 7am)
}

// Calculate grid row from time string like "09:00" or "14:30"
function timeToGridRow(time: string, startHourOffset: number = 0): number {
    const [hours, minutes] = time.split(":").map(Number);
    // Grid starts at row 2 (row 1 is header spacer)
    // Each hour = 12 rows (5-minute increments)
    // Adjust for startHourOffset when grid doesn't start at midnight
    const adjustedHours = hours - startHourOffset;
    return 2 + adjustedHours * 12 + Math.floor(minutes / 5);
}

function durationToSpan(minutes: number): number {
    // Each 5 min = 1 row span (288 rows / 24 hours = 12 rows per hour)
    return Math.max(1, Math.ceil(minutes / 5));
}

// Color schemes based on appointment status
const statusColors = {
    pending: {
        bg: "bg-yellow-50",
        hover: "hover:bg-yellow-100",
        title: "text-yellow-700",
        text: "text-yellow-500",
        textHover: "group-hover:text-yellow-700",
    },
    confirmed: {
        bg: "bg-blue-50",
        hover: "hover:bg-blue-100",
        title: "text-blue-700",
        text: "text-blue-500",
        textHover: "group-hover:text-blue-700",
    },
    waiting_on_client: {
        bg: "bg-orange-50",
        hover: "hover:bg-orange-100",
        title: "text-orange-700",
        text: "text-orange-500",
        textHover: "group-hover:text-orange-700",
    },
    completed: {
        bg: "bg-green-50",
        hover: "hover:bg-green-100",
        title: "text-green-700",
        text: "text-green-500",
        textHover: "group-hover:text-green-700",
    },
    cancelled: {
        bg: "bg-gray-50",
        hover: "hover:bg-gray-100",
        title: "text-gray-700",
        text: "text-gray-500",
        textHover: "group-hover:text-gray-700",
    },
};

export default function AppointmentBlock({
    appointment,
    onClick,
    colStart,
    startHourOffset = 0,
}: AppointmentBlockProps) {
    const startRow = timeToGridRow(appointment.appointment_time, startHourOffset);
    const duration = appointment.service?.duration_minutes ?? 60;
    const span = durationToSpan(duration);
    const colors = statusColors[appointment.status] ?? statusColors.pending;

    // Format time for display (convert "09:00" to "9:00 AM")
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    return (
        <li
            style={{ gridRow: `${startRow} / span ${span}` }}
            className={`relative mt-px flex ${colStart ? `sm:col-start-${colStart}` : ""}`}
        >
            <button
                type="button"
                onClick={() => onClick?.(appointment)}
                className={`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg ${colors.bg} p-2 text-xs/5 ${colors.hover} text-left`}
            >
                <p className={`order-1 font-semibold ${colors.title}`}>
                    {appointment.dog?.name ?? "Unknown"}
                </p>
                <p
                    className={`order-1 ${colors.text} ${colors.textHover} truncate`}
                >
                    {appointment.service?.emoji} {appointment.service?.name}
                </p>
                <p className={`${colors.text} ${colors.textHover}`}>
                    <time dateTime={appointment.appointment_time}>
                        {formatTime(appointment.appointment_time)}
                    </time>
                </p>
            </button>
        </li>
    );
}
