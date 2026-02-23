import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { Button } from "@/Components/ui";
import { Head, useForm } from "@inertiajs/react";

export default function Contact() {
    const { data, setData, post, processing } = useForm({
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
            <section className="bg-white py-12 md:py-16">
                <Container>
                    <div className="mx-auto max-w-2xl">
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                            Contact Me
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Have a question? Send me a message and I’ll get back
                            to you soon.
                        </p>

                        {sent && (
                            <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800 ring-1 ring-green-200">
                                Thanks! Your message has been sent.
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Your name
                                </label>
                                <input
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    rows={5}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    value={data.message}
                                    onChange={(e) => setData("message", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-end">
                                <Button type="submit">Send message</Button>
                            </div>
                        </form>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
