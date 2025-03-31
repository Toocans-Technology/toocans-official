import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DepositRecord } from '@/app/deposit/types';
import TabPanel from './TabPanel';
import {
  cardStyle,
  tabsStyle,
  tableHeaderStyle,
  depositRowStyle,
  moreButtonStyle,
  moreButtonContainerStyle
} from '../styles/depositHistoryTabsStyles';

interface DepositHistoryTabsProps {
  selectedTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  usdtDeposits: DepositRecord[];
  recentDeposits: DepositRecord[];
}

const DepositHistoryTabs: React.FC<DepositHistoryTabsProps> = ({
  selectedTab,
  handleTabChange,
  usdtDeposits,
  recentDeposits
}) => {
  return (
    <Card sx={cardStyle}>
      <CardContent>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          // variant="fullWidth"
          sx={tabsStyle}
        >
          <Tab label="USDT Deposits" />
          <Tab label="Recent Deposits" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          {/* USDT Deposits Table */}
          <Box sx={tableHeaderStyle}>
            <Typography variant="subtitle2" color="#666666">Token</Typography>
            <Typography variant="subtitle2" color="#666666">Amount</Typography>
            <Typography variant="subtitle2" color="#666666">Time</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {usdtDeposits.map((deposit: DepositRecord, index: number) => (
              <Box
                key={`usdt-${index}`}
                sx={depositRowStyle}
              >
                <Typography variant="body2" sx={{ fontWeight: 400 }}>{deposit.token}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#10B981' }}>{deposit.amount}</Typography>
                <Typography variant="body2" sx={{ color: '#666666' }}>{deposit.time}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={moreButtonContainerStyle}>
            <Button
              variant="text"
              endIcon={<ChevronRightIcon />}
              sx={moreButtonStyle}
            >
              More
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          {/* Recent Deposits Table */}
          <Box sx={tableHeaderStyle}>
            <Typography variant="subtitle2" color="#666666">Token</Typography>
            <Typography variant="subtitle2" color="#666666">Amount</Typography>
            <Typography variant="subtitle2" color="#666666">Time</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {recentDeposits.map((deposit: DepositRecord, index: number) => (
              <Box
                key={`recent-${index}`}
                sx={depositRowStyle}
              >
                <Typography variant="body2" sx={{ fontWeight: 400 }}>{deposit.token}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#10B981' }}>{deposit.amount}</Typography>
                <Typography variant="body2" sx={{ color: '#666666' }}>{deposit.time}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={moreButtonContainerStyle}>
            <Button
              variant="text"
              endIcon={<ChevronRightIcon />}
              sx={moreButtonStyle}
            >
              More
            </Button>
          </Box>
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default DepositHistoryTabs;
