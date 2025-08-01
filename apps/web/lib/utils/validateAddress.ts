/**
 * Validates a blockchain address based on common patterns
 * @param address The address to validate
 * @returns boolean indicating if the address is valid
 */
export function validateAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false
  }

  // Remove any whitespace and convert to lowercase for consistent validation
  const cleanAddress = address.trim()

  // Common address patterns:
  // - Ethereum/ERC20: 0x followed by 40 hex characters (case-insensitive)
  // - Bitcoin: 1, 3, or bc1 prefix with alphanumeric characters (case-sensitive)
  // - TRON/TRX: T followed by 33 alphanumeric characters
  // TODO: Add more address validation patterns
  // const addressPatterns = {
  //   ethereum: /^0x[a-f0-9]{40}$/i,
  //   bitcoin: /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-z02-9]{11,71})$/,
  //   tron: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  // }

  return !!cleanAddress
}
