import React from 'react'
import SearchBar from '../navbar_sidepanel/SearchBar'
import LoginButton from '../navbar/LoginButton'

const AssetNavbarMobile = () => {
  return (
    <div className='px-5 py-2'>

      
      
    <div className='flex flex-col gap-3 text-[#2C2C2C]'>
      <SearchBar />
      <div className='flex items-center justify-between p-2'>
      <span>Cart</span>
      <span>2</span>
      </div>
      <LoginButton />
      </div>
      
    </div>
  )
}

export default AssetNavbarMobile
