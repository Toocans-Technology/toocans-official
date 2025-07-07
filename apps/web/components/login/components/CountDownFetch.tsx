'use client'

import { useCodeByEmail, useCodeByMobile } from '@/services/login'
import { useLoginContext } from '../LoginContext'

const CountDownFetch = () => {
  const { formData } = useLoginContext()
  const { email, phone, nationalCode } = formData.getValues()

  !!email && useCodeByEmail({ email })
  !!phone &&
    useCodeByMobile({
      mobile: phone,
      nationalCode,
    })

  return <></>
}

export default CountDownFetch
