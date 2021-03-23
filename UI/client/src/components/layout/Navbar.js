import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {logout} from '../../actions/auth'

 function Navbar({auth :{isAuthenticated, loading},logout}) {

  const authLinks =( 
  <ul>
    <li><Link to="/profiles">Profiles</Link></li>
    <li><Link to="/lands">Properties</Link></li>
    <li><Link to="/add-land">Add Lands</Link></li>
    {/* <li><Link to="/posts">Posts</Link></li> */}
    <li><Link to="/dashboard">
    <i className="fas fa-user"></i>{''}
    <span className='hide-sm'></span>Dashboard</Link></li>
    <li>
      <a onClick={logout} href='#!'>
        <i className="fas fa-sign-out-alt"></i>{''}
      <span className='hide-sm'>Logout</span>
      </a>
     </li>
    
  </ul>)

  const guestLinks =( <ul>
    <li><Link to="/profiles">Sellers</Link></li>
    <li><Link to="/lands">Lands</Link></li>
    
    <li><Link to="/register">Register</Link></li>

    <li><Link to="/login">Login</Link></li>
  </ul>)
    return (
        <nav className="navbar bg-dark">
        <h1>
          <Link to="/index"><i className="fas fa-code"></i> Decentralized Property Sell</Link>
        </h1>
       {!loading && (<Fragment>{isAuthenticated?authLinks:guestLinks}</Fragment>)}
      </nav>
    )
}

Navbar.prototype={
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProp= state=>({
  auth: state.auth

}
)
export default connect(mapStateToProp,{logout})(Navbar);