import { GET_PROFILE , PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES} from "../actions/types";

const intialState={
    profile:null,
    profiles:[],
    repos:[],
    loading: true,
    error :{}
}

export default function(state = intialState,action){
    const {type, payload} = action;
    switch(type){
        case UPDATE_PROFILE:
        case GET_PROFILE:
            return{
                ...state,
                profile :payload,
                loading: false
            }
        case PROFILE_ERROR:
            return{
                ...state,
                error : payload,
                loading:false
            }
        case CLEAR_PROFILE:
            return{
                ...state , 
                profile: null, 
                repos: null ,
                loading :false
            }
        case GET_PROFILES:
            return{
                ...state,
                profiles:payload,
                loading:false
            }
       
            
        default:
            return state;

    }
}