import Home from "./pages/Home"
import Trending from "./pages/Trending";
import Shop from "./pages/Shop";
import Rent from "./pages/Rent";
import Community from "./pages/Community";
import Seller from "./pages/Seller";
import Pricing from "./pages/Pricing";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import PopularLinks from "./components/PopularLinks"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollTop";
function App() {
  
  return (
    <>
      <Router>
      
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/trending/*" element={<Trending />} />
         <Route path="/shop" element={<Shop />} />
         <Route path="/community" element={<Community />} />
         <Route path="/rent" element={<Rent />} />
         <Route path="/seller" element={<Seller />} />
         <Route path="/pricing" element={<Pricing />} />
      </Routes>
      <PopularLinks />
      <Footer />
    </Router>
    </>
  )
}

export default App
