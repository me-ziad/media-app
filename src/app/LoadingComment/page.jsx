"use client";
import * as React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardContent, Skeleton, Box } from "@mui/material";

function Media({ loading = false, height = 300 }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        margin: "auto",
        height: "100%",
      }}
    >
      <Card sx={{ width: "100%", height: "100%" }}>
        <CardHeader
          avatar={
            loading ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
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
          <Skeleton
            sx={{ height, borderRadius: 2 }}
            animation="wave"
            variant="rectangular"
          />
        ) : null}
        <CardContent>
          {loading ? (
            <>
              <Skeleton
                animation="wave"
                height={10}
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={10} width="80%" />
            </>
          ) : null}
        </CardContent>
      </Card>
    </Box>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
  height: PropTypes.number,
};

export default function LoadingComment({ height }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Media loading height={height} />
    </div>
  );
}
