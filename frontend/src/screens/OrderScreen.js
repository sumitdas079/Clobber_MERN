import React, { useEffect } from 'react'
import axios from 'axios'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../constants/orderConstant'
import CheckoutFormStripe from '../components/CheckoutFormStripe'
import getDateString from '../utils/getDateString'


const stripePromise = axios.get('/api/payments/config/stripe-pk')
    .then((res) => res.data)
    .then((data) => loadStripe(data.public_key))

const OrderScreen = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    /* const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver */

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    if (!loading) {
        const addDecimal = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }
        const od = order.orderItems
        order.itemsPrice = addDecimal(od.reduce((acc, item) => acc + item.price * item.qty, 0))
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
        if (!order || order._id !== id || successPay) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch(getOrderDetails(id))
        }
    }, [order, userInfo, id, dispatch, navigate, successPay])


    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult);
        dispatch(payOrder(id, paymentResult))
    }

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='secondary'>{error}</Message>
    ) : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Ordered Items</h2>
                            {order.orderItems.length === 0 ? <Message>No orders found!</Message> :
                                (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) =>
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
                                <strong>Name: </strong>
                                {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{' '}
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>{' '}
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}, {order.shippingAddress.pincode}{' '}, {order.shippingAddress.country}
                            </p>
                            <div>
                                {order.isDelivered ? (<Message variant='success'>Delivered on {getDateString(order.deliveredAt)}</Message>) : (<Message variant='secondary'>Not Delivered</Message>)}
                            </div>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            <div>
                                {order.isPaid ? (<Message variant='success'>Paid on {getDateString(order.paidAt)}</Message>) : (<Message variant='secondary'>Not paid</Message>)}
                            </div>
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
                            {!order.isPaid && (

                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {
                                        <Elements stripe={stripePromise}>
                                            <CheckoutFormStripe totalPrice={order.totalPrice * 100} paymentHandler={successPaymentHandler} />
                                        </Elements>
                                    }
                                </ListGroup.Item>

                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default OrderScreen