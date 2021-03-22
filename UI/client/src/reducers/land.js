import { GET_LAND , LAND_ERROR, CLEAR_LAND, UPDATE_LAND, GET_LANDS , GET_LAND_HISTORY} from "../actions/types";

const intialState={
    land:[],
    alllands:[],
    landhistory:[],
    loading: true,
    error :{}
}

export default function(state = intialState,action){
    const {type, payload} = action;
    switch(type){
        // case UPDATE_LAND:
        case GET_LAND:
            return{
                ...state,
                land :payload,
                loading: false
            }
        case LAND_ERROR:
            return{
                ...state,
                error : payload,
                loading:false
            }
        case CLEAR_LAND:
            return{
                ...state , 
                land: null, 
                loading :false
            }
        case GET_LANDS:
            return{
                ...state,
                alllands:payload,
                loading:false
            }
       case GET_LAND_HISTORY:
           return{
            ...state,
            landhistory:payload,
            loading:false

           }
            
        default:
            return state;

    }
}