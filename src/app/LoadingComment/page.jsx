"use client"
import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';

function Media(props) {
  const { loading = false } = props;

  return (
    <Box sx={{display:'flex' ,justifyContent:'center', alignItems:'center', maxWidth: { xs: "90%", sm: 500, md: 640 }, minWidth: { xs: "90%", sm: 500, md: 640 },margin: "auto",transform: {
    //   xs: "translateY(-200px)",  
    //   sm: "translateY(-200px)",   
    //   md: "translateY(-100px)",  
    },height:'100%'
 }}>
    <Card sx={{width:'100%',height:'100%'}}>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
          ) : null
        }
 title={
          loading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : null
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={10} width="40%" />
          ) : null
        }
      />
      {loading ? (
        <Skeleton sx={{ height: 300 }} animation="wave" variant="rectangular" />
      ) : null}
      <CardContent>
        {loading ? (
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        ):null}
      </CardContent>
    </Card>
    </Box>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
};

export default function LoadingComment() {
  return (
    <div>
      <Media loading />
    </div>
  );
}
