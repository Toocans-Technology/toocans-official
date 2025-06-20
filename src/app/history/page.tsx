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
import type { TimeRangePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface TokenData {
  icon: string;
  name: string;
  price: string;
  amount: string;
  value: string;
}

interface TransactionData {
  token: string;
  amount: string;
  time: string;
  type: "deposit" | "withdraw";
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

const transactions: TransactionData[] = [
  { token: "USDT", amount: "+ 102.12", time: "2021-05-21 13:20:00", type: "deposit" },
  { token: "BTC", amount: "+ 0.005", time: "2021-05-22 14:30:00", type: "deposit" },
  { token: "USDT", amount: "- 50.00", time: "2021-05-23 09:15:00", type: "withdraw" },
  { token: "BTC", amount: "- 0.002", time: "2021-05-24 16:45:00", type: "withdraw" },
  { token: "USDT", amount: "+ 200.00", time: "2021-05-25 11:20:00", type: "deposit" },
  { token: "BTC", amount: "+ 0.01", time: "2021-05-26 10:10:00", type: "deposit" },
];

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
];


export default function History() {
  const [activeButton, setActiveButton] = React.useState("deposit");
  const [showBalance, setShowBalance] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedToken, setSelectedToken] = React.useState("ALL");
  const [dateRange, setDateRange] = React.useState<[Dayjs | null, Dayjs | null]>([null, null]);

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
      <PageContainer title="History" description="History">
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
            History
          </Typography>

          <Card sx={{ bgcolor: "#fff", color: "#222222" }}>
            <CardContent>
              {/* Deposit/Withdraw Tabs */}
              <Box sx={{ display: "flex", mb: 3, borderBottom: "1px solid #e0e0e0" }}>
                <Button
                  sx={{
                    px: 4,
                    py: 1,
                    borderRadius: 0,
                    bgcolor: "#fff",
                    color: activeButton === "deposit" ? "#000" : "#666",
                    position: "relative",
                    fontWeight: activeButton === "deposit" ? "bold" : "normal",
                    '&:hover': {
                      color: "#000",
                      backgroundColor: "transparent",
                      opacity: 0.8,
                    },
                    '&::after': activeButton === "deposit" ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40px',
                      height: '2px',
                      backgroundColor: '#222222',
                    } : {},
                  }}
                  onClick={() => handleButtonClick("deposit")}
                >
                  Deposit
                </Button>
                <Button
                  sx={{
                    px: 4,
                    py: 1,
                    borderRadius: 0,
                    bgcolor: "#fff",
                    color: activeButton === "withdraw" ? "#000" : "#666",
                    position: "relative",
                    fontWeight: activeButton === "withdraw" ? "bold" : "normal",
                    '&:hover': {
                      color: "#000",
                      backgroundColor: "transparent",
                      opacity: 0.8,
                    },
                    '&::after': activeButton === "withdraw" ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40px',
                      height: '2px',
                      backgroundColor: '#222222',
                    } : {},
                  }}
                  onClick={() => handleButtonClick("withdraw")}
                >
                  Withdraw
                </Button>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2 }}>Token</Typography>
                  <Box sx={{ minWidth: 120 }}>
                    <select
                      style={{
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "white",
                        width: "100%",
                        outline: "none",
                      }}
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                    >
                      <option value="ALL">ALL</option>
                      <option value="BTC">BTC</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2 }}>Date</Typography>
                  <Box sx={{ 
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "0 12px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <RangePicker 
                      value={dateRange}
                      onChange={(dates, dateStrings) => {
                        if (dates) {
                          setDateRange([dates[0], dates[1]]);
                        } else {
                          setDateRange([null, null]);
                        }
                      }}
                      presets={rangePresets}
                      style={{
                        border: "none",
                        width: "290px",
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: "normal", color: "#666" }}>Token</th>
                      <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: "normal", color: "#666" }}>Amount</th>
                      <th style={{ padding: "12px 8px", textAlign: "right", fontWeight: "normal", color: "#666" }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter(transaction => transaction.type === activeButton)
                      .filter(transaction => selectedToken === "ALL" || transaction.token === selectedToken)
                      .map((transaction, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "12px 8px", textAlign: "left" }}>{transaction.token}</td>
                        <td style={{ 
                          padding: "12px 8px", 
                          textAlign: "left", 
                          color: transaction.amount.startsWith("+") ? "#4caf50" : "#f44336" 
                        }}>
                          {transaction.amount}
                        </td>
                        <td style={{ padding: "12px 8px", textAlign: "right" }}>{transaction.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    color: "#666",
                  }}
                >
                  &lt;
                </Button>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    bgcolor: "#9CFF1F",
                    color: "#000",
                    '&:hover': {
                      bgcolor: "#8bea15",
                    }
                  }}
                >
                  1
                </Button>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    color: "#666",
                  }}
                >
                  2
                </Button>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    color: "#666",
                  }}
                >
                  3
                </Button>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    color: "#666",
                  }}
                >
                  4
                </Button>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    color: "#666",
                  }}
                >
                  5
                </Button>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    color: "#666",
                  }}
                >
                  ...
                </Button>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    color: "#666",
                  }}
                >
                  20
                </Button>
                <Button
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    p: 0,
                    borderRadius: "4px",
                    color: "#666",
                  }}
                >
                  &gt;
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    </React.Fragment>
  );
}
