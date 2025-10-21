"use client"; // Mark this component as client-side
export const dynamic = "force-dynamic"; // Force dynamic rendering
import React, { useEffect, useState, memo } from "react";
import {Box,Typography,Avatar,IconButton,TextField,Button,List,ListItem,ListItemAvatar,ListItemText,Fade,CardMedia,useTheme,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getComment } from "@/redux/Posts";
import { useTranslation } from "react-i18next";
import LoadingComment from "../LoadingComment/page";
import AuthGuard from "../authGuard/page,";

/* ---------------------- CommentsList ---------------------- */
// Memoized component to display list of comments
const CommentsList = memo(({ id }) => {
  const dispatch = useDispatch();
  const { comment, loadingComment } = useSelector((s) => s.postsReducer);
  const theme = useTheme();
  const { t } = useTranslation();

  // Fetch comments when component mounts or id changes
  useEffect(() => {
    dispatch(getComment(id));
  }, [id, dispatch]);

  if (loadingComment)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <LoadingComment /> {/* Loading spinner */}
      </Box>
    );

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        px: 2,
        py: 1,
        minHeight: 0,
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(150,150,150,0.4)",
          borderRadius: 3,
        },
      }}
    >
      {/* Comments count */}
      <Typography
        variant="subtitle2"
        sx={{
          my: 1,
          fontWeight: 600,
          color: theme.palette.mode === "dark" ? "#e0e0e0" : "#444",
        }}
      >
         {comment?.comments?.length ?? 0} {t("comments")}
      </Typography>

      <List sx={{ p: 0 }}>
        {[...(comment?.comments ?? [])].reverse().map((c) => (
          <Fade in key={c._id}>
            <ListItem
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
              }}
            >
              {/* Comment creator avatar */}
              <ListItemAvatar>
                <Avatar src={c?.commentCreator?.photo} />
              </ListItemAvatar>

              {/* Comment text */}
              <ListItemText
                primary={
                  <Typography fontWeight={600}>
                    {c?.commentCreator?.name}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.mode === "dark" ? "#aaa" : "#555",
                    }}
                  >
                    {c?.content}
                  </Typography>
                }
              />

              {/* Comment date */}
              <Typography
                variant="caption"
                sx={{ color: "#999", mt: "auto", ml: 1 }}
              >
                {c?.createdAt?.split("T")[0]}
              </Typography>
            </ListItem>
          </Fade>
        ))}
      </List>
    </Box>
  );
});

/* ---------------------- Main Modal ---------------------- */
export default function AllComment({ id, setModal }) {
  const [loadingSend, setLoadingSend] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const { t } = useTranslation();
  const { comment, loadingComment } = useSelector((s) => s.postsReducer);
  const dispatch = useDispatch();
  const theme = useTheme();

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = commentValue.trim();
    if (!value) return toast.error(t("Writeacommentbeforesending"));
    try {
      setLoadingSend(true);
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Token not found");

      await axios.post(
        "https://linked-posts.routemisr.com/comments",
        { content: value, post: id },
        { headers: { token } }
      );

      toast.success(t("Commentadded"));
      setCommentValue("");
      dispatch(getComment(id));
    } catch {
      toast.error(t("Failedtosendcomment"));
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <AuthGuard>
      {/* Modal backdrop */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={() => setModal(false)}
          sx={{
            position: "absolute",
            top: 20,
            right: 30,
            color: "#fff",
            zIndex: 3,
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        {/* Main modal container */}
        <Fade in>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: { xs: "95%", md: "85%", lg: "75%" },
              height: { xs: "95%", md: "80%" },
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(25,25,25,0.95)"
                  : "rgba(255,255,255,0.9)",
              position: "relative",
            }}
          >
            {/* LEFT IMAGE SECTION */}
            <Box
              sx={{
                position: "relative",
                flex: 1,
                height: { xs: 300, md: "100%" },
                bgcolor: "#000",
              }}
            >
              {/* Show placeholder image if no image */}
              <CardMedia
                component="img"
                image={
                  comment?.image
                    ? comment.image
                    : "https://via.placeholder.com/600x800?text=No+Image+Available"
                }
                alt={comment?.image ? "Post" : "No Image Available"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />

              {/* Overlay info for small screens */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  bgcolor: "rgba(0,0,0,0.65)",
                  p: 2,
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar src={comment?.user?.photo} />
                  <Box>
                    <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                      {comment?.user?.name}
                    </Typography>
                    <Typography sx={{ color: "#ccc", fontSize: 12 }}>
                      {comment?.createdAt?.split("T")[0]}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 14, mt: 0.5, color: "#e0e0e0" }}>
                  {comment?.body}
                </Typography>
              </Box>
            </Box>

            {/* RIGHT COMMENTS SECTION */}
            <Box
              sx={{
                flex: 1.1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(30,30,30,0.95)"
                    : "rgba(255,255,255,0.98)",
                color: theme.palette.mode === "dark" ? "#f5f5f5" : "#222",
              }}
            >
              {/* Post info for md+ */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  display: { xs: "none", md: "block" },
                  flexShrink: 0,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar src={comment?.user?.photo} />
                  <Box>
                    <Typography fontWeight={600}>
                      {comment?.user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comment?.createdAt?.split("T")[0]}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    mt: 1.5,
                    fontSize: 15,
                    color: theme.palette.mode === "dark" ? "#ccc" : "#444",
                  }}
                >
                  {comment?.body}
                </Typography>
              </Box>

              {/* Comments list */}
              <CommentsList id={id} />

              {/* Comment input for md+ */}
              {!loadingComment && (
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    gap: 1,
                    p: 2,
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(245,245,245,0.9)",
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    placeholder={t("Writeyourcommenthere")}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 3,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.08)"
                          : "#fff",
                      "& .MuiOutlinedInput-root fieldset": { border: "none" },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={
                      loadingSend ? (
                        <i className="fa-solid fa-spinner fa-spin" />
                      ) : (
                        <SendIcon />
                      )
                    }
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    {t("send")}
                  </Button>
                </Box>
              )}
            </Box>

            {/* Fixed input for xs/sm */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1,
                position: "fixed",
                bottom: 15,
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(40,40,40,0.9)"
                    : "rgba(255,255,255,0.95)",
                borderRadius: 3,
                p: 1,
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                zIndex: 3000,
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                placeholder={t("Writeyourcommenthere")}
                variant="outlined"
                sx={{
                  bgcolor: theme.palette.mode === "dark" ? "#222" : "#fff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root fieldset": { border: "none" },
                }}
              />
              <IconButton type="submit" color="primary" disabled={loadingSend}>
                {loadingSend ? (
                  <i className="fa-solid fa-spinner fa-spin" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </Box>
          </Box>
        </Fade>
      </Box>
    </AuthGuard>
  );
}
