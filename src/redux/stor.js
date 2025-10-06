
import {configureStore} from '@reduxjs/toolkit'
import { authReducer } from './authSlice'
import { postsReducer } from './Posts'
 

export let store = configureStore({
    reducer :{
        authReducer,
        postsReducer
    } 

})