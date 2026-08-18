import AdminLayout from "@/Layouts/AdminLayout";
import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    XMarkIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { ClockIcon } from "@heroicons/react/20/solid";
import { ConfirmDialog } from "@/Components/ui/ConfirmDialog";

interface BusinessHour {
    id: number;
    day_of_week: string;
    is_open: boolean;
    open_time: string;
    close_time: string;
    slot_duration: number;
}

interface BlockedTime {
    id: number;
    start_datetime: string;
    end_datetime: string;
    reason: string | null;
}

interface AvailabilityProps {
    businessHours: BusinessHour[];
    blockedTimes: BlockedTime[];
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function Availability({
    businessHours,
    blockedTimes,
}: AvailabilityProps) {
    const { errors, flash } = usePage().props as any;
    const conflicts: {
        id: number;
        date: string;
        time: string;
        dog: string;
        owner: string;
    }[] = flash?.conflict ?? [];

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingDay, setEditingDay] = useState<BusinessHour | null>(null);
    const [editForm, setEditForm] = useState({
        is_open: true,
        open_time: "09:00",
        close_time: "17:00",
        slot_duration: 30,
    });

    const [blockForm, setBlockForm] = useState({
        start_datetime: "",
        end_datetime: "",
        reason: "",
    });

    const [showConflictDialog, setShowConflictDialog] = useState(false);

    useEffect(() => {
        if (conflicts.length > 0) {
            setShowConflictDialog(true);
        }
    }, [conflicts.length]);

    const handleEditDay = (day: BusinessHour) => {
        setEditingDay(day);
        setEditForm({
            is_open: day.is_open,
            open_time: day.open_time || "09:00",
            close_time: day.close_time || "17:00",
            slot_duration: day.slot_duration,
        });
    };

