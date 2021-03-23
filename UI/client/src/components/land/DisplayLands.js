import React ,{Fragment} from 'react'
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Moment from 'react-moment'
import {buyLand, landHistory} from '../../actions/land'

const DisplayLands = ({lands ,auth,buyLand,landHistory}) => {
    console.log(auth)

    const allLands= lands.map(lan =>(
        <tr key={lan.landID}>
            <td>{lan.landID}</td>
            <td>{lan.areaCode}</td>
            <td>{lan.length}</td>
            <td>{lan.breadth}</td>
            <td>{lan.totalArea}</td>
            <td>{lan.Address}</td>
            <td>{lan.forSale}</td>
            <td>{lan.owner}</td>
    <td>{lan.forSale ? <button className='btn btn-success'
        
        onClick={()=> buyLand(auth.user.name,lan.landID)
        }
        >BUY</button>:<button className='btn btn-danger'>NotForSale</button>}</td>
    {/* <td><button className='btn btn-success'
    onClick={()=> landHistory(lan.landID)}
    >Show Land History</button></td> */}
    <td>
    <Link to ={`/landhistory/${lan.landID}`} className="btn btn-primary my-1">
                Land History
            </Link>
    </td>
        </tr>
    )) 
    

    return (
        <Fragment>
            
            <h2 className="my2">Property Details</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Land Id</th>
                        <th className="hide-sm">Area Code</th>
                        <th className="hide-sm">Length(M)</th>
                        <th className="hide-sm">Breadth(M)</th>
                        <th className="hide-sm">Total Area</th>
                        <th className="hide-sm">Address</th>
                        <th className="hide-sm">For Sale</th>
                        <th className="hide-sm">Owner</th>
                        <th />
                        <th />
                    </tr>
                </thead>
                <tbody>{allLands}</tbody>

            </table>
        </Fragment>
    )
}

DisplayLands.propTypes = {
    buyLand: PropTypes.func.isRequired,
    lands:PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
    landHistory:PropTypes.func.isRequired,

}
const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps, { buyLand ,landHistory})(DisplayLands)
