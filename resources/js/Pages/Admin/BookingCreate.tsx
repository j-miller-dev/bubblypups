import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import BreedSelector from "@/Components/ui/BreedSelector";
import Toast from "@/Components/ui/Toast";

interface Service {
    id: number;
    name: string;
    description: string;
    emoji: string;
    base_price: number;
    duration_minutes: number;
}

interface Dog {
    id: number;
    name: string;
    breed: string;
    size: string;
    customer: {
        id: number;
        name: string;
        phone: string;
        email: string;
    };
    display: string;
}

interface Props {
    services: Service[];
}

function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function StepHeader({ num, label }: { num: number; label: string }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display font-extrabold text-sm text-brand-600">
                {num}
            </div>
            <p className="font-display font-extrabold text-gray-900">{label}</p>
        </div>
    );
}

export default function BookingCreate({ services }: Props) {
    const { data, setData, processing, errors, reset, clearErrors } = useForm({
        dog_id: null as number | null,
        new_customer: { name: "", email: "", phone: "" },
        new_dog: {
            name: "",
            breed: "",
            size: "medium" as "small" | "medium" | "large",
            special_notes: "",
        },
        service_id: null as number | null,
        appointment_date: "",
        appointment_time: "",
        status: "confirmed" as "confirmed" | "waiting_on_client",
        notes: "",
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Dog[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [existingAppointments, setExistingAppointments] = useState<
        { time: string; dog_name: string; service: string; duration: number; status: string }[]
    >([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [days, setDays] = useState<
        { date: string; isToday?: boolean; isCurrentMonth?: boolean; isSelected?: boolean }[]
    >([]);

    const todayStr = formatDate(new Date());

    // Dog search with debounce
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }
        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(`/admin/dogs/search?query=${encodeURIComponent(searchQuery)}`);
                const result = await response.json();
                setSearchResults(result.dogs || []);
            } catch {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Generate calendar grid
    useEffect(() => {
        const y = viewDate.getFullYear();
        const m = viewDate.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const mondayFirstOffset = (firstDay + 6) % 7;
        const daysInPrevMonth = new Date(y, m, 0).getDate();
        const daysInThisMonth = new Date(y, m + 1, 0).getDate();

        const grid: typeof days = [];

        for (let i = mondayFirstOffset; i > 0; i--) {
            const d = new Date(y, m - 1, daysInPrevMonth - i + 1);
            const dateStr = formatDate(d);
            grid.push({ date: dateStr, isCurrentMonth: false, isToday: dateStr === todayStr, isSelected: dateStr === selectedDate });
        }
        for (let day = 1; day <= daysInThisMonth; day++) {
            const d = new Date(y, m, day);
            const dateStr = formatDate(d);
            grid.push({ date: dateStr, isCurrentMonth: true, isToday: dateStr === todayStr, isSelected: dateStr === selectedDate });
        }
        const remainder = grid.length % 7;
        const trailing = remainder === 0 ? 0 : 7 - remainder;
        for (let i = 1; i <= trailing; i++) {
            const d = new Date(y, m + 1, i);
            const dateStr = formatDate(d);
            grid.push({ date: dateStr, isCurrentMonth: false, isToday: dateStr === todayStr, isSelected: dateStr === selectedDate });
        }
        setDays(grid);
    }, [viewDate, selectedDate, todayStr]);

    // Fetch available slots when date changes
    useEffect(() => {
        if (!selectedDate) return;
        let ignore = false;
        setIsLoadingSlots(true);
        fetch(`/admin/appointments/available-slots?date=${selectedDate}`)
            .then((r) => r.json())
            .then((result) => {
                if (!ignore) {
                    setAvailableSlots(result.slots || []);
                    setExistingAppointments(result.existing_appointments || []);
                }
            })
            .catch(() => {
                if (!ignore) { setAvailableSlots([]); setExistingAppointments([]); }
            })
            .finally(() => { if (!ignore) setIsLoadingSlots(false); });
        return () => { ignore = true; };
    }, [selectedDate]);

    const handleDogSelect = (dog: Dog) => {
        setSelectedDog(dog);
        setData("dog_id", dog.id);
        setSearchQuery(dog.display);
        setSearchResults([]);
        setShowNewCustomerForm(false);
    };

    const handleNewCustomer = () => {
        setShowNewCustomerForm(true);
        setSelectedDog(null);
        setData("dog_id", null);
        setSearchQuery("Creating new customer...");
        setSearchResults([]);
    };

    const handleDateSelect = (date: string, isCurrentMonth: boolean) => {
        setSelectedDate(date);
        setSelectedTime("");
        setAvailableSlots([]);
        setData("appointment_date", date);
        setData("appointment_time", "");
        if (!isCurrentMonth) {
            const [yy, mm] = date.slice(0, 7).split("-").map((v) => parseInt(v, 10));
            setViewDate(new Date(yy, (mm ?? 1) - 1, 1));
        }
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setData("appointment_time", time);
    };

    const handleSubmit = (status: "confirmed" | "waiting_on_client") => {
        const submissionData: any = {
            service_id: data.service_id,
            appointment_date: data.appointment_date,
            appointment_time: data.appointment_time,
            status,
            notes: data.notes,
        };
        if (showNewCustomerForm) {
            submissionData.new_customer = data.new_customer;
            submissionData.new_dog = data.new_dog;
        } else {
            submissionData.dog_id = data.dog_id;
        }
        router.post(route("admin.appointments.store"), submissionData, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedDog(null);
                setSearchQuery("");
                setSelectedDate("");
                setSelectedTime("");
                setShowNewCustomerForm(false);
                clearErrors();
            },
        });
    };

    const canSubmit =
        !processing &&
        (!!data.dog_id || showNewCustomerForm) &&
        !!data.service_id &&
        !!selectedDate &&
        !!selectedTime;

    return (
        <AdminLayout>
            <Toast />

            {/* Header */}
            <div className="mb-8">
                <h2 className="!text-2xl md:!text-3xl text-gray-950">
                    Create <span className="text-brand-500">Booking</span>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Book an appointment for an existing or new customer.
                </p>
            </div>

            {/* Error summary */}
            {Object.keys(errors).length > 0 && (
                <div className="mb-6 rounded-card border border-red-200 bg-red-50 px-5 py-4">
                    <p className="font-display font-extrabold text-sm text-red-800 mb-2">
                        Please fix the following errors:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                        {Object.entries(errors).map(([key, value]) => (
                            <li key={key}>{value as string}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="space-y-6">
                {/* Step 1: Dog / Customer */}
                <div className="card p-6">
                    <StepHeader num={1} label="Select Dog / Customer" />

                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <label htmlFor="dog-search" className="label">
                                Search by dog name, owner name, or phone
                            </label>
                            <input
                                id="dog-search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Type to search…"
                                className="input"
                                disabled={showNewCustomerForm}
                            />
                            {isSearching && (
                                <p className="mt-1.5 text-xs text-gray-400">Searching…</p>
                            )}
                            {searchResults.length > 0 && (
                                <div className="absolute z-20 mt-1 w-full overflow-auto rounded-card border border-gray-100 bg-white shadow-lg max-h-60">
                                    {searchResults.map((dog) => (
                                        <button
                                            key={dog.id}
                                            type="button"
                                            onClick={() => handleDogSelect(dog)}
                                            className="w-full px-4 py-2.5 text-left hover:bg-brand-50 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <p className="font-display font-extrabold text-sm text-gray-900">
                                                {dog.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {dog.customer.name} · {dog.customer.phone}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-gray-100" />
                            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">or</span>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <button
                            type="button"
                            onClick={handleNewCustomer}
                            disabled={showNewCustomerForm}
                            className="btn-outline w-full justify-center disabled:opacity-50"
                        >
                            <UserPlusIcon className="size-4" />
                            Create New Customer &amp; Dog
                        </button>

                        {selectedDog && (
                            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                                <CheckCircleIcon className="size-4 text-green-500 shrink-0" />
                                <p className="text-sm font-display font-extrabold text-green-800">
                                    {selectedDog.name} ({selectedDog.customer.name})
                                </p>
                            </div>
                        )}

                        {errors.dog_id && (
                            <p className="text-sm text-red-600">{errors.dog_id}</p>
                        )}
                    </div>

                    {/* New Customer Form */}
                    {showNewCustomerForm && (
                        <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-5 space-y-5">
                            <p className="font-display font-extrabold text-gray-900 text-sm">
                                New Customer
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Full Name</label>
                                    <input
                                        type="text"
                                        value={data.new_customer.name}
                                        onChange={(e) => setData("new_customer", { ...data.new_customer, name: e.target.value })}
                                        className="input"
                                    />
                                    {errors["new_customer.name"] && <p className="mt-1 text-sm text-red-600">{errors["new_customer.name"]}</p>}
                                </div>
                                <div>
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        value={data.new_customer.email}
                                        onChange={(e) => setData("new_customer", { ...data.new_customer, email: e.target.value })}
                                        className="input"
                                    />
                                    {errors["new_customer.email"] && <p className="mt-1 text-sm text-red-600">{errors["new_customer.email"]}</p>}
                                </div>
                                <div>
                                    <label className="label">Phone</label>
                                    <input
                                        type="tel"
                                        value={data.new_customer.phone}
                                        onChange={(e) => setData("new_customer", { ...data.new_customer, phone: e.target.value })}
                                        className="input"
                                    />
                                    {errors["new_customer.phone"] && <p className="mt-1 text-sm text-red-600">{errors["new_customer.phone"]}</p>}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100" />
                            <p className="font-display font-extrabold text-gray-900 text-sm">New Dog</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Dog Name</label>
                                    <input
                                        type="text"
                                        value={data.new_dog.name}
                                        onChange={(e) => setData("new_dog", { ...data.new_dog, name: e.target.value })}
                                        className="input"
                                    />
                                    {errors["new_dog.name"] && <p className="mt-1 text-sm text-red-600">{errors["new_dog.name"]}</p>}
                                </div>
                                <BreedSelector
                                    value={data.new_dog.breed}
                                    onChange={(breed) => setData("new_dog", { ...data.new_dog, breed })}
                                    error={errors["new_dog.breed"]}
                                    required
                                />
                                <div>
                                    <label className="label">Size</label>
                                    <select
                                        value={data.new_dog.size}
                                        onChange={(e) => setData("new_dog", { ...data.new_dog, size: e.target.value as typeof data.new_dog.size })}
                                        className="input"
                                    >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                    {errors["new_dog.size"] && <p className="mt-1 text-sm text-red-600">{errors["new_dog.size"]}</p>}
                                </div>
                                <div>
                                    <label className="label">
                                        Special Notes{" "}
                                        <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.new_dog.special_notes}
                                        onChange={(e) => setData("new_dog", { ...data.new_dog, special_notes: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step 2: Service */}
                <div className="card p-6">
                    <StepHeader num={2} label="Select Service" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {services.map((service) => {
                            const selected = data.service_id === service.id;
                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => setData("service_id", service.id)}
                                    className={[
                                        "text-left rounded-card border-2 p-4 transition-all",
                                        selected
                                            ? "border-brand-400 bg-brand-50 ring-2 ring-brand-200"
                                            : "border-gray-100 bg-white hover:border-brand-200 hover:bg-brand-50/50",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl shrink-0">{service.emoji}</span>
                                        <div className="min-w-0">
                                            <p className="font-display font-extrabold text-gray-900 text-sm">
                                                {service.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {service.description}
                                            </p>
                                            <p className="text-xs text-brand-500 font-display font-extrabold mt-1.5">
                                                ${service.base_price} · {service.duration_minutes} min
                                            </p>
                                        </div>
                                        {selected && (
                                            <CheckCircleIcon className="size-4 text-brand-400 shrink-0 ml-auto" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {errors.service_id && (
                        <p className="mt-2 text-sm text-red-600">{errors.service_id}</p>
                    )}
                </div>

                {/* Step 3: Date & Time */}
                <div className="card p-6">
                    <StepHeader num={3} label="Select Date &amp; Time" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Calendar */}
                        <div>
                            <p className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400 mb-3">
                                Date
                            </p>

                            {/* Month nav */}
                            <div className="flex items-center mb-4">
                                <button
                                    type="button"
                                    onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                                    className="-m-1.5 rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="sr-only">Previous month</span>
                                    <ChevronLeftIcon aria-hidden className="size-5" />
                                </button>
                                <div className="flex-1 text-center text-sm font-display font-extrabold text-gray-900">
                                    {viewDate.toLocaleString("en-AU", { month: "long", year: "numeric" })}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                                    className="-m-1.5 rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="sr-only">Next month</span>
                                    <ChevronRightIcon aria-hidden className="size-5" />
                                </button>
                            </div>

                            {/* Day headers */}
                            <div className="grid grid-cols-7 text-center text-xs font-display font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                                    <div key={i}>{d}</div>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="isolate grid grid-cols-7 gap-px rounded-card bg-gray-100 text-sm shadow-sm overflow-hidden">
                                {days.map((day) => (
                                    <button
                                        key={day.date}
                                        type="button"
                                        disabled={day.date < todayStr}
                                        onClick={() => handleDateSelect(day.date, day.isCurrentMonth ?? false)}
                                        data-is-today={day.date === todayStr ? "" : undefined}
                                        data-is-selected={day.isSelected ? "" : undefined}
                                        data-is-current-month={day.isCurrentMonth ? "" : undefined}
                                        data-is-past={day.date < todayStr ? "" : undefined}
                                        className="group py-1.5 not-data-is-current-month:bg-gray-50 not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-400 first:rounded-tl-card last:rounded-br-card hover:bg-gray-100 focus:z-10 data-is-current-month:bg-white not-data-is-selected:data-is-current-month:not-data-is-today:text-gray-900 data-is-current-month:hover:bg-gray-50 data-is-selected:font-semibold data-is-selected:text-white data-is-today:font-semibold data-is-today:not-data-is-selected:text-brand-500 data-is-today:hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-50 nth-36:rounded-bl-card nth-7:rounded-tr-card"
                                    >
                                        <time
                                            dateTime={day.date}
                                            className="mx-auto flex size-7 items-center justify-center rounded-full in-data-is-selected:bg-brand-500 in-data-is-selected:text-white"
                                        >
                                            {day.date.split("-").pop()?.replace(/^0/, "")}
                                        </time>
                                    </button>
                                ))}
                            </div>

                            {errors.appointment_date && (
                                <p className="mt-2 text-sm text-red-600">{errors.appointment_date}</p>
                            )}
                        </div>

                        {/* Time Slots */}
                        <div>
                            <p className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400 mb-3">
                                Time
                            </p>

                            {!selectedDate && (
                                <p className="text-sm text-gray-400 py-4">Select a date first</p>
                            )}

                            {selectedDate && isLoadingSlots && (
                                <p className="text-sm text-gray-400 py-4">Loading available times…</p>
                            )}

                            {selectedDate && !isLoadingSlots && availableSlots.length === 0 && (
                                <p className="text-sm text-gray-400 py-4">No available times for this date</p>
                            )}

                            {selectedDate && !isLoadingSlots && (
                                <div className="space-y-4">
                                    {availableSlots.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                                            {availableSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => handleTimeSelect(slot)}
                                                    className={[
                                                        "rounded-button px-3 py-2 text-sm font-display font-extrabold border transition-colors",
                                                        selectedTime === slot
                                                            ? "bg-brand-500 text-white border-brand-500"
                                                            : "bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-brand-50",
                                                    ].join(" ")}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Day's schedule */}
                                    <div className="rounded-lg border border-brand-100 bg-brand-50/50 p-3">
                                        <p className="text-xs font-display font-extrabold text-brand-700 mb-2">
                                            Day's Schedule
                                        </p>
                                        {existingAppointments.length > 0 ? (
                                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                                {existingAppointments.map((apt, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between rounded bg-white px-2 py-1.5 text-xs"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-display font-extrabold text-gray-900">
                                                                {apt.time}
                                                            </span>
                                                            <span className="text-gray-500">
                                                                {apt.dog_name}{" "}
                                                                <span className="text-gray-400">[{apt.service}]</span>
                                                            </span>
                                                        </div>
                                                        <span className="text-gray-400">{apt.duration}min</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">
                                                No other appointments this day
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {errors.appointment_time && (
                                <p className="mt-2 text-sm text-red-600">{errors.appointment_time}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Step 4: Notes & Confirm */}
                <div className="card p-6">
                    <StepHeader num={4} label="Notes &amp; Confirmation" />

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="notes" className="label">
                                Notes{" "}
                                <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                id="notes"
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData("notes", e.target.value)}
                                className="input"
                                placeholder="Add any notes about this appointment…"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-100 pt-5">
                            <button
                                type="button"
                                onClick={() => handleSubmit("waiting_on_client")}
                                disabled={!canSubmit}
                                className="inline-flex items-center justify-center gap-2 rounded-button px-5 py-2.5 text-sm font-display font-extrabold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Send to Client for Confirmation
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit("confirmed")}
                                disabled={!canSubmit}
                                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <CheckCircleIcon className="size-4" />
                                Confirm Appointment Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
