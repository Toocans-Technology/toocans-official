export const isDevEnvironment = () => process.env.NEXT_PUBLIC_ENV_NAME === 'development'

export const isTestingEnvironment = () =>
  process.env.NEXT_PUBLIC_ENV_NAME === 'dev' ||
  process.env.NEXT_PUBLIC_ENV_NAME === 'pre' ||
  process.env.NEXT_PUBLIC_ENV_NAME === 'test'

export const isOnlineEnvironment = () => process.env.NEXT_PUBLIC_ENV_NAME === 'production'

export const isTranslateEnvironment = () => isDevEnvironment() && process.env.NODE_ENV === 'production'

export const isLocalhost = (str: string) => str.includes('localhost')
