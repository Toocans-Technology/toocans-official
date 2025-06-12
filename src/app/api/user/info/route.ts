import { NextRequest, NextResponse } from 'next/server';
import { LoginUser, DeviceType, Response } from '../types'; // Adjust path as needed

// Mock user data
const mockUser: LoginUser = {
  accountId: 12345,
  avatar: '/images/profile/user-1.jpg',
  clientId: 'some-client-id',
  clientKey: 'some-client-key',
  clientSecret: 'some-client-secret',
  concatMobile: '+11234567890',
  deviceType: DeviceType.PC,
  email: 'user@example.com',
  emailRegistration: true,
  grantType: 'password',
  hasGaKey: false,
  kycLevel: 1,
  language: 'en',
  loginId: 'user_login_id',
  loginName: 'UserLoginName',
  mobile: '1234567890',
  mobileRegistration: false,
  nationalCode: '+1',
  nickname: 'UserNickname',
  registerType: 2, // 1 for phone, 2 for email
  setPassword: true,
  userId: 67890,
  userType: 1,
};

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response: Response = {
      code: 401,
      msg: 'Unauthorized: Missing or invalid Bearer token',
    };
    return NextResponse.json(response, { status: 401 });
  }

  // TODO: Validate the token (e.g., by calling an auth service or verifying a JWT)
  // For now, we'll assume the token is valid if present.
  // const token = authHeader.split(' ')[1];

  const response: Response = {
    code: 0, // Assuming 0 means success
    data: mockUser,
    msg: 'User profile fetched successfully',
  };

  return NextResponse.json(response, { status: 200 });
}
