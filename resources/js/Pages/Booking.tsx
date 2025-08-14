import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Container } from '@/Components/Container';
import { Button } from '@/Components/Button';

// Step components
const ServiceSelection: React.FC<{
  selectedService: string;
  setSelectedService: (service: string) => void;
  onNext: () => void;
}> = ({ selectedService, setSelectedService, onNext }) => {
  const services = [
    { id: 'full-grooming', name: 'Full Grooming Package', price: '$45+' },
    { id: 'bath-brush', name: 'Bath & Brush', price: '$25+' },
    { id: 'nail-trim', name: 'Nail Trimming', price: '$15+' },
    { id: 'teeth-cleaning', name: 'Teeth Cleaning', price: '$20+' },
    { id: 'deshedding', name: 'De-shedding Treatment', price: '$30+' },
    { id: 'puppy-groom', name: 'Puppy\'s First Groom', price: '$35+' },
  ];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-medium mb-6">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all
              ${selectedService === service.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'}
            `}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{service.name}</h3>
              <span className="text-gray-600">{service.price}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedService}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const DogInformation: React.FC<{
  dogInfo: {
    name: string;
    breed: string;
    age: string;
    weight: string;
    notes: string;
  };
  setDogInfo: (info: any) => void;
  onBack: () => void;
  onNext: () => void;
}> = ({ dogInfo, setDogInfo, onBack, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDogInfo({ ...dogInfo, [name]: value });
  };

  const isFormValid = () => {
    return dogInfo.name && dogInfo.breed && dogInfo.age && dogInfo.weight;
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-medium mb-6">Tell Us About Your Dog</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Dog's Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={dogInfo.name}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
            Breed
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={dogInfo.breed}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="text"
              id="age"
              name="age"
              value={dogInfo.age}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs)
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={dogInfo.weight}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Special Notes or Instructions
          </label>
          <textarea
            id="notes"
            name="notes"
            value={dogInfo.notes}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isFormValid()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const AppointmentScheduling: React.FC<{
  appointment: {
    date: string;
    time: string;
  };
  setAppointment: (info: any) => void;
  onBack: () => void;
  onNext: () => void;
}> = ({ appointment, setAppointment, onBack, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  // Generate available times (9am to 5pm, 30 min intervals)
  const availableTimes = [];
  for (let hour = 9; hour < 17; hour++) {
    const hourFormatted = hour > 12 ? hour - 12 : hour;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    availableTimes.push(`${hourFormatted}:00 ${amPm}`);
    availableTimes.push(`${hourFormatted}:30 ${amPm}`);
  }

  const isFormValid = () => {
    return appointment.date && appointment.time;
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-medium mb-6">Schedule Your Appointment</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={appointment.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Time
          </label>
          <select
            id="time"
            name="time"
            value={appointment.time}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isFormValid()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const ContactInformation: React.FC<{
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  setContactInfo: (info: any) => void;
  onBack: () => void;
  onSubmit: () => void;
}> = ({ contactInfo, setContactInfo, onBack, onSubmit }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const isFormValid = () => {
    return contactInfo.name && contactInfo.email && contactInfo.phone;
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-medium mb-6">Your Contact Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={contactInfo.name}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={contactInfo.email}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={contactInfo.phone}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isFormValid()}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
};

const Confirmation: React.FC<{
  bookingData: {
    service: string;
    dog: {
      name: string;
      breed: string;
      age: string;
      weight: string;
      notes: string;
    };
    appointment: {
      date: string;
      time: string;
    };
    contact: {
      name: string;
      email: string;
      phone: string;
    };
  };
}> = ({ bookingData }) => {
  // Map service ID to service name
  const serviceNames: {[key: string]: string} = {
    'full-grooming': 'Full Grooming Package',
    'bath-brush': 'Bath & Brush',
    'nail-trim': 'Nail Trimming',
    'teeth-cleaning': 'Teeth Cleaning',
    'deshedding': 'De-shedding Treatment',
    'puppy-groom': 'Puppy\'s First Groom',
  };

  return (
    <div className="py-8">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-medium text-green-800 mb-2">Booking Confirmed!</h2>
        <p className="text-green-700">
          Your appointment has been scheduled. We'll send a confirmation to your email shortly.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-medium mb-4">Booking Details</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700">Service</h4>
            <p>{serviceNames[bookingData.service]}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700">Dog Information</h4>
            <p>{bookingData.dog.name} ({bookingData.dog.breed})</p>
            <p>Age: {bookingData.dog.age} | Weight: {bookingData.dog.weight} lbs</p>
            {bookingData.dog.notes && (
              <p className="mt-2 text-sm text-gray-600">Notes: {bookingData.dog.notes}</p>
            )}
          </div>

          <div>
            <h4 className="font-medium text-gray-700">Appointment</h4>
            <p>{new Date(bookingData.appointment.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p>Time: {bookingData.appointment.time}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700">Contact Information</h4>
            <p>{bookingData.contact.name}</p>
            <p>{bookingData.contact.email}</p>
            <p>{bookingData.contact.phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button href="/">
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: '',
    dog: {
      name: '',
      breed: '',
      age: '',
      weight: '',
      notes: '',
    },
    appointment: {
      date: '',
      time: '',
    },
    contact: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const handleServiceSelection = (service: string) => {
    setBookingData({ ...bookingData, service });
  };

  const handleDogInfoUpdate = (dogInfo: any) => {
    setBookingData({ ...bookingData, dog: dogInfo });
  };

  const handleAppointmentUpdate = (appointment: any) => {
    setBookingData({ ...bookingData, appointment });
  };

  const handleContactUpdate = (contact: any) => {
    setBookingData({ ...bookingData, contact });
  };

  const handleSubmit = async () => {
    try {
      const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content
      const res = await fetch('/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          service: bookingData.service,
          dog: bookingData.dog,
          appointment: bookingData.appointment,
          contact: bookingData.contact,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to submit booking')
      }

      // Move to confirmation step on success
      setCurrentStep(5);
    } catch (e) {
      console.error(e)
      alert('Sorry, something went wrong submitting your booking. Please try again.')
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedService={bookingData.service}
            setSelectedService={handleServiceSelection}
            onNext={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <DogInformation
            dogInfo={bookingData.dog}
            setDogInfo={handleDogInfoUpdate}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        );
      case 3:
        return (
          <AppointmentScheduling
            appointment={bookingData.appointment}
            setAppointment={handleAppointmentUpdate}
            onBack={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <ContactInformation
            contactInfo={bookingData.contact}
            setContactInfo={handleContactUpdate}
            onBack={() => setCurrentStep(3)}
            onSubmit={handleSubmit}
          />
        );
      case 5:
        return <Confirmation bookingData={bookingData} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout
      title="Book an Appointment | Bubbly Pups"
      description="Schedule a grooming appointment for your dog at Bubbly Pups."
    >
      <Head>
        <title>Book an Appointment | Bubbly Pups</title>
      </Head>

      <div className="relative py-12 md:py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-8">
              Book Your Dog's Grooming Appointment
            </h1>

            {/* Progress indicator */}
            {currentStep < 5 && (
              <div className="mb-8">
                <div className="flex justify-between">
                  {['Service', 'Dog Info', 'Schedule', 'Contact'].map((step, index) => (
                    <div
                      key={index}
                      className={`text-sm font-medium ${
                        currentStep > index + 1
                          ? 'text-blue-600'
                          : currentStep === index + 1
                            ? 'text-gray-900'
                            : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep - 1) * 25}%` }}
                  />
                </div>
              </div>
            )}

            {/* Step content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {renderStep()}
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
