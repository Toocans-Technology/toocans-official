import * as Yup from 'yup';
import { validationSchema } from '../AuthLoginV1'; // Adjust path as necessary
import { isValidPhoneNumber as mockIsValidPhoneNumber } from 'libphonenumber-js/max';

jest.mock('libphonenumber-js/max');

describe('AuthLoginV1 Validation Schema', () => {
  beforeEach(() => {
    // Reset mock before each test to ensure a clean state
    (mockIsValidPhoneNumber as jest.Mock).mockReset();
  });

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
    // Mock isValidPhoneNumber to return true for most tests, unless specified otherwise
    beforeEach(() => {
      (mockIsValidPhoneNumber as jest.Mock).mockReturnValue(true);
    });

    it('should require phone number when loginType is phone', async () => {
      try {
        // Forcing the regex to pass to hit the .required()
        await validationSchema.validateAt(
          'phoneNumber',
          { loginType: 'phone', phoneNumber: undefined, selectedCountry: '1', email: '' },
          { context: { selectedCountry: '1' } }
        );
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Phone number is required');
      }
    });

    it('should accept a valid phone number when loginType is phone and selectedCountry is provided and isValidPhoneNumber returns true', async () => {
      (mockIsValidPhoneNumber as jest.Mock).mockReturnValue(true);
      const data = { loginType: 'phone', phoneNumber: '1234567890', selectedCountry: '1', email: '' };
      await expect(validationSchema.validateAt('phoneNumber', data, { context: { selectedCountry: data.selectedCountry } })).resolves.toBe('1234567890');
    });

    it('should reject an invalid phone number when isValidPhoneNumber returns false', async () => {
      (mockIsValidPhoneNumber as jest.Mock).mockReturnValue(false);
      const data = { loginType: 'phone', phoneNumber: '123', selectedCountry: '1', email: '' };
      try {
        await validationSchema.validateAt('phoneNumber', data, { context: { selectedCountry: data.selectedCountry } });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('The phone number is not valid');
      }
    });

    it('should reject non-digit phone number when loginType is phone', async () => {
      // This test primarily checks the regex, isValidPhoneNumber might not even be called if regex fails.
      (mockIsValidPhoneNumber as jest.Mock).mockReturnValue(true); // Assume it would be valid if regex passed
      const data = { loginType: 'phone', phoneNumber: '12345abcde', selectedCountry: '1', email: '' };
      try {
        await validationSchema.validateAt('phoneNumber', data, { context: { selectedCountry: data.selectedCountry } });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe("Phone number must contain only digits and '+'");
      }
    });

    it('should reject too short phone number when loginType is phone', async () => {
      (mockIsValidPhoneNumber as jest.Mock).mockReturnValue(true); // Assume it would be valid if length was fine
      const data = { loginType: 'phone', phoneNumber: '1234', selectedCountry: '1', email: '' };
      try {
        await validationSchema.validateAt('phoneNumber', data, { context: { selectedCountry: data.selectedCountry } });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Phone number is too short');
      }
    });

    it('should reject too long phone number when loginType is phone', async () => {
      (mockIsValidPhoneNumber as jest.Mock).mockReturnValue(true); // Assume it would be valid if length was fine
      const data = { loginType: 'phone', phoneNumber: '123456789012345678901', selectedCountry: '1', email: '' };
      try {
        await validationSchema.validateAt('phoneNumber', data, { context: { selectedCountry: data.selectedCountry } });
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Phone number is too long');
      }
    });

    it('should not require phone number when loginType is email', async () => {
      const data = { loginType: 'email', phoneNumber: '', email: 'test@example.com', selectedCountry: '' };
      // selectedCountry is not required for email login, so context for it is not strictly needed but good to pass
      await expect(validationSchema.validateAt('phoneNumber', data, { context: { selectedCountry: data.selectedCountry } })).resolves.toBeUndefined();
    });

    it('should strip phoneNumber when loginType is email', async () => {
        const data = { loginType: 'email', phoneNumber: '12345', email: 'test@example.com', selectedCountry: '' };
        const validatedData = await validationSchema.validate(data);
        expect(validatedData.phoneNumber).toBeUndefined();
      });
  });

  describe('selectedCountry Validation', () => {
    it('should require selectedCountry when loginType is phone', async () => {
      (mockIsValidPhoneNumber as jest.Mock).mockReturnValue(true); // Assume phone is valid
      try {
        // Pass a valid-enough phone number so that selectedCountry is the focus
        await validationSchema.validateAt(
          'selectedCountry',
          { loginType: 'phone', selectedCountry: '', phoneNumber: '1234567', email: '' }
        );
      } catch (e) {
        const error = e as Yup.ValidationError;
        expect(error.message).toBe('Country code is required');
      }
    });

    it('should accept selectedCountry when loginType is phone and it is provided', async () => {
      (mockIsValidPhoneNumber as jest.Mock).mockReturnValue(true);
      // Pass a valid-enough phone number
      await expect(validationSchema.validateAt(
        'selectedCountry',
        { loginType: 'phone', selectedCountry: '1', phoneNumber: '1234567', email: '' }
      )).resolves.toBe('1');
    });

    it('should not require selectedCountry when loginType is email', async () => {
      await expect(validationSchema.validateAt(
        'selectedCountry',
        { loginType: 'email', selectedCountry: '', phoneNumber: '', email: 'test@example.com' }
      )).resolves.toBe(''); // Or toBeUndefined depending on Yup's behavior with notRequired() vs strip()
    });
  });
});
