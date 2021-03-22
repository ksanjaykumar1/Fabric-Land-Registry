
import {GET_POST, POST_ERROR, GET_POSTS} from './types'
import axios from 'axios'

//get all posts
export const getPosts =()=>async dispatch=>{

    try{
        const res = await axios.get('/api/posts')
        dispatch({
            type:GET_POSTS,
            payload:res.data
        })
    }catch(err){
        dispatch({

            type:POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}

// get post by post id
export const getPost =(postid)=>async dispatch=>{

    try{
        const res = await axios.get(`/api/posts/:${postid}`)
        dispatch({
            type:GET_POST,
            payload:res.data
        })
    }catch(err){
        dispatch({

            type:POST_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }
}