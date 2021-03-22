import axios from 'axios'
import {setAlert} from './alert'

import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE
} from './types'

// GET current users profile
export const getCurrentProfile =() => async dispatch =>{

    dispatch({
        type:CLEAR_PROFILE
    })

    try {
        const res = await axios.get('/api/profile/me')
        dispatch({
            type: GET_PROFILE,
            payload : res.data
        })
    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
    }

}

//get all profiles

export const getProfiles =() => async dispatch =>{

    try {
        const res = await axios.get('/api/profile')
        dispatch({
            type: GET_PROFILES,
            payload : res.data
        })
    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
    }

}

//get profile by ID

export const getProfileById =(userId) => async dispatch =>{

    try {
        const res = await axios.get(`/api/profile/user/${userId}`)
        dispatch({
            type: GET_PROFILE,
            payload : res.data
        })
    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
    }

}

//create or update a profile
export const createProfile = (formData, history,edit=false)=> async dispatch =>{

    try {
        
        const config = {
            header : {
              'Content-Type':'application/json'  
            }
        }
        const res = await axios.post('/api/profile',formData,config)
        dispatch({
            type: GET_PROFILE,
            payload : res.data
        })

        dispatch(setAlert(edit ? "Profile Updated":'Profile Created', 'success'))

        // if(!edit){
        //     history.push('/dashboard')
        // }

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
        const errors = err.response.data.errors;
 
        if(errors){
        errors.forEach(error =>dispatch(setAlert(error.msg,'danger')))
        }
    }

}

// add expirence 

export const addExperience = (formData,history) =>async dispatch=>{

    try {
        
        const config = {
            header : {
              'Content-Type':'application/json'  
            }
        }
        const res = await axios.put('/api/profile/experience',formData,config)
        dispatch({
            type: UPDATE_PROFILE,
            payload : res.data
        })

        dispatch(setAlert("Experience added", 'success'))

       
        history.push('/dashboard')
        

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
        const errors = err.response.data.errors;
 
        if(errors){
        errors.forEach(error =>dispatch(setAlert(error.msg,'danger')))
        }
    }

}
// add Education 

export const addEducation = (formData,history) =>async dispatch=>{

    try {
        
        const config = {
            header : {
              'Content-Type':'application/json'  
            }
        }
        const res = await axios.put('/api/profile/education',formData,config)
        dispatch({
            type: UPDATE_PROFILE,
            payload : res.data
        })

        dispatch(setAlert("Education added", 'success'))

       
        history.push('/dashboard')
        

    } catch (err) {

        dispatch({
            type: PROFILE_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
        const errors = err.response.data.errors;
 
        if(errors){
        errors.forEach(error =>dispatch(setAlert(error.msg,'danger')))
        }
    }

}
