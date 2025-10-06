"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import AuthGuard from "../authGuard/page,";
import { useDispatch, useSelector } from "react-redux";
import { getComment, getPosts } from "@/redux/Posts";
import {
  Grid, Card, CardHeader, CardMedia, CardContent,
  CardActions, Avatar, IconButton, Typography, Box,
  useTheme
} from "@mui/material";
 import InsertCommentIcon from "@mui/icons-material/InsertComment";
import Loading from "../loadingPosts/page";
import AllComment from "../allComment/page";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Head from 'next/head';



export default function AllPosts() {
  const [modal, setModal] = useState(false);
  const [modalImg, setModalImg] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const [comId, setComId] = useState(null);
  const { posts, loading } = useSelector((store) => store.postsReducer);
    const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
 const theme = useTheme();

  useEffect(() => {
    dispatch(getPosts({ limit: 50, page }));
  }, [page]);

  // title
  useEffect(() => {
    document.title = "All posts";
  }, []);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);

  const handelModal = (id) => {
    dispatch(getComment(id));
    setModal(true);
    setComId(id);
  };


    const handelImage = (imgs)=>{
          setShowImg(imgs)
          setModalImg(true)
    }

  return (
    <AuthGuard>     
            <Head>
         <meta name="description" content="All posts" />
      </Head>
       <Box sx={{ position: "fixed", bottom: 0, right: 0 }}>
        <SpeedDial
          ariaLabel="Add Post"
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}
          onClick={() => router.push('/addPost')}
        />
      </Box>

      {loading ? <Loading /> : (
        <>
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
            {posts?.posts?.map((item) => (
              <Card 
                key={item.id}
                sx={{
                  width: { xs: "90%", sm: 500, md: 700 },
                  my: 2,
                  boxShadow: 4,
                  borderRadius: 3,
                   bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa",

                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      alt={item.user?.name}
                      src={item.user?.photo}
                      sx={{ width: 45, height: 45 }}
                    />
                  }
                  title={
                    <Typography fontWeight="bold">
                      {item?.user?.name}
                    </Typography>
                  }
                  subheader={item?.createdAt?.split("T")?.[0] ?? ""}
                />
                {item?.image && (
                  <CardMedia onClick={()=>handelImage(item?.image)}
                    component="img"
                    height="300"
                    image={item?.image}
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
                    {item?.body}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: 'center'
                  }}
                  disableSpacing
                >
                  <IconButton onClick={() => handelModal(item.id)} aria-label="comment">
                    <InsertCommentIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Grid>

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
              alignItems: "center"
            }}
          >
            <IconButton
              onClick={handlePrevPage}
              disabled={page === 1}
              sx={{ bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5", "&:hover": { bgcolor: "#ddd" } }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <Typography variant="body2" sx={{ fontWeight: "bold",fontSize:{xs:12, md:14},display:'flex', justifyContent:'center',alignItems:'center' , gap:1}}>
             <span>  {t('page')} </span><span> {page}</span>
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

       {modal && (
        <>
          <div className="backdrop" onClick={() => setModal(false)} />
          <Box sx={{bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",}} className="modal">
            <AllComment id={comId} setModal={setModal} />
          </Box>
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
