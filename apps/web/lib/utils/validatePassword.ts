export enum PasswordErrorType {
  lowercase = 'lowercase',
  uppercase = 'uppercase',
  number = 'number',
  length = 'length',
}

export const validatePassword = (val: string) => {
  if (!/[a-z]/.test(val)) {
    return {
      errorType: PasswordErrorType.lowercase,
      status: false,
    }
  }

  if (!/[A-Z]/.test(val)) {
    return {
      errorType: PasswordErrorType.uppercase,
      status: false,
    }
  }

  if (!/[0-9]/.test(val)) {
    return {
      errorType: PasswordErrorType.number,
      status: false,
    }
  }

  if (val.length < 8 || val.length > 32) {
    return {
      errorType: PasswordErrorType.length,
      status: false,
    }
  }

  return {
    errorType: null,
    status: true,
  }
}
