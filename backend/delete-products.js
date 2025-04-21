require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./model/Products');
const Category = require('./model/Category');

connectDB(); // Connect to the database using the project's connection method

const deleteAllProducts = async () => {
  try {
    console.log('Deleting all products and updating categories...');
    
    // Get all categories to reset their products arrays
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories. Updating them to have empty products arrays.`);
    
    // Update each category to have an empty products array
    for (const category of categories) {
      category.products = [];
      await category.save();
    }
    console.log('All categories updated with empty products arrays.');

    // Delete all products
    const result = await Product.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} products from the database.`);
    
    console.log('All products deleted successfully!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Execute the function
deleteAllProducts(); 