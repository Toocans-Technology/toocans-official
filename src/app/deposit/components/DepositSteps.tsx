import React from 'react';
import { Box, Typography } from '@mui/material';
import StepIndicator from '@/app/deposit/components/StepIndicator';
import TokenDropdown from '@/app/components/shared/TokenDropdown';
import {
  stepBoxStyle,
  stepHeaderStyle,
  stepHeaderTextStyle,
  dropdownBoxStyle,
  dropdownBoxWithMarginStyle,
  depositDetailBoxStyle,
  qrCodeBoxStyle,
  addressBoxStyle,
  addressContainerStyle,
  addressTextStyle,
  copyButtonStyle,
  minimumDepositBoxStyle,
  minimumDepositTextStyle,
  minimumDepositAmountStyle
} from '../styles/depositStepsStyles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';

interface DepositStepsProps {
  selectedCrypto: string;
  selectedNetwork: string;
  handleCryptoSelection: (crypto: string) => void;
  handleNetworkSelection: (network: string) => void;
  cryptocurrencies: any[];
  networks: any[];
  showCopyNotification: boolean;
  setShowCopyNotification: (value: boolean) => void;
}

const DepositSteps: React.FC<DepositStepsProps> = ({
  selectedCrypto,
  selectedNetwork,
  handleCryptoSelection,
  handleNetworkSelection,
  cryptocurrencies,
  networks,
  showCopyNotification,
  setShowCopyNotification
}) => {
  return (
    <Box>
      {/* Step 1: Choose token to deposit */}
      <Box sx={stepBoxStyle}>
        <Box sx={stepHeaderStyle}>
          <StepIndicator step={1} active={true} />
          <Typography variant="subtitle1" fontWeight="bold" sx={stepHeaderTextStyle(true)}>
            Choose token to deposit
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
          <Typography variant="subtitle1" fontWeight="bold" sx={stepHeaderTextStyle(selectedCrypto !== '')}>
            Choose network
          </Typography>
        </Box>
        <Box sx={dropdownBoxWithMarginStyle}>
          {selectedCrypto && <TokenDropdown
            options={networks}
            selectedToken={selectedNetwork}
            onChange={handleNetworkSelection}
            placeholder="Search network"
          />}
        </Box>
      </Box>

      {/* Step 3: Deposit details */}
      <Box sx={stepBoxStyle}>
        <Box sx={stepHeaderStyle}>
          <StepIndicator step={3} active={selectedNetwork !== ''} />
          <Typography variant="subtitle1" fontSize={12} fontWeight="bold" sx={stepHeaderTextStyle(selectedNetwork !== '')}>
            Deposit details
          </Typography>
        </Box>
        {selectedNetwork && (
          <Box sx={depositDetailBoxStyle}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              {/* QR Code */}
              <Box sx={qrCodeBoxStyle}>
                <img 
                  src={"/images/logos/code.png"}
                  alt="Deposit Address QR Code"
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
              {/* Deposit Address */}
              <Box sx={addressBoxStyle}>
                <Typography variant="subtitle2" color="#666666" gutterBottom>
                  Deposit address
                </Typography>
                <Box 
                  sx={addressContainerStyle}
                >
                  <Typography 
                    variant="body2" 
                    component="span"
                    sx={addressTextStyle}
                  >
                    0xUQAaGjxckIhrd4zUkBC8IG_pkT307zJrN_IfMUnI0oZ6g
                  </Typography>
                  <Box 
                    component="button"
                    onClick={() => {
                      navigator.clipboard.writeText('0xUQAaGjxckIhrd4zUkBC8IG_pkT307zJrN_IfMUnI0oZ6g');
                      setShowCopyNotification(true);
                      setTimeout(() => setShowCopyNotification(false), 2000);
                    }}
                    sx={copyButtonStyle(showCopyNotification)}
                  >
                    {showCopyNotification ? (
                      <DoneIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <ContentCopyIcon sx={{ fontSize: 18 }} />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        <Box sx={minimumDepositBoxStyle}>
          <Typography variant="subtitle1" sx={minimumDepositTextStyle}>
            Minimum deposit
          </Typography>
          <Typography variant="subtitle1" sx={minimumDepositAmountStyle}>
            100 USDT
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DepositSteps;
