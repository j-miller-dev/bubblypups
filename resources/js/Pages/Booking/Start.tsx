import React from 'react'
import MainLayout from '@/Layouts/MainLayout'
import { Container } from '@/Components/layout'
import { Button } from '@/Components/ui'
import { Link } from '@/Components/ui'
import { Head } from '@inertiajs/react'

export default function Start() {
  return (
    <MainLayout title="Book Grooming | Start">
      <Head>
        <title>Book Grooming | Start</title>
      </Head>
      <section className="bg-white py-16">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Book a Grooming Appointment</h1>
            <p className="text-gray-600 mb-8">Are you a returning customer or is this your first time with Bubbly Pups?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/booking/returning" className="block">
                <div className="h-full rounded-xl border border-gray-200 p-6 text-left hover:shadow-sm transition">
                  <h2 className="text-xl font-semibold mb-2">I'm a returning customer</h2>
                  <p className="text-gray-600 mb-4">Log in using your email or mobile number and your dog's name.</p>
                  <Button className="w-full">Continue</Button>
                </div>
              </Link>

              <Link href="/booking/register" className="block">
                <div className="h-full rounded-xl border border-gray-200 p-6 text-left hover:shadow-sm transition">
                  <h2 className="text-xl font-semibold mb-2">I'm new here</h2>
                  <p className="text-gray-600 mb-4">Create a quick profile for you and your pup. It only takes a minute.</p>
                  <Button className="w-full" variant="secondary">Get started</Button>
                </div>
              </Link>
            </div>

            <div className="mt-8 text-sm text-gray-500">You'll be taken to the appointment form after this step.</div>
          </div>
        </Container>
      </section>
    </MainLayout>
  )
}
