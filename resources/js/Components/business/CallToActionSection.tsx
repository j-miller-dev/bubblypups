import { CalendarIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { Link, usePage } from "@inertiajs/react";

export default function CallToActionSection() {
    const { businessPhone, businessPhoneDisplay } = usePage<{ businessPhone: string; businessPhoneDisplay: string }>().props;

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 py-24 sm:py-32">
            {/* Decorative paw prints */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                    src="/images/svg/dogpaw.svg"
                    alt=""
                    className="absolute -top-6 -right-6 w-56 h-56 opacity-[0.07] rotate-12"
                />
                <img
                    src="/images/svg/dogpaw.svg"
                    alt=""
                    className="absolute -bottom-8 -left-8 w-44 h-44 opacity-[0.07] -rotate-12"
                />
                <img
                    src="/images/svg/dogpaw.svg"
                    alt=""
                    className="absolute top-1/2 left-[10%] -translate-y-1/2 w-24 h-24 opacity-[0.05] rotate-45 hidden lg:block"
                />
                {/* Soft inner glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-400 rounded-full blur-3xl opacity-25" />
            </div>

            <div className="relative mx-auto max-w-3xl px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" as const }}
                >
                    <p className="text-brand-200 text-sm font-medium tracking-widest uppercase mb-5">
                        Ready when you are
                    </p>

                    <h2 className="text-white">
                        Your pup's next big day<br />
                        starts with one click.
                    </h2>

                    <p className="mt-6 text-brand-100 text-lg leading-relaxed max-w-xl mx-auto">
                        Spots fill fast — book ahead to lock in your preferred time.
                        All breeds, all sizes, always welcome in Sunbury and surrounds.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/booking/start"
                            className="btn bg-white text-brand-600 hover:bg-brand-50 active:bg-brand-100 shadow-lg shadow-brand-900/20 w-full sm:w-auto"
                        >
                            <CalendarIcon className="h-5 w-5" />
                            Book an Appointment
                        </Link>
                        <a
                            href={`tel:${businessPhone}`}
                            className="btn bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 active:bg-white/30 w-full sm:w-auto"
                        >
                            <PhoneIcon className="h-5 w-5" />
                            {businessPhoneDisplay}
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
