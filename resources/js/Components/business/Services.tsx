import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, CalendarIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/react";

type PricingTiers = {
    small: number;
    medium: number;
    large: number;
    extra_large: number;
};

type ServiceAccent = "brand" | "purple" | "blue";

type Service = {
    emoji: string;
    name: string;
    description: string;
    duration_minutes: number;
    pricing_tiers: PricingTiers;
    accent: ServiceAccent;
};

const services: Service[] = [
    {
        emoji: "🐕‍🦺",
        name: "Full Doggy Pamper",
        description:
            "Complete spa experience — bath, haircut, nail trimming, ear cleaning, and blow dry. Your pup will leave looking and smelling amazing.",
        duration_minutes: 120,
        pricing_tiers: { small: 55, medium: 65, large: 85, extra_large: 105 },
        accent: "brand",
    },
    {
        emoji: "✂️",
        name: "Cut & Clipping",
        description:
            "Professional grooming and styling tailored to your dog's breed, with a tidy-up of paws, face, and body.",
        duration_minutes: 60,
        pricing_tiers: { small: 30, medium: 35, large: 45, extra_large: 55 },
        accent: "purple",
    },
    {
        emoji: "🛁",
        name: "Deep Wash",
        description:
            "Premium shampoo with deep conditioning, thorough rinse, and professional blow dry for a clean, fresh coat.",
        duration_minutes: 45,
        pricing_tiers: { small: 25, medium: 28, large: 35, extra_large: 42 },
        accent: "blue",
    },
    {
        emoji: "🦷",
        name: "Teeth & Nails",
        description:
            "Essential wellness care with nail trimming and dental cleaning. Keep your pup healthy from snout to paw.",
        duration_minutes: 30,
        pricing_tiers: { small: 20, medium: 22, large: 25, extra_large: 28 },
        accent: "brand",
    },
    {
        emoji: "💅",
        name: "Nail Trim",
        description:
            "Quick and stress-free nail trimming by our experienced groomer. Perfect for pups who just need a little tidy-up.",
        duration_minutes: 15,
        pricing_tiers: { small: 12, medium: 15, large: 18, extra_large: 20 },
        accent: "purple",
    },
    {
        emoji: "🌪️",
        name: "De-shedding Treatment",
        description:
            "Specialised treatment to significantly reduce shedding, with deshedding shampoo, conditioner, and thorough brushing.",
        duration_minutes: 75,
        pricing_tiers: { small: 35, medium: 40, large: 50, extra_large: 60 },
        accent: "blue",
    },
];

const accentStyles: Record<
    ServiceAccent,
    {
        strip: string;
        iconBg: string;
        price: string;
        durationBadge: string;
        sizeCell: string;
        sizeCellText: string;
    }
> = {
    brand: {
        strip: "bg-brand-400",
        iconBg: "bg-brand-50",
        price: "text-brand-500",
        durationBadge: "bg-brand-50 text-brand-700 ring-brand-100",
        sizeCell: "bg-brand-50",
        sizeCellText: "text-brand-700",
    },
    purple: {
        strip: "bg-purple-400",
        iconBg: "bg-purple-50",
        price: "text-purple-600",
        durationBadge: "bg-purple-50 text-purple-700 ring-purple-100",
        sizeCell: "bg-purple-50",
        sizeCellText: "text-purple-700",
    },
    blue: {
        strip: "bg-blue-400",
        iconBg: "bg-blue-50",
        price: "text-blue-500",
        durationBadge: "bg-blue-50 text-blue-700 ring-blue-100",
        sizeCell: "bg-blue-50",
        sizeCellText: "text-blue-700",
    },
};

const sizeTiers: { key: keyof PricingTiers; label: string }[] = [
    { key: "small", label: "S" },
    { key: "medium", label: "M" },
    { key: "large", label: "L" },
    { key: "extra_large", label: "XL" },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" as const },
    },
};

function ServiceCard({ service }: { service: Service }) {
    const [showPricing, setShowPricing] = useState(false);
    const styles = accentStyles[service.accent];

    return (
        <motion.div
            variants={cardVariants}
            className="flex flex-col bg-white rounded-card border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
            {/* Accent strip */}
            <div className={`h-1 w-full ${styles.strip}`} />

            <div className="flex flex-col flex-1 p-6">
                {/* Emoji + Duration row */}
                <div className="flex items-start justify-between mb-5">
                    <div
                        className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center text-2xl`}
                    >
                        {service.emoji}
                    </div>
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${styles.durationBadge}`}
                    >
                        <ClockIcon className="w-3.5 h-3.5" />
                        {service.duration_minutes} min
                    </span>
                </div>

                {/* Name */}
                <div className="font-display font-extrabold text-lg text-gray-950 mb-2">
                    {service.name}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5">
                    {service.description}
                </p>

                {/* Pricing area */}
                <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-0.5">
                                From
                            </p>
                            <p
                                className={`text-2xl font-extrabold font-display leading-none ${styles.price}`}
                            >
                                ${service.pricing_tiers.small}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPricing(!showPricing)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                        >
                            By size
                            <ChevronDownIcon
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${showPricing ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>

                    <AnimatePresence initial={false}>
                        {showPricing && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-4 gap-1 mb-4">
                                    {sizeTiers.map(({ key, label }) => (
                                        <div
                                            key={key}
                                            className={`${styles.sizeCell} rounded-lg p-2 text-center`}
                                        >
                                            <p className="text-[10px] font-medium text-gray-400 mb-0.5">
                                                {label}
                                            </p>
                                            <p
                                                className={`text-sm font-bold ${styles.sizeCellText}`}
                                            >
                                                ${service.pricing_tiers[key]}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Link
                        href="/booking/start"
                        className="btn-secondary w-full text-sm"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

const highlights = [
    { emoji: "🐾", label: "All breeds & sizes" },
    { emoji: "🎀", label: "Free bandana included" },
    { emoji: "⭐", label: "10 years experience" },
    { emoji: "📍", label: "Sunbury & surrounds" },
];

export function Services() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50 py-24 sm:py-32">
            {/* Decorative blobs */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute -top-32 -right-24 w-[560px] h-[560px] bg-brand-100 rounded-full blur-3xl opacity-40" />
                <div className="absolute bottom-0 -left-24 w-[480px] h-[480px] bg-purple-100 rounded-full blur-3xl opacity-35" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-blue-50 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="mx-auto max-w-2xl text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-medium shadow-sm mb-6">
                        🐾 Premium Grooming Services
                    </span>

                    <h2 className="text-gray-950">
                        Every pup deserves{" "}
                        <span className="text-brand-500">to look their best</span>
                    </h2>

                    <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                        From fluffy Pomeranians to gentle giants — professional grooming
                        with a personal touch, right here in Sunbury.
                    </p>
                </motion.div>

                {/* Service cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {services.map((service) => (
                        <ServiceCard key={service.name} service={service} />
                    ))}
                </motion.div>

                {/* Highlights strip */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                    {highlights.map((item) => (
                        <div
                            key={item.label}
                            className="flex flex-col items-center gap-2 p-4 rounded-card bg-white/80 backdrop-blur-sm border border-white shadow-sm text-center"
                        >
                            <span className="text-2xl">{item.emoji}</span>
                            <span className="text-sm font-medium text-gray-700">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="mt-12 flex justify-center"
                >
                    <Link href="/booking/start" className="btn-primary">
                        <CalendarIcon className="h-5 w-5" />
                        Book an Appointment
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
