import React, {Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import {getLands} from '../../actions/land'
import DisplayLands from './DisplayLands'
// import ProfileItem from './ProfileItem'


const Lands = ({land:{alllands,loading},getLands}) => {

    useEffect(() => {
        getLands()
    }, [])
    return (
        <div>
            {loading ?<Spinner/>:
            <Fragment>
                <h1 className="large text-primary">LANDS</h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop">Browse and Buy Land</i>
                </p>
               <DisplayLands lands={alllands}/>

            </Fragment>}
            
        </div>
    )
}

const mapToStateProps =state=>({
    land: state.land
})
Lands.propTypes = {
    getLands:PropTypes.func.isRequired,
    land:PropTypes.object.isRequired,

}

export default connect(mapToStateProps,{getLands})(Lands)
