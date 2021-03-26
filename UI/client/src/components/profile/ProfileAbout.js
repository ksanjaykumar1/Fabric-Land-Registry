import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    email,
    phoneNumber,
    user: { name }
  }
}) => (
  <div className='profile-about bg-light p-2'>
    {bio && (
      <Fragment>
        <h2 className='text-primary'>{name.trim().split(' ')[0]}'s Bio</h2>
        <p>{bio}</p>
        <div className='line' />
      </Fragment>
    )}
    <h2 className='text-primary'>Contact Details</h2>
    <div className='skills'>
    
        <div  className='p-1'>
          <i className='fas fa-phone fa-2x' /> {phoneNumber}
        </div>
        <div  className='p-1'>
          <i className='fas fa-envelope-square fa-2x' /> {email}
        </div>
 
    </div>
  </div>
);

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
