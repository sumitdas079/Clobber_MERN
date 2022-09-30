const express = require('express')
const router = express.Router()
const { addOrderItems, getOrderById, updateOrderPaid, stripePayment } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, addOrderItems)
router.route('/stripe-payment').post(stripePayment)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderPaid)

module.exports = router