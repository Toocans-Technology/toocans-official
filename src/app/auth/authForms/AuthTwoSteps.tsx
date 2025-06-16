import AuthButton from "@/app/components/forms/theme-elements/AuthButton";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NotificationState } from "../utils/verificationCodeUtils";
import {
  sendEmailVerificationCode,
  sendPhoneVerificationCode,
  verifyLoginWithCode,
} from "../utils/verificationCodeUtils";

interface AuthTwoStepsProps {
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  email?: string;
  phoneNumber?: string;
  loginType?: "email" | "phone";
  selectedCountry?: string;
  onNotification?: (notification: NotificationState | null) => void;
}

const AuthTwoSteps = ({
  countdown,
  setCountdown,
  email,
  phoneNumber,
  loginType = "email",
  selectedCountry,
  onNotification,
}: AuthTwoStepsProps) => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    if (countdown > 0) return; // Prevent starting new countdown if one is running

    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    if (index === 5 && value) {
      const completeCode = newVerificationCode.join("");
      console.log("Verification code entered:", completeCode);
      // Here you can add your validation logic
      // For example: validateCode(completeCode);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleClear = (index: number) => {
    const newVerificationCode = [...verificationCode];

    // Find the first non-empty value from current index
    let clearIndex = index;
    while (
      clearIndex < verificationCode.length &&
      !newVerificationCode[clearIndex]
    ) {
      clearIndex++;
    }

    // If found a value to clear
    if (clearIndex < verificationCode.length) {
      newVerificationCode[clearIndex] = "";
      setVerificationCode(newVerificationCode);
      inputRefs[clearIndex].current?.focus();
    } else {
      // If no value found after current index, clear current and move focus back
      newVerificationCode[index] = "";
      setVerificationCode(newVerificationCode);
      if (index > 0) {
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");

    // Validate that all fields are filled
    if (code.length !== 6) {
      notify({
        message: "Please enter the complete 6-digit verification code",
        severity: "error",
      });
      return;
    }

    // Validate required user data
    if (loginType === "email" && !email) {
      notify({
        message: "Email is required for verification",
        severity: "error",
      });
      return;
    }

    if (loginType === "phone" && (!phoneNumber || !selectedCountry)) {
      notify({
        message: "Phone number and country code are required for verification",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    notify(null);

    const success = await verifyLoginWithCode(
      code,
      loginType,
      {
        email,
        phoneNumber,
        selectedCountry,
      },
      {
        setNotification: notify,
        setIsLoading,
        onSuccess: () => {
          // Navigate to dashboard after successful verification
          setTimeout(() => {
            router.push("/auth/reset-password");
          }, 1500);
        },
      }
    );

    // The global function handles all the logic, we just need to handle the result
    if (success) {
      console.log("Verification completed successfully");
    } else {
      console.log("Verification failed");
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return; // Prevent resend if countdown is active

    const options = {
      setNotification: notify,
      setCountdown,
      countdown,
    };

    if (loginType === "email" && email) {
      await sendEmailVerificationCode(email, options);
    } else if (loginType === "phone" && phoneNumber && selectedCountry) {
      await sendPhoneVerificationCode(phoneNumber, selectedCountry, options);
    }
  };

  const notify = (notification: NotificationState | null) => {
    if (onNotification) {
      onNotification(notification);
    } else {
      setNotification(notification);
    }
  };

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        notify(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      {notification && !onNotification && (
        <Box mb={2}>
          <Alert severity={notification.severity} onClose={() => notify(null)}>
            {notification.message}
          </Alert>
        </Box>
      )}

      <Box mt={4}>
        <Stack mb={3}>
          <Stack spacing={2} direction="row">
            {verificationCode.map((value, index) => (
              <Box key={index} sx={{ position: "relative" }}>
                <CustomTextField
                  inputRef={inputRefs[index]}
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(index, e)
                  }
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: "center",
                      caretColor: "transparent", // Hide cursor
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "#f5f5f5",
                      borderRadius: "8px",
                      color: "#000",
                      transition: "border-color 0.2s ease-in-out",
                      "& input": {
                        height: "24px",
                        width: "24px",
                        padding: "8px",
                      },
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "1px solid #222",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "1px solid #222",
                        },
                      },
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid transparent",
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Stack>
        <Box mb={1}>
          <AuthButton
            disabled={
              countdown > 0 ||
              isLoading ||
              verificationCode.some((digit) => digit === "")
            }
            onClick={handleVerify}
          >
            {isLoading ? (
              "Verifying..."
            ) : countdown > 0 ? (
              <span style={{ color: "#8ce61c" }}>{countdown}s</span>
            ) : (
              "Verify"
            )}
          </AuthButton>
        </Box>

        <Stack direction="row" spacing={1} mt={3}>
          <Typography color="#666" variant="h6" fontWeight="400">
            Didn&apos;t get the code?
          </Typography>
          <Typography
            component="button"
            onClick={handleResend}
            disabled={countdown > 0}
            fontWeight="500"
            sx={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: countdown > 0 ? "not-allowed" : "pointer",
              textDecoration: "none",
              color: countdown > 0 ? "#ccc" : "#8ce61c",
              fontSize: "inherit",
              fontFamily: "inherit",
              "&:hover": {
                color: countdown > 0 ? "#ccc" : "#7bc018",
              },
            }}
          >
            {countdown > 0 ? `Resend (${countdown}s)` : "Resend"}
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

export default AuthTwoSteps;
