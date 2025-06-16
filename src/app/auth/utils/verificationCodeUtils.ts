// Verification code utility functions for authentication
import { PhoneVerificationResponse } from '../authForms/types/auth';
import { EmailLoginRequest, SmsLoginRequest } from '@/app/api/auth/login/types';
import Cookies from 'js-cookie';

export interface NotificationState {
  message: string;
  severity: "success" | "error";
}

export interface VerificationCodeOptions {
  setNotification: (notification: NotificationState | null) => void;
  setCountdown: (countdown: number | ((prevCount: number) => number)) => void;
  countdown: number;
}

export interface VerificationLoginOptions {
  setNotification: (notification: NotificationState | null) => void;
  setIsLoading?: (loading: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const sendEmailVerificationCode = async (
  email: string,
  options: VerificationCodeOptions
): Promise<boolean> => {
  const { setNotification, setCountdown, countdown } = options;

  if (countdown > 0) {
    return false;
  }

  setNotification(null); // Clear previous notification
  
  if (!email) {
    setNotification({
      message: "Please enter a valid email address.",
      severity: "error",
    });
    setTimeout(() => setNotification(null), 5000);
    return false;
  }

  const apiUrl = `https://dev-api.bdy.tech/resource/email/code?email=${email}`;

  try {
    const response = await fetch(apiUrl);
    const responseData = await response.json();

    if (response.ok && responseData.code === 0) {
      console.log("Code sent successfully:", responseData.msg || "Success");
      setNotification({
        message: responseData.msg || "Verification code sent successfully!",
        severity: "success",
      });
      setTimeout(() => setNotification(null), 5000);
      
      // Start countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      
      return true;
    } else {
      console.error(
        "Failed to send code:",
        responseData.msg || `Status: ${response.status}`
      );
      setNotification({
        message: responseData.msg || "Failed to send verification code.",
        severity: "error",
      });
      setTimeout(() => setNotification(null), 5000);
      return false;
    }
  } catch (error) {
    console.error("Error calling send code API:", error);
    setNotification({
      message: "An error occurred. Please try again.",
      severity: "error",
    });
    setTimeout(() => setNotification(null), 5000);
    return false;
  }
};

export const sendPhoneVerificationCode = async (
  phoneNumber: string,
  selectedCountry: string,
  options: VerificationCodeOptions
): Promise<boolean> => {
  const { setNotification, setCountdown, countdown } = options;

  if (countdown > 0) {
    return false;
  }

  setNotification(null); // Clear previous notification

  if (!phoneNumber || !selectedCountry) {
    setNotification({
      message: "Please enter a valid phone number and select a country code.",
      severity: "error",
    });
    setTimeout(() => setNotification(null), 5000);
    return false;
  }

  const apiUrl = `https://dev-api.bdy.tech/resource/sms/code?nationalCode=${selectedCountry}&mobile=${phoneNumber}`;

  try {
    const response = await fetch(apiUrl);
    const responseData: PhoneVerificationResponse = await response.json();

    if (response.ok && responseData.code === 0) {
      console.log(
        "Phone code sent successfully:",
        responseData.msg || "Success"
      );
      setNotification({
        message:
          responseData.msg ||
          "Verification code sent successfully to your phone!",
        severity: "success",
      });
      setTimeout(() => setNotification(null), 5000);
      
      // Start countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      
      return true;
    } else {
      console.error(
        "Failed to send phone code:",
        responseData.msg || `Status: ${response.status}`
      );
      setNotification({
        message:
          responseData.msg || "Failed to send phone verification code.",
        severity: "error",
      });
      setTimeout(() => setNotification(null), 5000);
      return false;
    }
  } catch (error) {
    console.error("Error calling send phone code API:", error);
    setNotification({
      message:
        "An error occurred while sending phone code. Please try again.",
      severity: "error",
    });
    setTimeout(() => setNotification(null), 5000);
    return false;
  }
};

// Global function to verify login with verification code
export const verifyLoginWithCode = async (
  verificationCode: string,
  loginType: 'email' | 'phone',
  userData: {
    email?: string;
    phoneNumber?: string;
    selectedCountry?: string;
  },
  options: VerificationLoginOptions
): Promise<boolean> => {
  const { setNotification, setIsLoading, onSuccess, onError } = options;
  
  // Validate that all fields are filled
  if (verificationCode.length !== 6) {
    setNotification({
      message: 'Please enter the complete 6-digit verification code',
      severity: 'error'
    });
    return false;
  }

  // Validate required user data
  if (loginType === 'email' && !userData.email) {
    setNotification({
      message: 'Email is required for verification',
      severity: 'error'
    });
    return false;
  }

  if (loginType === 'phone' && (!userData.phoneNumber || !userData.selectedCountry)) {
    setNotification({
      message: 'Phone number and country code are required for verification',
      severity: 'error'
    });
    return false;
  }

  if (setIsLoading) setIsLoading(true);
  setNotification(null);
  
  const clientId = "24b5d2a7f4714409b4cc60bafc1dd2f6";
  let payload: EmailLoginRequest | SmsLoginRequest;

  try {
    if (loginType === 'email') {
      payload = {
        clientId,
        grantType: "email" as "email",
        email: userData.email!,
        emailCode: verificationCode,
      };
    } else {
      payload = {
        clientId,
        grantType: "sms" as "sms",
        nationalCode: userData.selectedCountry!,
        phonenumber: userData.phoneNumber!,
        smsCode: verificationCode,
      };
    }

    const response = await fetch("https://dev-api.bdy.tech/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const loginData = await response.json();
      const accessToken = loginData.data.access_token;
      
      // Store tokens
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", loginData.data.refresh_token);
      
      // Set cookie
      Cookies.set("auth-token", accessToken, {
        path: "/",
        expires: 1,
      });

      console.log("Verification successful:", loginData);
      
      setNotification({
        message: 'Verification successful! Redirecting...',
        severity: 'success'
      });

      // Auto-dismiss notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      return true;

    } else {
      const errorData = await response.json();
      const message = errorData.msg || `Verification failed with status: ${response.status}`;
      setNotification({
        message,
        severity: 'error'
      });
      
      // Auto-dismiss notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
      
      // Call error callback if provided
      if (onError) {
        onError(message);
      }
      
      console.error("Verification failed:", errorData);
      return false;
    }
  } catch (error) {
    const errorMessage = "An unexpected error occurred. Please try again.";
    setNotification({
      message: errorMessage,
      severity: 'error'
    });
    
    // Auto-dismiss notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
    
    // Call error callback if provided
    if (onError) {
      onError(errorMessage);
    }
    
    console.error("Network or other error during verification:", error);
    return false;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};
