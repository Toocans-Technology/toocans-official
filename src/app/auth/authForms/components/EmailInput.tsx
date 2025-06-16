import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useMemo, useState } from "react";

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const StyledLoginTextField = styled(CustomTextField)(`
  & .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #f5f5f5 inset;
    -webkit-text-fill-color: #666666;
  }
`);

const styledLoginTextFieldSx = {
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid transparent",
  },
  "& .MuiOutlinedInput-root": {
    background: "#f5f5f5",
    borderRadius: "8px",
    color: "#000",
    transition: "border-color 0.2s ease-in-out",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #222",
      },
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #222",
      },
    },
  },
};

const clearIconButtonSx = { padding: "2px" };
const cancelIconSx = { color: "#666666", fontSize: "16px" };

const EmailInput: React.FC<EmailInputProps> = ({
  error,
  helperText,
  ...rest
}) => {
  console.log("Rendering EmailInput");
  const [focused, setFocused] = useState(false);
  const value = rest.value as string;

  const handleMouseDownClear = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const changeEvent = {
        target: { name: rest.name, value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      rest.onChange?.(changeEvent);
    },
    [rest.name, rest.onChange]
  );

  const inputProps = useMemo(() => {
    return {
      endAdornment:
        focused && value ? (
          <InputAdornment position="end">
            <IconButton
              onMouseDown={handleMouseDownClear}
              edge="end"
              size="small"
              sx={clearIconButtonSx}
            >
              <CancelIcon sx={cancelIconSx} />
            </IconButton>
          </InputAdornment>
        ) : null,
    };
  }, [focused, value, handleMouseDownClear]);

  return (
    <StyledLoginTextField
      id="email"
      type="email"
      variant="outlined"
      fullWidth
      placeholder="Enter Email"
      {...rest}
      onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        rest.onBlur?.(e);
      }}
      InputProps={inputProps}
      sx={styledLoginTextFieldSx}
      error={error}
      helperText={helperText}
    />
  );
};

export default EmailInput;
