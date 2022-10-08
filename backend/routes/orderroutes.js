const express = require('express')
const router = express.Router()
const { addOrderItems, getOrderById, updateOrderPaid, getMyOrders } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

// @desc   create a new order, get all orders
// @route  GET /api/orders
// @access PRIVATE && PRIVATE/ADMIN
router.route('/').post(protect, addOrderItems)

// @desc   fetch the orders of the user logged in
// @route  GET /api/orders/myorders
// @access PRIVATE 
router.route('/myorders').get(protect, getMyOrders)

// @desc   get an order by id
// @route  GET /api/orders/:id
// @access PRIVATE
router.route('/:id').get(protect, getOrderById)

// @desc   update the order object once paid
// @route  PUT /api/orders/:id/pay
// @access PRIVATE
router.route('/:id/pay').put(protect, updateOrderPaid)

module.exports = router