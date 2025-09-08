// 邮箱正则
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const ONE_MINUTE_COUNT_DOWN = 59 * 1000

export const VERIFICATION_CODE_REGEX = /^\d{6}$/

export const SYMBOL_ICON_PLACEHOLDER = 'https://dummyimage.com/18x18/999999/0011ff'

// 密码正则
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,32}$/

export const INPUT_DEFAULT_VALUE = { value: '', error: '', isInvalid: false }

export const NUMBER_REGEX = /^\d+$/
