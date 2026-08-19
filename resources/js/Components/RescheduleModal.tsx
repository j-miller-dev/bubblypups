import { useEffect, useState } from "react";
import { useForm, router, usePage } from "@inertiajs/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
    Dialog,
    DialogTitle,
    DialogBody,
    DialogActions,
} from "@/Components/ui/Dialog";

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

function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatDisplayTime(timeStr: string): string {
    if (!timeStr) return "—";
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function RescheduleModal({
    appointment,
    isOpen,
    onClose,
}: RescheduleModalProps) {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [existingAppointments, setExistingAppointments] = useState<
        { time: string; dog_name: string; service: string; duration: number; status: string }[]
    >([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [days, setDays] = useState<
        { date: string; isToday?: boolean; isCurrentMonth?: boolean; isSelected?: boolean }[]
    >([]);

    const todayStr = formatDate(new Date());
    const { errors } = usePage().props as any;

    const { data, setData, reset } = useForm({
        appointment_date: "",
        appointment_time: "",
        status: "confirmed" as "confirmed" | "waiting_on_client",
        notes: "",
    });

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

    // Build calendar grid
    useEffect(() => {
        const y = viewDate.getFullYear();
        const m = viewDate.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const mondayOffset = (firstDay + 6) % 7;
        const daysInPrevMonth = new Date(y, m, 0).getDate();
        const daysInThisMonth = new Date(y, m + 1, 0).getDate();

        const grid: { date: string; isToday?: boolean; isCurrentMonth?: boolean; isSelected?: boolean }[] = [];

        for (let i = mondayOffset; i > 0; i--) {
            const d = new Date(y, m - 1, daysInPrevMonth - i + 1);
            const dateStr = formatDate(d);
            grid.push({ date: dateStr, isCurrentMonth: false, isToday: dateStr === todayStr, isSelected: dateStr === selectedDate });
        }
        for (let day = 1; day <= daysInThisMonth; day++) {
            const d = new Date(y, m, day);
            const dateStr = formatDate(d);
            grid.push({ date: dateStr, isCurrentMonth: true, isToday: dateStr === todayStr, isSelected: dateStr === selectedDate });
        }
        const remainder = grid.length % 7;
        const trailing = remainder === 0 ? 0 : 7 - remainder;
        for (let i = 1; i <= trailing; i++) {
            const d = new Date(y, m + 1, i);
            const dateStr = formatDate(d);
            grid.push({ date: dateStr, isCurrentMonth: false, isToday: dateStr === todayStr, isSelected: dateStr === selectedDate });
        }

        setDays(grid);
    }, [viewDate, selectedDate, todayStr]);

    // Fetch available slots when date changes
    useEffect(() => {
        if (!selectedDate || !appointment) return;
        let ignore = false;

        const fetchSlots = async () => {
            setIsLoadingSlots(true);
            try {
                const res = await fetch(
                    `/admin/appointments/available-slots?date=${selectedDate}&exclude_appointment_id=${appointment.id}`,
                );
                const result = await res.json();
                if (!ignore) {
                    setAvailableSlots(result.slots || []);
                    setExistingAppointments(result.existing_appointments || []);
                }
            } catch {
                if (!ignore) { setAvailableSlots([]); setExistingAppointments([]); }
            } finally {
                if (!ignore) setIsLoadingSlots(false);
            }
        };

        fetchSlots();
        return () => { ignore = true; };
    }, [selectedDate, appointment?.id]);

    const handleDateSelect = (date: string, isCurrentMonth: boolean) => {
        setSelectedDate(date);
        setSelectedTime("");
        setAvailableSlots([]);
        setData("appointment_date", date);
        setData("appointment_time", "");
        if (!isCurrentMonth) {
            const [yy, mm] = date.slice(0, 7).split("-").map(Number);
            setViewDate(new Date(yy, (mm ?? 1) - 1, 1));
        }
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setData("appointment_time", time);
    };

    const handleSubmit = (status: "confirmed" | "waiting_on_client") => {
        router.patch(
            `/admin/appointments/${appointment?.id}/reschedule`,
            { appointment_date: data.appointment_date, appointment_time: data.appointment_time, status, notes: data.notes },
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

    const canSubmit = !!selectedDate && !!selectedTime;

    if (!appointment) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} size="3xl">
            <DialogTitle>Reschedule Appointment</DialogTitle>

            <DialogBody>
                {/* Dog info + service pill */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-gray-100 bg-gray-50 p-4 mb-6">
                    <div className="flex items-center gap-3">
                        {appointment.photo_url ? (
                            <img
                                src={appointment.photo_url}
                                alt={appointment.dog}
                                className="size-12 rounded-full object-cover ring-2 ring-brand-200 shrink-0"
                            />
                        ) : (
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-100 ring-2 ring-brand-200 text-xl">
                                🐶
                            </div>
                        )}
                        <div>
                            <p className="font-display font-extrabold text-gray-900">
                                {appointment.dog}
                                {appointment.breed && (
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        {appointment.breed}
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-gray-500">Owner: {appointment.owner}</p>
                        </div>
                    </div>
                    {appointment.service && (
                        <div className="inline-flex items-center gap-2 rounded-button border border-brand-100 bg-brand-50 px-3 py-2">
                            {appointment.service_emoji && (
                                <span>{appointment.service_emoji}</span>
                            )}
                            <div>
                                <p className="text-xs text-gray-500 font-display font-extrabold leading-none mb-0.5">
                                    Service
                                </p>
                                <p className="text-sm font-display font-extrabold text-gray-900">
                                    {appointment.service}
                                </p>
                            </div>
                            {appointment.price !== undefined && (
                                <span className="ml-1 font-display font-extrabold text-brand-500 text-sm">
                                    ${appointment.price}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Current → New time banner */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 rounded-card border border-gray-200 bg-white p-3 text-center">
                        <p className="text-xs font-display font-extrabold text-gray-400 uppercase tracking-wide mb-1">
                            Current
                        </p>
                        <p className="text-sm font-display font-extrabold text-gray-700">
                            {formatDisplayDate(appointment.date)}
                        </p>
                        <p className="text-sm text-gray-500">{formatDisplayTime(appointment.time)}</p>
                    </div>
                    <ArrowRightIcon className="size-5 text-brand-400 shrink-0" />
                    <div className={`flex-1 rounded-card border p-3 text-center transition-colors ${
                        selectedDate && selectedTime
                            ? "border-brand-200 bg-brand-50"
                            : "border-gray-200 bg-white"
                    }`}>
                        <p className="text-xs font-display font-extrabold text-gray-400 uppercase tracking-wide mb-1">
                            New
                        </p>
                        <p className={`text-sm font-display font-extrabold ${selectedDate ? "text-gray-700" : "text-gray-300"}`}>
                            {formatDisplayDate(selectedDate)}
                        </p>
                        <p className={`text-sm ${selectedTime ? "text-brand-500 font-display font-extrabold" : "text-gray-300"}`}>
                            {formatDisplayTime(selectedTime)}
                        </p>
                    </div>
                </div>

                {/* Error */}
                {errors.appointment_time && (
                    <div className="mb-4 rounded-card border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-700">{errors.appointment_time}</p>
                    </div>
                )}

                {/* Calendar + Time Slots */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div>
                        <p className="text-xs font-display font-extrabold text-gray-500 uppercase tracking-wide mb-3">
                            Select Date
                        </p>

                        {/* Month nav */}
                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                                className="rounded-button p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon className="size-4" />
                            </button>
                            <span className="text-sm font-display font-extrabold text-gray-900">
                                {viewDate.toLocaleString("en-AU", { month: "long", year: "numeric" })}
                            </span>
                            <button
                                type="button"
                                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                                className="rounded-button p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <span className="sr-only">Next month</span>
                                <ChevronRightIcon className="size-4" />
                            </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 text-xs font-display font-extrabold text-gray-400 text-center mb-1">
                            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                                <div key={i}>{d}</div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="isolate grid grid-cols-7 gap-px rounded-card bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200 overflow-hidden">
                            {days.map((day) => (
                                <button
                                    key={day.date}
                                    type="button"
                                    disabled={day.date < todayStr}
                                    onClick={() => handleDateSelect(day.date, day.isCurrentMonth ?? false)}
                                    className={`py-1.5 text-center transition-colors focus:z-10 disabled:cursor-not-allowed disabled:opacity-40
                                        ${day.isSelected
                                            ? "bg-brand-500"
                                            : day.isCurrentMonth
                                            ? "bg-white hover:bg-brand-50"
                                            : "bg-gray-50 hover:bg-gray-100"
                                        }
                                        ${day.isToday && !day.isSelected ? "ring-1 ring-inset ring-brand-300" : ""}
                                    `}
                                >
                                    <time
                                        dateTime={day.date}
                                        className={`mx-auto flex size-7 items-center justify-center rounded-full text-xs font-display font-extrabold
                                            ${day.isSelected
                                                ? "text-white"
                                                : day.isToday
                                                ? "text-brand-500"
                                                : day.isCurrentMonth
                                                ? "text-gray-900"
                                                : "text-gray-400"
                                            }
                                        `}
                                    >
                                        {day.date.split("-").pop()?.replace(/^0/, "")}
                                    </time>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time slots */}
                    <div>
                        <p className="text-xs font-display font-extrabold text-gray-500 uppercase tracking-wide mb-3">
                            Select Time
                        </p>

                        {!selectedDate && (
                            <p className="text-sm text-gray-400 py-4">
                                Pick a date first
                            </p>
                        )}

                        {selectedDate && isLoadingSlots && (
                            <div className="space-y-2 py-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-9 rounded-button bg-gray-100 animate-pulse" />
                                ))}
                            </div>
                        )}

                        {selectedDate && !isLoadingSlots && availableSlots.length === 0 && (
                            <p className="text-sm text-gray-400 py-4">
                                No available times for this date
                            </p>
                        )}

                        {selectedDate && !isLoadingSlots && availableSlots.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => handleTimeSelect(slot)}
                                        className={`flex items-center justify-center gap-1.5 rounded-button border px-3 py-2 text-sm font-display font-extrabold transition-colors ${
                                            selectedTime === slot
                                                ? "bg-brand-500 text-white border-brand-500"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-brand-50"
                                        }`}
                                    >
                                        <ClockIcon className="size-3.5 shrink-0" />
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Day schedule */}
                        {selectedDate && !isLoadingSlots && (
                            <div className="mt-4 rounded-card border border-brand-100 bg-brand-50 p-3">
                                <p className="text-xs font-display font-extrabold text-brand-700 mb-2">
                                    Day's Schedule
                                </p>
                                {existingAppointments.length > 0 ? (
                                    <div className="space-y-1 max-h-28 overflow-y-auto">
                                        {existingAppointments.map((apt, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between gap-2 rounded-button bg-white px-2 py-1.5 text-xs"
                                            >
                                                <span className="font-display font-extrabold text-gray-900 shrink-0">
                                                    {apt.time}
                                                </span>
                                                <span className="text-gray-600 truncate">
                                                    {apt.dog_name}{" "}
                                                    <span className="text-gray-400">
                                                        [{apt.service}]
                                                    </span>
                                                </span>
                                                <span className="text-gray-400 shrink-0">
                                                    {apt.duration}m
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-brand-600 italic">
                                        No other appointments this day
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="mt-5">
                    <label htmlFor="reschedule-notes" className="label">
                        Notes{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        id="reschedule-notes"
                        rows={2}
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        className="input resize-none"
                        placeholder="Add any notes about this reschedule..."
                    />
                </div>
            </DialogBody>

            <DialogActions>
                <button type="button" onClick={onClose} className="btn-outline">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit("confirmed")}
                    disabled={!canSubmit}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Save Reschedule
                </button>
            </DialogActions>
        </Dialog>
    );
}
