require('dotenv').config();

const connectDB = require('./config/db');

const Category = require('./model/Category');
const categoryData = require('./utils/categories');

const Products = require('./model/Products');
const productsData = require('./utils/products');

const Coupon = require('./model/Coupon');
const couponData = require('./utils/coupons');

const Order = require('./model/Order');
const orderData = require('./utils/orders');

const User = require('./model/User');
const userData = require('./utils/users');

const Reviews = require('./model/Review');
const reviewsData = require('./utils/reviews');

const Admin = require('./model/Admin');
const adminData = require('./utils/admin');

connectDB();
const importData = async () => {
  try {
    // Clear and import categories
    console.log('Importing categories...');
    await Category.deleteMany();
    await Category.insertMany(categoryData);
    console.log(`${categoryData.length} categories imported successfully!`);

    // Clear and import products
    console.log('Importing products...');
    await Products.deleteMany();
    await Products.insertMany(productsData);
    console.log(`${productsData.length} products imported successfully!`);

    // Clear and import coupons
    console.log('Importing coupons...');
    await Coupon.deleteMany();
    await Coupon.insertMany(couponData);
    console.log(`${couponData.length} coupons imported successfully!`);
    
    // Clear and import orders
    console.log('Importing orders...');
    await Order.deleteMany();
    await Order.insertMany(orderData);
    console.log(`${orderData.length} orders imported successfully!`);
    
    // Clear and import users
    console.log('Importing users...');
    await User.deleteMany();
    await User.insertMany(userData);
    console.log(`${userData.length} users imported successfully!`);
    
    // Clear and import reviews
    console.log('Importing reviews...');
    await Reviews.deleteMany();
    await Reviews.insertMany(reviewsData);
    console.log(`${reviewsData.length} reviews imported successfully!`);
    
    // Clear and import admins
    console.log('Importing admins...');
    await Admin.deleteMany();
    await Admin.insertMany(adminData);
    console.log(`${adminData.length} admins imported successfully!`);

    console.log('All data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Import Error:', error.message);
    if (error.code === 11000) {
      console.error('Duplicate key error. Check for duplicate IDs in your data files.');
    }
    process.exit(1);
  }
};

importData();
