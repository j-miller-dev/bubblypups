import AdminLayout from "@/Layouts/AdminLayout";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";

interface Dog {
    id: number;
    name: string;
    breed: string;
    size: string;
    special_notes?: string;
    photo_url?: string;
    owner: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    lastVisit?: string;
    totalBookings: number;
}

interface Props {
    dogs: {
        data: Dog[];
        links: string;
    };
}

const sizeColors: Record<string, string> = {
    small: "bg-blue-100 text-blue-700",
    medium: "bg-purple-100 text-purple-700",
    large: "bg-orange-100 text-orange-700",
};

const gradients = [
    "from-brand-300 to-purple-400",
    "from-purple-300 to-blue-400",
    "from-blue-300 to-brand-300",
    "from-brand-400 to-pink-400",
];

export default function Dogs({ dogs }: Props) {
    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h2 className="!text-2xl md:!text-3xl text-gray-950">
                    Doggie <span className="text-brand-500">Database</span>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    All dogs in your grooming database with owner information
                    and visit history.
                </p>
            </div>

            <div className="card overflow-hidden">
                {dogs.data.length === 0 ? (
                    <div className="py-16 text-center">
                        <span className="text-4xl block">🐾</span>
                        <p className="mt-3 font-display font-extrabold text-gray-900 text-sm">
                            No dogs yet
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Dogs will appear here once customers register.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {dogs.data.map((dog, idx) => (
                            <li
                                key={dog.id}
                                className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                            >
                                {/* Avatar */}
                                {dog.photo_url ? (
                                    <img
                                        src={dog.photo_url}
                                        alt={dog.name}
                                        className="size-12 shrink-0 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradients[idx % gradients.length]} font-display font-extrabold text-white text-lg`}
                                    >
                                        {dog.name.charAt(0)}
                                    </div>
                                )}

                                {/* Dog info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-display font-extrabold text-gray-900">
                                            {dog.name}
                                        </p>
                                        <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-display font-extrabold bg-gray-100 text-gray-600">
                                            {dog.breed}
                                        </span>
                                        <span
                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-display font-extrabold capitalize ${sizeColors[dog.size] ?? "bg-gray-100 text-gray-600"}`}
                                        >
                                            {dog.size}
                                        </span>
                                        <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-display font-extrabold bg-brand-50 text-brand-600">
                                            {dog.totalBookings} booking
                                            {dog.totalBookings !== 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    {/* Owner */}
                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                                        <p className="text-sm font-display font-extrabold text-gray-600">
                                            {dog.owner.name}
                                        </p>
                                        <a
                                            href={`mailto:${dog.owner.email}`}
                                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-500 transition-colors"
                                        >
                                            <EnvelopeIcon className="size-3.5" />
                                            {dog.owner.email}
                                        </a>
                                        {dog.owner.phone && (
                                            <a
                                                href={`tel:${dog.owner.phone}`}
                                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-500 transition-colors"
                                            >
                                                <PhoneIcon className="size-3.5" />
                                                {dog.owner.phone}
                                            </a>
                                        )}
                                    </div>

                                    {dog.special_notes && (
                                        <p className="mt-1 text-xs text-gray-400 italic">
                                            "{dog.special_notes}"
                                        </p>
                                    )}
                                </div>

                                {/* Last visit */}
                                <div className="shrink-0 text-right">
                                    {dog.lastVisit ? (
                                        <>
                                            <p className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
                                                Last Visit
                                            </p>
                                            <p className="mt-1 text-sm text-gray-700">
                                                {dog.lastVisit}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-xs text-gray-400 font-display font-extrabold">
                                            No visits yet
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination */}
                <div
                    className="border-t border-gray-100 px-5 py-3 text-sm [&_nav]:flex [&_nav]:items-center [&_nav]:gap-1 [&_a]:rounded-button [&_a]:px-2 [&_a]:py-1 [&_a]:text-gray-600 [&_a]:hover:bg-gray-100 [&_span]:rounded-button [&_span]:px-2 [&_span]:py-1 [&_span]:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: dogs.links }}
                />
            </div>
        </AdminLayout>
    );
}
