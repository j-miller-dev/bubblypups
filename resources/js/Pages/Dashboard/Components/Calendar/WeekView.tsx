import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Appointment, BlockedTime, BusinessHours } from "@/types";
import AppointmentBlock from "./AppointmentBlock";

// Calendar display range: 7am to 10pm
const START_HOUR = 7;
const END_HOUR = 22;
const HOURS_DISPLAYED = END_HOUR - START_HOUR; // 15 hours

interface WeekViewProps {
    appointments: Appointment[];
    businessHours: BusinessHours[];
    blockedTimes: BlockedTime[];
    currentDate: string;
    onDateChange: (date: string) => void;
    onAppointmentClick?: (appointment: Appointment) => void;
}

// Get start of week (Monday) for a given date
function getStartOfWeek(dateStr: string): Date {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

// Get end of week (Sunday) for a given date
function getEndOfWeek(dateStr: string): Date {
    const start = getStartOfWeek(dateStr);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

// Get array of week days starting from Monday
function getWeekDays(dateStr: string): Date[] {
    const start = getStartOfWeek(dateStr);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(day.getDate() + i);
        days.push(day);
    }
    return days;
}

// Check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

// Format hour for display (12-hour format)
function formatHour(hour: number): string {
    if (hour === 0) return "12AM";
    if (hour < 12) return `${hour}AM`;
    if (hour === 12) return "12PM";
    return `${hour - 12}PM`;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

// Map column index (0-6, Mon-Sun) to day name for business hours lookup
const COLUMN_TO_DAY: Record<number, string> = {
    0: "monday",
    1: "tuesday",
    2: "wednesday",
    3: "thursday",
    4: "friday",
    5: "saturday",
    6: "sunday",
};

// Parse time string "HH:mm" to hour number
function parseTimeToHour(time: string | null): number | null {
    if (!time) return null;
    const [hours] = time.split(":").map(Number);
    return hours;
}

export default function WeekView({
    appointments,
    businessHours,
    blockedTimes,
    currentDate,
    onDateChange,
    onAppointmentClick,
}: WeekViewProps) {
    // Get business hours lookup by day name
    const businessHoursMap = new Map(
        businessHours.map((bh) => [bh.day_of_week, bh]),
    );

    // Check if an hour is within business hours for a given day column (0-6)
    const isWithinBusinessHours = (dayIndex: number, hour: number): boolean => {
        const dayName = COLUMN_TO_DAY[dayIndex];
        const dayHours = businessHoursMap.get(dayName);
        if (!dayHours?.is_open) return false;
        const openHour = parseTimeToHour(dayHours.open_time);
        const closeHour = parseTimeToHour(dayHours.close_time);
        if (openHour === null || closeHour === null) return false;
        return hour >= openHour && hour < closeHour;
    };

    const weekDays = getWeekDays(currentDate);
    const today = new Date();
    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = getEndOfWeek(currentDate);

    // Filter appointments for current week that fall within display range
    const weekAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.appointment_date);
        if (aptDate < startOfWeek || aptDate > endOfWeek) return false;
        const [hours] = apt.appointment_time.split(":").map(Number);
        return hours >= START_HOUR && hours < END_HOUR;
    });

    // Filter blocked times for current week
    const weekBlockedTimes = blockedTimes.filter((bt) => {
        const startDate = new Date(bt.start_datetime);
        const endDate = new Date(bt.end_datetime);
        const weekStart = new Date(startOfWeek);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(endOfWeek);
        weekEnd.setHours(23, 59, 59, 999);
        return startDate <= weekEnd && endDate >= weekStart;
    });

    // Navigate to previous week
    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        onDateChange(formatDate(newDate));
    };

    // Navigate to next week
    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        onDateChange(formatDate(newDate));
    };

    // Navigate to today
    const goToToday = () => {
        onDateChange(formatDate(new Date()));
    };

    // Get column index (1-7) for an appointment
    const getColumnForDate = (dateStr: string): number => {
        const aptDate = new Date(dateStr);
        for (let i = 0; i < weekDays.length; i++) {
            if (isSameDay(aptDate, weekDays[i])) {
                return i + 1;
            }
        }
        return 1;
    };

    // Format week range for header
    const formatWeekRange = (): string => {
        const start = weekDays[0];
        const end = weekDays[6];
        const startMonth = start.toLocaleDateString("en-US", { month: "short" });
        const endMonth = end.toLocaleDateString("en-US", { month: "short" });
        const year = end.getFullYear();

        if (startMonth === endMonth) {
            return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
        }
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
    };

    // Calculate blocked time position for grid
    const getBlockedTimePositions = (bt: BlockedTime) => {
        const startDate = new Date(bt.start_datetime);
        const endDate = new Date(bt.end_datetime);
        const positions: Array<{
            dayColumn: number;
            startRow: number;
            span: number;
        }> = [];

        // Iterate through each day of the week
        for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
            const dayDate = weekDays[dayIdx];
            const dayStart = new Date(dayDate);
            dayStart.setHours(START_HOUR, 0, 0, 0);
            const dayEnd = new Date(dayDate);
            dayEnd.setHours(END_HOUR, 0, 0, 0);

            // Check if blocked time overlaps with this day's display range
            if (startDate >= dayEnd || endDate <= dayStart) continue;

            // Clamp to display range
            const effectiveStart = startDate < dayStart ? dayStart : startDate;
            const effectiveEnd = endDate > dayEnd ? dayEnd : endDate;

            const startHour = effectiveStart.getHours();
            const startMinute = effectiveStart.getMinutes();
            const endHour = effectiveEnd.getHours();
            const endMinute = effectiveEnd.getMinutes();

            // Calculate grid rows (12 rows per hour, offset by START_HOUR)
            const startRow =
                2 + (startHour - START_HOUR) * 12 + Math.floor(startMinute / 5);
            const endRow =
                2 + (endHour - START_HOUR) * 12 + Math.floor(endMinute / 5);
            const span = Math.max(1, endRow - startRow);

            positions.push({
                dayColumn: dayIdx + 1,
                startRow,
                span,
            });
        }

        return positions;
    };

    return (
        <div className="flex h-full flex-col">
            <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
                <h1 className="text-base font-semibold text-gray-900">
                    <time>{formatWeekRange()}</time>
                </h1>
                <div className="flex items-center">
                    <div className="relative flex items-center rounded-md bg-white shadow-xs outline -outline-offset-1 outline-gray-300 md:items-stretch">
                        <button
                            type="button"
                            onClick={goToPreviousWeek}
                            className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous week</span>
                            <ChevronLeftIcon
                                aria-hidden="true"
                                className="size-5"
                            />
                        </button>
                        <button
                            type="button"
                            onClick={goToToday}
                            className="hidden px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
                        >
                            Today
                        </button>
                        <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
                        <button
                            type="button"
                            onClick={goToNextWeek}
                            className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                        >
                            <span className="sr-only">Next week</span>
                            <ChevronRightIcon
                                aria-hidden="true"
                                className="size-5"
                            />
                        </button>
                    </div>
                </div>
            </header>
            <div className="isolate flex flex-auto flex-col overflow-auto bg-white">
                <div className="flex w-full flex-none flex-col">
                    <div className="sticky top-0 z-30 flex-none bg-white shadow-sm ring-1 ring-black/5 sm:pr-8">
                        {/* Mobile day headers */}
                        <div className="grid grid-cols-7 text-sm/6 text-gray-500 sm:hidden">
                            {weekDays.map((day, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="flex flex-col items-center pb-3 pt-2"
                                >
                                    {DAY_LETTERS[idx]}{" "}
                                    <span
                                        className={`mt-1 flex size-8 items-center justify-center font-semibold ${
                                            isSameDay(day, today)
                                                ? "rounded-full bg-indigo-600 text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {day.getDate()}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Desktop day headers */}
                        <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm/6 text-gray-500 sm:grid">
                            <div className="col-end-1 w-14" />
                            {weekDays.map((day, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-center py-3"
                                >
                                    <span
                                        className={
                                            isSameDay(day, today)
                                                ? "flex items-baseline"
                                                : ""
                                        }
                                    >
                                        {DAY_NAMES[idx]}{" "}
                                        <span
                                            className={`${
                                                isSameDay(day, today)
                                                    ? "ml-1.5 flex size-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                                                    : "items-center justify-center font-semibold text-gray-900"
                                            }`}
                                        >
                                            {day.getDate()}
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-auto">
                        <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
                        <div className="grid flex-auto grid-cols-1 grid-rows-1">
                            {/* Horizontal lines - time slots (7am to 10pm = 15 hours = 30 rows) */}
                            <div
                                style={{
                                    gridTemplateRows: `repeat(${HOURS_DISPLAYED * 2}, minmax(3.5rem, 1fr))`,
                                }}
                                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                            >
                                <div className="row-end-1 h-7" />
                                {Array.from(
                                    { length: HOURS_DISPLAYED },
                                    (_, i) => {
                                        const hour = START_HOUR + i;
                                        return (
                                            <React.Fragment key={hour}>
                                                <div>
                                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs/5 text-gray-400">
                                                        {formatHour(hour)}
                                                    </div>
                                                </div>
                                                <div />
                                            </React.Fragment>
                                        );
                                    },
                                )}
                            </div>

                            {/* Vertical lines - day columns */}
                            <div className="col-start-1 col-end-2 row-start-1 hidden grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                                {Array.from({ length: 8 }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`col-start-${i + 1} row-span-full ${i === 7 ? "w-8" : ""}`}
                                    />
                                ))}
                            </div>

                            {/* Business hours shading overlay */}
                            <div
                                style={{
                                    gridTemplateRows: `1.75rem repeat(${HOURS_DISPLAYED * 2}, minmax(3.5rem, 1fr))`,
                                }}
                                className="pointer-events-none col-start-1 col-end-2 row-start-1 hidden sm:grid sm:grid-cols-7 sm:pr-8"
                            >
                                {Array.from({ length: 7 }, (_, dayIndex) =>
                                    Array.from(
                                        { length: HOURS_DISPLAYED },
                                        (_, hourIdx) => {
                                            const hour = START_HOUR + hourIdx;
                                            const withinHours =
                                                isWithinBusinessHours(
                                                    dayIndex,
                                                    hour,
                                                );
                                            return (
                                                <div
                                                    key={`${dayIndex}-${hour}`}
                                                    style={{
                                                        gridColumn: dayIndex + 1,
                                                        gridRow: `${hourIdx * 2 + 2} / span 2`,
                                                    }}
                                                    className={
                                                        !withinHours
                                                            ? "bg-gray-50/80"
                                                            : ""
                                                    }
                                                />
                                            );
                                        },
                                    ),
                                )}
                            </div>

                            {/* Blocked times */}
                            <div
                                style={{
                                    gridTemplateRows: `1.75rem repeat(${HOURS_DISPLAYED * 12}, minmax(0, 1fr)) auto`,
                                }}
                                className="pointer-events-none col-start-1 col-end-2 row-start-1 hidden sm:grid sm:grid-cols-7 sm:pr-8"
                            >
                                {weekBlockedTimes.flatMap((bt) =>
                                    getBlockedTimePositions(bt).map(
                                        (pos, idx) => (
                                            <div
                                                key={`${bt.id}-${idx}`}
                                                style={{
                                                    gridColumn: pos.dayColumn,
                                                    gridRow: `${pos.startRow} / span ${pos.span}`,
                                                }}
                                                className="relative mx-1 flex flex-col rounded-lg bg-red-100/80 p-1 text-xs"
                                            >
                                                <span className="font-medium text-red-700">
                                                    Blocked
                                                </span>
                                                {bt.reason && (
                                                    <span className="truncate text-red-500">
                                                        {bt.reason}
                                                    </span>
                                                )}
                                            </div>
                                        ),
                                    ),
                                )}
                            </div>

                            {/* Appointments */}
                            <ol
                                style={{
                                    gridTemplateRows: `1.75rem repeat(${HOURS_DISPLAYED * 12}, minmax(0, 1fr)) auto`,
                                }}
                                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                            >
                                {weekAppointments.map((appointment) => (
                                    <AppointmentBlock
                                        key={appointment.id}
                                        appointment={appointment}
                                        onClick={onAppointmentClick}
                                        colStart={getColumnForDate(
                                            appointment.appointment_date,
                                        )}
                                        startHourOffset={START_HOUR}
                                    />
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
