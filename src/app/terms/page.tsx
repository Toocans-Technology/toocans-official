"use client";

import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
  return (
    <Box sx={{ bgcolor: "#000", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={2}
          >
            <Link href="/">
              <Image
                src="/images/logos/toocans_logo_light.svg"
                alt="Toocans"
                width={120}
                height={24}
              />
            </Link>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Typography
                component="span"
                sx={{
                  color: "#fff",
                  "&:hover": { color: "#9CFF1F" },
                  transition: "color 0.2s ease",
                }}
              >
                Back to Home
              </Typography>
            </Link>
          </Stack>
        </Container>
      </Box>

      {/* Terms Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
          Terms of Use
        </Typography>

        <Box sx={{ mb: 5 }}>
          <Typography paragraph>
            These Terms constitute a legally binding agreement between you
            ("you" or "your") and Toocans ("Toocans", "we", "our" or "us"). The
            Terms govern your use of the Toocans Services made available to you
            on or through the Platform or otherwise. Toocans Services may be
            provided by Toocans or, if specified in these Terms, any Product
            Terms or any additional terms, by any Toocans Affiliate.
          </Typography>

          <Typography paragraph>
            By registering for a Toocans Account, accessing the Platform and/or
            using the Toocans Services, you agree that you have read, understood
            and accepted these Terms, together with any additional documents or
            terms referred to in these Terms. You acknowledge and agree that you
            will be bound by and will comply with these Terms, as updated and
            amended from time to time.
          </Typography>

          <Typography paragraph>
            If you do not understand and accept these Terms in their entirety,
            you should not register for a Toocans Account or access or use the
            Platform or any Toocans Service.
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom>
            Risk Warning
          </Typography>

          <Typography paragraph>
            As with any asset, the value of Digital Assets can fluctuate
            significantly and there is a material risk of economic loss when
            buying, selling, holding or investing in Digital Assets. You should
            therefore consider whether trading or holding Digital Assets is
            suitable for you in light of your financial circumstances.
          </Typography>

          <Typography paragraph>
            We are not your broker, intermediary, agent or advisor and we have
            no fiduciary relationship or obligation to you in connection with
            any Transactions or other activities you undertake when using the
            Toocans Services. We do not provide investment or consulting advice
            of any kind and no communication or information that we provide to
            you is intended as, or should be construed as, advice of any kind.
          </Typography>

          <Typography paragraph>
            It is your responsibility to determine whether any investment,
            investment strategy or related transaction is appropriate for you
            according to your personal investment objectives, financial
            circumstances and risk tolerance and you are responsible for any
            associated loss or liability. We do not recommend that any Digital
            Asset should be bought, earned, sold or held by you. Before making
            the decision to buy, sell or hold any Digital Asset, you should
            conduct your own due diligence and consult your financial advisor.
            We are not responsible for the decisions you make to buy, earn, sell
            or hold Digital Assets based on the information provided by us,
            including any losses you incur arising from those decisions.
          </Typography>
        </Box>

        <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Information About Our Agreement with You
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Introduction
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            1.1. About us.
          </Typography>
          <Typography paragraph>
            The Toocans group is an ecosystem centred around an online exchange
            for Digital Assets trading. The Toocans group provides users with a
            trading platform to buy and sell Digital Assets, an integrated
            custody solution allowing users to store their Digital Assets and
            other Digital Asset-related services.
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            1.2. These Terms.
          </Typography>
          <Typography paragraph>
            By registering to open a Toocans Account you are entering into a
            legally binding agreement with us. These Terms will govern your use
            of the Toocans Services and tell you who we are, how we will provide
            the Toocans Services to you, how these Terms may be changed or
            terminated, what to do if there is a problem, along with other
            important information.
          </Typography>
          <Typography paragraph>
            You must read these Terms, together with the documents referenced in
            the Terms, carefully and let us know if you do not understand
            anything.
          </Typography>
          <Typography paragraph>
            Where any Local Terms apply to your use of the Toocans Services,
            such Local Terms shall govern your use of the Toocans Services.
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            1.3. Additional documents.
          </Typography>
          <Typography paragraph>
            These Terms refer to a number of additional documents which also
            apply to your use of the Toocans Services. This includes:
          </Typography>
          <Typography paragraph sx={{ pl: 2 }}>
            Our Privacy Notice, which sets out the terms on which we process any
            personal data we collect about you, or that you provide to us. By
            using the Toocans Services, you understand and agree to such
            processing and you promise that all data provided by you is accurate
            and up to date.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. Eligibility
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            2.1. Eligibility criteria.
          </Typography>
          <Typography paragraph>
            To be eligible to register for a Toocans Account and use the Toocans
            Services, you must:
          </Typography>

          <List sx={{ pl: 2 }}>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                pl: 0,
                py: 0.5,
              }}
            >
              <ListItemText primary="be an individual, corporation, legal person, entity or other organisation with the full power, authority and capacity to (1) access and use the Toocans Services; and (2) enter into and comply with your obligations under these Terms;" />
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                pl: 0,
                py: 0.5,
              }}
            >
              <ListItemText primary="if you are an individual, be at least 18 years old;" />
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                pl: 0,
                py: 0.5,
              }}
            >
              <ListItemText primary="if you act as an employee or agent of a legal entity, and enter into these Terms on their behalf, you must be duly authorised to act on behalf of and bind such legal entity for the purposes of entering into these Terms;" />
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                pl: 0,
                py: 0.5,
              }}
            >
              <ListItemText primary="not have been previously suspended or removed from using Toocans Services;" />
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                pl: 0,
                py: 0.5,
              }}
            >
              <ListItemText primary="not be a Restricted Person;" />
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                pl: 0,
                py: 0.5,
              }}
            >
              <ListItemText primary="not currently have an existing Toocans Account;" />
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                listStyleType: "disc",
                pl: 0,
                py: 0.5,
              }}
            >
              <ListItemText primary="not be located, incorporated, otherwise established in, or resident of, or have business operations in any restricted jurisdiction." />
            </ListItem>
          </List>
        </Box>

        {/* Footer */}
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 6 }} />
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="rgba(102, 102, 102, 1)">
            &copy; {new Date().getFullYear()} Toocans. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
