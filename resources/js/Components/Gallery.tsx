import { useState } from "react";
// @ts-ignore — fslightbox-react has no TypeScript declarations
import FsLightbox from "fslightbox-react";
import { motion } from "framer-motion";
import { EyeIcon } from "@heroicons/react/20/solid";

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
    );
}

// Swap this array for API-sourced images when Instagram integration is ready.
const images = [
    "/images/gallery/502319044_17994059882802840_6920213472963083229_n.jpg",
    "/images/gallery/503311336_17992260032802840_39200220785251235_n.jpg",
    "/images/gallery/508686865_17993965757802840_5635872540663735746_n.jpg",
    "/images/gallery/510963167_17994499958802840_2001308436729847384_n.jpg",
    "/images/gallery/511532996_17994821429802840_3900949975547190294_n.jpg",
    "/images/gallery/511543675_17994714224802840_1330681720326907512_n.jpg",
    "/images/gallery/514762367_17995274594802840_2649849391708338813_n.jpg",
    "/images/gallery/524300714_17997925667802840_4367928199535474911_n.jpg",
    "/images/gallery/549825573_18004075493802840_4005890969860040822_n.jpg",
];

// TODO: Replace with real Instagram handle when available.
const INSTAGRAM_HANDLE = "@bubblypups";
const INSTAGRAM_URL = "https://instagram.com/bubblypups";

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.07 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: "easeOut" as const },
    },
};

function Gallery() {
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1,
    });

    const openLightboxOnSlide = (index: number) => {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: index + 1,
        });
    };

    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" as const }}
                    className="mx-auto max-w-2xl text-center mb-14"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 text-purple-600 text-sm font-medium shadow-sm mb-6">
                        <InstagramIcon className="w-4 h-4" />
                        Fresh from the salon
                    </span>
                    <h2 className="text-gray-950">
                        Pups that left looking{" "}
                        <span className="text-brand-500">absolutely fabulous</span>
                    </h2>
                    <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                        Every groom tells a story. Here are a few of our favourites.
                    </p>
                </motion.div>

                {/* Bento grid
                    Mobile  : 3-col uniform square grid
                    Desktop : featured image (col-span-2 row-span-2) + bento layout
                */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-3 gap-3 lg:[grid-template-rows:repeat(4,210px)]"
                >
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            onClick={() => openLightboxOnSlide(index)}
                            className={[
                                "relative overflow-hidden rounded-card cursor-pointer group",
                                "aspect-square lg:aspect-auto",
                                index === 0 ? "lg:col-span-2 lg:row-span-2" : "",
                            ].join(" ")}
                        >
                            <img
                                src={image}
                                alt={`Groomed pup ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-400/15 flex items-center justify-center">
                                <div className="scale-90 group-hover:scale-100 transition-transform duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-md">
                                    <EyeIcon className="w-5 h-5 text-brand-500" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Instagram CTA strip */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-5 rounded-card bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-white border border-brand-100 shadow-sm flex items-center justify-center shrink-0">
                            <InstagramIcon className="w-5 h-5 text-brand-500" />
                        </div>
                        <div>
                            <p className="font-display font-extrabold text-gray-950 text-base leading-tight">
                                Follow along on Instagram
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {INSTAGRAM_HANDLE} · Fresh transformations posted regularly
                            </p>
                        </div>
                    </div>
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary whitespace-nowrap shrink-0"
                    >
                        <InstagramIcon className="w-4 h-4" />
                        Follow Us
                    </a>
                </motion.div>
            </div>

            <FsLightbox
                toggler={lightboxController.toggler}
                sources={images}
                slide={lightboxController.slide}
            />
        </section>
    );
}

export default Gallery;
