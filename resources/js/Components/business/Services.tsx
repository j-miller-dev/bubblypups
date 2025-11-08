import { CheckCircleIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

const benefits = [
    "All breeds, all sizes",
    "Trims, cuts and dematting",
    "Puppy pampers",
    "Free bandana for each pup",
    "10 years experience :)",
    "Servicing Sunbury and wider region",
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export function Services() {
    return (
        <div className="overflow-hidden bg-white py-24 sm:py-32">
            <div className="relative isolate">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mx-auto flex max-w-2xl flex-col gap-16 bg-purple-50 px-6 py-16 shadow-lg ring-1 ring-purple-200 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-col lg:items-center lg:py-20 xl:gap-y-16 xl:px-20"
                    >
                        <img
                            alt="Happy dog getting groomed"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFLVdfI9OLFPZfYbyI6g1cW7Ra-qkJGnzvFw&s"
                            className="h-96 w-full max-w-2xl mx-auto flex-none rounded-2xl object-cover shadow-xl"
                        />
                        <div className="w-full flex-auto text-center max-w-3xl mx-auto">
                            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl">
                                Premium Grooming Services
                            </h2>
                            <p className="mt-6 text-lg/8 text-pretty text-gray-600">
                                From fluffy Pomeranians to gentle giants, every pup
                                deserves to look and feel their best. We provide
                                professional grooming with a personal touch.
                            </p>
                            <motion.ul
                                role="list"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 text-base/7 text-gray-950 sm:grid-cols-2 sm:text-left max-w-2xl mx-auto"
                            >
                                {benefits.map((benefit) => (
                                    <motion.li
                                        key={benefit}
                                        variants={itemVariants}
                                        className="flex gap-x-3 items-center justify-center sm:justify-start"
                                    >
                                        <CheckCircleIcon
                                            aria-hidden="true"
                                            className="h-7 w-7 flex-none text-purple-400"
                                        />
                                        <span>{benefit}</span>
                                    </motion.li>
                                ))}
                            </motion.ul>
                            <div className="mt-10 flex justify-center">
                                <a
                                    href="/booking/start"
                                    className="btn-primary"
                                >
                                    <CalendarIcon className="h-5 w-5" />
                                    Book an Appointment
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                        }}
                        className="aspect-1318/752 w-329.5 flex-none bg-gradient-to-r from-purple-200 to-brand-200 opacity-30"
                    />
                </div>
            </div>
        </div>
    );
}
