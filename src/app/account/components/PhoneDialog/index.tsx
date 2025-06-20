// src/app/account/components/PhoneDialog/index.tsx
import PhoneInput from "@/app/auth/authForms/components/PhoneInputV1";
import type { Country } from "@/app/auth/authForms/types/auth";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CountryCode,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";

// Validation schema
const phoneValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9+]+$/, "Phone number must contain only digits and '+'")
    .min(5, "Phone number is too short")
    .max(20, "Phone number is too long")
    .required("Phone number is required")
    .test("is-valid-phone", "The phone number is not valid", function (value) {
      if (!value) return false;
      const countryCodeFromContext = (
        this.parent.selectedCountry || ""
      ).replace(/^\+/, "");
      const phone = (value || "").replace(/^\+/, "");
      const fullPhoneNum = `+${countryCodeFromContext}${phone}`;
      console.log("phoneValidationSchema fullPhoneNum:", fullPhoneNum);
      console.log(
        " isValidPhoneNumber(fullPhoneNum):",
        isValidPhoneNumber(fullPhoneNum)
      );
      return isValidPhoneNumber(fullPhoneNum) || false;
    }),
});

// Interface for API response
interface CountryResponse {
  data: Array<{
    id: number;
    countryEnName: string;
    nationalCode: string;
    countryName: string;
    domainShortName: string;
    status: number;
  }>;
  code: number;
  message: string;
  success: boolean;
  timestamp: number;
}

interface PhoneDialogProps {
  open: boolean;
  onClose: () => void;
  onSendCode: (phone: string) => Promise<void>;
  onVerify: (phone: string, code: string) => Promise<void>;
  loading: boolean;
  error?: string;
  countdown: number;
  hasGaKey: boolean;
}

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

interface PhoneDialogProps {
  open: boolean;
  onClose: () => void;
  onVerify: (phone: string, code: string) => Promise<void>;
  onSendCode: (phone: string) => Promise<void>;
  loading: boolean;
  countdown: number;
  hasGaKey: boolean;
}

const GoogleAuthenticatorDialog = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();

  const handleSet = () => {
    onClose();
    router.push("/authenticator");
  };

  return (
    <>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "#999",
        }}
      >
        <CancelIcon />
      </IconButton>
      <DialogTitle sx={{ color: "#000", pt: 3, pb: 2 }}>
        Set mobile phone number
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            px: 1,
            borderTop: "1px solid rgba(244, 244, 244, 1)",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            paragraph
            sx={{ mb: 3, fontSize: 14, lineHeight: 1.5 }}
            textAlign={"left"}
          >
            For your account security, this operation is subject to the
            following conditions.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#222",
              bgcolor: "rgba(248, 248, 248, 1)",
              padding: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <GoogleIcon sx={{ fontSize: 16, color: "blue" }} />
              <Typography>Google Authentication</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ErrorIcon sx={{ color: "rgba(255, 204, 0, 1)" }} />
              <Typography> Not set</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          sx={{
            ...buttonSx,
            padding: "8px 20px",
          }}
          onClick={onClose}
          // disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          sx={{
            ...buttonSx2,
            padding: "8px 20px",
          }}
          onClick={handleSet}
          variant="contained"
        >
          Set
        </Button>
      </DialogActions>
    </>
  );
};

