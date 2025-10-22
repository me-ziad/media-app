"use client";
export const dynamic = "force-dynamic";

import React, { useContext, useEffect, useState } from "react";
import {
  Grid, Box, Typography, Card, CardHeader, CardContent, CardMedia,
  CardActions, IconButton, Fade, Avatar, AvatarGroup, SpeedDial,
  SpeedDialIcon, Button, useTheme, Divider, Zoom,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "@/context/page";
import { getComment, userPosts } from "@/redux/Posts";
import AllComment from "../allComment/page";
import AuthGuard from "../authGuard/page,";
import Loading from "../loadingPosts/page";
import { useTranslation } from "react-i18next";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Profile() {
  // Get user profile and refresh function from context
  const { userProfile, refreshUserProfile, load } = useContext(UserContext);
  
  // Get user's posts from redux store
  const { userPost } = useSelector((store) => store.postsReducer);
  
  // Local state to store decoded token data
  const [tokenData, setTokenData] = useState(null);
  
  const { t } = useTranslation(); // Translation function
  
  // Modal states for comments and images
  const [modal, setModal] = useState(false);
  const [comId, setComId] = useState(null);
  const [modalImg, setModalImg] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  // Get auth token from redux
  const { token } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();

  // Set document title on mount
  useEffect(() => {
    document.title = "Profile";
  }, []);
  
     // Load data from localStorage as soon as the component starts
      useEffect(() => {
        const savedLikes = JSON.parse(localStorage.getItem("likedPosts")) || [];
        setLikedPosts(savedLikes);
      }, []);
  
      // Update localStorage on change
      useEffect(() => {
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      }, [likedPosts]);
  
      // Function to toggle the like state
      const toggleLike = (postId) => {
        setLikedPosts((prev) =>
          prev.includes(postId)
            ? prev.filter((id) => id !== postId)
            : [...prev, postId]
        );
      };

  // Decode token and fetch user posts/profile
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setTokenData(decoded);
      dispatch(userPosts(decoded.user)); // Fetch user's posts
      refreshUserProfile(); // Refresh user profile
    }
  }, [token, dispatch]);

  // Open comments modal
  const handleModal = (id) => {
    dispatch(getComment(id)); // Fetch comments for post
    setModal(true);
    setComId(id);
  };

  // Delete a post
  const deletePost = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Token not found");
      await axios.delete(`https://linked-posts.routemisr.com/posts/${id}`, {
        headers: { token },
      });
      const decoded = jwtDecode(token);
      dispatch(userPosts(decoded.user)); // Refresh posts after deletion
      refreshUserProfile(); // Refresh profile after deletion
      toast.success(t("Postdeleted")); // Show success toast
    } catch {
      toast.error(t("Failedtodelete")); // Show error toast
    }
  };

  // Open image modal
  const handelImage = (img) => {
    setShowImg(img);
    setModalImg(true);
  };

  return (
    <AuthGuard>
      {/* Floating Add Post Button */}
      <Fade in timeout={500}>
        <Box sx={{ position: "fixed", bottom: 16, right: { xs: 15, md: 24 }, zIndex: 999 }}>
          <SpeedDial
            ariaLabel="Add Post"
            icon={<SpeedDialIcon openIcon={<EditIcon />} />}
            onClick={() => router.push("/addPost")} // Navigate to add post page
            FabProps={{
              sx: {
                bgcolor: theme.palette.primary.main,
                "&:hover": { bgcolor: theme.palette.primary.dark },
              },
            }}
          />
        </Box>
      </Fade>

      {/* Show loading spinner if profile is loading */}
      {load ? (
        <Loading />
      ) : (
        <Grid container justifyContent="center" sx={{ mt: 10, px: { xs: 2, md: 0 } }}>
          {/* Profile Card */}
          <Card
            sx={{
              width: { xs: "100%", md: 1200 },
              borderRadius: 4,
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              bgcolor: theme.palette.mode === "dark" ? "rgba(30,30,30,0.85)" : "rgba(255,255,255,0.9)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {/* Cover Image */}
            <Box
              component="img"
              src={userProfile?.cover || userProfile?.photo} // Fallback to profile photo if no cover
              alt="cover"
              sx={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { opacity: 0.85 },
              }}
              onClick={() => router.push("/profilePhoto")} // Navigate to profile photo page
            />

            {/* Profile Info Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", px: 3, mt: -8 }}>
              {/* Profile Avatar */}
              <Avatar
                src={userProfile?.photo}
                alt="profile"
                onClick={() => router.push("/profilePhoto")}
                sx={{
                  width: 120,
                  height: 120,
                  border: "5px solid",
                  borderColor: theme.palette.background.paper,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                  cursor: "pointer",
                }}
              />
              <Box sx={{ textAlign: "right" }}>
                <Typography fontSize={22} fontWeight={700}>
                  {userProfile?.name} {/* User name */}
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  {userProfile?.dateOfBirth} {/* User DOB */}
                </Typography>
                <AvatarGroup max={4} sx={{ justifyContent: "end", mt: 1 }}>
                  {/* Example friend avatars */}
                  <Avatar src="/static/images/avatar/1.jpg" />
                  <Avatar src="/static/images/avatar/2.jpg" />
                  <Avatar src="/static/images/avatar/4.jpg" />
                  <Avatar src="/static/images/avatar/5.jpg" />
                </AvatarGroup>
              </Box>
            </Box>

            <Divider sx={{ my: 3, opacity: 0.2 }} />

            {/* Bio / Description */}
            <Box sx={{ px: 3, pb: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {userProfile?.bio || "Welcome to my profile! Sharing my thoughts and moments here 🚀"}
              </Typography>
            </Box>
          </Card>
        </Grid>
      )}

      {/* User Posts Section */}
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 6 }}>
        {/* If user has no posts */}
        {userPost?.posts?.length === 0 ? <>
        {load ? '':
          <Box
            sx={{
              mt: 1,
              textAlign: "center",
              bgcolor: theme.palette.mode === "dark" ? "rgba(30,30,30,0.85)" : "#fff",
              p: 4,
              borderRadius: 4,
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              width: { xs: "90%", md: 900 },
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={2}>
              {t("Therearenopostsyet")}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3} sx={{ textAlign: "center", opacity: 0.8 }}>
              {t("Shareyour")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/addPost")}
              sx={{ textTransform: "none", borderRadius: 2, px: 4, py: 1, fontWeight: 600 }}
            >
              {t("Createyourfirstpost")}
            </Button>
          </Box>
        }  
        </> : (
          // Map over posts and display each post
          [...(userPost?.posts ?? [])].reverse().map((item, i) => (
            <Zoom in key={item._id} style={{ transitionDelay: `${i * 100}ms` }}>
              <Card
                sx={{
                  width: { xs: "90%", md: 700 },
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.1)",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(40,40,40,0.9)" : "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardHeader
                  avatar={<Avatar src={item.user?.photo} />} // Post author avatar
                  action={
                    <IconButton onClick={() => deletePost(item.id)}>
                      <DeleteIcon color="error" /> {/* Delete post button */}
                    </IconButton>
                  }
                  title={<Typography fontWeight={600}>{item?.user?.name}</Typography>}
                  subheader={<Typography variant="caption" color="text.secondary">{item?.createdAt?.split("T")[0]}</Typography>}
                />

                {/* Post Image */}
                {item?.image && (
                  <CardMedia
                    onClick={() => handelImage(item?.image)} // Open image modal
                    component="img"
                    height="400"
                    image={item.image}
                    alt="post image"
                    sx={{ objectFit: "cover", cursor: "pointer", transition: "0.3s", "&:hover": { transform: "scale(1.02)" } }}
                  />
                )}

                {/* Post Body */}
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    {item.body}
                  </Typography>
                </CardContent>

                <Divider sx={{ opacity: 0.1 }} />
                  
                {/* Comments Button */}
                <CardActions sx={{ justifyContent: "center" }}>
                    {/* Like button */}
                <IconButton onClick={() => toggleLike(item._id)} aria-label="like">
                  <FavoriteIcon
                    sx={{
                      fontSize:36,
                      color: likedPosts.includes(item._id) ? "#1976d2" : "#fff",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.2)",
                      },
                    }}
                  />
                </IconButton>
                  <IconButton onClick={() => handleModal(item.id)}>
                    <InsertCommentIcon sx={{ fontSize:31}}/> {/* Open comments modal */}
                  </IconButton>
                </CardActions>
              </Card>
            </Zoom>
          ))
        )}
      </Grid>

      {/* Comments Modal */}
      {modal && (
        <>
          <div className="backdrop" onClick={() => setModal(false)} /> {/* Background overlay */}
          <AllComment id={comId} setModal={setModal} /> {/* Comments component */}
        </>
      )}

      {/* Image Modal */}
      {modalImg && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            bgcolor: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease",
            "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
          onClick={() => setModalImg(false)}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              bgcolor: "#000",
            }}
            onClick={(e) => e.stopPropagation()}  // Prevent closing modal when clicking image
          >
            {/* Close button */}
            <IconButton
              onClick={() => setModalImg(false)}
              sx={{ position: "absolute", top: 20, right: 25, color: "#fff", bgcolor: "rgba(0,0,0,0.5)", "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }, zIndex: 5 }}
            >
              <CloseIcon />
            </IconButton>

            {/* Full size image */}
            <img
              src={showImg}
              alt="Post Image"
              style={{ width: "80%", height: "80%", objectFit: "contain", objectPosition: "center", display: "block" }}
            />
          </Box>
        </Box>
      )}
    </AuthGuard>
  );
}
