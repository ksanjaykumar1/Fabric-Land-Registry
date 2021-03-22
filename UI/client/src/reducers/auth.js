import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED
} from '../actions/types';

// we will store token in local storage , and we can access it
// user detail will also be put here in user
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
};

//action here is the one dispactched in the action folder

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated:true,
        loading:false,
        user: payload
      }
    case REGISTER_SUCCESS :
    case LOGIN_SUCCESS:
      localStorage.setItem('token',payload.token)
      return{
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        
      }
    case REGISTER_FAIL :
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token')
      return{
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false,
      }

    default:
      return state;
  }
}

export default authReducer;


/*
 // case USER_LOADED:
    //   return {
    //     ...state,
    //     isAuthenticated: true,
    //     loading: false,
    //     user: payload
    //   };
    case REGISTER_SUCCESS:
    // case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    // case ACCOUNT_DELETED:
    //   return {
    //     ...state,
    //     token: null,
    //     isAuthenticated: false,
    //     loading: false,
    //     user: null
    //   };
    case REGISTER_FAIL:
    // case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
*/
