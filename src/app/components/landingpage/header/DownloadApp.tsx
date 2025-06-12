import { Box, IconButton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React from "react";

const StyledStack = styled(Stack)(({ theme }) => ({
  position: "relative",
  "&:hover": {
    "& .qr-code-box": {
      opacity: 1,
      visibility: "visible",
      transform: "translateX(-50%) translateY(0)",
    },
  },
}));

const StyledDownloadButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const QRCodeBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "150%",
  left: "40%",
  transform: "translateX(-50%) translateY(-10px)",
  marginTop: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: "#FFFFFF",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  opacity: 0,
  visibility: "hidden",
  transition: theme.transitions.create(["opacity", "transform", "visibility"], {
    duration: theme.transitions.duration.shorter,
  }),
}));

const DownloadApp: React.FC = () => {
  return (
    <StyledStack direction="row" spacing={2} alignItems="center">
      <StyledDownloadButton>
        <Image
          src="/images/svgs/download-app.svg"
          alt="Download App"
          width={18}
          height={18}
        />
      </StyledDownloadButton>
      <QRCodeBox className="qr-code-box">
        <Image
          src="/images/svgs/download-code.svg"
          alt="QR Code"
          width={100}
          height={100}
          style={{ borderRadius: "8px" }}
        />
        <Typography
          variant="caption"
          color="#222222"
          align="center"
          sx={{ whiteSpace: "nowrap" }}
        >
          Scan to
          <br />
          download app
        </Typography>
      </QRCodeBox>
    </StyledStack>
  );
};

export default DownloadApp;
