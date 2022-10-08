const asyncHandler = require('express-async-handler')
const stripe = require('stripe')

// @description     Get stripe secret
// @route           POST /api/orders/config/stripe-sk
// @access          Private
const getStripeSecret = asyncHandler(async(req, res) => {
    try {
        const paymentIntent = await stripe(process.env.STRIPE_SECRET_KEY)
        .paymentIntents.create({
            amount : req.body.amount,
            currency: req.body.currency,
            metadata: { integration_check: 'accept_a_payment' },
        })
        res.json({ client_secret: paymentIntent.client_secret})
    } catch (error) {
        console.log(error);
        res.json(500)
        throw new Error('Cannot connect Stripe')
    }
})

// @description     Get stripe pk
// @route           GET /api/orders/config/stripe-pk
// @access          Private
const getStripePublishable = asyncHandler(async(req, res) => {
    try {
        res.json({ public_key: process.env.STRIPE_PUBLISHABLE_KEY })
    } catch (error) {
        console.log(error);
        res.json(500)
        throw new Error('Cannot get Stripe_p_key')
    }
})

module.exports = { getStripeSecret, getStripePublishable }