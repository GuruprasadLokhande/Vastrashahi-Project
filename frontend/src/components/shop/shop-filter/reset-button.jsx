import { useRouter } from "next/router";
import React from "react";

const ResetButton = ({ shop_right = false }) => {
  const router = useRouter();
  
  const handleResetFilter = () => {
    // Get current query parameters
    const { category, gender } = router.query;
    
    // Create a new query object that only keeps category and gender if present
    const newQuery = {};
    
    // Optionally keep gender filter
    if (gender) {
      newQuery.gender = gender;
    }
    
    // Optionally keep main category but remove subcategory
    if (category) {
      newQuery.category = category;
    }
    
    // Navigate with only the preserved filters
    router.push({
      pathname: `/${shop_right ? "shop-right-sidebar" : "shop"}`,
      query: newQuery
    });
  };
  
  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Reset Filter</h3>
      <button
        onClick={handleResetFilter}
        className="tp-btn"
      >
        Reset Filter
      </button>
    </div>
  );
};

export default ResetButton;
