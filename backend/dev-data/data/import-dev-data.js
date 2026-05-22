const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./../../src/models/bookModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const books = JSON.parse(
  fs.readFileSync(`${__dirname}/books.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Book.create(books);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Book.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
