import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Category_Navbar from '../components/category_page/Category_Navbar';
import Cars_Section from '../components/category_page/category_sections/cars/Cars_Section';
import Category_Section from '../components/category_page/Category_Section';

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
        <Route path="estates" element={<Category_Section type="Estate" />} />
        <Route path="yachts" element={<Category_Section type="Yacht" />} />
        <Route path="bikes" element={<Category_Section type="Bike" />} />
      </Routes>
    </div>
  )
}

export default Categorty
