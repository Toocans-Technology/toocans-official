import React from 'react';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TabPanel from '@/app/deposit/components/TabPanel';
import { WithdrawalRecord } from '@/app/deposit/types';

interface WithdrawalTabsProps {
  selectedTab: number;
  handleTabChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  usdtDeposits: WithdrawalRecord[];
  recentWithdrawals: WithdrawalRecord[];
}

const WithdrawalTabs: React.FC<WithdrawalTabsProps> = ({
  selectedTab,
  handleTabChange,
  usdtDeposits,
  recentWithdrawals
}) => {
  return (
    <Box sx={{ mt: 3, bgcolor: '#FFF', borderRadius: 2, padding: 2 }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          minHeight: 'unset',
          '& .MuiTabs-indicator': {
            display: 'none'
          },
          '& .MuiTabs-flexContainer': {
            gap: '8px',
            padding: '0 8px'
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            color: '#666666',
            padding: '8px 20px',
            minHeight: 'unset',
            minWidth: 'auto',
            fontWeight: 400,
            fontSize: '14px',
            position: 'relative',
            margin: '0 4px',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50px',
              height: '2px',
              backgroundColor: 'transparent',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '1px'
            },
            '&:hover': {
              color: '#000',
              backgroundColor: 'transparent'
            },
            '&.Mui-selected': {
              color: '#000',
              fontWeight: 500,
              '&::before': {
                backgroundColor: '#000'
              }
            }
          }
        }}
      >
        <Tab label="Withdrawal" />
        <Tab label="Recent Withdrawals" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          bgcolor: '#F8F8F8',
          p: '8px 20px',
          borderRadius: '4px'
        }}>
          <Typography variant="subtitle2" color="#666666">Token</Typography>
          <Typography variant="subtitle2" color="#666666">Amount</Typography>
          <Typography variant="subtitle2" color="#666666">Time</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          {usdtDeposits.map((deposit: WithdrawalRecord, index: number) => (
            <Box
              key={`usdt-${index}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                p: '8px 20px',
                borderBottom: '1px solid #E5E7EB',
                color: '#666666',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(64, 158, 255, 0.1)'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 400 }}>{deposit.token}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#10B981' }}>{deposit.amount}</Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>{deposit.time}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="text"
            endIcon={<ChevronRightIcon />}
            sx={{
              color: '#3B82F6',
              textTransform: 'none',
              padding: '8px 20px',
              backgroundColor: 'transparent',
              '&:hover': {
                color: '#2563EB',
                backgroundColor: 'transparent'
              }
            }}
          >
            More
          </Button>
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          bgcolor: '#F8F8F8',
          p: '8px 20px',
          borderRadius: '4px'
        }}>
          <Typography variant="subtitle2" color="#666666">Token</Typography>
          <Typography variant="subtitle2" color="#666666">Amount</Typography>
          <Typography variant="subtitle2" color="#666666">Address</Typography>
          <Typography variant="subtitle2" color="#666666">Time</Typography>
          <Typography variant="subtitle2" color="#666666">State</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          {recentWithdrawals.map((withdrawal: WithdrawalRecord, index: number) => (
            <Box
              key={`recent-${index}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                p: '8px 20px',
                borderBottom: '1px solid #E5E7EB',
                color: '#666666',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(64, 158, 255, 0.1)'
                }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 400 }}>{withdrawal.token}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#10B981' }}>{withdrawal.amount}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 400 }}>{withdrawal.address}</Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>{withdrawal.time}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 400 }}>{withdrawal.state}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="text"
            endIcon={<ChevronRightIcon />}
            sx={{
              color: '#3B82F6',
              textTransform: 'none',
              padding: '8px 20px',
              backgroundColor: 'transparent',
              '&:hover': {
                color: '#2563EB',
                backgroundColor: 'transparent'
              }
            }}
          >
            More
          </Button>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default WithdrawalTabs;
