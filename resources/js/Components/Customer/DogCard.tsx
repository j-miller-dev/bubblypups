import { Link } from "@inertiajs/react";

interface DogCardProps {
    dog: {
        id: number;
        name: string;
        breed: string;
        size: string;
        special_notes?: string;
        photo_url?: string;
    };
    showActions?: boolean;
}

const sizeBadges: Record<string, string> = {
    small: "bg-blue-100 text-blue-700",
    medium: "bg-purple-100 text-purple-700",
    large: "bg-orange-100 text-orange-700",
};

const sizeLabels: Record<string, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
};

export default function DogCard({ dog, showActions = true }: DogCardProps) {
    const badgeClass = sizeBadges[dog.size] ?? sizeBadges.medium;
    const sizeLabel = sizeLabels[dog.size] ?? dog.size;

    return (
        <div className="card-hover p-6">
            <div className="flex items-start gap-4">
                {/* Photo or placeholder */}
                <div className="shrink-0">
                    {dog.photo_url ? (
                        <img
                            src={dog.photo_url}
                            alt={dog.name}
                            className="size-16 rounded-full object-cover ring-2 ring-brand-100"
                        />
                    ) : (
                        <div className="flex size-16 items-center justify-center rounded-full bg-brand-100 text-2xl">
                            🐾
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display font-extrabold text-gray-900 truncate">
                            {dog.name}
                        </p>
                        <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}
                        >
                            {sizeLabel}
                        </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">{dog.breed}</p>
                    {dog.special_notes && (
                        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                            {dog.special_notes}
                        </p>
                    )}
                </div>
            </div>

            {showActions && (
                <div className="mt-5 flex gap-3">
                    <Link
                        href={`/my/dogs/${dog.id}`}
                        className="btn-outline flex-1 justify-center !px-3 !py-2 !text-sm"
                    >
                        View & Edit
                    </Link>
                    <Link
                        href="/booking/create"
                        className="btn-primary !px-3 !py-2 !text-sm"
                    >
                        Book
                    </Link>
                </div>
            )}
        </div>
    );
}
