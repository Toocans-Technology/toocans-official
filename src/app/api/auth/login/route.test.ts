import { POST } from './route'; // Adjust the import path as necessary
import { NextRequest } from 'next/server';
import { EmailLoginRequest, SmsLoginRequest, PasswordLoginRequest } from './types';

// Mock NextRequest
const mockRequest = (body: any): NextRequest => {
  return {
    json: async () => body,
    // Add other properties and methods if your POST handler uses them
  } as NextRequest;
};

describe('Login API POST Handler', () => {
  const basePayload = {
    clientId: '24b5d2a7f4714409b4cc60bafc1dd2f6',
    code: null,
    uuid: null,
    channel: null,
    source: null,
    inputInviteCode: null,
    appInfo: null,
  };

  // Test suite for Email Login
  describe('Email Login', () => {
    it('should return a successful response for valid email login', async () => {
      const emailLoginPayload: EmailLoginRequest = {
        ...basePayload,
        grantType: 'email',
        email: 'test@example.com',
        emailCode: '123456',
      };
      const request = mockRequest(emailLoginPayload);
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.code).toBe(0);
      expect(responseBody.msg).toBe('Login successful (email)');
      expect(responseBody.data).toHaveProperty('access_token');
      expect(responseBody.data.client_id).toBe(emailLoginPayload.clientId);
    });

    it('should return 400 if email is missing', async () => {
      const payload = { ...basePayload, grantType: 'email', emailCode: '123456' };
      // @ts-expect-error - testing invalid payload
      const request = mockRequest(payload);
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.msg).toBe('Missing email or emailCode for email grant type');
    });

    it('should return 400 if emailCode is missing', async () => {
      const payload = { ...basePayload, grantType: 'email', email: 'test@example.com' };
      // @ts-expect-error - testing invalid payload
      const request = mockRequest(payload);
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.msg).toBe('Missing email or emailCode for email grant type');
    });
  });

  // Test suite for SMS Login
  describe('SMS Login', () => {
    it('should return a successful response for valid SMS login', async () => {
      const smsLoginPayload: SmsLoginRequest = {
        ...basePayload,
        grantType: 'sms',
        nationalCode: '86',
        phonenumber: '13800138000',
        smsCode: '654321',
      };
      const request = mockRequest(smsLoginPayload);
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.code).toBe(0);
      expect(responseBody.msg).toBe('Login successful (sms)');
      expect(responseBody.data).toHaveProperty('access_token');
      expect(responseBody.data.client_id).toBe(smsLoginPayload.clientId);
    });

    it('should return 400 if nationalCode is missing', async () => {
      const payload = { ...basePayload, grantType: 'sms', phonenumber: '13800138000', smsCode: '654321' };
      // @ts-expect-error - testing invalid payload
      const request = mockRequest(payload);
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.msg).toBe('Missing nationalCode, phonenumber, or smsCode for sms grant type');
    });
  });

  // Test suite for Password Login
  describe('Password Login', () => {
    it('should return a successful response for valid password login', async () => {
      const passwordLoginPayload: PasswordLoginRequest = {
        ...basePayload,
        grantType: 'password',
        username: 'testuser',
        password: 'password123',
      };
      const request = mockRequest(passwordLoginPayload);
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.code).toBe(0);
      expect(responseBody.msg).toBe('Login successful (password)');
      expect(responseBody.data).toHaveProperty('access_token');
      expect(responseBody.data.client_id).toBe(passwordLoginPayload.clientId);
    });

    it('should return 400 if username is missing', async () => {
      const payload = { ...basePayload, grantType: 'password', password: 'password123' };
      // @ts-expect-error - testing invalid payload
      const request = mockRequest(payload);
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.msg).toBe('Missing username or password for password grant type');
    });

    it('should return a successful response if password is an empty string', async () => {
      const passwordLoginPayload: PasswordLoginRequest = {
        ...basePayload,
        grantType: 'password',
        username: 'testuser',
        password: '', // Empty string password
      };
      const request = mockRequest(passwordLoginPayload);
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.code).toBe(0);
      expect(responseBody.msg).toBe('Login successful (password)');
      expect(responseBody.data).toHaveProperty('access_token');
    });

    it('should return 400 if password is null (explicitly)', async () => {
      const passwordLoginPayload = {
        ...basePayload,
        grantType: 'password',
        username: 'testuser',
        password: null, // Null password
      };
      // @ts-expect-error - testing invalid payload
      const request = mockRequest(passwordLoginPayload);
      const response = await POST(request);
      const responseBody = await response.json();
      expect(response.status).toBe(400);
      expect(responseBody.msg).toBe('Missing username or password for password grant type');
    });
  });

  // General Error Cases
  describe('General Error Cases', () => {
    it('should return 400 if clientId is missing', async () => {
      const { clientId, ...payloadWithoutClientId } = basePayload;
      const request = mockRequest({ ...payloadWithoutClientId, grantType: 'email', email: 't@e.com', emailCode: '123' });
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.msg).toBe('Missing clientId or grantType');
    });

    it('should return 400 if grantType is missing', async () => {
      const { grantType, ...payloadWithoutGrantType } = basePayload;
      const request = mockRequest({ ...payloadWithoutGrantType, clientId: '123', email: 't@e.com', emailCode: '123' });
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.msg).toBe('Missing clientId or grantType');
    });

    it('should return 400 for an unsupported grantType', async () => {
      const request = mockRequest({ ...basePayload, grantType: 'unsupported_type' });
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.msg).toBe('Unsupported grantType: unsupported_type');
    });

    it('should return 500 if request.json() throws an error', async () => {
      const request = {
        json: async () => { throw new Error('Parse error'); },
      } as NextRequest;
      const response = await POST(request);
      const responseBody = await response.json();

      expect(response.status).toBe(500);
      expect(responseBody.msg).toBe('Internal Server Error');
      expect(responseBody.errorDetails).toBe('Parse error');
    });
  });
});
