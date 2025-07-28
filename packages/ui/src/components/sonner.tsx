'use client'

import { X } from 'lucide-react'
import { Toaster as Sonner, ToasterProps, toast } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'dark'}
      className="toaster group"
      style={
        {
          '--normal-bg': '#3F3F47',
          '--normal-text': '#fff',
          '--border-radius': '8px',
        } as React.CSSProperties
      }
      icons={{
        error: (
          <span className="icon flex h-4 w-4 items-center justify-center rounded-full bg-[#FF476F]">
            <X size={12} strokeWidth={2} color="#3F3F47" />
          </span>
        ),
      }}
      toastOptions={{
        classNames: {
          success: '[&>.icon]:text-[#1ACA75]',
          info: '[&>.icon]:text-[#FFCC00]',
          icon: 'icon',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
