import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopColorLoader from "@/components/loader/shop/color-filter-loader";

// Extended color palette with common Indian clothing colors
const EXTENDED_COLORS = [
  { name: "Red", clrCode: "#ff0000" },
  { name: "Blue", clrCode: "#0000ff" },
  { name: "Green", clrCode: "#00ff00" },
  { name: "Black", clrCode: "#000000" },
  { name: "White", clrCode: "#ffffff" },
  { name: "Yellow", clrCode: "#ffff00" },
  { name: "Purple", clrCode: "#800080" },
  { name: "Pink", clrCode: "#ff69b4" },
  { name: "Orange", clrCode: "#ffa500" },
  { name: "Grey", clrCode: "#808080" },
  { name: "Maroon", clrCode: "#800000" },
  { name: "Navy", clrCode: "#000080" },
  { name: "Olive", clrCode: "#808000" },
  { name: "Beige", clrCode: "#f5f5dc" },
  { name: "Brown", clrCode: "#a52a2a" },
  { name: "Teal", clrCode: "#008080" },
  { name: "Mustard", clrCode: "#ffdb58" },
  { name: "Turquoise", clrCode: "#40e0d0" },
  { name: "Gold", clrCode: "#ffd700" },
  { name: "Silver", clrCode: "#c0c0c0" },
  { name: "Lavender", clrCode: "#e6e6fa" },
  { name: "Cream", clrCode: "#fffdd0" },
  { name: "Peach", clrCode: "#ffdab9" },
  { name: "Coral", clrCode: "#ff7f50" },
  { name: "Mint", clrCode: "#98fb98" }
];

const ColorFilter = ({ setCurrPage, shop_right = false, filteredProducts = null }) => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  // Debug log on initial load
  useEffect(() => {
    if (products?.data) {
      console.log('Color Filter Debug:');
      console.log('Total products:', products.data.length);
      const productsWithColors = products.data.filter(p => 
        p.imageURLs && p.imageURLs.some(img => img && img.color && img.color.name)
      );
      console.log('Products with colors:', productsWithColors.length);
      
      // Log available colors
      const allAvailableColors = new Set();
      productsWithColors.forEach(p => {
        p.imageURLs.forEach(img => {
          if (img && img.color && img.color.name) {
            allAvailableColors.add(img.color.name);
          }
        });
      });
      console.log('Available colors:', [...allAvailableColors]);
    }
  }, [products]);

  // Format color name consistently
  const formatColor = (colorName) => {
    if (!colorName) return '';
    return colorName
      .toLowerCase()
      .replace(/[&\s]+/g, '-');
  };

  // handle color selection
  const handleColor = (clr) => {
    setCurrPage(1);
    
    // Format color consistently
    const formattedColor = formatColor(clr);
    
    console.log(`Selecting color: ${clr}, formatted as: ${formattedColor}`);
    
    // Preserve existing query parameters
    const newQuery = { ...router.query, color: formattedColor };
    
    router.push({
      pathname: `/${shop_right ? 'shop-right-sidebar' : 'shop'}`,
      query: newQuery
    });
    
    dispatch(handleFilterSidebarClose());
  };

  // Check if a color is currently selected
  const isColorSelected = (colorName) => {
    if (!router.query.color) return false;
    return formatColor(colorName) === router.query.color;
  };

  // Get colors from products and merge with extended colors
  const getAvailableColors = (productItems) => {
    let productColors = [];
    let allColors = [];
    
    // Extract all colors from products
    if (productItems && productItems.length > 0) {
      productItems.forEach((product) => {
        if (product.imageURLs && product.imageURLs.length > 0) {
          const colors = product.imageURLs
            .filter(item => item && item.color && item.color.name)
            .map(item => item.color);
            
          productColors = [...productColors, ...colors];
        }
      });
    }
    
    // Get unique product colors
    let uniqueProductColors = productColors.length > 0 
      ? [...new Map(productColors.filter(Boolean).map((color) => [color.name.toLowerCase(), color])).values()]
      : [];
    
    console.log('Unique product colors found:', uniqueProductColors.length, uniqueProductColors.map(c => c.name));
    
    // Merge with extended colors (prioritize product colors)
    const allColorNames = new Set(uniqueProductColors.map(c => c.name.toLowerCase()));
    
    // Start with product colors
    allColors = [...uniqueProductColors];
    
    // Add extended colors that aren't already in product colors
    EXTENDED_COLORS.forEach(color => {
      if (!allColorNames.has(color.name.toLowerCase())) {
        allColors.push(color);
      }
    });
    
    return allColors;
  };

  // Get product count for a specific color
  const getColorCount = (productItems, colorName) => {
    if (!productItems || !colorName) return 0;
    
    // Use the filtered products if provided, otherwise use all products
    const itemsToFilter = filteredProducts || productItems;
    
    return itemsToFilter
      .filter(p => p.imageURLs && p.imageURLs.length > 0)
      .filter(p => p.imageURLs.some(img => 
        img && img.color && img.color.name.toLowerCase() === colorName.toLowerCase()
      )).length;
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopColorLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError) {
    // Get all colors (from products + extended palette)
    const product_items = products?.data || [];
    const allColors = getAvailableColors(product_items);

    // If filtered products are provided, only show colors that are available in the filtered products
    const availableColorMap = new Map();
    
    if (filteredProducts && filteredProducts.length > 0) {
      // First collect all colors from filtered products
      const filteredColorNames = new Set();
      filteredProducts.forEach(p => {
        if (p.imageURLs && p.imageURLs.length > 0) {
          p.imageURLs.forEach(img => {
            if (img && img.color && img.color.name) {
              filteredColorNames.add(img.color.name.toLowerCase());
            }
          });
        }
      });
      
      // Mark which colors are available in filtered products
      allColors.forEach(color => {
        if (color && color.name) {
          availableColorMap.set(
            color.name.toLowerCase(), 
            filteredColorNames.has(color.name.toLowerCase())
          );
        }
      });
    } else {
      // If no filtered products, all colors are available
      allColors.forEach(color => {
        if (color && color.name) {
          availableColorMap.set(color.name.toLowerCase(), true);
        }
      });
    }

    content = allColors.map((item, i) => {
      if (item && item.name) {
        const colorCount = getColorCount(product_items, item.name);
        const isAvailable = availableColorMap.get(item.name.toLowerCase());
        
        // Skip colors with zero products if we're showing filtered results
        if (filteredProducts && colorCount === 0 && !isColorSelected(item.name)) {
          return null;
        }

        return (
          <li key={i}>
            <div className="tp-shop-widget-checkbox-circle">
              <input
                type="checkbox"
                id={item.name}
                checked={isColorSelected(item.name)}
                readOnly
              />
              <label
                onClick={() => handleColor(item.name)}
                htmlFor={item.name}
                className={!isAvailable ? "text-gray-400" : ""}
              >
                {item.name}
              </label>
              <span
                style={{ backgroundColor: `${item.clrCode}` }}
                className={`tp-shop-widget-checkbox-circle-self ${!isAvailable ? "opacity-50" : ""}`}
              ></span>
            </div>
            <span className="tp-shop-widget-checkbox-circle-number">
              {colorCount}
            </span>
          </li>
        );
      }
      return null;
    }).filter(Boolean);
  }

  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">Filter by Color</h3>
        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-checkbox-circle-list">
            <ul>{content}</ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorFilter;
