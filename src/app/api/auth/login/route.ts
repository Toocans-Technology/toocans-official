import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, RLoginVo, EmailLoginRequest, SmsLoginRequest, PasswordLoginRequest } from './types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // Basic validation
    if (!body.clientId || !body.grantType) {
      return NextResponse.json({ code: 400, msg: 'Missing clientId or grantType' }, { status: 400 });
    }

    let responseData: RLoginVo;

    switch (body.grantType) {
      case 'email':
        // TODO: Implement actual email and emailCode verification
        const emailReq = body as EmailLoginRequest;
        if (!emailReq.email || !emailReq.emailCode) {
          return NextResponse.json({ code: 400, msg: 'Missing email or emailCode for email grant type' }, { status: 400 });
        }
        console.log(`Processing email login for: ${emailReq.email}`);
        responseData = {
          code: 0, // Using 0 for success as per typical conventions, not specified in issue for success
          data: {
            access_token: 'mock_access_token_email_' + Date.now(),
            client_id: emailReq.clientId,
            expire_in: 3600,
            refresh_expire_in: 7200,
            refresh_token: 'mock_refresh_token_email_' + Date.now(),
            scope: 'user',
          },
          msg: 'Login successful (email)',
        };
        break;

      case 'sms':
        // TODO: Implement actual SMS code verification
        const smsReq = body as SmsLoginRequest;
        if (!smsReq.nationalCode || !smsReq.phonenumber || !smsReq.smsCode) {
          return NextResponse.json({ code: 400, msg: 'Missing nationalCode, phonenumber, or smsCode for sms grant type' }, { status: 400 });
        }
        console.log(`Processing SMS login for: ${smsReq.nationalCode}-${smsReq.phonenumber}`);
        responseData = {
          code: 0,
          data: {
            access_token: 'mock_access_token_sms_' + Date.now(),
            client_id: smsReq.clientId,
            expire_in: 3600,
            refresh_expire_in: 7200,
            refresh_token: 'mock_refresh_token_sms_' + Date.now(),
            scope: 'user',
          },
          msg: 'Login successful (sms)',
        };
        break;

      case 'password':
        // TODO: Implement actual username and password verification
        const passwordReq = body as PasswordLoginRequest;
        if (!passwordReq.username || typeof passwordReq.password === 'undefined') { // password can be an empty string
          return NextResponse.json({ code: 400, msg: 'Missing username or password for password grant type' }, { status: 400 });
        }
        console.log(`Processing password login for: ${passwordReq.username}`);
        responseData = {
          code: 0,
          data: {
            access_token: 'mock_access_token_password_' + Date.now(),
            client_id: passwordReq.clientId,
            expire_in: 3600,
            refresh_expire_in: 7200,
            refresh_token: 'mock_refresh_token_password_' + Date.now(),
            scope: 'user',
          },
          msg: 'Login successful (password)',
        };
        break;

      default:
        // @ts-expect-error - grantType could be something else
        return NextResponse.json({ code: 400, msg: `Unsupported grantType: ${body.grantType}` }, { status: 400 });
    }

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    let message = 'An unexpected error occurred';
    if (error instanceof Error) {
        message = error.message;
    }
    // It's good practice to avoid sending detailed error messages to the client in production
    return NextResponse.json({ code: 500, msg: 'Internal Server Error', errorDetails: message }, { status: 500 });
  }
}
