import * as Headless from '@headlessui/react'
import { Link as InertiaLink } from '@inertiajs/react'
import { forwardRef } from 'react'

type LinkProps = React.ComponentPropsWithoutRef<typeof InertiaLink>

export const Link = forwardRef(function Link(
  props: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <Headless.DataInteractive>
      <InertiaLink ref={ref} {...props} />
    </Headless.DataInteractive>
  )
})
