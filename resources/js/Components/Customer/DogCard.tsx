import React from "react";
import { Link } from "@inertiajs/react";
import { HeartIcon } from "@heroicons/react/24/outline";

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

function getSizeBadge(size: string) {
    const badges = {
        small: "bg-blue-100 text-blue-800",
        medium: "bg-purple-100 text-purple-800",
        large: "bg-orange-100 text-orange-800",
    };

    const labels = {
        small: "Small",
        medium: "Medium",
        large: "Large",
    };

    return {
        className: badges[size as keyof typeof badges] || badges.medium,
        label: labels[size as keyof typeof labels] || size,
    };
}

export default function DogCard({ dog, showActions = true }: DogCardProps) {
    const sizeBadge = getSizeBadge(dog.size);

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start gap-x-4">
                    {/* Dog Photo or Placeholder */}
                    <div className="flex-shrink-0">
                        {dog.photo_url ? (
                            <img
                                src={dog.photo_url}
                                alt={dog.name}
                                className="size-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-16 items-center justify-center rounded-full bg-primary-100">
                                <HeartIcon
                                    className="size-8 text-primary-600"
                                    aria-hidden
                                />
                            </div>
                        )}
                    </div>

                    {/* Dog Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-x-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {dog.name}
                            </h3>
                            <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${sizeBadge.className}`}
                            >
                                {sizeBadge.label}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                            {dog.breed}
                        </p>
                        {dog.special_notes && (
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                <span className="font-medium">Note:</span>{" "}
                                {dog.special_notes}
                            </p>
                        )}
                    </div>
                </div>

                {showActions && (
                    <div className="mt-6 flex gap-x-3">
                        <Link
                            href={`/my/dogs/${dog.id}`}
                            className="flex-1 rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            View Details
                        </Link>
                        <Link
                            href={`/my/dogs/${dog.id}`}
                            className="rounded-md bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100"
                        >
                            Edit
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
