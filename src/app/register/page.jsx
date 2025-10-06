"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box, FormHelperText, FormControl, InputLabel,
  Button, OutlinedInput, Typography, RadioGroup,
  Radio, FormControlLabel, Paper, TextField,
  useTheme
} from "@mui/material";
import { PersonAdd, HowToReg } from "@mui/icons-material";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslation();

  // title
  useEffect(() => {
    document.title = "Register";
  }, []);

  async function registerForm(values) {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );
      toast.success(data.message);
      setLoading(false);
      router.push("/login");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  }

  const validationSchema = yup.object({
    name: yup.string().required(t("Nameisrequired")).min(3, t("Min3characters")).max(15, t("Max15characters")),
    email: yup.string().required(t("Emailisrequired")).email(t('Invalidemail')).max(60, t("Max60characters")),
    password: yup.string().required(t("Passwordisrequired")).min(8, t("Min8characters")).max(20, t("Max20characters"))
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/, t("UseastrongpasswordlikeZiad42512")),
    rePassword: yup.string().required(t("Confirmyourpassword"))
      .oneOf([yup.ref("password")], t("Passwordsmustmatch")),
    dateOfBirth: yup.string().required(t("Dateofbirthisrequired")),
    gender: yup.string().required(t("Genderisrequired")),
  });

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
         display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        mt:3
      }}
    >
   
 
      <Paper elevation={5} sx={{
        width: { xs: "90%", sm: "80%", md: "55%", lg: "40%" },
        p: 4,
        borderRadius: 3,
                   bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa",
      }}>
        <Typography variant="h5" textAlign="center" fontWeight="bold" color="primary">
          {t('CreateYourAccount')}  
        </Typography>
        <Typography variant="body2" textAlign="center" mt={1} mb={3} color="text.secondary">
          {t('Joinnowandstart')}.
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit}>
          {/* Name */}
          <FormControl fullWidth margin="normal" error={formik.touched.name && Boolean(formik.errors.name)}>
            <InputLabel>{t('Name')}</InputLabel>
            <OutlinedInput
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormHelperText>{formik.touched.name && formik.errors.name}</FormHelperText>
          </FormControl>

          {/* Email */}
          <FormControl fullWidth margin="normal" error={formik.touched.email && Boolean(formik.errors.email)}>
            <InputLabel>{t('Email')}</InputLabel>
            <OutlinedInput
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormHelperText>{formik.touched.email && formik.errors.email}</FormHelperText>
          </FormControl>

          {/* Password */}
          <FormControl fullWidth margin="normal" error={formik.touched.password && Boolean(formik.errors.password)}>
            <InputLabel>{t('Password')}</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormHelperText>{formik.touched.password && formik.errors.password}</FormHelperText>
          </FormControl>

          {/* RePassword */}
          <FormControl fullWidth margin="normal" error={formik.touched.rePassword && Boolean(formik.errors.rePassword)}>
            <InputLabel>{t('ConfirmPassword')}</InputLabel>
            <OutlinedInput
              id="rePassword"
              name="rePassword"
              label="Confirm Password"
              type="password"
              value={formik.values.rePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormHelperText>{formik.touched.rePassword && formik.errors.rePassword}</FormHelperText>
          </FormControl>

          {/* Birth Date */}
          <TextField
            fullWidth
            margin="normal"
            id="dateOfBirth"
            name="dateOfBirth"
            label={t("DateofBirth")}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.dateOfBirth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
          />

          {/* Gender */}
          <FormControl sx={{ mt: 2 }} error={formik.touched.gender && Boolean(formik.errors.gender)}>
            <RadioGroup row name="gender" value={formik.values.gender} onChange={formik.handleChange}>
              <FormControlLabel value="male" control={<Radio />} label={t("Male")} />
              <FormControlLabel value="female" control={<Radio />} label={t("Female")} />
            </RadioGroup>
            <FormHelperText>{formik.touched.gender && formik.errors.gender}</FormHelperText>
          </FormControl>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={!loading && <PersonAdd />}
            sx={{
              mt: 3,
              fontWeight: "bold",
              fontSize: "1rem",
              py: 1.5,
              textTransform: "none",
            }}
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "17px" }}></i>
            ) : (
              "Register"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}