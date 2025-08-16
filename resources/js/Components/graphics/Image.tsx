import { clsx } from 'clsx'
import React from 'react'

type ImageProps = {
  src: string
  alt?: string
  width?: number
  height?: number
  className?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full'
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait' | 'landscape' | string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  placeholder?: React.ReactNode
}

export function Image({
  src,
  alt = '',
  width,
  height,
  className = '',
  rounded = 'lg',
  aspectRatio = 'auto',
  objectFit = 'cover',
  placeholder,
}: ImageProps) {
  const [error, setError] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  // Handle image load error
  const handleError = () => {
    setError(true)
  }

  // Handle image load success
  const handleLoad = () => {
    setLoaded(true)
  }

  // Determine aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'video':
        return 'aspect-video'
      case 'portrait':
        return 'aspect-[3/4]'
      case 'landscape':
        return 'aspect-[4/3]'
      case 'auto':
        return ''
      default:
        return `aspect-[${aspectRatio}]`
    }
  }

  // Determine rounded class
  const getRoundedClass = () => {
    switch (rounded) {
      case 'none':
        return ''
      case 'sm':
        return 'rounded-sm'
      case 'md':
        return 'rounded-md'
      case 'lg':
        return 'rounded-lg'
      case 'xl':
        return 'rounded-xl'
      case '2xl':
        return 'rounded-2xl'
      case '3xl':
        return 'rounded-3xl'
      case '4xl':
        return 'rounded-4xl'
      case 'full':
        return 'rounded-full'
      default:
        return 'rounded-lg'
    }
  }

  // Default placeholder if none provided
  const defaultPlaceholder = (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
      <svg
        className="h-12 w-12 text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 640 512"
      >
        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
      </svg>
    </div>
  )

  return (
    <div
      className={clsx(
        className,
        getAspectRatioClass(),
        getRoundedClass(),
        'overflow-hidden bg-gray-100',
        width && `w-[${width}px]`,
        height && `h-[${height}px]`
      )}
    >
      {error || !src ? (
        placeholder || defaultPlaceholder
      ) : (
        <>
          <img
            src={src}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            className={clsx(
              'h-full w-full transition-opacity duration-300',
              objectFit === 'contain' && 'object-contain',
              objectFit === 'cover' && 'object-cover',
              objectFit === 'fill' && 'object-fill',
              objectFit === 'none' && 'object-none',
              objectFit === 'scale-down' && 'object-scale-down',
              !loaded && 'opacity-0',
              loaded && 'opacity-100'
            )}
          />
          {!loaded && (placeholder || defaultPlaceholder)}
        </>
      )}
    </div>
  )
}
