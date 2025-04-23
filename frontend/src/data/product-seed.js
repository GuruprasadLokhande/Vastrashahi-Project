// Sample product data with proper color structure for debugging
const sampleProducts = [
  {
    _id: "color-test-1",
    title: "Red T-Shirt Sample",
    parent: "men",
    children: "t-shirts-polos",
    category: {
      name: "T-Shirts & Polos",
      children: ["T-Shirts & Polos"]
    },
    price: 499,
    discount: 10,
    quantity: 20,
    status: "in-stock",
    gender: "men",
    imageURLs: [
      {
        color: {
          name: "Red",
          clrCode: "#ff0000"
        },
        img: "/assets/img/product/product-1.jpg"
      },
      {
        color: {
          name: "Blue",
          clrCode: "#0000ff"
        },
        img: "/assets/img/product/product-2.jpg"
      }
    ]
  },
  {
    _id: "color-test-2",
    title: "Green Shirt Sample",
    parent: "men",
    children: "shirts",
    category: {
      name: "Shirts",
      children: ["Shirts"]
    },
    price: 799,
    discount: 5,
    quantity: 15,
    status: "in-stock",
    gender: "men",
    imageURLs: [
      {
        color: {
          name: "Green",
          clrCode: "#00ff00"
        },
        img: "/assets/img/product/product-3.jpg"
      },
      {
        color: {
          name: "Black",
          clrCode: "#000000"
        },
        img: "/assets/img/product/product-4.jpg"
      }
    ]
  },
  {
    _id: "color-test-3",
    title: "Yellow Dress Sample",
    parent: "women",
    children: "dresses-jumpsuits",
    category: {
      name: "Dresses & Jumpsuits",
      children: ["Dresses & Jumpsuits"]
    },
    price: 1299,
    discount: 15,
    quantity: 10,
    status: "in-stock",
    gender: "women",
    imageURLs: [
      {
        color: {
          name: "Yellow",
          clrCode: "#ffff00"
        },
        img: "/assets/img/product/product-5.jpg"
      },
      {
        color: {
          name: "Pink",
          clrCode: "#ff00ff"
        },
        img: "/assets/img/product/product-6.jpg"
      }
    ]
  },
  {
    _id: "bag-test-1",
    title: "Brown Handbag",
    parent: "bags",
    children: "handbag",
    category: {
      name: "HandBag",
      children: ["HandBag"]
    },
    price: 1999,
    discount: 10,
    quantity: 8,
    status: "in-stock",
    imageURLs: [
      {
        color: {
          name: "Brown",
          clrCode: "#a52a2a"
        },
        img: "/assets/img/product/product-7.jpg"
      }
    ]
  },
  {
    _id: "bag-test-2",
    title: "Pink Ladies Purse",
    parent: "bags",
    children: "ladies-purchase",
    category: {
      name: "Ladies purchase",
      children: ["Ladies purchase"]
    },
    price: 1299,
    discount: 5,
    quantity: 15,
    status: "in-stock",
    imageURLs: [
      {
        color: {
          name: "Pink",
          clrCode: "#ff69b4"
        },
        img: "/assets/img/product/product-8.jpg"
      }
    ]
  },
  {
    _id: "bag-test-3",
    title: "Navy Blue Travel Bag",
    parent: "bags",
    children: "traveling-bag",
    category: {
      name: "Traveling Bag",
      children: ["Traveling Bag"]
    },
    price: 2499,
    discount: 0,
    quantity: 5,
    status: "in-stock",
    imageURLs: [
      {
        color: {
          name: "Navy",
          clrCode: "#000080"
        },
        img: "/assets/img/product/product-9.jpg"
      }
    ]
  }
];

export default sampleProducts; 