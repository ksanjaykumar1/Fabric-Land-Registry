import React , {Fragment, useEffect} from 'react'
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getCurrentProfile,addUsername} from '../../actions/profile'
import profile from '../../reducers/profile'
import Spinner from '../layout/Spinner'
import { DashboardAction } from './DashboardAction'
import Experience from './Experience'
import {userRegister} from '../../actions/land'
import UserLands from '../land/UserLands'



const Dashboard = ({getCurrentProfile,userRegister,addUsername,auth:{user}, profile:{profile, loading}}) => {

    useEffect(()=>{
        getCurrentProfile();
    },[])
    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i> Welcome {user && user.name}
        </p>
        {/* {profile!= null ? <Fragment>has</Fragment> : <Fragment>has not</Fragment>} */}
        {profile!= null ? <Fragment>
            <p> Update your latest details</p>
            <Link to ='/edit-profile' className="btn btn-primary my-1">
                Edit ur Profile
            </Link>
            {profile.fabricAccount ?<Fragment>
                <div>Your backend hyperledger fabric username is {profile.fabricUsername}</div>
            </Fragment>:<Fragment>
                <p> Create your fabric account</p>
            <button className='btn btn-success'
                onClick={async ()=> {
                   await  userRegister(user.name)
                   addUsername(user.name)
                }}
                >Create a fabric Account</button>
            </Fragment>}
            <UserLands/>
            {/* <DashboardAction/> */}
            {/* <Experience experience={profile.experience}/> */}
        </Fragment> : 
        <Fragment>
            <p>You have not yet Setup a profile , please add some info in order to register in fabric network</p>
            <Link to ='/create-profile' className="btn btn-primary my-1">
                Create ur Profile
            </Link>
        </Fragment>} 
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    userRegister:PropTypes.func.isRequired,
    addUsername:PropTypes.func.isRequired,
}

const mapStateToProps = state =>({
    auth: state.auth,
    profile : state.profile
})

export default  connect(mapStateToProps,{getCurrentProfile ,userRegister,addUsername}) (Dashboard)
