import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { Head, useForm } from "@inertiajs/react";
import {
    ChatBubbleLeftEllipsisIcon,
    CheckCircleIcon,
    PhoneIcon,
} from "@heroicons/react/20/solid";

export default function Contact() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [sent, setSent] = useState(false);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route("contact.store"), {
            onSuccess: () => setSent(true),
        });
    }

    return (
        <MainLayout title="Contact | Bubbly Pups">
            <Head>
                <title>Contact | Bubbly Pups</title>
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50 py-20 sm:py-28">
                {/* Decorative blobs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand-100 opacity-60 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-100 opacity-50 blur-3xl"
                />

                <Container>
                    <div className="mx-auto max-w-xl">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 text-brand-600 text-sm font-display font-extrabold shadow-sm mb-6">
                                <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
                                Say Hello
                            </span>
                            <h2 className="text-gray-950">
                                Get in{" "}
                                <span className="text-brand-500">touch</span>
                            </h2>
                            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                                Have a question or want to know more? Send me a
                                message and I'll get back to you soon.
                            </p>
                        </div>

                        {/* Success state */}
                        {sent ? (
                            <div className="card p-8 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100">
                                        <CheckCircleIcon className="size-8 text-green-500" />
                                    </div>
                                </div>
                                <h3 className="font-display font-extrabold text-gray-900 mb-2">
                                    Message sent!
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Thanks for reaching out. I'll be in touch shortly.
                                </p>
                            </div>
                        ) : (
                            /* Form card */
                            <form
                                onSubmit={onSubmit}
                                className="card p-6 sm:p-8 space-y-5"
                            >
                                <div>
                                    <label htmlFor="contact-name" className="label">
                                        Your name
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        className="input"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Jane Smith"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="contact-email" className="label">
                                            Email
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            className="input"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="jane@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="contact-phone" className="label">
                                            Mobile
                                        </label>
                                        <input
                                            id="contact-phone"
                                            type="tel"
                                            className="input"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            placeholder="04XX XXX XXX"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="contact-message" className="label">
                                        Message
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        rows={5}
                                        className="input resize-none"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        placeholder="Tell me about your pup, what service you're interested in, or any questions you have..."
                                        required
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-primary w-full justify-center disabled:opacity-60"
                                >
                                    {processing ? "Sending…" : "Send message"}
                                </button>
                            </form>
                        )}

                        {/* Give me a call strip */}
                        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-card border border-brand-100 bg-brand-50 px-5 py-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white border border-brand-100">
                                    <PhoneIcon className="size-4 text-brand-400" />
                                </div>
                                <div>
                                    <p className="font-display font-extrabold text-gray-900 text-sm">
                                        Or give me a call
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Happy to chat and answer any questions.
                                    </p>
                                </div>
                            </div>
                            <a
                                href="tel:+61400000000"
                                className="btn-primary shrink-0 whitespace-nowrap inline-flex items-center gap-2"
                            >
                                <PhoneIcon className="size-4" />
                                Call now
                            </a>
                        </div>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
