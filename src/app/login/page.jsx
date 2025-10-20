"use client";
import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Paper, useTheme } from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setLoading, setToken } from "@/redux/authSlice";
import { UserContext } from "@/context/page";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Login() {
  // Redux state to track loading
  const { loading } = useSelector((store) => store.authReducer);
  const dispatch = useDispatch();

  // Next.js router
  const router = useRouter();

  // MUI theme for dynamic styling
  const theme = useTheme();

  // Translation function
  const { t } = useTranslation();

  // User context for updating user profile after login
  const { refreshUserProfile } = useContext(UserContext);

  // Local state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  // Set page title on component mount
  useEffect(() => {
    document.title = "Login";
  }, []);

  // Form validation schema using Yup
  const validationSchema = yup.object({
    email: yup
      .string()
      .required(t("Emailisrequired"))
      .email(t("Invalidemail"))
      .min(4, t("Min4characters"))
      .max(60, t("Max60characters")),
    password: yup
      .string()
      .required(t("Passwordisrequired"))
      .min(8, t("Min8characters"))
      .max(20, t("Max20characters"))
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
        t("Includeupperslowercasenumberspecialcharacter")
      ),
  });

  // Initialize Formik for form state management and validation
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      // Set loading state before API call
      dispatch(setLoading(true));
      try {
        // Make login request to API
        const { data } = await axios.post(
          "https://linked-posts.routemisr.com/users/signin",
          values
        );

        // Show success message
        toast.success(data.message || "Login successful");

        // Save token in localStorage
        localStorage.setItem("token", data.token);

        // Update token in Redux store
        dispatch(setToken(data.token));

        // Refresh user profile in context
        refreshUserProfile(data.token);

        // Redirect to posts page after successful login
        router.replace("/allPosts");
      } catch (err) {
        // Show error message if login fails
        toast.error(
          err?.response?.data?.error || "Login failed. Please try again."
        );
      } finally {
        // Reset loading state
        dispatch(setLoading(false));
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        background:
          "url('https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dark overlay for background image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 0,
        }}
      />

      {/* Left Section - Welcome text (hidden on small screens) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          color: theme.palette.mode === "dark" ? "#fff" : "#111",
          position: "relative",
          zIndex: 1,
          p: 6,
        }}
      >
        <Box
          sx={{
            p: 6,
            borderRadius: 5,
            backdropFilter: "blur(25px) saturate(180%)",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(20,20,20,0.7), rgba(40,40,40,0.5))"
                : "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.15))",
            border:
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.15)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,255,255,0.05)"
                : "0 0px 0px rgba(31,38,135,0.25), inset 0 0 40px rgba(255,255,255,0.15)",
            textAlign: "center",
            maxWidth: "400px",
            transition: "all 0.4s ease",
          }}
        >
          {/* Welcome title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              textShadow:
                theme.palette.mode === "dark"
                  ? "0 0 12px rgba(255,255,255,0.3)"
                  : "0 0 12px rgba(0,0,0,0.15)",
            }}
          >
            {t("WelcomeBack")}
          </Typography>

          {/* Subtitle text */}
          <Typography
            variant="body1"
            sx={{
              opacity: theme.palette.mode === "dark" ? 0.9 : 0.85,
            }}
          >
            {t("LoginToContinueYourJourney")}
          </Typography>
        </Box>
      </Box>

      {/* Right Section - Login Form */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: { xs: 3, sm: 6, md: 8 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated container using Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          {/* Paper component for form background */}
          <Paper
            elevation={20}
            sx={{
              p: 5,
              borderRadius: 5,
              backdropFilter: "blur(25px) saturate(180%)",
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(20,20,20,0.7), rgba(40,40,40,0.5))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.15))",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.15)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,255,255,0.05)"
                  : "0 8px 32px rgba(31,38,135,0.25), inset 0 0 40px rgba(255,255,255,0.15)",
              color: theme.palette.mode === "dark" ? "#fff" : "#111",
              transition: "all 0.4s ease",
            }}
          >
            {/* Form heading */}
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={1}
              sx={{ textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
            >
              {t("Login")}
            </Typography>

            {/* Form subtitle */}
            <Typography
              variant="body2"
              textAlign="center"
              mb={3}
              color="text.secondary"
            >
              {t("EnterYourCredentials")}
            </Typography>

            {/* Login form */}
            <Box component="form" onSubmit={formik.handleSubmit}>
              {/* Email input field */}
              <TextField
                label={t("Email")}
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
                margin="normal"
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.25)",
                    color: theme.palette.mode === "dark" ? "#f5f5f5" : "#111",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.4)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.7)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.mode === "dark" ? "#aaa" : "#555",
                    "&.Mui-focused": { color: "#fff" },
                  },
                }}
              />

              {/* Password input field with toggle visibility */}
              <TextField
                label={t("Password")}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 3,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.25)",
                    color: theme.palette.mode === "dark" ? "#f5f5f5" : "#111",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.4)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.7)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.mode === "dark" ? "#aaa" : "#555",
                    "&.Mui-focused": { color: "#fff" },
                  },
                }}
              />

              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={!loading && <LoginIcon />}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.4,
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 3,
                  textTransform: "none",
                  background: "linear-gradient(90deg, #2196f3, #21cbf3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 18px rgba(33,203,243,0.5)",
                  },
                }}
              >
                {/* Show spinner icon if loading */}
                {loading ? (
                  <i
                    className="fa-solid fa-spinner fa-spin"
                    style={{ fontSize: "16px" }}
                  ></i>
                ) : (
                  t("Login")
                )}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
