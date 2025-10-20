'use client';
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Box, Typography, Avatar, TextField, Button, IconButton, Paper, Stack, useTheme,
} from "@mui/material";
import {
  Close, Image as ImageIcon, LocationOn, EmojiEmotions, WhatsApp,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/page";
import toast from "react-hot-toast";
import axios from "axios";
import AuthGuard from "../authGuard/page,";
import { useTranslation } from "react-i18next";

const AddPost = () => {
  // State for image preview and loading indicator
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter(); // Next.js router
  const { userProfile } = useContext(UserContext); // Get logged-in user data
  const { t } = useTranslation(); // Translation function
  const theme = useTheme(); // MUI theme
  const fileInputRef = useRef(null); // Ref to hidden file input

  // Set page title on mount
  useEffect(() => {
    document.title = "Add post";
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result); // Set preview
      reader.readAsDataURL(file);
    } else {
      toast.error(t("Pleaseselectavalidimagefile")); // Show error if not an image
    }
  };

  // Trigger hidden file input
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  async function handelSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    const body = form.body.value;
    const image = form.image.files[0];

    // Validate image type
    if (image && !image.type.startsWith("image/")) {
      toast.error(t("Pleaseselectavalidimagefile"));
      return;
    }

    formData.append("body", body);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        toast.error("No token found!"); // Show error if token missing
        setLoading(false);
        return;
      }

      // Send POST request to create a new post
      await axios.post("https://linked-posts.routemisr.com/posts", formData, {
        headers: { token },
      });

      toast.success(t("Postaddedsuccessfully")); // Show success message
      router.replace("/allPosts"); // Redirect to all posts page
    } catch {
      toast.error(t("FailedtocreatepostTryagain")); // Show failure message
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  return (
    <AuthGuard>
      {/* Container for the page */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: 6,
          px: 2,
          mt: 10,
          background: theme.palette.mode === "dark" ? "#121212" : "#f0f2f5",
        }}
      >
        {/* Paper card containing the form */}
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: imagePreview ? 1000 : 800, // Expand if image preview exists
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header with title and close button */}
          <Box
            sx={{
              position: "relative",
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              py: 3,
              px: 4,
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {t("createyourpost")} {/* Page heading */}
            </Typography>
            <IconButton
              onClick={() => router.push("/profile")} // Close and go back to profile
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: "#f44336",
                "&:hover": { bgcolor: "#d32f2f" },
                color: "#fff",
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Form Section */}
          <Box
            component="form"
            onSubmit={handelSubmit}
            sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, p: 4, gap: 3 }}
          >
            {/* Left side - text input and icons */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              {/* User info */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={userProfile?.photo} // Show user's avatar
                  sx={{ width: 60, height: 60, border: "2px solid #1976d2" }}
                />
                <Box>
                  <Typography fontWeight={600}>{userProfile?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posting to: <strong style={{ color: "#1976d2" }}>Public</strong>
                  </Typography>
                </Box>
              </Stack>

              {/* Textarea for post content */}
              <TextField
                multiline
                rows={6}
                fullWidth
                name="body"
                placeholder={`💬 What's on your mind, ${userProfile?.name}?`}
                variant="outlined"
                sx={{ borderRadius: 2, "& .MuiOutlinedInput-root": { px: 2, py: 1.5 } }}
              />

              {/* Hidden file input */}
              <input
                type="file"
                id="image-upload"
                name="image"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange} // Handle image selection
              />

              {/* Action icons */}
              <Stack direction="row" spacing={1}>
                <IconButton onClick={openFilePicker}><EmojiEmotions /></IconButton>
                <IconButton onClick={openFilePicker}><WhatsApp /></IconButton>
                <IconButton onClick={openFilePicker}><LocationOn /></IconButton>
                <IconButton onClick={openFilePicker}><ImageIcon /></IconButton>
              </Stack>

              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: 2,
                  background: "#1976d2",
                  color: "#fff",
                  textTransform: "uppercase",
                  "&:hover": { background: "#1976d2" },
                }}
              >
                {loading ? t("Uploading") : t("Post")} {/* Show uploading state */}
              </Button>
            </Box>

            {/* Right side - image preview */}
            {imagePreview && (
              <Box
                sx={{
                  width: { xs: "100%", md: 350 },
                  borderRadius: 3,
                  overflow: "hidden",
                  alignSelf: "flex-start",
                }}
              >
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    height: 350,
                    objectFit: "cover",
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </AuthGuard>
  );
};

export default AddPost;
