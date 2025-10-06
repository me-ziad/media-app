import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export let initialState = {

    loading : false,
    posts : [],
    error : false,
    comment: {},
    userPost : [],
    loadingComment:false
}

export let getPosts = createAsyncThunk(
  'posts/getPosts',
  async ({ limit = 10, page = 1 }) => {
        const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const { data } = await axios.get(`https://linked-posts.routemisr.com/posts?limit=${limit}&page=${page}`, {
      headers: {
            token: token,

      },
    });
    return data;
  }
);

 export let getComment = createAsyncThunk('posts/getPost', async(id)=>{
 const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        let {data} = await axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
          headers: {
                 token: token,

          }
        })
         return data.post

})
export let userPosts = createAsyncThunk('posts/userPosts', async(id)=>{

        let {data} = await axios.get(`https://linked-posts.routemisr.com/users/${id}/posts?`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
         return data
})

let postsSlice =  createSlice({
    name : 'posts',
    initialState,
    reducers : {
    },
    extraReducers (builder){    
        builder.addCase(getPosts.pending,(state)=>{
            state.loading = true
        })
        builder.addCase(getPosts.fulfilled,(state,action)=>{
            state.loading = false
            state.posts = action.payload
        })
        builder.addCase(getPosts.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        })
         builder.addCase(getComment.pending,(state)=>{
            state.loadingComment = true
        })
        builder.addCase(getComment.fulfilled,(state,action)=>{
            state.loadingComment = false
            state.comment = action.payload
        })
        builder.addCase(getComment.rejected,(state,action)=>{
            state.loadingComment = false
            state.error = action.payload
        })
         builder.addCase(userPosts.pending,(state)=>{
            state.loading = true
        })
        builder.addCase(userPosts.fulfilled,(state,action)=>{
            state.loading = false
            state.userPost = action.payload
        })
        builder.addCase(userPosts.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        })
 
    } 
})

export let postsReducer = postsSlice.reducer