import { motion } from "framer-motion";
import { Container } from "@/Components/layout";
import { Image } from "@/Components/graphics";
import PastelBackground from "@/Components/graphics/PastelBackground.tsx";

export function AboutMe() {
    return (
        <section className="relative py-24 sm:py-32 overflow-hidden">
            {/* Pastel diagonal stripe background */}
            <div className="absolute inset-0 w-full h-full">
                <PastelBackground />
            </div>

            <div className="relative z-10">
                <Container>
                    <div className="grid grid-cols-1 items-center gap-12 md:gap-16 md:grid-cols-2">

                        {/* Text column */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, ease: "easeOut" as const }}
                            className="flex flex-col items-center md:items-start"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-medium shadow-sm mb-6">
                                🐾 Meet your groomer
                            </span>

                            <h2 className="text-gray-950 text-center md:text-left">
                                Making your pup look{" "}
                                <span className="text-brand-500">and feel beautiful</span>
                            </h2>

                            <p className="mt-5 text-gray-600 leading-relaxed text-center md:text-left">
                                Hey! I'm Clarissa, the heart behind Bubbly Pups — a gentle,
                                patient groomer who believes every pup deserves a calm, loving
                                spa day. From bubbly baths to tidy trims, I focus on making
                                your dog feel safe, happy, and absolutely adorable.
                            </p>
                            <p className="mt-4 text-gray-600 leading-relaxed text-center md:text-left">
                                New to grooming? Nervous pup? No worries. I take my time and
                                tailor each visit to your dog's needs. Let's make grooming a
                                treat they'll wag about!
                            </p>
                        </motion.div>

                        {/* Image column */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" as const }}
                            className="mx-auto w-full max-w-md"
                        >
                            <Image
                                src="/images/about-me-stock.avif"
                                alt="Bubbly Pups – friendly groomer with a happy dog"
                                rounded="3xl"
                                aspectRatio="portrait"
                                objectFit="cover"
                                className="shadow-xl ring-2 ring-brand-200/50"
                            />
                        </motion.div>

                    </div>
                </Container>
            </div>
        </section>
    );
}
