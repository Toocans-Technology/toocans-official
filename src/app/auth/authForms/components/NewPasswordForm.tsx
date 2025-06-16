import AuthButton from "@/app/components/forms/theme-elements/AuthButton";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";
import PasswordRulesChecker from "./PasswordRulesChecker";

interface NewPasswordFormProps {
  onSubmit?: () => void;
  setNotification?: React.Dispatch<React.SetStateAction<NotificationState | null>>;
}

interface NotificationState {
  type: "success" | "error";
  message: string;
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ onSubmit, setNotification }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const rules = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    length: password.length >= 8 && password.length <= 32,
  };

  const isPasswordValid = Object.values(rules).every((rule) => rule);
  const doPasswordsMatch = password === confirmPassword && password !== "";

  const handleMouseDownClearPassword = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log("handleMouseDownClearPassword Password:", password);
      event.preventDefault();
      event.stopPropagation();
      passwordRef.current?.focus();
      setPassword("");
    },
    []
  );

  const handleMouseDownClearConfirmPassword = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      confirmPasswordRef.current?.focus();
      setConfirmPassword("");
    },
    [confirmPasswordRef]
  );

  const handleApiSubmit = async () => {
    // If an external onSubmit is provided, call it.
    // This might be useful for scenarios where the form is part of a larger wizard
    // or if the API call is handled by a parent component.
    if (typeof onSubmit === 'function') {
      onSubmit();
      return;
    }

    setIsLoadingApi(true);
    setNotification?.(null);

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setNotification?.({
        type: "error",
        message: "Authentication token not found. Please log in again.",
      });
      setIsLoadingApi(false);
      return;
    }

    if (!isPasswordValid || !doPasswordsMatch) {
      setNotification?.({
        type: "error",
        message:
          "Password is not valid or passwords do not match. Please check the requirements.",
      });
      setIsLoadingApi(false);
      return;
    }

    try {
      const response = await fetch(
        "https://dev-api.bdy.tech/user/addPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ password: password }),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.code === 200) {
        setNotification?.({
          type: "success",
          message: "Password updated successfully! Redirecting...",
        });
        // Wait a bit for the user to see the message before redirecting
        setTimeout(() => {
          router.push("/overview");
        }, 2000);
      } else {
        setNotification?.({
          type: "error",
          message: responseData.msg || "Failed to update password.",
        });
      }
    } catch (error) {
      console.error("Password update error:", error);
      setNotification?.({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={1}>
        <Box
          sx={{
            color: "#222",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          Password
        </Box>
      </Box>
      <Box mb={1}>
        <CustomTextField
          fullWidth
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          inputRef={passwordRef}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isPasswordFocused && password && (
                  <IconButton
                    // onClick={handleMouseDownClearPassword}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      passwordRef.current?.focus();
                      setPassword("");
                    }}
                    edge="end"
                    size="small"
                    sx={{ mr: 0.5 }}
                  >
                    <CancelIcon sx={{ color: "#666", fontSize: "20px" }} />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon sx={{ color: "#000" }} />
                  ) : (
                    <VisibilityOutlinedIcon sx={{ color: "#000" }} />
                  )}
                </IconButton>
              </Box>
            ),
          }}
        />
      </Box>

      <PasswordRulesChecker rules={rules} />

      <Box sx={{ mb: 2 }}>
        <Box mb={1}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="confirm-password"
            mb="5px"
            color="#666"
          >
            Confirm Password
          </Typography>
        </Box>
        <CustomTextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
          onFocus={() => setIsConfirmPasswordFocused(true)}
          onBlur={() => setIsConfirmPasswordFocused(false)}
          inputRef={confirmPasswordRef}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isConfirmPasswordFocused && confirmPassword && (
                  <IconButton
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmPasswordRef.current?.focus();
                      setConfirmPassword("");
                    }}
                    edge="end"
                    size="small"
                    sx={{ mr: 0.5 }}
                  >
                    <CancelIcon sx={{ color: "#666", fontSize: "20px" }} />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? (
                    <VisibilityOffOutlinedIcon sx={{ color: "#000" }} />
                  ) : (
                    <VisibilityOutlinedIcon sx={{ color: "#000" }} />
                  )}
                </IconButton>
              </Box>
            ),
          }}
        />
      </Box>

      <Box mb={1}>
        <AuthButton
          disabled={!isPasswordValid || !doPasswordsMatch || isLoadingApi}
          onClick={handleApiSubmit}
        >
          {isLoadingApi ? "Updating..." : "Update Password"}
        </AuthButton>
      </Box>
    </Box>
  );
};

export default NewPasswordForm;
