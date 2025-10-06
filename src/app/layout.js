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
import { Offline} from "react-detect-offline";
import Alert from '@mui/material/Alert';
 import { Box } from "@mui/material";
import './i18n';
import { ColorModeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function InitUserData() {
  const { refreshUserProfile } = useContext(UserContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      refreshUserProfile(token); 
      dispatch(userPosts(decoded.user)); 
    }
  }, []);

  return null; 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider store={store}>
               <ColorModeProvider>
          <UserContextProvider>
            <Navbar />
            <InitUserData /> 
            <Toaster position="top-center" reverseOrder={false} />
            {children}
              <Offline>
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
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

 
          </UserContextProvider>
                    </ColorModeProvider>
        </Provider>
      </body>
    </html>
  );
}