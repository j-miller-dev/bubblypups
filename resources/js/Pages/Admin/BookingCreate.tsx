import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/Components/ui/Button";
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

// Helper function to format date as YYYY-MM-DD
function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function BookingCreate({ services }: Props) {
    // Form state
    const { data, setData, processing, errors, reset, setError, clearErrors } =
        useForm({
            dog_id: null as number | null,
            new_customer: {
                name: "",
                email: "",
                phone: "",
            },
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

    // Dog search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Dog[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

    // Calendar and time selection state
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [existingAppointments, setExistingAppointments] = useState<
        {
            time: string;
            dog_name: string;
            service: string;
            duration: number;
            status: string;
        }[]
    >([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [days, setDays] = useState<
        {
            date: string;
            isToday?: boolean;
            isCurrentMonth?: boolean;
            isSelected?: boolean;
        }[]
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
                const response = await fetch(
                    `/admin/dogs/search?query=${encodeURIComponent(searchQuery)}`,
                );
                const result = await response.json();
                setSearchResults(result.dogs || []);
            } catch (error) {
                console.error("Failed to search dogs:", error);
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

        const firstOfMonth = new Date(y, m, 1);
        const firstDay = firstOfMonth.getDay();
        const mondayFirstOffset = (firstDay + 6) % 7;

        const daysInPrevMonth = new Date(y, m, 0).getDate();
        const daysInThisMonth = new Date(y, m + 1, 0).getDate();

        const grid: {
            date: string;
            isToday?: boolean;
            isCurrentMonth?: boolean;
            isSelected?: boolean;
        }[] = [];

        // Leading days from previous month
        for (let i = mondayFirstOffset; i > 0; i--) {
            const d = new Date(y, m - 1, daysInPrevMonth - i + 1);
            const dateStr = formatDate(d);
            grid.push({
                date: dateStr,
                isCurrentMonth: false,
                isToday: dateStr === todayStr,
                isSelected: dateStr === selectedDate,
            });
        }

        // Current month days
        for (let day = 1; day <= daysInThisMonth; day++) {
            const d = new Date(y, m, day);
            const dateStr = formatDate(d);
            grid.push({
                date: dateStr,
                isCurrentMonth: true,
                isToday: dateStr === todayStr,
                isSelected: dateStr === selectedDate,
            });
        }

        // Trailing days from next month
        const remainder = grid.length % 7;
        const trailing = remainder === 0 ? 0 : 7 - remainder;
        for (let i = 1; i <= trailing; i++) {
            const d = new Date(y, m + 1, i);
            const dateStr = formatDate(d);
            grid.push({
                date: dateStr,
                isCurrentMonth: false,
                isToday: dateStr === todayStr,
                isSelected: dateStr === selectedDate,
            });
        }

        setDays(grid);
    }, [viewDate, selectedDate, todayStr]);

    // Fetch available slots when date changes
    useEffect(() => {
        if (!selectedDate) {
            return;
        }

        let ignore = false;

        const fetchAvailableSlots = async () => {
            setIsLoadingSlots(true);
            try {
                const response = await fetch(
                    `/admin/appointments/available-slots?date=${selectedDate}`,
                );
                const result = await response.json();
                if (!ignore) {
                    setAvailableSlots(result.slots || []);
                    setExistingAppointments(result.existing_appointments || []);
                }
            } catch (error) {
                console.error("Failed to fetch available slots:", error);
                if (!ignore) {
                    setAvailableSlots([]);
                    setExistingAppointments([]);
                }
            } finally {
                if (!ignore) {
                    setIsLoadingSlots(false);
                }
            }
        };

        fetchAvailableSlots();

        return () => {
            ignore = true;
        };
    }, [selectedDate]);

    // Handle dog selection
    const handleDogSelect = (dog: Dog) => {
        setSelectedDog(dog);
        setData("dog_id", dog.id);
        setSearchQuery(dog.display);
        setSearchResults([]);
        setShowNewCustomerForm(false);
    };

    // Handle new customer selection
    const handleNewCustomer = () => {
        setShowNewCustomerForm(true);
        setSelectedDog(null);
        setData("dog_id", null);
        setSearchQuery("Creating new customer...");
        setSearchResults([]);
    };

    // Handle date selection
    const handleDateSelect = (date: string, isCurrentMonth: boolean) => {
        setSelectedDate(date);
        setSelectedTime("");
        setAvailableSlots([]);
        setData("appointment_date", date);
        setData("appointment_time", "");

        if (!isCurrentMonth) {
            const [yy, mm] = date
                .slice(0, 7)
                .split("-")
                .map((v) => parseInt(v, 10));
            setViewDate(new Date(yy, (mm ?? 1) - 1, 1));
        }
    };

    // Handle time selection
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setData("appointment_time", time);
    };

    // Handle service selection
    const handleServiceSelect = (serviceId: number) => {
        setData("service_id", serviceId);
    };

    // Handle form submission
    const handleSubmit = (status: "confirmed" | "waiting_on_client") => {
        // Build submission data - only include new_customer/new_dog if creating new
        const submissionData: any = {
            service_id: data.service_id,
            appointment_date: data.appointment_date,
            appointment_time: data.appointment_time,
            status: status,
            notes: data.notes,
        };

        if (showNewCustomerForm) {
            // Creating new customer and dog
            submissionData.new_customer = data.new_customer;
            submissionData.new_dog = data.new_dog;
        } else {
            // Using existing dog
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

    return (
        <AdminLayout>
            <Toast />
            <Head title="Create Booking" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create New Booking
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Book an appointment for an existing or new customer
                    </p>
                </div>

                {/* Error Summary */}
                {Object.keys(errors).length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-red-900 mb-2">
                            Please fix the following errors:
                        </h3>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                            {Object.entries(errors).map(([key, value]) => (
                                <li key={key}>
                                    {key}: {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-8">
                    {/* Step 1: Dog/Customer Selection */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            1. Select Dog / Customer
                        </h2>

                        <div className="space-y-4">
                            <div className="relative">
                                <label
                                    htmlFor="dog-search"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Search by dog name, owner name, or phone
                                </label>
                                <input
                                    id="dog-search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Type to search..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    disabled={showNewCustomerForm}
                                />
                                {isSearching && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        Searching...
                                    </p>
                                )}
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        {searchResults.map((dog) => (
                                            <button
                                                key={dog.id}
                                                type="button"
                                                onClick={() =>
                                                    handleDogSelect(dog)
                                                }
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                <div className="font-medium text-gray-900">
                                                    {dog.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {dog.customer.name} -{" "}
                                                    {dog.customer.phone}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-sm text-gray-500">
                                    or
                                </span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <Button
                                type="button"
                                onClick={handleNewCustomer}
                                className="w-full"
                                disabled={showNewCustomerForm}
                            >
                                + Create New Customer & Dog
                            </Button>

                            {selectedDog && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm font-medium text-green-900">
                                        ✓ Selected: {selectedDog.name} (
                                        {selectedDog.customer.name})
                                    </p>
                                </div>
                            )}

                            {errors.dog_id && (
                                <p className="text-sm text-red-600">
                                    {errors.dog_id}
                                </p>
                            )}
                        </div>

                        {/* New Customer Form */}
                        {showNewCustomerForm && (
                            <div className="mt-6 space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <h3 className="text-md font-semibold text-gray-900">
                                    New Customer Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Customer Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.new_customer.name}
                                            onChange={(e) =>
                                                setData("new_customer", {
                                                    ...data.new_customer,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors["new_customer.name"] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors["new_customer.name"]}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.new_customer.email}
                                            onChange={(e) =>
                                                setData("new_customer", {
                                                    ...data.new_customer,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors["new_customer.email"] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors["new_customer.email"]}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.new_customer.phone}
                                            onChange={(e) =>
                                                setData("new_customer", {
                                                    ...data.new_customer,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors["new_customer.phone"] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors["new_customer.phone"]}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-md font-semibold text-gray-900 mt-6">
                                    New Dog Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Dog Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.new_dog.name}
                                            onChange={(e) =>
                                                setData("new_dog", {
                                                    ...data.new_dog,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors["new_dog.name"] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors["new_dog.name"]}
                                            </p>
                                        )}
                                    </div>
                                    <BreedSelector
                                        value={data.new_dog.breed}
                                        onChange={(breed) =>
                                            setData("new_dog", {
                                                ...data.new_dog,
                                                breed,
                                            })
                                        }
                                        error={errors["new_dog.breed"]}
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Size
                                        </label>
                                        <select
                                            value={data.new_dog.size}
                                            onChange={(e) =>
                                                setData("new_dog", {
                                                    ...data.new_dog,
                                                    size: e.target
                                                        .value as typeof data.new_dog.size,
                                                })
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="small">Small</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="large">Large</option>
                                        </select>
                                        {errors["new_dog.size"] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors["new_dog.size"]}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Special Notes (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.new_dog.special_notes}
                                            onChange={(e) =>
                                                setData("new_dog", {
                                                    ...data.new_dog,
                                                    special_notes:
                                                        e.target.value,
                                                })
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Service Selection */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            2. Select Service
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() =>
                                        handleServiceSelect(service.id)
                                    }
                                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                                        data.service_id === service.id
                                            ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">
                                            {service.emoji}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {service.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {service.description}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                ${service.base_price} •{" "}
                                                {service.duration_minutes} min
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {errors.service_id && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.service_id}
                            </p>
                        )}
                    </div>

                    {/* Step 3: Date and Time Selection */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            3. Select Date & Time
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Calendar */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Select Date
                                </h3>

                                {/* Month Navigation */}
                                <div className="flex items-center text-gray-900 mb-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setViewDate(
                                                new Date(
                                                    viewDate.getFullYear(),
                                                    viewDate.getMonth() - 1,
                                                    1,
                                                ),
                                            )
                                        }
                                        className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">
                                            Previous month
                                        </span>
                                        <ChevronLeftIcon
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </button>
                                    <div className="flex-auto text-center text-sm font-semibold">
                                        {viewDate.toLocaleString(undefined, {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setViewDate(
                                                new Date(
                                                    viewDate.getFullYear(),
                                                    viewDate.getMonth() + 1,
                                                    1,
                                                ),
                                            )
                                        }
                                        className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">
                                            Next month
                                        </span>
                                        <ChevronRightIcon
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </button>
                                </div>

                                {/* Day Headers */}
                                <div className="grid grid-cols-7 text-xs/6 text-gray-500 text-center mb-2">
                                    <div>M</div>
                                    <div>T</div>
                                    <div>W</div>
                                    <div>T</div>
                                    <div>F</div>
                                    <div>S</div>
                                    <div>S</div>
                                </div>

                                {/* Calendar Grid */}
                                <div className="isolate grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200">
                                    {days.map((day) => (
                                        <button
                                            key={day.date}
                                            type="button"
                                            disabled={day.date < todayStr}
                                            onClick={() =>
                                                handleDateSelect(
                                                    day.date,
                                                    day.isCurrentMonth ?? false,
                                                )
                                            }
                                            data-is-today={
                                                day.date === todayStr
                                                    ? ""
                                                    : undefined
                                            }
                                            data-is-selected={
                                                day.isSelected ? "" : undefined
                                            }
                                            data-is-current-month={
                                                day.isCurrentMonth
                                                    ? ""
                                                    : undefined
                                            }
                                            data-is-past={
                                                day.date < todayStr
                                                    ? ""
                                                    : undefined
                                            }
                                            className="group py-1.5 not-data-is-current-month:bg-gray-50 not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-400 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 data-is-current-month:bg-white not-data-is-selected:data-is-current-month:not-data-is-today:text-gray-900 data-is-current-month:hover:bg-gray-100 data-is-selected:font-semibold data-is-selected:text-white data-is-today:font-semibold data-is-today:not-data-is-selected:text-indigo-600 data-is-today:hover:bg-indigo-50 data-is-today:hover:ring-1 data-is-today:hover:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-50 nth-36:rounded-bl-lg nth-7:rounded-tr-lg"
                                        >
                                            <time
                                                dateTime={day.date}
                                                className="mx-auto flex size-7 items-center justify-center rounded-full in-data-is-selected:bg-indigo-600 in-data-is-selected:text-white"
                                            >
                                                {day.date
                                                    .split("-")
                                                    .pop()
                                                    ?.replace(/^0/, "")}
                                            </time>
                                        </button>
                                    ))}
                                </div>

                                {errors.appointment_date && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.appointment_date}
                                    </p>
                                )}
                            </div>

                            {/* Time Slots */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Select Time
                                </h3>

                                {!selectedDate && (
                                    <p className="text-sm text-gray-500 py-4">
                                        Please select a date first
                                    </p>
                                )}

                                {selectedDate && isLoadingSlots && (
                                    <p className="text-sm text-gray-500 py-4">
                                        Loading available times...
                                    </p>
                                )}

                                {selectedDate &&
                                    !isLoadingSlots &&
                                    availableSlots.length === 0 && (
                                        <p className="text-sm text-gray-500 py-4">
                                            No available times for this date
                                        </p>
                                    )}

                                {selectedDate && !isLoadingSlots && (
                                    <div className="space-y-4">
                                        {/* Available Time Slots */}
                                        {availableSlots.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                                {availableSlots.map((slot) => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() =>
                                                            handleTimeSelect(
                                                                slot,
                                                            )
                                                        }
                                                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                                            selectedTime ===
                                                            slot
                                                                ? "bg-indigo-600 text-white border-indigo-600 font-semibold"
                                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Existing Appointments Schedule */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <h4 className="text-xs font-semibold text-blue-900 mb-2">
                                                Day's Schedule
                                            </h4>
                                            {existingAppointments.length > 0 ? (
                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                    {existingAppointments.map(
                                                        (apt, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between text-xs bg-white rounded px-2 py-1.5"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-900">
                                                                        {
                                                                            apt.time
                                                                        }
                                                                    </span>
                                                                    <span className="text-gray-600">
                                                                        {
                                                                            apt.dog_name
                                                                        }{" "}
                                                                        <span className="text-gray-500">
                                                                            [
                                                                            {
                                                                                apt.service
                                                                            }
                                                                            ]
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <span className="text-gray-500">
                                                                    {
                                                                        apt.duration
                                                                    }
                                                                    min
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-600 italic">
                                                    No other appointments on
                                                    this day
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {errors.appointment_time && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.appointment_time}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Notes and Submit */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            4. Notes & Confirmation
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="notes"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Notes (optional)
                                </label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    placeholder="Add any notes about this appointment..."
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    onClick={() =>
                                        handleSubmit("waiting_on_client")
                                    }
                                    disabled={
                                        processing ||
                                        (!data.dog_id &&
                                            !showNewCustomerForm) ||
                                        !data.service_id ||
                                        !selectedDate ||
                                        !selectedTime
                                    }
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                >
                                    Send to Client for Confirmation
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleSubmit("confirmed")}
                                    disabled={
                                        processing ||
                                        (!data.dog_id &&
                                            !showNewCustomerForm) ||
                                        !data.service_id ||
                                        !selectedDate ||
                                        !selectedTime
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    Confirm Appointment Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
