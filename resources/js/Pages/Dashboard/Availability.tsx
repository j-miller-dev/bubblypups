import AdminLayout from "@/Layouts/AdminLayout";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

// defining what a BusinessHour looks like
interface BusinessHour {
    id: number;
    day_of_week: string;
    is_open: boolean;
    open_time: string;
    close_time: string;
    slot_duration: number;
}

// defining what a BlockedTime object looks like
interface BlockedTime {
    id: number;
    start_datetime: string;
    end_datetime: string;
    reason: string | null;
}

// defining what props this page recieves from the backend
interface AvailabilityProps {
    businessHours: BusinessHour[];
    blockedTimes: BlockedTime[];
}

export default function Availability({
    businessHours,
    blockedTimes,
}: AvailabilityProps) {
    // Get errors from Inertia
    const { errors } = usePage().props as any;

    // State for editing a specific day's hours
    const [editingDay, setEditingDay] = useState<BusinessHour | null>(null);

    // State for the form when editing hours
    const [editForm, setEditForm] = useState({
        is_open: true,
        open_time: "09:00",
        close_time: "17:00",
        slot_duration: 30,
    });

    // State for blocking new times
    const [blockForm, setBlockForm] = useState({
        start_datetime: "",
        end_datetime: "",
        reason: "",
    });
    // Handler: When user clicks "Edit" on a day
    const handleEditDay = (day: BusinessHour) => {
        setEditingDay(day);
        setEditForm({
            is_open: day.is_open,
            open_time: day.open_time || "09:00",
            close_time: day.close_time || "17:00",
            slot_duration: day.slot_duration,
        });
    };

    // Handler: When user saves edited hours
    const handleSaveHours = () => {
        if (!editingDay) return;

        router.patch(`/admin/business-hours/${editingDay.id}`, editForm, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingDay(null); // Close the edit modal
            },
        });
    };

    // Handler: When user cancels editing
    const handleCancelEdit = () => {
        setEditingDay(null);
    };

    // Handler: When user submits a new blocked time
    const handleAddBlockedTime = (e: React.FormEvent) => {
        e.preventDefault();

        router.post("/admin/blocked-times", blockForm, {
            preserveScroll: true,
            onSuccess: () => {
                // Clear the form
                setBlockForm({
                    start_datetime: "",
                    end_datetime: "",
                    reason: "",
                });
            },
        });
    };

    // Handler: When user deletes a blocked time
    const handleDeleteBlockedTime = (id: number) => {
        if (confirm("Are you sure you want to remove this blocked time?")) {
            router.delete(`/admin/blocked-times/${id}`, {
                preserveScroll: true,
            });
        }
    };
    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6 text-gray-900">
                    My Availability
                </h1>

                {/* SECTION 1: Weekly Business Hours */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        📅 Weekly Business Hours
                    </h2>

                    <div className="space-y-3">
                        {businessHours.map((day) => (
                            <div
                                key={day.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                            >
                                <div className="flex-1">
                                    <span className="font-medium text-gray-900 capitalize">
                                        {day.day_of_week}
                                    </span>
                                    <span className="text-gray-600 ml-4">
                                        {day.is_open
                                            ? `${day.open_time} - ${day.close_time}`
                                            : "Closed"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleEditDay(day)}
                                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                {/* SECTION 2: Edit Modal */}
                {editingDay && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                                Edit {editingDay.day_of_week}
                            </h3>

                            <div className="space-y-4">
                                {/* Is Open Toggle */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={editForm.is_open}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    is_open: e.target.checked,
                                                })
                                            }
                                            className="rounded border-gray-300 text-indigo-600 mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Open on this day
                                        </span>
                                    </label>
                                </div>

                                {/* Show time fields only if open */}
                                {editForm.is_open && (
                                    <>
                                        {/* Open Time */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>

                                        {/* Close Time */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>

                                        {/* Slot Duration */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Appointment Slot Duration
                                                (minutes)
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
                                                className="w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Modal Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveHours}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* SECTION 3: Blocked Times List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            🚫 Blocked Times
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            These are the blocked times that you have locked in.
                            Customers or yourself won't be able to make bookings
                            during these times.
                        </p>
                    </>

                    {blockedTimes.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">
                            No blocked times scheduled
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {blockedTimes.map((blocked) => (
                                <div
                                    key={blocked.id}
                                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(
                                                blocked.start_datetime,
                                            ).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                            {" - "}
                                            {new Date(
                                                blocked.end_datetime,
                                            ).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </div>
                                        {blocked.reason && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                {blocked.reason}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDeleteBlockedTime(blocked.id)
                                        }
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* SECTION 4: Add New Blocked Time Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        ➕ Block New Time
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Use this to block out holidays, vacations, or any time
                        you're unavailable
                    </p>

                    {/* Error Message */}
                    {errors.blocked_time && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">
                                ⚠️ {errors.blocked_time}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleAddBlockedTime} className="space-y-4">
                        {/* Start Date/Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={blockForm.start_datetime}
                                onChange={(e) =>
                                    setBlockForm({
                                        ...blockForm,
                                        start_datetime: e.target.value,
                                    })
                                }
                                required
                                className="w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        {/* End Date/Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={blockForm.end_datetime}
                                onChange={(e) =>
                                    setBlockForm({
                                        ...blockForm,
                                        end_datetime: e.target.value,
                                    })
                                }
                                required
                                className="w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason (optional)
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
                                className="w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                        >
                            Block Time
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
