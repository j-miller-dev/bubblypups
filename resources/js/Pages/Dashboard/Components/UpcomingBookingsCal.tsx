import {
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
    MapPinIcon,
} from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useEffect, useState } from "react";

// Dynamic bookings will be loaded per selected date via optional loadBookings prop.

interface BookingItem {
    id: number | string;
    name: string; // display name (e.g., client or dog)
    datetime: string; // ISO string or RFC3339
    date?: string; // human-readable date if provided
    time?: string; // human-readable time if provided
    imageUrl?: string;
    location?: string;
}

interface UpcomingBookingsCalProps {
    currentDate: string; // initial selected date in YYYY-MM-DD
    appointments?: any[];
    onSelectDate?: (date: string) => void; // optional callback when a date is selected
    loadBookings?: (date: string) => Promise<BookingItem[]>; // optional async loader
}

function formatDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function UpcomingBookingsCal({
    currentDate,
    appointments = [], // ADD default
    onSelectDate,
    loadBookings,
}: UpcomingBookingsCalProps) {
    const [days, setDays] = useState<
        {
            date: string;
            isToday?: boolean;
            isCurrentMonth?: boolean;
            isSelected?: boolean;
            isSunday?: boolean;
        }[]
    >([]);
    const [viewDate, setViewDate] = useState<Date>(() => {
        const [y, m] = currentDate
            .slice(0, 7)
            .split("-")
            .map((v) => parseInt(v, 10));
        return new Date(y, (m ?? 1) - 1, 1);
    });
    const [selectedDate, setSelectedDate] = useState<string>(currentDate);
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const todayStr = formatDate(new Date());
    const appointmentCounts = appointments.reduce(
        (acc: Record<string, number>, apt: any) => {
            const date = apt.date; // assuming date is in YYYY-MM-DD format
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        },
        {},
    );

    const selectedLabel = (() => {
        try {
            // Ensure local parsing without UTC shift
            const d = new Date(`${selectedDate}T00:00:00`);
            return d.toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return selectedDate;
        }
    })();

    useEffect(() => {
        // keep internal selection and view in sync if parent passes a new currentDate
        if (currentDate && currentDate !== selectedDate) {
            setSelectedDate(currentDate);
            const [yy, mm] = currentDate
                .slice(0, 7)
                .split("-")
                .map((v) => parseInt(v, 10));
            setViewDate(new Date(yy, (mm ?? 1) - 1, 1));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    useEffect(() => {
        // Generate a full 6x7 grid aligned Monday-first for the viewDate month
        const y = viewDate.getFullYear();
        const m = viewDate.getMonth(); // 0-based

        const firstOfMonth = new Date(y, m, 1);
        const firstDay = firstOfMonth.getDay(); // 0=Sun..6=Sat
        const mondayFirstOffset = (firstDay + 6) % 7; // 0 for Monday, 6 for Sunday

        const daysInPrevMonth = new Date(y, m, 0).getDate();
        const daysInThisMonth = new Date(y, m + 1, 0).getDate();

        const grid: {
            date: string;
            isToday?: boolean;
            isCurrentMonth?: boolean;
            isSelected?: boolean;
            isSunday?: boolean;
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
                isSunday: d.getDay() === 0,
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
                isSunday: d.getDay() === 0,
            });
        }

        // Trailing days from next month to complete weeks (multiple of 7)
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
                isSunday: d.getDay() === 0,
            });
        }

        setDays(grid);
    }, [viewDate, selectedDate, todayStr]);

    useEffect(() => {
        const filtered = appointments
            .filter((apt) => apt.date === selectedDate)
            .map((apt) => ({
                id: apt.id,
                name: `${apt.dog} (${apt.owner})`,
                datetime: apt.datetime,
                date: apt.date,
                time: apt.time,
                imageUrl: apt.photo_url,
                location: `${apt.service_emoji} ${apt.service}`,
            }));
        setBookings(filtered);
        setIsLoading(false);
        setLoadError(null);
    }, [selectedDate, appointments]);

    return (
        <div>
            <h2 className="text-base font-semibold text-gray-600">
                Upcoming Bookings for {selectedLabel}
            </h2>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
                    <div className="flex items-center text-gray-900">
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
                            <span className="sr-only">Previous month</span>
                            <ChevronLeftIcon
                                aria-hidden="true"
                                className="size-5"
                            />
                        </button>
                        <div className="flex-auto text-sm font-semibold">
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
                            <span className="sr-only">Next month</span>
                            <ChevronRightIcon
                                aria-hidden="true"
                                className="size-5"
                            />
                        </button>
                    </div>
                    <div className="mt-6 grid grid-cols-7 text-xs/6 text-gray-500">
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                        <div>S</div>
                    </div>
                    <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200">
                        {days.map((day) => {
                            const dayNumber = (
                                day.date.split("-")[2] || ""
                            ).replace(/^0/, "");
                            const isPast = day.date < todayStr;
                            const isToday = day.date === todayStr;
                            const isSunday = day.isSunday;
                            const isSelected = day.isSelected;

                            return (
                                <button
                                    key={day.date}
                                    type="button"
                                    title={
                                        isToday
                                            ? "Today"
                                            : isSunday
                                              ? "Closed"
                                              : undefined
                                    }
                                    onClick={() => {
                                        if (isSunday || isPast) return;
                                        setSelectedDate(day.date);
                                        if (!day.isCurrentMonth) {
                                            const [yy, mm] = day.date
                                                .slice(0, 7)
                                                .split("-")
                                                .map((v) => parseInt(v, 10));
                                            setViewDate(
                                                new Date(yy, (mm ?? 1) - 1, 1),
                                            );
                                        }
                                        onSelectDate?.(day.date);
                                    }}
                                    disabled={isSunday || isPast}
                                    className={`
                                        group relative py-1.5 focus:z-10
                                        first:rounded-tl-lg last:rounded-br-lg
                                        nth-36:rounded-bl-lg nth-7:rounded-tr-lg
                                        ${!day.isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                                        ${isPast && !isToday ? "text-gray-300 opacity-50 cursor-not-allowed" : ""}
                                        ${isSunday ? "bg-red-50 text-red-300 cursor-not-allowed" : ""}
                                        ${isToday ? "ring-2 ring-inset ring-indigo-600 font-bold text-indigo-600 bg-indigo-50" : ""}
                                        ${isSelected && !isToday ? "font-semibold" : ""}
                                        ${!isPast && !isSunday ? "hover:bg-gray-100" : ""}
                                    `}
                                >
                                    <time
                                        dateTime={day.date}
                                        className={`
                                            mx-auto flex size-7 items-center justify-center rounded-full relative
                                            ${isSelected && !isToday ? "bg-indigo-600 text-white" : ""}
                                        `}
                                    >
                                        {dayNumber}
                                        {(appointmentCounts[day.date] ?? 0) >
                                            0 &&
                                            !isSunday && (
                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-semibold">
                                                    {appointmentCounts[day.date]}
                                                </span>
                                            )}
                                    </time>
                                </button>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        className="mt-8 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add event
                    </button>
                </div>
                <ol className="mt-4 divide-y divide-gray-100 text-sm/6 lg:col-span-7 xl:col-span-8">
                    {isLoading && (
                        <li className="py-6 text-gray-500">
                            Loading bookings…
                        </li>
                    )}
                    {!isLoading && loadError && (
                        <li className="py-6 text-red-600">{loadError}</li>
                    )}
                    {!isLoading && !loadError && bookings.length === 0 && (
                        <li className="py-6 text-gray-600">
                            No bookings today
                        </li>
                    )}
                    {!isLoading &&
                        !loadError &&
                        bookings.map((meeting) => (
                            <li
                                key={meeting.id}
                                className="relative flex gap-x-6 py-6 xl:static"
                            >
                                {meeting.imageUrl && (
                                    <img
                                        alt=""
                                        src={meeting.imageUrl}
                                        className="size-14 flex-none rounded-full"
                                    />
                                )}
                                <div className="flex-auto">
                                    <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                                        {meeting.name}
                                    </h3>
                                    <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                                        <div className="flex items-start gap-x-3">
                                            <dt className="mt-0.5">
                                                <span className="sr-only">
                                                    Date
                                                </span>
                                                <CalendarIcon
                                                    aria-hidden="true"
                                                    className="size-5 text-gray-400"
                                                />
                                            </dt>
                                            <dd>
                                                <time
                                                    dateTime={meeting.datetime}
                                                >
                                                    {meeting.date ??
                                                        new Date(
                                                            meeting.datetime,
                                                        ).toLocaleDateString()}{" "}
                                                    {meeting.time
                                                        ? `at ${meeting.time}`
                                                        : new Date(
                                                              meeting.datetime,
                                                          ).toLocaleTimeString(
                                                              [],
                                                              {
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                              },
                                                          )}
                                                </time>
                                            </dd>
                                        </div>
                                        {meeting.location && (
                                            <div className="mt-2 flex items-start gap-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400/50 xl:pl-3.5">
                                                <dt className="mt-0.5">
                                                    <span className="sr-only">
                                                        Location
                                                    </span>
                                                    <MapPinIcon
                                                        aria-hidden="true"
                                                        className="size-5 text-gray-400"
                                                    />
                                                </dt>
                                                <dd>{meeting.location}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                                <Menu
                                    as="div"
                                    className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center"
                                >
                                    <MenuButton className="relative flex items-center rounded-full text-gray-500 hover:text-gray-600">
                                        <span className="absolute -inset-2" />
                                        <span className="sr-only">
                                            Open options
                                        </span>
                                        <EllipsisHorizontalIcon
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        <div className="py-1">
                                            <MenuItem>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                                >
                                                    Edit
                                                </a>
                                            </MenuItem>
                                            <MenuItem>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                                >
                                                    Cancel
                                                </a>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </Menu>
                            </li>
                        ))}
                </ol>
            </div>
        </div>
    );
}
