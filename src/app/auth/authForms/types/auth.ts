export interface Country {
    countryEnName?: string;
    countryName?: string;
    created?: number;
    customOrder?: string;
    domainShortName?: string;
    id?: number;
    nationalCode?: string;
    status?: number;
  }
  
  export interface Response {
    code?: number;
    data?: Country[];
    msg?: string;
  }
  
  export interface LoginType {
    title?: string;
    subtitle?: React.ReactNode;
    subtext?: React.ReactNode;
  }

// Request interface for sending SMS verification code
export interface PhoneVerificationRequest {
  /**
   * User's phone number
   */
  mobile: string;
  /**
   * Country's national code
   */
  nationalCode: string;
  [property: string]: any; // Allow for additional properties if any
}

// Response interface for SMS verification code API
export interface PhoneVerificationResponse {
  /**
   * Response code, typically 0 for success
   */
  code?: number;
  /**
   * Response data, can be any object
   */
  data?: { [key: string]: any };
  /**
   * Response message
   */
  msg?: string;
  [property: string]: any; // Allow for additional properties if any
}