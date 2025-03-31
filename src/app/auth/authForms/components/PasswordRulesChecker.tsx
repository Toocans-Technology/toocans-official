import React from 'react';
import { Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

interface PasswordRulesCheckerProps {
  rules: {
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    length: boolean;
  };
}

const PasswordRulesChecker: React.FC<PasswordRulesCheckerProps> = ({ rules }) => {
  const rulesList = [
    { rule: 'lowercase', text: 'At least one lowercase character' },
    { rule: 'uppercase', text: 'At least one uppercase character' },
    { rule: 'number', text: 'At least one number' },
    { rule: 'length', text: '8 to 32 characters' },
  ];

  return (
    <Stack spacing={1} mb={3}>
      {rulesList.map(({ rule, text }) => (
        <Stack key={rule} direction="row" spacing={1} alignItems="center">
          {rules[rule as keyof typeof rules] ? (
            <CheckIcon sx={{ color: '#8ce61c', fontSize: 16 }} />
          ) : (
            <CancelIcon sx={{ color: '#666', fontSize: 16 }} />
          )}
          <Typography variant="caption" color="#666">
            {text}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default PasswordRulesChecker;
