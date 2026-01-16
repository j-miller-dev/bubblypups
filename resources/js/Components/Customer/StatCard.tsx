import React from "react";

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    iconColor?: string;
    iconBgColor?: string;
}

export default function StatCard({
    icon: Icon,
    label,
    value,
    iconColor = "text-primary-600",
    iconBgColor = "bg-primary-100",
}: StatCardProps) {
    return (
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md ${iconBgColor} p-3`}>
                    <Icon className={`size-6 ${iconColor}`} aria-hidden />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">
                            {label}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {value}
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}
