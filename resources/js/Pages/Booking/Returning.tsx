import React, { useState } from 'react'
import MainLayout from '@/Layouts/MainLayout'
import { Container } from '@/Components/layout'
import { Button } from '@/Components/ui'
import { Head, router } from '@inertiajs/react'

export default function Returning() {
  const [form, setForm] = useState({ identifier: '', dogName: '' })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, validate against backend. For now, just proceed.
    try {
      localStorage.setItem('bp_returning', JSON.stringify(form))
    } catch (_) {}
    router.visit('/booking/appointment')
  }

  const isValid = form.identifier.trim().length > 3 && form.dogName.trim().length > 0

  return (
    <MainLayout title="Returning Customer | Bubbly Pups">
      <Head>
        <title>Returning Customer Login | Bubbly Pups</title>
      </Head>
      <section className="bg-white py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-md">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Welcome back!</h1>
            <p className="text-gray-600 mb-8">Log in with your email or mobile number and your dog's name.</p>

            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile</label>
                <input
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dog's Name</label>
                <input
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.dogName}
                  onChange={(e) => setForm({ ...form, dogName: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={(e) => { e.preventDefault(); history.back() }}>Back</Button>
                <Button type="submit" disabled={!isValid}>Continue to appointment</Button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </MainLayout>
  )
}
