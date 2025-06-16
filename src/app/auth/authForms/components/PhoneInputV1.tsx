import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Country } from "../types/auth";

// --- Static Styles and Functions ---
const mainBoxSx = {
  display: "flex",
  gap: 1,
  "& .MuiOutlinedInput-root": {
    background: "#f5f5f5",
    borderRadius: "8px",
    border: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

const autocompleteListboxStyle = {
  backgroundColor: "#fff",
  color: "#000",
  padding: "8px 0",
};

// Updated to accept width parameter
const getPaperComponentSx = (width: number) => ({
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  marginTop: "4px",
  width: width > 0 ? `${width}px` : "auto",
  overflow: "hidden",
});

const renderOptionMenuItemSx = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#000",
  backgroundColor: "#fff",
  padding: "8px 16px",
  minHeight: "44px",
  "&:hover": {
    // backgroundColor: "#f8f9fa",
    backgroundColor: "#e3f2fd",
  },
  "&.Mui-focused": {
    backgroundColor: "#f1f3f5",
  },
  "&.Mui-selected": {
    backgroundColor: "#e9ecef",
    "&:hover": {
      backgroundColor: "#e9ecef",
    },
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#f1f3f5",
  },
  transition: "background-color 0.2s ease-in-out",
};

const renderOptionImageStyle: React.CSSProperties = {
  width: "20px",
  height: "15px",
  objectFit: "cover",
  borderRadius: "2px",
};

const renderInputBoxSx = {
  display: "flex",
  alignItems: "center",
  position: "relative",
};

const renderInputFlagImageStyle: React.CSSProperties = {
  width: "20px",
  height: "15px",
  objectFit: "cover",
  borderRadius: "2px",
  position: "absolute",
  left: "8px",
  zIndex: 1,
};

const clearIconButtonStyleSx = { padding: "2px" };
const cancelIconStyleSx = { color: "#666666", fontSize: "16px" };

const phoneStyledLoginTextFieldSx = {
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
};

const StyledArrowDropDown = styled(ArrowDropDownIcon)(`
  color: #666666;
`);

const getOptionLabel = (option: Country) => {
  return `+${option.nationalCode}`;
};

const filterOptions = (
  options: Country[],
  { inputValue }: { inputValue: string }
) => {
  if (!inputValue) return options;

  const input = inputValue.toLowerCase().trim();
  return options.filter(
    (option) =>
      (option.nationalCode?.toLowerCase().includes(input) ?? false) ||
      (option.countryEnName?.toLowerCase().includes(input) ?? false) ||
      (option.countryName?.toLowerCase().includes(input) ?? false)
  );
};

// --- Component ---
interface PhoneInputProps {
  countryCodes: Country[];
  selectedCountry: string;
  setSelectedCountry: (code: string) => void;
  error?: boolean;
  helperText?: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  validateField: (field: string) => void;
  [key: string]: any;
}

const StyledLoginTextField = styled(CustomTextField)(`
  & .MuiInputBase-input.MuiOutlinedInput-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #f5f5f5 inset;
    -webkit-text-fill-color: #666666;
  }
`);

const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCodes,
  selectedCountry,
  setSelectedCountry,
  setFieldValue,
  validateField,
  error,
  helperText,
  name,
  value,
  onChange,
  onBlur,
  onFocus,
}) => {
  console.log("Rendering PhoneInput");
  const [focused, setFocused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const mainBoxRef = useRef<HTMLDivElement>(null);

  // Measure container width when component mounts or updates
  useEffect(() => {
    if (mainBoxRef.current) {
      const width = mainBoxRef.current.offsetWidth;
      setContainerWidth(width);
    }
  }, []);

  const autocompleteValue = useMemo(() => {
    return (
      countryCodes.find((c) => c.nationalCode === selectedCountry) || undefined
    );
  }, [countryCodes, selectedCountry]);

  const handleAutocompleteChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, newValue: Country | null) => {
      const newCountryCode = newValue?.nationalCode || "";
      setSelectedCountry(newCountryCode); // Update local state
      setFieldValue("selectedCountry", newCountryCode, false); // Update Formik state for country, don't validate yet
      setFieldValue("phoneNumber", "", false); // Clear phone number in Formik, don't validate yet
      validateField("phoneNumber"); // Explicitly trigger validation for phoneNumber
    },
    [setSelectedCountry, setFieldValue, validateField]
  );

  const MemoizedPaperComponent = useCallback(
    (props: any) => {
      return <Paper {...props} sx={getPaperComponentSx(containerWidth)} />;
    },
    [containerWidth]
  );

  const memoizedRenderOption = useCallback((props: any, option: Country) => {
    const countryName = option.countryEnName || option.countryName || "Unknown";
    return (
      <MenuItem {...props} key={option.id} sx={renderOptionMenuItemSx}>
        <img
          key={`${option.id}-flag`}
          src={`https://flagcdn.com/w20/${option.domainShortName?.toLowerCase()}.png`}
          alt={countryName}
          style={renderOptionImageStyle}
          loading="lazy"
        />
        <Box
          key={`${option.id}-content`}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <span>{countryName}</span>
          <span style={{ color: "#666" }}>+{option.nationalCode}</span>
        </Box>
      </MenuItem>
    );
  }, []);

  const memoizedRenderInput = useCallback(
    (params: any) => {
      const currentCountry = countryCodes.find(
        (c) => c.nationalCode === selectedCountry
      );
      return (
        <Box sx={renderInputBoxSx}>
          {selectedCountry && currentCountry && (
            <img
              src={`https://flagcdn.com/w20/${currentCountry?.domainShortName?.toLowerCase()}.png`}
              alt={currentCountry?.countryEnName || ""}
              style={renderInputFlagImageStyle}
              loading="lazy"
            />
          )}
          <TextField
            {...params}
            sx={{
              "& .MuiInputBase-input": {
                color: "#000",
                paddingLeft: selectedCountry ? "32px !important" : "14px",
                width: "125px",
                height: "27px",
              },
            }}
          />
        </Box>
      );
    },
    [countryCodes, selectedCountry]
  );

  const handlePhoneFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handlePhoneBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleClearPhoneMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const changeEvent = {
        target: { name: name, value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(changeEvent);
    },
    [name, onChange]
  );

  const phoneInputPropsAdornment = useMemo(() => {
    return {
      endAdornment:
        focused && value ? (
          <InputAdornment position="end">
            <IconButton
              onMouseDown={handleClearPhoneMouseDown}
              edge="end"
              size="small"
              sx={clearIconButtonStyleSx}
            >
              <CancelIcon sx={cancelIconStyleSx} />
            </IconButton>
          </InputAdornment>
        ) : null,
    };
  }, [focused, value, handleClearPhoneMouseDown]);

  return (
    <Box ref={mainBoxRef} sx={mainBoxSx}>
      <Autocomplete
        value={autocompleteValue}
        onChange={handleAutocompleteChange}
        popupIcon={<StyledArrowDropDown />}
        options={countryCodes}
        getOptionLabel={getOptionLabel}
        filterOptions={filterOptions}
        ListboxProps={{ style: autocompleteListboxStyle }}
        PaperComponent={MemoizedPaperComponent}
        renderOption={memoizedRenderOption}
        renderInput={memoizedRenderInput}
        disableClearable
        size="small"
        sx={{ width: "90px" }}
      />
      <StyledLoginTextField
        id="phone"
        name={name}
        value={value}
        onChange={onChange}
        variant="outlined"
        fullWidth
        placeholder="Enter Phone Number"
        onFocus={handlePhoneFocus}
        onBlur={handlePhoneBlur}
        InputProps={phoneInputPropsAdornment}
        sx={phoneStyledLoginTextFieldSx}
        error={error}
        helperText={helperText}
      />
    </Box>
  );
};

export default PhoneInput;
