import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AuthLogin from '../AuthLoginV1'; // Adjust path as necessary
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles'; // Import createTheme

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [{ id: 1, nationalCode: '1', domainShortName: 'US', countryEnName: 'United States', status: 1 }] }), // Added status: 1
  })
) as jest.Mock;


const theme = createTheme(); // Create a basic theme

// Wrapper component to provide the theme
const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};


describe('AuthLoginV1 Integration Tests', () => {
  const mockProps = {
    title: 'Sign In',
    subtext: <p>Welcome back</p>,
    subtitle: <p>Enter your details</p>,
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    // Reset any other necessary mocks or component state here if needed
  });

  test('renders email input by default and shows error for invalid email', async () => {
    render(<AuthLogin {...mockProps} />, { wrapper: AllTheProviders });

    const emailInput = screen.getByPlaceholderText('Enter Email') as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();

    // Check for email input type (visual cue for active tab)
    const emailLoginButton = screen.getByText('Email');
    expect(emailLoginButton).toHaveStyle('color: #222'); // Assuming #222 is active color

    // Find the submit button
    const signInButton = screen.getByRole('button', { name: /Sign In/i });

    // Type invalid email
    // No need to clear if it starts empty, userEvent.type appends
    await userEvent.type(emailInput, 'invalidemail');
    // Important: Ensure Formik has processed the input. userEvent usually handles this well.
    // Clicking the submit button linked to Formik's handleSubmit
    fireEvent.click(signInButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    // Type valid email
    await userEvent.clear(emailInput); // Clear previous input
    await userEvent.type(emailInput, 'valid@email.com');
    fireEvent.click(signInButton);

    // Wait for the error message to disappear (or for submission success if applicable)
    await waitFor(() => {
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
    });
  });

  test('switches to phone input and shows error for invalid phone number', async () => {
    render(<AuthLogin {...mockProps} />, { wrapper: AllTheProviders });

    const phoneTabButton = screen.getByText('Phone');
    fireEvent.click(phoneTabButton);

    await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter Phone Number')).toBeInTheDocument();
    });
    const phoneInput = screen.getByPlaceholderText('Enter Phone Number') as HTMLInputElement;

    // Type invalid phone number (non-digits)
    await userEvent.type(phoneInput, 'invalidphone');
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Phone number must be digits only')).toBeInTheDocument();
    });

    // Type valid phone number
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '1234567890');
    fireEvent.click(signInButton);

    await waitFor(() => {
        expect(screen.queryByText('Phone number must be digits only')).not.toBeInTheDocument();
    });
  });

  test('send email code button works and shows countdown', async () => {
    render(<AuthLogin {...mockProps} />, { wrapper: AllTheProviders });
    const emailInput = screen.getByPlaceholderText('Enter Email') as HTMLInputElement;
    // Type a valid email first to enable the send code button
    await userEvent.type(emailInput, 'test@example.com');

    const sendCodeButton = screen.getByRole('button', { name: /Send/i });
    // Wait for the button to become enabled as Formik state updates
    await waitFor(() => expect(sendCodeButton).toBeEnabled());

    // Mock fetch for send code API
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ code: 0, msg: 'Code sent' }),
      })
    );

    fireEvent.click(sendCodeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(`https://dev-api.bdy.tech/resource/email/code?email=test@example.com`));
    });

    // Check for countdown text (e.g., "60s" or just "s" if the number changes too fast)
    await waitFor(() => {
        const countdownButton = screen.getByRole('button', { name: /\d+s/i }); // Match "60s", "59s", etc.
        expect(countdownButton).toBeInTheDocument();
        expect(countdownButton).toBeDisabled();
    }, { timeout: 2000 });

  });

  test('send phone code button works and shows countdown', async () => {
    render(<AuthLogin {...mockProps} />, { wrapper: AllTheProviders });

    const phoneTabButton = screen.getByText('Phone');
    fireEvent.click(phoneTabButton); // Switch to phone login

    const phoneInput = await screen.findByPlaceholderText('Enter Phone Number') as HTMLInputElement;
    expect(phoneInput).toBeInTheDocument();

    // Type a valid phone number
    await userEvent.type(phoneInput, '1234567890');

    // The global fetch mock should handle the country codes loading.
    // We only need to specifically mock the SMS code sending API call here.

    const sendCodeButton = screen.getByRole('button', { name: /Send/i });
    // Wait for button to be enabled
    await waitFor(() => expect(sendCodeButton).toBeEnabled(), { timeout: 3000 });

    // Mock ONLY the SMS code sending API call
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        // Ensure this mock is different enough if there's any confusion with previous country code mocks
        json: () => Promise.resolve({ code: 0, msg: 'Code sent' }),
      })
    );

    fireEvent.click(sendCodeButton);

    await waitFor(() => {
      // The selectedCountry '1' comes from the mocked country list that should be processed by the component
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(`https://dev-api.bdy.tech/resource/sms/code?nationalCode=1&mobile=1234567890`));
    });

    await waitFor(() => {
        const countdownButton = screen.getByRole('button', { name: /\d+s/i });
        expect(countdownButton).toBeInTheDocument();
        expect(countdownButton).toBeDisabled();
    }, { timeout: 2000 });
  });

});
