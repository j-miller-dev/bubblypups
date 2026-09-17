import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { Link } from "@inertiajs/react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/20/solid";

interface SizeTiers {
    small: number;
    medium: number;
    large: number;
}

interface Service {
    id: number;
    name: string;
    description: string;
    emoji: string;
    pricing_tiers: SizeTiers;
    duration_tiers: SizeTiers;
}

interface Props {
    services: Service[];
}

type Accent = "brand" | "purple" | "blue";

const accents: Accent[] = ["brand", "purple", "blue"];

const accentStyles: Record<
    Accent,
    { strip: string; iconBg: string; price: string; sizeCell: string; sizeCellText: string }
> = {
    brand: {
        strip: "bg-brand-400",
        iconBg: "bg-brand-50",
        price: "text-brand-500",
        sizeCell: "bg-brand-50",
        sizeCellText: "text-brand-700",
    },
    purple: {
        strip: "bg-purple-400",
        iconBg: "bg-purple-50",
        price: "text-purple-600",
        sizeCell: "bg-purple-50",
        sizeCellText: "text-purple-700",
    },
    blue: {
        strip: "bg-blue-400",
        iconBg: "bg-blue-50",
        price: "text-blue-500",
        sizeCell: "bg-blue-50",
        sizeCellText: "text-blue-700",
    },
};

const sizeLabels: { key: keyof SizeTiers; label: string }[] = [
    { key: "small", label: "Small" },
    { key: "medium", label: "Medium" },
    { key: "large", label: "Large" },
];

function ServiceCard({ service, accent }: { service: Service; accent: Accent }) {
    const styles = accentStyles[accent];

    return (
        <div className="flex flex-col bg-white rounded-card border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className={`h-1 w-full ${styles.strip}`} />

            <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div
                        className={`w-14 h-14 shrink-0 rounded-2xl ${styles.iconBg} flex items-center justify-center text-2xl`}
                    >
                        {service.emoji}
                    </div>
                    <div>
                        <p className="font-display font-extrabold text-lg text-gray-950">
                            {service.name}
                        </p>
                        <p
                            className={`text-2xl font-display font-extrabold leading-none mt-1 ${styles.price}`}
                        >
                            From ${service.pricing_tiers.small}
                        </p>
                    </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {service.description}
                </p>

                <div className="mt-auto border-t border-gray-100 pt-4">
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-2">
                        Price &amp; duration by size
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                        {sizeLabels.map(({ key, label }) => (
                            <div key={key} className={`${styles.sizeCell} rounded-lg p-2.5 text-center`}>
                                <p className="text-[10px] font-medium text-gray-400 mb-1">{label}</p>
                                <p className={`text-sm font-display font-extrabold ${styles.sizeCellText}`}>
                                    ${service.pricing_tiers[key]}
                                </p>
                                <p className="mt-0.5 flex items-center justify-center gap-0.5 text-[10px] text-gray-400">
                                    <ClockIcon className="size-3" />
                                    {service.duration_tiers[key]}m
                                </p>
                            </div>
                        ))}
                    </div>

                    <Link href="/booking/start" className="btn-secondary w-full text-sm justify-center">
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Pricing({ services }: Props) {
    return (
        <MainLayout
            title="Pricing - Bubbly Pups"
            description="Grooming prices for every size pup, from a wash and tidy-up to the full pamper package."
        >
            <div className="overflow-hidden">
                <section className="relative bg-gradient-to-b from-brand-50 to-white py-20 sm:py-28">
                    <Container className="relative text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-medium shadow-sm mb-6">
                            🐾 Simple, Honest Pricing
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-gray-950">
                            Pricing that fits <span className="text-brand-500">every pup</span>
                        </h1>
                        <p className="mt-6 max-w-xl mx-auto text-lg text-gray-500">
                            Prices are guided by your dog's size — small, medium, or large.
                            Your final price may vary slightly depending on coat condition
                            and behaviour on the day.
                        </p>
                    </Container>
                </section>

                <Container className="py-16 sm:py-20">
                    {services.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Pricing is being updated — please check back soon, or contact us directly.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    accent={accents[index % accents.length]}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-14 flex justify-center">
                        <Link href="/booking/start" className="btn-primary">
                            <CalendarIcon className="h-5 w-5" />
                            Book an Appointment
                        </Link>
                    </div>
                </Container>
            </div>
        </MainLayout>
    );
}
