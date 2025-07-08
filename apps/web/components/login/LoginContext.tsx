import React, { createContext, useContext } from 'react'

export interface LoginContextProps {
  formData: any
  grantType: string
  setGrantType: React.Dispatch<React.SetStateAction<string>>
  loginType: string
  setLoginType: React.Dispatch<React.SetStateAction<string>>
  seconds: number
  setSeconds: React.Dispatch<React.SetStateAction<number>>
  cuntrysVisible: boolean
  setCuntrysVisible: React.Dispatch<React.SetStateAction<boolean>>
  phoneCheckState: boolean
  setPhoneCheckState: React.Dispatch<React.SetStateAction<boolean>>
  stateReset: () => void
}

export const LoginContext = createContext<LoginContextProps | null>(null)

export const useLoginContext = () => {
  const ctx = useContext(LoginContext)
  if (!ctx) throw new Error('useLoginContext must be used within LoginContext.Provider')
  return ctx
}
