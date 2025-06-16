// import { Button, Stack } from "@mui/material";
// import Link from "next/link";

// import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
// import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

// export default function AuthForgotPassword(){
//  return (
//   <>
//     <Stack mt={4} spacing={2}>
//       <CustomFormLabel htmlFor="reset-email">Email Adddress</CustomFormLabel>
//       <CustomTextField id="reset-email" variant="outlined" fullWidth />

//       <Button
//         color="primary"
//         variant="contained"
//         size="large"
//         fullWidth
//         component={Link}
//         href="/"
//       >
//         Forgot Password
//       </Button>
//       <Button
//         color="primary"
//         size="large"
//         fullWidth
//         component={Link}
//         href="/auth/auth1/login"
//       >
//         Back to Login
//       </Button>
//     </Stack>
//   </>
// )};

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Alert
} from "@mui/material";
// import { useRouter } from 'next/navigation'; // No longer needed
import NewPasswordForm from './components/NewPasswordForm';

interface NotificationState {
  type: "success" | "error";
  message: string;
}

interface AuthNewPasswordProps {
  title?: string;
  subtitle?: JSX.Element;
  subtext?: JSX.Element;
}

const AuthNewPassword = ({ title, subtitle, subtext }: AuthNewPasswordProps) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  return (
    <>
      {notification && (
        <Alert
          severity={notification.type}
          sx={{ mb: 2 }}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}
      
      {title ? (
        <Typography fontWeight="500" variant="h3" mb={2} color="#000">
          {title}
        </Typography>
      ) : null}

      {subtext}
      <Box sx={{
        width: { xs: '100%', sm: '432px' },
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        padding: '20px'
      }}>
        <NewPasswordForm setNotification={setNotification} />
      </Box>
      {subtitle}
    </>
  );
};

export default AuthNewPassword;
