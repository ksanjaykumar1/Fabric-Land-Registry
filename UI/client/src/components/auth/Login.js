import React,{Fragment, Link , useState} from 'react'
import axios from 'axios';
import {connect} from 'react-redux'
import {login} from '../../actions/auth'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom';


function Login({login,isAuthenticated}) {

    const [formData, setFormData] = useState({

        email:'',
        password:''

    });

    const onChange=e=> setFormData({...formData,[e.target.name]:e.target.value})
    const onSubmit= async e =>{

        e.preventDefault();
        login(email,password)
       //console.log("success")

    }
    if (isAuthenticated) {
        return <Redirect to="/dashboard"/>;
      }


    const { email, password } = formData
    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead">
                <i className="fas fa-user"></i> Sign Into Your Account
            </p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                
                <div className="form-group">
                    <input 
                    type="email" 
                    placeholder="Email Address" 
                    name="email" 
                    value={email}
                    onChange={e=>onChange(e)}
                    />
                     <small className="form-text">This site uses Gravatar so if you want a profile image, use Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={e=>onChange(e)}
                    />
                </div>
                
            <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
            Don't have an account? 
            <a href="/register">Sign Up</a>
            </p>
            
     
         
        </Fragment>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };
  
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
  });
  
export default connect(mapStateToProps, { login })(Login);
