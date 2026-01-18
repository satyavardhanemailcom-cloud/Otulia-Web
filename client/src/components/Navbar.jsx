import React from 'react'
import Cart from './navbar/Cart'
import Search from './navbar/Search'
import LoginButton from './navbar/LoginButton'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between p-6'>
      <img className='w-[200px] h-[60px]' alt="logo" src="logos/logo.png" title='Otulia' />
      <ul className='flex items-center justify-center gap-8'>
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
