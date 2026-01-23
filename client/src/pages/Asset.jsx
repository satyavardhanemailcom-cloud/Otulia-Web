import React from 'react'
import Navbar from '../components/Navbar'
import Asset_Section from '../components/asset_page/Asset_Section'
import { useLocation } from 'react-router-dom'

const Asset = () => {
  const path = useLocation()
  const cat = path.pathname.split('/')
  console.log(cat[2])
  return (
    <div className='pt-24'>
      <Navbar />
      <Asset_Section />
    </div>
  )
}

export default Asset
