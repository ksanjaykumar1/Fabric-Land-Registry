import {SET_ALERT, REMOVE_ALERT} from './types'
import uuid from 'uuid'
export const setAlert =(msg, alertType, timeout=5000)=> dispatch =>{

    //this is called my components like register , this in turn calls the reducer alert 
    const id = uuid.v4()
    dispatch({
        type: SET_ALERT,
        payload :{msg , alertType, id}
    })

    setTimeout(()=>dispatch({type: REMOVE_ALERT , payload:id}),timeout)



}