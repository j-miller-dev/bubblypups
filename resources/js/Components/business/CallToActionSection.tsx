import { CalendarIcon } from "@heroicons/react/20/solid";

export default function CallToActionSection() {
    return (
        <div className="bg-blue-100">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
                <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl text-center lg:text-left">
                    Ready to Pamper Your Pup?
                    <br />
                    Book your appointment today.
                </h2>
                <div className="mt-10 flex items-center justify-center gap-6 lg:mt-0 lg:shrink-0">
                    <a
                        href="/booking/start"
                        className="btn-primary w-full sm:w-auto"
                    >
                        <CalendarIcon className="h-5 w-5" />
                        Book Now
                    </a>
                </div>
            </div>
        </div>
    );
}
