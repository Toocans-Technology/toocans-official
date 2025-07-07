import { isValidNumber } from 'libphonenumber-js'

export const matchEmail = (val: string) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/.test(val)
}

export const matchPhoneNum = (nationalCode: string, val: string) => {
  return isValidNumber(`+${nationalCode}${val}`)
}
