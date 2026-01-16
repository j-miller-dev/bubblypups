import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { Button } from "@/Components/ui";

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

export default function Create({ dogs, services, selectedDogId }: Props) {
    // Find the selected dog or use the first one
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

    // ADD THE SAFETY CHECK HERE - before the main return
    if (!dog) {
        return (
            <MainLayout title="Book Appointment">
                <Head>
                    <title>Book Appointment</title>
                </Head>
                <div className="bg-white py-16">
                    <Container>
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                No Dogs Found
                            </h1>
                            <p className="text-lg text-gray-600">
                                Please add a dog to your account before booking
                                an appointment.
                            </p>
                        </div>
                    </Container>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Book Appointment">
            <Head>
                <title>Book Appointment</title>
            </Head>

            <div className="bg-white py-16">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Book {dog.name}'s Appointment
                            </h1>
                            <p className="text-lg text-gray-600">
                                {dog.breed} • {dog.size}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Service Selection */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">
                                    Select a Service
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className={`
                                                  border rounded-lg p-4 cursor-pointer transition-all
                                                  ${
                                                      data.service_id ===
                                                      service.id
                                                          ? "border-brand-500 bg-brand-50 shadow-md"
                                                          : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/50"
                                                  }
                                              `}
                                            onClick={() =>
                                                setData(
                                                    "service_id",
                                                    service.id,
                                                )
                                            }
                                        >
                                            <div className="flex items-start gap-x-3">
                                                <span className="text-2xl">
                                                    {service.emoji}
                                                </span>
                                                <div className="flex-1">
                                                    <h3 className="font-medium">
                                                        {service.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {service.description}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-sm text-gray-500">
                                                            {
                                                                service.duration_minutes
                                                            }{" "}
                                                            min
                                                        </span>
                                                        <span className="font-semibold text-brand-600">
                                                            From $
                                                            {service.base_price}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.service_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.service_id}
                                    </p>
                                )}
                            </div>

                            {/* Date Selection */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">
                                    Select Date & Time
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="date"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Preferred Date
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
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                        />
                                        {errors.appointment_date && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.appointment_date}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="time"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Preferred Time
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
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
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
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.appointment_time}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label
                                    htmlFor="notes"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    rows={4}
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    placeholder="Any special requests or information we should know?"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.service_id ||
                                        !data.appointment_date ||
                                        !data.appointment_time
                                    }
                                    className="px-8 py-3"
                                >
                                    {processing
                                        ? "Booking..."
                                        : "Book Appointment"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Container>
            </div>
        </MainLayout>
    );
}
