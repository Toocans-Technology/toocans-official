"use client";

import PageContainer from "@/app/components/container/PageContainer";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import LpHeader from "@/app/components/landingpage/header/Header";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

// Import the new API service methods and interfaces
import { googleAuthApi } from "@/app/services/api";
import { GoogleAuthDTO } from "@/app/types/googleAuth";

export default function Authenticator() {
  const [authenticatorCode, setAuthenticatorCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [googleAuthData, setGoogleAuthData] = useState<GoogleAuthDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [verificationSuccess, setVerificationSuccess] = useState<string | null>(
    null
  );
  const router = useRouter();
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code when googleAuthData is available
  useEffect(() => {
    if (googleAuthData?.qrCodeUrl && qrCodeRef.current) {
      QRCode.toCanvas(
        qrCodeRef.current,
        googleAuthData.qrCodeUrl,
        { width: 150 },
        (error) => {
          if (error) console.error("Error generating QR code:", error);
        }
      );
    }
  }, [googleAuthData]);

  useEffect(() => {
    const fetchGoogleAuthData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Retrieve tokenId if needed, e.g., from user session or props
        // For now, sending undefined as per GenerateGoogleAuthRequest
        const response = await googleAuthApi.generateGoogleAuth();
        if (response.code === 200 && response.data) {
          setGoogleAuthData(response.data);
        } else {
          setError(
            response.msg || "Failed to fetch Google Authenticator details."
          );
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching authenticator details."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoogleAuthData();
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Reset after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleVerification = async () => {
    if (!googleAuthData?.secretKey || !authenticatorCode) {
      setVerificationError("Secret key or authenticator code is missing.");
      return;
    }
    setIsSubmitting(true);
    setVerificationError(null);
    setVerificationSuccess(null);
    try {
      const response = await googleAuthApi.verifyGoogleAuth({
        code: authenticatorCode,
        secretKey: googleAuthData.secretKey,
      });
      if (response.code === 200) {
        setVerificationSuccess("Verification successful!");
        setTimeout(() => {
          router.push("/account");
        }, 1500);
      } else if (response.code === 10009) {
        setVerificationError(response.msg || "Invalid authenticator code.");
      } else {
        setVerificationError(response.msg || "Verification failed.");
      }
    } catch (err) {
      setVerificationError("An unexpected error occurred during verification.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySecretKey = () => {
    if (googleAuthData?.secretKey) {
      navigator.clipboard
        .writeText(googleAuthData.secretKey)
        .then(() => {
          setIsCopied(true);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  return (
    <PageContainer
      title="Authenticator Setup"
      description="Set up two-factor authentication"
    >
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
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <Typography variant="h2" sx={{ mb: 2, color: "#000" }}>
            Authenticator app
          </Typography>

          <Card
            sx={{ p: 4, borderRadius: 2, bgcolor: "#fff", color: "#666666" }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 2, color: "#222", fontSize: "16px" }}
            >
              Set Up Two-Factor Authentication
            </Typography>
            <Divider variant="middle" sx={{ borderColor: "#F4F4F4" }} />

            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            )}

            {!isLoading && !error && googleAuthData && (
              <>
                {/* Step 1: Download authenticator */}
                <Box sx={{ mt: 4, mb: 5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        bgcolor: "#000",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      1
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: "#222" }}
                    >
                      Download authenticator
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ ml: 3.5, mb: 2, fontSize: "14px" }}
                  >
                    Download Google Authenticator Android/iOS
                  </Typography>

                  <Grid
                    container
                    spacing={{ xs: 0, sm: 2 }}
                    sx={{ ml: 0, mt: 1 }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm="auto"
                      sx={{ ml: { xs: 0, sm: 3.5 } }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Box
                          component="img"
                          src="/images/app/qr-ios.png" // Replace with actual QR code image
                          alt="iOS QR Code"
                          sx={{ width: 80, height: 80 }}
                        />
                        <Typography>iOS</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                      <Box sx={{ textAlign: "center", pl: { xs: 0, sm: 5 } }}>
                        <Box
                          component="img"
                          src="/images/app/qr-android.png" // Replace with actual QR code image
                          alt="Android QR Code"
                          sx={{ width: 80, height: 80, fontSize: "14px" }}
                        />
                        <Typography>Android</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Step 2: Scan QR code */}
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        bgcolor: "#000",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      2
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: "#222" }}
                    >
                      Scan QR code
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ ml: 3.5, mb: 3, lineHeight: 1.5 }}
                  >
                    Open Google Authenticator, scan the QR code below or
                    manually enter the key phrase to activate the verification
                    token. Key phrase is used to recover Google Authenticator in
                    the event of a loss or change of device — please make sure
                    to keep the key phrase safe before setting up Google
                    Authenticator.
                  </Typography>

                  <Box
                    sx={{
                      ml: 3.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        // display: "inline-block",
                        p: 1,
                        mb: 3,
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                        border: "1px solid #eee",
                        background: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minWidth: 150,
                        minHeight: 150,
                      }}
                    >
                      <canvas ref={qrCodeRef} />
                    </Box>

                    <Box
                      width={"240px"}
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      <Typography variant="body2" align="left" fontSize={14}>
                        Or manually enter the code below
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography
                          fontWeight="500"
                          fontSize={14}
                          color="#222222"
                        >
                          {googleAuthData.secretKey}
                        </Typography>
                        <Tooltip title={isCopied ? "Copied!" : "Copy code"}>
                          <IconButton
                            size="small"
                            onClick={handleCopySecretKey}
                          >
                            <Image
                              src="/images/svgs/icon-copy.svg"
                              alt="copy"
                              width={16}
                              height={16}
                            />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Step 3: Security authentication */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        bgcolor: "#000",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      3
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: "#222" }}
                    >
                      Security authentication
                    </Typography>
                  </Box>

                  <Box sx={{ ml: 5, mt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, fontWeight: "500" }}
                    >
                      Google authenticator code
                    </Typography>
                    <CustomTextField
                      id="authenticator-code"
                      variant="outlined"
                      fullWidth
                      placeholder="Enter 6-digit generated code from your app"
                      value={authenticatorCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAuthenticatorCode(e.target.value)
                      }
                      sx={{
                        width: { xs: "80%", sm: "50%" },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "& .MuiOutlinedInput-root": {
                          background: "#f5f5f5",
                          borderRadius: "8px",
                          color: "#000",
                        },
                      }}
                    />
                  </Box>
                  {/* Email authentication code - Assuming this is out of scope for now */}
                  {/* <Box sx={{ ml: 5, mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
                      Email authentication code
                    </Typography>
                    <CustomTextField
                      id="email-auth-code" // Changed id
                      variant="outlined"
                      fullWidth
                      placeholder="Enter 6-digit email authentication code"
                      sx={{
                        width: { xs: "80%", sm: "50%" },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "& .MuiOutlinedInput-root": {
                          background: "#f5f5f5",
                          borderRadius: "8px",
                          color: "#000",
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "#9CFF1F",
                                color: "#000",
                                borderRadius: "36px",
                                marginRight: -1,
                                height: "24px",
                                fontSize: "12px",
                                "&:hover": { backgroundColor: "#8FE71E" },
                              }}
                            >
                              Send
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box> */}
                  <Box sx={{ ml: 5, mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      disableElevation
                      onClick={handleVerification}
                      disabled={
                        authenticatorCode.length < 6 ||
                        isSubmitting ||
                        !googleAuthData?.secretKey
                      }
                      sx={{
                        width: "50%",
                        py: 1.2,
                        bgcolor: "#9CFF1F",
                        "&:hover": {
                          bgcolor: "#8ee825",
                        },
                        borderRadius: 36,
                        color: "#000",
                        fontWeight: "medium",
                        "& .MuiButton-label": {
                          color: "#000",
                        },
                        "&:disabled": {
                          color: "rgba(0, 0, 0, 0.5)",
                        },
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Verify & Activate"
                      )}
                    </Button>
                  </Box>
                  {verificationError && (
                    <Alert severity="error" sx={{ ml: 5, mt: 2, width: "50%" }}>
                      {verificationError}
                    </Alert>
                  )}
                  {verificationSuccess && (
                    <Alert
                      severity="success"
                      sx={{ ml: 5, mt: 2, width: "50%" }}
                    >
                      {verificationSuccess}
                    </Alert>
                  )}
                </Box>
              </>
            )}
          </Card>
        </Box>
      </Box>
    </PageContainer>
  );
}

Authenticator.layout = "Blank";
