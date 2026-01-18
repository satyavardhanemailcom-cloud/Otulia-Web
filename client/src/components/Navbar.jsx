import React from 'react'
import { useState } from 'react'
import Cart from './navbar/Cart'
import Search from './navbar/Search'
import LoginButton from './navbar/LoginButton'
import HamburgerMenu from '../assets/icons/hamburger_menu.svg'
import NavbarMobile from './Navbar_mobile'

const Navbar = () => {

  const [panelFlag, setpanelFlag] = useState(false)

  return (
    <nav className='relative flex items-center justify-between p-6'>
      <img className='w-[140px] md:w-[200px] h-[40px] md:h-[60px]' alt="logo" src="logos/logo.png" title='Otulia' />
      <img className='block md:hidden' onClick={()=>{setpanelFlag(true)}} src={HamburgerMenu} alt="hamburgermenu" />

      <div className={`${panelFlag?'left-33':'left-100'} top-0 z-51 fixed w-[65vw] h-screen bg-white md:hidden flex`}>
        <NavbarMobile />
      </div>

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
