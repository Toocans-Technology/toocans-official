import * as React from 'react'
import { cn } from '@workspace/ui/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-brand selection:text-primary-foreground dark:bg-input/30 flex h-11 w-full min-w-0 rounded-md bg-[#f8f8f8] p-2.5 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'hover:border-ring hover:ring-brand hover:ring-[1px]',
        'focus-visible:border-ring focus-visible:ring-brand focus-visible:ring-[1px]',
        'aria-invalid:ring-destructive aria-invalid:border-destructive aria-invalid:ring-[1px]',
        className
      )}
      {...props}
      style={{
        caretColor: 'oklch(0.74 0.18 154 / 0.5)',
      }}
    />
  )
}

export { Input }
