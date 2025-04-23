// electronic
import blog_1 from "@assets/img/blog/blog-1.jpg";
import blog_2 from "@assets/img/blog/blog-2.jpg";
import blog_3 from "@assets/img/blog/blog-3.jpg";
// fashion
import blog_4 from '@assets/img/blog/2/blog-1.jpg';
import blog_5 from '@assets/img/blog/2/blog-2.jpg';
import blog_6 from '@assets/img/blog/2/blog-3.jpg';
// blog postbox 
import blog_post_1 from '@assets/img/blog/blog-big-3.jpg';
import blog_post_2 from '@assets/img/blog/blog-big-2.jpg';
import blog_post_3 from '@assets/img/blog/blog-big-4.jpg';
import blog_post_4 from '@assets/img/blog/blog-big-5.jpg';
import blog_post_5 from '@assets/img/blog/blog-big-6.jpg';
// blog grid 
import blog_grid_1 from '@assets/img/blog/grid/blog-grid-1.jpg';
import blog_grid_2 from '@assets/img/blog/grid/blog-grid-2.jpg';
import blog_grid_3 from '@assets/img/blog/grid/blog-grid-3.jpg';
import blog_grid_4 from '@assets/img/blog/grid/blog-grid-4.jpg';
import blog_grid_5 from '@assets/img/blog/grid/blog-grid-5.jpg';
import blog_grid_6 from '@assets/img/blog/grid/blog-grid-6.jpg';
import blog_grid_7 from '@assets/img/blog/grid/blog-grid-7.jpg';
import blog_grid_8 from '@assets/img/blog/grid/blog-grid-8.jpg';
// list img 
import list_img_1 from '@assets/img/blog/grid/blog-grid-1.jpg';
import list_img_2 from '@assets/img/blog/grid/blog-grid-2.jpg';
import list_img_3 from '@assets/img/blog/grid/blog-grid-3.jpg';
import list_img_4 from '@assets/img/blog/grid/blog-grid-4.jpg';
import list_img_5 from '@assets/img/blog/grid/blog-grid-5.jpg';
import list_img_6 from '@assets/img/blog/grid/blog-grid-6.jpg';
import list_img_7 from '@assets/img/blog/grid/blog-grid-2.jpg';
import list_img_8 from '@assets/img/blog/grid/blog-grid-3.jpg';

