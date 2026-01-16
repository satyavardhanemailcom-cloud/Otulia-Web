import React from 'react'
import Profile_dropdown from './navbar/Profile_dropdown'
import Notification from './navbar/notification'
import Cart from './navbar/Cart'
import Search from './navbar/Search'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between p-6'>
      <img className='w-[200px] h-[60px]' alt="logo" src="logos/logo_inverted.png" title='Otulia' />
      <ul className='flex items-center justify-center gap-8'>
        <li>
            <Search />
        </li>
        <li>
            <div className='flex gap-5 items-center justify-center'>
            <Notification />
            <Profile_dropdown />
            </div>
        </li>
        <li>
            <Cart />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
