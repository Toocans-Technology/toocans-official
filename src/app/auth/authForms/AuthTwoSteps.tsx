import { Box, Stack, Typography, IconButton, Popover } from "@mui/material";
import AuthButton from "@/app/components/forms/theme-elements/AuthButton";
import Link from "next/link";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { useRef, useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';


const AuthTwoSteps = ({ countdown, setCountdown }: { countdown: number, setCountdown: React.Dispatch<React.SetStateAction<number>> }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const timerRef = useRef<NodeJS.Timeout>();
  const router = useRouter();

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    if (countdown > 0) return; // Prevent starting new countdown if one is running
    
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    if (index === 5 && value) {
      const completeCode = newVerificationCode.join('');
      console.log('Verification code entered:', completeCode);
      // Here you can add your validation logic
      // For example: validateCode(completeCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleClear = (index: number) => {
    const newVerificationCode = [...verificationCode];
    
    // Find the first non-empty value from current index
    let clearIndex = index;
    while (clearIndex < verificationCode.length && !newVerificationCode[clearIndex]) {
      clearIndex++;
    }
    
    // If found a value to clear
    if (clearIndex < verificationCode.length) {
      newVerificationCode[clearIndex] = '';
      setVerificationCode(newVerificationCode);
      inputRefs[clearIndex].current?.focus();
    } else {
      // If no value found after current index, clear current and move focus back
      newVerificationCode[index] = '';
      setVerificationCode(newVerificationCode);
      if (index > 0) {
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handleVerify = () => {
    // Your verification logic here
    console.log('Verification code:', verificationCode.join(''));
    router.push('/auth/reset-password');

  };

  return (
    <>
      <Box mt={4}>
        <Stack mb={3}>
          <Stack spacing={2} direction="row">
            {verificationCode.map((value, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                <CustomTextField
                  inputRef={inputRefs[index]}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    maxLength: 1,
                    style: { 
                      textAlign: 'center',
                      caretColor: 'transparent' // Hide cursor
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      color: '#000',
                      '& input': {
                        height: '24px',
                        width: '24px',
                        padding: '8px'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline': { 
                      border: 'none' 
                    }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Stack>
        <Box mb={1}>
          <AuthButton
            disabled={countdown > 0}
            onClick={handleVerify}
          >
            {/* Verify My Account */}
            {countdown > 0 ? <span style={{ color: '#8ce61c' }}>{countdown}s</span> : 'Verify'}
          </AuthButton>
        </Box>

        <Stack direction="row" spacing={1} mt={3}>
          <Typography color="#666" variant="h6" fontWeight="400">
            Didn&apos;t get the code?
          </Typography>
          <Typography
            component={Link}
            href="/"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "#8ce61c",
            }}
          >
            Resend
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

export default AuthTwoSteps;
