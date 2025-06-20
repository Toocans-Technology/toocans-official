import { Cancel as CancelIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import * as Yup from "yup";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "#222",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    "& fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #222",
    },
  },
  "& .MuiInputBase-input": {
    height: "44px",
    padding: "0 14px",
  },
});

interface DisabledAuthenticationProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

const buttonSx = {
  bgcolor: "#f5f5f5",
  color: "#222222",
  border: "none",
  minWidth: "80px",
  borderRadius: "36px",
  "&:hover": {
    bgcolor: "#f5f5f5",
    border: "none",
    boxShadow: "none",
    color: "#555555",
  },
};

const buttonSx2 = {
  // bgcolor: "#9CFF1F",
  color: "#222222",
  border: "none",
  minWidth: "80px",
  borderRadius: "36px",
  bgcolor: "#9CFF1F",
  "&:hover": {
    bgcolor: "#8CE60F", // Slightly darker green on hover
    border: "none",
    boxShadow: "none",
    color: "#222222",
  },
  "&.Mui-disabled": {
    bgcolor: "#E0E0E0",
    color: "#9E9E9E",
  },
};

export const DisabledAuthentication = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}: DisabledAuthenticationProps) => {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const emailSchema = Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required");

  const handleSubmit = async () => {
    try {
      await emailSchema.validate(email);
      setValidationError(null);
      await onSubmit(email);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setValidationError(error.message);
      } else {
        setValidationError("Failed to submit email");
      }
    }
  };

  const handleConfirm = () => {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
        },
        color: "#000",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          component="div"
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#000",
            lineHeight: 1.2,
          }}
        >
          Disable Authentication App
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "#999",
            marginLeft: 1,
          }}
          disabled={loading}
        >
          <CancelIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, mb: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography color={"#222222"} fontWeight={500} mb={1}>
              Google 2FA code
            </Typography>
            <StyledTextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Please enter the Google Authenticator code"
              error={!!validationError}
              helperText={validationError || " "}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ py: 0, pt: 0, px: 0 }}>
        <Button
          sx={{
            ...buttonSx,
            padding: "8px 20px",
          }}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          sx={{
            ...buttonSx2,
            padding: "8px 20px",
          }}
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !email.trim()}
        >
          {loading ? "Disabling..." : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisabledAuthentication;
