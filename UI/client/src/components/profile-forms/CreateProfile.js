import React , {Fragment, useState} from 'react'
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createProfile} from '../../actions/profile'

const CreateProfile = ({createProfile ,history}) => {

    

    const [formData,setFormData]= useState({
      city:'',
      status:"",
      bio:"",
      phoneNumber:"",
      email:"",
      address:"",

    })
    const {
      city,
      status,
      bio,
      phoneNumber,
      email,
      address,

    }= formData

    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    const onChange = e =>
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })

    const onSubmit = e =>{
        e.preventDefault()
        createProfile(formData,history)
    }
    
    return (
       <Fragment>
             <h1 className="large text-primary">
        Create Your Profile
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={(e)=>onSubmit(e)}>
        <div className="form-group">
          <select name="status" value={status} onChange={e=>onChange(e)}>
          <option value="0">* Select your Status</option>
            <option value="Seller">Seller</option>
            <option value="Developer">Buyer</option>
            <option value="Both">Both</option>
            <option value="Broker">Broker</option>
            <option value="Banker">Banker</option>
            <option value="Managment">Managment</option>
          </select>
          <small className="form-text"
            >Give us an idea of what are you trying to acheive using this</small
          >
        </div>

        <div className="form-group">
          <input type="text" placeholder="City" name="city" value={city} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Which City are u from. Suggested (eg. Bangalore, Delhi)</small
          >
        </div>
        <div className="form-group">
          <input type="text" placeholder="Address" name="address" value={address} onChange={e=>onChange(e)} />
          <small className="form-text"
            >Enter ur address </small
          >
        </div>
        <div className="form-group">
          <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={e=>onChange(e)}></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button onClick={()=>toggleSocialInputs(!displaySocialInputs)} type="button" className="btn btn-light">
            Add Your  Contact  Details
          </button>
          <span>Optional</span>
        </div>
        {displaySocialInputs && <Fragment>

        <div className="form-group social-input">
          <i className="fas fa-phone fa-2x"></i>
          <input type="text" placeholder="Phone Number" name="phoneNumber"  value={phoneNumber} onChange={e=>onChange(e)}/>
        </div>

        <div className="form-group social-input">
          {/* <i className="fab fa-gmail fa-2x"></i> */}
          <i className="fas fa-envelope-square fa-2x"></i>
          <input type="text" placeholder="Email Id" name="email" value={email} onChange={e=>onChange(e)} />
        </div>
            </Fragment>}
       
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
      </Fragment>
    )
}

{/* const mapStateToProps =state =>{

} */}

CreateProfile.propTypes = {
    createProfile : PropTypes.func.isRequired
}
// withROuter allows us to pass history
export default connect(null,{createProfile}) (withRouter(CreateProfile))
