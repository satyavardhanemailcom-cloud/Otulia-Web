import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Trending_Navbar from '../components/trending_page/Trending_Navbar'
import Trending_Section from '../components/trending_page/Trending_Section';

const Trending = () => {
  return (
    <div className='relative w-full overflow-x-hidden'>
      <Trending_Navbar />
      <Routes>
        {/* Default redirect: If user goes to just "/trending", send them to cars */}
        <Route path="/" element={<Navigate to="cars" replace />} />

        {/* Relative Paths: No need to repeat "/trending" */}
        {/* These will match /trending/cars, /trending/estates, etc. */}
        <Route path="cars" element={<Trending_Section type="Car" />} />
        <Route path="estates" element={<Trending_Section type="Estate" />} />
        <Route path="yachts" element={<Trending_Section type="Yacht" />} />
        <Route path="bikes" element={<Trending_Section type="Bike" />} />
      </Routes>
    </div>
  )
}

export default Trending
