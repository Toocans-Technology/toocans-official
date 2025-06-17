import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
import { PasswordLoginRequest } from "@/app/api/auth/login/types";
import { Response as UserProfileResponse } from "@/app/api/user/types"; // Import user profile types
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { useUserProfileStore } from "@/store/userProfileStore"; // Import the Zustand store
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import Alert, { AlertColor } from "@mui/material/Alert"; // Added Alert import
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { isValidPhoneNumber } from "libphonenumber-js/max";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  sendEmailVerificationCode,
  sendPhoneVerificationCode,
  verifyLoginWithCode,
} from "../utils/verificationCodeUtils";
import EmailInput from "./components/EmailInput";
import PhoneInput from "./components/PhoneInputV1";

interface Country {
  countryEnName?: string;
  countryName?: string;
  created?: number;
  customOrder?: string;
  domainShortName?: string;
  id?: number;
  nationalCode?: string;
  status?: number;
}

interface Response {
  code?: number;
  data?: Country[];
  msg?: string;
}

// export const validationSchema = Yup.object().shape({
//   email: Yup.string().when("loginType", {
//     is: "email",
//     then: (schema) =>
//       schema.email("Invalid email address").required("Email is required"),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   phoneNumber: Yup.string().when("loginType", {
//     is: "phone",
//     then: (schema) =>
//       schema
//         .matches(/^[0-9+]+$/, "Phone number must contain only digits and '+'")
//         .min(5, "Phone number is too short")
//         .max(20, "Phone number is too long")
//         .required("Phone number is required")
//         .test(
//           "is-valid-phone",
//           "The phone number is not valid. Please include country code (e.g., +1 for US)",
//           function (value) {
//             if (!value) {
//               return true; // Should be caught by .required()
//             }
//             // const fullPhoneNum = selectedCountry + values

//             // Ensure the number starts with a '+' and has the country code
//             if (!value.startsWith("+")) {
//               return false;
//             }

//             // Remove any non-digit characters except '+' for validation
//             const cleanedValue = value.replace(/[^0-9+]/g, "");

//             return /* isValidPhoneNumber (removed, use libphonenumber-js) */(cleanedValue);
//           }
//         ),
//     otherwise: (schema) => schema.notRequired(),
//   }),
//   verificationCode: Yup.string().notRequired(), // Add other fields as needed
//   password: Yup.string().notRequired(), // Add other fields as needed
// });

