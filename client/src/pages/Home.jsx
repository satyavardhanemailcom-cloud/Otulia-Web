import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CategorySection from '../components/home_page/CategorySection'
import TrendingListings from '../components/home_page/TrendingListings'
import MostPopularAssets from '../components/home_page/MostPopularAssets'
import BlogSection from '../components/home_page/BlogSection'
import BrandCarousel from '../components/BrandCarousel'
import SocialMedia from '../components/SocialMedia'
import PopularLinks from '../components/PopularLinks'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='relative w-full overflow-x-hidden'>
      <Navbar />
      <Hero />

      {/* Main Sections Flow */}
      <CategorySection />
      <TrendingListings />
      <MostPopularAssets />
      <BlogSection />
      <BrandCarousel />
      <SocialMedia />
      <PopularLinks />
      <Footer />
    </div>
  )
}

export default Home
