
import MainLayout from '@/Layouts/MainLayout';
import { Container } from '@/Components/layout';
import { Button } from '@/Components/ui';
import { Testimonials, Services, FacebookFeed, AboutMe } from '@/Components/business';
import { Bubbles } from '@/Components/graphics';

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
