import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { IconChevronDown } from '@tabler/icons-react';
import AppLinks from '@/app/(DashboardLayout)/layout/vertical/header/AppLinks';
import QuickLinks from '@/app/(DashboardLayout)/layout/vertical/header/QuickLinks';
import DemosDD from './DemosDD';
import AuthButton from '@/app/components/forms/theme-elements/AuthButton';

const Navigations = () => {

    // Using AuthButton instead of StyledButton

    // demos
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // pages

    const [open2, setOpen2] = useState(false);

    const handleOpen2 = () => {
        setOpen2(true);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };



    return (
        <>
            {/* <StyledButton color="inherit" variant="text" href="https://demos.adminmart.com/premium/nextjs/modernize-nextjs/docs/index.html">
                Documentation
            </StyledButton>
            <StyledButton color="inherit" variant="text" href="https://adminmart.com/support">
                Support
            </StyledButton> */}
            <AuthButton 
                buttonType="login" 
                href="/auth/login" 
                fullWidth={false}
            >
                Login
            </AuthButton>
            <AuthButton 
                buttonType="signup" 
                href="/auth/login" 
                fullWidth={false}
            >
                Sign Up
            </AuthButton>
        </>
    );
};

export default Navigations;
