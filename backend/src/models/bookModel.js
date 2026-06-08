const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A book must have a title'],
    trim: true,
    maxlength: [100, 'A book title must have less or equal then 100 characters']
  },
  author: {
    type: String,
    required: [true, 'A book must have an author'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A book must have a price']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A book must have a description']
  },
  category: {
    type: String,
    required: [true, 'A book must have a category'],
    enum: {
      values: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children', 'Self Help', 'Sci-Fi', 'Romance', 'Mystery', 'General'],
      message: 'Category is either: Fiction, Non-Fiction, Science, History, Biography, Children, Self Help, Sci-Fi, Romance, Mystery, General'
    }
  },
  stock: {
    type: Number,
    required: [true, 'A book must have a stock count'],
    default: 0
  },
  coverId: {
    type: Number,
    default: null
  },
  cover: {
    type: String,
    default: ''
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for high performance querying, sorting, and searching
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ ratingsAverage: -1 });
bookSchema.index({ isBestseller: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

