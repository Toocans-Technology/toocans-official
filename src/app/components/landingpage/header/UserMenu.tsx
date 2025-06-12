import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link"; // Import Link
import React, { useState } from "react";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 8,
    minWidth: 240,
    backgroundColor: "#FFF",
    color: "#222222",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    "& .MuiMenu-list": {
      padding: "0",
    },
    "& .MuiMenuItem-root": {
      minHeight: 48,
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      textDecoration: "none", // Remove underline from links
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
      "& .MuiSvgIcon-root": {
        width: 20,
        height: 20,
        color: "#666666",
      },
    },
  },
}));

const UserAvatar = styled(IconButton)(({ theme }) => ({
  padding: 8,
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "rgba(0, 0, 0, 0.04)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
}));

interface UserMenuProps {
  email?: string; // Make email optional as it might not be available directly
  displayName?: string; // Use a more generic display name
  uid?: string;
  onLogout: () => void; // Add onLogout prop
}

const UserMenu: React.FC<UserMenuProps> = ({
  email,
  displayName,
  uid,
  onLogout,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copyTooltip, setCopyTooltip] = useState("Copy UID");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    onLogout();
    handleClose();
  };

  const menuItems = [
    { icon: <PersonOutlineIcon />, label: "Overview", href: "/account" }, // Added example href
    { icon: <ArrowCircleDownIcon />, label: "Deposit", href: "/deposit" },
    { icon: <ArrowCircleUpIcon />, label: "Withdraw", href: "/withdrawal" }, // Added example href
    { icon: <SettingsIcon />, label: "Account", href: "/account" }, // Changed from /settings to /account
  ];

  return (
    <Box>
      <UserAvatar onClick={handleClick}>
        {/* Consider using an avatar image if available from userProfile */}
        <PersonOutlineIcon sx={{ width: 24, height: 24 }} />
      </UserAvatar>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          mt: 1,
          "& .MuiPaper-root": {
            width: 200,
            bgcolor: "#fff",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/images/profile/user-0.svg"
                alt="profile"
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#222222",
                  mb: 0.5,
                }}
              >
                {displayName || email || "User"}{" "}
                {/* Show displayName, fallback to email or generic "User" */}
              </Typography>
              {uid && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#666666",
                      fontSize: "14px",
                      lineHeight: "20px",
                    }}
                  >
                    UID:{uid}
                  </Typography>
                  <Tooltip title={copyTooltip} placement="top">
                    <IconButton
                      size="small"
                      onClick={() => {
                        navigator.clipboard.writeText(uid);
                        setCopyTooltip("Copied!");
                        setTimeout(() => setCopyTooltip("Copy UID"), 1500);
                      }}
                      sx={{
                        padding: 0,
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <ContentCopyIcon
                        sx={{
                          width: 16,
                          height: 14,
                          color: "#666666",
                          "&:hover": {
                            color: "#3C7BF4",
                          },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>

        {menuItems.map((item) => (
          <MenuItem
            component={Link}
            href={item.href || "#"}
            key={item.label}
            onClick={handleClose}
          >
            {item.icon}
            <Typography sx={{ fontSize: "16px", color: "#222222" }}>
              {item.label}
            </Typography>
          </MenuItem>
        ))}

        <Box sx={{ p: "0", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <MenuItem onClick={handleLogoutClick}>
            {" "}
            {/* Changed to handleLogoutClick */}
            <ExitToAppIcon />
            <Typography sx={{ fontSize: "16px", color: "#222222" }}>
              Login out
            </Typography>
          </MenuItem>
        </Box>
      </StyledMenu>
    </Box>
  );
};

export default UserMenu;
