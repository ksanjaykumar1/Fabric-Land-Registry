import {BrowserRouter as Router, Route , Switch} from 'react-router-dom'
import './App.css';
import React ,{Fragment, useEffect} from 'react';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

//redux
import {Provider} from 'react-redux';
import store from './store'
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
// import AddExperience from './components/profile-forms/AddExperience';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Lands from './components/land/Lands';
import LandHistory from './components/land/LandHistory';
import AddLand from './components/land/AddLand';
import ProfileLand from './components/land/ProfileLand';


if(localStorage.token){
  setAuthToken(localStorage.token)
}


const  App= () =>{ 

  // passing [] at will make it run ony once (on mount and unmount)
  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar/>
        {console.log("no no not the compfy chair")}
        <Route exact path="/" component ={Landing}/>
        <section className="container">
          <Alert/>
          <Switch>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <PrivateRoute exact path="/dashboard" component={Dashboard}/>
            <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
            
            <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
            {/* <PrivateRoute exact path="/add-experience" component={AddExperience}/> */}
            <Route exact path='/profiles' component={Profiles}/>
            <Route exact path='/profile/:id' component={Profile}/>

            <Route exact path='/lands' component={Lands}/>
            <Route exact path='/landhistory/:landId' component={LandHistory}/>
            <Route exact path='/profileland/:fabricUsername' component={ProfileLand}/>
            <PrivateRoute exact path="/add-land" component={AddLand}/>
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>

)};

  
 

export default App;
