import AuthButton from "@/app/components/forms/theme-elements/AuthButton";
import { Box, Popover, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import Link from "next/link";
import React from "react";
import { Country } from "../types/auth";
import EmailInput from "./EmailInput";
import EmailPhoneToggle from "./EmailPhoneToggle";
import PhoneInput from "./PhoneInput";

interface ForgotPasswordFormProps {
  loginType: "email" | "phone";
  setLoginType: (type: "email" | "phone") => void;
  countryCodes: Country[];
  selectedCountry: string;
  setSelectedCountry: (code: string) => void;
  countdown: number;
  open: boolean;
  anchorEl: HTMLElement | null;
  handlePopoverOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handlePopoverClose: () => void;
  handleNext: (formValues: { email: string; phoneNumber: string }) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  loginType,
  setLoginType,
  countryCodes,
  selectedCountry,
  setSelectedCountry,
  countdown,
  open,
  anchorEl,
  handlePopoverOpen,
  handlePopoverClose,
  handleNext,
}) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      phoneNumber: "",
    },
    onSubmit: (values) => {
      handleNext(values);
    },
  });

  return (
    <Box>
      <Box>
        <EmailPhoneToggle loginType={loginType} setLoginType={setLoginType} />
        {loginType === "email" ? (
          <EmailInput
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={
              formik.touched.email && formik.errors.email
                ? String(formik.errors.email)
                : undefined
            }
          />
        ) : (
          <PhoneInput
            {...formik.getFieldProps("phoneNumber")}
            countryCodes={countryCodes}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? String(formik.errors.phoneNumber)
                : undefined
            }
          />
        )}
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
        mb={4}
      >
        <Typography
          component={Link}
          href="/auth/login"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "#3C7BF4",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Switch to password login
        </Typography>

        {countdown > 0 && (
          <Typography
            component={Link}
            href="/auth/auth1/forgot-password"
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
            <ul style={{ color: "#666", padding: "2px 6px", fontSize: "12px" }}>
              <li>
                Check if you are using the correct email address ab***@gm***
              </li>
              <li>
                If you are still unable to receive it, please check your spam
                folder.
              </li>
            </ul>
          </Typography>
        </Popover>
      </Stack>
      <Box mb={1}>
        <AuthButton
          onClick={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          Next
        </AuthButton>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