const blogData = [
  {
    id: 1,
    img: blog_1,
    date: "14 January, 2023",
    author:'Mark Smith',
    title: "The Modern Art Clay Ceramics.",
    tags: ["Tablet", "News"],
    category:'electronics',
    comments:2,
    sm_desc:
      "The world is an amazing place providing an incredible assortment of interesting locations across.",
    blog: "electronics",
  },
  {
    id: 2,
    img: blog_2,
    date: "18 February, 2023",
    author:'Naim Ahmed',
    title: "How clothes are linked to climate",
    tags: ["Monitor", "Technology"],
    category:'electronics',
    comments:4,
    sm_desc:
      "The world is an amazing place providing an incredible assortment of interesting locations across.",
    blog: "electronics",
  },
  {
    id: 3,
    img: blog_3,
    date: "20 January, 2023",
    author:'Salim Rana',
    title: "The Sound Of Fashion: Malcolm",
    tags: ["Microphone", "Computer"],
    category:'electronics',
    comments:5,
    sm_desc:
      "The world is an amazing place providing an incredible assortment of interesting locations across.",
    blog: "electronics",
  },
  // fashion blog
  {
    id: 4,
    img: blog_4,
    date: "20 July, 2023",
    author:'John Smith',
    title: "The 'Boomerang' Employees Returning After Quitting",
    tags: ["Fashion", "Lift Style","News"],
    category:'fashion',
    comments:6,
    sm_desc:
      "The world is an amazing place providing an incredible assortment of interesting locations across.",
    blog: "fashion",
  },
  {
    id: 5,
    img: blog_5,
    date: "18 March, 2023",
    author:'John Smith',
    title: "Fast fashion: How clothes are linked to climate change",
    tags: ["Fashion", "Lift Style","News"],
    category:'fashion',
    comments:3,
    sm_desc:
      "The world is an amazing place providing an incredible assortment of interesting locations across.",
    blog: "fashion",
  },
  {
    id: 6,
    img: blog_6,
    date: "15 February, 2023",
    author:'John Smith',
    title: "The Sound Of Fashion: Malcolm McLaren Words",
    tags: ["Fashion", "Lift Style","News"],
    category:'fashion',
    comments:8,
    sm_desc:
      "The world is an amazing place providing an incredible assortment of interesting locations across.",
    blog: "fashion",
  },
  //postbox blog
  {
    id:7,
    img:blog_post_1,
    date:'July 21, 2023',
    author:'Vastrashahi',
    comments:12,
    tags: ["Traditional", "Indian Fashion", "Culture"],
    category:'Vastrashahi',
    title:"Vastrashahi's Traditional Clothing Collection: Celebrating Maharashtra's Rich Heritage",
    desc:"Vastrashahi proudly presents our exclusive collection of traditional Maharashtrian attire. Our latest lineup features authentic nine-yard sarees, elegant Paithani weaves, and traditional jewelry that embodies the cultural richness of Maharashtra. Each piece in our collection has been carefully curated to preserve traditional craftsmanship while incorporating modern design elements that appeal to today's fashion-conscious individuals. Visit our store to experience the perfect blend of heritage and contemporary style.",
    blog:'blog-postbox'
  },
  {
    id:8,
    img:blog_post_2,
    date:'August 15, 2023',
    author:'Vastrashahi',
    comments:8,
    tags: ["Wedding", "Bridal Collection", "Festive Wear", "Fashion"],
    category:'Vastrashahi',
    title:"Introducing Vastrashahi's Wedding Collection: Where Tradition Meets Elegance",
    desc:"Our newest wedding collection showcases the perfect fusion of traditional craftsmanship and contemporary elegance. From exquisitely embroidered bridal lehengas to sophisticated sherwanis for grooms, each piece is designed to make your special day memorable. The collection features hand-embroidered details, premium fabrics, and timeless silhouettes that honor Indian heritage while embracing modern aesthetics. Vastrashahi's wedding attire is not just clothing - it's an embodiment of cultural celebration designed for the modern couple.",
    blog:'blog-postbox'
  },
  {
    id:9,
    img:blog_post_3,
    date:'September 10, 2023',
    author:'Vastrashahi',
    comments:6,
    tags: ["Fashion", "Traditional", "Seasonal"],
    category:'Vastrashahi',
    title:"The Art of Draping: Traditional Saree Styles From Across Maharashtra",
    desc:"Discover the diverse saree draping styles unique to different regions of Maharashtra. From the graceful Nauvari to the elegant Kasta style, each draping technique tells a story of regional identity and cultural significance. In this article, we explore the history behind these traditional styles and provide step-by-step instructions for achieving these timeless looks. Our team has researched and documented these techniques to help preserve these cultural practices for future generations.",
    blog:'blog-postbox'
  },
  {
    id:10,
    img:blog_post_4,
    date:'October 5, 2023',
    author:'Vastrashahi',
    comments:9,
    tags: ["Fashion", "Sustainability", "Traditional", "Clothing"],
    category:'Vastrashahi',
    title:"Sustainable Fashion: How Vastrashahi is Reviving Traditional Textile Crafts",
    desc:"At Vastrashahi, sustainability isn't just a trend—it's rooted in our traditional practices. Learn how we're working with local artisans to revive ancient textile techniques that are inherently sustainable. From natural dyeing processes to handloom weaving, these traditional methods minimize environmental impact while creating unique, high-quality garments. By choosing traditional craftsmanship, we're preserving cultural heritage while promoting ethical fashion choices for conscious consumers.",
    blog:'blog-postbox'
  },
  {
    id:11,
    img:blog_post_5,
    date:'November 12, 2023',
    author:'Vastrashahi',
    comments:4,
    tags: ["Fashion", "Festival", "Traditional", "Clothing"],
    category:'Vastrashahi',
    title:"Festive Fashion Guide: Traditional Attire for Maharashtra's Cultural Celebrations",
    desc:"Prepare for Maharashtra's vibrant festival season with our comprehensive guide to traditional festive attire. From Ganesh Chaturthi to Gudi Padwa, each celebration calls for specific colors, styles, and accessories that honor cultural traditions. This guide features styling tips, fabric recommendations, and the cultural significance behind festival-specific clothing choices. Let Vastrashahi help you celebrate these special occasions with authentic traditional garments that connect you to Maharashtra's rich cultural heritage.",
    blog:'blog-postbox'
  },
  {
    id:21,
    img:blog_grid_7,
    date:'December 15, 2023',
    author:'Vastrashahi',
    comments:7,
    tags: ["Fashion", "Traditional", "Jewelry", "Clothing"],
    category:'Vastrashahi',
    title:"The History and Significance of Traditional Maharashtrian Jewelry",
    desc:"Explore the exquisite world of traditional Maharashtrian jewelry and its cultural importance. From the distinctive Nath (nose ring) to elaborate Thushi necklaces and Kolhapuri Saaj, each piece carries deep cultural significance and showcases remarkable craftsmanship. This article traces the evolution of these jewelry styles through history and explains how they complement traditional clothing. Discover how Vastrashahi is working with local artisans to preserve these ancient jewelry-making techniques.",
    blog:'blog-postbox'
  },
  {
    id:22,
    img:blog_grid_8,
    date:'January 20, 2024',
    author:'Vastrashahi',
    comments:11,
    tags: ["Fashion", "Modern", "Traditional", "Clothing"],
    category:'Vastrashahi',
    title:"Modern Interpretations of Traditional Attire: Fusion Fashion at Vastrashahi",
    desc:"Witness the beautiful evolution of traditional Maharashtrian clothing for contemporary lifestyles. Our fusion collection combines classic elements with modern silhouettes, creating versatile pieces that honor heritage while fitting seamlessly into today's wardrobes. From office-appropriate kurtas to casual weekend wear with traditional motifs, discover how Vastrashahi is making traditional fashion relevant for younger generations without compromising cultural authenticity.",
    blog:'blog-postbox'
  },
  {
    id:23,
    img:blog_grid_1,
    date:'February 8, 2024',
    author:'Vastrashahi',
    comments:5,
    tags: ["Fashion", "Textile", "Traditional", "Clothing", "Handloom"],
    category:'Vastrashahi',
    title:"The Magic of Handloom: Celebrating Maharashtra's Textile Heritage",
    desc:"Delve into the rich tradition of handloom textiles that forms the foundation of Maharashtra's clothing heritage. This article explores the distinctive weaving techniques, regional variations, and the dedicated artisans who keep these traditions alive. Learn about iconic fabrics like Paithani silk, Narayan Peth, and Karvat Kathi, and understand the meticulous process behind creating these textiles. At Vastrashahi, we're proud to showcase these fabrics in our collections and support the skilled weavers who create them.",
    blog:'blog-postbox'
  },
  // blog grid data 
  {
    id:12,
    img:blog_grid_1,
    list_img:list_img_1,
    date:'January 8, 2023',
    author:'John Smith',
    comments:5,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Hiring the Right Sales Team at the Right Time',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:13,
    img:blog_grid_2,
    list_img:list_img_2,
    date:'February 12, 2023',
    author:'Salim Rana',
    comments:0,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Fully Embrace the Return of 90s fashion',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:14,
    img:blog_grid_3,
    list_img:list_img_3,
    date:'March 15, 2023',
    author:'John Smith',
    comments:12,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Exploring the English Countryside',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:15,
    img:blog_grid_4,
    list_img:list_img_4,
    date:'April 7, 2023',
    author:'John Smith',
    comments:8,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:"Here's the First Valentino's New Makeup Collection",
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:16,
    img:blog_grid_5,
    list_img:list_img_5,
    date:'May 2, 2023',
    author:'John Smith',
    comments:4,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Follow Your own Design process, whatever gets',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:17,
    img:blog_grid_6,
    list_img:list_img_6,
    date:'April 5, 2023',
    author:'John Smith',
    comments:6,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:"Freelancer Days 2022, What's new?",
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:18,
    img:blog_grid_7,
    list_img:list_img_7,
    date:'May 12, 2023',
    author:'John Smith',
    comments:6,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:'Hiring the Right Sales Team at the Right Time',
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
  {
    id:19,
    img:blog_grid_8,
    list_img:list_img_8,
    date:'March 22, 2023',
    author:'John Smith',
    comments:15,
    tags: ["Fashion", "Lift Style","News"],
    category:'Beauty',
    title:"Quality Foods Requirments For Every Human Body's",
    desc:'Cursus mattis sociis natoque penatibus et magnis montes,nascetur ridiculus.',
    blog:'blog-grid'
  },
];

export default blogData;
