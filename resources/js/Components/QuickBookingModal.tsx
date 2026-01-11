import { useEffect, useState } from "react";
import { useForm, router } from "@inertiajs/react";
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
}

interface QuickBookingModalProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onClose: () => void;
}

interface QuickBookingFormData {
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

export default function QuickBookingModal({
    appointment,
    isOpen,
    onClose,
}: QuickBookingModalProps) {
    // State for calendar and time selection
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
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
                }
            } catch (error) {
                console.error("Failed to fetch available slots:", error);
                if (!ignore) {
                    setAvailableSlots([]);
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
            `/admin/appointments/${appointment?.id}/quickbook`,
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
            <DialogTitle>Quick Book Appointment</DialogTitle>

            {/* *If you've groomed this dog before then use quick search feature to find dog/client name */}

            {/* If this is a new client, an extra drop down form appears to quickly create this new dog and client */}

            <DialogBody>
                {/* New Booking Details - use data and date/time as it becomes available */}
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Current Appointment
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>
                            <span className="font-medium">Dog:</span>{" "}
                            {appointment.dog}
                            {appointment.breed && ` (${appointment.breed})`}
                        </p>
                        <p>
                            <span className="font-medium">Owner:</span>{" "}
                            {appointment.owner}
                        </p>
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

                    {/* Time Slots */}
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

                        {selectedDate &&
                            !isLoadingSlots &&
                            availableSlots.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
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
