import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Container } from '@/Components/Container';
import { Gradient } from '@/Components/Gradient';

export default function Pricing() {
  return (
    <MainLayout title="Pricing - Radiant" description="Pricing plans for Radiant">
      <div className="overflow-hidden">
        <div className="relative">
          <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
          <Container className="relative py-24 sm:py-32">
            <h1 className="text-4xl font-medium tracking-tighter text-pretty text-gray-950 sm:text-6xl">
              Pricing Plans
            </h1>
            <p className="mt-6 max-w-lg text-xl/7 font-medium text-gray-950/75">
              Choose the right plan for your business needs.
            </p>
          </Container>
        </div>

        <Container className="py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Starter Plan */}
            <div className="rounded-lg border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-medium">Starter</h2>
              <p className="mt-4 text-gray-600">Perfect for small teams just getting started</p>
              <p className="mt-6 text-4xl font-bold">$49<span className="text-lg font-normal">/month</span></p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Basic features</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Up to 5 users</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Basic support</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 shadow-md">
              <h2 className="text-2xl font-medium">Pro</h2>
              <p className="mt-4 text-gray-600">For growing teams with more needs</p>
              <p className="mt-6 text-4xl font-bold">$99<span className="text-lg font-normal">/month</span></p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">All Starter features</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Up to 20 users</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Priority support</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-lg border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-medium">Enterprise</h2>
              <p className="mt-4 text-gray-600">For large organizations with custom needs</p>
              <p className="mt-6 text-4xl font-bold">Custom</p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">All Pro features</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">Unlimited users</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="ml-2">24/7 dedicated support</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
