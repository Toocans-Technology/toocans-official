"use client";

import PageContainer from "@/app/components/container/PageContainer";
import LpHeader from "@/app/components/landingpage/header/Header";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

interface TokenData {
  icon: string;
  name: string;
  price: string;
  amount: string;
  value: string;
}

const tokens: TokenData[] = [
  {
    icon: "/images/crypto/btc.png",
    name: "BTC",
    price: "$67,725.90",
    amount: "1.60",
    value: "$67,725.90",
  },
  {
    icon: "/images/crypto/usdt.png",
    name: "USDT",
    price: "$1.00",
    amount: "0",
    value: "$0",
  },
  {
    icon: "/images/crypto/usdt.png",
    name: "USDT",
    price: "$3725.00",
    amount: "2.00",
    value: "$7450.00",
  },
];

export default function Overview() {
  const [activeButton, setActiveButton] = React.useState("deposit");
  const [showBalance, setShowBalance] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(true);

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <React.Fragment>
      <Dialog
        maxWidth="xs"
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{ "& .MuiDialog-paper": { backgroundColor: "white" } }}
      >
        <DialogTitle>Withdrawal Security Settings</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CancelIcon />
        </IconButton>
        <Divider variant="middle" />
        <DialogContent
          sx={{ gap: 2, display: "flex", flexDirection: "column" }}
        >
          <Typography>
            For your account security, this operation is subject to the
            following conditions.
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            bgcolor="#F8F8F8"
            p={2}
            borderRadius={1}
          >
            <Typography color="#1D2129">Email Authentication</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon color="success" />
              <Typography color="#1ACA75">Verified</Typography>
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            bgcolor="#F8F8F8"
            p={2}
            borderRadius={1}
          >
            <Typography color="#1D2129">Google Authentication</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WarningIcon color="warning" />
              <Typography color="#1ACA75">Not Set</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            onClick={() => handleButtonClick("deposit")}
            sx={{
              bgcolor: "#E0E0E0",
              color: "black",
              "&:hover": {
                bgcolor: "#D0D0D0",
              },
              borderRadius: 36,
              flex: { xs: 1, sm: "initial" },
              px: { xs: 2, sm: 3 },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => handleButtonClick("deposit")}
            sx={{
              bgcolor: "#9CFF1F",
              color: "black",
              "&:hover": {
                bgcolor: "#9cff1f",
              },
              borderRadius: 36,
              flex: { xs: 1, sm: "initial" },
              px: { xs: 2, sm: 3 },
            }}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>
      <PageContainer title="Overview" description="Asset Overview">
        <LpHeader />
        <Box
          sx={{
            bgcolor: "#EAEFF4",
            minHeight: "100vh",
            px: {
              xs: 2,
              sm: 4,
              md: 8,
              lg: 24,
              xl: 32,
            },
            py: {
              xs: 4,
              sm: 6,
              md: 8,
            },
          }}
        >
          <Typography variant="h2" sx={{ mb: 2, color: "#000" }}>
            Asset Overview
          </Typography>
          <Card sx={{ mb: 4, bgcolor: "#fff", color: "#666666" }}>
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="#666666"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    Total Balance
                    {showBalance ? (
                      <IconEye
                        width={16}
                        height={16}
                        style={{ cursor: "pointer" }}
                        onClick={toggleBalance}
                      />
                    ) : (
                      <IconEyeOff
                        width={16}
                        height={16}
                        style={{ cursor: "pointer" }}
                        onClick={toggleBalance}
                      />
                    )}
                  </Typography>
                  {/* <Typography variant="subtitle1" color="#666666">
                    Available Balance: <span style={{ color: '#222222' }}>{showBalance ? '2123.12 USDT' : '******'}</span>
                  </Typography> */}
                </Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 2, sm: 2 }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      component="div"
                      color="#222222"
                      sx={{
                        fontSize: { xs: "1.5rem", sm: "2rem" },
                        wordBreak: "break-word",
                      }}
                    >
                      {showBalance ? "742,851.00" : "******"}
                      <Typography
                        component="span"
                        variant="body2"
                        color="#666666"
                        sx={{
                          ml: { xs: 0, md: 1 },
                          display: { xs: "block", sm: "inline" },
                        }}
                      >
                        {showBalance ? "USDT≈ $742,851.00" : "USDT≈ $******"}
                      </Typography>
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleButtonClick("deposit")}
                      sx={{
                        bgcolor:
                          activeButton === "deposit" ? "#9CFF1F" : "#E0E0E0",
                        color: "black",
                        "&:hover": {
                          bgcolor:
                            activeButton === "deposit" ? "#9cff1f" : "#D0D0D0",
                        },
                        borderRadius: 36,
                        flex: { xs: 1, sm: "initial" },
                        px: { xs: 2, sm: 3 },
                      }}
                    >
                      Deposit
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleButtonClick("withdraw")}
                      sx={{
                        bgcolor:
                          activeButton === "withdraw" ? "#9CFF1F" : "#E0E0E0",
                        color: "black",
                        "&:hover": {
                          bgcolor:
                            activeButton === "withdraw" ? "#9cff1f" : "#D0D0D0",
                        },
                        borderRadius: 36,
                        flex: { xs: 1, sm: "initial" },
                        px: { xs: 2, sm: 3 },
                      }}
                    >
                      Withdraw
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: "#fff", color: "#222222" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography
                  variant="subtitle1"
                  color="#222222"
                  fontWeight={500}
                  fontSize={16}
                >
                  Token
                </Typography>
                <ArticleOutlinedIcon />
              </Box>

              <List>
                {tokens.map((token, index) => (
                  <ListItem key={index} sx={{ py: 2 }}>
                    <ListItemIcon>
                      <Image
                        src={token.icon}
                        alt={token.name}
                        width={32}
                        height={32}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={token.name}
                      secondary={token.price}
                    />
                    <ListItemSecondaryAction>
                      <Stack alignItems="flex-end">
                        <Typography variant="body1">{token.amount}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {token.value}
                        </Typography>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    </React.Fragment>
  );
}
