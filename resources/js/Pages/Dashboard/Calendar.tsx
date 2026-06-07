import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout.tsx";
import { useState } from "react";
import { Appointment, BlockedTime, BusinessHours } from "@/types";
import WeekView from "./Components/Calendar/WeekView";
import DayView from "./Components/Calendar/DayView.tsx";
import MonthView from "./Components/Calendar/MonthView";
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

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="!text-2xl md:!text-3xl text-gray-950">
                        My{" "}
                        <span className="text-brand-500">Calendar</span>
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage appointments and your schedule.
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        className={`inline-flex items-center rounded-button px-3 py-2 text-sm font-display font-extrabold transition-colors ${
                            view === ViewEnum.WEEK
                                ? "bg-brand-500 text-white hover:bg-brand-400"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setView(ViewEnum.WEEK)}
                    >
                        Week
                    </button>
                    <button
                        type="button"
                        onClick={() => setView(ViewEnum.DAY)}
                        className={`inline-flex items-center rounded-button px-3 py-2 text-sm font-display font-extrabold transition-colors ${
                            view === ViewEnum.DAY
                                ? "bg-brand-500 text-white hover:bg-brand-400"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        Day
                    </button>
                    <button
                        type="button"
                        className={`inline-flex items-center rounded-button px-3 py-2 text-sm font-display font-extrabold transition-colors ${
                            view === ViewEnum.MONTH
                                ? "bg-brand-500 text-white hover:bg-brand-400"
                                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setView(ViewEnum.MONTH)}
                    >
                        Month
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
                    <MonthView
                        appointments={appointments}
                        businessHours={businessHours}
                        blockedTimes={blockedTimes}
                        currentDate={currentDate}
                        onDateChange={setCurrentDate}
                        onAppointmentClick={handleAppointmentClick}
                        onSwitchToDayView={(date) => {
                            setCurrentDate(date);
                            setView(ViewEnum.DAY);
                        }}
                    />
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
