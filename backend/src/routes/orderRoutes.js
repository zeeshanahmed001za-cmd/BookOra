const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);

router.use(authController.restrictTo('admin'));

router.get('/', orderController.getAllOrders);
router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrderStatus);

module.exports = router;