export const validationSchema = Yup.object().shape({
  email: Yup.string().when("loginType", {
    is: "email",
    then: (schema) =>
      schema.email("Invalid email address").required("Email is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  selectedCountry: Yup.string().when("loginType", {
    is: "phone",
    then: (schema) => schema.required("Country code is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  phoneNumber: Yup.string().when("loginType", {
    is: "phone",
    then: (schema) =>
      schema
        .matches(/^[0-9+]+$/, "Phone number must contain only digits and '+'")
        .min(5, "Phone number is too short")
        .max(20, "Phone number is too long")
        .required("Phone number is required")
        // .matches(/^\+?[0-9]+$/, "只能包含数字和加号")
        .test(
          "is-valid-phone",
          "The phone number is not valid",
          function (value) {
            if (!value) return false;
            console.log("is-valid-phone value:", value);
            console.log("is-valid-phone context:", this.options.context);
            const countryCodeFromContext = (
              this.options.context?.selectedCountry || ""
            ).replace(/^\+/, "");
            const phone = (value || "").replace(/^\+/, ""); // Ensure phone part doesn't have '+'
            const fullPhoneNum = `+${countryCodeFromContext}${phone}`;
            console.log("fullPhoneNum:", fullPhoneNum);
            console.log(
              "isValidPhoneNumber(fullPhoneNum):",
              isValidPhoneNumber(fullPhoneNum)
            );
            // 基础验证
            return isValidPhoneNumber(fullPhoneNum) || false; // Allow all valid phone number types
          }
        ),
    otherwise: (schema) => schema.strip(), // 使用 strip() 而不是 notRequired() 完全移除字段
  }),
});
const StyledArrowDropDown = styled(ArrowDropDownIcon)(`
  color: #666666;
`);

const StyledLoginTextField = styled(CustomTextField)(`
  & .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #f5f5f5 inset;
    -webkit-text-fill-color: #666666;
  }
`);

const StyledCodeTextField = styled(CustomTextField)(`
  & .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #f5f5f5 inset;
    -webkit-text-fill-color: #666666;
  }
`);

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [notification, setNotification] = useState<{
    message: string;
    severity: AlertColor;
  } | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  // const [emailFocused, setEmailFocused] = useState(false); // Will be handled by Formik's touched state
  // const [phoneFocused, setPhoneFocused] = useState(false); // Will be handled by Formik's touched state
  const [loginMode, setLoginMode] = useState<"code" | "password">("code");

  // Use a ref to track if we've already applied the email from URL
  const emailAppliedRef = React.useRef(false);

  // Extract email from URL parameter
  useEffect(() => {
    if (typeof window !== "undefined" && !emailAppliedRef.current) {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) {
        // Set login type to email
        setLoginType("email");

        // We'll update formik after it's initialized
        emailAppliedRef.current = true;

        // Store the email for later use
        window.sessionStorage.setItem("loginEmailParam", emailParam);
      } else {
        // Clear any previously stored email if no email in URL
        window.sessionStorage.removeItem("loginEmailParam");
      }
    }
  }, []);
  // const [verificationCode, setVerificationCode] = useState(""); // Will be handled by Formik
  const [codeFocused, setCodeFocused] = useState(false); // Keep for UI interaction if needed, or remove if fully Formik controlled
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [countryCodes, setCountryCodes] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const { setUserProfile } = useUserProfileStore(); // Get the setUserProfile action from Zustand store
  const [triggerPhoneAutoSelect, setTriggerPhoneAutoSelect] = useState(false);

  useEffect(() => {
    console.log("loginType:", loginType, "loginMode:", loginMode, "triggerPhoneAutoSelect:", triggerPhoneAutoSelect);
    if (loginType === "phone" && loginMode === "code") {
      setTriggerPhoneAutoSelect(true);
      // 重置，避免后续无效触发
      setTimeout(() => setTriggerPhoneAutoSelect(false), 500);
    }
  }, [loginType, loginMode]);

  useEffect(() => {
    if (triggerPhoneAutoSelect) {
      formik.setFieldValue("selectedCountry", selectedCountry || "1");
    }
  }, [triggerPhoneAutoSelect]);

  // Get email from sessionStorage if available
  const savedEmail =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("loginEmailParam") || ""
      : "";

  const formik = useFormik({
    initialValues: {
      email: savedEmail, // Use email from sessionStorage if available
      phoneNumber: "",
      verificationCode: "",
      password: "",
      loginType: "email", // Add loginType to initialValues to be used in validationSchema
      selectedCountry: selectedCountry, // 绑定初始国家码
      agreed: false, // Agreement checkbox state
    },
    validationSchema: Yup.object()
      .shape({
        ...validationSchema.fields,
        agreed: Yup.boolean()
          // .oneOf([true], 'You must accept the terms and conditions')
          .required("You must accept the terms and conditions"),
      })
      .concat(validationSchema),
    onSubmit: async (values) => {
      if (loginMode === "code") {
        // Use global verification function for code login
        const success = await verifyLoginWithCode(
          values.verificationCode,
          values.loginType as "email" | "phone",
          {
            email: values.email,
            phoneNumber: values.phoneNumber,
            selectedCountry: selectedCountry,
          },
          {
            setNotification,
            setIsLoading,
            onSuccess: async () => {
              // Fetch user profile after successful login
              const accessToken = localStorage.getItem("access_token");
              if (accessToken) {
                try {
                  const userProfileResponse = await fetch(
                    "https://dev-api.bdy.tech/user/info",
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );

                  if (userProfileResponse.ok) {
                    const profileData: UserProfileResponse =
                      await userProfileResponse.json();
                    if (profileData.code === 200 && profileData.data) {
                      setUserProfile(profileData.data);
                      console.log(
                        "User profile fetched and stored:",
                        profileData.data
                      );
                    } else {
                      console.error(
                        "Failed to fetch user profile:",
                        profileData.msg
                      );
                      setNotification({
                        message: `Failed to fetch user profile: ${
                          profileData.msg || "Unknown error"
                        }`,
                        severity: "warning",
                      });
                    }
                  } else {
                    const errorData = await userProfileResponse.json();
                    console.error("Error fetching user profile:", errorData);
                    setNotification({
                      message: `Error fetching user profile: ${
                        errorData.msg || userProfileResponse.statusText
                      }`,
                      severity: "warning",
                    });
                  }
                } catch (profileError) {
                  console.error(
                    "Network or other error during user profile fetch:",
                    profileError
                  );
                  setNotification({
                    message:
                      "An unexpected error occurred while fetching user profile.",
                    severity: "warning",
                  });
                }
              }

              // Navigate to overview page
              setTimeout(() => {
                router.push("/overview");
              }, 1500);
            },
          }
        );

        // Return early for code login - global function handles everything
        return;
      }

      // Handle password login (existing logic)
      setIsLoading(true);
      setApiError(null);
      setNotification(null);
      const clientId = "24b5d2a7f4714409b4cc60bafc1dd2f6";
      let payload: PasswordLoginRequest;

      try {
        const commonPasswordPayload = {
          clientId,
          grantType: "password" as "password",
          username: "",
          password: values.password,
        };
        if (values.loginType === "email") {
          payload = { ...commonPasswordPayload, username: values.email };
        } else {
          // phone
          payload = {
            ...commonPasswordPayload,
            username: selectedCountry + values.phoneNumber,
          };
        }

        const response = await fetch("https://dev-api.bdy.tech/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const loginData = await response.json();
          if (loginData.code === 500) {
            return setNotification({
              message:
                loginData.msg ||
                "An unexpected error occurred. Please try again.",
              severity: "error",
            });
          }
          const accessToken = loginData.data.access_token;
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", loginData.data.refresh_token);
          console.log("Login successful:", loginData);
          console.log("accessToken2222:", accessToken);

          // Set the cookie
          Cookies.set("auth-token", accessToken, {
            path: "/",
            expires: 1,
          }); // expires: 1 means 1 day

          // Fetch user profile
          if (accessToken) {
            try {
              const userProfileResponse = await fetch(
                "https://dev-api.bdy.tech/user/info",
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
              console.log("userProfileResponse:", userProfileResponse);

              if (userProfileResponse.ok) {
                const profileData: UserProfileResponse =
                  await userProfileResponse.json();
                console.log("profileData:", profileData);
                if (profileData.code === 200 && profileData.data) {
                  setUserProfile(profileData.data); // Store user profile in Zustand
                  console.log(
                    "User profile fetched and stored:",
                    profileData.data
                  );
                } else {
                  console.error(
                    "Failed to fetch user profile:",
                    profileData.msg
                  );
                  setNotification({
                    message: `Failed to fetch user profile: ${
                      profileData.msg || "Unknown error"
                    }`,
                    severity: "warning",
                  });
                }
              } else {
                const errorData = await userProfileResponse.json();
                console.error("Error fetching user profile:", errorData);
                setNotification({
                  message: `Error fetching user profile: ${
                    errorData.msg || userProfileResponse.statusText
                  }`,
                  severity: "warning",
                });
              }
            } catch (profileError) {
              console.error(
                "Network or other error during user profile fetch:",
                profileError
              );
              setNotification({
                message:
                  "An unexpected error occurred while fetching user profile.",
                severity: "warning",
              });
            }
          }
          router.push("/overview"); // Navigate after login and profile fetch attempt
        } else {
          const errorData = await response.json();
          const message =
            errorData.msg || `Login failed with status: ${response.status}`;
          setNotification({ message, severity: "error" });
          // setApiError(message);
          console.error("Login failed:", errorData);
        }
      } catch (error) {
        setNotification({
          message: "An unexpected error occurred. Please try again.",
          severity: "error",
        });
        // setApiError('An unexpected error occurred. Please try again.');
        console.error("Network or other error during login:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Update formik's loginType when local loginType changes
  useEffect(() => {
    formik.setFieldValue("loginType", loginType);
  }, [loginType, formik.setFieldValue]);

  const handleForgotPasswordClick = () => {
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
          // console.log("Active Countries:", activeCountries);

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

  // Log state changes
  useEffect(() => {
    // console.log("countryCodes state updated:", countryCodes);
    if (formik.values.loginType === "phone") {
      console.log("select country:", selectedCountry);
      console.log("formik.values.phoneNumber:", formik.values.phoneNumber);
      const fullPhoneNum = `+${selectedCountry}${formik.values.phoneNumber}`;
      console.log("useEffect fullPhoneNum:", fullPhoneNum);
    }
  }, [countryCodes, formik.values.phoneNumber]);

  useEffect(() => {
    console.log("selectedCountry state updated:", selectedCountry);
  }, [selectedCountry]);

  const handleSendEmailCode = async () => {
    if (countdown === 0) {
      // Validation check
      if (
        formik.values.loginType !== "email" ||
        !formik.values.email ||
        formik.errors.email
      ) {
        formik.validateField("email");
        return;
      }

      await sendEmailVerificationCode(formik.values.email, {
        setNotification,
        setCountdown,
        countdown,
      });
    }
  };

  const handleSendPhoneCode = async () => {
    if (countdown > 0) return;

    // Validation check
    if (
      formik.values.loginType !== "phone" ||
      !formik.values.phoneNumber ||
      !selectedCountry ||
      formik.errors.phoneNumber
    ) {
      formik.validateField("phoneNumber");
      return;
    }

    await sendPhoneVerificationCode(
      formik.values.phoneNumber,
      selectedCountry,
      {
        setNotification,
        setCountdown,
        countdown,
      }
    );
  };

  const handleEmailLogin = () => {};
  const handlePhoneLogin = () => {};

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
          {forgotPassword ? "Forgot Password" : title}
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
          <Box>
            <Box display="flex" gap={2} mb={1}>
              <Box
                onClick={() => {
                  setLoginType("email");
                  formik.setFieldValue("verificationCode", "");
                  // formik.setFieldValue("loginType", "email"); // Already handled by useEffect
                }}
                sx={{
                  cursor: "pointer",
                  color: loginType === "email" ? "#222" : "#666",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Email
              </Box>
              <Box
                onClick={() => {
                  setLoginType("phone");
                  formik.setFieldValue("verificationCode", "");
                  // formik.setFieldValue("loginType", "phone"); // Already handled by useEffect
                }}
                sx={{
                  cursor: "pointer",
                  color: loginType === "phone" ? "#222" : "#666",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                Phone
              </Box>
            </Box>
            {loginType === "email" ? (
              <EmailInput
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={
                  formik.touched.email && formik.errors.email
                    ? String(formik.errors.email)
                    : undefined
                }
                {...formik.getFieldProps("email")} // This passes value, onChange, onBlur
              />
            ) : (
              <PhoneInput
                countryCodes={countryCodes}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                triggerAutoSelect={triggerPhoneAutoSelect}
                setFieldValue={formik.setFieldValue} // Pass setFieldValue
                validateField={formik.validateField} // Pass validateField
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? String(formik.errors.phoneNumber)
                    : undefined
                }
                {...formik.getFieldProps("phoneNumber")} // This now correctly passes name, value, onChange, onBlur
              />
            )}
          </Box>
          {/* Verification Code and Password fields will also need to be connected to Formik */}
          {!forgotPassword &&
            (loginMode === "code" ? (
              <Box>
                <CustomFormLabel htmlFor="code" color="#222" fontWeight="400">
                  Verification Code
                </CustomFormLabel>
                <StyledCodeTextField
                  id="code"
                  name="verificationCode" // Ensure name attribute is set for Formik
                  variant="outlined"
                  fullWidth
                  value={formik.values.verificationCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // Add error and helperText from formik if validation is added for this field
                  // error={formik.touched.verificationCode && Boolean(formik.errors.verificationCode)}
                  // helperText={formik.touched.verificationCode && formik.errors.verificationCode}
                  onFocus={() => setCodeFocused(true)} // Keep manual focus state if needed for UI elements like clear button
                  // onBlur={() => setCodeFocused(false)} // Formik's handleBlur can be used
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {codeFocused && formik.values.verificationCode && (
                          <IconButton
                            onMouseDown={(
                              e: React.MouseEvent<HTMLButtonElement>
                            ) => {
                              e.preventDefault();
                              formik.setFieldValue("verificationCode", "");
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
                          onClick={() => {
                            // Trigger validation before sending code
                            if (formik.values.loginType === "email") {
                              formik.validateField("email").then(() => {
                                if (!formik.errors.email) {
                                  handleSendEmailCode();
                                }
                              });
                            } else if (formik.values.loginType === "phone") {
                              formik.validateField("phoneNumber").then(() => {
                                if (!formik.errors.phoneNumber) {
                                  handleSendPhoneCode();
                                }
                              });
                            }
                          }}
                          disabled={
                            countdown > 0 ||
                            (formik.values.loginType === "email" &&
                              !formik.values.email) ||
                            (formik.values.loginType === "phone" &&
                              !formik.values.phoneNumber)
                          }
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
                          {countdown > 0 ? (
                            <span style={{ color: "#3C7BF4" }}>
                              {countdown}s
                            </span>
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
                    },
                  }}
                />
              </Box>
            ) : (
              <Box>
                <CustomFormLabel
                  htmlFor="password"
                  color="#222"
                  fontWeight="400"
                >
                  Password
                </CustomFormLabel>
                <StyledCodeTextField
                  id="password"
                  name="password" // Ensure name attribute is set for Formik
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    formik.handleBlur(e);
                    setPasswordFocused(false);
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {passwordFocused && formik.values.password && (
                            <IconButton
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                formik.setFieldValue("password", "");
                              }}
                              edge="end"
                              size="small"
                              sx={{ mr: 0.5 }}
                            >
                              <CancelIcon
                                sx={{ color: "#666", fontSize: "20px" }}
                              />
                            </IconButton>
                          )}
                          <Box
                            component="span"
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{
                              cursor: "pointer",
                              color: "#666",
                              display: "flex",
                              "&:hover": {
                                color: "#333",
                              },
                            }}
                          >
                            {showPassword ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </Box>
                        </Box>
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
              </Box>
            ))}

          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
            mb={4}
          >
            <Typography
              component={Link}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // setForgotPassword(false);
                setLoginMode(loginMode === "code" ? "password" : "code");
              }}
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "#3C7BF4",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {countdown > 0
                ? ""
                : loginMode === "code"
                ? "Switch to password login"
                : "Switch to code login"}
            </Typography>

            {loginMode === "password" && (
              <Typography
                component={Link}
                href="/auth/forgot-password"
                fontWeight="500"
                sx={{
                  textDecoration: "none",
                  color: "#3C7BF4",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                // onClick={handleForgotPasswordClick}
              >
                Forgot password
              </Typography>
            )}

            {countdown > 0 && (
              <Typography
                component={Link}
                href="#" // Changed from /auth/forgot-password to # as it's a popover trigger
                fontWeight="500"
                sx={{
                  textDecoration: "none",
                  color: "#A9A9A9",
                  fontSize: "12px",
                }}
                aria-owns={open ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                {countdown > 0 ? "Not able to receive verification code?" : ""}
                {loginMode === "code" ? "" : "Forgot password"}
              </Typography>
            )}
            <Popover
              id="mouse-over-popover"
              sx={{ pointerEvents: "none" }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: "#FFF",
                  width: "230px",
                  color: "#000",
                }}
              >
                Please try the following steps:
                <ul
                  style={{
                    color: "#666",
                    padding: "2px 6px",
                    fontSize: "12px",
                  }}
                >
                  <li>
                    Check if you are using the correct email address
                    abc***@gmail.com
                  </li>
                  <li>
                    If you are still unable to receive it, please check your
                    spam folder.
                  </li>
                </ul>
              </Typography>
            </Popover>
          </Stack>
        </Stack>

        <Box mb={1}>
          {forgotPassword ? (
            <Button
              sx={{
                borderRadius: "36px",
                "&:hover": {
                  bgcolor: "#8ce61c",
                },
              }}
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              component={Link}
              href="#" // Prevent navigation
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }} // Trigger Formik submission
            >
              Next
            </Button>
          ) : (
            <Button
              sx={{
                borderRadius: "36px",
                "&:hover": {
                  bgcolor: "#8ce61c",
                },
                "&.Mui-disabled": {
                  color: "rgba(0, 0, 0, 0.6)",
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                  opacity: 1,
                },
              }}
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              type="submit"
              disabled={
                formik.isSubmitting || isLoading || !formik.values.agreed
              }
            >
              <Box component="span" sx={{ opacity: formik.isSubmitting || isLoading || !formik.values.agreed ? 0.7 : 1 }}>
                Sign In
              </Box>
            </Button>
          )}
        </Box>

        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={
                <CustomCheckbox
                  name="agreed"
                  checked={Boolean(formik.values.agreed)}
                  onChange={(e) => {
                    formik.setFieldValue("agreed", e.target.checked);
                  }}
                  onBlur={formik.handleBlur}
                />
              }
              label=""
            />
            {formik.touched.agreed && formik.errors.agreed && (
              <Typography color="error" variant="caption">
                {formik.errors.agreed}
              </Typography>
            )}
          </FormGroup>

          <Typography
            sx={{
              textDecoration: "none",
              color: "#666",
              fontSize: "12px",
            }}
          >
            I have read and agreed to the
            <Typography
              component={Link}
              href="/terms"
              target="_blank"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "#8ab0f8",
                fontSize: "12px",
              }}
            >
              {" "}
              Toocans User Agreement{" "}
            </Typography>
            and
            <Typography
              component={Link}
              href="/privacy"
              target="_blank"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "#8ab0f8",
                fontSize: "12px",
              }}
            >
              {" "}
              Privacy policy{" "}
            </Typography>
            {loginMode === "code" && (
              <>Unregistered users will be automatically registered directly”</>
            )}
          </Typography>
        </Stack>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
