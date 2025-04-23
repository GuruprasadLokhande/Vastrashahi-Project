import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetCategoriesQuery } from "@/redux/features/categoryApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopCategoryLoader from "@/components/loader/shop/shop-category-loader";

const CategoryFilter = ({ setCurrPage, shop_right = false, filteredProducts }) => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  // handle category route
  const handleCategoryRoute = (category, gender, isSubcategory = false) => {
    setCurrPage(1);
    const formattedCategory = category.toLowerCase().replace(/[&\s]+/g, '-');
    const path = `/${shop_right ? 'shop-right-sidebar' : 'shop'}`;
    
    // Start with a clean query (only keep color filter if we have one)
    let query = {};
    if (router.query.color) {
      query.color = router.query.color;
    }
    
    if (isSubcategory) {
      // If it's a subcategory, set both subcategory and parent category
      query.subcategory = formattedCategory;
      
      // For bags, we set the category to 'bags'
      if (gender === 'bags') {
        query.category = 'bags';
      } else if (gender) {
        query.gender = gender;
        // Set appropriate parent category based on subcategory
        if (gender === 'men') {
          query.category = 'men';
        } else if (gender === 'women') {
          query.category = 'women';
        }
      }
    } else {
      // If it's a main category
      query.category = formattedCategory;
      
      if (gender) {
        query.gender = gender;
      }
    }
    
    console.log("Navigating with query:", query);
    
    router.push({
      pathname: path,
      query
    });
    dispatch(handleFilterSidebarClose());
  };

  // Get categories based on gender
  const getCategoriesByGender = (gender) => {
    if (!categories?.result) return [];
    return categories.result.filter(cat => cat.gender === gender);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopCategoryLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    content = (
      <>
        {/* Bags Category Section */}
        <div className="category-section mb-4">
          <h4 className="category-gender-title">Bags Collection</h4>
          <ul>
            <li>
              <a
                onClick={() => handleCategoryRoute("Bags")}
                style={{ cursor: "pointer" }}
                className={router.query.category === 'bags' && !router.query.subcategory ? "active" : ""}
              >
                All Bags
              </a>
            </li>
            {[
              "HandBag",
              "Ladies purchase",
              "Traveling Bag"
            ].map((category, index) => {
              const formattedCategory = category.toLowerCase().replace(/[&\s]+/g, '-');
              const isActive = router.query.subcategory === formattedCategory;
              return (
                <li key={`bags-${index}`}>
                  <a
                    onClick={() => handleCategoryRoute(category, 'bags', true)}
                    style={{ cursor: "pointer", paddingLeft: "12px" }}
                    className={isActive ? "active" : ""}
                  >
                    {category}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="category-section mb-4">
          <h4 className="category-gender-title">Men's Categories</h4>
          <ul>
            <li>
              <a
                onClick={() => handleCategoryRoute("Men")}
                style={{ cursor: "pointer" }}
                className={router.query.category === 'men' && !router.query.subcategory ? "active" : ""}
              >
                All Men's Wear
              </a>
            </li>
            {[
              "T-Shirts & Polos",
              "Shirts",
              "Jeans & Trousers",
              "Kurtas & Ethnic Wear",
              "Jackets & Hoodies"
            ].map((category, index) => {
              const formattedCategory = category.toLowerCase().replace(/[&\s]+/g, '-');
              const isActive = router.query.subcategory === formattedCategory && router.query.gender === 'men';
              return (
                <li key={`men-${index}`}>
                  <a
                    onClick={() => handleCategoryRoute(category, 'men', true)}
                    style={{ cursor: "pointer", paddingLeft: "12px" }}
                    className={isActive ? "active" : ""}
                  >
                    {category}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="category-section">
          <h4 className="category-gender-title">Women's Categories</h4>
          <ul>
            <li>
              <a
                onClick={() => handleCategoryRoute("Women")}
                style={{ cursor: "pointer" }}
                className={router.query.category === 'women' && !router.query.subcategory ? "active" : ""}
              >
                All Women's Wear
              </a>
            </li>
            {[
              "Sarees & Ethnic Wear",
              "Kurtis & Tunics",
              "Tops & T-Shirts",
              "Dresses & Jumpsuits",
              "Leggings & Palazzos"
            ].map((category, index) => {
              const formattedCategory = category.toLowerCase().replace(/[&\s]+/g, '-');
              const isActive = router.query.subcategory === formattedCategory && router.query.gender === 'women';
              return (
                <li key={`women-${index}`}>
                  <a
                    onClick={() => handleCategoryRoute(category, 'women', true)}
                    style={{ cursor: "pointer", paddingLeft: "12px" }}
                    className={isActive ? "active" : ""}
                  >
                    {category}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  }

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Categories</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-categories">
          {content}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
