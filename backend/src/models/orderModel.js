const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user.']
  },
  items: [
    {
      book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: [true, 'Order item must have a book.']
      },
      quantity: {
        type: Number,
        required: [true, 'Order item must have a quantity.'],
        default: 1
      },
      price: {
        type: Number,
        required: [true, 'Order item must have a price.']
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: [true, 'Order must have a total price.']
  },
  shippingAddress: {
    type: String,
    required: [true, 'Order must have a shipping address.']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'items.book',
    select: 'title author price'
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
