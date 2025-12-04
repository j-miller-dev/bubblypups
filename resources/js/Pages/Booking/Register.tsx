import React, { useState } from 'react'
import MainLayout from '@/Layouts/MainLayout'
import { Container } from '@/Components/layout'
import { Button } from '@/Components/ui'
import { Head, router } from '@inertiajs/react'

export default function CustomerRegister() {
  const [owner, setOwner] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [dog, setDog] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    notes: '',
  })
  const [passwords, setPasswords] = useState({
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // No authentication - simply stash the customer and dog details
    try {
      setLoading(true)
      const payload = { owner, dog }
      localStorage.setItem('bp_pre_reg', JSON.stringify(payload))
    } catch (err: any) {
      setLoading(false)
      setError('Failed to save your info locally. Please try again.')
      return
    }

    setLoading(false)
    router.visit('/booking/appointment')
  }

  const isValid = !!(owner.name && dog.name)

  return (
    <MainLayout title="CustomerRegister | Bubbly Pups">
      <Head>
        <title>New Customer Registration | Bubbly Pups</title>
      </Head>
      <section className="bg-white py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">New Customer Registration</h1>
            <p className="text-gray-600 mb-8">Tell us a little about you and your pup. You’ll schedule your appointment on the next step.</p>

            <form onSubmit={onSubmit} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Your details</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} required/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input type="tel" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={owner.phone} onChange={(e) => setOwner({ ...owner, phone: e.target.value })}/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address (optional)</label>
                  <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={owner.address} onChange={(e) => setOwner({ ...owner, address: e.target.value })}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Create password</label>
                    <input type="password" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                    <input type="password" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={passwords.password_confirmation} onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })} required/>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-medium">Your dog</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dog's name</label>
                  <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={dog.name} onChange={(e) => setDog({ ...dog, name: e.target.value })} required/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                    <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={dog.breed} onChange={(e) => setDog({ ...dog, breed: e.target.value })}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={dog.age} onChange={(e) => setDog({ ...dog, age: e.target.value })}/>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={dog.weight} onChange={(e) => setDog({ ...dog, weight: e.target.value })}/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={dog.notes} onChange={(e) => setDog({ ...dog, notes: e.target.value })}/>
                  </div>
                </div>
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
