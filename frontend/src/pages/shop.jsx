import React, { useState, useEffect } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import ShopLoader from "@/components/loader/shop/shop-loader";
import { sampleProducts } from "@/data";

const ShopPage = ({ query }) => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);
  
  // Load the maximum price once the products have been loaded
  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const maxPrice = products.data.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
    }
  }, [isLoading, isError, products]);

  // handleChanges
  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  // selectHandleFilter
  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  // other props
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };
  
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <div className="pb-80 text-center"><ErrorMsg msg="There was an error" /></div>;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    // products - include sample products with colors if API products don't have colors
    let product_items = [...products.data];
    
    // Check if we have products with colors
    const hasProductsWithColors = product_items.some(p => 
      p.imageURLs && p.imageURLs.some(img => img && img.color && img.color.name)
    );
    
    // If no products have colors, mix in our sample products with colors
    if (!hasProductsWithColors) {
      console.log('No products with colors found in API data, adding sample products');
      product_items = [...product_items, ...sampleProducts];
    }
    
    // select short filtering
    if (selectValue) {
      if (selectValue === "Default Sorting") {
        // Keep the mixed product list
      } else if (selectValue === "Low to High") {
        product_items = product_items
          .slice()
          .sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectValue === "High to Low") {
        product_items = product_items
          .slice()
          .sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectValue === "New Added") {
        product_items = product_items
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectValue === "On Sale") {
        product_items = product_items.filter((p) => p.discount > 0);
      }
    }

    // price filter
    product_items = product_items.filter(
      (p) => p.price >= priceValue[0] && p.price <= priceValue[1]
    );

    // status filter
    if (query.status) {
      if (query.status === "on-sale") {
        product_items = product_items.filter((p) => p.discount > 0);
      } else if (query.status === "in-stock") {
        product_items = product_items.filter((p) => p.status === "in-stock");
      }
    }

    // gender filter
    if (query.gender) {
      const filteredByGender = product_items.filter(
        (p) => p.gender && p.gender.toLowerCase() === query.gender.toLowerCase()
      );
      
      if (filteredByGender.length > 0) {
        product_items = filteredByGender;
        console.log(`Gender filter for "${query.gender}" found ${product_items.length} products`);
      } else {
        console.log(`No products found for gender: ${query.gender}`);
      }
    }

    // category filter
    if (query.category) {
      const categorySlug = query.category.toLowerCase().replace(/[&\s]+/g, '-');
      const filteredByCategory = product_items.filter(
        (p) => {
          // Check multiple possible category fields
          
          // Check category.name (object with name property)
          if (p.category && typeof p.category === 'object' && p.category.name) {
            const productCategory = String(p.category.name).toLowerCase().replace(/[&\s]+/g, '-');
            if (productCategory === categorySlug) return true;
          }
          
          // Check category (string)
          if (p.category && typeof p.category === 'string') {
            const productCategory = String(p.category).toLowerCase().replace(/[&\s]+/g, '-');
            if (productCategory === categorySlug) return true;
          }
          
          // Check parent field
          if (p.parent) {
            const parentCategory = String(p.parent).toLowerCase().replace(/[&\s]+/g, '-');
            if (parentCategory === categorySlug) return true;
          }
          
          // If we reach here, no match was found
          return false;
        }
      );
      
      if (filteredByCategory.length > 0) {
        product_items = filteredByCategory;
        console.log(`Category filter for "${categorySlug}" found ${product_items.length} products`);
      } else {
        console.log(`No products found for category: ${categorySlug}`);
      }
    }

    // subcategory filter
    if (query.subcategory) {
      const subcategorySlug = query.subcategory.toLowerCase().replace(/[&\s]+/g, '-');
      console.log(`Applying subcategory filter for: ${subcategorySlug}`);
      
      const filteredBySubcategory = product_items.filter((p) => {
        // Check if product has children property (direct)
        if (p.children) {
          // Convert to string, handle multiple formats
          const productSubcategory = String(p.children).toLowerCase().replace(/[&\s]+/g, '-');
          const result = productSubcategory === subcategorySlug;
          
          // Log for debugging
          if (result) {
            console.log(`Match found: Product subcategory "${productSubcategory}" matches "${subcategorySlug}"`);
          }
          
          return result;
        }
        
        // Check if product has category.children (array)
        if (p.category && typeof p.category === 'object') {
          // Handle category.children array
          if (p.category.children && Array.isArray(p.category.children)) {
            return p.category.children.some(child => {
              const childFormatted = String(child).toLowerCase().replace(/[&\s]+/g, '-');
              const matches = childFormatted === subcategorySlug;
              if (matches) {
                console.log(`Match found: Product category.children "${childFormatted}" matches "${subcategorySlug}"`);
              }
              return matches;
            });
          }
          
          // Handle category.children string
          if (p.category.children && typeof p.category.children === 'string') {
            const childFormatted = String(p.category.children).toLowerCase().replace(/[&\s]+/g, '-');
            const matches = childFormatted === subcategorySlug;
            if (matches) {
              console.log(`Match found: Product category.children "${childFormatted}" matches "${subcategorySlug}"`);
            }
            return matches;
          }
          
          // Check category name as a fallback
          if (p.category.name) {
            const catNameFormatted = String(p.category.name).toLowerCase().replace(/[&\s]+/g, '-');
            const matches = catNameFormatted === subcategorySlug;
            if (matches) {
              console.log(`Match found: Product category.name "${catNameFormatted}" matches "${subcategorySlug}"`);
            }
            return matches;
          }
        }
        
        return false;
      });
      
      if (filteredBySubcategory.length > 0) {
        product_items = filteredBySubcategory;
        console.log(`Subcategory filter found ${product_items.length} matching products`);
      } else {
        console.log(`No products found for subcategory: ${subcategorySlug}`);
      }
    }

    // color filter
    if (query.color) {
      const colorSlug = query.color.toLowerCase().replace(/[&\s]+/g, '-');
      console.log(`Applying color filter for: ${colorSlug}`);
      
      const filteredByColor = product_items.filter((product) => {
        // Skip products with no images
        if (!product.imageURLs || !Array.isArray(product.imageURLs) || product.imageURLs.length === 0) {
          return false;
        }
        
        // Check if any of the product's images has the matching color
        const hasMatchingColor = product.imageURLs.some(
          (item) => {
            // Skip invalid color entries
            if (!item || !item.color || !item.color.name) return false;
            
            // Fix: normalize color name consistently
            const normalizedColorName = String(item.color.name)
              .toLowerCase()
              .replace(/[&\s]+/g, '-');
            
            const matches = normalizedColorName === colorSlug;
            
            if (matches) {
              console.log(`Found matching color: "${normalizedColorName}" matches "${colorSlug}" for product "${product.title}"`);
            }
            
            return matches;
          }
        );
        
        return hasMatchingColor;
      });
      
      if (filteredByColor.length > 0) {
        product_items = filteredByColor;
        console.log(`Color filter found ${product_items.length} matching products`);
      } else {
        console.log(`No products found for color: ${colorSlug}`);
      }
    }
    
    // Log the final filtered results
    console.log(`Final filtered products count: ${product_items.length}`);
    
    // If we have filter params but no products matched, add a message
    const hasFilters = Object.keys(query).some(key => 
      ['color', 'subcategory', 'category', 'gender', 'status'].includes(key)
    );
    
    if (hasFilters && product_items.length === 0) {
      console.log("No products match the current filters");
    }

    content = (
      <>
        <ShopArea
          all_products={products.data}
          products={product_items}
          otherProps={otherProps}
        />
        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
        />
      </>
    );
  }
  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
