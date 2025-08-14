import React from 'react';
import {BentoCard} from '@/Components/BentoCard';
import SectionHeading from './SectionHeading.tsx';

interface ServiceCardProps {
    title: string;
    description: string;
    price: string;
    imageSrc: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({title, description, price, imageSrc}) => {
    return (
        <BentoCard
            eyebrow={price}
            title={title}
            description={description}
            graphic={
                <div className="flex items-center justify-center h-full">
                    <img
                        src={imageSrc}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            }
        />
    );
};

export const Services: React.FC = () => {
    const services = [
        {
            title: "Full Grooming Package",
            description: "Complete grooming service including bath, haircut, nail trimming, ear cleaning, and more. Perfect for all breeds.",
            price: "From $45",
            imageSrc: "/images/Social%20Files/SocialProfile_1.jpg"
        },
        {
            title: "Bath & Brush",
            description: "A refreshing bath with premium shampoo, blow dry, and thorough brushing to keep your pup's coat healthy and shiny.",
            price: "From $25",
            imageSrc: "/images/Social%20Files/SocialProfile_2.jpg"
        },
        {
            title: "Nail Trimming",
            description: "Professional nail trimming service to keep your dog comfortable and prevent scratching.",
            price: "From $15",
            imageSrc: "/images/Social%20Files/SocialProfile_3.jpg"
        },
        {
            title: "Teeth Cleaning",
            description: "Dental hygiene service to keep your dog's teeth clean and breath fresh. Helps prevent dental issues.",
            price: "From $20",
            imageSrc: "/images/Social%20Files/SocialProfile_4.jpg"
        },
        {
            title: "De-shedding Treatment",
            description: "Special treatment to reduce shedding and keep your home cleaner. Great for heavy shedding breeds.",
            price: "From $30",
            imageSrc: "/images/Social%20Files/SocialProfile_2.jpg"
        },
        {
            title: "Puppy's First Groom",
            description: "Gentle introduction to grooming for puppies. Includes basic grooming services and positive reinforcement.",
            price: "From $35",
            imageSrc: "/images/Social%20Files/SocialProfile_1.jpg"
        }
    ];

    return (
        <div className="bg-gray-50 py-24 sm:py-32 dark:bg-gray-900">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">

                {/* Header Component */}
                <SectionHeading
                    subtitle="Meet your local Dog Groomer"
                    title="Making your dogs look and feel beautiful."
                    theme="dark"
                />

                <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                    <div className="relative lg:row-span-2">
                        <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl dark:bg-gray-800"/>
                        <div
                            className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                    Mobile friendly
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat
                                    commodo.
                                </p>
                            </div>
                            <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                                <div
                                    className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl dark:shadow-none dark:outline dark:outline-white/20">
                                    <img
                                        alt=""
                                        src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png"
                                        className="size-full object-cover object-top"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl dark:outline-white/15"/>
                    </div>
                    <div className="relative max-lg:row-start-1">
                        <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl dark:bg-gray-800"/>
                        <div
                            className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                    Performance
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit maiores impedit.
                                </p>
                            </div>
                            <div
                                className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png"
                                    className="w-full max-lg:max-w-xs dark:hidden"
                                />
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-performance.png"
                                    className="w-full not-dark:hidden max-lg:max-w-xs"
                                />
                            </div>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl dark:outline-white/15"/>
                    </div>
                    <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                        <div className="absolute inset-px rounded-lg bg-white dark:bg-gray-800"/>
                        <div
                            className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                            <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                    Security
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                    Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi.
                                </p>
                            </div>
                            <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png"
                                    className="h-[min(152px,40cqw)] object-cover dark:hidden"
                                />
                                <img
                                    alt=""
                                    src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-03-security.png"
                                    className="h-[min(152px,40cqw)] object-cover not-dark:hidden"
                                />
                            </div>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 dark:outline-white/15"/>
                    </div>
                    <div className="relative lg:row-span-2">
                        <div
                            className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl dark:bg-gray-800"/>
                        <div
                            className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                            <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                    Powerful APIs
                                </p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                    Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget sem sodales
                                    gravida.
                                </p>
                            </div>
                            <div className="relative min-h-120 w-full grow">
                                <div
                                    className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl outline outline-white/10 dark:bg-gray-900/60 dark:shadow-none">
                                    <div className="flex bg-gray-900 outline outline-white/5">
                                        <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                                            <div
                                                className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                                                NotificationSetting.jsx
                                            </div>
                                            <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                                        </div>
                                    </div>
                                    <div className="px-6 pt-6 pb-14">{/* Your code example */}</div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl dark:outline-white/15"/>
                    </div>
                </div>
            </div>
        </div>
    );
};
