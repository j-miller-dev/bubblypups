import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Appointment, BlockedTime, BusinessHours } from "@/types";

interface MonthViewProps {
    appointments: Appointment[];
    businessHours: BusinessHours[];
    blockedTimes: BlockedTime[];
    currentDate: string;
    onDateChange: (date: string) => void;
    onAppointmentClick?: (appointment: Appointment) => void;
    onSwitchToDayView?: (date: string) => void;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DAY_OF_WEEK_MAP: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
};

const statusChip: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    waiting_on_client: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-400",
};

function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function buildMonthGrid(year: number, month: number): { date: string; isCurrentMonth: boolean }[] {
    const firstDay = new Date(year, month, 1).getDay();
    const mondayOffset = (firstDay + 6) % 7;
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const daysInThisMonth = new Date(year, month + 1, 0).getDate();
    const grid: { date: string; isCurrentMonth: boolean }[] = [];

    for (let i = mondayOffset; i > 0; i--) {
        grid.push({ date: formatDate(new Date(year, month - 1, daysInPrevMonth - i + 1)), isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInThisMonth; d++) {
        grid.push({ date: formatDate(new Date(year, month, d)), isCurrentMonth: true });
    }
    const remainder = grid.length % 7;
    const trailing = remainder === 0 ? 0 : 7 - remainder;
    for (let i = 1; i <= trailing; i++) {
        grid.push({ date: formatDate(new Date(year, month + 1, i)), isCurrentMonth: false });
    }

    return grid;
}

function isDateBlocked(dateStr: string, blockedTimes: BlockedTime[]): boolean {
    const dayStart = new Date(dateStr);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dateStr);
    dayEnd.setHours(23, 59, 59, 999);
    return blockedTimes.some((bt) => {
        const start = new Date(bt.start_datetime);
        const end = new Date(bt.end_datetime);
        return start <= dayEnd && end >= dayStart;
    });
}

function isDayClosed(dateStr: string, businessHours: BusinessHours[]): boolean {
    const dow = new Date(dateStr).getDay();
    const dayName = DAY_OF_WEEK_MAP[dow];
    const bh = businessHours.find((b) => b.day_of_week === dayName);
    return bh ? !bh.is_open : true;
}

export default function MonthView({
    appointments,
    businessHours,
    blockedTimes,
    currentDate,
    onDateChange,
    onAppointmentClick,
    onSwitchToDayView,
}: MonthViewProps) {
    const viewDate = new Date(currentDate);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const todayStr = formatDate(new Date());
    const grid = buildMonthGrid(year, month);

    const goToPrevMonth = () => onDateChange(formatDate(new Date(year, month - 1, 1)));
    const goToNextMonth = () => onDateChange(formatDate(new Date(year, month + 1, 1)));
    const goToToday = () => onDateChange(todayStr);

    // Group appointments by date string
    const appointmentsByDate: Record<string, Appointment[]> = {};
    for (const apt of appointments) {
        const d = apt.appointment_date;
        if (!appointmentsByDate[d]) appointmentsByDate[d] = [];
        appointmentsByDate[d].push(apt);
    }

    const handleDayClick = (dateStr: string) => {
        onDateChange(dateStr);
        onSwitchToDayView?.(dateStr);
    };

    return (
        <div className="flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 px-1 pb-4 mb-0">
                <div className="flex items-center gap-3">
                    <h2 className="!text-lg md:!text-xl text-gray-900 font-display font-extrabold">
                        {viewDate.toLocaleString("en-AU", { month: "long", year: "numeric" })}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={goToToday}
                        className="hidden sm:block rounded-button border border-gray-200 bg-white px-3 py-1.5 text-sm font-display font-extrabold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Today
                    </button>
                    <div className="flex items-center rounded-button border border-gray-200 bg-white overflow-hidden">
                        <button
                            type="button"
                            onClick={goToPrevMonth}
                            className="flex h-8 w-9 items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors border-r border-gray-200"
                        >
                            <span className="sr-only">Previous month</span>
                            <ChevronLeftIcon className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="flex h-8 w-9 items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                        >
                            <span className="sr-only">Next month</span>
                            <ChevronRightIcon className="size-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Day name headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
                {DAY_NAMES.map((name) => (
                    <div
                        key={name}
                        className="py-2 text-center text-xs font-display font-extrabold text-gray-400 uppercase tracking-wide"
                    >
                        <span className="hidden sm:inline">{name}</span>
                        <span className="sm:hidden">{name[0]}</span>
                    </div>
                ))}
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-7 flex-1 border-l border-t border-gray-200">
                {grid.map(({ date, isCurrentMonth }) => {
                    const isToday = date === todayStr;
                    const dayAppts = (appointmentsByDate[date] ?? []).sort((a, b) =>
                        a.appointment_time.localeCompare(b.appointment_time),
                    );
                    const blocked = isDateBlocked(date, blockedTimes);
                    const closed = isDayClosed(date, businessHours);
                    const dayNum = parseInt(date.split("-")[2]);
                    const MAX_VISIBLE = 3;
                    const visible = dayAppts.slice(0, MAX_VISIBLE);
                    const overflow = dayAppts.length - MAX_VISIBLE;

                    return (
                        <div
                            key={date}
                            onClick={() => handleDayClick(date)}
                            className={`relative min-h-[90px] sm:min-h-[110px] border-b border-r border-gray-200 p-1.5 cursor-pointer transition-colors group
                                ${isToday ? "bg-brand-50" : isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50/60 hover:bg-gray-100/60"}
                                ${!isCurrentMonth ? "opacity-60" : ""}
                            `}
                        >
                            {/* Date number */}
                            <div className="flex items-start justify-between mb-1">
                                <span
                                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-display font-extrabold transition-colors
                                        ${isToday
                                            ? "bg-brand-500 text-white"
                                            : isCurrentMonth
                                            ? "text-gray-700 group-hover:text-gray-900"
                                            : "text-gray-400"
                                        }
                                    `}
                                >
                                    {dayNum}
                                </span>
                                {/* Closed/blocked badges */}
                                <div className="flex gap-1">
                                    {blocked && (
                                        <span className="hidden sm:inline-flex items-center rounded px-1 py-0.5 text-[10px] font-display font-extrabold bg-red-100 text-red-600">
                                            Blocked
                                        </span>
                                    )}
                                    {!blocked && closed && isCurrentMonth && (
                                        <span className="hidden sm:inline-flex items-center rounded px-1 py-0.5 text-[10px] font-display font-extrabold bg-gray-100 text-gray-400">
                                            Closed
                                        </span>
                                    )}
                                    {/* Mobile dots */}
                                    {blocked && (
                                        <span className="sm:hidden size-1.5 rounded-full bg-red-400 mt-1" />
                                    )}
                                </div>
                            </div>

                            {/* Appointment chips */}
                            <div className="space-y-0.5">
                                {visible.map((apt) => {
                                    const chipClass = statusChip[apt.status] ?? statusChip.pending;
                                    return (
                                        <button
                                            key={apt.id}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAppointmentClick?.(apt);
                                            }}
                                            className={`w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-display font-extrabold transition-opacity hover:opacity-80 ${chipClass}`}
                                        >
                                            <span className="hidden sm:inline">
                                                {apt.appointment_time.slice(0, 5)}{" "}
                                                {apt.service?.emoji}{" "}
                                                {apt.dog?.name ?? "?"}
                                            </span>
                                            {/* Mobile: just a colored dot */}
                                            <span className="sm:hidden">
                                                {apt.service?.emoji ?? "•"} {apt.dog?.name ?? "?"}
                                            </span>
                                        </button>
                                    );
                                })}
                                {overflow > 0 && (
                                    <p className="px-1.5 text-[11px] font-display font-extrabold text-gray-400">
                                        +{overflow} more
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
                {[
                    { label: "Pending", cls: "bg-yellow-100 text-yellow-700" },
                    { label: "Confirmed", cls: "bg-blue-100 text-blue-700" },
                    { label: "Awaiting Client", cls: "bg-orange-100 text-orange-700" },
                    { label: "Completed", cls: "bg-green-100 text-green-700" },
                    { label: "Blocked", cls: "bg-red-100 text-red-600" },
                ].map(({ label, cls }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span className={`inline-flex size-3 rounded-sm ${cls.split(" ")[0]}`} />
                        <span className={`text-xs font-display font-extrabold ${cls.split(" ")[1]}`}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
