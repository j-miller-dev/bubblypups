import React from 'react'
import { Container } from '@/Components/Container'
import { Image } from '@/Components/Image'
import SectionHeading from "@/Components/SectionHeading.tsx";

export function AboutMe() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
              <div className="py-16 bg-white">
                  <SectionHeading
                      subtitle="Meet your local Dog Groomer"
                      title="Making your dogs look and feel beautiful."
                      theme="light"
                  />
              </div>
            <p className="mt-4 text-gray-700 leading-relaxed text-center">
              Hey! I’m Clarissa, the heart behind Bubbly Pups — a gentle, patient groomer who believes every pup
              deserves a calm, loving spa day. From bubbly baths to tidy trims, I focus on making your
              dog feel safe, happy, and absolutely adorable. Clean, cute, and professional — always.
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed text-center md:text-left">
              New to grooming? Nervous pup? No worries. I take my time and tailor each visit to your
              dog’s needs. Let’s make grooming a treat they’ll wag about!
            </p>
          </div>
          <div className="mx-auto w-full max-w-md">
            <Image
              src="/images/about-me-stock.avif"
              alt="Bubbly Pups – friendly groomer with a happy dog"
              rounded="3xl"
              aspectRatio="portrait"
              objectFit="cover"
              className="shadow-xl ring-1 ring-black/5"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
