"use client";

import AuthButton from "@/app/components/forms/theme-elements/AuthButton";
import DownloadApp from "@/app/components/landingpage/header/DownloadApp";
import Language from "@/app/components/landingpage/header/Language";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import Image from "next/image";
import { useState } from "react";

// Define the shimmer animation keyframes
const shimmerAnimation = keyframes`
  to { background-position: 100% }
`;

// Mobile Menu Component
const MobileMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: "Home", href: "#" },
    { text: "Market", href: "#" },
    { text: "Wallet", href: "#" },
    { text: "About", href: "#" },
  ];

  return (
    <>
      <IconButton
        onClick={() => toggleDrawer(true)}
        sx={{ color: "#fff" }}
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "75%",
            maxWidth: "300px",
            bgcolor: "#121212",
            color: "#fff",
            p: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Image
            src="/images/logos/toocans_logo_light.svg"
            alt="Todcans"
            width={100}
            height={20}
          />
          <IconButton
            onClick={() => toggleDrawer(false)}
            sx={{ color: "#fff" }}
            aria-label="close menu"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1 }} />

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component="a"
                href={item.href}
                sx={{
                  py: 1.5,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "rgba(156, 255, 31, 0.1)",
                    color: "#9CFF1F",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1 }} />

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <AuthButton buttonType="login" href="/auth/login" fullWidth={true}>
            Login
          </AuthButton>
          <AuthButton buttonType="signup" href="/auth/login" fullWidth={true}>
            Sign Up
          </AuthButton>
          {/* <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <DownloadApp />
            <Language />
          </Box> */}
        </Box>
      </Drawer>
    </>
  );
};

interface CryptoData {
  icon: string;
  name: string;
  price: string;
  change: string;
  value: string;
}

const cryptoData: CryptoData[] = [
  {
    icon: "/images/crypto/btc.png",
    name: "BTC",
    price: "$154,865.72",
    change: "-10.25%",
    value: "$4,918",
  },
  {
    icon: "/images/crypto/eth.png",
    name: "ETH",
    price: "$2,095.45",
    change: "+4.25%",
    value: "$500-$5K",
  },
  {
    icon: "/images/crypto/btc.png",
    name: "BTC",
    price: "$154,865.72",
    change: "-10.25%",
    value: "$4,918",
  },
  {
    icon: "/images/crypto/eth.png",
    name: "ETH",
    price: "$2,095.45",
    change: "+4.25%",
    value: "$500-$5K",
  },
];

