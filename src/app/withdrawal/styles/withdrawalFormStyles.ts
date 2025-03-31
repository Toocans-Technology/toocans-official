export const formContainerStyle = {
  width: '50%',
  padding: 2
};

export const stepBoxStyle = {
  mb: 4
};

export const stepHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  mb: 2
};

export const dropdownBoxStyle = {
  ml: 4
};

export const dropdownBoxWithMarginStyle = {
  ml: 4,
  mt: 1.5
};

export const textFieldStyle = {
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiOutlinedInput-root': {
    background: '#f5f5f5',
    borderRadius: '8px',
    color: '#000'
  }
};

export const amountTextFieldStyle = {
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiOutlinedInput-root': {
    background: '#f5f5f5',
    borderRadius: '8px',
    color: '#000',
    height: '44px',
    '& input': {
      height: '44px',
      padding: '0 14px'
    }
  }
};

export const balanceBoxStyle = {
  mt: 1,
  display: 'flex',
  justifyContent: 'space-between'
};

export const withdrawButtonStyle = {
  mt: 4,
  bgcolor: '#9CFF1F',
  color: 'black',
  '&:hover': {
    bgcolor: '#9cff1f'
  },
  borderRadius: 36,
  flex: { xs: 1, sm: 'initial' },
  px: { xs: 2, sm: 3 }
};

export const stepCircleStyle = (active: boolean) => ({
  width: 20,
  height: 20,
  borderRadius: '50%',
  bgcolor: active ? '#000' : '#999999',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mr: 2,
  fontWeight: 'bold',
  fontSize: '14px'
});

export const balanceTypographyStyle = {
  variant: "subtitle1" as "subtitle1",
  sx: { color: '#999999' }
};

export const balanceValueStyle = {
  variant: "subtitle1" as "subtitle1",
  sx: { color: '#000' }
};
