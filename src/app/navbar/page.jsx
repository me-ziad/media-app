"use client";
export const dynamic = "force-dynamic";
import React, { useContext, useEffect, useState } from "react";
import {AppBar,Toolbar,IconButton,Menu,MenuItem,Container,Avatar,Button,Box,Typography,Divider,useTheme,Switch,Fade,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MuiNavLink from "../muiNavLink/MuiNavLink";
import { useDispatch, useSelector } from "react-redux";
import { removToken, setToken } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/page";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useColorMode } from "@/context/ThemeContext";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

// Theme toggle component
const ThemeSwitcher = () => {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
      <DarkModeIcon sx={{ color: isDark ? "#2196f3" : "#999", fontSize: 24 }} />
      <Switch checked={isDark} onChange={toggleColorMode} color="primary" size="meduim" />
      <WbSunnyIcon sx={{ color: !isDark ? "#fbc02d" : "#999", fontSize: 24 }} />
    </Box>
  );
};

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation(); // i18n for language support
  const { userProfile, setUserProfile, refreshUserProfile } = useContext(UserContext); // User context
  const { token } = useSelector((store) => store.authReducer); // Redux token
  const [anchorElNav, setAnchorElNav] = useState(null); // Mobile menu anchor
  const [anchorElUser, setAnchorElUser] = useState(null); // User menu anchor
  const theme = useTheme();

  // Sync token from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken && storedToken !== token) {
        dispatch(setToken(storedToken));
        refreshUserProfile(storedToken);
      }
    }
  }, []);

  // Handlers for menus
  const handleOpenNavMenu = (e) => setAnchorElNav(e.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Logout handler
  const logOut = () => {
    localStorage.removeItem("token");
    dispatch(removToken());
    dispatch(setToken(null));
    setUserProfile(""); // Clear user context
    router.replace("/login"); // Redirect to login
  };

  // Language toggle handler
  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: "blur(16px) saturate(180%)",
        background:
          theme.palette.mode === "dark"
            ? "rgba(18,18,18,0.8)"
            : "rgba(255,255,255,0.7)",
        borderBottom:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
          }}
        >
          {/* === Left Section (Logo + mobile menu icon) === */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Mobile menu icon */}
            {token && (
              <IconButton
                onClick={handleOpenNavMenu}
                sx={{ display: { xs: "inline-flex", md: "none" }, color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link href={token ? "/allPosts" : "/"} passHref>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: theme.palette.primary.main,
                  letterSpacing: 1,
                  cursor: "pointer",
                  display:{xs:'none',md:'block'}
                }}
              >
                Link<span style={{ color: theme.palette.text.primary }}>ed</span>
              </Typography>
            </Link>
          </Box>

          {/* === Middle Links (Desktop) === */}
          {token && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              {/* Desktop navigation links */}
              {["allPosts", "profile","addPost", "profilePhoto", "newPassowrd"].map((link) => (
                <MuiNavLink
                  key={link}
                  href={`/${link}`}
                  label={t(
                    link === "allPosts"
                      ? "Posts"
                      : link === "newPassowrd"
                      ? "NewPassword"
                      : link === "profilePhoto"
                      ? "Photo":
                      link === "addPost"
                        ? "addposts"
                      : "Profile"
                  )}
                  sx={{
                    color:
                      theme.palette.mode === "light"
                        ? "#333"
                        : "#f5f5f5",
                  }}
                />
              ))}
            </Box>
          )}

          {/* === Mobile Nav Menu === */}
          {token && (
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              TransitionComponent={Fade}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 3,
                  backdropFilter: "blur(16px)",
                },
              }}
            >
              {/* Mobile menu links */}
              <MenuItem onClick={handleCloseNavMenu}><MuiNavLink href="/allPosts" label={t("Posts")} /></MenuItem>
              <MenuItem onClick={handleCloseNavMenu}><MuiNavLink href="/profile" label={t("Profile")} /></MenuItem>
              <MenuItem onClick={handleCloseNavMenu}><MuiNavLink href="/addPost" label={t("addposts")} /></MenuItem>
              <MenuItem onClick={handleCloseNavMenu}><MuiNavLink href="/profilePhoto" label={t("Photo")} /></MenuItem>
              <MenuItem onClick={handleCloseNavMenu}><MuiNavLink href="/newPassowrd" label={t("NewPassword")} /></MenuItem>
            </Menu>
          )}

          {/* === Right Section (User Avatar, Theme & Language) === */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {token ? (
              <>
                {/* User Avatar */}
                <IconButton onClick={handleOpenUserMenu}>
                  <Avatar
                    src={userProfile?.photo}
                    alt={userProfile?.name}
                    sx={{ width: 50, height: 50, border: `2px solid ${theme.palette.primary.main}` }}
                  />
                </IconButton>

                {/* User Menu */}
                <Menu
                  TransitionComponent={Fade}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      mt: 1.5,
                      backdropFilter: "blur(16px)",
                      background: theme.palette.mode === "dark" ? "rgba(30,30,30,0.9)" : "rgba(255,255,255,0.95)",
                      boxShadow: "0 8px 32px rgba(31,38,135,0.2), inset 0 0 15px rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  {/* Display user info */}
                  <MenuItem disabled>
                    <Avatar src={userProfile?.photo} sx={{ width: 28, height: 28, mr: 1 }} />
                    <Typography fontWeight="bold">{userProfile?.name || "User"}</Typography>
                  </MenuItem>
                  <MenuItem disabled sx={{ opacity: 0.7 }}>{userProfile?.email}</MenuItem>

                  <Divider />

                  {/* Theme switcher */}
                  <MenuItem sx={{ justifyContent: "center" }} disableRipple>
                    <ThemeSwitcher />
                  </MenuItem>

                  <Divider />

                  {/* Language toggle */}
                  <MenuItem
                    onClick={handleLanguageToggle}
                    sx={{ justifyContent: "center", fontWeight: "bold", color: "primary.main" }}
                  >
                    {i18n.language === "en" ? "العربية" : "English"}
                  </MenuItem>

                  <Divider />

                  {/* Logout button */}
                  <MenuItem sx={{ justifyContent: "center" }} onClick={logOut}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    {t("Logout")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {/* If not logged in: show login/register links */}
                <MuiNavLink href="/login" label={t("Login")}></MuiNavLink>
                <MuiNavLink href="/register" label={t("Register")}></MuiNavLink>

                {/* Theme toggle in dropdown */}
                <IconButton onClick={handleOpenUserMenu} sx={{ borderRadius: 2, border: theme.palette.mode === "dark" ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.1)" }}>
                  <ArrowDropDownIcon />
                </IconButton>
                <Menu
                  TransitionComponent={Fade}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      backdropFilter: "blur(12px)",
                      background: theme.palette.mode === "dark" ? "rgba(40,40,40,0.9)" : "rgba(255,255,255,0.95)",
                    },
                  }}
                >
                  <MenuItem disableRipple>
                     <ThemeSwitcher />
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={handleLanguageToggle}
                    sx={{ justifyContent: "center", fontWeight: "bold", color: "primary.main" }}
                  >
                    {i18n.language === "en" ? "العربية" : "English"}
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
