import React , {Fragment, useEffect} from 'react'
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getCurrentProfile} from '../../actions/profile'
import profile from '../../reducers/profile'
import Spinner from '../layout/Spinner'
import { DashboardAction } from './DashboardAction'
import Experience from './Experience'



const Dashboard = ({getCurrentProfile,auth:{user}, profile:{profile, loading}}) => {

    useEffect(()=>{
        getCurrentProfile();
    },[])
    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i> Welcome {user && user.name}
        </p>
        {/* {profile!= null ? <Fragment>has</Fragment> : <Fragment>has not</Fragment>} */}
        {/* {profile!= null ? <Fragment>

            <DashboardAction/>
            <Experience experience={profile.experience}/>
        </Fragment> : 
        <Fragment>
            <p>You have not yet Setup a profile , please add some info</p>
            <Link to ='/create-profile' className="btn btn-primary my-1">
                Create ur Profile
            </Link>
        </Fragment>} */}
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state =>({
    auth: state.auth,
    profile : state.profile
})

export default  connect(mapStateToProps,{getCurrentProfile}) (Dashboard)
