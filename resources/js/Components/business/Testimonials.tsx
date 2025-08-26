import * as Headless from '@headlessui/react'
import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import {
  MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import useMeasure, { type RectReadOnly } from 'react-use-measure'
import { Container } from '../layout/Container'
import { Link } from '../ui/Link'
import { Heading, Subheading } from '../ui/Text'
import { SectionHeading } from "@/Components/graphics";

// Dog grooming testimonials
const testimonials = [
  {
    img: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=600&fit=crop&crop=face',
    name: 'Sarah Mitchell',
    title: 'Buddy (Golden Retriever) • Sunbury',
    quote:
      'Amazing service! Buddy has never looked so good. The team was so gentle and professional. Highly recommend for any dog owner in Sunbury!',
  },
  {
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
    name: 'James Thompson',
    title: 'Luna (Border Collie) • Diggers Rest',
    quote:
      'Luna was so nervous about grooming, but the team made her feel completely at ease. The results were fantastic - she looks like a show dog!',
  },
  {
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
    name: 'Emily Rodriguez',
    title: 'Max (French Bulldog) • Sunbury',
    quote:
      'Incredible attention to detail! Max\'s nails were perfectly trimmed and his coat is so shiny. The mobile service is so convenient too.',
  },
  {
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
    name: 'Michael Chen',
    title: 'Bella (Labrador) • Fraser Rise',
    quote:
      'Bella has been going for 6 months now and loves it every time. Professional, caring, and reasonably priced. Couldn\'t ask for better!',
  },
  {
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
    name: 'Jessica Parker',
    title: 'Charlie (Poodle) • Sunbury',
    quote: 'Charlie\'s coat has never looked better! The team knows exactly how to handle different breeds. Five stars all the way!',
  },
  {
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
    name: 'David Wilson',
    title: 'Ruby (Beagle) • Sunbury',
    quote:
      'Ruby used to hate bath time, but now she gets excited when she sees the grooming van! The transformation is amazing every single time.',
  },
]

function TestimonialCard({
  name,
  title,
  img,
  children,
  bounds,
  scrollX,
  ...props
}: {
  img: string
  name: string
  title: string
  children: React.ReactNode
  bounds: RectReadOnly
  scrollX: MotionValue<number>
} & HTMLMotionProps<'div'>) {
  let ref = useRef<HTMLDivElement | null>(null)

  let computeOpacity = useCallback(() => {
    let element = ref.current
    if (!element || bounds.width === 0) return 1

    let rect = element.getBoundingClientRect()

    if (rect.left < bounds.left) {
      let diff = bounds.left - rect.left
      let percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else if (rect.right > bounds.right) {
      let diff = rect.right - bounds.right
      let percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else {
      return 1
    }
  }, [ref, bounds.width, bounds.left, bounds.right])

  let opacity = useSpring(computeOpacity(), {
    stiffness: 154,
    damping: 23,
  })

  useLayoutEffect(() => {
    opacity.set(computeOpacity())
  }, [computeOpacity, opacity])

  useMotionValueEvent(scrollX, 'change', () => {
    opacity.set(computeOpacity())
  })

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      {...props}
      className="relative flex aspect-[9/16] w-72 shrink-0 snap-start scroll-ml-[var(--scroll-padding)] flex-col justify-end overflow-hidden rounded-3xl sm:aspect-[3/4] sm:w-96"
    >
      <img
        alt=""
        src={img}
        className="absolute inset-x-0 top-0 aspect-square w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black from-[calc(7/16*100%)] ring-1 ring-gray-950/10 ring-inset sm:from-[25%]"
      />
      <figure className="relative p-10">
        <blockquote>
          <p className="relative text-xl leading-7 text-white">
            <span aria-hidden="true" className="absolute -translate-x-full">
              "
            </span>
            {children}
            <span aria-hidden="true" className="absolute">
              "
            </span>
          </p>
        </blockquote>
        <figcaption className="mt-6 border-t border-white/20 pt-6">
          <p className="text-sm leading-6 font-medium text-white">{name}</p>
          <p className="text-sm leading-6 font-medium">
            <span className="bg-gradient-to-r from-[#fff1be] from-[28%] via-[#ee87cb] via-[70%] to-[#b060ff] bg-clip-text text-transparent">
              {title}
            </span>
          </p>
        </figcaption>
      </figure>
    </motion.div>
  )
}

function CallToAction() {
  return (
    <div>
      <p className="max-w-sm text-sm/6 text-gray-600">
        Join hundreds of happy pet owners in Sunbury and surrounding areas. Book your dog's grooming session today.
      </p>
      <div className="mt-2">
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 text-sm leading-6 font-medium text-pink-600"
        >
          Book Now
          <ArrowLongRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}

export function Testimonials() {
  let scrollRef = useRef<HTMLDivElement | null>(null)
  let { scrollX } = useScroll({ container: scrollRef })
  let [setReferenceWindowRef, bounds] = useMeasure()
  let [activeIndex, setActiveIndex] = useState(0)

  useMotionValueEvent(scrollX, 'change', (x) => {
    if (scrollRef.current && scrollRef.current.children[0]) {
      setActiveIndex(Math.floor(x / scrollRef.current.children[0].clientWidth))
    }
  })

  function scrollTo(index: number) {
    if (scrollRef.current && scrollRef.current.children[0]) {
      let gap = 32
      let width = (scrollRef.current.children[0] as HTMLElement).offsetWidth
      scrollRef.current.scrollTo({ left: (width + gap) * index })
    }
  }

  return (
    <div className="overflow-hidden py-32">
      <Container>
        <div ref={setReferenceWindowRef}>
            <SectionHeading
                subtitle="The word around town"
                title="What the Sunbury locals are saying..."
                theme="light"
            />
        </div>
      </Container>
      <div
        ref={scrollRef}
        className={clsx([
          'mt-16 flex gap-8',
          'px-6 lg:px-8',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
        ])}
      >
        {testimonials.map(({ img, name, title, quote }, testimonialIndex) => (
          <TestimonialCard
            key={testimonialIndex}
            name={name}
            title={title}
            img={img}
            bounds={bounds}
            scrollX={scrollX}
            onClick={() => scrollTo(testimonialIndex)}
          >
            {quote}
          </TestimonialCard>
        ))}
        <div className="w-96 shrink-0 sm:w-[54rem]" />
      </div>
      <Container className="mt-16">
        <div className="flex justify-between">
          <CallToAction />
          <div className="hidden sm:flex sm:gap-2">
            {testimonials.map(({ name }, testimonialIndex) => (
              <Headless.Button
                key={testimonialIndex}
                onClick={() => scrollTo(testimonialIndex)}
                data-active={
                  activeIndex === testimonialIndex ? true : undefined
                }
                aria-label={`Scroll to testimonial from ${name}`}
                className={clsx(
                  'h-2.5 w-2.5 rounded-full border border-transparent bg-gray-300 transition',
                  'data-[active=true]:bg-gray-400 hover:bg-gray-400 focus:outline-offset-4',
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
