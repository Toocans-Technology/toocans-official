import AuthButton from "@/app/components/forms/theme-elements/AuthButton";
import { Stack } from "@mui/material";
// Removed useState as it's no longer needed for open, open2, isLoggedIn, userEmail, userUid
import { useUserProfileStore } from "@/store/userProfileStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DownloadApp from "./DownloadApp";
import Language from "./Language";
import UserMenu from "./UserMenu";

const Navigations = () => {
  const { userProfile, clearUserProfile } = useUserProfileStore(); // Get userProfile and clearUserProfile from store
  const router = useRouter();
  console.log("Navigations userProfile:", userProfile);
  const handleLogout = async () => {
    // Make the function async
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
          // Log error if response is not OK
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
      // This block will always execute
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
    <Stack direction="row" spacing={2} alignItems="center">
      {userProfile ? (
        <>
          <AuthButton buttonType="signup" href="/deposit" fullWidth={false}>
            Deposit
          </AuthButton>
          <UserMenu
            displayName={userProfile.nickname || userProfile.loginName} // Pass nickname or loginName
            email={userProfile.email}
            uid={String(userProfile.userId)} // Pass loginId or userId as UID
            onLogout={handleLogout} // Pass the logout handler
          />
          <DownloadApp />
          <Language />
        </>
      ) : (
        <>
          <AuthButton buttonType="login" href="/auth/login" fullWidth={false}>
            Login
          </AuthButton>
          <AuthButton buttonType="signup" href="/auth/login" fullWidth={false}>
            {" "}
            {/* Assuming signup also goes to login page for now */}
            Sign Up
          </AuthButton>
          <DownloadApp />
          <Language />
        </>
      )}
    </Stack>
  );
};

export default Navigations;
