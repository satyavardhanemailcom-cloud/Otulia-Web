import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

// Standard import for Home to ensure fast initial paint
import Home from "./pages/Home";

// Lazy imports for other pages
const CartPage = lazy(() => import("./pages/CartPage"));
const Shop = lazy(() => import("./pages/Shop"));
const Rent = lazy(() => import("./pages/Rent"));
const Community = lazy(() => import("./pages/Community"));
const Seller = lazy(() => import("./pages/Seller"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Categorty = lazy(() => import("./pages/Categorty"));
const Asset = lazy(() => import("./pages/Asset"));
const Blogs = lazy(() => import("./pages/Blogs"));

// Company pages
const About = lazy(() => import("./pages/company_pages/About"));
const Reviews = lazy(() => import("./pages/company_pages/Reviews"));
const FAQ = lazy(() => import("./pages/company_pages/FAQ"));

// Auth pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ContactSales = lazy(() => import("./pages/ContactSales"));

// User pages
const Profile = lazy(() => import("./pages/Profile"));
const Success = lazy(() => import("./pages/Success"));
const MyListings = lazy(() => import("./pages/MyListings"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Favorites = lazy(() => import("./pages/Favorites"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DocumentViewer = lazy(() => import("./pages/DocumentViewer"));
const DealerProfile = lazy(() => import("./pages/DealerProfile"));

// Policy pages
const Terms = lazy(() => import("./pages/policies/Terms"));
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicy"));
const Shipping = lazy(() => import("./pages/policies/Shipping"));
const Returns = lazy(() => import("./pages/policies/Returns"));
const CookiePolicy = lazy(() => import("./pages/policies/CookiePolicy"));

// Cities & Regions Pages (10)
const PrivateIslandsPage = lazy(() => import("./pages/listings/cities/PrivateIslandsPage"));      
const BalearicIslandsPage = lazy(() => import("./pages/listings/cities/BalearicIslandsPage"));
const CostaDelSolPage = lazy(() => import("./pages/listings/cities/CostaDelSolPage"));
const FrenchRivieraPage = lazy(() => import("./pages/listings/cities/FrenchRivieraPage"));
const TuscanyPage = lazy(() => import("./pages/listings/cities/TuscanyPage"));
const AmsterdamPage = lazy(() => import("./pages/listings/cities/AmsterdamPage"));
const AtlantaPage = lazy(() => import("./pages/listings/cities/AtlantaPage"));
const AustinPage = lazy(() => import("./pages/listings/cities/AustinPage"));
const BenehavisPage = lazy(() => import("./pages/listings/cities/BenehavisPage"));
const BeverlyHillsPage = lazy(() => import("./pages/listings/cities/BeverlyHillsPage"));

// Countries Pages (10)
const AustraliaPage = lazy(() => import("./pages/listings/countries/AustraliaPage"));
const BritishVirginIslandsPage = lazy(() => import("./pages/listings/countries/BritishVirginIslandsPage"));
const CanadaPage = lazy(() => import("./pages/listings/countries/CanadaPage"));
const CaymanIslandsPage = lazy(() => import("./pages/listings/countries/CaymanIslandsPage"));
const FrancePage = lazy(() => import("./pages/listings/countries/FrancePage"));
const GermanyPage = lazy(() => import("./pages/listings/countries/GermanyPage"));
const GreecePage = lazy(() => import("./pages/listings/countries/GreecePage"));
const IndiaPage = lazy(() => import("./pages/listings/countries/IndiaPage"));
const IrelandPage = lazy(() => import("./pages/listings/countries/IrelandPage"));
const MonacoPage = lazy(() => import("./pages/listings/countries/MonacoPage"));

// Car Pages (10)
const FerrariPage = lazy(() => import("./pages/listings/cars/FerrariPage"));
const AstonMartinPage = lazy(() => import("./pages/listings/cars/AstonMartinPage"));
const KoenigseggPage = lazy(() => import("./pages/listings/cars/KoenigseggPage"));
const LamborghiniPage = lazy(() => import("./pages/listings/cars/LamborghiniPage"));
const BugattiPage = lazy(() => import("./pages/listings/cars/BugattiPage"));
const MaseratiPage = lazy(() => import("./pages/listings/cars/MaseratiPage"));
const PaganiPage = lazy(() => import("./pages/listings/cars/PaganiPage"));
const PorschePage = lazy(() => import("./pages/listings/cars/PorschePage"));
const RollsRoycePage = lazy(() => import("./pages/listings/cars/RollsRoycePage"));
const BugattiChironPage = lazy(() => import("./pages/listings/cars/BugattiChironPage"));

import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollTop";
import SplashScreen from "./components/SplashScreen";
import { CartProvider } from "./contexts/CartContext";

// Simple fallback while lazy components load
const PageLoader = () => <div className="w-full h-screen bg-white"></div>;

function App() {
  const location = useLocation();
  const hideFooterRoutes = ['/admin', '/admin/view-document', '/login', '/signup', '/inventory'];
  const shouldShowFooter = !hideFooterRoutes.some(path => location.pathname.startsWith(path));

  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <CartProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />

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
          <Route path="/admin/view-document" element={<DocumentViewer />} />
          <Route path="/dealer/:email" element={<DealerProfile />} />

          {/* Policy Routes */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contact" element={<ContactSales />} />

          {/* Cities & Regions Routes */}
          <Route path="/listings/private-islands" element={<PrivateIslandsPage />} />
          <Route path="/listings/balearic-islands" element={<BalearicIslandsPage />} />
          <Route path="/listings/costa-del-sol" element={<CostaDelSolPage />} />
          <Route path="/listings/french-riviera" element={<FrenchRivieraPage />} />
          <Route path="/listings/tuscany" element={<TuscanyPage />} />
          <Route path="/listings/amsterdam" element={<AmsterdamPage />} />
          <Route path="/listings/atlanta" element={<AtlantaPage />} />
          <Route path="/listings/austin" element={<AustinPage />} />
          <Route path="/listings/benahavis" element={<BenehavisPage />} />
          <Route path="/listings/beverly-hills" element={<BeverlyHillsPage />} />

          {/* Countries Routes */}
          <Route path="/listings/australia" element={<AustraliaPage />} />
          <Route path="/listings/british-virgin-islands" element={<BritishVirginIslandsPage />} />
          <Route path="/listings/canada" element={<CanadaPage />} />
          <Route path="/listings/cayman-islands" element={<CaymanIslandsPage />} />
          <Route path="/listings/france" element={<FrancePage />} />
          <Route path="/listings/germany" element={<GermanyPage />} />
          <Route path="/listings/greece" element={<GreecePage />} />
          <Route path="/listings/india" element={<IndiaPage />} />
          <Route path="/listings/ireland" element={<IrelandPage />} />
          <Route path="/listings/monaco" element={<MonacoPage />} />

          {/* Car Routes */}
          <Route path="/listings/ferrari" element={<FerrariPage />} />
          <Route path="/listings/aston-martin" element={<AstonMartinPage />} />
          <Route path="/listings/koenigsegg" element={<KoenigseggPage />} />
          <Route path="/listings/lamborghini" element={<LamborghiniPage />} />
          <Route path="/listings/bugatti" element={<BugattiPage />} />
          <Route path="/listings/maserati" element={<MaseratiPage />} />
          <Route path="/listings/pagani" element={<PaganiPage />} />
          <Route path="/listings/porsche" element={<PorschePage />} />
          <Route path="/listings/rolls-royce" element={<RollsRoycePage />} />
          <Route path="/listings/bugatti-chiron" element={<BugattiChironPage />} />
        </Routes>
      </Suspense>
      {shouldShowFooter && <Footer />}
    </CartProvider>
  )
}

export default App
