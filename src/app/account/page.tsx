"use client";

import PageContainer from "@/app/components/container/PageContainer";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import LpHeader from "@/app/components/landingpage/header/Header";
import { userApi } from "@/app/services/api";
import { useUserProfileStore } from "@/store/userProfileStore";
import { UserVerify } from "@/types/userVerify";
import { maskEmail, maskPhone } from "@/utils/dataUtils";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DisabledAuthentication } from "./components/DisabledAuthentication";
import { LoginPwDialog } from "./components/LoginPwDialog";
import { PhoneDialog } from "./components/PhoneDialog";

const StyledTextField = styled(CustomTextField)(`
  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
  & .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #f5f5f5 inset;
    -webkit-text-fill-color: #666666;
  }
`);

const StyledTextFieldSx = {
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid transparent",
  },
  "& .MuiOutlinedInput-root": {
    background: "#f5f5f5",
    borderRadius: "8px",
    color: "#000",
    transition: "border-color 0.2s ease-in-out",
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
};

// import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";

interface UserProfile {
  id?: string;
  email?: string;
  avatar?: string;
  nickname?: string;
  phoneNumber?: string;
  kycLevel?: number;
  verifyStatus?: number;
  // Add other user profile fields as needed
}

// Remove the layout property since we're using the App Router

