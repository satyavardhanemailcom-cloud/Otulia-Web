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
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/AdminDashboard";

// Policy pages
import Terms from "./pages/policies/Terms";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import Shipping from "./pages/policies/Shipping";
import Returns from "./pages/policies/Returns";
import CookiePolicy from "./pages/policies/CookiePolicy";

import { Routes, Route, useLocation } from "react-router-dom";

import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollTop";

import { CartProvider } from "./contexts/CartContext";

function App() {
  const location = useLocation();
  const hideFooterRoutes = ['/admin'];
  const shouldShowFooter = !hideFooterRoutes.some(path => location.pathname.startsWith(path));

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
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Policy Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
      </Routes>
      {shouldShowFooter && <Footer />}
    </CartProvider>
  )
}

export default App
