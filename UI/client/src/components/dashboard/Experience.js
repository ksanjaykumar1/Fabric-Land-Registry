import React ,{Fragment} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Moment from 'react-moment'

const Experience = ({experience }) => {

    const s= experience.map(exp=>(
        console.log(exp)
    ))

    const experiences = experience.map(exp =>(
        
        <tr key ={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td className="hide-sm">
                <Moment format='YYYY/MM/DD'>{exp.year}</Moment> -{''}{
                    exp.to ===null ?('Now'):(<Moment format='YYYY/MM/DD'>{exp.to}</Moment>)
                }
                
                </td>
            <td>
                <button className='btn btn-danger'>Delete</button>
            </td>
        </tr>
    ))
    return (
        <Fragment>
            {s}
            <h2 className="my2">Experience Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Year</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>

            </table>
        </Fragment>
    )
}

Experience.propTypes = {
    experience:PropTypes.array.isRequired,

}

export default Experience
