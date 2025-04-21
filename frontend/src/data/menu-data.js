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
    title: 'Men',
    link: '/shop',
    product_pages: [
      {
        title: 'Men\'s Fashion',
        link: '/shop',
        mega_menus: [
          { title: 'T-Shirts & Polos', link: '/shop?category=t-shirts-polos&gender=men' },
          { title: 'Shirts', link: '/shop?category=shirts&gender=men' },
          { title: 'Jeans & Trousers', link: '/shop?category=jeans-trousers&gender=men' },
          { title: 'Kurtas & Ethnic Wear', link: '/shop?category=ethnic-wear&gender=men' },
          { title: 'Jackets & Hoodies', link: '/shop?category=jackets-hoodies&gender=men' }
        ]
      }
    ]
  },
  {
    id: 3,
    products: true,
    title: 'Women',
    link: '/shop',
    product_pages: [
      {
        title: 'Women\'s Fashion',
        link: '/shop',
        mega_menus: [
          { title: 'Sarees & Ethnic Wear', link: '/shop?category=ethnic-wear&gender=women' },
          { title: 'Kurtis & Tunics', link: '/shop?category=kurtis-tunics&gender=women' },
          { title: 'Tops & T-Shirts', link: '/shop?category=tops-tshirts&gender=women' },
          { title: 'Dresses & Jumpsuits', link: '/shop?category=dresses-jumpsuits&gender=women' },
          { title: 'Leggings & Palazzos', link: '/shop?category=leggings-palazzos&gender=women' }
        ]
      }
    ]
  },
  {
    id: 4,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  }
];

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
    title: 'Men',
    link: '/shop',
    sub_menus: [
      { title: 'T-Shirts & Polos', link: '/shop?category=t-shirts-polos&gender=men' },
      { title: 'Shirts', link: '/shop?category=shirts&gender=men' },
      { title: 'Jeans & Trousers', link: '/shop?category=jeans-trousers&gender=men' },
      { title: 'Kurtas & Ethnic Wear', link: '/shop?category=ethnic-wear&gender=men' },
      { title: 'Jackets & Hoodies', link: '/shop?category=jackets-hoodies&gender=men' }
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Women',
    link: '/shop',
    sub_menus: [
      { title: 'Sarees & Ethnic Wear', link: '/shop?category=ethnic-wear&gender=women' },
      { title: 'Kurtis & Tunics', link: '/shop?category=kurtis-tunics&gender=women' },
      { title: 'Tops & T-Shirts', link: '/shop?category=tops-tshirts&gender=women' },
      { title: 'Dresses & Jumpsuits', link: '/shop?category=dresses-jumpsuits&gender=women' },
      { title: 'Leggings & Palazzos', link: '/shop?category=leggings-palazzos&gender=women' }
    ],
  },
  {
    id: 4,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  }
];