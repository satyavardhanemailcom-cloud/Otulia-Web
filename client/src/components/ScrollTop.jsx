import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top left corner of the window
    window.scrollTo(0, 0); 
    
    // Alternatively, for smooth scrolling:
    // window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth' 
    // });
    
  }, [pathname]); // This effect runs every time the pathname changes

  return null; // This component does not render any UI
}

export default ScrollToTop;
