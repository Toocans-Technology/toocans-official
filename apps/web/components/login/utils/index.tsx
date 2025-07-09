import { isValidNumber } from 'libphonenumber-js'
import { emailReg } from '@/data'

export const matchEmail = (val: string) => {
  return emailReg.test(val)
}

export const matchPhoneNum = (nationalCode: string, val: string) => {
  return isValidNumber(`+${nationalCode}${val}`)
}
