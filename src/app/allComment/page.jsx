"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useRef, useState } from "react";
import AuthGuard from "../authGuard/page,";
import {Grid,Card,CardHeader,CardMedia,CardContent,Avatar,Typography,Button,Box,TextField,List,ListItem,ListItemText,ListItemAvatar,Fade, useTheme} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
 import LoadingComment from "../LoadingComment/page";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getComment } from "@/redux/Posts";
import { useTranslation } from "react-i18next";

export default function AllComment({ id, setModal }) {
  const [loadingSend, setLoadingSend] = useState(false);
  const commentRef = useRef();
    const { t } = useTranslation();
  const { comment, loadingComment } = useSelector((store) => store.postsReducer);
  const dispatch = useDispatch();
  const theme = useTheme();
  // title
  useEffect(() => {
    document.title = "Comments";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = commentRef.current.value;
    if (!value.trim()) {
      toast.error(t("Writeacommentbeforesending"));
      return;
    }
    try {
      setLoadingSend(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast.error("Token not found");
        setLoadingSend(false);
        return;
      }
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/comments",
        { content: value, post: id },
        { headers: { token } }
      );
      toast.success(t("Commentadded"));
      dispatch(getComment(id));
      commentRef.current.value = "";
    } catch (err) {
      toast.error(t('Failedtosendcomment'));
      // console.error(err);
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ height: "90vh", display: "flex", flexDirection: "column",p: { xs: 3, sm: 0, md: 0 },bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5"}}>

          {/* Scrollable Area */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: { xs: 1, sm: 2 } }}>
          {loadingComment ? (
            <LoadingComment />
          ) : (
            <Grid container justifyContent="center">
              <Card
                key={comment?.id}
                sx={{width: "100%",maxWidth: 690,mx: "auto",mt: {md:2},borderRadius: 3,boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",}}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor:'#777' }}>
                      <img
                        src={comment?.user?.photo}
                        style={{ width: "100%" }}
                        alt=""
                      />
                    </Avatar>
                  }
                  action={
                    <CancelIcon
                      onClick={() => setModal(false)}
                      sx={{ cursor: "pointer", color: "#777" }}
                    />
                  }
                  title={
                    <Typography sx={{ fontWeight: "bold", fontSize: 17 }}>
                      {comment?.user?.name}
                    </Typography>
                  }
                  subheader={comment?.createdAt?.split("T")?.[0] ?? ""}
                />

                <CardContent>
                  <Typography variant="body1" sx={{color:theme.palette.mode === "dark" ? "#b4b4b4ff" : "#424242ff", fontSize: 15 }}>
                    {comment?.body}
                  </Typography>
                </CardContent>

                {comment?.image && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={comment?.image}
                    alt="post image"
                    sx={{ borderRadius: "0 0 16px 16px" }}
                  />
                )}

                {/* Comments Count */}
                <Typography sx={{ fontWeight: "bold", px: 2, pt: 2 }}>
                  💬 {comment?.comments?.length ?? 0} {t('comments')}
                </Typography>

                {/* Comments List */}
                <List sx={{ width: "100%", px: 1, pb: 2 }}>
                  {[...(comment?.comments ?? [])]
                    .reverse()
                    .map((ite) => (
                      <Fade in timeout={500} key={ite._id}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{
                             bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f9f9f9",
 
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={ite?.commentCreator?.name}
                              src={ite?.commentCreator?.photo}
                            />
                          </ListItemAvatar>
                          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                            <ListItemText
                              primary={
                                <Typography sx={{ fontWeight: "bold" }}>
                                  {ite?.commentCreator?.name}
                                </Typography>
                              }
                              secondary={ite?.content}
                            />
                            <Box
                              sx={{
                                fontSize: 12,
                                color: "#888",
                                mt: 0.5,
                                textAlign: "right",
                              }}
                            >
                              {ite?.createdAt?.split("T")?.[0] || ""}
                            </Box>
                          </Box>
                        </ListItem>
                      </Fade>
                    ))}
                </List>
              </Card>
            </Grid>
          )}
        </Box>

                  {/* Comment Input Bar */}
                  {!loadingComment && (
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{
                        position: "sticky",
                        bottom: 3,
                        bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
                        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
                        zIndex: 100,
                        p: 1,
                        margin: "auto",
                        width: { xs: "93%", sm: "94%", md: "570px" },
                        transform: { xs: "translateX(7px)", sm: "translateX(-7px)", md: "translateX(-8px)" },
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                            >
                    <Box sx={{ display: "flex", gap: 2 }}>
                                  <TextField
                            inputRef={commentRef}
                            name="comment"
                            placeholder={t("Writeyourcommenthere")}
                            variant="outlined"
                            fullWidth
                            multiline
                            maxRows={3}
                            InputProps={{
                              sx: {
                                px: { xs: .5, sm: 2 },  py: { xs: 1.5, sm: 1.5 },},}}
                            sx={{
                                  bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",borderRadius: 1,}}/>
                      <Button type="submit" variant="contained">
                        {loadingSend ? (
                          <i className="fa-solid fa-spinner fa-spin"style={{ fontSize: "17px" }}/>
                        ) : (
                          <span>{t('send')}</span>
                        )}
                      </Button>
                    </Box>
                  </Box>
                )}
          </Box>
        </AuthGuard>
  );
}