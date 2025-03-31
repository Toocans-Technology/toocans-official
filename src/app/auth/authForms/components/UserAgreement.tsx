import React from 'react';
import { Stack, FormGroup, FormControlLabel, Typography } from '@mui/material';
import Link from 'next/link';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';

interface UserAgreementProps {
  loginMode: 'code' | 'password';
}

const UserAgreement: React.FC<UserAgreementProps> = ({ loginMode }) => {
  return (
    <Stack
      justifyContent="space-between"
      direction="row"
      alignItems="center"
      my={2}
    >
      <FormGroup>
        <FormControlLabel
          control={<CustomCheckbox defaultChecked />}
          label=""
        />
      </FormGroup>

      <Typography sx={{
        textDecoration: "none",
        color: "#666",
        fontSize: '12px'
      }}>
        I have read and agreed to the
        <Typography
          component={Link}
          href="/auth/auth1/forgot-password"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "#8ab0f8",
            fontSize: '12px'
          }}
        > Toocans User Agreement </Typography>
        and
        <Typography
          component={Link}
          href="/auth/auth1/forgot-password"
          fontWeight="500"
          sx={{
            textDecoration: "none",
            color: "#8ab0f8",
            fontSize: '12px'
          }}
        > Privacy policy </Typography>
        {loginMode === 'code' && <>Unregistered users will be automatically
          registered directly"</>}
      </Typography>
    </Stack>
  );
};

export default UserAgreement;