import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { landHistory} from '../../actions/land'

const LandHistory = ({landHistory,land:{landhistory},match}) => {

    useEffect(() => {
        landHistory(match.params.landId);
      }, [landHistory, match.params.landId]);

      const allhistory=landhistory.map(lan =>(
          
          <tr key={lan.txId}>
              <td>{lan.txId}</td>
              <td>{lan.record.owner}</td>
              <td>{lan.timestamp.substring(0,10)}</td>
              <td>{lan.timestamp.substring(11,19)}</td>

          </tr>
      ))
    //   const ldate= (timestamp)=>{
    //       return()
    //   }
    
    return (
       <Fragment>
           {!landhistory? <Spinner/>:(
               <Fragment>
                   <h2 className="my2">Land History of {match.params.landId} </h2>
                    <table className='table'>
                        <thead>
                            <th>Transaction Id</th>
                            <th>Owner </th>
                            <th>Date </th>
                            <th>Time </th>
                        </thead>
                        <tbody>{allhistory}</tbody>

                     </table>
               </Fragment>

           )


           }
       </Fragment>
    )
}

LandHistory.propTypes = {
    landHistory:PropTypes.func.isRequired,
    land:PropTypes.object.isRequired,

}
const mapStateToProps = (state) => ({
    land: state.land
  });

export default connect(mapStateToProps,{landHistory})(LandHistory)
