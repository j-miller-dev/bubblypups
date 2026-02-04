import React, { useState } from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import AppointmentCard from "@/Components/Customer/AppointmentCard";
import DogPhotoUpload from "@/Components/Customer/DogPhotoUpload";
import BreedSelector from "@/Components/ui/BreedSelector";
import { Link, useForm } from "@inertiajs/react";
import { HeartIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface DogDetailProps {
    customer: {
        id: number;
        name: string;
        email: string;
    };
    dog: {
        id: number;
        name: string;
        breed: string;
        size: string;
        special_notes?: string;
        photo_url?: string;
        appointments: Array<{
            id: number;
            appointment_date: string;
            appointment_time: string;
            status: string;
            service: {
                id: number;
                name: string;
                emoji: string;
            };
        }>;
    };
}

export default function DogDetail({ customer, dog }: DogDetailProps) {
    const [showEditModal, setShowEditModal] = useState(false);

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: dog.name,
        breed: dog.breed,
        size: dog.size as "small" | "medium" | "large",
        special_notes: dog.special_notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/my/dogs/${dog.id}`, {
            onSuccess: () => {
                setShowEditModal(false);
            },
        });
    };

    function getSizeBadge(size: string) {
        const badges = {
            small: "bg-blue-100 text-blue-800",
            medium: "bg-purple-100 text-purple-800",
            large: "bg-orange-100 text-orange-800",
        };

        const labels = {
            small: "Small",
            medium: "Medium",
            large: "Large",
        };

        return {
            className: badges[size as keyof typeof badges] || badges.medium,
            label: labels[size as keyof typeof labels] || size,
        };
    }

    const sizeBadge = getSizeBadge(dog.size);

    // Format appointments with dog info for AppointmentCard
    const appointmentsWithDog = dog.appointments.map((apt) => ({
        ...apt,
        dog: {
            id: dog.id,
            name: dog.name,
        },
    }));

    return (
        <CustomerLayout customer={customer}>
            {/* Breadcrumb */}
            <nav className="mb-6 flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link
                            href="/my/dogs"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            My Dogs
                        </Link>
                    </li>
                    <li className="text-sm text-gray-500">/</li>
                    <li className="text-sm font-medium text-gray-900">
                        {dog.name}
                    </li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Sidebar - Dog Info */}
                <div className="lg:col-span-1">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="px-6 py-5">
                            <div className="flex flex-col items-center text-center">
                                {/* Dog Photo Upload */}
                                <DogPhotoUpload dog={dog} size="lg" />

                                {/* Dog Name & Size */}
                                <h1 className="mt-4 text-2xl font-bold text-gray-900">
                                    {dog.name}
                                </h1>
                                <span
                                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${sizeBadge.className}`}
                                >
                                    {sizeBadge.label}
                                </span>
                            </div>

                            {/* Dog Details */}
                            <div className="mt-6 space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Breed
                                    </h3>
                                    <p className="mt-1 text-base text-gray-900">
                                        {dog.breed}
                                    </p>
                                </div>

                                {dog.special_notes && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Special Notes
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-700">
                                            {dog.special_notes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="mt-6 w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
                            >
                                <PencilIcon
                                    className="mr-2 inline size-4"
                                    aria-hidden
                                />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content - Appointment History */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Appointment History
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            All appointments for {dog.name}
                        </p>
                    </div>

                    {appointmentsWithDog.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {appointmentsWithDog.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    showActions={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                            <HeartIcon
                                className="mx-auto size-12 text-gray-400"
                                aria-hidden
                            />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                No appointments yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {dog.name} hasn't had any grooming appointments
                                yet.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/booking/create"
                                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                                >
                                    Book First Appointment
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Dog Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500/75 transition-opacity"
                            onClick={() => setShowEditModal(false)}
                        />
                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon className="size-6" aria-hidden />
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:size-10">
                                    <PencilIcon
                                        className="size-6 text-primary-600"
                                        aria-hidden
                                    />
                                </div>
                                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Edit {dog.name}'s Profile
                                    </h3>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-6 space-y-4"
                                    >
                                        {/* Name */}
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Breed */}
                                        <BreedSelector
                                            value={data.breed}
                                            onChange={(breed) =>
                                                setData("breed", breed)
                                            }
                                            error={errors.breed}
                                            label="Breed"
                                            required
                                        />

                                        {/* Size */}
                                        <div>
                                            <label
                                                htmlFor="size"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Size *
                                            </label>
                                            <select
                                                id="size"
                                                value={data.size}
                                                onChange={(e) =>
                                                    setData(
                                                        "size",
                                                        e.target.value as
                                                            | "small"
                                                            | "medium"
                                                            | "large",
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                required
                                            >
                                                <option value="small">
                                                    Small
                                                </option>
                                                <option value="medium">
                                                    Medium
                                                </option>
                                                <option value="large">
                                                    Large
                                                </option>
                                            </select>
                                            {errors.size && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.size}
                                                </p>
                                            )}
                                        </div>

                                        {/* Special Notes */}
                                        <div>
                                            <label
                                                htmlFor="special_notes"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Special Notes (Optional)
                                            </label>
                                            <textarea
                                                id="special_notes"
                                                rows={3}
                                                value={data.special_notes}
                                                onChange={(e) =>
                                                    setData(
                                                        "special_notes",
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                placeholder="Any special needs or notes..."
                                            />
                                            {errors.special_notes && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.special_notes}
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50 sm:w-auto"
                                            >
                                                {processing
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowEditModal(false)
                                                }
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