export default function Home() {
  return (
    <Box sx={{ bgcolor: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ position: "relative" }}>
        <Container maxWidth="xl">
          {/* Desktop Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={2}
            spacing={0}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Stack direction="row" spacing={4} alignItems="center">
              <Image
                src="/images/logos/toocans_logo_light.svg"
                alt="Todcans"
                width={120}
                height={24}
              />
              <Stack direction="row" spacing={3}>
                <Typography
                  component="a"
                  href="#"
                  sx={{
                    color: "#fff",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    "&:hover": { color: "#9CFF1F" },
                    "&:active": { opacity: 0.7 },
                  }}
                >
                  Home
                </Typography>
                <Typography
                  component="a"
                  href="#"
                  sx={{
                    color: "#fff",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    "&:hover": { color: "#9CFF1F" },
                    "&:active": { opacity: 0.7 },
                  }}
                >
                  Market
                </Typography>
                <Typography
                  component="a"
                  href="#"
                  sx={{
                    color: "#fff",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    "&:hover": { color: "#9CFF1F" },
                    "&:active": { opacity: 0.7 },
                  }}
                >
                  Wallet
                </Typography>
                <Typography
                  component="a"
                  href="#"
                  sx={{
                    color: "#fff",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    "&:hover": { color: "#9CFF1F" },
                    "&:active": { opacity: 0.7 },
                  }}
                >
                  About
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <AuthButton
                buttonType="login"
                href="/auth/login"
                fullWidth={false}
                sx={{ cursor: "pointer" }}
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
              <DownloadApp />
              <Language />
            </Stack>
          </Stack>

          {/* Mobile Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={2}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Image
              src="/images/logos/toocans_logo_light.svg"
              alt="Todcans"
              width={100}
              height={20}
            />
            <MobileMenu />
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          "&::before": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // border: "1px solid #FF3B30",
            borderRadius: "8px",
            // background: "linear-gradient(180deg, rgba(255, 59, 48, 0.1) 0%, rgba(255, 59, 48, 0) 100%)",
            zIndex: 0,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ mt: 8, pb: 0, position: "relative", zIndex: 1 }}
        >
          <Grid container spacing={{ xs: 4, md: 12 }} alignItems="top">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  fontSize: { xs: "28px", sm: "32px", md: "40px" },
                  lineHeight: { xs: "36px", sm: "40px", md: "48px" },
                  textAlign: { xs: "center", md: "left" },
                  fontWeight: 900,
                  background:
                    "linear-gradient(90deg, #ffffff, #9CFF1F, #ffffff) -100%/ 200%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  animation: `${shimmerAnimation} 2s linear infinite`,
                }}
              >
                The future of finance,
                <br />
                powered by trading experts
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  mt: 3,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const emailInput = e.currentTarget.querySelector(
                      'input[type="email"]'
                    ) as HTMLInputElement;
                    const email = emailInput?.value;
                    if (email) {
                      window.location.href = `/auth/login?email=${encodeURIComponent(
                        email
                      )}`;
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#111",
                    borderRadius: "24px",
                    p: "2px",
                    flex: 1,
                    maxWidth: "343px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <input
                    type="email"
                    placeholder="Enter Email"
                    required
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      padding: "8px 16px",
                      flex: 1,
                      outline: "none",
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "#9CFF1F",
                      color: "#000",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#8CE00E",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(156, 255, 31, 0.25)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                        boxShadow: "0 2px 4px rgba(156, 255, 31, 0.2)",
                      },
                      minWidth: "112px",
                      borderRadius: "24px",
                      fontSize: "18px",
                    }}
                  >
                    Start now
                  </Button>
                </Box>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="#999999" sx={{ mb: 0.5 }}>
                  Continue with
                </Typography>
                <Stack direction="row">
                  <IconButton sx={{ color: "#fff", px: 0 }}>
                    <Image
                      src="/images/svgs/google.svg"
                      alt="Google"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                  <IconButton sx={{ color: "#fff" }}>
                    <Image
                      src="/images/svgs/social.svg"
                      alt="Metamask"
                      width={24}
                      height={24}
                    />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Image
                  src="/images/home/bitcoin-3d.png"
                  alt="Bitcoin 3D"
                  width={290}
                  height={314}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Crypto Price List */}
          <Box
            sx={{
              mt: { xs: 4, md: 8 },
              width: "100%",
              overflow: "hidden",
              bgcolor: "#0F0F0F",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "200px", sm: "300px", md: "620px" },
              }}
            >
              <Image
                src="/images/home/tradding.png"
                alt="Trading"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Wallet Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: "28px", sm: "32px", md: "40px" },
            lineHeight: { xs: "36px", sm: "40px", md: "48px" },
            mb: { xs: 3, md: 4 },
          }}
        >
          Your Safe and Trusted Crypto Wallet
        </Typography>

        {/* Central Shield Icon */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/images/home/wallet-3d.png"
            alt="Secure Wallet"
            width={250}
            height={250}
          />
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "left",
                p: 3,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  bgcolor: "#1F1F1F",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/images/home/secure-icon.svg"
                  alt="Secure Asset Storage"
                  width={50}
                  height={50}
                />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Secure Asset Storage
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  color: "rgba(153, 153, 153, 1)",
                  fontSize: "14px",
                  width: "311px",
                  lineHeight: "22px",
                }}
              >
                Our top-tier encryption and storage technologies guarantee that
                your assets remain fully protected and secure at all times.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "left",
                p: 3,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  bgcolor: "#1F1F1F",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/images/home/reliable-icon.svg"
                  alt="Reliable Platform"
                  width={50}
                  height={50}
                />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Reliable Platform
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  color: "rgba(153, 153, 153, 1)",
                  fontSize: "14px",
                  width: "311px",
                  lineHeight: "22px",
                }}
              >
                Built with a security-first approach, our platform is designed
                to detect and respond to cyber threats swiftly and effectively.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "left",
                p: 3,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  bgcolor: "#1F1F1F",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/images/home/multi-device-icon.svg"
                  alt="Multi-Device Access"
                  width={50}
                  height={50}
                />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Multi-Device Access
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  color: "rgba(153, 153, 153, 1)",
                  fontSize: "14px",
                  width: "311px",
                  lineHeight: "22px",
                }}
              >
                Whether on desktop or mobile, access your wallet anytime,
                anywhere, with full functionality across all devices, ensuring
                flexibility and convenience at your fingertips.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Assets and Markets Section */}
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 6 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#111",
                px: 4,
                pt: 4,
                pb: 0,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  border: "1px solid #9CFF1F",
                },
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{ fontSize: "32px", fontWeight: 600, mb: 2, pt: 2 }}
                >
                  Assets
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{
                    mb: 3,
                    color: "#FFF",
                    width: "210px",
                    fontSize: "16px",
                    lineHeight: "22px",
                  }}
                >
                  Provides clear information about wallet assets
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                }}
              >
                <Image
                  src="/images/home/assets-preview.svg"
                  alt="Assets Preview"
                  width={240}
                  height={260}
                  style={{ objectFit: "contain", maxWidth: "100%" }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: "#111",
                px: 4,
                pt: 4,
                pb: 0,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  border: "1px solid #9CFF1F",
                },
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{ fontSize: "32px", fontWeight: 600, mb: 2, pt: 2 }}
                >
                  Markets
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{
                    mb: 3,
                    color: "#FFF",
                    width: "210px",
                    fontSize: "16px",
                    lineHeight: "22px",
                  }}
                >
                  Identify market opportunities and track market conditions
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                }}
              >
                <Image
                  src="/images/home/markets-preview.svg"
                  alt="Markets Preview"
                  width={240}
                  height={260}
                  style={{ objectFit: "contain", maxWidth: "100%" }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Chain Transfers Section */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 4, md: 8 }, position: "relative" }}
      >
        <Box
          sx={{
            bgcolor: "#111",
            px: { xs: 2, md: 6 },
            pb: 0,
            borderRadius: 2,
            overflow: "hidden",
            transition: "background-color 0.3s ease",
            "&:hover": {
              border: "1px solid #9CFF1F",
            },
          }}
        >
          <Box
            sx={{
              position: { xs: "relative", md: "absolute" },
              top: { md: "160px" },
              pt: { xs: 3, md: 0 },
              px: { xs: 2, md: 0 },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                width: { xs: "100%", md: 380 },
                fontSize: { xs: "24px", md: "32px" },
                lineHeight: { xs: "32px", md: "48px" },
                textAlign: { xs: "center", md: "left" },
              }}
              gutterBottom
            >
              Chain transfers, free internal transfers, anytime, anywhere
            </Typography>
          </Box>
          <Box
            sx={{
              mt: 4,
              position: "relative",
              height: { xs: "300px", md: "380px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/images/home/chain-transfers.png"
              alt="Chain Transfers"
              fill
              style={{
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Call to Action */}
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            px: { xs: 2, md: 0 },
          }}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontSize: { xs: "24px", md: "32px" },
              lineHeight: { xs: "32px", md: "48px" },
            }}
          >
            Start your crypto security management wallet
          </Typography>
          <Button
            variant="contained"
            size="large"
            component="a"
            href="/auth/login"
            sx={{
              bgcolor: "#9CFF1F",
              color: "#000",
              "&:hover": { bgcolor: "#8CE00E" },
              mt: 3,
              borderRadius: 4,
              fontSize: { xs: "16px", md: "18px" },
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Sign Up Now
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "#111", py: 2, mt: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2 }}
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="body2" color="rgba(102, 102, 102, 1)">
              &copy; Toocans
            </Typography>
            <Typography
              variant="body2"
              color="rgba(102, 102, 102, 1)"
              component="a"
              href="/terms"
              sx={{
                textDecoration: "none",
                "&:hover": { color: "#9CFF1F" },
                transition: "color 0.2s ease",
                cursor: "pointer",
              }}
            >
              Terms of Use
            </Typography>
            <Typography
              variant="body2"
              color="rgba(102, 102, 102, 1)"
              component="a"
              href="/privacy"
              sx={{
                textDecoration: "none",
                "&:hover": { color: "#9CFF1F" },
                transition: "color 0.2s ease",
                cursor: "pointer",
              }}
            >
              Privacy Policy
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
