import "@/styles/globals.css";

import NoSSR from "@/components/no-srr";
import { ThemeProvider } from "next-themes";
import { appWithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

import { attemptAutoLogin } from "@/lib/auth";

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const [isAutoLoginAttempted, setIsAutoLoginAttempted] = useState(false);

  useEffect(() => {
    const handleAutoLogin = async () => {
      if (router.pathname.includes("/auth")) {
        setIsAutoLoginAttempted(true);
        return;
      }

      try {
        const tokenResponse = await SecureStoragePlugin.get({ key: "autoLoginToken" });
        if (tokenResponse.value) {
          const user = await attemptAutoLogin(tokenResponse.value);
          if (user) {
            // Auto-login successful
            await router.push("/"); // Assuming home page is root
          } else {
            // Auto-login failed (e.g., token invalid)
            await SecureStoragePlugin.remove({ key: "autoLoginToken" });
          }
        }
      } catch (error) {
        console.error("Error during auto-login attempt:", error);
        // Optionally remove token if any error occurs during the process
        // await SecureStoragePlugin.remove({ key: "autoLoginToken" });
      } finally {
        setIsAutoLoginAttempted(true);
      }
    };

    handleAutoLogin();
  }, [router]); // Add router to dependency array as it's used inside

  if (!isAutoLoginAttempted) {
    // You can return a loading spinner or a splash screen here
    // For simplicity, returning null or a basic loading message
    return <p>Loading...</p>; 
  }

  return (
    <NoSSR>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </NoSSR>
  );
};

export default appWithTranslation(App);
