export const cardStyle = {
  mt: 3,
  bgcolor: '#FFF'
};

export const tabsStyle = {
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
};

export const tableHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  bgcolor: '#F8F8F8',
  p: '8px 20px',
  borderRadius: '4px'
};

export const depositRowStyle = {
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
};

export const moreButtonStyle = {
  color: '#3B82F6',
  textTransform: 'none',
  padding: '8px 20px',
  backgroundColor: 'transparent',
  '&:hover': {
    color: '#2563EB',
    backgroundColor: 'transparent'
  }
};

export const moreButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  mt: 3
};
