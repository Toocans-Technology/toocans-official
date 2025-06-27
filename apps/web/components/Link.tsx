import { default as NextLink } from 'next/link'
import type { LinkProps } from 'next/link'
import { useParams } from 'next/navigation'
import type { HTMLAttributeAnchorTarget } from 'react'
import { unstable_ViewTransition as ViewTransition } from 'react'
import { defaultLocale } from '@/i18n/config'
import { isAbsoluteUrl } from '@/lib/utils'

interface Props {
  children?: React.ReactNode
  target?: HTMLAttributeAnchorTarget
  className?: string
}

export const Link = ({
  href,
  target,
  children,
  className = '',
  ref,
  ...props
}: LinkProps & Props & { ref?: React.Ref<HTMLAnchorElement> }) => {
  const params = useParams()
  const lang = params?.lang || defaultLocale

  const newHref = isAbsoluteUrl(href as string) ? href : `/${lang}${href}`

  return (
    <ViewTransition>
      <NextLink href={newHref} {...props} ref={ref} target={target} className={className}>
        {children}
      </NextLink>
    </ViewTransition>
  )
}

Link.displayName = 'LinkWithLang'
