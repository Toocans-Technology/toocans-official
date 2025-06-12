// Request types
export interface EmailLoginRequest {
  clientId: string;
  grantType: "email";
  code?: string | null;
  uuid?: string | null;
  channel?: string | null;
  source?: string | null;
  inputInviteCode?: string | null;
  appInfo?: any | null;
  email: string;
  emailCode: string;
}

export interface SmsLoginRequest {
  clientId: string;
  grantType: "sms";
  code?: string | null;
  uuid?: string | null;
  channel?: string | null;
  source?: string | null;
  inputInviteCode?: string | null;
  appInfo?: any | null;
  nationalCode: string;
  phonenumber: string;
  smsCode: string;
}

export interface PasswordLoginRequest {
  clientId: string;
  grantType: "password";
  code?: string | null;
  uuid?: string | null;
  channel?: string | null;
  source?: string | null;
  inputInviteCode?: string | null;
  appInfo?: any | null;
  username: string;
  password?: string; // Made password optional as per issue comment for username
}

export type LoginRequest = EmailLoginRequest | SmsLoginRequest | PasswordLoginRequest;

// Response type
export interface LoginVo {
  access_token?: string;
  client_id?: string;
  expire_in?: number;
  refresh_expire_in?: number;
  refresh_token?: string;
  scope?: string;
  [property: string]: any;
}

export interface RLoginVo {
  code?: number;
  data?: LoginVo;
  msg?: string;
  [property: string]: any;
}
