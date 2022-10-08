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
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.created,
            payment_method: req.body.payment_method,
        }
        const updatedOrder = await order.save()
        res.status(201).json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})


// @desc     Get logged in user's orders
// @route    GET /api/orders/myorders
// @access   Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt')
    res.json(orders)
})



module.exports = { addOrderItems, getOrderById, updateOrderPaid, getMyOrders }