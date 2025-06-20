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
  triggerAutoSelect?: boolean; 
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
  triggerAutoSelect,

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

  const autocompleteDomRef = useRef<HTMLDivElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (triggerAutoSelect) {
      // 模拟点击 Autocomplete 打开下拉
      if (autocompleteDomRef.current) {
        const event = new MouseEvent("mousedown", { bubbles: true });
        autocompleteDomRef.current.dispatchEvent(event);
      }

      // 聚焦 input
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
    }
  }, [triggerAutoSelect]);

  // Store the selected country's domain short name to distinguish between countries with same code
  const [selectedDomain, setSelectedDomain] = useState<string | undefined>(undefined);

  // Find the country by nationalCode and domainShortName if available
  const autocompleteValue = useMemo(() => {
    // If selectedCountry is empty, return undefined
    if (!selectedCountry) return undefined;
    
    // Find all countries with the matching nationalCode
    const matchingCountries = countryCodes.filter(c => c.nationalCode === selectedCountry);
    
    // If none found, return undefined
    if (matchingCountries.length === 0) return undefined;
    
    // If only one country has this code, return it
    if (matchingCountries.length === 1) return matchingCountries[0];
    
    // If we have a stored domain for this country code, use it
    if (selectedDomain) {
      const countryByDomain = matchingCountries.find(c => c.domainShortName === selectedDomain);
      if (countryByDomain) return countryByDomain;
    }
    
    // If multiple countries share the code (like US and Canada with "1")
    // Default to US ("US") if it exists in the matches
    const usCountry = matchingCountries.find(c => c.domainShortName === "US");
    if (usCountry) return usCountry;
    
    // Otherwise return the first match
    return matchingCountries[0];
  }, [countryCodes, selectedCountry, selectedDomain]);

  const handleAutocompleteChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, newValue: Country | null) => {
      const newCountryCode = newValue?.nationalCode || "";
      setSelectedCountry(newCountryCode); // Update local state
      
      // Store the domain short name to distinguish between countries with same code
      if (newValue?.domainShortName) {
        setSelectedDomain(newValue.domainShortName);
        console.log(`Selected country: ${newValue.countryEnName} (${newValue.domainShortName})`);
      } else {
        setSelectedDomain(undefined);
      }
      
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
    const uniqueKey = `${option.id}-${option.domainShortName}`;
    return (
      <MenuItem {...props} key={uniqueKey} sx={renderOptionMenuItemSx}>
        <img
          key={`${uniqueKey}-flag`}
          src={`https://flagcdn.com/w20/${option.domainShortName?.toLowerCase()}.png`}
          alt={countryName}
          style={renderOptionImageStyle}
          loading="lazy"
        />
        <Box
          key={`${uniqueKey}-content`}
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
      // Use the same logic as autocompleteValue to find the current country
      let currentCountry = undefined;
      
      if (selectedCountry) {
        const matchingCountries = countryCodes.filter(c => c.nationalCode === selectedCountry);
        
        if (matchingCountries.length === 1) {
          currentCountry = matchingCountries[0];
        } else if (matchingCountries.length > 1) {
          // First try to use the stored domain if available
          if (selectedDomain) {
            const countryByDomain = matchingCountries.find(c => c.domainShortName === selectedDomain);
            if (countryByDomain) {
              currentCountry = countryByDomain;
            }
          }
          
          // If no domain match, default to US if it exists
          if (!currentCountry) {
            currentCountry = matchingCountries.find(c => c.domainShortName === "US") || matchingCountries[0];
          }
        }
      }
      
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
      <div ref={autocompleteDomRef}>
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
      </div>
      <StyledLoginTextField
        id="phone"
        inputRef={phoneInputRef}

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
