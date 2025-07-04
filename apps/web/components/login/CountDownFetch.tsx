'use client'

import { useCodeByEmail, useCodeByMobile } from '@/services/login'

const CountDownFetch = (props: any) => {
  const { email, phone, nationalCode } = props.getValues()

  !!email && useCodeByEmail({ email })
  !!phone &&
    useCodeByMobile({
      mobile: phone,
      nationalCode,
    })

  return <></>
}

export default CountDownFetch
