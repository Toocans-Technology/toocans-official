'use client'

import { XIcon } from 'lucide-react'
import { FunctionComponent } from 'react'
import { Input as InputBase } from '@workspace/ui/components'
import { cn } from '@workspace/ui/lib/utils'

interface Props extends React.ComponentProps<'input'> {
  invalid?: boolean // 是否显示错误提示
  startContent?: React.ReactNode // 输入框的左侧内容
  endContent?: React.ReactNode // 输入框的右侧内容
  className?: string // 输入框的类名
  inputClassName?: string // 输入框的类名
  showClear?: boolean // 是否显示清除按钮
}

const Input: FunctionComponent<Props> = ({
  value,
  invalid,
  startContent,
  endContent,
  className,
  inputClassName,
  showClear = true,
  onChange,
  ...props
}) => {
  return (
    <div
      aria-invalid={invalid}
      className={cn(
        'hover:border-ring hover:ring-brand aria-invalid:border-ring aria-invalid:ring-destructive aria-invalid:ring-[1px] flex items-center gap-2 overflow-hidden rounded-md bg-[#f8f8f8] px-3 hover:ring-[1px]',
        className
      )}
    >
      {startContent}
      <InputBase
        autoComplete="off"
        className={cn('aria-invalid:ring-0 px-0 hover:ring-0 focus-visible:ring-0', inputClassName)}
        value={value}
        onChange={onChange}
        {...props}
      />
      {showClear && value && (
        <span
          className="inline-flex h-4 min-w-4 cursor-pointer items-center justify-center rounded-full bg-[#666] hover:bg-[#999]"
          onClick={() => {
            onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
          }}
        >
          <XIcon color="#fff" size={12} />
        </span>
      )}
      {endContent}
    </div>
  )
}

export default Input
