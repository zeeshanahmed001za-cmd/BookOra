const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./../../src/models/orderModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

const cleanOrders = async () => {
  try {
    const count = await Order.countDocuments();
    console.log(`Found ${count} orders in the database.`);
    
    // Delete all orders
    await Order.deleteMany();
    console.log('All orders successfully deleted from DB!');
  } catch (err) {
    console.error('Error cleaning orders:', err);
  }
  process.exit();
};

cleanOrders();
