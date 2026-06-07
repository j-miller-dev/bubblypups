import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon, EnvelopeIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "What's included in the full doggy pamper?",
        answer:
            "The full pamper includes a bath with premium shampoo and conditioner, blow dry, breed-specific haircut, nail trimming, ear cleaning — and of course a free bandana for your pup to take home in style.",
    },
    {
        question: "How long does a grooming session take?",
        answer:
            "It depends on the service and your dog's size. A nail trim takes around 15 minutes, while a full pamper for a larger dog can take up to 2 hours. You'll see estimated durations for each service when you book.",
    },
    {
        question: "Do you groom all breeds and sizes?",
        answer:
            "Absolutely — from tiny Chihuahuas to large Labradors, every breed and every size is welcome. Pricing is based on size, so check the service cards for a full breakdown.",
    },
    {
        question: "Is grooming suitable for puppies?",
        answer:
            "Yes! Getting puppies comfortable with grooming early makes a big difference. First grooms are kept gentle and brief so they have a positive experience. We recommend starting from around 12–16 weeks, after their vaccinations are up to date.",
    },
    {
        question: "How far in advance should I book?",
        answer:
            "We recommend booking at least a week ahead, especially for weekends. You can book online any time through our booking system — just pick your service, date, and preferred time.",
    },
    {
        question: "What if my dog is anxious or nervous around grooming?",
        answer:
            "We take a calm and patient approach with every pup. If your dog gets stressed, just mention it when booking and we'll take extra care to make the session as relaxed and positive as possible.",
    },
    {
        question: "Where are you located, and what areas do you service?",
        answer:
            "We're based in Sunbury, Victoria, and also service the wider region including Diggers Rest, Riddells Creek, and surrounding areas. Not sure if we cover your suburb? Reach out and we'll let you know.",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.07 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

export default function FAQSection() {
    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: "easeOut" as const }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-blue-600 text-sm font-medium shadow-sm mb-6">
                        🐾 Got questions?
                    </span>
                    <h2 className="text-gray-950">
                        Everything you need{" "}
                        <span className="text-brand-500">to know</span>
                    </h2>
                    <p className="mt-5 text-lg text-gray-500 leading-relaxed">
                        Common questions from pup parents — answered.
                    </p>
                </motion.div>

                {/* FAQ accordion */}
                <motion.dl
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="divide-y divide-gray-100"
                >
                    {faqs.map((faq) => (
                        <motion.div key={faq.question} variants={itemVariants}>
                            <Disclosure as="div" className="py-5">
                                <dt>
                                    <DisclosureButton className="group flex w-full items-center justify-between text-left gap-6 cursor-pointer">
                                        <span className="font-display font-extrabold text-base text-gray-900 group-hover:text-brand-500 transition-colors duration-200">
                                            {faq.question}
                                        </span>
                                        <ChevronDownIcon className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-brand-400 transition-all duration-200 group-data-[open]:rotate-180" />
                                    </DisclosureButton>
                                </dt>
                                <DisclosurePanel
                                    as="dd"
                                    transition
                                    className="mt-3 pr-11 overflow-hidden transition-all duration-300 ease-in-out data-[closed]:-translate-y-2 data-[closed]:opacity-0"
                                >
                                    <p className="text-gray-500 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </DisclosurePanel>
                            </Disclosure>
                        </motion.div>
                    ))}
                </motion.dl>

                {/* Still have questions nudge */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-5 rounded-card bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100"
                >
                    <div>
                        <p className="font-display font-extrabold text-gray-950 text-base">
                            Still have a question?
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Get in touch and we'll get back to you shortly.
                        </p>
                    </div>
                    <a
                        href="/contact"
                        className="btn-secondary whitespace-nowrap shrink-0"
                    >
                        <EnvelopeIcon className="h-4 w-4" />
                        Contact Us
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
