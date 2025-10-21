"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  TextField,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  useTheme,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { PersonAddAlt } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Register() {
  // Local loading state
  const [loading, setLoading] = useState(false);

  // Next.js router for navigation
  const router = useRouter();

  // MUI theme for dynamic styling
  const theme = useTheme();

  // Translation function
  const { t } = useTranslation();

  // Set page title on component mount
  useEffect(() => {
    document.title = "Register";
  }, []);

  // Function to handle registration form submission
  async function registerForm(values) {
    setLoading(true); // Set loading state before API call
    try {
      // Make POST request to signup API
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );

      // Show success message
      toast.success(data.message);

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err) {
      // Show error message if registration fails
      toast.error(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  // Validation schema using Yup
  const validationSchema = yup.object({
    name: yup.string().required("Name is required").min(3).max(15),
    email: yup.string().required("Email is required").email().max(60),
    password: yup
      .string()
      .required("Password is required")
      .min(8)
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
        "Use a strong password"
      ),
    rePassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
    dateOfBirth: yup.string().required("Date of birth is required"),
    gender: yup.string().required("Gender is required"),
  });

  // Initialize Formik for form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    validationSchema,
    onSubmit: registerForm,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        mt: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        background:
          "url('https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dark overlay for background contrast */}
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

      {/* Left section - info/welcome panel (hidden on small screens) */}
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
          {/* Welcome heading */}
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
            {t("JoinOurCommunity")}
          </Typography>
          {/* Welcome subtitle */}
          <Typography
            variant="body1"
            sx={{
              opacity: theme.palette.mode === "dark" ? 0.9 : 0.85,
            }}
          >
            {t("DiscoverAndConnectWithTheWorld")}
          </Typography>
        </Box>
      </Box>

      {/* Right section - registration form */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: { xs: 1, sm: 6, md: 8 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated container */}
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
            p: {xs:2, md:5},
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
            {/* Icon and form heading */}
            <Box textAlign="center" mb={3}>
              <PersonAddAlt
                sx={{
                  fontSize: 50,
                  color: theme.palette.primary.main,
                  mb: 1,
                  textShadow: "0 0 10px rgba(25,118,210,0.6)",
                }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
              >
                {t("CreateYourAccount")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.9 }}>
                {t("Joinnowandstart")}
              </Typography>
            </Box>

            {/* Registration form */}
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {/* Name field */}
              <TextField
                label={t("Name")}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: theme.palette.mode === "dark" ? "#f5f5f5" : "#111",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.mode === "dark" ? "#aaa" : "#555",
                    "&.Mui-focused": { color: "#fff" },
                  },
                  
                }}
              />

              {/* Email field */}
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
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: theme.palette.mode === "dark" ? "#f5f5f5" : "#111",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.mode === "dark" ? "#aaa" : "#555",
                    "&.Mui-focused": { color: "#fff" },
                  },
                }}
              />

              {/* Password and confirm password fields */}
              <Box sx={{ display: "flex", flexDirection:{xs:"column",md:"row"}, gap: 2 }}>
                <TextField
                  label={t("Password")}
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  fullWidth
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: theme.palette.mode === "dark" ? "#f5f5f5" : "#111",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: theme.palette.mode === "dark" ? "#aaa" : "#555",
                      "&.Mui-focused": { color: "#fff" },
                    },
                  }}
                />
                <TextField
                  label={t("ConfirmPassword")}
                  name="rePassword"
                  type="password"
                  value={formik.values.rePassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rePassword && Boolean(formik.errors.rePassword)}
                  helperText={formik.touched.rePassword && formik.errors.rePassword}
                  fullWidth
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: theme.palette.mode === "dark" ? "#f5f5f5" : "#111",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: theme.palette.mode === "dark" ? "#aaa" : "#555",
                      "&.Mui-focused": { color: "#fff" },
                    },
                  }}
                />
              </Box>

              {/* Date of birth field */}
              <TextField
                label={t("DateofBirth")}
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true, style: { color: "#ccc" } }}
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                fullWidth
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    color: theme.palette.mode === "dark" ? "#f5f5f5" : "#111",
                  },
                }}
              />

              {/* Gender radio buttons */}
              <RadioGroup
                row
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                sx={{ justifyContent: "center" }}
              >
                <FormControlLabel
                  sx={{ color: "#fff" }}
                  value="male"
                  control={<Radio sx={{ color: "#90caf9" }} />}
                  label={t("Male")}
                />
                <FormControlLabel
                  sx={{ color: "#fff" }}
                  value="female"
                  control={<Radio sx={{ color: "#f48fb1" }} />}
                  label={t("Female")}
                />
              </RadioGroup>

              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
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
                {/* Show loader when submitting */}
                {loading ? <CircularProgress size={24} color="inherit" /> : t("Register")}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
