import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import { Alert, Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  NotificationState,
  sendEmailVerificationCode,
  sendPhoneVerificationCode,
} from "../utils/verificationCodeUtils";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import VerificationCodeForm from "./components/VerificationCodeForm";
import { Country, Response } from "./types/auth";

const AuthForgotPassword = ({ title, subtitle, subtext }: loginType) => {
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [countdown, setCountdown] = useState<number>(0);
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [loginMode, setLoginMode] = useState<"code" | "password">("code");
  const [countryCodes, setCountryCodes] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout>();

  const handleNext = async (formValues: {
    email: string;
    phoneNumber: string;
  }) => {
    let success = false;

    // Store form values for later use in verification
    setUserEmail(formValues.email);
    setUserPhoneNumber(formValues.phoneNumber);

    // Send verification code based on login type
    if (loginType === "email") {
      success = await sendEmailVerificationCode(formValues.email, {
        setNotification,
        setCountdown,
        countdown,
      });
    } else if (loginType === "phone") {
      success = await sendPhoneVerificationCode(
        formValues.phoneNumber,
        selectedCountry,
        {
          setNotification,
          setCountdown,
          countdown,
        }
      );
    }

    // Only proceed to next step if verification code was sent successfully
    // if (success) {
    //   setForgotPassword(true);
    // }
    setForgotPassword(true);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch(
          "https://dev-api.bdy.tech/baseConfig/allSupportCountry",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData: Response = await response.json();
        console.log("API Response:", responseData);

        if (responseData.data && Array.isArray(responseData.data)) {
          const activeCountries = responseData.data.filter(
            (country) => country.status === 1
          );
          console.log("Active Countries:", activeCountries);

          setCountryCodes(activeCountries);

          if (activeCountries.length > 0) {
            setSelectedCountry(activeCountries[0].nationalCode || "");
          }
        } else {
          console.error("Invalid data format:", responseData);
        }
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountryCodes();
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log("countryCodes state updated:", countryCodes);
  }, [countryCodes]);

  useEffect(() => {
    console.log("selectedCountry state updated:", selectedCountry);
  }, [selectedCountry]);

  return (
    <>
      {notification && (
        <Box mb={2}>
          <Alert
            severity={notification.severity}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        </Box>
      )}

      {title ? (
        <Typography fontWeight="500" variant="h3" mb={2} color="#000">
          {forgotPassword ? "Verification Code" : title}
        </Typography>
      ) : null}

      {subtext}
      <Box
        sx={{
          width: { xs: "100%", sm: "432px" },
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          borderRadius: "16px",
          padding: "20px",
        }}
      >
        <Stack>
          {forgotPassword ? (
            <VerificationCodeForm
              loginType={loginType}
              countdown={countdown}
              setCountdown={setCountdown}
              email={userEmail}
              phoneNumber={userPhoneNumber}
              selectedCountry={selectedCountry}
              onNotification={setNotification}
            />
          ) : (
            <ForgotPasswordForm
              loginType={loginType}
              setLoginType={setLoginType}
              countryCodes={countryCodes}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countdown={countdown}
              open={open}
              anchorEl={anchorEl}
              handlePopoverOpen={handlePopoverOpen}
              handlePopoverClose={handlePopoverClose}
              handleNext={handleNext}
            />
          )}
        </Stack>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthForgotPassword;
