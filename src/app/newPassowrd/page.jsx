"use client";

import React, { useEffect } from "react";
import {Box,Button,FormControl,FormHelperText,InputAdornment,InputLabel,OutlinedInput,Paper,Typography} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { setLoading, setToken } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, token } = useSelector((state) => state.authReducer);
  const { t} = useTranslation();
  const headers = { token };
  // title
  useEffect(() => {
    document.title = "New Password";
  }, []);

  const validationSchema = yup.object({
    password: yup.string().required(t("Currentpasswordisrequired")),
    newPassword: yup
      .string()
      .required(t('Newpasswordisrequired'))
      .min(8, t("Atleast8characters"))
      .max(20, t("Max20characters"))
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
        t("Includeupperslowercasenumberspecialcharacter")
      ),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        const { data } = await axios.patch(
          "https://linked-posts.routemisr.com/users/change-password",
          values,
          {
            headers,
          }
        );
        toast.success(t("Passwordupdatedsuccessfully"));
        dispatch(setToken(data.token));
        router.replace("/");
      } catch (err) {
        toast.error(
          err?.response?.data?.message || t("Incorrectpasswordorerroroccurred")
        );
        dispatch(setLoading(false));
      }
    },
  });

  return (
 
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 8,
          p: 3,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
            {t('ChangeYourPassword')}
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <FormControl
              fullWidth
              margin="normal"
              error={formik.touched.password && Boolean(formik.errors.password)}
            >
              <InputLabel>{t('CurrentPassword')}</InputLabel>
              <OutlinedInput
                type="password"
                name="password"
                label={t('CurrentPassword')}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormHelperText>
                {formik.touched.password && formik.errors.password}
              </FormHelperText>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              error={
                formik.touched.newPassword &&
                Boolean(formik.errors.newPassword)
              }
            >
              <InputLabel>{t('NewPassword')}</InputLabel>
              <OutlinedInput
                type="password"
                name="newPassword"
                label="New Password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <VisibilityOff color="disabled" />
                  </InputAdornment>
                }
              />
              <FormHelperText>
                {formik.touched.newPassword && formik.errors.newPassword}
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                t("UpdatePassword")
              )}
            </Button>
          </form>
        </Paper>
      </Box>
     
  );
}
