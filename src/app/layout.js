"use client";

import { Geist, Geist_Mono } from "next/font/google"; 
import { store } from "@/redux/stor";  
import { Provider, useDispatch } from "react-redux";  
import "./globals.css";  
import { Toaster } from "react-hot-toast";  
import Navbar from "@/app/navbar/page";  
import "@fortawesome/fontawesome-free/css/all.min.css";  
import UserContextProvider, { UserContext } from "@/context/page";  
import { useContext, useEffect } from "react";
import { userPosts } from "@/redux/Posts";  
import { jwtDecode } from "jwt-decode";  
import { Offline } from "react-detect-offline";  
import Alert from '@mui/material/Alert';
import { Box } from "@mui/material";
import './i18n';  
import { ColorModeProvider } from "@/context/ThemeContext";  

// Initialize Google fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Component to initialize user data on app start
function InitUserData() {
  const { refreshUserProfile } = useContext(UserContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode token to get user info
        refreshUserProfile(token); // Update user context
        dispatch(userPosts(decoded.user)); // Load user's posts into Redux
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  return null; // This component does not render anything
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Wrap app with UserContext, Redux, and Theme providers */}
        <UserContextProvider>
          <Provider store={store}>
            <ColorModeProvider>
              {/* Navbar always visible */}
              <Navbar />

              {/* Initialize user data on load */}
              <InitUserData /> 

              {/* Toast notifications */}
              <Toaster position="top-center" reverseOrder={false} />

              {/* Main content */}
              {children}

              {/* Offline alert */}
              <Offline>
                <Box
                  sx={{
                    position: "fixed",
                    bottom: { xs: -80, md: 16 },
                    right: { xs: 15, md: 90 },
                    zIndex: 1300,
                    width: { xs: "80%", sm: 300 },
                    maxWidth: "90vw",
                  }}
                >
                  <Alert
                    severity="warning"
                    variant="outlined" 
                    sx={{
                      fontSize: "0.85rem",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                      alignItems: "center",
                    }}
                  >
                    You’re offline
                  </Alert>
                </Box>
              </Offline>
            </ColorModeProvider>
          </Provider>
        </UserContextProvider>
      </body>
    </html>
  );
}
