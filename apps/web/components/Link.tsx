'use client'

import { default as NextLink } from 'next/link'
import type { LinkProps } from 'next/link'
import { useParams } from 'next/navigation'
import type { HTMLAttributeAnchorTarget, ReactNode, Ref } from 'react'
import { defaultLocale } from '@/i18n/config'
import { isAbsoluteUrl } from '@/lib/utils'

interface Props {
  children?: ReactNode
  target?: HTMLAttributeAnchorTarget
  className?: string
}

const Link = ({
  href,
  target,
  children,
  className = '',
  ref,
  ...props
}: LinkProps & Props & { ref?: Ref<HTMLAnchorElement> }) => {
  const params = useParams()
  const lang = params?.lang || defaultLocale
  const newHref = isAbsoluteUrl(href as string) ? href : `/${lang}${href}`

  return (
    <NextLink href={newHref} {...props} ref={ref} target={target} className={className}>
      {children}
    </NextLink>
  )
}

Link.displayName = 'LinkWithLang'

export default Link