const Account = () => {
  const [activeButton, setActiveButton] = useState<string>("deposit");
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const router = useRouter();
  const { userProfile, setUserProfile } = useUserProfileStore();
  const [verificationInfo, setVerificationInfo] = useState<UserVerify | null>(
    null
  );

  interface NotificationType {
    severity: "success" | "error" | "warning" | "info";
    message: string;
  }

  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);
  const [phoneCopied, setPhoneCopied] = useState<boolean>(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loginPwDialogOpen, setLoginPwDialogOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isEnablingAuth, setIsEnablingAuth] = useState(false);

  // Handle notification auto-close
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAvatarClick = () => {
    setAvatarDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAvatarDialogOpen(false);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleFileChange = (file: File) => {
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setNotification({
          severity: "error",
          message: "Please upload a valid image file (JPEG, PNG, GIF)",
        });
        return false;
      }

      if (file.size > maxSize) {
        setNotification({
          severity: "error",
          message: "File size exceeds 10MB limit",
        });
        return false;
      }

      setSelectedFile(file);
      return true;
    }
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  interface UploadResponse {
    code: number;
    message?: string;
    data?: {
      avatarUrl?: string;
    };
  }

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await userApi.updateAvatar(selectedFile);

      if (result.code === 200) {
        setNotification({
          severity: "success",
          message: "Avatar updated successfully!",
        });

        // Update the user profile with the new avatar
        if (userProfile) {
          // Create a preview URL for the new avatar
          const newAvatarUrl = URL.createObjectURL(selectedFile);
          setUserProfile({ ...userProfile, avatar: newAvatarUrl });
        }

        // Close the dialog after a short delay
        setTimeout(() => {
          handleCloseDialog();
        }, 1500);
      } else {
        let errorMessage = "Failed to update avatar";
        if (result.code === 30001) errorMessage = "File upload failed";
        else if (result.code === 30002)
          errorMessage = "Unsupported file format";
        else if (result.code === 30003)
          errorMessage = "File size exceeds limit";

        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setNotification({
        severity: "error",
        message: `Failed to upload avatar: ${errorMessage}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Auto-close notification after 15 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  //Fetch user verification info on component mount
  useEffect(() => {
    const fetchVerificationInfo = async () => {
      try {
        const response = await userApi.getUserVerificationInfo();
        if (response.code === 200 && response.data) {
          setVerificationInfo(response.data);
          // Update user profile with verification status if needed
          if (userProfile) {
            setUserProfile({
              ...userProfile,
              kycLevel: response.data.kycLevel,
              verifyStatus: response.data.verifyStatus,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching verification info:", error);
        setNotification({
          severity: "error",
          message: "Failed to load verification information",
        });
      }
    };

    fetchVerificationInfo();
  }, [userProfile?.id]);

  const handleCopy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage(message);
      setOpenSnackbar(true);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
      setNotification({
        severity: "error",
        message: "Failed to copy to clipboard",
      });
    }
  };

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const buttonSx = {
    bgcolor: "#f5f5f5",
    color: "#222222",
    border: "none",
    minWidth: "80px",
    borderRadius: "36px",
    "&:hover": {
      bgcolor: "#f5f5f5",
      border: "none",
      boxShadow: "none",
      color: "#555555",
    },
  };

  const buttonSx2 = {
    // bgcolor: "#9CFF1F",
    color: "#222222",
    border: "none",
    minWidth: "80px",
    borderRadius: "36px",
    bgcolor: "#9CFF1F",
    "&:hover": {
      bgcolor: "#8CE60F", // Slightly darker green on hover
      border: "none",
      boxShadow: "none",
      color: "#222222",
    },
    "&.Mui-disabled": {
      bgcolor: "#E0E0E0",
      color: "#9E9E9E",
    },
  };

  const [openNicknameDialog, setOpenNicknameDialog] = useState(false);
  const [newNickname, setNewNickname] = useState(userProfile?.nickname || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  const handleOpenNicknameDialog = () => {
    setNewNickname(userProfile?.nickname || "");
    setOpenNicknameDialog(true);
  };

  const handleCloseNicknameDialog = () => {
    setOpenNicknameDialog(false);
  };

  const validateNickname = (nickname: string) => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setNicknameError("Please enter a nickname");
      return false;
    }
    if (trimmed.length < 5 || trimmed.length > 20) {
      setNicknameError("Nickname must be between 5 and 20 characters");
      return false;
    }
    setNicknameError("");
    return true;
  };

  const changeNickname = async () => {
    if (!validateNickname(newNickname)) {
      return;
    }

    try {
      setIsUpdating(true);

      // Call the API to update nickname using userApi
      const result = await userApi.updateNickname(newNickname);

      if (result.code === 200 && result.data === true) {
        // Update local state
        setUserProfile({ ...userProfile, nickname: newNickname });

        setNotification({
          severity: "success",
          message: "Nickname updated successfully",
        });

        handleCloseNicknameDialog();
      } else {
        // Handle specific error codes
        if (result.code === 10001) {
          setNicknameError("This nickname is already taken");
          return;
        }

        // For other error codes or when data is not true
        throw new Error(result.msg || "Failed to update nickname");
      }
    } catch (error) {
      console.error("Error updating nickname:", error);
      setNotification({
        severity: "error",
        message:
          error instanceof Error ? error.message : "Failed to update nickname",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhoneSetting = () => {
    setPhoneDialogOpen(true);
  };

  const handleSendVerificationCode = async (phone: string) => {
    try {
      // Start countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // TODO: Call API to send verification code
      // await userApi.sendPhoneVerificationCode(phone);

      setNotification({
        severity: "success",
        message: "Verification code sent successfully",
      });
    } catch (error) {
      setNotification({
        severity: "error",
        message: "Failed to send verification code. Please try again.",
      });
      throw error;
    }
  };

  const handleVerifyPhone = async (phone: string, code: string) => {
    try {
      // TODO: Call API to verify code and update phone number
      // const result = await userApi.verifyPhoneNumber(phone, code);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user profile with new phone number
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          phone: phone,
        });
      }

      setNotification({
        severity: "success",
        message: "Phone number updated successfully",
      });

      setPhoneDialogOpen(false);
    } catch (error) {
      setNotification({
        severity: "error",
        message: "Failed to verify code. Please try again.",
      });
      throw error;
    }
  };

  const handleClosePhoneDialog = () => {
    setPhoneDialogOpen(false);
  };

  const handleOpenLoginPwDialog = () => {
    setLoginPwDialogOpen(true);
  };

  const handleCloseLoginPwDialog = () => {
    setLoginPwDialogOpen(false);
  };

  const handleLoginPwSubmit = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      setIsUpdatingPassword(true);
      // Call your API to update the password
      // Example:
      // await userApi.updatePassword({ currentPassword, newPassword });

      // Show success message
      setNotification({
        severity: "success",
        message: "Password updated successfully",
      });

      // Close the dialog
      handleCloseLoginPwDialog();
    } catch (error) {
      console.error("Failed to update password:", error);
      setNotification({
        severity: "error",
        message:
          error instanceof Error ? error.message : "Failed to update password",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleOpenAuthDialog = () => {
    setAuthDialogOpen(true);
  };

  const handleCloseAuthDialog = () => {
    setAuthDialogOpen(false);
  };

  const handleEnableAuth = async (code: string) => {
    try {
      setIsEnablingAuth(true);
      
      // Call the unbind Google Auth API
      const result = await userApi.unbindGoogleAuth(code);
      
      if (result.code === 200) {
        // Successfully unbound Google Auth
        setNotification({
          severity: 'success',
          message: 'Google Authenticator has been successfully disabled',
        });
        
        // Close the dialog and refresh user data
        handleCloseAuthDialog();
        // You might want to refresh the user profile data here
        // fetchUserProfile();
      } else if (result.code === 10008) {
        // Google Auth not bound
        setNotification({
          severity: 'error',
          message: 'Google Authenticator is not enabled',
        });
      } else if (result.code === 10009) {
        // Invalid verification code
        setNotification({
          severity: 'error',
          message: 'Invalid verification code. Please try again.',
        });
      } else {
        // Other errors
        throw new Error(result.msg || 'Failed to disable Google Authenticator');
      }
    } catch (error) {
      console.error('Failed to disable Google Authenticator:', error);
      setNotification({
        severity: 'error',
        message: error instanceof Error ? error.message : 'Failed to disable Google Authenticator',
      });
    } finally {
      setIsEnablingAuth(false);
    }
  };

  return (
    <PageContainer title="Overview" description="Account">
      <LpHeader />
      <Box
        sx={{
          bgcolor: "#EAEFF4",
          minHeight: "100vh",
          px: {
            xs: 2,
            sm: 4,
            md: 8,
            lg: 24,
            xl: 32,
          },
          py: {
            xs: 4,
            sm: 6,
            md: 8,
          },
        }}
      >
        <Typography variant="h2" sx={{ mb: 2, color: "#000" }}>
          Account
        </Typography>

        {notification && (
          <Alert
            severity={notification.severity}
            onClose={() => setNotification(null)}
            sx={{ mb: 3 }}
          >
            {notification.message}
          </Alert>
        )}

        {/* {verificationInfo && (
          <Card sx={{ mb: 3, bgcolor: "#f9f9f9" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Identity Verification
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ minWidth: 120, fontWeight: 500 }}
                >
                  Status:
                </Typography>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor:
                      verificationInfo.verifyStatus === 2
                        ? "success.light"
                        : verificationInfo.verifyStatus === 3
                        ? "error.light"
                        : "warning.light",
                    color: "white",
                    fontWeight: 500,
                  }}
                >
                  {verificationInfo.verifyStatus === 0 && "Not Submitted"}
                  {verificationInfo.verifyStatus === 1 && "Under Review"}
                  {verificationInfo.verifyStatus === 2 && "Verified"}
                  {verificationInfo.verifyStatus === 3 && "Rejected"}
                </Box>
              </Box>

              {verificationInfo.verifyReason && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="error">
                    <strong>Reason: </strong> {verificationInfo.verifyReason}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // Add navigation to verification page
                    router.push("/verification");
                  }}
                >
                  {verificationInfo.verifyStatus === 3
                    ? "Resubmit"
                    : "Verify Now"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )} */}
        <Card sx={{ mb: 4, bgcolor: "#fff", color: "#666666" }}>
          <CardContent>
            {!userProfile?.hasGaKey && (
              <Stack spacing={2} bgcolor={"#FFF3A5"} p={2} borderRadius={1}>
                <Typography
                  variant="body1"
                  fontSize={12}
                  sx={{ color: "#111" }}
                >
                  Your account security level is low. Please set up the
                  following as soon as possible.
                </Typography>
                <Typography
                  color={"#222222"}
                  fontWeight={500}
                  onClick={() => router.push("/authenticator")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.8,
                    },
                  }}
                >
                  Google 2FA Authentication
                  <ArrowForwardIosOutlinedIcon sx={{ fontSize: 14 }} />
                </Typography>
              </Stack>
            )}

            <Stack spacing={2} mt={4}>
              {/* User Info Section */}
              <Box
                sx={{
                  display: { xs: "block", sm: "flex" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  onClick={handleAvatarClick}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    "&:hover::after": {
                      content: '"Change"',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      textAlign: "center",
                      fontSize: "12px",
                      padding: "2px 0",
                      borderBottomLeftRadius: "20%",
                      borderBottomRightRadius: "20%",
                    },
                  }}
                >
                  {userProfile?.avatar ? (
                    <Image
                      src={userProfile.avatar}
                      alt="avatar"
                      width={40}
                      height={40}
                      style={{ borderRadius: "20%" }}
                    />
                  ) : (
                    <Image
                      src="/images/profile/user-0.svg"
                      alt="profile"
                      width={40}
                      height={40}
                      style={{ borderRadius: "20%" }}
                    />
                  )}
                </Box>

                <Stack spacing={0.5}>
                  <Box
                    sx={{
                      display: { xs: "flex", sm: "block" },
                      alignItems: "center",
                      gap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="#222222">
                      {userProfile?.email}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="#666666">
                        UID:{" "}
                        {userProfile?.userId !== undefined
                          ? (() => {
                              const userIdStr =
                                userProfile.userId?.toString() || "";
                              return userIdStr.length > 10
                                ? `${userIdStr.substring(
                                    0,
                                    4
                                  )}***${userIdStr.substring(
                                    userIdStr.length - 4
                                  )}`
                                : userIdStr || "N/A";
                            })()
                          : "N/A"}
                      </Typography>
                      {copySuccess ? (
                        <CheckIcon
                          sx={{
                            fontSize: 14,
                            cursor: "pointer",
                            color: "#9CFF1F",
                          }}
                        />
                      ) : (
                        <ContentCopyIcon
                          onClick={() =>
                            handleCopy(
                              userProfile?.userId?.toString() || "",
                              "UID copied to clipboard"
                            )
                          }
                          sx={{
                            fontSize: 14,
                            cursor: "pointer",
                            color: "#666666",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Stack>

                {/* <Box sx={{ ml: { xs: 0, sm: 'auto'}, display: 'flex', alignItems: 'center', gap: 2, padding: '8px 0' }}>
                <Typography variant="body2" color="#666666">Identity verification</Typography>
                <Typography color="#FD6384" bgcolor={'#FD638433'} borderRadius={1} fontSize={12} textAlign={'center'} padding={'8px 20px'} width={'auto'}>Unverified</Typography>
              </Box> */}

                <Box
                  sx={{
                    ml: { xs: 0, sm: "auto" },
                    display: { xs: "flex", sm: "block" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2" color="#666666" sx={{ mb: 0.5 }}>
                    Identity verification
                  </Typography>
                  {verificationInfo?.verifyStatus === 2 ? (
                    <Typography
                      color="rgba(26, 202, 117, 1)"
                      bgcolor={"rgba(26, 202, 117, 0.2)"}
                      borderRadius={0.5}
                      fontSize={12}
                      textAlign={"center"}
                      width={80}
                    >
                      Verified
                    </Typography>
                  ) : (
                    <Typography
                      color="#FD6384"
                      bgcolor={"#FD638433"}
                      borderRadius={0.5}
                      fontSize={12}
                      textAlign={"center"}
                      width={80}
                    >
                      Unverified
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    ml: { xs: 0, sm: "auto" },
                    display: { xs: "flex", sm: "block" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    color: "#666666",
                  }}
                >
                  <Typography variant="body2">Security Level</Typography>
                  <Typography color="#222" fontWeight="500">
                    {verificationInfo?.kycLevel === 1 ? "High" : "Low"}
                  </Typography>
                </Box>
              </Box>
              <Divider variant="middle" sx={{ borderColor: "#F4F4F4" }} />

              {/* Account Settings */}
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      color="#222222"
                      fontWeight={500}
                      sx={{ width: { xs: "100px", sm: "200px" } }}
                    >
                      Nickname
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Typography color="#222">
                      {maskEmail(userProfile?.nickname?.toString() || "")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ ...buttonSx, padding: "8px 20px" }}
                      onClick={handleOpenNicknameDialog}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        Change
                      </Typography>
                    </Button>
                  </Box>
                </Box>

                {/* User ID */}
                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="#222222" fontWeight={500}  sx={{ width: 200 }}>User ID</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary">123123123</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={buttonSx}
                  onClick={() => handleCopy('123123123', 'User ID copied to clipboard')}
                >
                  Copy
                </Button>
              </Box> */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      color="#222222"
                      fontWeight={500}
                      sx={{ width: { xs: "100px", sm: "200px" } }}
                    >
                      User ID
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Typography color="#222222">
                      {maskPhone(userProfile?.userId?.toString() || "")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Tooltip
                      title="Copied!"
                      placement="top"
                      open={copied}
                      disableFocusListener
                      disableTouchListener
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ ...buttonSx, padding: "8px 20px" }}
                        onClick={() => {
                          if (userProfile?.userId) {
                            navigator.clipboard.writeText(
                              userProfile.userId.toString()
                            );
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          Copy
                        </Typography>
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>

                <Divider variant="middle" sx={{ borderColor: "#F4F4F4" }} />

                {/* Email Authentication */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: { xs: "100px", sm: "200px" } }}>
                    <Typography color="#222222" sx={{ width: 150 }}>
                      Email Authentication
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For login, withdraw, password retrieval, security settings
                      change.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="#222222">
                      {maskEmail(userProfile?.email?.toString() || "")}
                    </Typography>
                  </Box>

                  {userProfile?.email?.toString() ? (
                    <Tooltip
                      title="Copied!"
                      placement="top"
                      open={emailCopied}
                      disableFocusListener
                      disableTouchListener
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ ...buttonSx, padding: "8px 20px" }}
                        onClick={() => {
                          if (userProfile?.email) {
                            navigator.clipboard.writeText(userProfile.email);
                            setEmailCopied(true);
                            setTimeout(() => setEmailCopied(false), 2000);
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          Copy
                        </Typography>
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button variant="outlined" size="small" sx={buttonSx}>
                      Settings
                    </Button>
                  )}
                </Box>

                {/* Phone Authentication */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: { xs: "100px", sm: "200px" } }}>
                    <Typography color="#222222" sx={{ width: 150 }}>
                      Phone Authentication
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For login, password retrieval, security settings change.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="#222222" height={2}>
                      {maskPhone(userProfile?.mobile?.toString() || "")}
                    </Typography>
                  </Box>
                  {userProfile?.mobile?.toString() ? (
                    <Tooltip
                      title="Copied!"
                      placement="top"
                      open={phoneCopied}
                      disableFocusListener
                      disableTouchListener
                    >
                      {/* <Button
                        variant="outlined"
                        size="small"
                        sx={{ ...buttonSx, padding: "8px 20px" }}
                        onClick={() => {
                          if (userProfile?.mobile) {
                            navigator.clipboard.writeText(userProfile.mobile);
                            setPhoneCopied(true);
                            setTimeout(() => setPhoneCopied(false), 2000);
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                          Copy
                        </Typography>
                      </Button> */}
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ ...buttonSx, padding: "8px 20px" }}
                        onClick={handlePhoneSetting}
                      >
                        Settings
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={buttonSx}
                      onClick={handlePhoneSetting}
                    >
                      Settings
                    </Button>
                  )}
                </Box>
                <Divider variant="middle" sx={{ borderColor: "#F4F4F4" }} />

                {/* Login Password */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: 200 }}>
                    <Typography color="#222222">Login Password</Typography>
                  </Box>
                  <Box>
                    <Typography color="#666666">
                      {userProfile?.setPassword
                        ? "configured"
                        : "Not yet configured"}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={buttonSx}
                    onClick={handleOpenLoginPwDialog}
                  >
                    Settings
                  </Button>
                </Box>

                {/* Authentication App */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: 200 }}>
                    <Typography color="#222222">Authentication App</Typography>
                    <Typography
                      variant="body2"
                      color="#666666"
                      width={{ xs: "120px", sm: "250px" }}
                    >
                      Use authentication codes when managing assets and other
                      functions
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="#666666">
                      {userProfile?.hasGaKey
                        ? "configured"
                        : "Not yet configured"}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={buttonSx}
                    onClick={handleOpenAuthDialog}
                  >
                    Settings
                  </Button>
                </Box>

                {/* Add any additional sections here */}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Avatar Upload Dialog */}
      <Dialog
        open={avatarDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { backgroundColor: "white" },
          color: "#000",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          disabled={isUploading}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#999",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <CancelIcon />
        </IconButton>
        <DialogTitle sx={{ color: "#000", pt: 5 }}>
          Change Profile Picture
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 3, pt: 0 }}>
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                width: "100%",
                height: 214,
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
                bgcolor: isDragging ? "#e0e0e0" : "#e9e9e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px dashed ${isDragging ? "#666" : "transparent"}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#e0e0e0",
                },
              }}
            >
              {selectedFile ? (
                <Box
                  component="label"
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    cursor: "pointer",
                    "&:hover::before": {
                      content: '"Change Image"',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 500,
                    },
                  }}
                >
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  <Box
                    component="label"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <AddBoxOutlinedIcon
                      sx={{
                        color: isDragging ? "#555" : "#222",
                        fontSize: "32px",
                        mb: 1.5,
                      }}
                    />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                    <Typography
                      variant="body2"
                      color="#222"
                      fontSize={14}
                      lineHeight={1.5}
                    >
                      Upload a photo or drag and drop
                      <Typography
                        component="div"
                        variant="body2"
                        color="textSecondary"
                        fontSize={14}
                        lineHeight={1.5}
                        sx={{ mt: 1 }}
                      >
                        Only png, jpg can be uploaded, and the size does not
                        exceed 10MB
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* <Button
              variant="outlined"
              component="label"
              disabled={isUploading}
              sx={{
                mb: 3,
                textTransform: "none",
                borderRadius: "4px",
                minWidth: "160px",
              }}
            >
              Choose Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button> */}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <Box sx={{ width: "100%", mt: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    Uploading...
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {Math.round(uploadProgress)}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "#e0e0e0",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${uploadProgress}%`,
                      height: 6,
                      bgcolor: "primary.main",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "flex-end", gap: 1 }}>
          {/* <Button
            onClick={handleCloseDialog}
            disabled={isUploading}
            sx={{
              textTransform: "none",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            Cancel
          </Button> */}
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{
              ...buttonSx2,
              padding: "8px 20px",
            }}
            disabled={!selectedFile || isUploading}
            // sx={{
            //   textTransform: "none",
            //   borderRadius: "4px",
            //   px: 3,
            // }}
          >
            {isUploading ? "Uploading..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Change Nickname Dialog */}
      <Dialog
        open={openNicknameDialog}
        onClose={handleCloseNicknameDialog}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { backgroundColor: "white" },
          color: "#000",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseNicknameDialog}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: "#999",
          })}
        >
          <CancelIcon />
        </IconButton>
        <DialogTitle sx={{ color: "#000" }}>Change Nickname</DialogTitle>
        <DialogContent>
          <StyledTextField
            autoFocus
            type="text"
            fullWidth
            value={newNickname}
            onChange={(e) => {
              setNewNickname(e.target.value);
              if (e.target.value.trim()) {
                validateNickname(e.target.value);
              } else {
                setNicknameError("");
              }
            }}
            onBlur={() => validateNickname(newNickname)}
            InputProps={{
              endAdornment: newNickname && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewNickname("");
                    setNicknameError("");
                  }}
                  sx={{
                    marginRight: -1,
                    color: "rgba(0, 0, 0, 0.54)",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              ),
            }}
            sx={{
              ...StyledTextFieldSx,
              mt: 2,
              "& .MuiOutlinedInput-root": {
                ...StyledTextFieldSx["& .MuiOutlinedInput-root"],
                backgroundColor: "#f5f5f5",
                "&:hover, &.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#222",
                  },
                },
                paddingRight: "14px", // Make room for the clear icon
              },
              "& .MuiOutlinedInput-input": {
                paddingRight: "8px", // Adjust padding to prevent text under the icon
              },
            }}
          />
          <Typography
            color={nicknameError ? "error" : "#666666"}
            variant="caption"
            sx={{ mt: 1, display: "block", minHeight: "20px" }}
          >
            {nicknameError || "5-20 characters."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            sx={{
              ...buttonSx,
              padding: "8px 20px",
            }}
            onClick={handleCloseNicknameDialog}
            // disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            sx={{
              ...buttonSx2,
              padding: "8px 20px",
            }}
            onClick={changeNickname}
            variant="contained"
            disabled={isUpdating || !newNickname.trim()}
          >
            {isUpdating ? "Updating..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <PhoneDialog
        open={phoneDialogOpen}
        onClose={handleClosePhoneDialog}
        onSendCode={handleSendVerificationCode}
        onVerify={handleVerifyPhone}
        loading={false} // Set to true when verifying
        countdown={countdown}
        hasGaKey={userProfile?.hasGaKey || false}
      />

      <LoginPwDialog
        open={loginPwDialogOpen}
        onClose={handleCloseLoginPwDialog}
        onSubmit={handleLoginPwSubmit}
        loading={isUpdatingPassword}
      />

      <DisabledAuthentication
        open={authDialogOpen}
        onClose={handleCloseAuthDialog}
        onSubmit={handleEnableAuth}
        loading={isEnablingAuth}
      />
    </PageContainer>
  );
};

export default Account;
