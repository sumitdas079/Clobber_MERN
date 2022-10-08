import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { CART_RESET } from '../constants/cartConstant'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector((state) => state.cart)
    const { cartItems, shippingAddress, paymentMethod } = cart

    const addDecimal = (num) => {
        return (Math.round(num*100)/100).toFixed(2)
    }
    const ci = cart.cartItems
    cart.itemsPrice = addDecimal(ci.reduce((acc, item) => acc + item.price * item.qty, 0))
    cart.shippingPrice = addDecimal(cart.itemsPrice > 5000 ? 300 : 100)
    cart.totalPrice = (Number(cart.itemsPrice)+Number(cart.shippingPrice)).toFixed(2)

    const orderCreate = useSelector((state) => state.orderCreate)
    const { order, success, error } = orderCreate

/*     const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin */

    useEffect(() => {
        if(success){
            localStorage.removeItem('cartItems')
            dispatch({ type: CART_RESET, payload: shippingAddress})
            navigate(`/orders/${order._id}`)
        }
        
    },[navigate,dispatch,success,shippingAddress,order])

    const placeOrderHandler = (e) => {
        e.preventDefault()
        dispatch(createOrder({
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice,
        }))
        console.log('placed order');
    }
    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>

                        <ListGroup.Item>
                            <h2>Ordered Items</h2>
                            {cart.cartItems.length === 0 ? <Message>Your cart is empty!</Message> :
                                (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) =>
                                        (<ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col><Link className='text-decoration-none' to={`/product/${item.product}`}>{item.name}</Link></Col>
                                                <Col md={4}>
                                                    {item.qty} x &#8377; {item.price} = &#8377; {item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>))}
                                    </ListGroup>
                                )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {shippingAddress.address}, {shippingAddress.city}{' '}, {shippingAddress.pincode}{' '}, {shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment</h2>
                            <strong>Method: </strong>
                            {paymentMethod}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>&#8377; {cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping Price:</Col>
                                    <Col>&#8377; {cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>&#8377; {cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item className='d-grid gap-2'>
                                <Button type='button' className='btn btn-lg' variant='dark' disabled={cart.cartItems === 0} onClick={placeOrderHandler}>Place Order</Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen