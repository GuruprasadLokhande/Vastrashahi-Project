import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetCategoriesQuery } from "@/redux/features/categoryApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopCategoryLoader from "@/components/loader/shop/shop-category-loader";

const CategoryFilter = ({setCurrPage,shop_right=false}) => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedParent, setSelectedParent] = useState(null);

  // Set selected parent on initial load if it exists in the URL
  useEffect(() => {
    if (router.query.category) {
      const categoryParam = router.query.category;
      const formattedParam = categoryParam.split("-").join(" ");
      // Find the matching parent
      const matchingParent = categories?.result?.find(cat => 
        cat.parent.toLowerCase().replace("&", "").split(" ").join("-") === categoryParam
      );
      if (matchingParent) {
        setSelectedParent(matchingParent.parent);
      }
    }
  }, [router.query, categories]);

  // handle category route
  const handleCategoryRoute = (title) => {
    setCurrPage(1);
    const formattedTitle = title.toLowerCase().replace("&", "").split(" ").join("-");
    router.push(`/${shop_right?'shop-right-sidebar':'shop'}?category=${formattedTitle}`);
    
    // Set or clear selected parent
    if (selectedParent === title) {
      setSelectedParent(null);
    } else {
      setSelectedParent(title);
    }
    
    dispatch(handleFilterSidebarClose());
  }

  // handle subcategory route
  const handleSubCategoryRoute = (parent, subCategory) => {
    setCurrPage(1);
    const formattedParent = parent.toLowerCase().replace("&", "").split(" ").join("-");
    const formattedSub = subCategory.toLowerCase().replace("&", "").split(" ").join("-");
    router.push(
      `/${shop_right?'shop-right-sidebar':'shop'}?category=${formattedParent}&subcategory=${formattedSub}`
    );
    dispatch(handleFilterSidebarClose());
  }

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopCategoryLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result;
    content = category_items.map((item) => {
      const isSelected = selectedParent === item.parent;
      const isActiveParent = router.query.category === 
        item.parent.toLowerCase().replace("&", "").split(" ").join("-");
      
      return (
        <li key={item._id}>
          <a
            onClick={() => handleCategoryRoute(item.parent)}
            style={{ cursor: "pointer" }}
            className={isActiveParent ? "active" : ""}
          >
            {item.parent} <span>{item.products.length}</span>
          </a>
          
          {/* Show subcategories if parent is selected */}
          {isSelected && item.children && item.children.length > 0 && (
            <ul className="category-submenu">
              {item.children.map((subItem, i) => {
                const formattedSub = subItem.toLowerCase().replace("&", "").split(" ").join("-");
                const isActiveSub = router.query.subcategory === formattedSub;
                
                return (
                  <li key={i}>
                    <a 
                      onClick={() => handleSubCategoryRoute(item.parent, subItem)}
                      style={{ cursor: "pointer", paddingLeft: "15px" }}
                      className={isActiveSub ? "active" : ""}
                    >
                      - {subItem}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    });
  }
  
  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">Categories</h3>
        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-categories">
            <ul>{content}</ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
