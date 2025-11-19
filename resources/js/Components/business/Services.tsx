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

// Create paw trail positions (dog walking down on right side)
// Animation order: 1st, 3rd, 2nd, 4th (Front left, Back left, Front right, Back right)
// Rotated 180° to face downward, ending at 50% height
const pawPositions = [
    // First step
    { left: "70%", top: "5%", rotate: 165, delay: 0 },      // 1st - Front left
    { left: "68%", top: "10%", rotate: 170, delay: 0.15 },  // 3rd - Back left
    { left: "78%", top: "7%", rotate: 195, delay: 0.3 },    // 2nd - Front right
    { left: "76%", top: "12%", rotate: 190, delay: 0.45 },  // 4th - Back right

    // Second step
    { left: "72%", top: "15%", rotate: 168, delay: 0.6 },   // 1st - Front left
    { left: "70%", top: "20%", rotate: 172, delay: 0.75 },  // 3rd - Back left
    { left: "80%", top: "17%", rotate: 192, delay: 0.9 },   // 2nd - Front right
    { left: "78%", top: "22%", rotate: 188, delay: 1.05 },  // 4th - Back right

    // Third step
    { left: "71%", top: "25%", rotate: 170, delay: 1.2 },   // 1st - Front left
    { left: "69%", top: "30%", rotate: 165, delay: 1.35 },  // 3rd - Back left
    { left: "79%", top: "27%", rotate: 190, delay: 1.5 },   // 2nd - Front right
    { left: "77%", top: "32%", rotate: 195, delay: 1.65 },  // 4th - Back right

    // Fourth step
    { left: "73%", top: "35%", rotate: 172, delay: 1.8 },   // 1st - Front left
    { left: "71%", top: "40%", rotate: 168, delay: 1.95 },  // 3rd - Back left
    { left: "81%", top: "37%", rotate: 188, delay: 2.1 },   // 2nd - Front right
    { left: "79%", top: "42%", rotate: 192, delay: 2.25 },  // 4th - Back right

    // Fifth step
    { left: "72%", top: "45%", rotate: 165, delay: 2.4 },   // 1st - Front left
    { left: "70%", top: "50%", rotate: 170, delay: 2.55 },  // 3rd - Back left
    { left: "80%", top: "47%", rotate: 195, delay: 2.7 },   // 2nd - Front right
    { left: "78%", top: "50%", rotate: 190, delay: 2.85 },  // 4th - Back right
];

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
                        className="relative mx-auto flex max-w-2xl flex-col gap-16 bg-purple-50 px-6 py-16 shadow-lg ring-1 ring-purple-200 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-col lg:items-center lg:py-20 xl:gap-y-16 xl:px-20 overflow-hidden"
                    >
                        {/* Animated Paw Trail Background - Dog Walking Down */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {pawPositions.map((position, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 0.5, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: position.delay,
                                        duration: 0.4,
                                        ease: "easeOut"
                                    }}
                                    style={{
                                        position: "absolute",
                                        left: position.left,
                                        top: position.top,
                                        transform: `rotate(${position.rotate}deg)`,
                                    }}
                                    className="w-10 h-10 sm:w-14 sm:h-14"
                                >
                                    <img
                                        src="/images/svg/dogpaw.svg"
                                        alt=""
                                        className="w-full h-full"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <div className="w-full flex-auto text-center max-w-3xl mx-auto relative z-10">
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
                                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 text-base/7 text-gray-950 sm:grid-cols-2 sm:text-left max-w-2xl mx-auto relative z-10"
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
                            <div className="mt-10 flex justify-center relative z-10">
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
