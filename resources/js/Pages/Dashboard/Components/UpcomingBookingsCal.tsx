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
    onSelectDate,
    loadBookings,
}: UpcomingBookingsCalProps) {
    const [days, setDays] = useState<
        {
            date: string;
            isToday?: boolean;
            isCurrentMonth?: boolean;
            isSelected?: boolean;
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
            });
        }

        setDays(grid);
    }, [viewDate, selectedDate, todayStr]);

    // Load bookings when selectedDate changes
    useEffect(() => {
        let ignore = false;
        async function run() {
            if (!loadBookings) {
                setBookings([]);
                setIsLoading(false);
                setLoadError(null);
                return;
            }
            try {
                setIsLoading(true);
                setLoadError(null);
                const result = await loadBookings(selectedDate);
                if (!ignore) setBookings(result ?? []);
            } catch (e: any) {
                if (!ignore)
                    setLoadError(e?.message ?? "Failed to load bookings");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }
        run();
        return () => {
            ignore = true;
        };
    }, [selectedDate, loadBookings]);

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
                        {days.map((day) => (
                            <button
                                key={day.date}
                                type="button"
                                title={
                                    day.date === todayStr ? "Today" : undefined
                                }
                                onClick={() => {
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
                                data-is-today={
                                    day.date === todayStr ? "" : undefined
                                }
                                data-is-selected={
                                    day.isSelected ? "" : undefined
                                }
                                data-is-current-month={
                                    day.isCurrentMonth ? "" : undefined
                                }
                                data-is-past={
                                    day.date < todayStr ? "" : undefined
                                }
                                className="group py-1.5 not-data-is-current-month:bg-gray-50 not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-400 first:rounded-tl-lg last:rounded-br-lg hover:bg-gray-100 focus:z-10 data-is-current-month:bg-white not-data-is-selected:data-is-current-month:not-data-is-today:text-gray-900 data-is-current-month:hover:bg-gray-100 data-is-selected:font-semibold data-is-selected:text-white data-is-today:font-semibold data-is-today:not-data-is-selected:text-indigo-600 data-is-today:hover:bg-indigo-50 data-is-today:hover:ring-1 data-is-today:hover:ring-indigo-300 not-data-is-selected:data-is-past:text-gray-400 nth-36:rounded-bl-lg nth-7:rounded-tr-lg"
                            >
                                <time
                                    dateTime={day.date}
                                    className="mx-auto flex size-7 items-center justify-center rounded-full in-data-is-selected:bg-indigo-600 in-data-is-selected:text-white"
                                >
                                    {day.date
                                        .split("-")
                                        .pop()
                                        .replace(/^0/, "")}
                                </time>
                            </button>
                        ))}
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
                        <li className="py-6 text-red-600">
                            {loadError}
                        </li>
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
