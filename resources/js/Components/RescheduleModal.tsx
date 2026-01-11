import { useEffect, useState } from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
    Dialog,
    DialogTitle,
    DialogBody,
    DialogActions,
} from "@/Components/ui/Dialog";
import { Button } from "@/Components/ui/Button";

interface Appointment {
    id: number;
    date: string;
    time: string;
    dog: string;
    owner: string;
    breed?: string;
    photo_url?: string | null;
    service?: string;
    service_emoji?: string;
    price?: number;
}

interface RescheduleModalProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onClose: () => void;
}

interface RescheduleFormData {
    appointment_date: string;
    appointment_time: string;
    status: "confirmed" | "waiting_on_client";
    notes: string;
}

// Helper function to format date as YYYY-MM-DD
function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function RescheduleModal({
    appointment,
    isOpen,
    onClose,
}: RescheduleModalProps) {
    // State for calendar and time selection
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [existingAppointments, setExistingAppointments] = useState<
        {
            time: string;
            dog_name: string;
            service: string;
            duration: number;
            status: string;
        }[]
    >([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [days, setDays] = useState<
        {
            date: string;
            isToday?: boolean;
            isCurrentMonth?: boolean;
            isSelected?: boolean;
        }[]
    >([]);

    const todayStr = formatDate(new Date());

    // Get errors from Inertia
    const { errors } = usePage().props as any;

    // Inertia form for submitting reschedule
    const { data, setData, patch, processing, reset } = useForm({
        appointment_date: "",
        appointment_time: "",
        status: "confirmed" as "confirmed" | "waiting_on_client",
        notes: "",
    });

    // Prefill logic when appointment changes
    useEffect(() => {
        if (appointment) {
            setSelectedDate(appointment.date);
            setSelectedTime(appointment.time);
            setData({
                appointment_date: appointment.date,
                appointment_time: appointment.time,
                status: "confirmed",
                notes: "",
            });
            setViewDate(new Date(appointment.date));
        }
    }, [appointment]);

    // Generate calendar grid (copied from UpcomingBookingsCal.tsx lines 89-146)
    useEffect(() => {
        const y = viewDate.getFullYear();
        const m = viewDate.getMonth(); // 0-based

        const firstOfMonth = new Date(y, m, 1);
        const firstDay = firstOfMonth.getDay(); // 0=Sun..6=Sat
        const mondayFirstOffset = (firstDay + 6) % 7; // 0 for Monday, 6 for Sunday

        const daysInPrevMonth = new Date(y, m, 0).getDate();
        const daysInThisMonth = new Date(y, m + 1, 0).getDate();

        const grid: {
            date: string;
            isToday?: boolean;
            isCurrentMonth?: boolean;
            isSelected?: boolean;
        }[] = [];

        // Leading days from previous month
        for (let i = mondayFirstOffset; i > 0; i--) {
            const d = new Date(y, m - 1, daysInPrevMonth - i + 1);
            const dateStr = formatDate(d);
            grid.push({
                date: dateStr,
                isCurrentMonth: false,
                isToday: dateStr === todayStr,
                isSelected: dateStr === selectedDate,
            });
        }

        // Current month days
        for (let day = 1; day <= daysInThisMonth; day++) {
            const d = new Date(y, m, day);
            const dateStr = formatDate(d);
            grid.push({
                date: dateStr,
                isCurrentMonth: true,
                isToday: dateStr === todayStr,
                isSelected: dateStr === selectedDate,
            });
        }

        // Trailing days from next month to complete weeks (multiple of 7)
        const remainder = grid.length % 7;
        const trailing = remainder === 0 ? 0 : 7 - remainder;
        for (let i = 1; i <= trailing; i++) {
            const d = new Date(y, m + 1, i);
            const dateStr = formatDate(d);
            grid.push({
                date: dateStr,
                isCurrentMonth: false,
                isToday: dateStr === todayStr,
                isSelected: dateStr === selectedDate,
            });
        }

        setDays(grid);
    }, [viewDate, selectedDate, todayStr]);

    // Fetch available slots when date changes
    useEffect(() => {
        if (!selectedDate || !appointment) {
            return;
        }

        let ignore = false;

        const fetchAvailableSlots = async () => {
            setIsLoadingSlots(true);
            try {
                const response = await fetch(
                    `/admin/appointments/available-slots?date=${selectedDate}&exclude_appointment_id=${appointment.id}`,
                );
                const result = await response.json();
                if (!ignore) {
                    setAvailableSlots(result.slots || []);
                    setExistingAppointments(result.existing_appointments || []);
                }
            } catch (error) {
                console.error("Failed to fetch available slots:", error);
                if (!ignore) {
                    setAvailableSlots([]);
                    setExistingAppointments([]);
                }
            } finally {
                if (!ignore) {
                    setIsLoadingSlots(false);
                }
            }
        };

        fetchAvailableSlots();

        return () => {
            ignore = true;
        };
    }, [selectedDate, appointment?.id]);

    // Handle date selection from calendar
    const handleDateSelect = (date: string, isCurrentMonth: boolean) => {
        setSelectedDate(date);
        setSelectedTime(""); // Reset time when date changes
        setAvailableSlots([]); // Clear old slots immediately
        setData("appointment_date", date);
        setData("appointment_time", "");

        // Update view if clicking on a day from previous/next month
        if (!isCurrentMonth) {
            const [yy, mm] = date
                .slice(0, 7)
                .split("-")
                .map((v) => parseInt(v, 10));
            setViewDate(new Date(yy, (mm ?? 1) - 1, 1));
        }
    };

    // Handle time slot selection
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setData("appointment_time", time);
    };

    // Submit handlers
    const handleSubmit = (status: "confirmed" | "waiting_on_client") => {
        // Use router.patch directly with manual data instead of form's patch method
        router.patch(
            `/admin/appointments/${appointment?.id}/reschedule`,
            {
                appointment_date: data.appointment_date,
                appointment_time: data.appointment_time,
                status: status, // Use the parameter directly
                notes: data.notes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    reset();
                    router.reload({ only: ["appointments"] });
                },
            },
        );
    };

    if (!appointment) {
        return null;
    }

    return (
        <Dialog open={isOpen} onClose={onClose} size="3xl">
            <DialogTitle>Reschedule Appointment</DialogTitle>

            <DialogBody>
                {/* Dog/Owner Info and Service Card */}
                <div className="flex justify-center mb-8 p-4">
                    {/* Dog and Owner Info */}
                    <div className="flex flex-col p-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {appointment.dog}
                            {appointment.breed && (
                                <span className="text-lg text-gray-500 ml-2">
                                    ({appointment.breed})
                                </span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Owner: {appointment.owner}
                        </p>
                    </div>

                    {/* Service Card */}
                    {appointment.service && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                            <p className="text-xs text-gray-500 font-medium mb-1">
                                Requested Service
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {appointment.service_emoji && (
                                    <span className="mr-2">
                                        {appointment.service_emoji}
                                    </span>
                                )}
                                {appointment.service}
                            </p>
                            {appointment.price !== undefined && (
                                <p className="text-sm text-gray-600 mt-1">
                                    ${appointment.price}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Current and New Appointment Times with Dog Image */}
                <div className="flex justify-center items-center gap-8 mb-8">
                    <div className="flex-1 max-w-xs bg-gray-100 rounded-lg p-5 text-center">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                            Current Appointment
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>
                                <span className="font-medium">Date:</span>{" "}
                                {appointment.date}
                            </p>
                            <p>
                                <span className="font-medium">Time:</span>{" "}
                                {appointment.time}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        {appointment.photo_url ? (
                            <img
                                src={appointment.photo_url}
                                alt={appointment.dog}
                                className="h-16 w-16 rounded-full object-cover border-2 border-indigo-200"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-semibold border-2 border-gray-300">
                                {appointment.dog.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <svg
                            className="h-6 w-6 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </div>

                    <div className="flex-1 max-w-xs bg-gray-100 rounded-lg p-5 text-center">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                            New Appointment
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>
                                <span className="font-medium">Date:</span>{" "}
                                {selectedDate || "—"}
                            </p>
                            <p>
                                <span className="font-medium">Time:</span>{" "}
                                {selectedTime || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {errors.appointment_time && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-800">
                            ⚠️ {errors.appointment_time}
                        </p>
                    </div>
                )}

                {/* Calendar and Time Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Select New Date
                        </h3>

                        {/* Month Navigation */}
                        <div className="flex items-center text-gray-900 mb-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setViewDate(
                                        new Date(
                                            viewDate.getFullYear(),
                                            viewDate.getMonth() - 1,
                                            1,
                                        ),
                                    )
                                }
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </button>
                            <div className="flex-auto text-center text-sm font-semibold">
                                {viewDate.toLocaleString(undefined, {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setViewDate(
                                        new Date(
                                            viewDate.getFullYear(),
                                            viewDate.getMonth() + 1,
                                            1,
                                        ),
                                    )
                                }
                                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Next month</span>
                                <ChevronRightIcon
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 text-xs/6 text-gray-500 text-center mb-2">
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                            <div>S</div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="isolate grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200">
                            {days.map((day) => (
                                <button
                                    key={day.date}
                                    type="button"
                                    disabled={day.date < todayStr}
                                    onClick={() =>
                                        handleDateSelect(
                                            day.date,
                                            day.isCurrentMonth ?? false,
                                        )
                                    }
                                    data-is-today={
                                        day.date === todayStr ? "" : undefined
                                    }
                                    data-is-selected={
                                        day.isSelected ? "" : undefined
                                    }
                                    data-is-current-month={
                                        day.isCurrentMonth ? "" : undefined
                                    }
                                    data-is-past={
                                        day.date < todayStr ? "" : undefined
                                    }
                                    className="group py-1.5 not-data-is-current-month:bg-gray-50 not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-400 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 data-is-current-month:bg-white not-data-is-selected:data-is-current-month:not-data-is-today:text-gray-900 data-is-current-month:hover:bg-gray-100 data-is-selected:font-semibold data-is-selected:text-white data-is-today:font-semibold data-is-today:not-data-is-selected:text-indigo-600 data-is-today:hover:bg-indigo-50 data-is-today:hover:ring-1 data-is-today:hover:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-50 nth-36:rounded-bl-lg nth-7:rounded-tr-lg"
                                >
                                    <time
                                        dateTime={day.date}
                                        className="mx-auto flex size-7 items-center justify-center rounded-full in-data-is-selected:bg-indigo-600 in-data-is-selected:text-white"
                                    >
                                        {day.date
                                            .split("-")
                                            .pop()
                                            ?.replace(/^0/, "")}
                                    </time>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Slots and Schedule */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Select New Time
                        </h3>

                        {!selectedDate && (
                            <p className="text-sm text-gray-500 py-4">
                                Please select a date first
                            </p>
                        )}

                        {selectedDate && isLoadingSlots && (
                            <p className="text-sm text-gray-500 py-4">
                                Loading available times...
                            </p>
                        )}

                        {selectedDate &&
                            !isLoadingSlots &&
                            availableSlots.length === 0 && (
                                <p className="text-sm text-gray-500 py-4">
                                    No available times for this date
                                </p>
                            )}

                        {selectedDate && !isLoadingSlots && (
                            <div className="space-y-4">
                                {/* Available Time Slots */}
                                {availableSlots.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() =>
                                                    handleTimeSelect(slot)
                                                }
                                                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                                    selectedTime === slot
                                                        ? "bg-indigo-600 text-white border-indigo-600 font-semibold"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Existing Appointments Schedule */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <h4 className="text-xs font-semibold text-blue-900 mb-2">
                                        Day's Schedule
                                    </h4>
                                    {existingAppointments.length > 0 ? (
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                            {existingAppointments.map(
                                                (apt, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between text-xs bg-white rounded px-2 py-1.5"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900">
                                                                {apt.time}
                                                            </span>
                                                            <span className="text-gray-600">
                                                                {apt.dog_name}{" "}
                                                                <span className="text-gray-500">
                                                                    [
                                                                    {
                                                                        apt.service
                                                                    }
                                                                    ]
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <span className="text-gray-500">
                                                            {apt.duration}min
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-600 italic">
                                            No other appointments on this day
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Notes (optional)
                    </label>
                    <textarea
                        id="notes"
                        rows={3}
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        placeholder="Add any notes about this reschedule..."
                    />
                </div>
            </DialogBody>

            <DialogActions>
                <Button onClick={onClose} disabled={processing}>
                    Cancel
                </Button>
                <Button
                    onClick={() => handleSubmit("waiting_on_client")}
                    disabled={processing || !selectedDate || !selectedTime}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                    Send to Client
                </Button>
                <Button
                    onClick={() => handleSubmit("confirmed")}
                    disabled={processing || !selectedDate || !selectedTime}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    Confirm Now
                </Button>
            </DialogActions>
        </Dialog>
    );
}
