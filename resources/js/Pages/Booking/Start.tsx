import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { Link } from "@/Components/ui";
import { Head } from "@inertiajs/react";
import { Phone, UserCheck, UserPlus } from "lucide-react";

export default function Start() {
    return (
        <MainLayout title="Book Grooming | Start">
            <Head>
                <title>Book Grooming | Start</title>
            </Head>

            <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
                <img
                    alt=""
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFLVdfI9OLFPZfYbyI6g1cW7Ra-qkJGnzvFw&s"
                    className="absolute inset-0 -z-10 size-full object-cover opacity-20"
                />
                <div
                    aria-hidden="true"
                    className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                        className="aspect-1097/845 w-274.25 bg-gradient-to-tr from-brand-300 to-purple-300 opacity-15"
                    />
                </div>
                <div
                    aria-hidden="true"
                    className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-112 sm:ml-16 sm:translate-x-0"
                >
                    <div
                        style={{
                            clipPath:
                                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                        }}
                        className="aspect-1097/845 w-274.25 bg-gradient-to-tr from-brand-300 to-purple-300 opacity-15"
                    />
                </div>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                        Book a Grooming Appointment
                    </h2>
                    <p className="mt-8 text-lg font-medium text-pretty text-gray-700 sm:text-xl/8">
                        Are you a returning customer or is this your first time
                        with Bubbly Pups?
                    </p>
                </div>
            </div>
            <section className="bg-white py-16">
                <Container>
                    <div className="mx-auto max-w-xl text-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/booking/create" className="block">
                                <div className="h-full rounded-xl border border-gray-200 bg-gray-50 p-6 text-center hover:shadow-sm transition">
                                    <div className="flex justify-center mb-4">
                                        <UserCheck className="w-12 h-12 text-brand-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        I'm a returning customer
                                    </h2>
                                    <p className="text-gray-600 mb-4">
                                        Log in using your email or mobile number
                                        and your dog's name.
                                    </p>
                                    <button className="w-full inline-flex items-center justify-center rounded-lg bg-brand-400 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-500 transition">
                                        Continue
                                    </button>
                                </div>
                            </Link>

                            <Link href="/register" className="block">
                                <div className="h-full rounded-xl border border-gray-200 bg-gray-50 p-6 text-center hover:shadow-sm transition">
                                    <div className="flex justify-center mb-4">
                                        <UserPlus className="w-12 h-12 text-brand-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        I'm new here
                                    </h2>
                                    <p className="text-gray-600 mb-4">
                                        Create a quick profile for you and your
                                        pup. It only takes a minute.
                                    </p>
                                    <button className="w-full inline-flex items-center justify-center rounded-lg bg-white border-2 border-brand-400 px-6 py-3 text-base font-semibold text-brand-400 shadow-sm hover:bg-brand-50 transition">
                                        Get started
                                    </button>
                                </div>
                            </Link>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200 block">
                            <div className="rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <Phone className="w-12 h-12 text-brand-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Or go old school and give me a call
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Sometimes a quick chat is all you need to
                                    get your pup booked in.
                                </p>
                                <a
                                    href="tel:+1234567890"
                                    className="w-full inline-flex items-center justify-center rounded-lg bg-brand-400 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-500 transition"
                                >
                                    Call to Book
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
