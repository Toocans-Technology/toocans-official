// src/app/types/googleAuth.ts

/**
 * GoogleAuthDTO, Google验证器DTO
 */
export interface GoogleAuthDTO {
  /**
   * 二维码URL
   */
  qrCodeUrl?: string;
  /**
   * 密钥
   */
  secretKey?: string;
  [property: string]: any;
}

export interface GenerateGoogleAuthRequest {
  tokenId?: string;
  [property: string]: any;
}

export interface GenerateGoogleAuthResponse {
  code?: number;
  data?: GoogleAuthDTO;
  msg?: string;
  [property: string]: any;
}

export interface VerifyGoogleAuthParams {
  /**
   * 验证码
   */
  code: string;
  /**
   * 密钥
   */
  secretKey: string;
  [property: string]: any;
}

/**
 * RVoid, 响应信息主体
 */
export interface VerifyGoogleAuthResponse {
  code?: number;
  data?: null;
  msg?: string;
  [property: string]: any;
}
