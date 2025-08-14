
import MainLayout from '@/Layouts/MainLayout';
import { Container } from '@/Components/Container';
import { Button } from '@/Components/Button';
import { Testimonials } from '@/Components/Testimonials';
import { Services } from '@/Components/Services';
import { FacebookFeed } from '@/Components/FacebookFeed';
import { AboutMe } from '@/Components/AboutMe';
import { Bubbles } from '@/Components/Bubbles';

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
              className="mx-auto w-5/6 max-w-[680px] h-auto"
            />
          </div>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/booking">Book Now</Button>
            <Button variant="secondary" href="#services">Services</Button>
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
        <FacebookFeed />
        <Testimonials />
      </div>
    </MainLayout>
  );
}
