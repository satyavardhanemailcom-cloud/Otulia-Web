import Home from "./pages/Home"
import CartPage from "./pages/CartPage";
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

// Auth pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// User pages
import Profile from "./pages/Profile";
import Success from "./pages/Success";
import MyListings from "./pages/MyListings";
import Inventory from "./pages/Inventory";

import { Routes, Route } from "react-router-dom";

import PopularLinks from "./components/PopularLinks"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollTop";

import { CartProvider } from "./contexts/CartContext";

function App() {

  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/trending/*" element={<Trending />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/community" element={<Community />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/category/*" element={<Categorty />} />
        <Route path="/asset/:category/:id" element={<Asset />} />
        <Route path="/blogs" element={<Blogs />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Routes for company pages */}
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faq" element={<FAQ />} />
        {/* User routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/success" element={<Success />} />
        <Route path="/listings" element={<MyListings />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
      <Footer />
    </CartProvider>
  )
}

export default App
