import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export let initialState = {
  loading: false,
  posts: [],
  error: false,
  comment: {},
  userPost: [],
  loadingComment: false,
};

export let getPosts = createAsyncThunk(
  "posts/getPosts",
  async ({ page = 1, limit = 40 }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const firstRes = await axios.get(
      "https://linked-posts.routemisr.com/posts",
      { headers: { token } }
    );

    const totalPages = firstRes.data.paginationInfo.numberOfPages;

    // We calculate the opposite page (meaning the last page remains the first)
    const actualPage = totalPages - page + 1;

    const { data } = await axios.get(
      `https://linked-posts.routemisr.com/posts?page=${actualPage}&limit=${limit}`,
      {
        headers: { token },
      }
    );

    // We arrange them from newest to oldest on the page.
    if (data?.posts?.length) {
      data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return { ...data, totalPages };
  }
);

export let getComment = createAsyncThunk("posts/getPost", async (id) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  let { data } = await axios.get(
    `https://linked-posts.routemisr.com/posts/${id}`,
    {
      headers: {
        token: token,
      },
    }
  );
  return data.post;
});
export let userPosts = createAsyncThunk("posts/userPosts", async (id) => {
  let { data } = await axios.get(
    `https://linked-posts.routemisr.com/users/${id}/posts?`,
    {
      headers: {
        token: localStorage.getItem("token"),
      },
    }
  );
  return data;
});

let postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getComment.pending, (state) => {
      state.loadingComment = true;
    });
    builder.addCase(getComment.fulfilled, (state, action) => {
      state.loadingComment = false;
      state.comment = action.payload;
    });
    builder.addCase(getComment.rejected, (state, action) => {
      state.loadingComment = false;
      state.error = action.payload;
    });
    builder.addCase(userPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.userPost = action.payload;
    });
    builder.addCase(userPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export let postsReducer = postsSlice.reducer;
