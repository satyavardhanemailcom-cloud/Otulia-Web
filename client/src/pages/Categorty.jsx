import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Category_Navbar from '../components/category_page/Category_Navbar';
import Cars_Section from '../components/category_page/category_sections/cars/Cars_Section';
import Yacht_Section from '../components/category_page/category_sections/yachts/Yacht_Section';
import Bike_Section from '../components/category_page/category_sections/bikes/Bike_Section';
import Estate_Section from '../components/category_page/category_sections/estates/Estate_Section'

const Categorty = () => {
  return (
    <div className='relative w-full overflow-x-hidden'>
      <Category_Navbar />

      <Routes>
        {/* Default redirect: If user goes to just "/trending", send them to cars */}
        <Route path="/" element={<Navigate to="cars" replace />} />

        {/* Relative Paths: No need to repeat "/trending" */}
        {/* These will match /trending/cars, /trending/estates, etc. */}
        <Route path="cars" element={<Cars_Section />} />
        <Route path="estates" element={<Estate_Section />} />
        <Route path="yachts" element={<Yacht_Section />} />
        <Route path="bikes" element={<Bike_Section />} />
      </Routes>
    </div>
  )
}

export default Categorty

