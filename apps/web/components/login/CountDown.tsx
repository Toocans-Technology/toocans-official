'use client'

import { FunctionComponent, useState, useEffect, useRef } from 'react'
import { Button } from '@workspace/ui/components'
import { useT } from '@/i18n'

const CountDown: FunctionComponent = () => {
  const [seconds, setSeconds] = useState(60)

  const timerRef: any = useRef(null)

  const handleGetCode = () => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 60))
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (seconds == 0) clearInterval(timerRef.current)
    }
  }, [seconds])

  const { t } = useT('login')

  return (
    <Button
      className="absolute right-1 top-1/2 h-5 w-6 -translate-y-1/2 text-xs text-[#3C7BF4] hover:bg-transparent hover:text-[#3C7BF4]"
      variant="ghost"
      disabled={seconds < 60}
      onClick={() => handleGetCode()}
    >
      {seconds === 60 ? t('send') : seconds}
    </Button>
  )
}

export default CountDown
