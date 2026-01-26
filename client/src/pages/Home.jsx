import Navbar from '../components/Navbar'
import Hero from '../components/home_page/Hero'
import CategorySection from '../components/home_page/CategorySection'
import TrendingListings from '../components/home_page/TrendingListings'
import MostPopularAssets from '../components/home_page/MostPopularAssets'
import BlogSection from '../components/home_page/BlogSection'
import BrandCarousel from '../components/home_page/BrandCarousel'



const Home = () => {
  return (
    <div className='relative w-full overflow-x-hidden pt-24'>
      <Navbar />
      <Hero />

      {/* Main Sections Flow */}
      <CategorySection />
      <TrendingListings />
      <MostPopularAssets />
      <BlogSection />
      <BrandCarousel />


    </div>
  )
}

export default Home
