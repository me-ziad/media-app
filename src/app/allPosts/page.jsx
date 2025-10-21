"use client"; // Mark this component as a client-side component
export const dynamic = "force-dynamic"; // Force Next.js to treat this page as dynamic

import React, { useEffect, useState } from "react";
import AuthGuard from "../authGuard/page,"; // Protect the page with authentication
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { getComment, getPosts } from "@/redux/Posts"; // Redux actions
import {Grid,Card,CardHeader,CardMedia,CardContent,CardActions,Avatar,IconButton,Typography,Box,useTheme,} from "@mui/material"; // Material UI components
import InsertCommentIcon from "@mui/icons-material/InsertComment"; // Comment icon
import Loading from "../loadingPosts/page"; // Loading spinner component
import AllComment from "../allComment/page"; // Component to display all comments
import CloseIcon from "@mui/icons-material/Close"; // Close icon for modals
import SpeedDial from "@mui/material/SpeedDial"; // Floating action button
import SpeedDialIcon from "@mui/material/SpeedDialIcon"; // SpeedDial icon
import EditIcon from "@mui/icons-material/Edit"; // Edit icon
import { useRouter } from "next/navigation"; // Next.js router
import Head from "next/head"; // Head component to manage meta tags
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"; // Slider prev arrow icon
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Slider next arrow icon
import Slider from "react-slick"; // Slider/carousel component
import "slick-carousel/slick/slick.css"; // Slider CSS
import "slick-carousel/slick/slick-theme.css"; // Slider theme CSS

// Custom Next Arrow for react-slick to avoid DOM prop warnings
const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      sx={{
        position: "absolute",
        top: "50%",
        right: { md: "-40px" },
        transform: "translateY(-50%)",
        zIndex: 3,
        bgcolor: "rgba(255,255,255,0.95)",
        width: 45,
        height: 45,
        borderRadius: "50%",
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.25s ease",
        "&:hover": {
          bgcolor: "#1976d2",
          "& svg": { color: "#fff" },
        },
      }}
      onClick={onClick} // Click handler
    >
      <ArrowForwardIosIcon
        sx={{
          fontSize: 22,
          position: "relative",
          right: "10px",
          top: "0px",
          color: "#1976d2",
        }}
      />
    </Box>
  );
};

// Custom Previous Arrow for react-slick
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      sx={{
        position: "absolute",
        top: "50%",
        left: { md: "-40px" },
        transform: "translateY(-50%)",
        zIndex: 3,
        bgcolor: "rgba(255, 255, 255, 1)",
        width: 45,
        height: 45,
        borderRadius: "50%",
        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.25s ease",
        "&:hover": {
          bgcolor: "#0281ffff",
          "& svg": { color: "#fff" },
        },
      }}
      onClick={onClick} // Click handler
    >
      <ArrowBackIosNewIcon
        sx={{
          fontSize: 22,
          position: "relative",
          right: "10px",
          top: "0px",
          color: "#1976d2",
        }}
      />
    </Box>
  );
};

