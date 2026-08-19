import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { AboutMe, Services, Testimonials } from "@/Components/business";
import { Bubbles } from "@/Components/graphics";
import CallToActionSection from "@/Components/business/CallToActionSection.tsx";
import { CalendarIcon, PhoneIcon } from "@heroicons/react/20/solid";
import FAQSection from "@/Components/FAQSection.tsx";
import Gallery from "@/Components/Gallery";
import { Link } from "@inertiajs/react";
import { BeforeAfterSlider } from "@/Components/BeforeAfterSlider";

const transformations = [
    {
        before: "/images/before-after/before2.jpg",
        after: "/images/gallery/511543675_17994714224802840_1330681720326907512_n.jpg",
    },
    {
        before: "/images/before-after/before3.jpg",
        after: "/images/gallery/511532996_17994821429802840_3900949975547190294_n.jpg",
    },
    {
        before: "/images/before-after/before1.webp",
        after: "/images/gallery/508686865_17993965757802840_5635872540663735746_n.jpg",
    },
];


function Hero() {
    return (
        <section className="relative bg-white flex flex-col justify-center min-h-[calc(100svh-4rem)]">
            <Bubbles />
            <Container className="flex items-center justify-center py-10">
                <div className="text-center">
                    <div className="mx-auto max-w-2xl">
                        <img
                            src="/images/PNG%20FIles/BubblyPups_Logo(LBG).png"
                            alt="Bubbly Pups Logo"
                            className="mx-auto w-5/6 max-w-[680px] h-auto animate-fade-in"
                        />
                    </div>

                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:both]">
                        <Link
                            href="/booking/start"
                            className="btn-primary w-full sm:w-auto"
                        >
                            <CalendarIcon className="h-5 w-5" />
                            Book Now
                        </Link>
                        <a
                            href="tel:+1234567890"
                            className="btn-secondary w-full sm:w-auto"
                        >
                            <PhoneIcon className="h-5 w-5" />
                            Call Me
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default function Home() {
    return (
        <MainLayout>
            <div className="overflow-hidden">
                <Hero />
                <AboutMe />
                <section id="services">
                    <Services />
                </section>
                <Gallery />

                {/* Before & After Transformations */}
                <section className="bg-white py-20 sm:py-28">
                    <Container>
                        <div className="mb-10 text-center">
                            <span className="inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-display font-extrabold text-brand-600 mb-3">
                                The Bubbly Difference
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-900 tracking-tight">
                                Pup <span className="text-brand-400">Transformations</span>
                            </h2>
                            <p className="mt-3 text-gray-500 max-w-sm mx-auto">
                                Drag to reveal the glow-up. Slide right to unleash the bubbles ✨
                            </p>
                        </div>
                        <div className="mx-auto max-w-2xl">
                            <BeforeAfterSlider pairs={transformations} />
                        </div>
                    </Container>
                </section>

                <Testimonials />
                <CallToActionSection />
                <FAQSection />
            </div>
        </MainLayout>
    );
}
