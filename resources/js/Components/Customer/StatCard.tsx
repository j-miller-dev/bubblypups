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
    iconColor = "text-brand-500",
    iconBgColor = "bg-brand-100",
}: StatCardProps) {
    return (
        <div className="card px-4 py-5 sm:p-6">
            <div className="flex items-center gap-4">
                <div
                    className={`flex-shrink-0 rounded-xl ${iconBgColor} p-3`}
                >
                    <Icon className={`size-6 ${iconColor}`} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-500">{label}</p>
                    <p className="mt-1 text-2xl font-display font-extrabold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}
