"use client";
import React, { useState, useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {Box,FormHelperText,FormControl,InputLabel,Button,OutlinedInput,Typography,IconButton,InputAdornment,Paper, useTheme} from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setLoading, setToken } from "@/redux/authSlice";
import { UserContext } from "@/context/page";
import Head from 'next/head';
import { useTranslation } from "react-i18next";

export default function Login() {
  const { loading } = useSelector((store) => store.authReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
    const { t } = useTranslation();
  const { refreshUserProfile } = useContext(UserContext);  
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  // title
    useEffect(() => {
    document.title = "Login";
  }, []);


  const validationSchema = yup.object({
    email: yup
      .string()
      .required(t("Emailisrequired"))
      .email(t("Invalidemail"))
      .min(4, t("Min4characters"))
      .max(60, t("Max60characters")),
    password: yup
      .string()
      .required(t('Passwordisrequired'))
      .min(8, t("Min8characters"))
      .max(20, t("Max20characters"))
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
        t('Includeupperslowercasenumberspecialcharacter')
      ),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(setLoading(true));
      try {
        const { data } = await axios.post(
          "https://linked-posts.routemisr.com/users/signin",
          values
        );
        toast.success(data.message || "Login successful");
        localStorage.setItem("token", data.token);
        dispatch(setToken(data.token));
        refreshUserProfile(data.token); //  update data
        router.replace("/allPosts");
      } catch (err) {
        const errorMessage =
          err?.response?.data?.error || "Login failed. Please try again.";
        toast.error(errorMessage);
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2
      }}
    >
 
      <Paper
        elevation={6}
        sx={{
          width: { xs: "100%", sm: "80%", md: "50%", lg: "35%" },
          p: 4,
          borderRadius: 3,
                   bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa",

          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={1} color="primary">
        {t('WelcomeBack')}
        </Typography>
        <Typography variant="body2" mb={4} color="text.secondary">
          {t('Logintoexploreposts')}
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit}>
          {/* Email */}
          <FormControl
            fullWidth
            margin="normal"
            error={formik.touched.email && Boolean(formik.errors.email)}
          >
            <InputLabel>{t('EmailAddress')}</InputLabel>
            <OutlinedInput
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="email"
            />
            <FormHelperText>
              {formik.touched.email && formik.errors.email}
            </FormHelperText>
          </FormControl>

          {/* Password */}
          <FormControl
            fullWidth
            margin="normal"
            error={formik.touched.password && Boolean(formik.errors.password)}
          >
            <InputLabel>{t('Password')}</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>
              {formik.touched.password && formik.errors.password}
            </FormHelperText>
          </FormControl>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={!loading && <LoginIcon />}
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
            }}
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "16px" }}></i>
            ) : (
              t("Login")
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}