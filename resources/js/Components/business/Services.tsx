import React from 'react';
import { BentoCard, SectionHeading } from '@/Components/graphics';

interface ServiceCardProps {
    title: string;
    description: string;
    emoji: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({title, description, emoji}) => {
    return (
        <BentoCard
            eyebrow=""
            title={title}
            description={description}
            graphic={
                <div className="flex items-center justify-center h-full p-4">
                    <div className="text-[12rem] sm:text-[14rem] lg:text-[16rem] select-none text-center">
                        {emoji}
                    </div>
                </div>
            }
        />
    );
};

export const Services: React.FC = () => {
    const services = [
        {
            title: "Full doggy pamper",
            description: "Complete spa experience with bath, haircut, nail trimming, ear cleaning, and relaxing treatment. Perfect for all breeds.",
            price: "From $65",
            emoji: "🐕‍🦺"
        },
        {
            title: "Cut and clipping",
            description: "Professional grooming and styling service with precision cuts and clipping to keep your pup looking their best.",
            price: "From $35",
            emoji: "✂️"
        },
        {
            title: "Deep wash",
            description: "Thorough cleaning with premium shampoo, conditioning treatment, and blow dry for a fresh, healthy coat.",
            price: "From $28",
            emoji: "🛁"
        },
        {
            title: "Teeth and nails",
            description: "Essential hygiene care including professional nail trimming and dental cleaning for your dog's health.",
            price: "From $22",
            emoji: "🦷"
        }
    ];

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">

                {/* Header Component */}
                <SectionHeading
                    subtitle="Meet your local Dog Groomer"
                    title="Making your dogs look and feel beautiful."
                    theme="light"
                />

                <div className="mt-10 grid gap-6 sm:mt-16 lg:grid-cols-2">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            title={service.title}
                            description={service.description}
                            emoji={service.emoji}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
