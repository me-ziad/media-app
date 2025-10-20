"use client";
import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton, Stack, Paper, useTheme } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { useTranslation } from "react-i18next";

export default function ProfileImageUploader() {
  // State to store the selected file and preview URL
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { t } = useTranslation(); // Translation function
  const theme = useTheme(); // MUI theme
  const [loading, setLoading] = useState(false); // Loading state for upload
  const router = useRouter(); // Next.js router

  // Set page title on mount
  useEffect(() => {
    document.title = "Profile Photo";
  }, []);

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file); // Save file to state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Generate preview
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file."); // Show error if not an image
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first"); // Ensure image is selected
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("No token found"); // Ensure user is authenticated
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedImage); // Append file to form data

    try {
      setLoading(true);
      // Send PUT request to update profile photo
      const { data } = await axios.put(
        "https://linked-posts.routemisr.com/users/upload-photo",
        formData,
        { headers: { token } }
      );

      toast.success(t("Photoupdatedsuccessfully")); // Show success message
      router.replace("/profile"); // Redirect to profile page
    } catch (err) {
      toast.error(t("Failedtoupdatephoto")); // Show error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
        maxWidth: 500,
        margin: "auto",
        mt: 20,
        mb: 3,
        background: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
      }}
    >
      <Stack spacing={3} alignItems="center">
        {/* Page title */}
        <Typography variant="h5" fontWeight="bold" color="primary">
          {t("UploadProfilePicture")}
        </Typography>

        {/* Avatar preview */}
        <Box position="relative">
          <Avatar
            src={preview || "/default-avatar.png"} // Show preview or default
            sx={{
              width: 120,
              height: 120,
              border: "3px solid #1976d2",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" }, // Slight zoom on hover
            }}
          />

          {/* Camera icon to select image */}
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#1976d2",
              color: "white",
              "&:hover": { background: "#115293" },
            }}
          >
            <PhotoCamera />
            {/* Hidden file input */}
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </IconButton>
        </Box>

        {/* Show selected file name */}
        {selectedImage && (
          <Typography variant="body2" color="text.secondary">
            {selectedImage.name}
          </Typography>
        )}

        {/* Upload button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedImage || loading} // Disable if no image or loading
          sx={{ px: 4 }}
        >
          {loading ? "Uploading..." : t("save")} {/* Show loading state */}
        </Button>
      </Stack>
    </Paper>
  );
}
