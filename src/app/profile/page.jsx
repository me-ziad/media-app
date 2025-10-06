"use client";
export const dynamic = "force-dynamic";
import React, { useContext, useEffect, useState } from "react";
import {Grid,Box,Typography,Card,CardHeader,CardContent,CardMedia,CardActions,IconButton,Fade,Avatar,AvatarGroup,SpeedDial,SpeedDialIcon,Button, useTheme,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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

export default function Profile() {
  const { userProfile, refreshUserProfile, load } = useContext(UserContext);
  const { userPost } = useSelector((store) => store.postsReducer);
  const [tokenData, setTokenData] = useState(null);
  const { t} = useTranslation();
  const [modal, setModal] = useState(false);
  const [comId, setComId] = useState(null);
  const { token } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const [modalImg, setModalImg] = useState(false);
  const [showImg, setShowImg] = useState(false);

    // title
  useEffect(() => {
    document.title = "Profile";
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setTokenData(decoded);
      dispatch(userPosts(decoded.user));
      refreshUserProfile();
    }
  }, [token, dispatch]);

  const handleModal = (id) => {
    dispatch(getComment(id));
    setModal(true);
    setComId(id);
  };
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setTokenData(decoded);
      dispatch(userPosts(decoded.user));
      refreshUserProfile();
    }
  }, [token, dispatch]);
  useEffect(() => {
  dispatch(userPosts(tokenData?.user));
  refreshUserProfile();
}, []);

const deletePost = async (id) => {
  try {
    if (typeof window === "undefined") return;  

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Token not found");

    await axios.delete(`https://linked-posts.routemisr.com/posts/${id}`, {
      headers: { token },
    });

    const decoded = jwtDecode(token);
    dispatch(userPosts(decoded.user));
    refreshUserProfile();
    toast.success(t("Postdeleted"));
  } catch (err) {
    toast.error(t("Failedtodelete"));
    // console.error(err);
  }
};

    const handelImage = (imgs)=>{
          setShowImg(imgs)
          setModalImg(true)
    }

  return (
    <AuthGuard>
      <Fade in timeout={500}>
        <Box sx={{ position: "fixed", bottom: 16, right: {xs:15, md:16}, zIndex: 999, margin:'auto' }}>
          <SpeedDial
            ariaLabel="Add Post"
            icon={<SpeedDialIcon openIcon={<EditIcon />} />}
            onClick={() => router.push("/addPost")}
          />
        </Box>
      </Fade>

      {load ? (
        <Loading />
      ) : (
        <Grid container justifyContent="center" sx={{ mt: 10 }}>
    
 
          <Box
            sx={{
               overflowX: "hidden",
              width: { xs: "90%", md: 900 },
              margin:'auto',
              bgcolor: "white",
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",

              borderRadius: 3,
              p: 3,
              boxShadow: 3,
            }}
          >
            <Box
              onClick={() => router.push("/profilePhoto")}
              component="img"
              src={userProfile?.photo}
              alt="cover"
              sx={{
                width: "100%",
                height: 280,
                objectFit: "cover",
                borderRadius: 2,
                cursor: "pointer",
              }}
            />

            <Box
              onClick={() => router.push("/profilePhoto")}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: -7,
                px: 2,
                cursor: "pointer",
              }}
            >
              <Avatar
                src={userProfile?.photo}
                alt="profile"
                sx={{ width: 100, height: 100, border: "4px solid white" }}
              />
              <Box sx={{ textAlign: "right" }}>
                <Typography fontSize={22} fontWeight={600}>
                  {userProfile?.name}
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  {userProfile?.dateOfBirth}
                </Typography>
                <AvatarGroup max={4} sx={{ justifyContent: "end" }}>
                  <Avatar src="/static/images/avatar/1.jpg" />
                  <Avatar src="/static/images/avatar/2.jpg" />
                  <Avatar src="/static/images/avatar/4.jpg" />
                  <Avatar src="/static/images/avatar/5.jpg" />
                </AvatarGroup>
              </Box>
            </Box>
          </Box>
        </Grid>
      )}

      {/* Posts or Empty State */}
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{
          mt: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {userPost?.posts?.length === 0 ? (
          <Box
            sx={{mt: 1,textAlign: "center",
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
            p: 4,borderRadius: 3,boxShadow: "0px 4px 20px rgba(0,0,0,0.07)",width: { xs: "90%", md: 500 },margin: "auto",}}>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="text.secondary"
              mb={2}
            >
              {t('Therearenopostsyet')}
            </Typography>
                      <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            sx={{
 
              textAlign: { xs: "center", sm: "start" , display:'flex', justifyContent:'center', alignItems:'center'}  
            }}
          >
           {t('Shareyour')}
          </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/addPost")}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 4,
                py: 1,
                fontWeight: "bold",
              }}
            >
              {t('Createyourfirstpost')}
            </Button>
          </Box>
        ) : (
          [...(userPost?.posts ?? [])].reverse().map((item) => (
            <Card
              key={item._id}
              sx={{ width: { xs: "90%", md: 700 }, mb: 3, boxShadow: 3 }}
            >
              <CardHeader
                avatar={<Avatar src={item.user?.photo} />}
                action={
                  <IconButton onClick={() => deletePost(item.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
                title={item?.user?.name}
                subheader={item?.createdAt?.split("T")?.[0] ?? ""}
              />
              {item?.image && (
                <CardMedia onClick={()=>handelImage(item?.image)}
                  component="img"
                  height="300"
                  image={item.image}
                  alt="post image"
                    sx={{
                      objectFit: "cover",
                      borderRadius: "0 0 12px 12px",
                      cursor:'pointer'
                    }}
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {item.body}
                </Typography>
              </CardContent>
              <CardActions disableSpacing sx={{ justifyContent: "center" }}>
                <IconButton onClick={() => handleModal(item.id)}>
                  <InsertCommentIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))
        )}
      </Grid>

      {/* Comments Modal */}
      {modal && (
        <>
          <div className="backdrop" onClick={() => setModal(false)} />
          <div className="modal">
            <AllComment id={comId} setModal={setModal} />
          </div>
        </>
      )}
       {modalImg===true && (
              <>
                <div className="backdrop" onClick={() => setModalImg(false)} />
                <Box sx={{bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",}} className="modalImg">
                      <img src={showImg} alt="" style={{width: "100%",height: "100%",objectFit: "cover",borderRadius: "8px"}}/>
                </Box>
              </>
            )}
    </AuthGuard>
  );
}