interface PhoneNumberDialogProps {
  phone: string;
  code: string;
  loading: boolean;
  countdown: number;
  isSending: boolean;
  codeFocused: boolean;
  setCodeFocused: (focused: boolean) => void;
  validationError: string | null;
  onPhoneChange: (phone: string) => void;
  onPhoneBlur: () => void;
  onCodeChange: (code: string) => void;
  onSendCode: () => Promise<void>;
  onVerify: (phone: string, code: string) => Promise<void>;
  onClose: () => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countryCodes: Country[];
}
// const StyledLoginTextField = styled(CustomTextField)(`
//     & .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill {
//       -webkit-box-shadow: 0 0 0 100px #f5f5f5 inset;
//       -webkit-text-fill-color: #666666;
//     }
//   `);
const StyledCodeTextField = styled(CustomTextField)(`
  & .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #f5f5f5 inset;
    -webkit-text-fill-color: #666666;
  }
`);
const PhoneNumberDialog = ({
  phone,
  code,
  loading,
  countdown,
  isSending,
  codeFocused,
  setCodeFocused,
  onPhoneChange,
  onPhoneBlur,
  onCodeChange,
  onSendCode,
  onVerify,
  onClose,
  selectedCountry,
  setSelectedCountry,
  validationError,
  countryCodes,
}: PhoneNumberDialogProps) => (
  <>
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        color: "#999",
      }}
    >
      <CancelIcon />
    </IconButton>
    <DialogTitle sx={{ color: "#000", pt: 3, pb: 2 }}>
      Set mobile phone number
    </DialogTitle>
    <DialogContent>
      <Box
        sx={{
          pt: 1,
          px: 1,
          borderTop: "1px solid rgba(244, 244, 244, 1)",
          color: "#222",
        }}
      >
        <Box
          sx={{
            mb: 3,
            p: 1.5,
            // bgcolor: "rgba(248, 248, 248, 1)",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              Phone
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <PhoneInput
              countryCodes={countryCodes}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              setFieldValue={(_field, value) => onPhoneChange(value)}
              validateField={() => Promise.resolve()}
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onPhoneChange(e.target.value)
              }
              onBlur={onPhoneBlur}
              onFocus={() => {}}
              name="phone"
              placeholder="Enter phone number"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: validationError ? "error.main" : undefined,
                  },
                },
              }}
              error={!!validationError}
              helperText={validationError || undefined}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Verification Code
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <StyledCodeTextField
                id="code"
                name="code"
                variant="outlined"
                fullWidth
                value={code}
                onFocus={() => setCodeFocused(true)}
                onBlur={() => setCodeFocused(false)}
                onChange={(e) => onCodeChange(e.target.value)}
                placeholder="Enter verification code"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {codeFocused && code && (
                        <IconButton
                          onMouseDown={(
                            e: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            e.preventDefault();
                            onCodeChange("");
                          }}
                          edge="end"
                          size="small"
                          sx={{ padding: "2px", mr: 1 }}
                        >
                          <CancelIcon
                            sx={{ color: "#666666", fontSize: "16px" }}
                          />
                        </IconButton>
                      )}
                      <Button
                        variant="text"
                        size="small"
                        onClick={onSendCode}
                        disabled={isSending || countdown > 0}
                        sx={{
                          minWidth: "80px",
                          height: "36px",
                          bgcolor: "transparent",
                          color: "#3C7BF4",
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "transparent",
                            boxShadow: "none",
                            color: "#8ab0f8",
                          },
                        }}
                      >
                        {isSending ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : countdown > 0 ? (
                          <span style={{ color: "#3C7BF4" }}>{countdown}s</span>
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiOutlinedInput-root": {
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    color: "#000",
                    height: "44px",
                    "& input": {
                      height: "44px",
                      padding: "0 14px",
                    },
                  },
                }}
              />
              {/* <Button
                variant="contained"
                onClick={onSendCode}
                disabled={isSending || countdown > 0}
                sx={{
                  minWidth: "120px",
                  height: "44px",
                  bgcolor: "#3C7BF4",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "#2a56c7",
                  },
                  "&:disabled": {
                    bgcolor: "#f5f5f5",
                    color: "#999",
                  },
                }}
              >
                {isSending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : (
                  "Send Code"
                )}
              </Button> */}
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Google 2FA code
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <StyledCodeTextField
                id="code"
                name="code"
                variant="outlined"
                fullWidth
                value={code}
                onFocus={() => setCodeFocused(true)}
                onBlur={() => setCodeFocused(false)}
                onChange={(e) => onCodeChange(e.target.value)}
                placeholder="Enter the Google Authenticator code"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiOutlinedInput-root": {
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    color: "#000",
                    height: "44px",
                    "& input": {
                      height: "44px",
                      padding: "0 14px",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </DialogContent>
    <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
      <Button
        onClick={onClose}
        disabled={loading}
        sx={{
          ...buttonSx,
          padding: "8px 20px",
          "&:hover": {
            bgcolor: "#f5f5f5",
          },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={() => onVerify(phone, code)}
        variant="contained"
        disabled={!phone || !code || code.length !== 6 || loading}
        sx={{
          ...buttonSx2,
          padding: "8px 20px",
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm"}
      </Button>
    </DialogActions>
  </>
);

export const PhoneDialog = ({
  open,
  onClose,
  onSendCode,
  onVerify,
  loading,
  error,
  countdown,
  hasGaKey,
}: PhoneDialogProps) => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [countryCodes, setCountryCodes] = useState<Country[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch country codes from API
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

        const responseData: CountryResponse = await response.json();
        console.log("API Response:", responseData);

        if (responseData.data && Array.isArray(responseData.data)) {
          const activeCountries = responseData.data
            .filter((country) => country.status === 1)
            .map((country) => ({
              countryEnName: country.countryEnName,
              nationalCode: country.nationalCode,
              countryName: country.countryName,
              domainShortName: country.domainShortName,
            }));

          setCountryCodes(activeCountries);

          if (activeCountries.length > 0) {
            setSelectedCountry(activeCountries[0].nationalCode || "US");
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

  const handlePhoneChange = (phone: string) => {
    setPhone(phone);
  };

  const handlePhoneBlur = useCallback(async () => {
    const isValid = await validatePhoneNumber(phone);
    if (!isValid) return;
  }, [phone, selectedCountry]);

  const handleCodeChange = (code: string) => {
    setCode(code);
  };

  const handleSendCode = async () => {
    const isValid = await validatePhoneNumber(phone);
    if (!isValid) return;

    setIsSending(true);
    try {
      const phoneNumberObj = parsePhoneNumber(
        phone,
        selectedCountry as CountryCode
      );
      const formattedPhone =
        phoneNumberObj?.number || `+${selectedCountry}${phone}`;
      await onSendCode(formattedPhone);
    } catch (error) {
      setValidationError("Failed to send verification code");
      console.error("Error sending verification code:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!phone || !code) return;
    try {
      await onVerify(phone, code);
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const validatePhoneNumber = useCallback(
    async (phoneNumber: string) => {
      try {
        const res = await phoneValidationSchema.validate(
          { phone: phoneNumber, selectedCountry },
          { abortEarly: false }
        );
        console.log("validatePhoneNumber res:", res);
        setValidationError(null);
        return true;
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setValidationError(error.errors[0]);
        } else {
          setValidationError("Please enter a valid phone number");
        }
        return false;
      }
    },
    [selectedCountry]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "white",
          maxWidth: "444px",
          width: "100%",
          margin: "32px",
          borderRadius: "8px",
        },
        color: "#000",
      }}
    >
      {hasGaKey ? (
        <PhoneNumberDialog
          phone={phone}
          code={code}
          loading={loading}
          countdown={countdown}
          isSending={isSending}
          codeFocused={codeFocused}
          setCodeFocused={setCodeFocused}
          validationError={validationError}
          onPhoneChange={handlePhoneChange}
          onPhoneBlur={handlePhoneBlur}
          onCodeChange={handleCodeChange}
          onSendCode={handleSendCode}
          onVerify={handleVerify}
          onClose={onClose}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countryCodes={countryCodes}
        />
      ) : (
        <GoogleAuthenticatorDialog onClose={onClose} />
      )}
    </Dialog>
  );
};
