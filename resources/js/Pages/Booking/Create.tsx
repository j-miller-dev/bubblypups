import React, { useEffect, useMemo, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import {
    CalendarDaysIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
} from "@heroicons/react/20/solid";

interface Dog {
    id: number;
    name: string;
    breed: string;
    size: string;
}

interface Service {
    id: number;
    name: string;
    description: string;
    emoji: string;
    base_price: number;
    duration_minutes: number;
}

interface Props {
    dogs: Dog[];
    services: Service[];
    selectedDogId?: number;
}

function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function formatDisplayTime(timeStr: string): string {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

function SectionDivider({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
                {label}
            </span>
            <div className="h-px flex-1 bg-gray-100" />
        </div>
    );
}

export default function Create({ dogs, services, selectedDogId }: Props) {
    const dog = dogs?.find((d) => d.id === selectedDogId) || dogs?.[0];
    const { bookingWindowWeeks, businessPhone } = usePage<{
        bookingWindowWeeks: number;
        businessPhone: string;
    }>().props;

    const { data, setData, post, processing, errors } = useForm({
        dog_id: dog?.id || 0,
        service_id: null as number | null,
        appointment_date: "",
        appointment_time: "",
        notes: "",
    });

    const todayStr = formatDate(new Date());
    const maxDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + bookingWindowWeeks * 7);
        return formatDate(d);
    }, [bookingWindowWeeks]);
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    const calendarDays = useMemo(() => {
        const y = viewDate.getFullYear();
        const m = viewDate.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const mondayOffset = (firstDay + 6) % 7;
        const daysInPrevMonth = new Date(y, m, 0).getDate();
        const daysInThisMonth = new Date(y, m + 1, 0).getDate();

        const grid: { date: string; isCurrentMonth: boolean }[] = [];

        for (let i = mondayOffset; i > 0; i--) {
            const d = new Date(y, m - 1, daysInPrevMonth - i + 1);
            grid.push({ date: formatDate(d), isCurrentMonth: false });
        }
        for (let day = 1; day <= daysInThisMonth; day++) {
            const d = new Date(y, m, day);
            grid.push({ date: formatDate(d), isCurrentMonth: true });
        }
        const remainder = grid.length % 7;
        const trailing = remainder === 0 ? 0 : 7 - remainder;
        for (let i = 1; i <= trailing; i++) {
            const d = new Date(y, m + 1, i);
            grid.push({ date: formatDate(d), isCurrentMonth: false });
        }
        return grid;
    }, [viewDate]);

    useEffect(() => {
        if (!data.appointment_date) return;
        let ignore = false;

        setIsLoadingSlots(true);
        setAvailableSlots([]);

        fetch(`/booking/available-slots?date=${data.appointment_date}`)
            .then((r) => r.json())
            .then((result) => {
                if (!ignore) {
                    setAvailableSlots(result.slots || []);
                    setIsLoadingSlots(false);
                }
            })
            .catch(() => {
                if (!ignore) {
                    setAvailableSlots([]);
                    setIsLoadingSlots(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [data.appointment_date]);

    const handleDateSelect = (date: string, isCurrentMonth: boolean) => {
        setData("appointment_date", date);
        setData("appointment_time", "");
        if (!isCurrentMonth) {
            const [yy, mm] = date.slice(0, 7).split("-").map(Number);
            setViewDate(new Date(yy, (mm ?? 1) - 1, 1));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("booking.store"));
    };

    const selectedDog = dogs?.find((d) => d.id === data.dog_id) || dog;

    if (!dog) {
        return (
            <MainLayout title="Book Appointment">
                <Head title="Book Appointment" />
                <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50 py-20 sm:py-28">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-brand-100 opacity-60 blur-3xl"
                    />
                    <Container>
                        <div className="mx-auto max-w-md text-center">
                            <span className="text-5xl mb-6 block">🐾</span>
                            <h2 className="text-gray-950 mb-4">No pups found</h2>
                            <p className="text-gray-500">
                                Please add a dog to your account before booking
                                an appointment.
                            </p>
                        </div>
                    </Container>
                </section>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Book Appointment">
            <Head title="Book Appointment" />

            <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50 py-16 sm:py-24">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand-100 opacity-50 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-100 opacity-40 blur-3xl"
                />

                <Container>
                    <div className="mx-auto max-w-2xl">
                        {/* Page header */}
                        <div className="mb-10">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-medium shadow-sm mb-5">
                                <CalendarDaysIcon className="h-4 w-4" />
                                Book an appointment
                            </span>
                            <h2 className="text-gray-950">
                                Book{" "}
                                <span className="text-brand-500">
                                    {selectedDog?.name ?? dog.name}
                                </span>
                                's appointment
                            </h2>
                            <p className="mt-2 text-gray-500">
                                {selectedDog?.breed ?? dog.breed} &middot;{" "}
                                {selectedDog?.size ?? dog.size}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Dog selector */}
                            {dogs.length > 1 && (
                                <div>
                                    <SectionDivider label="Which pup?" />
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {dogs.map((d) => (
                                            <button
                                                key={d.id}
                                                type="button"
                                                onClick={() =>
                                                    setData("dog_id", d.id)
                                                }
                                                className={[
                                                    "inline-flex items-center gap-2 px-4 py-2 rounded-button text-sm font-medium font-display transition-all duration-200",
                                                    data.dog_id === d.id
                                                        ? "bg-brand-400 text-white shadow-sm"
                                                        : "bg-white border border-gray-200 text-gray-700 hover:border-brand-300 hover:text-brand-500",
                                                ].join(" ")}
                                            >
                                                🐾 {d.name}
                                                <span
                                                    className={
                                                        data.dog_id === d.id
                                                            ? "text-white/70"
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    {d.breed}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Service selection */}
                            <div>
                                <SectionDivider label="Choose a service" />
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {services.map((service) => {
                                        const isSelected =
                                            data.service_id === service.id;
                                        return (
                                            <div
                                                key={service.id}
                                                onClick={() =>
                                                    setData(
                                                        "service_id",
                                                        service.id,
                                                    )
                                                }
                                                className={[
                                                    "relative rounded-card border p-4 cursor-pointer transition-all duration-200",
                                                    isSelected
                                                        ? "border-brand-400 bg-brand-50 ring-2 ring-brand-200 shadow-sm"
                                                        : "border-gray-100 bg-white hover:border-brand-200 hover:bg-brand-50/30 shadow-sm",
                                                ].join(" ")}
                                            >
                                                {isSelected && (
                                                    <CheckCircleIcon className="absolute top-3 right-3 w-5 h-5 text-brand-400" />
                                                )}
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl leading-none mt-0.5">
                                                        {service.emoji}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-display font-extrabold text-sm text-gray-900">
                                                            {service.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                                            {service.description}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                                <ClockIcon className="w-3.5 h-3.5" />
                                                                {
                                                                    service.duration_minutes
                                                                }{" "}
                                                                min
                                                            </span>
                                                            <span className="text-sm font-display font-extrabold text-brand-500">
                                                                From $
                                                                {
                                                                    service.base_price
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.service_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.service_id}
                                    </p>
                                )}
                            </div>

                            {/* Date & Time */}
                            <div>
                                <SectionDivider label="Pick a date & time" />
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Calendar */}
                                    <div>
                                        <p className="text-xs font-display font-extrabold text-gray-500 uppercase tracking-wide mb-3">
                                            Select a date
                                        </p>

                                        {/* Month nav */}
                                        <div className="flex items-center justify-between mb-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setViewDate(
                                                        new Date(
                                                            viewDate.getFullYear(),
                                                            viewDate.getMonth() -
                                                                1,
                                                            1,
                                                        ),
                                                    )
                                                }
                                                className="rounded-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="sr-only">
                                                    Previous month
                                                </span>
                                                <ChevronLeftIcon className="size-4" />
                                            </button>
                                            <span className="text-sm font-display font-extrabold text-gray-900">
                                                {viewDate.toLocaleString(
                                                    "en-AU",
                                                    {
                                                        month: "long",
                                                        year: "numeric",
                                                    },
                                                )}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setViewDate(
                                                        new Date(
                                                            viewDate.getFullYear(),
                                                            viewDate.getMonth() +
                                                                1,
                                                            1,
                                                        ),
                                                    )
                                                }
                                                className="rounded-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="sr-only">
                                                    Next month
                                                </span>
                                                <ChevronRightIcon className="size-4" />
                                            </button>
                                        </div>

                                        {/* Day headers */}
                                        <div className="grid grid-cols-7 text-xs font-display font-extrabold text-gray-400 text-center mb-1">
                                            {[
                                                "M",
                                                "T",
                                                "W",
                                                "T",
                                                "F",
                                                "S",
                                                "S",
                                            ].map((d, i) => (
                                                <div key={i}>{d}</div>
                                            ))}
                                        </div>

                                        {/* Calendar grid */}
                                        <div className="isolate grid grid-cols-7 gap-px rounded-card bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200 overflow-hidden">
                                            {calendarDays.map((day) => {
                                                const isSelected =
                                                    day.date ===
                                                    data.appointment_date;
                                                const isToday =
                                                    day.date === todayStr;
                                                const isPast =
                                                    day.date < todayStr;
                                                const isBeyondWindow =
                                                    day.date > maxDate;
                                                return (
                                                    <button
                                                        key={day.date}
                                                        type="button"
                                                        disabled={
                                                            isPast ||
                                                            isBeyondWindow
                                                        }
                                                        onClick={() =>
                                                            handleDateSelect(
                                                                day.date,
                                                                day.isCurrentMonth,
                                                            )
                                                        }
                                                        className={[
                                                            "py-2 text-center transition-colors focus:z-10 disabled:cursor-not-allowed disabled:opacity-40",
                                                            isSelected
                                                                ? "bg-brand-500"
                                                                : day.isCurrentMonth
                                                                  ? "bg-white hover:bg-brand-50"
                                                                  : "bg-gray-50 hover:bg-gray-100",
                                                            isToday &&
                                                            !isSelected
                                                                ? "ring-1 ring-inset ring-brand-300"
                                                                : "",
                                                        ].join(" ")}
                                                    >
                                                        <time
                                                            dateTime={day.date}
                                                            className={[
                                                                "mx-auto flex size-8 items-center justify-center rounded-full text-xs font-display font-extrabold",
                                                                isSelected
                                                                    ? "text-white"
                                                                    : isToday
                                                                      ? "text-brand-500"
                                                                      : day.isCurrentMonth
                                                                        ? "text-gray-900"
                                                                        : "text-gray-400",
                                                            ].join(" ")}
                                                        >
                                                            {day.date
                                                                .split("-")
                                                                .pop()
                                                                ?.replace(
                                                                    /^0/,
                                                                    "",
                                                                )}
                                                        </time>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <p className="mt-3 text-xs text-gray-400 text-center">
                                            Online bookings available up to{" "}
                                            {bookingWindowWeeks} weeks ahead.{" "}
                                            <a
                                                href={`tel:${businessPhone}`}
                                                className="text-brand-500 hover:underline font-medium"
                                            >
                                                Call us
                                            </a>{" "}
                                            to book further ahead.
                                        </p>

                                        {errors.appointment_date && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.appointment_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* Time slots */}
                                    <div>
                                        <p className="text-xs font-display font-extrabold text-gray-500 uppercase tracking-wide mb-3">
                                            Select a time
                                        </p>

                                        {!data.appointment_date && (
                                            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-gray-200 py-10 text-center">
                                                <CalendarDaysIcon className="size-8 text-gray-300 mb-2" />
                                                <p className="text-sm text-gray-400">
                                                    Pick a date first
                                                </p>
                                            </div>
                                        )}

                                        {data.appointment_date &&
                                            isLoadingSlots && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Array.from({
                                                        length: 6,
                                                    }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="h-11 rounded-button bg-gray-100 animate-pulse"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                        {data.appointment_date &&
                                            !isLoadingSlots &&
                                            availableSlots.length === 0 && (
                                                <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-gray-200 py-10 text-center">
                                                    <ClockIcon className="size-8 text-gray-300 mb-2" />
                                                    <p className="text-sm text-gray-400">
                                                        No times available for
                                                        this date
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Try a different day
                                                    </p>
                                                </div>
                                            )}

                                        {data.appointment_date &&
                                            !isLoadingSlots &&
                                            availableSlots.length > 0 && (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {availableSlots.map(
                                                        (slot) => (
                                                            <button
                                                                key={slot}
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        "appointment_time",
                                                                        slot,
                                                                    )
                                                                }
                                                                className={[
                                                                    "flex items-center justify-center gap-1.5 rounded-button border px-3 py-3 text-sm font-display font-extrabold transition-colors",
                                                                    data.appointment_time ===
                                                                    slot
                                                                        ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                                                                        : "bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-brand-50",
                                                                ].join(" ")}
                                                            >
                                                                <ClockIcon className="size-3.5 shrink-0" />
                                                                {formatDisplayTime(
                                                                    slot,
                                                                )}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                        {errors.appointment_time && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.appointment_time}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <SectionDivider label="Anything else?" />
                                <div className="mt-4">
                                    <label htmlFor="notes" className="label">
                                        Additional notes{" "}
                                        <span className="text-gray-400 font-normal">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        placeholder="Any special requests, sensitivities, or things we should know about your pup?"
                                        className="input"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1.5 text-sm text-red-600">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* How booking works notice */}
                            <div className="rounded-card border border-brand-200 bg-brand-50 px-5 py-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-xl shrink-0 mt-0.5">🐾</span>
                                    <div>
                                        <p className="text-sm font-display font-extrabold text-brand-800">
                                            We'll confirm your time shortly
                                        </p>
                                        <p className="mt-1 text-sm text-brand-700">
                                            We're a one-groomer salon, so each booking is reviewed to make sure your pup gets the full attention they deserve. We'll confirm your time — or suggest a small tweak if needed. You'll receive an SMS and email once it's locked in.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Appointment summary */}
                            {data.appointment_date && data.appointment_time && (
                                <p className="text-center text-sm text-gray-500">
                                    Your requested appointment:{" "}
                                    <span className="font-display font-extrabold text-gray-900">
                                        {new Date(
                                            data.appointment_date + "T12:00:00",
                                        ).toLocaleDateString("en-AU", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}{" "}
                                        at{" "}
                                        {formatDisplayTime(
                                            data.appointment_time,
                                        )}
                                    </span>
                                </p>
                            )}

                            {/* Submit */}
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.service_id ||
                                        !data.appointment_date ||
                                        !data.appointment_time
                                    }
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CalendarDaysIcon className="h-4 w-4" />
                                    {processing
                                        ? "Sending request…"
                                        : "Request Appointment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
