import { useEffect } from 'react';

const FixCategoryImages = () => {
  useEffect(() => {
    // Function to fix category styles
    const fixCategoryStyles = () => {
      // Fix desktop category menu items
      const categoryItems = document.querySelectorAll('.tp-category-menu nav ul li.has-dropdown a');
      categoryItems.forEach(item => {
        item.style.display = 'block';
        item.style.width = '100%';
      });
      
      // Fix mobile category menu items
      const mobileItems = document.querySelectorAll('.tp-category-mobile-menu ul li.has-dropdown a');
      mobileItems.forEach(item => {
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.width = '100%';
        
        // Fix dropdown toggle buttons
        const toggleBtn = item.querySelector('.dropdown-toggle-btn');
        if (toggleBtn) {
          toggleBtn.style.marginLeft = 'auto';
          toggleBtn.style.flexShrink = '0';
        }
      });
    };

    // Delay initial run to ensure DOM is loaded
    setTimeout(fixCategoryStyles, 500);
    
    // Set up a mutation observer to run the fix when DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(fixCategoryStyles, 100);
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true
    });
    
    // Also attach to window resize for responsive fixes
    window.addEventListener('resize', fixCategoryStyles);
    
    // Clean up the observer on component unmount
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fixCategoryStyles);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FixCategoryImages; 