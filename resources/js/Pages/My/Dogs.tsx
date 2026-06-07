import { useState } from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import DogCard from "@/Components/Customer/DogCard";
import BreedSelector from "@/Components/ui/BreedSelector";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
            {/* Header */}
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <h2 className="!text-2xl md:!text-3xl text-gray-950">
                        My <span className="text-brand-500">Dogs</span>
                    </h2>
                    <p className="mt-1 text-gray-500">
                        Manage your pup profiles.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary !text-sm shrink-0"
                >
                    <PlusIcon className="size-4" aria-hidden />
                    Add Dog
                </button>
            </div>

            {/* Grid */}
            {dogs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dogs.map((dog) => (
                        <DogCard key={dog.id} dog={dog} showActions={true} />
                    ))}
                </div>
            ) : (
                <div className="rounded-card border-2 border-dashed border-gray-200 p-12 text-center">
                    <span className="text-4xl block">🐾</span>
                    <p className="mt-3 font-display font-extrabold text-gray-900 text-sm">
                        No dogs yet
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Add your first pup to get started.
                    </p>
                    <div className="mt-5">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary !text-sm !px-4 !py-2"
                        >
                            <PlusIcon className="size-4" />
                            Add Dog
                        </button>
                    </div>
                </div>
            )}

            {/* Add dog modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        />

                        {/* Panel */}
                        <div className="relative w-full max-w-md rounded-card bg-white p-6 shadow-xl">
                            {/* Close */}
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <XMarkIcon className="size-5" aria-hidden />
                            </button>

                            {/* Title */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-xl">
                                    🐾
                                </div>
                                <p className="font-display font-extrabold text-gray-900">
                                    Add New Dog
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="label">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="input"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <BreedSelector
                                    value={data.breed}
                                    onChange={(breed) =>
                                        setData("breed", breed)
                                    }
                                    error={errors.breed}
                                    label="Breed"
                                    required
                                />

                                <div>
                                    <label htmlFor="size" className="label">
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
                                        className="input"
                                        required
                                    >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                    {errors.size && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.size}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="special_notes"
                                        className="label"
                                    >
                                        Notes{" "}
                                        <span className="text-gray-400 font-normal">
                                            (optional)
                                        </span>
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
                                        className="input"
                                        placeholder="Allergies, behaviour, anything we should know..."
                                    />
                                    {errors.special_notes && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.special_notes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="btn-outline flex-1 justify-center"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-primary flex-1 justify-center disabled:opacity-50"
                                    >
                                        {processing ? "Adding…" : "Add Dog"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
