/**
 * Utility functions for data handling and formatting
 */

/**
 * Masks an email address for privacy protection
 * Shows first 2 characters of username and domain, masks the middle with exactly 3 asterisks
 * @param email - The email address to mask
 * @returns The masked email address
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email;
  }
  
  const [username, domain] = email.split('@');
  
  // Keep first 2 characters of username, mask the rest with exactly 3 asterisks
  if (username.length <= 2) {
    return email; // Too short to mask
  }
  
  const maskedUsername = username.substring(0, 2) + '***';
  
  // Keep first 2 characters of domain, mask the rest with exactly 3 asterisks
  let maskedDomain = domain;
  if (domain.length > 2) {
    maskedDomain = domain.substring(0, 2) + '***';
  }
  
  return `${maskedUsername}@${maskedDomain}`;
};

/**
 * Masks a phone number for privacy protection
 * Shows first 2 digits and last 3 digits, masks the middle with exactly 3 asterisks
 * @param phone - The phone number to mask
 * @returns The masked phone number
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 6) { // Need at least 6 digits to mask meaningfully
    return phone;
  }
  
  const firstTwoDigits = phone.substring(0, 2);
  const lastThreeDigits = phone.slice(-3);
  const maskedMiddle = '***'; // Always use exactly 3 asterisks
  
  return `${firstTwoDigits}${maskedMiddle}${lastThreeDigits}`;
};