// Main component for displaying all posts
export default function AllPosts() {
  const theme = useTheme(); // Get Material UI theme
  const router = useRouter(); // Next.js router
  const dispatch = useDispatch(); // Redux dispatch

  // State variables
  const [comId, setComId] = useState(null); // Current comment ID
  const [modal, setModal] = useState(false); // Comment modal visibility
  const [modalImg, setModalImg] = useState(false); // Image modal visibility
  const [showImg, setShowImg] = useState(false); // Image to display
  const [page, setPage] = useState(1); // Pagination page

  const { posts, loading } = useSelector((store) => store.postsReducer); // Get posts from Redux store

  // Fetch posts when component mounts or page changes
  useEffect(() => {
    dispatch(getPosts({ page, limit: 40 }));
  }, [dispatch, page]);

  // Set page title
  useEffect(() => {
    document.title = "All posts";
  }, []);

  // Open comment modal and fetch comments
  const handelModal = (id) => {
    dispatch(getComment(id));
    setModal(true);
    setComId(id);
  };

  // Open image modal
  const handelImage = (imgs) => {
    setShowImg(imgs);
    setModalImg(true);
  };

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    arrows: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 900, settings: { slidesToShow: 4 } },
      { breakpoint: 600, settings: { slidesToShow: 3 } },
    ],
  };

  return (
    <AuthGuard> {/* Protect content with authentication */}
      <Head>
        <meta name="description" content="All posts" /> {/* SEO meta tag */}
      </Head>

      {/* Floating Add Post Button */}
      <Box sx={{ position: "fixed", bottom: 0, right: 0 }}>
        <SpeedDial
          ariaLabel="Add Post"
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}
          onClick={() => router.push("/addPost")} // Navigate to add post page
        />
      </Box>

      {/* Display loading spinner if posts are loading */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Stories slider section */}
          <Box
            sx={{
              width: "90%",
              m: "auto",
              mt: 12,
              px: { xs: 1, sm: 4 },
              mb: 6,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                textAlign: "center",
                color: theme.palette.primary.main,
                letterSpacing: 0.5,
              }}
            >
              Stories
            </Typography>

            {/* Slider component */}
            <Slider
              dots={false}
              infinite={false}
              speed={600}
              slidesToShow={5}
              slidesToScroll={3}
              arrows={true}
              nextArrow={<CustomNextArrow />} // Custom next arrow
              prevArrow={<CustomPrevArrow />} // Custom previous arrow
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 4 } },
                { breakpoint: 900, settings: { slidesToShow: 3 } },
                { breakpoint: 600, settings: { slidesToShow: 2 } },
              ]}
            >
              {/* Add Story Box */}
              {loading ? null : (
                <Box sx={{ px: 2 }}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "18px",
                      overflow: "hidden",
                      cursor: "pointer",
                      height: 230,
                      minWidth: 140,
                      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0px 8px 15px rgba(0,0,0,0.25)",
                      },
                    }}
                    onClick={() => router.push("/addPost")}
                  >
                    {/* Plus icon */}
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        mt: 1,
                        ml: 1,
                        bgcolor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#1976d2",
                          fontSize: 35,
                          fontWeight: "bold",
                          lineHeight: 0.8,
                        }}
                      >
                        +
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontWeight: "bold", fontSize: "0.9rem", ml: 1 }}
                    >
                      Add Story
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Map through first 10 posts to show as stories */}
              {posts?.posts?.slice(0, 10)?.map((item) => (
                <Box key={item._id} sx={{ px: 2 }}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "18px",
                      overflow: "hidden",
                      cursor: "pointer",
                      height: 230,
                      minWidth: 140,
                      backgroundImage: item?.image
                        ? `url(${item.image})`
                        : "linear-gradient(135deg, #1976d2, #42a5f5)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0px 8px 15px rgba(0,0,0,0.25)",
                      },
                    }}
                    onClick={() => handelModal(item._id)} // Open comment modal
                  >
                    {/* User avatar */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        borderRadius: "50%",
                        border: "3px solid #1976d2",
                        width: 45,
                        height: 45,
                        overflow: "hidden",
                        bgcolor: "#fff",
                      }}
                    >
                      <img
                        src={item?.user?.photo}
                        alt={item?.user?.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>

                    {/* Post text */}
                    {item?.body && (
                      <Typography
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 10,
                          left: 65,
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          color: "#fff",
                          textShadow: "0 0 5px rgba(0,0,0,0.7)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item?.body}
                      </Typography>
                    )}

                    {/* User name */}
                    <Typography
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        left: 12,
                        right: 12,
                        fontWeight: "bold",
                        color: "#fff",
                        textShadow: "0 0 5px rgba(0,0,0,0.7)",
                        fontSize: "0.9rem",
                        textAlign: "left",
                      }}
                    >
                      {item?.user?.name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>

          {/* Grid for all posts */}
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Map through all posts */}
            {posts?.posts?.map((item) => (
              <Card
                key={item._id}
                sx={{
                  width: { xs: "90%", sm: 500, md: 700 },
                  my: 2,
                  boxShadow: 4,
                  borderRadius: 3,
                  bgcolor:
                    theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa",
                }}
              >
                {/* Card header with avatar and username */}
                <CardHeader
                  avatar={
                    <Avatar
                      alt={item.user?.name}
                      src={item.user?.photo}
                      sx={{ width: 45, height: 45 }}
                    />
                  }
                  title={
                    <Typography fontWeight="bold">{item?.user?.name}</Typography>
                  }
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
                    onClick={() => handelImage(item?.image)} // Open image modal
                    component="img"
                    height="300"
                    image={item?.image}
                    alt="post image"
                    sx={{ objectFit: "cover", cursor: "pointer" }}
                  />
                )}

                {/* Comment button */}
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    my: 1,
                  }}
                  disableSpacing
                >
                  <IconButton
                    onClick={() => handelModal(item._id)}
                    aria-label="comment"
                  >
                    <InsertCommentIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Grid>

          {/* Pagination component */}
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              borderRadius: "30px",
              px: 3,
              py: 1,
              zIndex: 1000,
            }}
          >
            <IconButton
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))} // Previous page
              disabled={page === 1}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <Typography fontWeight="bold">{page}</Typography> {/* Current page */}

            <IconButton
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, posts?.totalPages || prev)) // Next page
              }
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </>
      )}

      {/* Comment Modal */}
      {modal && (
        <>
          <div className="backdrop" onClick={() => setModal(false)} /> {/* Overlay */}
          <Box
            sx={{
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
            }}
          >
            <AllComment id={comId} setModal={setModal} /> {/* Comments component */}
          </Box>
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
          }}
          onClick={() => setModalImg(false)} // Close modal on backdrop click
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
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on image
          >
            <IconButton
              onClick={() => setModalImg(false)} // Close button
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
