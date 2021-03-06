import React, {Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {getLands,getCurrentOwnerLands} from '../../actions/land'
import DisplayLands from './DisplayLands'
// import ProfileItem from './ProfileItem'


const Lands = ({land:{alllands,loading},getLands,getCurrentOwnerLands, profile:{profile}}) => {

    useEffect(() => {
        getLands()
        //getCurrentOwnerLands("Sanjay")
    }, [])
    return (
        <div>
            {loading ?<Spinner/>:
            <Fragment>
                <h1 className="large text-primary">Properties</h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop">Browse and Buy Properties</i>
                </p>
               
               <DisplayLands lands={alllands}/>

            </Fragment>}
            
        </div>
    )
}

const mapToStateProps =state=>({
    land: state.land,
    profile : state.profile

})
Lands.propTypes = {
    getLands:PropTypes.func.isRequired,
    land:PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentOwnerLands:PropTypes.func.isRequired,

}

export default connect(mapToStateProps,{getLands,getCurrentOwnerLands})(Lands)
