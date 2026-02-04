import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout.tsx";
import { useState } from "react";
import { Appointment, BlockedTime, BusinessHours } from "@/types";
import WeekView from "./Components/Calendar/WeekView";
import DayView from "./Components/Calendar/DayView.tsx";
import AppointmentDetailModal from "@/Components/AppointmentDetailModal";
import RescheduleModal from "@/Components/RescheduleModal";

interface CalendarProps {
    appointments: Appointment[];
    businessHours: BusinessHours[];
    blockedTimes: BlockedTime[];
    initialDate: string;
}

// Define available views....
const ViewEnum = {
    WEEK: "week",
    DAY: "day",
    MONTH: "month",
};

// Transform Appointment to RescheduleModal format
function toRescheduleFormat(apt: Appointment) {
    return {
        id: apt.id,
        date: apt.appointment_date,
        time: apt.appointment_time,
        dog: apt.dog?.name ?? "Unknown",
        owner: apt.dog?.customer?.name ?? "Unknown",
        breed: apt.dog?.breed,
        photo_url: apt.dog?.photo_url,
        service: apt.service?.name,
        service_emoji: apt.service?.emoji,
        price: apt.service?.base_price,
    };
}

export default function Calendar({
    appointments,
    businessHours,
    blockedTimes,
    initialDate,
}: CalendarProps) {
    const [view, setView] = useState(ViewEnum.WEEK);
    const [currentDate, setCurrentDate] = useState(initialDate);

    // Modal state
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    // Handle appointment click from calendar
    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailModalOpen(true);
    };

    // Handle edit button from detail modal
    const handleEditAppointment = (appointment: Appointment) => {
        setIsDetailModalOpen(false);
        setSelectedAppointment(appointment);
        setIsRescheduleModalOpen(true);
    };

    // Close detail modal
    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedAppointment(null);
    };

    // Close reschedule modal
    const handleCloseRescheduleModal = () => {
        setIsRescheduleModalOpen(false);
        setSelectedAppointment(null);
    };

    return (
        <AdminLayout>
            <Head title="Calendar" />

            <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
                <h1 className="text-base font-semibold text-gray-900">
                    Calendar
                </h1>
                <div className="mt-3 flex sm:mt-0 sm:ml-4">
                    <button
                        type="button"
                        className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs ${
                            view === ViewEnum.WEEK
                                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                                : "bg-white text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setView(ViewEnum.WEEK)}
                    >
                        Week View
                    </button>
                    <button
                        type="button"
                        onClick={() => setView(ViewEnum.DAY)}
                        className={`ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs ${
                            view === ViewEnum.DAY
                                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                                : "bg-white text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Day View
                    </button>
                    <button
                        type="button"
                        className={`ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs ${
                            view === ViewEnum.MONTH
                                ? "bg-indigo-600 text-white hover:bg-indigo-500"
                                : "bg-white text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setView(ViewEnum.MONTH)}
                    >
                        Month View
                    </button>
                </div>
            </div>
            <div className="mt-4 w-full">
                {view === ViewEnum.WEEK && (
                    <WeekView
                        appointments={appointments}
                        businessHours={businessHours}
                        blockedTimes={blockedTimes}
                        currentDate={currentDate}
                        onDateChange={setCurrentDate}
                        onAppointmentClick={handleAppointmentClick}
                    />
                )}
                {view === ViewEnum.DAY && (
                    <DayView
                        appointments={appointments}
                        businessHours={businessHours}
                        blockedTimes={blockedTimes}
                        currentDate={currentDate}
                        onDateChange={setCurrentDate}
                        onAppointmentClick={handleAppointmentClick}
                    />
                )}
                {view === ViewEnum.MONTH && (
                    <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                        <p className="text-gray-500">Month View - Coming Soon</p>
                    </div>
                )}
            </div>

            {/* Appointment Detail Modal */}
            <AppointmentDetailModal
                appointment={selectedAppointment}
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                onEdit={handleEditAppointment}
            />

            {/* Reschedule Modal */}
            <RescheduleModal
                appointment={
                    selectedAppointment
                        ? toRescheduleFormat(selectedAppointment)
                        : null
                }
                isOpen={isRescheduleModalOpen}
                onClose={handleCloseRescheduleModal}
            />
        </AdminLayout>
    );
}
