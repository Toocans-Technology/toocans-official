import React from 'react';
import { Box, Typography, Button, InputAdornment } from '@mui/material';
import TokenDropdown from '@/app/components/shared/TokenDropdown';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import StepIndicator from '@/app/deposit/components/StepIndicator';
import {
  formContainerStyle,
  stepBoxStyle,
  stepHeaderStyle,
  dropdownBoxStyle,
  dropdownBoxWithMarginStyle,
  textFieldStyle,
  amountTextFieldStyle,
  balanceBoxStyle,
  withdrawButtonStyle,
  balanceTypographyStyle,
  balanceValueStyle
} from '../styles/withdrawalFormStyles';

interface WithdrawalFormProps {
  cryptocurrencies: any[];
  selectedCrypto: string;
  handleCryptoSelection: (value: string) => void;
  networks: any[];
  selectedNetwork: string;
  handleNetworkSelection: (value: string) => void;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  cryptocurrencies,
  selectedCrypto,
  handleCryptoSelection,
  networks,
  selectedNetwork,
  handleNetworkSelection
}) => {
  return (
    <Box sx={formContainerStyle}>
      {/* Step 1: Choose token to withdraw */}
      <Box sx={stepBoxStyle}>
        <Box sx={stepHeaderStyle}>
          <StepIndicator step={1} active={true} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#000' }}>
            Choose token to Withdraw
          </Typography>
        </Box>
        <Box sx={dropdownBoxStyle}>
          <TokenDropdown
            options={cryptocurrencies}
            selectedToken={selectedCrypto}
            onChange={handleCryptoSelection}
            placeholder="Search token"
          />
        </Box>
      </Box>

      {/* Step 2: Choose network */}
      <Box sx={stepBoxStyle}>
        <Box sx={stepHeaderStyle}>
          <StepIndicator step={2} active={selectedCrypto !== ''} />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: selectedCrypto ? '#000' : '#999999' }}>
            Set destination
          </Typography>
        </Box>
        <Box sx={dropdownBoxWithMarginStyle}>
          <Typography sx={{ mb: 2, px: 1 }}>On-chain Type</Typography>
          <TokenDropdown
            options={networks}
            selectedToken={selectedNetwork}
            onChange={handleNetworkSelection}
            placeholder="Search network"
          />
        </Box>
        <Box sx={dropdownBoxWithMarginStyle}>
          <CustomFormLabel htmlFor="code" color="#222" fontWeight="400">Address</CustomFormLabel>
          <CustomTextField
            id="code"
            variant="outlined"
            fullWidth
            sx={textFieldStyle}
          />
        </Box>
      </Box>

      {/* Step 3: Withdrawal amount */}
      <Box sx={stepBoxStyle}>
        <Box sx={stepHeaderStyle}>
          <StepIndicator step={3} active={selectedNetwork !== ''} />
          <Typography variant="subtitle1" fontSize={12} fontWeight="bold" sx={{ color: selectedNetwork ? '#000' : '#999999' }}>
            Set withdrawal amount
          </Typography>
        </Box>
        <Box sx={dropdownBoxWithMarginStyle}>
          <CustomFormLabel htmlFor="code" color="#222" fontWeight="400">Amount</CustomFormLabel>
          <CustomTextField
            id="password"
            type={'text'}
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ display: 'flex', gap: 1 }}>
                  <Typography> ETH</Typography>
                  <Typography color="primary" sx={{ cursor: 'pointer' }} onClick={() => {}}>ALL</Typography>
                </InputAdornment>
              ),
            }}
            sx={amountTextFieldStyle}
          />
          <Box sx={balanceBoxStyle}>
            <Typography {...balanceTypographyStyle}>
              Available balance
            </Typography>
            <Typography {...balanceValueStyle}>
              100 USDT
            </Typography>
          </Box>
          <Box sx={balanceBoxStyle}>
            <Typography {...balanceTypographyStyle}>
              Charge and network
            </Typography>
            <Typography {...balanceValueStyle}>
              0.12345678 ETH
            </Typography>
          </Box>
          <Box sx={balanceBoxStyle}>
            <Typography {...balanceTypographyStyle}>
              Received amount
            </Typography>
            <Typography {...balanceValueStyle}>
              0 ETH
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={withdrawButtonStyle}
          >
            Withdraw
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WithdrawalForm;