    const handleSaveHours = () => {
        if (!editingDay) return;
        router.patch(`/admin/business-hours/${editingDay.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => setEditingDay(null),
        });
    };

    const handleAddBlockedTime = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/admin/blocked-times", blockForm, {
            preserveScroll: true,
            onSuccess: () =>
                setBlockForm({
                    start_datetime: "",
                    end_datetime: "",
                    reason: "",
                }),
        });
    };

    const handleDeleteBlockedTime = (id: number) => {
        setDeleteId(id);
    };

    const handleForceBlock = () => {
        router.post(
            "/admin/blocked-times",
            { ...blockForm, force: true },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowConflictDialog(false);
                    setBlockForm({
                        start_datetime: "",
                        end_datetime: "",
                        reason: "",
                    });
                },
            },
        );
    };

    const handleConfirmDelete = () => {
        if (deleteId !== null) {
            router.delete(`/admin/blocked-times/${deleteId}`, {
                preserveScroll: true,
            });
        }
        setDeleteId(null);
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="!text-2xl md:!text-3xl text-gray-950">
                        My <span className="text-brand-500">Availability</span>
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your weekly hours and block time off.
                    </p>
                </div>

                {/* Weekly Hours */}
                <div className="card p-6 mb-6">
                    <p className="font-display font-extrabold text-gray-900 mb-5">
                        Weekly Business Hours
                    </p>
                    <div className="space-y-2">
                        {businessHours.map((day) => (
                            <div
                                key={day.id}
                                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                            >
                                <div className="flex items-center gap-4">
                                    <p className="w-28 font-display font-extrabold text-gray-900 capitalize">
                                        {day.day_of_week}
                                    </p>
                                    {day.is_open ? (
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                            <ClockIcon className="size-4 text-brand-400 shrink-0" />
                                            {day.open_time} – {day.close_time}
                                            <span className="ml-2 text-xs text-gray-400">
                                                ({day.slot_duration} min slots)
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-display font-extrabold bg-gray-200 text-gray-500">
                                            Closed
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleEditDay(day)}
                                    className="inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-sm font-display font-extrabold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
                                >
                                    <PencilIcon className="size-3.5" />
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blocked Times */}
                <div className="card p-6 mb-6">
                    <p className="font-display font-extrabold text-gray-900 mb-1">
                        Blocked Times
                    </p>
                    <p className="text-sm text-gray-500 mb-5">
                        Customers cannot book during these times.
                    </p>

                    {blockedTimes.length === 0 ? (
                        <p className="text-sm text-gray-400 font-display font-extrabold py-4 text-center">
                            No blocked times scheduled
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {blockedTimes.map((blocked) => (
                                <div
                                    key={blocked.id}
                                    className="flex items-start justify-between gap-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-display font-extrabold text-gray-900">
                                            {formatDate(
                                                blocked.start_datetime,
                                            )}
                                            {" — "}
                                            {formatDate(
                                                blocked.end_datetime,
                                            )}
                                        </p>
                                        {blocked.reason && (
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {blocked.reason}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDeleteBlockedTime(blocked.id)
                                        }
                                        className="shrink-0 rounded-button p-1.5 text-red-500 hover:bg-red-100 transition-colors"
                                        title="Remove"
                                    >
                                        <TrashIcon className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Blocked Time */}
                <div className="card p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <PlusIcon className="size-5 text-brand-400" />
                        <p className="font-display font-extrabold text-gray-900">
                            Block New Time
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mb-5">
                        Block holidays, vacations, or any time you're
                        unavailable.
                    </p>

                    {errors.blocked_time && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-700">
                                {errors.blocked_time}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleAddBlockedTime} className="space-y-4">
                        <div>
                            <label className="label">Start Date</label>
                            <input
                                type="date"
                                value={blockForm.start_datetime}
                                onChange={(e) =>
                                    setBlockForm({
                                        ...blockForm,
                                        start_datetime: e.target.value,
                                    })
                                }
                                required
                                className="input accent-[#e47bb9]"
                            />
                        </div>

                        <div>
                            <label className="label">End Date</label>
                            <input
                                type="date"
                                value={blockForm.end_datetime}
                                onChange={(e) =>
                                    setBlockForm({
                                        ...blockForm,
                                        end_datetime: e.target.value,
                                    })
                                }
                                required
                                className="input accent-[#e47bb9]"
                            />
                        </div>

                        <div>
                            <label className="label">
                                Reason{" "}
                                <span className="text-gray-400 font-normal">
                                    (optional)
                                </span>
                            </label>
                            <input
                                type="text"
                                value={blockForm.reason}
                                onChange={(e) =>
                                    setBlockForm({
                                        ...blockForm,
                                        reason: e.target.value,
                                    })
                                }
                                placeholder="e.g., Christmas Holiday, Vacation"
                                className="input"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full justify-center"
                        >
                            Block This Time
                        </button>
                    </form>
                </div>
            </div>

            {/* Edit Hours Modal */}
            {editingDay && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
                            onClick={() => setEditingDay(null)}
                        />
                        <div className="relative w-full max-w-sm rounded-card bg-white p-6 shadow-xl">
                            {/* Close */}
                            <button
                                onClick={() => setEditingDay(null)}
                                className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <XMarkIcon className="size-5" />
                            </button>

                            {/* Title */}
                            <p className="font-display font-extrabold text-gray-900 capitalize mb-6">
                                Edit {editingDay.day_of_week}
                            </p>

                            <div className="space-y-4">
                                {/* Open toggle */}
                                <div className="flex items-center gap-3">
                                    <input
                                        id="is_open"
                                        type="checkbox"
                                        checked={editForm.is_open}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                is_open: e.target.checked,
                                            })
                                        }
                                        className="size-4 rounded border-gray-300 text-brand-400 focus:ring-brand-400"
                                    />
                                    <label
                                        htmlFor="is_open"
                                        className="text-sm font-display font-extrabold text-gray-700"
                                    >
                                        Open on this day
                                    </label>
                                </div>

                                {editForm.is_open && (
                                    <>
                                        <div>
                                            <label className="label">
                                                Open Time
                                            </label>
                                            <input
                                                type="time"
                                                value={editForm.open_time}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        open_time:
                                                            e.target.value,
                                                    })
                                                }
                                                className="input"
                                            />
                                        </div>

                                        <div>
                                            <label className="label">
                                                Close Time
                                            </label>
                                            <input
                                                type="time"
                                                value={editForm.close_time}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        close_time:
                                                            e.target.value,
                                                    })
                                                }
                                                className="input"
                                            />
                                        </div>

                                        <div>
                                            <label className="label">
                                                Slot Duration (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                value={editForm.slot_duration}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        slot_duration: parseInt(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                                min="30"
                                                max="120"
                                                step="30"
                                                className="input"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setEditingDay(null)}
                                    className="btn-outline flex-1 justify-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveHours}
                                    className="btn-primary flex-1 justify-center"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Remove blocked time?"
                description="This will make the time available for customer bookings again."
                confirmLabel="Yes, remove"
                destructive
            />
            {showConflictDialog && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end sm:items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-gray-900/50"
                            onClick={() => setShowConflictDialog(false)}
                        />
                        <div
                            className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white p-6
  shadow-xl"
                        >
                            <div className="mb-4 flex justify-center sm:hidden">
                                <div className="h-1.5 w-12 rounded-full bg-gray-200" />
                            </div>
                            <p className="font-display font-extrabold text-gray-900 text-lg mb-1">
                                Appointments affected
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                These appointments fall within the blocked time.
                                Proceeding will cancel them and notify each
                                customer by email.
                            </p>
                            <ul className="mb-6 space-y-2">
                                {conflicts.map((c) => (
                                    <li
                                        key={c.id}
                                        className="flex items-center gap-3 rounded-lg bg-red-50
  border border-red-100 px-4 py-3"
                                    >
                                        <div>
                                            <p
                                                className="text-sm font-display font-extrabold
  text-gray-900"
                                            >
                                                {c.dog} — {c.owner}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {c.date} at {c.time}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col gap-3 sm:flex-row-reverse">
                                <button
                                    onClick={handleForceBlock}
                                    className="btn-primary w-full sm:w-auto justify-center"
                                >
                                    Cancel appointments & block time
                                </button>
                                <button
                                    onClick={() => setShowConflictDialog(false)}
                                    className="btn-outline w-full sm:w-auto justify-center"
                                >
                                    Go back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
