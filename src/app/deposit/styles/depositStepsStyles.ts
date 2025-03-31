export const stepBoxStyle = {
  mb: 4
};

export const stepHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  mb: 2
};

export const stepHeaderTextStyle = (active: boolean) => ({
  color: active ? '#000' : '#999999'
});

export const dropdownBoxStyle = {
  ml: 4
};

export const dropdownBoxWithMarginStyle = {
  ml: 4,
  mt: 1.5
};

export const depositDetailBoxStyle = {
  ml: 4,
  mt: 1.5,
  backgroundColor: '#F8F8F8',
  borderRadius: '4px',
  p: 2
};

export const qrCodeBoxStyle = {
  width: 120,
  height: 120,
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: '#D1D5DB',
    bgcolor: '#F8F8F8'
  }
};

export const addressBoxStyle = {
  flex: 1
};

export const addressContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  bgcolor: '#F8F8F8',
  p: '8px 20px',
  borderRadius: '4px',
  mb: 3,
  border: '1px solid #E5E7EB',
  width: '100%'
};

export const addressTextStyle = {
  fontFamily: 'monospace',
  color: '#222222',
  flex: 1,
  userSelect: 'all',
  fontSize: '14px',
  textAlign: 'left'
};

export const copyButtonStyle = (showCopyNotification: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  color: showCopyNotification ? '#059669' : '#666666',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  padding: 0,
  transition: 'color 0.2s',
  '&:hover': {
    color: showCopyNotification ? '#059669' : '#222222'
  }
});

export const minimumDepositBoxStyle = {
  ml: 4,
  mt: 1.5,
  display: 'flex',
  justifyContent: 'space-between'
};

export const minimumDepositTextStyle = {
  color: '#666666'
};

export const minimumDepositAmountStyle = {
  color: '#000'
};
