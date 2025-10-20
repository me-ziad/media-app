"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import AuthGuard from "../authGuard/page,"; // Protects route for authenticated users
import { useDispatch, useSelector } from "react-redux";
import { getComment, getPosts } from "@/redux/Posts";
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import Loading from "../loadingPosts/page"; // Component for loading spinner
import AllComment from "../allComment/page"; // Component to show all comments
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Head from "next/head";

export default function AllPosts() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Local states
  const [comId, setComId] = useState(null); // Selected post ID for comments
  const [modal, setModal] = useState(false); // Comment modal visibility
  const [modalImg, setModalImg] = useState(false); // Image modal visibility
  const [showImg, setShowImg] = useState(false); // Image to display in modal
  const [page, setPage] = useState(1); // Current pagination page

  // Redux store
  const { posts, loading } = useSelector((store) => store.postsReducer);
  const POSTS_PER_PAGE = 50; // Number of posts per page

  const totalPages = posts?.total ? Math.ceil(posts.total / POSTS_PER_PAGE) : 5;

  // Fetch posts whenever page changes
  useEffect(() => {
    const apiPage = totalPages - page + 1; // Adjust for backend pagination
    dispatch(getPosts({ limit: POSTS_PER_PAGE, page: apiPage }));
  }, [page, totalPages]);

  // Sort posts by creation date (newest first)
  const sortedPosts = posts?.posts
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Set document title
  useEffect(() => {
    document.title = "All posts";
  }, []);

  // Pagination handlers
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  // Open comment modal for specific post
  const handelModal = (id) => {
    dispatch(getComment(id)); // Fetch comments
    setModal(true);
    setComId(id);
  };

  // Open image modal
  const handelImage = (imgs) => {
    setShowImg(imgs);
    setModalImg(true);
  };

  return (
    <AuthGuard>
      {/* Page meta */}
      <Head>
        <meta name="description" content="All posts" />
      </Head>

      {/* Floating button to add a new post */}
      <Box sx={{ position: "fixed", bottom: 0, right: 0 }}>
        <SpeedDial
          ariaLabel="Add Post"
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}
          onClick={() => router.push("/addPost")}
        />
      </Box>

      {/* Loading spinner */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Posts Grid */}
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              mt: 12,
            }}
          >
            {sortedPosts?.map((item) => (
              <Card
                key={item.id}
                sx={{
                  width: { xs: "90%", sm: 500, md: 700 },
                  my: 2,
                  boxShadow: 4,
                  borderRadius: 3,
                  bgcolor:
                    theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa",
                }}
              >
                {/* Post header with user info */}
                <CardHeader
                  avatar={
                    <Avatar
                      alt={item.user?.name}
                      src={item.user?.photo}
                      sx={{ width: 45, height: 45 }}
                    />
                  }
                  title={<Typography fontWeight="bold">{item?.user?.name}</Typography>}
                  subheader={item?.createdAt?.split("T")?.[0] ?? ""}
                />

                {/* Post content */}
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {item?.body}
                  </Typography>
                </CardContent>

                {/* Post image */}
                {item?.image && (
                  <CardMedia
                    onClick={() => handelImage(item?.image)}
                    component="img"
                    height="300"
                    image={item?.image}
                    alt="post image"
                    sx={{ objectFit: "cover", cursor: "pointer" }}
                  />
                )}

                {/* Post actions */}
                <CardActions
                  sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 1 }}
                  disableSpacing
                >
                  <IconButton onClick={() => handelModal(item.id)} aria-label="comment">
                    <InsertCommentIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Grid>

          {/* Pagination controls */}
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
              zIndex: 999,
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              borderRadius: "30px",
              px: 3,
              py: 1,
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handlePrevPage}
              disabled={page === 1}
              sx={{ bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5", "&:hover": { bgcolor: "#ddd" } }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: 12, md: 14 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span>{t("page")}</span>
              <span> {page}</span>
            </Typography>

            <IconButton
              onClick={handleNextPage}
              sx={{ bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5", "&:hover": { bgcolor: "#ddd" } }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </>
      )}

      {/* Comment modal */}
      {modal && (
        <>
          <div className="backdrop" onClick={() => setModal(false)} />
          <Box sx={{ bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5" }}>
            <AllComment id={comId} setModal={setModal} />
          </Box>
        </>
      )}

      {/* Image modal */}
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
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking on image
          >
            <IconButton
              onClick={() => setModalImg(false)}
              sx={{
                position: "absolute",
                top: 20,
                right: 25,
                color: "#fff",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                zIndex: 5,
              }}
            >
              <CloseIcon />
            </IconButton>

            <img
              src={showImg}
              alt="Post Image"
              style={{
                width: "80%",
                height: "80%",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          </Box>
        </Box>
      )}
    </AuthGuard>
  );
}
