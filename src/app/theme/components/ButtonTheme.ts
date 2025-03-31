import { Components, Theme } from '@mui/material/styles';

export const ButtonTheme = (theme: Theme): Components['MuiButton'] => {
  return {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    variants: [
      {
        props: { variant: 'contained', color: 'primary' },
        style: {
          borderRadius: '36px',
          '&:hover': {
            backgroundColor: '#8ce61c'
          }
        },
      },
      {
        // Custom variant for auth buttons
        props: { variant: 'authButton' as any },
        style: {
          borderRadius: '36px',
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          '&:hover': {
            backgroundColor: '#8ce61c'
          },
          padding: '8px 22px',
          fontSize: '16px',
          fontWeight: 500,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          width: '100%'
        },
      },
    ],
  };
};

// Add custom variant to Button component props
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    authButton: true;
  }
}
