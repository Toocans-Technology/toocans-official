import React from 'react';
import { 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Box,
  Typography
} from '@mui/material';

export interface TokenOption {
  symbol: string;
  name: string;
  icon: string;
  iconBg: string;
}

export interface TokenDropdownProps {
  options: TokenOption[];
  selectedToken: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({
  options,
  selectedToken,
  onChange,
  placeholder = 'Select token'
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
<Select
  value={selectedToken || ''}
  onChange={handleChange}
  displayEmpty
  fullWidth

  sx={{
    bgcolor: '#F8F8F8', // 设置选择框背景颜色
    border: 'none', // 移除边框
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // 去掉默认的边框
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none', // 去掉悬停时的边框
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none', // 去掉聚焦时的边框
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      color: '#222222'
    }
  }}
  MenuProps={{
    PaperProps: {
      sx: {
        bgcolor: '#FFFFFF' // 设置下拉菜单背景色为白色
      }
    }
  }}
>
  <MenuItem value="" disabled>
    <Typography color="text.secondary">{placeholder}</Typography>
  </MenuItem>
  {options.map((option) => (
    <MenuItem
      key={option.symbol}
      value={option.symbol}
      sx={{
        bgcolor: 'transparent', // 取消默认选中背景颜色
        '&.Mui-selected': {
          bgcolor: 'transparent !important', // 选中时不改变背景颜色
        },
        '&.Mui-selected:hover': {
          bgcolor: '#F8F8F8', // 选中项鼠标悬停时的背景颜色
        },
        '&:hover': {
          bgcolor: '#F8F8F8', // 设置 hover 时的背景颜色
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: option.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {option.icon}
        </Box>
        <Typography sx={{ color: '#222222 !important' }}>
          {option.name}
        </Typography>
      </Box>
    </MenuItem>
  ))}
</Select>

  );
};

export default TokenDropdown;
