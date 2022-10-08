const express = require('express')
const  { getStripeSecret, getStripePublishable } = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/config/stripe-pk').get(getStripePublishable)
router.route('/config/stripe-payment-intent').post(getStripeSecret)

module.exports = router