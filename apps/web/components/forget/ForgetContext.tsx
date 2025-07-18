import React, { createContext, useContext } from 'react'
import { GrantType } from '@/components/login/data'

export interface ForgetContextProps {
  formData: any
  grantType: GrantType
  userToken: string | null
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>
  setGrantType: React.Dispatch<React.SetStateAction<GrantType>>
  seconds?: number
  step: number
  cuntrysVisible: boolean
  setCuntrysVisible: React.Dispatch<React.SetStateAction<boolean>>
  setStep: React.Dispatch<React.SetStateAction<number>>
  stateReset: () => void
}

export const ForgetContext = createContext<ForgetContextProps | null>(null)

export const useForgetContext = () => {
  const ctx = useContext(ForgetContext)
  if (!ctx) throw new Error('useForgetContext must be used within ForgetContext.Provider')
  return ctx
}
