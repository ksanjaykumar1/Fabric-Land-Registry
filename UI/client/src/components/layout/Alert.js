import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

//this is UI to display alerts
const Alert = ({alerts}) => 
alerts !== null && alerts.length > 0 && alerts.map(alert=>(
    <div key ={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
    </div>
))

Alert.propTypes = {
    alerts:PropTypes.array.isRequired

}


// to access array of alerts
const mapStateToProps = state =>({
    // we are taking alert from the reducer
    alerts:state.alert
})

export default connect(mapStateToProps)(Alert)
