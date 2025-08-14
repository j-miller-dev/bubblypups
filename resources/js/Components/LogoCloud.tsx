import { clsx } from 'clsx'

type Logo = {
  alt: string
  src: string
}

type LogoCloudProps = {
  logos?: Logo[]
  className?: string
}

export function LogoCloud({
  logos = [
    { alt: 'SavvyCal', src: '/logo-cloud/savvycal.svg' },
    { alt: 'Laravel', src: '/logo-cloud/laravel.svg' },
    { alt: 'Tuple', src: '/logo-cloud/tuple.svg' },
    { alt: 'Transistor', src: '/logo-cloud/transistor.svg' },
    { alt: 'Statamic', src: '/logo-cloud/statamic.svg' },
  ],
  className,
}: LogoCloudProps) {
  return (
    <div
      className={clsx(
        className,
        'flex justify-between max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4',
      )}
    >
      {logos.map((logo, index) => (
        <img
          key={index}
          alt={logo.alt}
          src={logo.src}
          className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
        />
      ))}
    </div>
  )
}
