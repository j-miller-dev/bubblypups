import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';


export default function CustomerRegister() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        dog_name: '',
        dog_breed: '',
        dog_size: 'medium',
        dog_notes: '',
    });


    const submit = (e) => {
        e.preventDefault();
        post(route('customer.register'));
    }

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Phone" />

                    <TextInput
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        autoComplete="tel"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />

                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Dog Information Section */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Tell Us About Your Dog
                    </h2>

                    <div>
                        <InputLabel htmlFor="dog_name" value="Dog's Name" />

                        <TextInput
                            id="dog_name"
                            name="dog_name"
                            value={data.dog_name}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('dog_name', e.target.value)}
                            required
                        />

                        <InputError message={errors.dog_name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="dog_breed" value="Breed" />

                        <TextInput
                            id="dog_breed"
                            name="dog_breed"
                            value={data.dog_breed}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('dog_breed', e.target.value)}
                            required
                        />

                        <InputError message={errors.dog_breed} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="dog_size" value="Size" />

                        <SelectInput
                            id="dog_size"
                            name="dog_size"
                            value={data.dog_size}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('dog_size', e.target.value)}
                            required
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </SelectInput>

                        <InputError message={errors.dog_size} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="dog_notes" value="Special Notes (Optional)" />

                        <TextareaInput
                            id="dog_notes"
                            name="dog_notes"
                            value={data.dog_notes}
                            className="mt-1 block w-full"
                            rows="3"
                            onChange={(e) => setData('dog_notes', e.target.value)}
                            placeholder="Any special care instructions, behavioral notes, or health information we should know..."
                        />

                        <InputError message={errors.dog_notes} className="mt-2" />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('customer.login.form')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Create Account & Book Appointment
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
