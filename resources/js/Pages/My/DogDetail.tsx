import { useState } from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import AppointmentCard from "@/Components/Customer/AppointmentCard";
import DogPhotoUpload from "@/Components/Customer/DogPhotoUpload";
import BreedSelector from "@/Components/ui/BreedSelector";
import { Link, useForm } from "@inertiajs/react";
import { PencilIcon, XMarkIcon, CalendarDaysIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";

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

const sizeBadges: Record<string, { badge: string; label: string }> = {
    small: { badge: "bg-blue-100 text-blue-700", label: "Small" },
    medium: { badge: "bg-purple-100 text-purple-700", label: "Medium" },
    large: { badge: "bg-orange-100 text-orange-700", label: "Large" },
};

export default function DogDetail({ customer, dog }: DogDetailProps) {
    const [showEditModal, setShowEditModal] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        name: dog.name,
        breed: dog.breed,
        size: dog.size as "small" | "medium" | "large",
        special_notes: dog.special_notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/my/dogs/${dog.id}`, {
            onSuccess: () => setShowEditModal(false),
        });
    };

    const sizeBadge = sizeBadges[dog.size] ?? sizeBadges.medium;

    const appointmentsWithDog = dog.appointments.map((apt) => ({
        ...apt,
        dog: { id: dog.id, name: dog.name },
    }));

    return (
        <CustomerLayout customer={customer}>
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
                <Link
                    href="/my/dogs"
                    className="flex items-center gap-1 text-gray-400 hover:text-brand-500 transition-colors font-display font-extrabold"
                >
                    <ChevronLeftIcon className="size-4" />
                    My Dogs
                </Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-600 font-display font-extrabold">
                    {dog.name}
                </span>
            </nav>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Sidebar - Dog Info */}
                <div className="lg:col-span-1">
                    <div className="card p-6 text-center">
                        {/* Photo */}
                        <div className="flex justify-center">
                            <DogPhotoUpload dog={dog} size="lg" />
                        </div>

                        {/* Name & size */}
                        <p className="mt-4 font-display font-extrabold text-gray-900 text-lg">
                            {dog.name}
                        </p>
                        <span
                            className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sizeBadge.badge}`}
                        >
                            {sizeBadge.label}
                        </span>

                        {/* Details */}
                        <div className="mt-6 space-y-3 border-t border-gray-100 pt-6 text-left">
                            <div>
                                <p className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
                                    Breed
                                </p>
                                <p className="mt-1 text-sm text-gray-700">
                                    {dog.breed}
                                </p>
                            </div>

                            {dog.special_notes && (
                                <div>
                                    <p className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
                                        Notes
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {dog.special_notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Edit button */}
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="btn-primary mt-6 w-full justify-center !text-sm !px-4 !py-2"
                        >
                            <PencilIcon className="size-4" aria-hidden />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Main Content - Appointment History */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <h2 className="!text-2xl md:!text-3xl text-gray-950">
                            Appointment{" "}
                            <span className="text-brand-500">History</span>
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            All appointments for {dog.name}
                        </p>
                    </div>

                    {appointmentsWithDog.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {appointmentsWithDog.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    showActions={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-card border-2 border-dashed border-gray-200 p-12 text-center">
                            <CalendarIcon
                                className="mx-auto size-10 text-gray-300"
                                aria-hidden
                            />
                            <p className="mt-3 font-display font-extrabold text-gray-900 text-sm">
                                No appointments yet
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {dog.name} hasn't had any grooming appointments
                                yet.
                            </p>
                            <div className="mt-5">
                                <Link
                                    href="/booking/create"
                                    className="btn-primary !text-sm !px-4 !py-2"
                                >
                                    <CalendarDaysIcon className="size-4" />
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
                    <div className="flex min-h-full items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
                            onClick={() => setShowEditModal(false)}
                        />

                        {/* Panel */}
                        <div className="relative w-full max-w-md rounded-card bg-white p-6 shadow-xl">
                            {/* Close */}
                            <button
                                onClick={() => setShowEditModal(false)}
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
                                    Edit {dog.name}'s Profile
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="edit-name" className="label">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-name"
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
                                    <label htmlFor="edit-size" className="label">
                                        Size *
                                    </label>
                                    <select
                                        id="edit-size"
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
                                        htmlFor="edit-notes"
                                        className="label"
                                    >
                                        Notes{" "}
                                        <span className="text-gray-400 font-normal">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        id="edit-notes"
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
                                        onClick={() => setShowEditModal(false)}
                                        className="btn-outline flex-1 justify-center"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-primary flex-1 justify-center disabled:opacity-50"
                                    >
                                        {processing ? "Saving…" : "Save Changes"}
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
