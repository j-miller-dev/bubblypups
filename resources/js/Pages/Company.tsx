import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Container } from '@/Components/layout';
import { Gradient } from '@/Components/graphics';
import { Image } from '@/Components/graphics';

export default function Company() {
  return (
    <MainLayout title="Company - Radiant" description="About Radiant - Our mission, values, and team">
      <div className="overflow-hidden">
        <div className="relative">
          <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
          <Container className="relative py-24 sm:py-32">
            <h1 className="text-4xl font-medium tracking-tighter text-pretty text-gray-950 sm:text-6xl">
              About Radiant
            </h1>
            <p className="mt-6 max-w-lg text-xl/7 font-medium text-gray-950/75">
              We're on a mission to revolutionize how businesses connect with their customers.
            </p>
          </Container>
        </div>

        <Container className="py-24">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-medium tracking-tight text-gray-900">Our Mission</h2>
              <p className="mt-6 text-lg text-gray-600">
                At Radiant, we believe in the power of data to transform businesses. Our mission is to provide
                cutting-edge tools that help sales teams understand their customers better, build meaningful
                relationships, and close more deals.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We're committed to innovation, transparency, and delivering exceptional value to our customers.
              </p>
            </div>
            <Image
              src="/company/mission.jpg"
              alt="Our mission at Radiant"
              className="h-64"
              aspectRatio="landscape"
            />
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900">Our Team</h2>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl">
              We're a diverse team of engineers, designers, and business professionals passionate about
              building products that make a difference.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Team Member 1 */}
              <div className="flex flex-col items-center">
                <Image
                  src="/team/jane-smith.jpg"
                  alt="Jane Smith"
                  className="h-40 w-40"
                  rounded="full"
                  aspectRatio="square"
                />
                <h3 className="mt-6 text-xl font-medium text-gray-900">Jane Smith</h3>
                <p className="text-gray-600">CEO & Co-Founder</p>
              </div>

              {/* Team Member 2 */}
              <div className="flex flex-col items-center">
                <Image
                  src="/team/john-doe.jpg"
                  alt="John Doe"
                  className="h-40 w-40"
                  rounded="full"
                  aspectRatio="square"
                />
                <h3 className="mt-6 text-xl font-medium text-gray-900">John Doe</h3>
                <p className="text-gray-600">CTO & Co-Founder</p>
              </div>

              {/* Team Member 3 */}
              <div className="flex flex-col items-center">
                <Image
                  src="/team/sarah-johnson.jpg"
                  alt="Sarah Johnson"
                  className="h-40 w-40"
                  rounded="full"
                  aspectRatio="square"
                />
                <h3 className="mt-6 text-xl font-medium text-gray-900">Sarah Johnson</h3>
                <p className="text-gray-600">Head of Product</p>
              </div>
            </div>
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-medium tracking-tight text-gray-900">Our Values</h2>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-8">
                <h3 className="text-xl font-medium text-gray-900">Innovation</h3>
                <p className="mt-4 text-gray-600">
                  We're constantly pushing the boundaries of what's possible to deliver cutting-edge solutions.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-8">
                <h3 className="text-xl font-medium text-gray-900">Customer Focus</h3>
                <p className="mt-4 text-gray-600">
                  Our customers are at the heart of everything we do. Their success is our success.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 p-8">
                <h3 className="text-xl font-medium text-gray-900">Integrity</h3>
                <p className="mt-4 text-gray-600">
                  We believe in doing business with honesty, transparency, and respect.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
