import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Container } from "@/Components/layout";
import { Button } from "@/Components/ui";
import BreedSelector from "@/Components/ui/BreedSelector";
import { Head, router } from "@inertiajs/react";
import { UserPlusIcon } from "@heroicons/react/20/solid";

function SectionDivider({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-gray-400">
                {label}
            </span>
            <div className="h-px flex-1 bg-gray-100" />
        </div>
    );
}

export default function CustomerRegister() {
    const [owner, setOwner] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [dog, setDog] = useState({
        name: "",
        breed: "",
        age: "",
        weight: "",
        notes: "",
    });
    const [passwords, setPasswords] = useState({
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            const payload = { owner, dog };
            localStorage.setItem("bp_pre_reg", JSON.stringify(payload));
        } catch {
            setLoading(false);
            setError("Failed to save your info locally. Please try again.");
            return;
        }

        setLoading(false);
        router.visit("/booking/appointment");
    };

    const isValid = !!(owner.name && dog.name);

    return (
        <MainLayout title="New Customer Registration | Bubbly Pups">
            <Head title="New Customer Registration" />

            <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50 py-16 sm:py-24">
                {/* Decorative blobs */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-purple-100 opacity-50 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-brand-100 opacity-40 blur-3xl"
                />

                <Container>
                    <div className="mx-auto max-w-2xl">
                        {/* Page header */}
                        <div className="mb-10">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 text-purple-600 text-sm font-medium shadow-sm mb-5">
                                <UserPlusIcon className="h-4 w-4" />
                                New customer
                            </span>
                            <h2 className="text-gray-950">
                                Welcome to{" "}
                                <span className="text-brand-500">
                                    Bubbly Pups
                                </span>
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Tell us a little about you and your pup. You'll
                                pick your appointment on the next step.
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-8">
                            {/* Owner details */}
                            <div className="space-y-4">
                                <SectionDivider label="About you" />

                                <div>
                                    <label className="label">Full name</label>
                                    <input
                                        className="input"
                                        value={owner.name}
                                        onChange={(e) =>
                                            setOwner({
                                                ...owner,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Email</label>
                                        <input
                                            type="email"
                                            className="input"
                                            value={owner.email}
                                            onChange={(e) =>
                                                setOwner({
                                                    ...owner,
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Mobile</label>
                                        <input
                                            type="tel"
                                            className="input"
                                            value={owner.phone}
                                            onChange={(e) =>
                                                setOwner({
                                                    ...owner,
                                                    phone: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">
                                        Address{" "}
                                        <span className="text-gray-400 font-normal">
                                            (optional)
                                        </span>
                                    </label>
                                    <input
                                        className="input"
                                        value={owner.address}
                                        onChange={(e) =>
                                            setOwner({
                                                ...owner,
                                                address: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={passwords.password}
                                            onChange={(e) =>
                                                setPasswords({
                                                    ...passwords,
                                                    password: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">
                                            Confirm password
                                        </label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={
                                                passwords.password_confirmation
                                            }
                                            onChange={(e) =>
                                                setPasswords({
                                                    ...passwords,
                                                    password_confirmation:
                                                        e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Dog details */}
                            <div className="space-y-4">
                                <SectionDivider label="About your pup" />

                                <div>
                                    <label className="label">Dog's name</label>
                                    <input
                                        className="input"
                                        value={dog.name}
                                        onChange={(e) =>
                                            setDog({
                                                ...dog,
                                                name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <BreedSelector
                                        value={dog.breed}
                                        onChange={(breed) =>
                                            setDog({ ...dog, breed })
                                        }
                                        label="Breed"
                                    />
                                    <div>
                                        <label className="label">Age</label>
                                        <input
                                            className="input"
                                            value={dog.age}
                                            onChange={(e) =>
                                                setDog({
                                                    ...dog,
                                                    age: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">
                                            Weight{" "}
                                            <span className="text-gray-400 font-normal">
                                                (kg)
                                            </span>
                                        </label>
                                        <input
                                            className="input"
                                            value={dog.weight}
                                            onChange={(e) =>
                                                setDog({
                                                    ...dog,
                                                    weight: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="label">
                                            Notes{" "}
                                            <span className="text-gray-400 font-normal">
                                                (optional)
                                            </span>
                                        </label>
                                        <input
                                            className="input"
                                            value={dog.notes}
                                            onChange={(e) =>
                                                setDog({
                                                    ...dog,
                                                    notes: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.back();
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!isValid || loading}
                                >
                                    Continue to appointment
                                </Button>
                            </div>
                        </form>
                    </div>
                </Container>
            </section>
        </MainLayout>
    );
}
