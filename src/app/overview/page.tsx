"use client";

import PageContainer from "@/app/components/container/PageContainer";
import LpHeader from "@/app/components/landingpage/header/Header";
import { Token, tokenApi, tokenConfigApi } from "@/app/services/api";
import { BalanceVo } from "@/app/types/balance";
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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TokenData {
  icon: string;
  name: string;
  price: string;
  amount: string;
  value: string;
}

// const tokens: TokenData[] = [
//   {
//     icon: "/images/crypto/btc.png",
//     name: "BTC",
//     price: "$67,725.90",
//     amount: "1.60",
//     value: "$67,725.90",
//   },
//   {
//     icon: "/images/crypto/usdt.png",
//     name: "USDT",
//     price: "$1.00",
//     amount: "0",
//     value: "$0",
//   },
//   {
export default function OverviewPage() {
  const [activeButton, setActiveButton] = useState("deposit");
  const [showBalance, setShowBalance] = useState(true);
  const [openDialog, setOpenDialog] = useState(true);
  const [balanceData, setBalanceData] = useState<BalanceVo[] | null>(null);
  const [tokens, setTokens] = useState<{ [key: string]: Token }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBalance, setTotalBalance] = useState<string>("0.00");
  const [usdBalance, setUsdBalance] = useState<string>("0.00");

  // Calculate total balance when balanceData changes
  useEffect(() => {
    if (!balanceData) return;

    const total = balanceData.reduce((sum: number, token: BalanceVo) => {
      const tokenTotal = Number(token.total) || 0;
      const tokenPrice = Number(token.marketPrice) || 0;
      return sum + tokenTotal * tokenPrice;
    }, 0);

    const formattedTotal = total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setTotalBalance(formattedTotal);
    setUsdBalance(`USDT≈ $${formattedTotal}`);
  }, [balanceData]);

  // Helper function to get token icon
  const getTokenIcon = (tokenId: string) => {
    if (!tokenId) return "/images/crypto/default.png";
    const token = tokens[tokenId];
    return token?.icon || `/images/crypto/${tokenId.toLowerCase()}.png`;
  };

  // Helper function to get token display name
  const getTokenName = (tokenId: string) => {
    if (!tokenId) return "Unknown Token";
    const token = tokens[tokenId];
    return token?.tokenName || token?.tokenFullName || tokenId;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch tokens first
        const tokensResponse = await tokenConfigApi.getAllTokens();
        if (tokensResponse.code === 200 && tokensResponse.data) {
          const tokensMap = tokensResponse.data.reduce((acc, token) => {
            if (token.tokenId) {
              acc[token.tokenId] = token;
            }
            return acc;
          }, {} as { [key: string]: Token });
          setTokens(tokensMap);

          // Then fetch balance data
          const balanceResponse = await tokenApi.getAllAssets();
          if (balanceResponse.code === 200 && balanceResponse.data) {
            const data = Array.isArray(balanceResponse.data)
              ? balanceResponse.data
              : [];
            // Sort by total value (total * marketPrice) in descending order
            const sortedData = [...data].sort((a, b) => {
              const aValue =
                (Number(a.total) || 0) * (Number(a.marketPrice) || 0);
              const bValue =
                (Number(b.total) || 0) * (Number(b.marketPrice) || 0);
              return bValue - aValue; // Descending order
            });
            setBalanceData(sortedData);
          } else {
            setError(balanceResponse.msg || "Failed to load balance data");
          }
        } else {
          setError(tokensResponse.msg || "Failed to load token data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
    if (button === "deposit") {
      router.push("/deposit");
    } else if (button === "withdrawal") {
      router.push("/withdrawal");
    }
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
            // onClick={() => handleButtonClick("deposit")}
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
            // onClick={() => handleButtonClick("deposit")}
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
                      {showBalance ? totalBalance : "******"}
                      <Typography
                        component="span"
                        variant="body2"
                        color="#666666"
                        sx={{
                          ml: { xs: 0, md: 1 },
                          display: { xs: "block", sm: "inline" },
                        }}
                      >
                        {showBalance ? usdBalance : "USDT≈ $******"}
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
                      onClick={() => handleButtonClick("withdrawal")}
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  pb: 1,
                  borderBottom: "1px solid rgba(244, 244, 244, 1)",
                }}
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

              {loading && <Typography>Loading...</Typography>}
              {error && <Typography color="error">{error}</Typography>}
              {!loading && !error && balanceData && (
                <List>
                  {balanceData.map((token, index) => (
                    <ListItem
                      key={token.id || index}
                      sx={{
                        py: 2,
                        borderBottom: "1px solid rgba(244, 244, 244, 1)",
                        pl: 0,
                      }}
                    >
                      <ListItemIcon>
                        {/* Assuming you have a way to get icon based on tokenId or a default icon */}
                        <Image
                          src={getTokenIcon(token.tokenId || "")}
                          alt={getTokenName(token.tokenId || "")}
                          width={32}
                          height={32}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/crypto/default.png";
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={getTokenName(token.tokenId || "")}
                        secondary={
                          <>
                            {/* <Box component="span" display="block">{token.tokenId}</Box> */}
                            {showBalance && token.marketPrice && (
                              <Box component="span" display="block">
                                Price: $
                                {Number(token.marketPrice).toLocaleString()}
                              </Box>
                            )}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Stack alignItems="flex-end">
                          <Typography variant="body1">
                            {showBalance && token.available
                              ? Number(token.available).toLocaleString()
                              : "******"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {showBalance && token.assetTotal
                              ? `≈ $${Number(
                                  token.assetTotal
                                ).toLocaleString()}`
                              : "******"}
                          </Typography>
                        </Stack>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    </React.Fragment>
  );
}
