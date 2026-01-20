import Home from "./pages/Home"
import Trending from "./pages/Trending";
import Shop from "./pages/Shop";
import Rent from "./pages/Rent";
import Community from "./pages/Community";
import Seller from "./pages/Seller";
import Pricing from "./pages/Pricing";
import Categorty from "./pages/Categorty";
import Asset from "./pages/Asset";
import Blogs from "./pages/Blogs";

// Company pages
import About from "./pages/company_pages/About";
import Reviews from "./pages/company_pages/Reviews";
import FAQ from "./pages/company_pages/FAQ";

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
         <Route path="/category/*" element={<Categorty />} />
         <Route path="/asset/*" element={<Asset />} />
         <Route path="/blogs" element={<Blogs />} />
         
         {/* Routes for company pages */}
         <Route path="/about" element={<About />} />
         <Route path="/reviews" element={<Reviews />} />
         <Route path="/faq" element={<FAQ />} />
         
      </Routes>
      <PopularLinks />
      <Footer />
    </Router>
    </>
  )
}

export default App
