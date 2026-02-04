import React, { useState } from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import DogCard from "@/Components/Customer/DogCard";
import BreedSelector from "@/Components/ui/BreedSelector";
import { HeartIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useForm } from "@inertiajs/react";

interface DogsProps {
    customer: {
        id: number;
        name: string;
        email: string;
    };
    dogs: Array<{
        id: number;
        name: string;
        breed: string;
        size: string;
        special_notes?: string;
        photo_url?: string;
    }>;
}

export default function Dogs({ customer, dogs }: DogsProps) {
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        breed: "",
        size: "medium" as "small" | "medium" | "large",
        special_notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/my/dogs", {
            onSuccess: () => {
                reset();
                setShowAddModal(false);
            },
        });
    };

    return (
        <CustomerLayout customer={customer}>
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Dogs
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage your dog profiles and information
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                >
                    <PlusIcon className="mr-2 size-5" aria-hidden />
                    Add New Dog
                </button>
            </div>

            {/* Dogs Grid */}
            {dogs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {dogs.map((dog) => (
                        <DogCard key={dog.id} dog={dog} showActions={true} />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <HeartIcon
                        className="mx-auto size-12 text-gray-400"
                        aria-hidden
                    />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                        No dogs registered
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Get started by adding your first furry friend.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                        >
                            <PlusIcon className="mr-2 size-5" aria-hidden />
                            Add New Dog
                        </button>
                    </div>
                </div>
            )}

            {/* Add Dog Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500/75 transition-opacity"
                            onClick={() => setShowAddModal(false)}
                        />
                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <XMarkIcon className="size-6" aria-hidden />
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:size-10">
                                    <HeartIcon
                                        className="size-6 text-primary-600"
                                        aria-hidden
                                    />
                                </div>
                                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Add New Dog
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
                                                placeholder="Any special needs or notes about your dog..."
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
                                                    ? "Adding..."
                                                    : "Add Dog"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowAddModal(false)
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
