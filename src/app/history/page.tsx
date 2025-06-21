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

import type { TimeRangePickerProps } from 'antd';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import React, { useEffect, useState } from "react";
import { tokenConfigApi, tokenApi, BusinessType, BalanceChangeRecord } from "@/app/services/api";
import Pagination from '@mui/material/Pagination';


interface TokenData {
  icon: string;
  name: string;
  price: string;
  amount: string;
  value: string;
}

// Using the Token type from the API
type Token = {
  tokenId?: string;
  tokenName?: string;
  tokenIcon?: string;
  [key: string]: any;
}

// Local interface for formatted transaction data
interface TransactionData {
  token: string;
  amount: string;
  time: string;
  type: "deposit" | "withdraw";
}

// Map business type to our UI types
const mapBusinessTypeToUiType = (businessType?: number): "deposit" | "withdraw" => {
  // Based on API comment: 业务类型 1,充值， 2 提现,4 内部转入,5 内部转出, 6,划入。7 划出。 8 闪兑
  if (businessType === 1 || businessType === 4 || businessType === 6) {
    return "deposit";
  } else if (businessType === 2 || businessType === 5 || businessType === 7) {
    return "withdraw";
  }
  // Default to deposit for other cases
  return "deposit";
};

// Format timestamp to readable date
const formatTimestamp = (timestamp?: number): string => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleString();
};

const { RangePicker } = DatePicker;

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
];


// Extended interface for mock data with additional fields
interface ExtendedBalanceRecord extends BalanceChangeRecord {
  address?: string;
  state?: 'Transferring' | 'Sent';
}

// Mock data for development and testing
const mockDepositTransactions: ExtendedBalanceRecord[] = [
  { id: 1, tokenId: "BTC", tokenName: "Bitcoin", amount: -0.25, businessType: 1, createDate: Date.now() - 3600000, address: "Internal", state: "Transferring" },
  { id: 2, tokenId: "ETH", tokenName: "Ethereum", amount: 2.5, businessType: 1, createDate: Date.now() - 7200000, address: "Internal", state: "Sent" },
  { id: 3, tokenId: "USDT", tokenName: "Tether", amount: 1000, businessType: 4, createDate: Date.now() - 86400000, address: "Internal", state: "Sent" },
  { id: 4, tokenId: "BNB", tokenName: "Binance Coin", amount: 5, businessType: 6, createDate: Date.now() - 172800000, address: "Internal", state: "Sent" },
  { id: 5, tokenId: "SOL", tokenName: "Solana", amount: -20, businessType: 1, createDate: Date.now() - 259200000, address: "Internal", state: "Transferring" },
];

