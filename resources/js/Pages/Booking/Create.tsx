import React from "react";
import { Head, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import {
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
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

    const { data, setData, post, processing, errors } = useForm({
        dog_id: dog?.id || 0,
        service_id: null as number | null,
        appointment_date: "",
        appointment_time: "",
        notes: "",
    });

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
                {/* Decorative blobs */}
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
                            {/* Dog selector — only shown when customer has multiple dogs */}
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

                            {/* Date & time */}
                            <div>
                                <SectionDivider label="Pick a date & time" />
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="date"
                                            className="label"
                                        >
                                            Preferred date
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            value={data.appointment_date}
                                            onChange={(e) =>
                                                setData(
                                                    "appointment_date",
                                                    e.target.value,
                                                )
                                            }
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            className="input"
                                        />
                                        {errors.appointment_date && (
                                            <p className="mt-1.5 text-sm text-red-600">
                                                {errors.appointment_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="time"
                                            className="label"
                                        >
                                            Preferred time
                                        </label>
                                        <select
                                            id="time"
                                            value={data.appointment_time}
                                            onChange={(e) =>
                                                setData(
                                                    "appointment_time",
                                                    e.target.value,
                                                )
                                            }
                                            className="input"
                                        >
                                            <option value="">
                                                Select a time
                                            </option>
                                            <option value="09:00">
                                                9:00 AM
                                            </option>
                                            <option value="10:00">
                                                10:00 AM
                                            </option>
                                            <option value="11:00">
                                                11:00 AM
                                            </option>
                                            <option value="13:00">
                                                1:00 PM
                                            </option>
                                            <option value="14:00">
                                                2:00 PM
                                            </option>
                                            <option value="15:00">
                                                3:00 PM
                                            </option>
                                            <option value="16:00">
                                                4:00 PM
                                            </option>
                                        </select>
                                        {errors.appointment_time && (
                                            <p className="mt-1.5 text-sm text-red-600">
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
                                        ? "Booking…"
                                        : "Book Appointment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
