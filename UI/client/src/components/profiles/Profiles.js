import React, {Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {getProfiles} from '../../actions/profile'
import ProfileItem from './ProfileItem'


const Profiles = ({profile:{profiles,loading},getProfiles}) => {

    useEffect(() => {
        getProfiles()
    }, [])
    return (
        <div>
            {loading ?<Spinner/>:
            <Fragment>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop">Browse and connect wth developers</i>
                </p>
                <div className='profiles'>
                    {profiles.length >0 ? (profiles.map(profile=>(
                        <ProfileItem key={profile._id} profile={profile}/>
                    ))): <h4> No profiles found gound...</h4>}
                </div>

            </Fragment>}
            
        </div>
    )
}

const mapToStateProps =state=>({
    profile: state.profile
})
Profiles.propTypes = {
    getProfiles:PropTypes.func.isRequired,
    profile:PropTypes.object.isRequired,

}

export default connect(mapToStateProps,{getProfiles})(Profiles)
