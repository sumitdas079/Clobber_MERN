import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails } from '../actions/orderActions'

const OrderScreen = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const cart = useSelector((state) => state.cart)

    const addDecimal = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }
    let ci = cart.cartItems
    cart.itemsPrice = addDecimal(ci.reduce((acc, item) => acc + item.price * item.qty, 0))
    cart.shippingPrice = addDecimal(cart.itemsPrice > 100 ? 0 : 100)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice)).toFixed(2)

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    useEffect(() => {
        dispatch(getOrderDetails(id))
    }, [dispatch, id])

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup vriant='flush'>

                        <ListGroup.Item>
                            <h2>Ordered Items</h2>
                            {order.orderItems.length === 0 ? <Message>Order is empty!</Message> :
                                (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) =>
                                        (<ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
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
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}, {order.shippingAddress.pincode}{' '}, {order.shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment</h2>
                            <strong>Method: </strong>
                            {order.paymentMethod}
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
                                    <Col>&#8377; {order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping Price:</Col>
                                    <Col>&#8377; {order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>&#8377; {order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item className='d-grid gap-2'>
                                <Button type='button' className='btn btn-lg' variant='dark' disabled={order.orderItems === 0}>Place Order</Button>
                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrderScreen