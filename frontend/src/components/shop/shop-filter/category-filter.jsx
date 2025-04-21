import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetCategoriesQuery } from "@/redux/features/categoryApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopCategoryLoader from "@/components/loader/shop/shop-category-loader";

const CategoryFilter = ({ setCurrPage, shop_right = false }) => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  // handle category route
  const handleCategoryRoute = (category, gender) => {
    setCurrPage(1);
    const formattedCategory = category.toLowerCase().replace(/[&\s]+/g, '-');
    const path = `/${shop_right ? 'shop-right-sidebar' : 'shop'}`;
    const query = { category: formattedCategory };
    if (gender) {
      query.gender = gender;
    }
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
        <div className="category-section mb-4">
          <h4 className="category-gender-title">Men's Categories</h4>
          <ul>
            {[
              "T-Shirts & Polos",
              "Shirts",
              "Jeans & Trousers",
              "Kurtas & Ethnic Wear",
              "Jackets & Hoodies"
            ].map((category, index) => {
              const isActive = router.query.category === category.toLowerCase().replace(/[&\s]+/g, '-') 
                && router.query.gender === 'men';
              return (
                <li key={`men-${index}`}>
                  <a
                    onClick={() => handleCategoryRoute(category, 'men')}
                    style={{ cursor: "pointer" }}
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
            {[
              "Sarees & Ethnic Wear",
              "Kurtis & Tunics",
              "Tops & T-Shirts",
              "Dresses & Jumpsuits",
              "Leggings & Palazzos"
            ].map((category, index) => {
              const isActive = router.query.category === category.toLowerCase().replace(/[&\s]+/g, '-')
                && router.query.gender === 'women';
              return (
                <li key={`women-${index}`}>
                  <a
                    onClick={() => handleCategoryRoute(category, 'women')}
                    style={{ cursor: "pointer" }}
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
