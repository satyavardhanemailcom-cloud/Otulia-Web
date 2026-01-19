import Home from "./pages/Home"
import Trending from "./pages/Trending";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollTop";
function App() {
  
  return (
    <>
      <Router>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/trending/*" element={<Trending />} />
      </Routes>
      <Footer />
    </Router>
    </>
  )
}

export default App
