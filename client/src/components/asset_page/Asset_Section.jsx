import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Car_Section from "./car/Car_Section";
import Estate_Section from "./estate/Estate_Section";
import YachtDetail_Section from "./yacht/Yacht_Section";
import BikeDetail_Section from "./bike/Bike_Section";

const Asset_Section = () => {
  const path = useLocation()
  const patharray = path.pathname.split('/')
  const cat = patharray[2]

  return (
    <>
      {(cat === 'car' || cat === 'vehicles') && (
        <Car_Section />
      )}

      {(cat === 'estate' || cat === 'estates') && (
        <Estate_Section />
      )}

      {(cat === 'yacht' || cat === 'yachts') && (
        <YachtDetail_Section />
      )}

      {(cat === 'bike' || cat === 'bikes') && (
        <BikeDetail_Section />
      )}
    </>
  );
};

export default Asset_Section;

