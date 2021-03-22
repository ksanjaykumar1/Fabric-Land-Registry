
import {GET_POST, POST_ERROR, GET_POSTS} from '../actions/types'

const initalState={
    posts:[],
    post:null,
    loading:true,
    error:{}

}

export default function(state= initalState,action){
    const{type,payload}=action;
    switch(type){
        case GET_POST:
            return{
                ...state,
                post:payload,
                loading:false
            }
        case GET_POSTS :
            return{
                ...state,
                posts:payload,
                loading:false
            }
        case POST_ERROR:
            return {
                ...state,
                loading:false,
                error:payload
            }
        default:
            return state;
    }
}