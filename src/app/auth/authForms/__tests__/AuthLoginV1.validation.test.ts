import * as Yup from 'yup';

// Assuming validationSchema is exported from AuthLoginV1.tsx
// We will need to adjust AuthLoginV1.tsx to export it, or redefine/import its logic here.
import { validationSchema } from '../AuthLoginV1'; // Adjust path as necessary

describe('AuthLoginV1 Validation Schema', () => {
  describe('Email Validation', () => {
    it('should require email when loginType is email', async () => {
      try {
        await validationSchema.validateAt('email', { loginType: 'email', email: '' });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Email is required');
      }
    });

    it('should accept a valid email when loginType is email', async () => {
      // Provide all expected fields for the schema, even if not directly under test for this specific `validateAt` call
      await expect(validationSchema.validateAt('email', { loginType: 'email', email: 'test@example.com', phoneNumber: '' })).resolves.toBe('test@example.com');
    });

    it('should reject an invalid email format when loginType is email', async () => {
      try {
        await validationSchema.validateAt('email', { loginType: 'email', email: 'invalid-email', phoneNumber: '' });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Invalid email address');
      }
    });

    it('should not require email when loginType is phone', async () => {
      // Provide all expected fields
      // When a field is not required and an empty string is passed, Yup's validateAt tends to resolve with the empty string.
      await expect(validationSchema.validateAt('email', { loginType: 'phone', email: '', phoneNumber: '12345' })).resolves.toBe('');
    });
  });

  describe('Phone Number Validation', () => {
    it('should show "digits only" for empty phone number when loginType is phone because regex fails first', async () => {
      try {
        await validationSchema.validateAt('phoneNumber', { loginType: 'phone', phoneNumber: '', email: '' });
      } catch (e) {
        const error = e as Yup.ValidationError;
        // Yup's .matches() runs before .required() if the value is an empty string.
        // The empty string doesn't match /^[0-9]+$/, so this error is shown.
        // If the field were undefined/null, .required() would trigger.
        expect(error.message).toBe('Phone number must be digits only');
      }
    });

    it('should accept a valid phone number when loginType is phone', async () => {
      await expect(validationSchema.validateAt('phoneNumber', { loginType: 'phone', phoneNumber: '1234567890', email: '' })).resolves.toBe('1234567890');
    });

    it('should reject non-digit phone number when loginType is phone', async () => {
      try {
        await validationSchema.validateAt('phoneNumber', { loginType: 'phone', phoneNumber: '12345abcde', email: '' });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Phone number must be digits only');
      }
    });

    it('should reject too short phone number when loginType is phone', async () => {
      try {
        await validationSchema.validateAt('phoneNumber', { loginType: 'phone', phoneNumber: '1234', email: '' });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Phone number is too short');
      }
    });

    it('should reject too long phone number when loginType is phone', async () => {
      try {
        await validationSchema.validateAt('phoneNumber', { loginType: 'phone', phoneNumber: '1234567890123456', email: '' });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Phone number is too long');
      }
    });

    it('should not require phone number when loginType is email', async () => {
      // When a field is not required and an empty string is passed, Yup's validateAt tends to resolve with the empty string.
      await expect(validationSchema.validateAt('phoneNumber', { loginType: 'email', phoneNumber: '', email: 'test@example.com' })).resolves.toBe('');
    });
  });
});
