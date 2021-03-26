import React, {Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {getLands,getCurrentOwnerLands} from '../../actions/land'
import DisplayLands from './DisplayLands'
// import ProfileItem from './ProfileItem'


const ProfileLand = ({land:{land,loading},getLands,getCurrentOwnerLands, profile:{profile},match}) => {

    useEffect(() => {
        
        
            getCurrentOwnerLands(match.params.fabricUsername)
    }, [])
    return (
        <div>
            {typeof land !== 'object'? <div>You have not list property in your name</div>:
            <Fragment>
                <h1 className="large text-primary"> {match.params.fabricUsername}'s Properties</h1>
               
               <DisplayLands lands={land}/>

            </Fragment>}
            
        </div>
    )
}

const mapToStateProps =state=>({
    land: state.land,
    profile : state.profile

})
ProfileLand.propTypes = {
    getLands:PropTypes.func.isRequired,
    land:PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentOwnerLands:PropTypes.func.isRequired,

}

export default connect(mapToStateProps,{getLands,getCurrentOwnerLands})(ProfileLand)
