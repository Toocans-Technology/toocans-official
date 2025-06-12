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

export default function PrivacyPage() {
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

      {/* Privacy Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
          Privacy Notice
        </Typography>

        <Box sx={{ mb: 5 }}>
          <Typography paragraph>
            Toocans ("Toocans", "we", or "us") is committed to protecting the
            privacy of our customers, and we take our data protection
            responsibilities with the utmost seriousness.
          </Typography>

          <Typography paragraph>
            This Privacy Notice applies to all Personal data processing
            activities carried out by us, across platforms, websites, and
            departments of Toocans.
          </Typography>

          <Typography paragraph>
            To the extent that you are a customer or user of our services, this
            Privacy Notice applies together with any terms of business and other
            contractual documents, including but not limited to any agreements
            we may have with you.
          </Typography>

          <Typography paragraph>
            To the extent that you are not a relevant stakeholder, customer, or
            user of our services, but are using our website, this Privacy Notice
            also applies to you together with our Cookie Notice.
          </Typography>

          <Typography paragraph>
            Toocans companies may share your personal data with each other and
            if they do so, they will use it consistently with this Privacy
            Notice.
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom>
            1. What Personal Data does Toocans collect and process?
          </Typography>

          <Typography paragraph>
            Personal data is data that identifies an individual or relates to an
            identifiable individual. This includes information you provide to
            us, information which is collected about you automatically, and
            information we obtain from third parties.
          </Typography>

          <Typography paragraph sx={{ fontWeight: "medium" }}>
            Information you provide to us:
          </Typography>
          <Typography paragraph>
            To open an account and access our services, we'll ask you to provide
            us with some information about yourself. This information is either
            required by law (e.g., to verify your identity and comply with "Know
            Your Customer" or "Travel Rule" obligations), necessary to provide
            the requested services (e.g., you will need to provide your email
            address in order to open your account), or is relevant for certain
            specified purposes, described in greater detail below. In some
            cases, if we add services and features you may be asked to provide
            us with additional information.
          </Typography>

          <Typography paragraph>
            Failure in providing the data required implies that Toocans will not
            be able to offer you our services.
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data Protection and Display
            </Typography>

            <Typography paragraph>
              To protect your privacy, we implement data masking when displaying
              sensitive personal information:
            </Typography>

            <List sx={{ ml: 2 }}>
              <ListItem
                sx={{
                  display: "list-item",
                  listStyleType: "disc",
                  pl: 0,
                  py: 0.5,
                }}
              >
                <ListItemText
                  primary={
                    <Typography>
                      Phone numbers are displayed with only the first 2 digits
                      and last 3 digits visible, with 3 asterisks in between
                      (e.g.,{" "}
                      <Box
                        component="span"
                        sx={{
                          fontFamily: "monospace",
                          bgcolor: "rgba(156, 255, 31, 0.1)",
                          px: 1,
                          borderRadius: 1,
                        }}
                      >
                        12***123
                      </Box>
                      )
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem
                sx={{
                  display: "list-item",
                  listStyleType: "disc",
                  pl: 0,
                  py: 0.5,
                }}
              >
                <ListItemText
                  primary={
                    <Typography>
                      Email addresses are displayed with only the first 2
                      characters of the username and domain visible, with 3
                      asterisks after each part (e.g.,{" "}
                      <Box
                        component="span"
                        sx={{
                          fontFamily: "monospace",
                          bgcolor: "rgba(156, 255, 31, 0.1)",
                          px: 1,
                          borderRadius: 1,
                        }}
                      >
                        ab***@gm***
                      </Box>
                      )
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Typography paragraph>
              These measures help protect your personal information while
              maintaining necessary functionality.
            </Typography>
          </Box>

          <Typography paragraph sx={{ fontWeight: "medium" }}>
            Information we collect automatically:
          </Typography>
          <Typography paragraph>
            To the extent permitted under the applicable law, we may collect
            certain types of information automatically, for example whenever you
            interact with us or use the services. This information helps us
            address customer support issues, improve the performance of our
            sites and services, maintain and improve your user experience, and
            protect your account from fraud by detecting unauthorized access.
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom>
            2. Why does Toocans process my personal data?
          </Typography>

          <Typography paragraph>
            Our primary purpose in collecting personal data is to provide our
            services in a secure, efficient, and smooth way. We generally use
            your personal data to deliver, provide, operate, our services, and
            for content and advertising, and for loss prevention and anti-fraud
            purposes.
          </Typography>

          <Typography paragraph>
            Below you'll find an explanation on how we use Automated individual
            decision-making, including profiling. Toocans does not rely solely
            on automated tools to help determine whether a transaction or a
            customer account presents a fraud or legal risk.
          </Typography>
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
