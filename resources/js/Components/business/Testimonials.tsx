import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    StarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/20/solid";

type AvatarColor = {
    bg: string;
    text: string;
    ring: string;
};

type Testimonial = {
    quote: string;
    name: string;
    location: string;
    initials: string;
    avatarColor: AvatarColor;
    photo?: string; // drop a path in here when real profile photos are available
};

// Replace placeholder text with real testimonials when received from customers.
const testimonials: Testimonial[] = [
    {
        quote: "Charlie came home looking like an absolute show dog. So gentle with him, so thorough — and the free bandana was adorable. We won't be going anywhere else!",
        name: "Sarah M.",
        location: "Sunbury",
        initials: "SM",
        avatarColor: { bg: "bg-brand-100", text: "text-brand-700", ring: "ring-brand-200" },
    },
    {
        quote: "Our golden Max has never been easier to brush since his de-shedding treatment. Incredible value and such a warm, friendly experience every single time.",
        name: "Jake & Emma T.",
        location: "Diggers Rest",
        initials: "JE",
        avatarColor: { bg: "bg-purple-100", text: "text-purple-700", ring: "ring-purple-200" },
    },
    {
        quote: "Bella our cavoodle looks and smells like royalty after every visit. Booked the full pamper and it was worth every cent. Already rebooked for next month!",
        name: "Priya K.",
        location: "Sunbury",
        initials: "PK",
        avatarColor: { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-blue-200" },
    },
    {
        quote: "Brought both our poodles in and they both came out beautifully groomed. Professional, fairly priced, and it's clear she genuinely loves dogs. Regulars for life.",
        name: "Daniel R.",
        location: "Sunbury",
        initials: "DR",
        avatarColor: { bg: "bg-brand-100", text: "text-brand-700", ring: "ring-brand-200" },
    },
    {
        quote: "Archie my schnauzer actually gets excited when we pull into the street now. That says everything. Hands-down the best groomer in the Sunbury area.",
        name: "Mel O.",
        location: "Riddells Creek",
        initials: "MO",
        avatarColor: { bg: "bg-purple-100", text: "text-purple-700", ring: "ring-purple-200" },
    },
];

function StarRating() {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-amber-400" />
            ))}
        </div>
    );
}

function Avatar({ testimonial }: { testimonial: Testimonial }) {
    if (testimonial.photo) {
        return (
            <img
                src={testimonial.photo}
                alt={testimonial.name}
                className={`w-12 h-12 rounded-full object-cover ring-2 ${testimonial.avatarColor.ring}`}
            />
        );
    }

    return (
        <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-extrabold text-sm ring-2 ring-white shadow-sm ${testimonial.avatarColor.bg} ${testimonial.avatarColor.text}`}
        >
            {testimonial.initials}
        </div>
    );
}

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-advance every 5 seconds; resets whenever the slide changes or pause state changes.
    useEffect(() => {
        if (isPaused) {
            return;
        }

        const timer = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearTimeout(timer);
    }, [isPaused, current]);

    const prev = () =>
        setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

    const next = () =>
        setCurrent((c) => (c + 1) % testimonials.length);

    return (
        <section className="relative overflow-hidden bg-purple-50 py-24 sm:py-32">
            {/* Decorative blobs */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-brand-100 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-0 -left-16 w-[420px] h-[420px] bg-purple-200 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" as const }}
                    className="text-center mb-14"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-medium shadow-sm mb-6">
                        ⭐ Happy Pup Parents
                    </span>
                    <h2 className="text-gray-950">
                        Trusted by families{" "}
                        <span className="text-brand-500">across Sunbury</span>
                    </h2>
                    <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                        Don't just take our word for it — here's what some of our regulars have to say.
                    </p>
                </motion.div>

                {/* Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="flex items-center gap-4">
                        {/* Prev arrow */}
                        <button
                            onClick={prev}
                            aria-label="Previous testimonial"
                            className="hidden sm:flex w-10 h-10 shrink-0 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-200 transition-colors duration-200"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>

                        {/* Card */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -14 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" as const }}
                                    className="relative overflow-hidden bg-white rounded-card border border-gray-100 shadow-sm px-8 py-10 sm:px-12 sm:py-12"
                                >
                                    {/* Decorative large opening quote */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute -top-3 left-4 font-display font-extrabold text-[130px] leading-none text-brand-100 select-none pointer-events-none"
                                    >
                                        &ldquo;
                                    </div>

                                    <div className="relative z-10">
                                        <StarRating />

                                        <blockquote className="mt-5 text-xl text-gray-800 leading-relaxed">
                                            &ldquo;{testimonials[current].quote}&rdquo;
                                        </blockquote>

                                        <div className="mt-8 flex items-center gap-4">
                                            <Avatar testimonial={testimonials[current]} />
                                            <div>
                                                <div className="font-display font-extrabold text-gray-950 text-base leading-tight">
                                                    {testimonials[current].name}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-0.5">
                                                    📍 {testimonials[current].location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Next arrow */}
                        <button
                            onClick={next}
                            aria-label="Next testimonial"
                            className="hidden sm:flex w-10 h-10 shrink-0 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-200 transition-colors duration-200"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation dots */}
                    <div className="flex justify-center items-center gap-2 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                aria-label={`Go to testimonial ${i + 1}`}
                                className={[
                                    "rounded-full transition-all duration-300",
                                    i === current
                                        ? "w-6 h-2.5 bg-brand-400"
                                        : "w-2.5 h-2.5 bg-brand-200 hover:bg-brand-300",
                                ].join(" ")}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
