import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { AboutMe, Services, Testimonials } from "@/Components/business";
import { Bubbles } from "@/Components/graphics";
import CallToActionSection from "@/Components/business/CallToActionSection.tsx";
import { CalendarIcon, PhoneIcon } from "@heroicons/react/20/solid";
import FAQSection from "@/Components/FAQSection.tsx";
import Gallery from "@/Components/Gallery.jsx";

function Hero() {
    return (
        <section className="relative bg-white">
            <Bubbles />
            <Container className="flex items-center justify-center py-24">
                <div className="text-center">
                    <div className="mx-auto max-w-2xl">
                        <img
                            src="/images/PNG%20FIles/BubblyPups_Logo(LBG).png"
                            alt="Bubbly Pups Logo"
                            className="mx-auto w-5/6 max-w-[680px] h-auto animate-fade-in duration-600"
                        />
                    </div>

                    <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center animate-fade-in-up delay-300">
                        <a
                            href="/booking"
                            className="btn-primary w-full sm:w-auto"
                        >
                            <CalendarIcon className="h-5 w-5" />
                            Book Now
                        </a>
                        <a
                            href="tel:+1234567890"
                            className="btn-primary w-full sm:w-auto"
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
                <Testimonials />
                <CallToActionSection />
                <FAQSection />
            </div>
        </MainLayout>
    );
}
