const dotenv = require('dotenv').config()
const asyncHandler = require('express-async-handler')
const Order = require('../models/OrderModel')
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_KEY)

// @desc     Create new order
// @route    POST /api/orders
// @access   Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No ordered items')
        return
    } else {
        const order = new Order({ orderItems, user: req.user._id, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})


// @desc     GET Order by Id
// @route    GET /api/orders/:id
// @access   Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})


// @desc     Update Order to paid
// @route    GET /api/orders/:id/pay
// @access   Private
const updateOrderPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
        const { paymentMode } = req.body
        order.isPaid = true
        order.paidAt = Date.now()
        if(paymentMode==='paypal')
        {
            order.paymentResult = {
                type:'paypal',
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address
            }
        }
        else if(paymentMode==='stripe')
        {
            order.paymentResult = {
                type: 'stripe',
                id: req.body.id,
                status: req.body.status,
                email_address: req.body.payer.email_address
            }
        }
        const updatedOrder = await order.save()
        res.status(201).json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc  create payment intent for stripe payment
// @route POST /api/orders/stripe-payment
// @access PUBLIC
const stripePayment = asyncHandler(async (req,res) => {
    const {price, email} = req.body
    const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency: 'inr',
        receipt_email: email,
        payment_method_types: ['card']
    })
    res.send({ clientSecret: paymentIntent.client_secret})
})

module.exports = { addOrderItems, getOrderById, updateOrderPaid, stripePayment }