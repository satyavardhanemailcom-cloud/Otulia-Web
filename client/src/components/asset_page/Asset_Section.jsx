import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import Car_Section from "./car/Car_Section";
import Estate_Section from "./estate/Estate_Section";

const Asset_Section = () => {
  
    const path = useLocation()
  const patharray = path.pathname.split('/')
  const cat = patharray[2]
  
  return (
    <>
    {cat === 'car' && (
    <Car_Section />
    )}

    {cat === 'estate' && (
      <Estate_Section />
    )}
    </>
  );
};

export default Asset_Section;
