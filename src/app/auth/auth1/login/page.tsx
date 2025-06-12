"use client";
import PageContainer from "@/app/components/container/PageContainer";
import LpHeader from "@/app/components/landingpage/header/Header";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import AuthLogin from "../../authForms/AuthLoginV1";

export default function Login() {
  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <LpHeader />
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={8}
          sx={{
            position: "relative",
            "&:before": {
              content: '""',
              background: "#151515",
              backgroundSize: "100% 100%",
              animation: "gradient 15s ease infinite",
              position: "absolute",
              height: "100%",
              width: "100%",
              // opacity: '0.3',
            },
          }}
        >
          <Box position="relative">
            {/* <Box px={3}>
            <Logo />
          </Box> */}
            <Box
              alignItems="center"
              justifyContent="center"
              // height={'calc(100vh - 75px)'}
              sx={{
                display: {
                  xs: "none",
                  lg: "flex",
                },
              }}
            >
              <Image
                src={"/images/backgrounds/login-bg.png"}
                alt="bg"
                width={500}
                height={500}
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "500px",
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ background: "#FFF" }}
        >
          <Box p={4}>
            <AuthLogin
              title="Welcome to Toocans"
              // subtext={
              //   <Typography variant="subtitle1" color="textSecondary" mb={1}>
              //     Your Admin Dashboard
              //   </Typography>
              // }
              // subtitle={
              //   <Stack direction="row" spacing={1} mt={3}>
              //     <Typography color="textSecondary" variant="h6" fontWeight="500">
              //       New to Modernize?
              //     </Typography>
              //     <Typography
              //       component={Link}
              //       href="/auth/auth1/register"
              //       fontWeight="500"
              //       sx={{
              //         textDecoration: 'none',
              //         color: 'primary.main',
              //       }}
              //     >
              //       Create an account
              //     </Typography>
              //   </Stack>
              // }
            />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
