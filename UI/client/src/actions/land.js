import axios from 'axios'
import {setAlert} from './alert'

import {
    GET_LAND , LAND_ERROR, CLEAR_LAND,  GET_LANDS , BUY_LAND, GET_LAND_HISTORY,
    FABRIC_REGISTER,FABRIC_REGISTER_ERROR ,NO_LAND_ERROR
} from './types'


//create a user account in fabric


export const userRegister =(name) => async dispatch =>{

    console.log(name)

    try {
        
        const config = {
            header : {
              'Content-Type':'application/json'  
            }
        }
        const formData={
            username:`${name}`,
            orgName:"Org1"

        }
        const res = await axios.post('/api/fabric/users',formData,config)
        console.log(res)
        dispatch({
            type: FABRIC_REGISTER,
            payload:res.data
        })

        dispatch(setAlert(`You have succesfully registered with username  ${name} in Hyperledger fabric network`, 'success',20000))

       
         
        

    } catch (err) {

        dispatch({
            type: FABRIC_REGISTER_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
        const errors = err.response.data.errors;
 
        if(errors){
        errors.forEach(error =>dispatch(setAlert(error.msg,'danger')))
        }
    }

}




// GET all lands of current user
export const getCurrentOwnerLands =(ownerName) => async dispatch =>{

    // dispatch({
    //     type:CLEAR_PROFILE
    // })

    try {
        const res = await axios.get(`/api/fabric/channels/mychannel/chaincodes/dRealEstate?args=${ownerName}&peer=peer0.org1.example.com&fcn=queryLandsByOwner`)
        dispatch({
            type: GET_LAND,
            payload : res.data.result
        })
        //console.log(res)
    } catch (err) {

        dispatch({
            type: NO_LAND_ERROR,
            // payload : {msg: err.response.statusText, status: err.response.status}
        })
        
    }

}

//get all land of all user

export const getLands =() => async dispatch =>{

    try {
        
        const res = await axios.get('/api/fabric/channels/mychannel/chaincodes/dRealEstate?args=11&peer=peer0.org1.example.com&fcn=getLandsByRange')
        
        dispatch({
            type: GET_LANDS,
            payload : res.data.result
        })
    } catch (err) {

        dispatch({
            type: LAND_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
    }

}

//buy 

export const buyLand =(name,landID) => async dispatch =>{

    console.log(name)

    try {
        
        const config = {
            header : {
              'Content-Type':'application/json'  
            }
        }
        const formData={
            fcn: "transferLand",
            peers: ["peer0.org1.example.com","peer0.org2.example.com"],
            chaincodeName:"dRealEstate",
            channelName: "mychannel",
            args: [`${landID}`, `${name}`],
            username:`${name}`,
            orgName:"Org1"

        }
        const res = await axios.post('/api/fabric/channels/mychannel/chaincodes/dRealEstate',formData,config)
        dispatch({
            type: BUY_LAND,
        })

        dispatch(setAlert(`Land ${landID} was succesfully bought by ${name}`, 'success',20000))

       
        // history.push('/dashboard')
        

    } catch (err) {

        dispatch({
            type: LAND_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
        const errors = err.response.data.errors;
 
        if(errors){
        errors.forEach(error =>dispatch(setAlert(error.msg,'danger')))
        }
    }

}

//get Land History 

export const landHistory =(landID) => async dispatch =>{

    try {
        console.log('landhistory')
        const res = await axios.get(`/api/fabric/channels/mychannel/chaincodes/dRealEstate?args=${landID}&peer=peer0.org1.example.com&fcn=getLandHistory`)
        console.log("res")
        dispatch({
            type: GET_LAND_HISTORY,
            payload : res.data.result
        })
    } catch (err) {

        dispatch({
            type: LAND_ERROR,
            payload : {msg: err.response.statusText, status: err.response.status}
        })
        
    }

}

// //get LAND by ID

// export const getProfileById =(userId) => async dispatch =>{

//     try {
//         const res = await axios.get(`/api/profile/user/${userId}`)
//         dispatch({
//             type: GET_PROFILE,
//             payload : res.data
//         })
//     } catch (err) {

//         dispatch({
//             type: PROFILE_ERROR,
//             payload : {msg: err.response.statusText, status: err.response.status}
//         })
        
//     }

// }



// //create or update a profile
// export const createProfile = (formData, history,edit=false)=> async dispatch =>{

//     try {
        
//         const config = {
//             header : {
//               'Content-Type':'application/json'  
//             }
//         }
//         const res = await axios.post('/api/profile',formData,config)
//         dispatch({
//             type: GET_PROFILE,
//             payload : res.data
//         })

//         dispatch(setAlert(edit ? "Profile Updated":'Profile Created', 'success'))

//         if(!edit){
//             history.push('/dashboard')
//         }

//     } catch (err) {

//         dispatch({
//             type: PROFILE_ERROR,
//             payload : {msg: err.response.statusText, status: err.response.status}
//         })
        
//         const errors = err.response.data.errors;
 
//         if(errors){
//         errors.forEach(error =>dispatch(setAlert(error.msg,'danger')))
//         }
//     }

// }

// // add expirence 

// export const addExperience = (formData,history) =>async dispatch=>{

//     try {
        
//         const config = {
//             header : {
//               'Content-Type':'application/json'  
//             }
//         }
//         const res = await axios.put('/api/profile/experience',formData,config)
//         dispatch({
//             type: UPDATE_PROFILE,
//             payload : res.data
//         })

//         dispatch(setAlert("Experience added", 'success'))

       
//         history.push('/dashboard')
        

//     } catch (err) {

//         dispatch({
//             type: PROFILE_ERROR,
//             payload : {msg: err.response.statusText, status: err.response.status}
//         })
        
//         const errors = err.response.data.errors;
 
//         if(errors){
//         errors.forEach(error =>dispatch(setAlert(error.msg,'danger')))
//         }
//     }

// }
// // add Education 

// export const addEducation = (formData,history) =>async dispatch=>{

//     try {
        
//         const config = {
//             header : {
//               'Content-Type':'application/json'  
//             }
//         }
//         const res = await axios.put('/api/profile/education',formData,config)
//         dispatch({
//             type: UPDATE_PROFILE,
//             payload : res.data
//         })

//         dispatch(setAlert("Education added", 'success'))

       
//         history.push('/dashboard')
        

//     } catch (err) {

//         dispatch({
//             type: PROFILE_ERROR,
//             payload : {msg: err.response.statusText, status: err.response.status}
//         })
        
//         const errors = err.response.data.errors;
 
//         if(errors){
//         errors.forEach(error =>dispatch(setAlert(error.msg,'danger')))
//         }
//     }

// }
