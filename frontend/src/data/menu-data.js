import home_1 from '@assets/img/menu/menu-home-1.jpg';
import home_2 from '@assets/img/menu/menu-home-2.jpg';
import home_3 from '@assets/img/menu/menu-home-3.jpg';
import home_4 from '@assets/img/menu/menu-home-4.jpg';

const menu_data = [
  {
    id: 1,
    single_link: true,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    products: true,
    title: 'Products',
    link: '/shop',
    product_pages: [
      {
        title: 'Shop Page',
        link: '/shop',
        mega_menus: [
          { title: 'Only Categories', link: '/shop-category' },
          { title: 'Shop Grid with Sideber', link: '/shop' },
          { title: 'Product Details', link: '/product-details' },
        ]
      },
      {
        title: 'Products',
        link: '/product-details',
        mega_menus: [
          { title: 'Product Simple', link: '/product-details' },
          { title: 'With Video', link: '/product-details-video' },
          { title: 'With Countdown Timer', link: '/product-details-countdown' },
          { title: 'Variations Swatches', link: '/product-details-swatches' },
        ]
      },
      {
        title: 'eCommerce',
        link: '/shop',
        mega_menus: [
          { title: 'Shopping Cart', link: '/cart' },
          { title: 'Compare', link: '/compare' },
          { title: 'Wishlist', link: '/wishlist' },
          { title: 'Checkout', link: '/checkout' },
          { title: 'My account', link: '/profile' },
        ]
      },
      {
        title: 'More Pages',
        link: '/shop',
        mega_menus: [
          { title: 'Login', link: '/login' },
          { title: 'Register', link: '/register' },
          { title: 'Forgot Password', link: '/forgot' },
          { title: '404 Error', link: '/404' },
        ]
      },
    ]
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Shop',
    link: '/shop',
    sub_menus: [
      { title: 'Shop', link: '/shop' },
      { title: 'Right Sidebar', link: '/shop-right-sidebar' },
      { title: 'Hidden Sidebar', link: '/shop-hidden-sidebar' },
    ],
  },
  {
    id: 6,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  },
]

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    single_link: true,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    sub_menu: true,
    title: 'Products',
    link: '/shop',
    sub_menus: [
      { title: 'Shop', link: '/shop' },
      { title: 'Right Sidebar', link: '/shop-right-sidebar' },
      { title: 'Hidden Sidebar', link: '/shop-hidden-sidebar' },
      { title: 'Only Categories', link: '/shop-category' },
      { title: 'Product Simple', link: '/product-details' },
      { title: 'With Video', link: '/product-details-video' },
      { title: 'With Countdown Timer', link: '/product-details-countdown' },
      { title: 'Variations Swatches', link: '/product-details-swatches' },
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: 'eCommerce',
    link: '/cart',
    sub_menus: [
      { title: 'Shopping Cart', link: '/cart' },
      { title: 'Compare', link: '/compare' },
      { title: 'Wishlist', link: '/wishlist' },
      { title: 'Checkout', link: '/checkout' },
      { title: 'My account', link: '/profile' },
    ],
  },
  {
    id: 4,
    sub_menu: true,
    title: 'More Pages',
    link: '/login',
    sub_menus: [
      { title: 'Login', link: '/login' },
      { title: 'Register', link: '/register' },
      { title: 'Forgot Password', link: '/forgot' },
      { title: '404 Error', link: '/404' },
    ],
  }
]