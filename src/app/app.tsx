"use client";
import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "@/app/(DashboardLayout)/layout/shared/customizer/RTL";
import { ThemeSettings } from "@/utils/theme/Theme";
import { useSelector } from 'react-redux';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { AppState } from "@/store/store";
import "@/utils/i18n";
import "@/app/api/index";
import { useUserProfileStore } from "../store/userProfileStore";


const MyApp = ({ children }: { children: React.ReactNode }) => {
    const theme = ThemeSettings();
    console.log("app theme:", theme);
    const customizer = useSelector((state: AppState) => state.customizer);
    const { userProfile, setUserProfile } = useUserProfileStore();

    useEffect(() => {
        if (!userProfile) {
            const token = localStorage.getItem('access_token');
            if (token) {
                // @ts-ignore
                setUserProfile({ access_token: token });
            }
        }
    }, []);

    return (
        <>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                    <RTL direction={customizer.activeDir}>
                        <CssBaseline />
                        {children}
                    </RTL>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </>
    );
};

export default MyApp;
