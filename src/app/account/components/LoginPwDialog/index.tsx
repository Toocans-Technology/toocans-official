import {
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useState } from "react";
import * as Yup from "yup";

interface LoginPwDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

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

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
});

export const LoginPwDialog = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}: LoginPwDialogProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user types
    if (validationError) setValidationError(null);
  };

  const handleSubmit = useCallback(async () => {
    try {
      await passwordSchema.validate(formData, { abortEarly: false });
      setValidationError(null);
      await onSubmit(formData.currentPassword, formData.newPassword);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setValidationError(error.errors[0]);
      } else {
        setValidationError("Failed to update password. Please try again.");
      }
    }
  }, [formData, onSubmit]);

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
      <Box sx={{ position: "relative" }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#999",
          }}
          disabled={loading}
        >
          <CancelIcon />
        </IconButton>
        <DialogTitle
          sx={{ p: 0, mb: 3, fontSize: "20px", fontWeight: 600, color: "#222" }}
        >
          Change Login Password
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 0, mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="body2" fontWeight={500} mb={1} color="#222">
              New Password
            </Typography>
            <StyledTextField
              fullWidth
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: "#666" }}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={500} mb={1} color="#222">
              Confirm New Password
            </Typography>
            <StyledTextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              error={!!validationError}
              helperText={validationError || " "}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      size="small"
                      sx={{ color: "#666" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "flex-end", gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            ...buttonSx,
            padding: "8px 20px",
          }}
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
          disabled={
            loading || !formData.newPassword || !formData.confirmPassword
          }
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm"}
        </Button>
      </DialogActions>

      {/* <DialogActions sx={{ p: 0, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "#000",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            loading ||
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
          }
          sx={{
            backgroundColor: "#3C7BF4",
            color: "#fff",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "8px",
            px: 3,
            "&:hover": {
              backgroundColor: "#2a56c7",
            },
            "&:disabled": {
              backgroundColor: "#f5f5f5",
              color: "#999",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm"}
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default LoginPwDialog;
