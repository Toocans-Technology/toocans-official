import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthButton from "@/app/components/forms/theme-elements/AuthButton";
import { useUserProfileStore } from "@/store/userProfileStore";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";

const MobileSidebar = () => {
  const { userProfile, clearUserProfile } = useUserProfileStore();
  const router = useRouter();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      if (accessToken) {
        const response = await fetch("https://dev-api.bdy.tech/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          console.error(
            "Logout API call failed:",
            response.status,
            await response.text()
          );
        }
      }
    } catch (error) {
      console.error("Error during logout API call:", error);
    } finally {
      // Clear Zustand store
      clearUserProfile();
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear cookies
      Cookies.remove('auth-token', { path: '/' });
      Cookies.remove('auth-token', { path: '/overview' });
      
      // Redirect to login
      router.push("/auth/login");
    }
  };

  return (
    <>
      <Box px={3}>
        <Logo />
      </Box>
      <Box p={3}>
        <Stack direction="column" spacing={2}>
          {userProfile ? (
            <>
              <Button color="inherit" href="/deposit">
                Deposit
              </Button>
              {/* <Button
                color="primary"
                variant="contained"
                onClick={handleLogout}
              >
                Login out
              </Button> */}
              <AuthButton
                buttonType="signup"
                href="/auth/login"
                fullWidth={false}
              >
                {" "}
                {/* Assuming signup also goes to login page for now */}
                Login out
              </AuthButton>
            </>
          ) : (
            <>
              <Button color="inherit" href="/auth/login">
                Login
              </Button>
              <Button color="primary" variant="contained" href="/auth/login">
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MobileSidebar;
