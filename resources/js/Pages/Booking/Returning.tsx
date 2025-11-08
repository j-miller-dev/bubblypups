import React, { useState } from 'react'
import MainLayout from '@/Layouts/MainLayout'
import { Container } from '@/Components/layout'
import { Button } from '@/Components/ui'
import { Head, router } from '@inertiajs/react'

export default function Returning() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      setLoading(true)
      // No authentication: optionally store email for convenience
      const payload = { email: form.email }
      localStorage.setItem('bp_returning_prefill', JSON.stringify(payload))
    } catch (err: any) {
      setLoading(false)
      setError('Unable to proceed. Please try again.')
      return
    }
    setLoading(false)
    router.visit('/booking/appointment')
  }

  const isValid = form.email.trim().length > 3

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={(e) => { e.preventDefault(); history.back() }}>Back</Button>
                <Button type="submit" disabled={!isValid || loading}>{loading ? 'Signing in…' : 'Continue to appointment'}</Button>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </MainLayout>
  )
}
