import React from 'react'
import Cart from './navbar/Cart'
import Search from './navbar/Search'
import LoginButton from './navbar/LoginButton'
import HamburgerMenu from '../assets/icons/hamburger_menu.svg'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between p-6'>
      <img className='w-[140px] md:w-[200px] h-[40px] md:h-[60px]' alt="logo" src="logos/logo.png" title='Otulia' />
      <img src={HamburgerMenu} alt="hamburgermenu" />


      <ul className='hidden md:flex items-center justify-center gap-8'>
        <li>
            <Search />
          </li>
        <li>
         <LoginButton />
        </li>
          <li>
          <Cart />
          </li>

          
        </ul>

    </nav> 
  )
}

export default Navbar
