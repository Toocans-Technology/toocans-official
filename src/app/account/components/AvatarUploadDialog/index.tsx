import { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Cancel as CancelIcon, AddBoxOutlined } from "@mui/icons-material";

interface AvatarUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  selectedFile: File | null;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  uploadProgress: number;
  isUploading: boolean;
}

export const AvatarUploadDialog = ({
  open,
  onClose,
  onUpload,
  selectedFile,
  setSelectedFile,
  uploadProgress,
  isUploading,
}: AvatarUploadDialogProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return false;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      // Handle error in parent component
      return false;
    }

    if (file.size > maxSize) {
      // Handle error in parent component
      return false;
    }

    setSelectedFile(file);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": { backgroundColor: "white" },
        color: "#000",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        disabled={isUploading}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "#999",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <CancelIcon />
      </IconButton>
      <DialogTitle sx={{ color: "#000", pt: 5 }}>
        Change Profile Picture
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", py: 3, pt: 0 }}>
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              width: "100%",
              height: 214,
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              bgcolor: isDragging ? "#e0e0e0" : "#e9e9e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px dashed ${isDragging ? "#666" : "transparent"}`,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#e0e0e0",
              },
            }}
          >
            {selectedFile ? (
              <Box
                component="label"
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  cursor: "pointer",
                  "&:hover::before": {
                    content: '"Change Image"',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 500,
                  },
                }}
              >
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  cursor: "pointer",
                  textAlign: "center",
                  p: 2,
                }}
              >
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <AddBoxOutlined
                    sx={{
                      color: isDragging ? "#555" : "#222",
                      fontSize: "32px",
                      mb: 1.5,
                    }}
                  />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  <Typography
                    variant="body2"
                    color="#222"
                    fontSize={14}
                    lineHeight={1.5}
                  >
                    Upload a photo or drag and drop
                    <Typography
                      component="div"
                      variant="body2"
                      color="textSecondary"
                      fontSize={14}
                      lineHeight={1.5}
                      sx={{ mt: 1 }}
                    >
                      Only png, jpg can be uploaded, and the size does not
                      exceed 10MB
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: "100%", mt: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Uploading...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {Math.round(uploadProgress)}%
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "#e0e0e0",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${uploadProgress}%`,
                    height: 6,
                    bgcolor: "primary.main",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "flex-end", gap: 1 }}>
        <Button
          sx={{
            ...buttonSx2,
            padding: "8px 20px",
          }}
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarUploadDialog;