const mockWithdrawTransactions: ExtendedBalanceRecord[] = [
  { id: 6, tokenId: "BTC", tokenName: "Bitcoin", amount: 0.15, businessType: 2, createDate: Date.now() - 4800000, address: "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f5e2a", state: "Transferring" },
  { id: 7, tokenId: "ETH", tokenName: "Ethereum", amount: 1.2, businessType: 5, createDate: Date.now() - 9600000, address: "0x8C2fA54f9aC4c6E8f39a8F11b0d0685AFc360bA4", state: "Transferring" },
  { id: 8, tokenId: "USDT", tokenName: "Tether", amount: 500, businessType: 2, createDate: Date.now() - 129600000, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", state: "Transferring" },
  { id: 9, tokenId: "BNB", tokenName: "Binance Coin", amount: 3, businessType: 7, createDate: Date.now() - 216000000, address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", state: "Sent" },
  { id: 10, tokenId: "SOL", tokenName: "Solana", amount: 10, businessType: 2, createDate: Date.now() - 302400000, address: "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47", state: "Transferring" },
];

// Custom styles for Ant Design DatePicker and Select
const datePickerStyles = `
  .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
    background: #9CFF1F !important;
    color: #000 !important;
  }
  .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
    border-color: #9CFF1F !important;
  }
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover .ant-picker-cell-inner {
    background: rgba(156, 255, 31, 0.2) !important;
  }
  .ant-picker:focus .ant-picker-active-bar,
  .ant-picker-focused .ant-picker-active-bar {
    background: #9CFF1F !important;
  }
  .ant-picker-focused,
  .ant-picker:hover {
    border-color: #9CFF1F !important;
  }
  .ant-picker-panel-container .ant-picker-panels {
    border-color: #9CFF1F !important;
  }
  .ant-picker-header button:hover {
    color: #9CFF1F !important;
  }
  .ant-picker-outlined:hover,
  .ant-picker-outlined:focus,
  .ant-picker-outlined-focused {
    border-color: #9CFF1F !important;
    box-shadow: 0 0 0 2px rgba(156, 255, 31, 0.2) !important;
  }
  .ant-picker-outlined.ant-picker-status-error:hover,
  .ant-picker-outlined.ant-picker-status-warning:hover {
    border-color: #9CFF1F !important;
  }
  
  /* Select component styling */
  .ant-select:hover .ant-select-selector,
  .ant-select-focused .ant-select-selector {
    border-color: #9CFF1F !important;
  }
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: #9CFF1F !important;
    box-shadow: 0 0 0 2px rgba(156, 255, 31, 0.2) !important;
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: rgba(156, 255, 31, 0.2) !important;
  }
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: rgba(156, 255, 31, 0.1) !important;
  }
`;

export default function History() {
  // Add style tag for DatePicker custom styling
  React.useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = datePickerStyles;
    document.head.appendChild(styleElement);
    
    // Cleanup on component unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const [activeButton, setActiveButton] = React.useState<"deposit" | "withdraw">("deposit");
  const [showBalance, setShowBalance] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedToken, setSelectedToken] = React.useState("ALL");
  const [dateRange, setDateRange] = React.useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [tokens, setTokens] = useState<{ [key: string]: Token }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanceData, setBalanceData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<BalanceChangeRecord[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  

  // Fetch transaction history based on current filters
  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for development
      const mockData = activeButton === "deposit" ? mockDepositTransactions : mockWithdrawTransactions;
      
      // Filter by token if needed
      let filteredData = mockData;
      if (selectedToken !== "ALL") {
        filteredData = mockData.filter(item => item.tokenId === selectedToken);
      }
      
      // Filter by date range if provided
      if (dateRange[0] && dateRange[1]) {
        const startTime = dateRange[0].valueOf();
        const endTime = dateRange[1].valueOf();
        filteredData = filteredData.filter(item => {
          const createDate = item.createDate || 0;
          return createDate >= startTime && createDate <= endTime;
        });
      }
      
      // Set the transactions and calculate total pages
      setTransactions(filteredData);
      setTotalPages(Math.max(1, Math.ceil(filteredData.length / pageSize)));
      
      /* Uncomment to use real API instead of mock data
      // Prepare request parameters
      const params = {
        pageNo: currentPage,
        pageSize: pageSize,
        tokenId: selectedToken !== "ALL" ? selectedToken : undefined,
        businessType: activeButton === "deposit" ? BusinessType.Deposit : BusinessType.Withdraw,
        beginTime: dateRange[0] ? dateRange[0].valueOf() : undefined,
        endTime: dateRange[1] ? dateRange[1].valueOf() : undefined
      };
      
      // Call API
      const response = await tokenApi.getTransactionHistory(params);
      
      if (response.code === 200) {
        setTransactions(response.data || []);
        // Calculate total pages - assuming API returns total count in future
        setTotalPages(response.data && response.data.length > 0 ? 10 : 1);
      } else {
        setError(response.msg || "Failed to load transaction history");
      }
      */
    } catch (err) {
      console.error("Error fetching transaction history:", err);
      setError("Failed to load transaction history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tokens for the dropdown
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        
        // Fetch tokens from API
        const tokensResponse = await tokenConfigApi.getAllTokens();
        if (tokensResponse.code === 200 && tokensResponse.data) {
          const tokensMap = tokensResponse.data.reduce((acc, token) => {
            if (token.tokenId) {
              acc[token.tokenId] = token;
            }
            return acc;
          }, {} as { [key: string]: Token });
          setTokens(tokensMap);
        } else {
          setError(tokensResponse.msg || "Failed to load token data");
        }
      } catch (err) {
        console.error("Error fetching tokens:", err);
        setError("Failed to load token data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);
  
  // Fetch transaction history when filters change
  useEffect(() => {
    fetchTransactionHistory();
  }, [currentPage, selectedToken, activeButton, dateRange]);

  const handleButtonClick = (button: "deposit" | "withdraw") => {
    setActiveButton(button);
    setCurrentPage(1); // Reset to first page when changing tabs
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
              
              {error && (
                <Box sx={{ mb: 3, p: 2, bgcolor: "#ffebee", borderRadius: "4px", color: "#d32f2f" }}>
                  {error}
                </Box>
              )}
              
              <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap:2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2 }}>Token</Typography>
                  <Box sx={{ minWidth: 120, position: "relative" }}>
                    {loading && (
                      <Box sx={{ 
                        position: "absolute", 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        bgcolor: "rgba(255, 255, 255, 0.7)",
                        zIndex: 1,
                        borderRadius: "4px"
                      }}>
                        <Typography variant="caption">Loading...</Typography>
                      </Box>
                    )}
                    <Select
                      style={{ width: "100%" }}
                      value={selectedToken}
                      onChange={(value) => setSelectedToken(value)}
                      disabled={loading}
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label?.toString() || '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: "ALL", label: "ALL" },
                        ...Object.values(tokens)
                          .filter(token => token.tokenId)
                          .map(token => ({
                            value: token.tokenId,
                            label: token.tokenName || token.tokenId
                          }))
                      ]}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2 }}>Date</Typography>
                  <Box sx={{ 
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "0px",
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
                      <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: "normal", color: "#666" }}>Address</th>
                      <th style={{ padding: "12px 8px", textAlign: "right", fontWeight: "normal", color: "#666" }}>Time</th>
                      <th style={{ padding: "12px 8px", textAlign: "right", fontWeight: "normal", color: "#666" }}>State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => {
                      // Format the amount with sign
                      const amount = transaction.amount || 0;
                      const isDeposit = mapBusinessTypeToUiType(transaction.businessType) === "deposit";
                      const formattedAmount = `${isDeposit ? '+' : '-'} ${Math.abs(amount)}`;
                      
                      return (
                        <tr key={transaction.id || index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "12px 8px", textAlign: "left" }}>{transaction.tokenName || transaction.tokenId}</td>
                          <td style={{ 
                            padding: "12px 8px", 
                            textAlign: "left", 
                            color: isDeposit ? "#4caf50" : "#f44336" 
                          }}>
                            {formattedAmount}
                          </td>
                          <td style={{ padding: "12px 8px", textAlign: "left" }}>
                            {/* Display full address for withdrawals, truncate if too long */}
                            {(transaction as ExtendedBalanceRecord).address ? 
                              ((transaction as ExtendedBalanceRecord).address!.length > 20 ? 
                                `${(transaction as ExtendedBalanceRecord).address!.substring(0, 6)}...${(transaction as ExtendedBalanceRecord).address!.substring((transaction as ExtendedBalanceRecord).address!.length - 4)}` : 
                                (transaction as ExtendedBalanceRecord).address) : 
                              (isDeposit ? "Internal" : "--")}
                          </td>
                          <td style={{ padding: "12px 8px", textAlign: "right" }}>{formatTimestamp(transaction.createDate)}</td>
                          <td style={{ padding: "12px 8px", textAlign: "right" }}>
                            {/* Style based on state with fixed width */}
                            <span style={{ 
                              display: "inline-block",
                              width: "90px",
                              textAlign: "center",
                              padding: "4px 8px", 
                              borderRadius: "4px", 
                              backgroundColor: 
                                (transaction as ExtendedBalanceRecord).state === "Sent" ? "#D1F4E3" : 
                                (transaction as ExtendedBalanceRecord).state === "Transferring" ? "#FFF7D7" : 
                                "#fff1f0", 
                              color: 
                                (transaction as ExtendedBalanceRecord).state === "Sent" ? "#1ACA75" : 
                                (transaction as ExtendedBalanceRecord).state === "Transferring" ? "#736800" : 
                                "#f5222d", 
                              fontSize: "12px" 
                            }}>
                              {(transaction as ExtendedBalanceRecord).state || "Transferring"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>

              {/* Show loading indicator while fetching data */}
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <Typography>Loading transactions...</Typography>
                </Box>
              )}
              
              {/* Show message when no transactions are found */}
              {!loading && transactions.length === 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <Typography>No Data.</Typography>
                </Box>
              )}
              
              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => {
                    setCurrentPage(value);
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    </React.Fragment>
  );
}
