import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Appointment, BlockedTime, BusinessHours } from "@/types";
import AppointmentBlock from "./AppointmentBlock";

// Calendar display range: 7am to 10pm
const START_HOUR = 7;
const END_HOUR = 22;
const HOURS_DISPLAYED = END_HOUR - START_HOUR; // 15 hours

interface DayViewProps {
    appointments: Appointment[];
    businessHours: BusinessHours[];
    blockedTimes: BlockedTime[];
    currentDate: string;
    onDateChange: (date: string) => void;
    onAppointmentClick?: (appointment: Appointment) => void;
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

// Check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

// Get day name
function getDayName(date: Date): string {
    return date.toLocaleDateString("en-AU", { weekday: "long" });
}

// Format date for display
function formatDisplayDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-AU", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

// Map day index (0=Sun, 1=Mon, ..., 6=Sat) to day name
const DAY_MAP: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
};

// Parse time string "HH:mm" to hour number
function parseTimeToHour(time: string | null): number | null {
    if (!time) return null;
    const [hours] = time.split(":").map(Number);
    return hours;
}

// Format hour for display (12-hour format)
function formatHour(hour: number): string {
    if (hour === 0) return "12AM";
    if (hour < 12) return `${hour}AM`;
    if (hour === 12) return "12PM";
    return `${hour - 12}PM`;
}

export default function DayView({
    appointments,
    businessHours,
    blockedTimes,
    currentDate,
    onDateChange,
    onAppointmentClick,
}: DayViewProps) {
    const today = new Date();
    const selectedDate = new Date(currentDate);

    // Get business hours for the selected day
    const dayName = DAY_MAP[selectedDate.getDay()];
    const todayHours = businessHours.find((bh) => bh.day_of_week === dayName);
    const isOpen = todayHours?.is_open ?? false;
    const openHour = parseTimeToHour(todayHours?.open_time ?? null);
    const closeHour = parseTimeToHour(todayHours?.close_time ?? null);

    // Check if an hour is within business hours
    const isWithinBusinessHours = (hour: number): boolean => {
        if (!isOpen || openHour === null || closeHour === null) return false;
        return hour >= openHour && hour < closeHour;
    };

    // Filter appointments for current day that fall within display range
    const dayAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.appointment_date);
        if (!isSameDay(aptDate, selectedDate)) return false;
        const [hours] = apt.appointment_time.split(":").map(Number);
        return hours >= START_HOUR && hours < END_HOUR;
    });

    // Filter blocked times for current day
    const dayBlockedTimes = blockedTimes.filter((bt) => {
        const startDate = new Date(bt.start_datetime);
        const endDate = new Date(bt.end_datetime);
        // Check if blocked time overlaps with selected day
        const dayStart = new Date(selectedDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(23, 59, 59, 999);
        return startDate <= dayEnd && endDate >= dayStart;
    });

    // Navigate to previous day
    const goToPreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        onDateChange(formatDate(newDate));
    };

    // Navigate to next day
    const goToNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        onDateChange(formatDate(newDate));
    };

    // Navigate to today
    const goToToday = () => {
        onDateChange(formatDate(new Date()));
    };

    // Calculate blocked time position for grid
    const getBlockedTimePosition = (bt: BlockedTime) => {
        const startDate = new Date(bt.start_datetime);
        const endDate = new Date(bt.end_datetime);
        const dayStart = new Date(selectedDate);
        dayStart.setHours(START_HOUR, 0, 0, 0);
        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(END_HOUR, 0, 0, 0);

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

        return { startRow, span };
    };

    return (
        <div className="flex h-full flex-col">
            <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                    <h1 className="text-base font-semibold text-gray-900">
                        <time dateTime={currentDate}>
                            {formatDisplayDate(currentDate)}
                        </time>
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {getDayName(selectedDate)}
                    </p>
                </div>
                <div className="flex items-center">
                    <div className="relative flex items-center rounded-md bg-white shadow-xs outline -outline-offset-1 outline-gray-300 md:items-stretch">
                        <button
                            type="button"
                            onClick={goToPreviousDay}
                            className="flex h-9 w-12 items-center justify-center rounded-l-md pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous day</span>
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
                            onClick={goToNextDay}
                            className="flex h-9 w-12 items-center justify-center rounded-r-md pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                        >
                            <span className="sr-only">Next day</span>
                            <ChevronRightIcon
                                aria-hidden="true"
                                className="size-5"
                            />
                        </button>
                    </div>
                </div>
            </header>
            <div className="isolate flex flex-auto overflow-hidden bg-white">
                <div className="flex flex-auto flex-col overflow-auto">
                    <div className="flex w-full flex-auto">
                        <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
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
                                        const withinHours =
                                            isWithinBusinessHours(hour);
                                        return (
                                            <React.Fragment key={hour}>
                                                <div
                                                    className={
                                                        !withinHours
                                                            ? "bg-gray-50"
                                                            : ""
                                                    }
                                                >
                                                    <div
                                                        className={`-mt-2.5 -ml-14 w-14 pr-2 text-right text-xs/5 ${withinHours ? "text-gray-400" : "text-gray-300"}`}
                                                    >
                                                        {formatHour(hour)}
                                                    </div>
                                                </div>
                                                <div
                                                    className={
                                                        !withinHours
                                                            ? "bg-gray-50"
                                                            : ""
                                                    }
                                                />
                                            </React.Fragment>
                                        );
                                    },
                                )}
                            </div>

                            {/* Blocked times */}
                            <div
                                style={{
                                    gridTemplateRows: `1.75rem repeat(${HOURS_DISPLAYED * 12}, minmax(0, 1fr)) auto`,
                                }}
                                className="pointer-events-none col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                            >
                                {dayBlockedTimes.map((bt) => {
                                    const { startRow, span } =
                                        getBlockedTimePosition(bt);
                                    return (
                                        <div
                                            key={bt.id}
                                            style={{
                                                gridRow: `${startRow} / span ${span}`,
                                            }}
                                            className="relative mx-1 flex flex-col rounded-lg bg-red-100/80 p-2 text-xs"
                                        >
                                            <span className="font-medium text-red-700">
                                                Blocked
                                            </span>
                                            {bt.reason && (
                                                <span className="text-red-500 truncate">
                                                    {bt.reason}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Appointments */}
                            <ol
                                style={{
                                    gridTemplateRows: `1.75rem repeat(${HOURS_DISPLAYED * 12}, minmax(0, 1fr)) auto`,
                                }}
                                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                            >
                                {dayAppointments.map((appointment) => (
                                    <AppointmentBlock
                                        key={appointment.id}
                                        appointment={appointment}
                                        onClick={onAppointmentClick}
                                        startHourOffset={START_HOUR}
                                    />
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Today indicator */}
                {isSameDay(selectedDate, today) &&
                    today.getHours() >= START_HOUR &&
                    today.getHours() < END_HOUR && (
                        <div
                            className="absolute left-14 right-0 z-20 h-0.5 bg-red-500"
                            style={{
                                top: `calc(${((today.getHours() - START_HOUR) * 2 + (today.getMinutes() >= 30 ? 1 : 0)) * 3.5}rem + 1.75rem)`,
                            }}
                        />
                    )}
            </div>
        </div>
    );
}
