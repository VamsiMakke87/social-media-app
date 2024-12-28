import './navbar.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';

import React from 'react'

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <div className="navLeft">VAMSIMAKKE</div>
        <div className="navCenter">
          <SearchIcon className='searchIcon'/>
          <input  type='text' placeholder='Search' className='searchBar' />
        </div>
        <div className="navRight">
          <HomeIcon className='rightIcon'/>
          <NotificationsIcon className='rightIcon' />
          <PersonIcon className='rightIcon' />
        </div>
      </div>
    
    </>
  )
};

export default Navbar